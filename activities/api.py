from django.db.models.deletion import CASCADE
from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.http import HttpResponse
from django.db.models import Sum, F, Q, Case, When
from django.db.models.functions import Coalesce
from .serializers import *
from .models import *
from .enums import *
from .services import (
    create_watch_activity,
    get_cashout_total_tax,
    get_leadership_bonus,
    process_create_cashout_activity,
    process_create_cashout_request,
    process_create_company_earning_activity,
    process_create_leadership_activity,
    process_create_payout_activity,
    process_save_cashout_status,
    get_setting_value,
    get_vast_xml,
)
from users.enums import UserType
from accounts.models import Account, Binary
from accounts.enums import BinaryType


class ActivityMemberWalletViewSet(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        user_type = self.request.user.user_type
        if user_type is not None and self.request.user.is_authenticated:
            queryset = Activity.objects.exclude(is_deleted=True)
            wallet = self.request.query_params.get("wallet", None)
            if wallet is not None:
                account_id = self.request.query_params.get("account_id", None)
                if account_id is not None:
                    account = Account.objects.get(account_id=account_id)
                    user_accounts = self.request.user.get_all_user_accounts()
                    if account in user_accounts:
                        return (
                            queryset.filter(account__account_id=account_id, wallet=wallet)
                            .annotate(
                                amount=Case(
                                    When(
                                        Q(activity_type=ActivityType.CASHOUT),
                                        then=0 - (Sum(F("activity_amount"))),
                                    ),
                                    When(
                                        ~Q(activity_type=ActivityType.CASHOUT),
                                        then=Sum(F("activity_amount")),
                                    ),
                                )
                            )
                            .order_by("-modified")
                        )


class ActivityAdminWalletViewSet(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        user_type = self.request.user.user_type
        if user_type is not None and self.request.user.is_authenticated:
            queryset = Activity.objects.exclude(is_deleted=True)
            wallet = self.request.query_params.get("wallet", None)
            if wallet is not None:
                account_id = self.request.query_params.get("account_id", None)
                if account_id is not None:
                    if self.request.user.user_type == UserType.ADMIN:
                        return (
                            queryset.filter(account__account_id=account_id, wallet=wallet)
                            .annotate(
                                amount=Case(
                                    When(
                                        Q(activity_type=ActivityType.CASHOUT),
                                        then=0 - (Sum(F("activity_amount"))),
                                    ),
                                    When(
                                        ~Q(activity_type=ActivityType.CASHOUT),
                                        then=Sum(F("activity_amount")),
                                    ),
                                )
                            )
                            .order_by("-modified")
                        )
                else:
                    if self.request.user.user_type == UserType.ADMIN:
                        return (
                            queryset.filter(wallet=wallet)
                            .annotate(
                                amount=Case(
                                    When(
                                        Q(activity_type=ActivityType.CASHOUT),
                                        then=0 - Sum(F("activity_amount")),
                                    ),
                                    When(
                                        ~Q(activity_type=ActivityType.CASHOUT),
                                        then=Sum(F("activity_amount")),
                                    ),
                                )
                            )
                            .order_by("-modified")
                        )


class ActivityViewSet(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            activity_type = self.request.query_params.get("activity_type", None)
            account_id = self.request.query_params.get("account_id", None)
            if activity_type is not None:
                queryset = (
                    Activity.objects.exclude(is_deleted=True)
                    .filter(activity_type=activity_type)
                    .annotate(
                        amount=Case(
                            When(
                                Q(activity_type=ActivityType.CASHOUT),
                                then=0 - (Sum(F("activity_amount"))),
                            ),
                            When(
                                ~Q(activity_type=ActivityType.CASHOUT),
                                then=Sum(F("activity_amount")),
                            ),
                        )
                    )
                    .order_by("-modified")
                )
                if account_id is not None:
                    queryset = queryset.filter(account__account_id=account_id)

                return queryset


class RecentActivityViewSet(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            account_id = self.request.query_params.get("account_id", None)
            queryset = (
                Activity.objects.filter(account__account_id=account_id)
                .exclude(is_deleted=True)
                .exclude(wallet=WalletType.C_WALLET)
                .annotate(
                    amount=Case(
                        When(
                            Q(activity_type=ActivityType.CASHOUT),
                            then=0 - (Sum(F("activity_amount"))),
                        ),
                        When(
                            ~Q(activity_type=ActivityType.CASHOUT),
                            then=Sum(F("activity_amount")),
                        ),
                    )
                )
                .order_by("-modified")[:5]
            )

            return queryset


class CashoutMemberViewSet(ModelViewSet):
    queryset = Cashout.objects.all()
    serializer_class = CashoutMemberSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            queryset = Cashout.objects.exclude(is_deleted=True)
            account_id = self.request.query_params.get("account_id", None)
            if account_id is not None:
                queryset = queryset.filter(account__account_id=account_id).order_by("modified")
                return queryset


class CashoutAdminViewSet(ModelViewSet):
    queryset = Cashout.objects.all()
    serializer_class = CashoutAdminSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            queryset = Cashout.objects.exclude(is_deleted=True).order_by("modified")
            return queryset


class PendingCashoutsAdminViewSet(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.user_type == UserType.ADMIN:
            data = []
            for wallet in WalletType:
                if wallet != WalletType.C_WALLET:
                    cashouts = (
                        Cashout.objects.filter(wallet=wallet)
                        .exclude(is_deleted=True)
                        .exclude(status=CashoutStatus.RELEASED)
                        .exclude(status=CashoutStatus.DENIED)
                        .order_by("-amount")
                    )
                    wallet_total = cashouts.aggregate(total=Coalesce(Sum("amount"), 0)).get("total")
                    data.append({"wallet": wallet, "total": wallet_total})

            return Response(
                data=data,
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                data={"message": "Unable to get Wallet details."},
                status=status.HTTP_404_NOT_FOUND,
            )


class SummaryAdminView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.user_type == UserType.ADMIN:
            data = []
            entry_count = Activity.objects.filter(activity_type=ActivityType.ENTRY).count()
            data.append({"activity": ActivityType.ENTRY, "summary": entry_count})

            referrals_count = Activity.objects.filter(activity_type=ActivityType.DIRECT_REFERRAL).count()
            data.append({"activity": ActivityType.DIRECT_REFERRAL, "summary": referrals_count})

            pairing_count = Binary.objects.filter(binary_type=BinaryType.PAIRING).count()
            data.append({"activity": BinaryType.PAIRING, "summary": pairing_count})

            flushed_out_count = Binary.objects.filter(binary_type=BinaryType.FLUSHED_OUT).count()
            data.append({"activity": BinaryType.FLUSHED_OUT, "summary": flushed_out_count})

            return Response(
                data=data,
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                data={"message": "Unable to get Wallet details."},
                status=status.HTTP_404_NOT_FOUND,
            )


class SummaryMemberView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            account_id = request.data.get("account_id")
            data = []
            pairing_count = Binary.objects.filter(
                parent__account_id=account_id, binary_type=BinaryType.PAIRING
            ).count()
            data.append({"activity": BinaryType.PAIRING, "summary": pairing_count})

            flushed_out_count = Binary.objects.filter(
                parent__account_id=account_id, binary_type=BinaryType.FLUSHED_OUT
            ).count()
            data.append({"activity": BinaryType.FLUSHED_OUT, "summary": flushed_out_count})

            referrals_count = Activity.objects.filter(
                account__account_id=account_id, activity_type=ActivityType.DIRECT_REFERRAL
            ).count()
            data.append({"activity": ActivityType.DIRECT_REFERRAL, "summary": referrals_count})

            account = Account.objects.get(account_id=account_id)
            unliten_count = account.get_all_direct_referral_month_count()

            data.append({"activity": ActivityType.UNLI_TEN, "summary": str(unliten_count % 10) + "/10"})

            return Response(
                data=data,
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                data={"message": "Unable to get Wallet details."},
                status=status.HTTP_404_NOT_FOUND,
            )


class WalletAdminView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.user_type == UserType.ADMIN:
            data = []
            total_tax = get_cashout_total_tax()
            leadership_bonus = get_leadership_bonus()
            for wallet in WalletType:
                activities = (
                    Activity.objects.filter(wallet=wallet)
                    .values("activity_type")
                    .annotate(
                        activity_total=Case(
                            When(
                                Q(activity_type=ActivityType.CASHOUT),
                                then=0 - (Sum(F("activity_amount"))),
                            ),
                            When(
                                Q(activity_type=ActivityType.PAYOUT),
                                then=0 - (Sum(F("activity_amount") / (1 - total_tax))),
                            ),
                            When(
                                ~Q(activity_type=ActivityType.CASHOUT)
                                & ~Q(activity_type=ActivityType.PAYOUT),
                                then=Sum(F("activity_amount")),
                            ),
                        ),
                        cashout_total=Case(
                            When(
                                Q(activity_type=ActivityType.CASHOUT),
                                then=0 - (Sum(F("activity_amount"))),
                            ),
                            When(
                                Q(activity_type=ActivityType.PAYOUT),
                                then=0 - (Sum(F("activity_amount") + (100 * leadership_bonus))),
                            ),
                        ),
                    )
                    .order_by("-activity_total")
                )
                wallet_total = activities.aggregate(total=Coalesce(Sum("activity_total"), 0)).get(
                    "total"
                )
                wallet_total_cashout = activities.aggregate(total=Coalesce(Sum("cashout_total"), 0)).get(
                    "total"
                )
                data.append(
                    {
                        "wallet": wallet,
                        "total": wallet_total,
                        "cashout": wallet_total_cashout,
                        "details": activities,
                    }
                )

            return Response(
                data=data,
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                data={"message": "Unable to get Wallet details."},
                status=status.HTTP_404_NOT_FOUND,
            )


class WalletMemberView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            account_id = request.data.get("account_id")
            data = []
            for wallet in WalletType:
                if wallet != WalletType.C_WALLET:
                    activities = (
                        Activity.objects.filter(account__account_id=account_id, wallet=wallet)
                        .values("activity_type")
                        .annotate(
                            activity_total=Case(
                                When(
                                    Q(activity_type=ActivityType.CASHOUT),
                                    then=0 - (Sum(F("activity_amount"))),
                                ),
                                When(
                                    ~Q(activity_type=ActivityType.CASHOUT),
                                    then=Sum(F("activity_amount")),
                                ),
                            ),
                            cashout_total=Case(
                                When(
                                    Q(activity_type=ActivityType.CASHOUT),
                                    then=0 - (Sum(F("activity_amount"))),
                                ),
                            ),
                        )
                        .order_by("-activity_total")
                    )
                    wallet_total = activities.aggregate(total=Coalesce(Sum("activity_total"), 0)).get(
                        "total"
                    )
                    wallet_total_cashout = activities.aggregate(
                        total=Coalesce(Sum("cashout_total"), 0)
                    ).get("total")
                    data.append(
                        {
                            "wallet": wallet,
                            "total": wallet_total,
                            "cashout": wallet_total_cashout,
                            "details": activities,
                        }
                    )

            return Response(
                data=data,
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                data={"message": "Unable to get Wallet details."},
                status=status.HTTP_404_NOT_FOUND,
            )


class CashoutMethodView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user_type = request.user.user_type

        if user_type is not None and request.user.is_authenticated:
            methods_arr = []

            for method in CashoutMethod:
                methods_arr.append(method)

            if methods_arr:
                return Response(
                    data={"methods": methods_arr},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    data={"message": "No Payment Method currently Available."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                data={"message": "Unable to get Payment Method list."},
                status=status.HTTP_404_NOT_FOUND,
            )


class CashoutStatusView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user_type = request.user.user_type

        if (
            user_type is not None
            and request.user.is_authenticated
            and request.user.user_type == UserType.ADMIN
        ):
            status_arr = []

            for method in CashoutStatus:
                status_arr.append(method)

            if status_arr:
                return Response(
                    data={"status": status_arr},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    data={"message": "No Cashout Status currently Available."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                data={"message": "Unable to get Cashout Status list."},
                status=status.HTTP_404_NOT_FOUND,
            )


class RequestCashoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        processed_request = process_create_cashout_request(request)
        serializer = CreateCashoutSerializer(data=processed_request)

        if serializer.is_valid():
            cashout = serializer.save()
            if cashout:
                return Response(
                    data={"message": "Cash Out Request created."}, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    data={"message": "Unable to register Cash Out Activity."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                data={"message": "Unable to create Cash Out."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UpdatedCashoutStatusView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.user_type == UserType.ADMIN:
            cashout, processed_request = process_save_cashout_status(request)
            serializer = CreateCashoutSerializer(cashout, data=processed_request)
            if serializer.is_valid():
                updated_cashout = serializer.save()
                if updated_cashout.status == CashoutStatus.RELEASED:
                    activity = process_create_cashout_activity(request, updated_cashout)
                    if activity:
                        payout = process_create_payout_activity(request, updated_cashout)
                        if payout:
                            leadership = process_create_leadership_activity(request, updated_cashout)
                            if leadership:
                                tax = process_create_company_earning_activity(request, updated_cashout)
                                if tax:
                                    return Response(
                                        data={"message": "Cash Out updated."},
                                        status=status.HTTP_201_CREATED,
                                    )
                                else:
                                    return Response(
                                        data={"message": "Unable to generate Company Tax Activity."},
                                        status=status.HTTP_400_BAD_REQUEST,
                                    )
                            else:
                                return Response(
                                    data={"message": "Unable to generate Leadership Bonus Activity."},
                                    status=status.HTTP_400_BAD_REQUEST,
                                )
                        else:
                            return Response(
                                data={"message": "Unable to generate Payout Activity."},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        return Response(
                            data={"message": "Unable to generate Cashout Activity."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    return Response(
                        data={"message": "Cash Out updated."},
                        status=status.HTTP_201_CREATED,
                    )
            else:
                return Response(
                    data={"message": "Unable to update Cash Out."},
                    status=status.HTTP_400_BAD_REQUEST,
                )


class CreateWatchActivityView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            account_id = request.data.get("account_id")
            account = get_object_or_404(Account, account_id=account_id)
            if account:
                watch_activity = create_watch_activity(request, account)
                if watch_activity:
                    return Response(
                        data={"message": "You earned ₱" + str(watch_activity.activity_amount)},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        data={"message": "Unable to create Watch Activity."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    data={"message": "Unable to create Watch Activity. Account does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                data={"message": "Unauthorized access."},
                status=status.HTTP_403_FORBIDDEN,
            )


class GetVastXmlView(views.APIView):
    def get(self, request, *args, **kwargs):
        xml = get_vast_xml()
        return HttpResponse(xml, content_type="text/xml")
