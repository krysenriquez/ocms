from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.db.models import Q, Prefetch, F, Value as V, query, Count, Sum, Case, When
from django.db.models.functions import Concat, Coalesce
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from settings.models import Wallet
from .serializers import *
from .models import *
from .enums import *
from users.enums import UserType


class AccountProfileViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            account_id = self.request.query_params.get("account_id", None)
            queryset = Account.objects.exclude(is_deleted=True).filter(account_id=account_id).all()
            if queryset.exists():
                return queryset


class AccountListViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountListSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            queryset = Account.objects.exclude(is_deleted=True).all()
            if queryset.exists():
                return queryset
        else:
            return Account.objects.none()


class AccountReferralsViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountReferralsSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            queryset = Account.objects.exclude(is_deleted=True).all()
            if queryset.exists():
                return queryset
        else:
            return Account.objects.none()


class AccountUnliTenViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountUnliTenSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            queryset = Account.objects.exclude(is_deleted=True).all()
            if queryset.exists():
                return queryset
        else:
            return Account.objects.none()


class AccountBinaryViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountBinarySerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            binary_type = self.request.query_params.get("binary_type", None)
            queryset = (
                Account.objects.exclude(is_deleted=True)
                .annotate(binary_count=Count("binary", filter=Q(binary__binary_type=binary_type)))
                .all()
                .order_by("-binary_count")[:5]
            )
            if queryset.exists():
                return queryset
        else:
            return Account.objects.none()


class AccountWalletViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountWalletSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            queryset = (
                Account.objects.exclude(is_deleted=True)
                .annotate(
                    wallet_amount=Coalesce(
                        Sum(
                            Case(
                                When(
                                    Q(activity__activity_type=ActivityType.CASHOUT)
                                    & ~Q(activity__wallet=WalletType.C_WALLET),
                                    then=0 - F("activity__activity_amount"),
                                ),
                                When(
                                    ~Q(activity__activity_type=ActivityType.CASHOUT)
                                    & ~Q(activity__wallet=WalletType.C_WALLET),
                                    then=F("activity__activity_amount"),
                                ),
                            )
                        ),
                        0,
                    )
                )
                .all()
                .order_by("-wallet_amount")[:5]
            )
            if queryset.exists():
                return queryset
        else:
            return Account.objects.none()


class GenealogyAccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = GenealogyAccountSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        user_type = self.request.user.user_type

        if user_type is not None and self.request.user.is_authenticated:
            queryset = Account.objects.prefetch_related(
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
                                            queryset=Account.objects.prefetch_related(
                                                Prefetch(
                                                    "children",
                                                    queryset=Account.objects.order_by(
                                                        "parent_side"
                                                    ).all(),
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
                        )
                    )
                    .order_by("parent_side")
                    .all(),
                ),
            ).all()

            account_id = self.request.query_params.get("account_id", None)
            account_number = self.request.query_params.get("account_number", None)

            if (
                account_id is None
                and account_number is not None
                and self.request.user.user_type == UserType.ADMIN
            ):
                queryset = queryset.filter(id=account_number.lstrip("0"))

                for member in queryset:
                    member.all_left_children_count = len(
                        member.get_all_children_side(parent_side=ParentSide.LEFT)
                    )
                    member.all_right_children_count = len(
                        member.get_all_children_side(parent_side=ParentSide.RIGHT)
                    )

                return queryset

            elif account_id is not None and account_number is not None:
                account = Account.objects.get(account_id=account_id)
                children = account.get_all_children()
                child = Account.objects.get(id=account_number.lstrip("0"))

                if child in children or child == account:
                    queryset = queryset.filter(id=account_number.lstrip("0"))

                    for member in queryset:
                        member.all_left_children_count = len(
                            member.get_all_children_side(parent_side=ParentSide.LEFT)
                        )
                        member.all_right_children_count = len(
                            member.get_all_children_side(parent_side=ParentSide.RIGHT)
                        )

                    return queryset

            elif account_id is not None and account_number is None:
                queryset = queryset.filter(account_id=account_id)

                for member in queryset:
                    member.all_left_children_count = len(
                        member.get_all_children_side(parent_side=ParentSide.LEFT)
                    )
                    member.all_right_children_count = len(
                        member.get_all_children_side(parent_side=ParentSide.RIGHT)
                    )

                return queryset


class BinaryAccountProfileViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = BinaryAccountProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        user_type = self.request.user.user_type

        if user_type is not None and self.request.user.is_authenticated:
            queryset = Account.objects.prefetch_related(
                Prefetch(
                    "children",
                ),
            ).all()

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


class CodeViewSet(ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        user_type = self.request.user.user_type
        if user_type is not None and self.request.user.is_authenticated:
            account_id = self.request.query_params.get("account_id", None)

            if account_id is not None:
                queryset = (
                    Code.objects.exclude(is_deleted=True)
                    .filter(account__account_id=account_id)
                    .order_by("status")
                )

                return queryset


class CodeAdminViewSet(ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        user_type = self.request.user.user_type
        if user_type is not None and self.request.user.is_authenticated and user_type == UserType.ADMIN:
            queryset = Code.objects.exclude(is_deleted=True).order_by("-modified")

            return queryset


class BinaryViewSet(ModelViewSet):
    queryset = Binary.objects.all()
    serializer_class = BinarySerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            queryset = Binary.objects.exclude(is_deleted=True)
            binary_type = self.request.query_params.get("binary_type", None)
            queryset = queryset.filter(binary_type=binary_type).order_by("-modified")
            if queryset.exists():
                return queryset
        else:
            return Binary.objects.none()


class CreateAccountView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        processed_request, code = process_create_account_request(request)
        serializer = AccountSerializer(data=processed_request)

        if serializer.is_valid():
            new_member = serializer.save()
            code.update_status()
            comp_plan(request, new_member)
            activate_account(new_member)
            return Response(data={"message": "Account created."}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(
                data={"message": "Unable to create Account."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetCodeStatusView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user_type = request.user.user_type
        if user_type is not None and request.user.is_authenticated and user_type == UserType.ADMIN:
            status_arr = []
            for code in CodeStatus:
                status_arr.append(code)

            if status_arr:
                return Response(
                    data={"status": status_arr},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    data={"message": "No Code Status available."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                data={"message": "Unable to get Code Status list."},
                status=status.HTTP_404_NOT_FOUND,
            )


class GenerateCodeView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        request.data["account"] = request.data.get("account_id").lstrip("0")
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


class VerifyAccountView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        # Parent of the Add Member, account is the ID of the sponsor
        if request.user.user_type == UserType.ADMIN:
            account_id = request.data.get("account_id").lstrip("0")
            if account_id:
                try:
                    account = Account.objects.get(id=account_id)
                    return Response(
                        data={"message": "Account existing."},
                        status=status.HTTP_200_OK,
                    )
                except Account.DoesNotExist:
                    return Response(
                        data={"message": "Account does not exist."},
                        status=status.HTTP_404_NOT_FOUND,
                    )
            else:
                return Response(
                    data={"message": "Account does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )


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
                        "message": code_type.title() + " Code currently deactivated.",
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
            elif activation_code.status == CodeStatus.EXPIRED:
                return Response(
                    data={
                        "message": code_type.title() + " Code has already expired.",
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
