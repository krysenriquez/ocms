from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .serializers import *
from .models import *
from accounts.models import Account, AvatarInfo
from django.db.models import Q, Prefetch, F, Value as V
from django.db.models.functions import Concat
from difflib import SequenceMatcher
from accounts.enums import AccountStatus


class CheckUsernameView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        username = self.request.query_params.get("username")
        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response(
                data={"message": "Username available.", "exists": False}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                data={"message": "Sorry, Username already exists.", "exists": True},
                status=status.HTTP_409_CONFLICT,
            )


class ChangeUsernameView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        username = self.request.query_params.get("username")
        userId = self.request.query_params.get("user_id")

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response(
                data={"message": "Username available.", "exists": False}, status=status.HTTP_200_OK
            )
        else:
            if str(user.pk) != userId:
                return Response(data={"message": "Sorry, Username already exists.", "exists": True})
            else:
                return Response(
                    data={"message": "Retaining Username.", "exists": False},
                    status=status.HTTP_409_CONFLICT,
                )


class CheckEmailAddressView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        email_address = self.request.query_params.get("email_address")
        try:
            validate_email(email_address)
            try:
                user = CustomUser.objects.get(email_address=email_address)
            except CustomUser.DoesNotExist:
                return Response(
                    data={"message": "Email Address Available", "exists": False},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    data={"message": "Sorry, Email Address already exists.", "exists": True},
                    status=status.HTTP_409_CONFLICT,
                )
        except ValidationError:
            return Response(
                data={"message": "Please enter a valid Email Address Format.", "exists": True},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ChangeEmailAddressView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        email_address = self.request.query_params.get("email_address")
        userId = self.request.query_params.get("user_id")

        try:
            validate_email(email_address)
            try:
                user = CustomUser.objects.get(email_address=email_address)
            except CustomUser.DoesNotExist:
                return Response(
                    data={"message": "Email Address Available", "exists": False},
                    status=status.HTTP_200_OK,
                )
            else:
                if str(user.pk) != userId:
                    return Response(
                        data={"message": "Sorry, Email Address already exists.", "exists": True},
                        status=status.HTTP_409_CONFLICT,
                    )
                else:
                    return Response(
                        data={"message": "Retaining Email Address.", "exists": False},
                        status=status.HTTP_200_OK,
                    )
        except ValidationError:
            return Response(
                data={"message": "Please enter a valid Email Address Format.", "exists": True},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ChangePassword(views.APIView):
    model = CustomUser
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, request, queryset=None):
        user = CustomUser.objects.get(id=request)
        return user

    def put(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.data.get("user")
            currentPassword = serializer.data.get("current_password")
            self.object = self.get_object(user)
            if not self.object.check_password(currentPassword):
                return Response(
                    data={"message": "Invalid Current Password."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            self.object.set_password(serializer.data.get("newPassword"))
            self.object.save()
            return Response(data={"message": "Password Updated."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPassword(views.APIView):
    model = CustomUser
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, request, queryset=None):
        user = CustomUser.objects.get(id=request)
        return user

    def put(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.data.get("user")
            self.object = self.get_object(user)

            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response(data={"message": "Password Updated."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordValidation(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        username = (self.request.query_params.get("username"),)
        emailAddress = self.request.query_params.get("email_address")
        password = self.request.query_params.get("password")
        max_similarity = 0.7
        if SequenceMatcher(password.lower(), username.lower()).quick_ratio() > max_similarity:
            return Response(
                data={"message": "The password is too similar to the username.", "similar": True},
                status=status.HTTP_403_FORBIDDEN,
            )
        if SequenceMatcher(password.lower(), emailAddress.lower()).quick_ratio() > max_similarity:
            return Response(
                data={"message": "The password is too similar to the email.", "similar": True},
                status=status.HTTP_403_FORBIDDEN,
            )


class UserAccountViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserAccountSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = CustomUser.objects.exclude(is_active=False)
        user = self.request.user.id

        if user is not None:
            queryset = (
                queryset.prefetch_related(
                    Prefetch(
                        "account_user",
                        queryset=Account.objects.annotate(
                            account_name=Concat(F("first_name"), V(" "), F("last_name"))
                        )
                        .filter(is_deleted=False, account_status=AccountStatus.ACTIVE)
                        .order_by("id"),
                    )
                )
                .filter(id=user)
                .exclude(is_active=False)
            )

            return queryset


class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = CustomUser.objects.exclude(is_active=False)
        user_id = self.request.query_params.get("user_id", None)

        if user_id is not None:
            queryset = queryset.filter(user_id=user_id).exclude(is_active=False)

            return queryset


class UserLogsViewSet(ModelViewSet):
    queryset = UserLogs.objects.all()
    serializer_class = UserLogsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = UserLogs.objects.order_by("-id")
        content_type = self.request.query_params.get("content_type", None)
        object_id = self.request.query_params.get("object_id", None)
        user = self.request.query_params.get("user", None)

        if content_type is not None:
            queryset = queryset.filter(content_type=content_type, object_id=object_id)

        if user is not None:
            queryset = queryset.filter(user=user)

        return queryset


class ContentTypeViewSet(ModelViewSet):
    queryset = ContentType.objects.all()
    serializer_class = ContentTypeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = ContentType.objects.all()
        model = self.request.query_params.get("model", None)

        if model is not None:
            queryset = queryset.filter(model=model)

        return queryset
