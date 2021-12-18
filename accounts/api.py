from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.db.models import Q, Prefetch, F, Value as V, query
from django.db.models.functions import Concat
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from .serializers import *
from .models import *
from .enums import *


class AccountViewSet(ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id", None)

        if user_id is not None:
            queryset = Account.objects.filter(user_id=user_id).exclude(is_active=False)
            if queryset.exists():
                return queryset
        else:
            return Response(
                data={"message": "Account not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class CreateAccountView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        processed_request, code = process_create_account_request(request)
        serializer = AccountSerializer(data=processed_request)

        if serializer.is_valid():
            new_member = serializer.save()
            code.update_status()
            comp_plan(request, new_member)
            return Response(data={"message": "Account created."}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(
                data={"message": "Unable to create Account."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GenealogyAccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = GenealogyAccountSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = (
            Account.objects.prefetch_related(
                Prefetch(
                    "children",
                    queryset=Account.objects.prefetch_related(
                        Prefetch(
                            "children",
                            queryset=Account.objects.prefetch_related(
                                Prefetch(
                                    "children",
                                    queryset=Account.objects.prefetch_related(
                                        Prefetch(
                                            "children",
                                            queryset=Account.objects.order_by("parent_side").all(),
                                        )
                                    )
                                    .order_by("parent_side")
                                    .all(),
                                )
                            )
                            .order_by("parent_side")
                            .all(),
                        )
                    )
                    .order_by("parent_side")
                    .all(),
                ),
            )
            .annotate(
                account_name=Concat(F("first_name"), V(" "), F("middle_name"), V(" "), F("last_name")),
            )
            .all()
        )

        account_id = self.request.query_params.get("account_id", None)

        if account_id is not None:
            queryset = queryset.filter(account_id=account_id)

            for member in queryset:
                member.all_left_children_count = len(
                    member.get_all_children_side(parent_side=ParentSide.LEFT)
                )
                member.all_right_children_count = len(
                    member.get_all_children_side(parent_side=ParentSide.RIGHT)
                )

            return queryset


class GenerateCodeView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.pk
        serializer = GenerateCodeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(data={"message": "Code generated."}, status=status.HTTP_201_CREATED)
        else:
            return Response(
                data={"message": "Unable to generate code."},
                status=status.HTTP_404_NOT_FOUND,
            )


class CodeViewSet(ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Code.objects.exclude(is_deleted=True)
        account_id = self.request.query_params.get("account_id", None)

        if account_id is not None:
            queryset = queryset.filter(account__account_id=account_id).order_by("status")

            return queryset


class VerifySponsorCodeView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        # Parent of the Add Member, account is the ID of the sponsor
        code_type = request.data.get("code_type")
        code = request.data.get("code")
        parent = request.data.get("parent")

        try:
            activation_code = Code.objects.get(code_type=code_type, code=code)
            activation_code.update_status()
        except Code.DoesNotExist:
            return Response(
                data={"message": code_type.title() + " Code does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            upline = Account.objects.get(id=parent)
        except Account.DoesNotExist:
            return Response(
                data={"message": "Upline Account does Not Exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if activation_code.account:
            try:
                sponsor = Account.objects.get(pk=activation_code.account.pk)
                children = sponsor.get_all_children()
            except Account.DoesNotExist:
                return Response(
                    data={"message": "Sponsor Account does Not Exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                data={"message": code_type.title() + " Code " + code + " not linked to any Account."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if upline in children or sponsor == upline:
            if activation_code.status == CodeStatus.DEACTIVATED:
                return Response(
                    data={
                        "message": code_type.title() + " Code already expired.",
                    },
                    status=status.HTTP_410_GONE,
                )
            elif activation_code.status == CodeStatus.USED:
                return Response(
                    data={
                        "message": code_type.title() + " Code already been used.",
                    },
                    status=status.HTTP_409_CONFLICT,
                )
            else:
                return Response(
                    data={
                        "message": code_type.title() + " Code valid.",
                        "sponsor": str(sponsor.id).zfill(5),
                        "sponsor_name": sponsor.first_name + " " + sponsor.last_name,
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                data={
                    "message": code_type.title() + " Code could only be used on Direct Downlines.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )


# NOTE REMOVED THIS TEST API
# Test
from .services import *
from django.shortcuts import get_object_or_404


class TestView(views.APIView):
    def post(self, request, *args, **kwargs):
        account = request.data.get("account", None)
        if account is not None:
            new_member = get_object_or_404(Account, id=account)
            comp_plan(request, new_member)
            # create_referral_activity(request, new_member.referrer, new_member)
            return Response(
                data={"response": status.HTTP_200_OK},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                data={"response_id": status.HTTP_404_NOT_FOUND},
                status=status.HTTP_404_NOT_FOUND,
            )
