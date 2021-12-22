from django.db.models.deletion import CASCADE
from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.db.models import Sum, F, Q, Case, When
from django.db.models.functions import Coalesce
from .serializers import *
from .models import *
from .enums import *
from .services import (
    process_create_cashout_activity,
    process_create_cashout_request,
    process_create_company_earning_activity,
    process_create_leadership_activity,
    process_create_payout_activity,
    process_save_cashout_status,
)
from users.enums import UserType
from accounts.models import Account


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
                                        then=0 - (Sum(F("activity_amount") / 0.9)),
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
                if account_id is not None:
                    queryset = queryset.filter(account__account_id=account_id)

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


class WalletMemberView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        wallet = request.data.get("wallet")
        if wallet is not None and request.user.is_authenticated:
            activities = []
            wallet_total = []
            account_id = request.data.get("account_id")
            if account_id is not None:
                account = Account.objects.get(account_id=account_id)
                user_accounts = self.request.user.get_all_user_accounts()
                if account in user_accounts:
                    activities = (
                        Activity.objects.filter(account__account_id=account_id, wallet=wallet)
                        .values("activity_type")
                        .annotate(
                            activity_total=Case(
                                When(
                                    Q(activity_type=ActivityType.CASHOUT),
                                    then=0 - (Sum(F("activity_amount") / 0.9)),
                                ),
                                When(
                                    ~Q(activity_type=ActivityType.CASHOUT),
                                    then=Sum(F("activity_amount")),
                                ),
                            )
                        )
                        .order_by("-activity_total")
                    )
                    wallet_total = activities.aggregate(total=Sum("activity_total")).get("total")

                    return Response(
                        data={"wallet": wallet, "total": wallet_total, "details": activities},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        data={"message": "Unable to get Wallet details."},
                        status=status.HTTP_403_FORBIDDEN,
                    )
            else:
                return Response(
                    data={"message": "Unable to get Wallet details."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        else:
            return Response(
                data={"message": "Unable to get Wallet details."},
                status=status.HTTP_404_NOT_FOUND,
            )


# class WalletAdminView(views.APIView):
#     permission_classes = (permissions.IsAuthenticated,)

#     def post(self, request, *args, **kwargs):
#         wallet = request.data.get("wallet")
#         if wallet is not None and request.user.is_authenticated:
#             activities = []
#             wallet_total = []
#             account_id = request.data.get("account_id")
#             if account_id is not None:
#                 if self.request.user.user_type == UserType.ADMIN:
#                     activities = (
#                         Activity.objects.filter(account__account_id=account_id, wallet=wallet)
#                         .values("activity_type")
#                         .annotate(
#                             activity_total=Case(
#                                 When(
#                                     Q(activity_type=ActivityType.CASHOUT),
#                                     then=0 - Sum(F("activity_amount")),
#                                 ),
#                                 When(
#                                     ~Q(activity_type=ActivityType.CASHOUT),
#                                     then=Sum(F("activity_amount")),
#                                 ),
#                             )
#                         )
#                         .order_by("-activity_total")
#                     )
#                     wallet_total = activities.aggregate(total=Sum("activity_total")).get("total")

#                     return Response(
#                         data={"wallet": wallet, "total": wallet_total, "details": activities},
#                         status=status.HTTP_200_OK,
#                     )
#                 else:
#                     account = Account.objects.get(account_id=account_id)
#                     user_accounts = self.request.user.get_all_user_accounts()
#                     if account in user_accounts:
#                         activities = (
#                             Activity.objects.filter(account__account_id=account_id, wallet=wallet)
#                             .values("activity_type")
#                             .annotate(
#                                 activity_total=Case(
#                                     When(
#                                         Q(activity_type=ActivityType.CASHOUT),
#                                         then=0 - Sum(F("activity_amount")),
#                                     ),
#                                     When(
#                                         ~Q(activity_type=ActivityType.CASHOUT),
#                                         then=Sum(F("activity_amount")),
#                                     ),
#                                 )
#                             )
#                             .order_by("-activity_total")
#                         )
#                         wallet_total = activities.aggregate(total=Sum("activity_total")).get("total")

#                         return Response(
#                             data={"wallet": wallet, "total": wallet_total, "details": activities},
#                             status=status.HTTP_200_OK,
#                         )
#                     else:
#                         return Response(
#                             data={"message": "Unable to get Wallet details."},
#                             status=status.HTTP_403_FORBIDDEN,
#                         )
#             else:
#                 if request.user.user_type == UserType.ADMIN:
#                     activities = (
#                         Activity.objects.filter(wallet=wallet)
#                         .values("activity_type")
#                         .annotate(activity_total=Sum(F("activity_amount")))
#                     )
#                     wallet_total = activities.aggregate(total=Sum("activity_total")).get("total")
#                     return Response(
#                         data={"wallet": wallet, "total": wallet_total, "details": activities},
#                         status=status.HTTP_200_OK,
#                     )
#                 else:
#                     return Response(
#                         data={"message": "Unable to get Wallet details."},
#                         status=status.HTTP_403_FORBIDDEN,
#                     )
#         else:
#             return Response(
#                 data={"message": "Unable to get Wallet details."},
#                 status=status.HTTP_404_NOT_FOUND,
#             )


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
        serializer = CreatCashoutSerializer(data=processed_request)

        if serializer.is_valid():
            cashout = serializer.save()
            activity = process_create_cashout_activity(request, cashout)
            if activity:
                return Response(
                    data={"message": "Cash Out Request created."}, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    data={"message": "Unable to register Cash Out Activity."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            print(serializer.errors)
            return Response(
                data={"message": "Unable to create Cash Out."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UpdatedCashoutStatusView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.user_type == UserType.ADMIN:
            cashout, processed_request = process_save_cashout_status(request)
            serializer = CreatCashoutSerializer(cashout, data=processed_request)

            if serializer.is_valid():
                updated_cashout = serializer.save()
                if updated_cashout.status == CashoutStatus.RELEASED:
                    payout = process_create_payout_activity(request, updated_cashout)
                    if payout:
                        leadership = process_create_leadership_activity(request, updated_cashout)
                        if leadership:
                            tax = process_create_company_earning_activity(request, updated_cashout)
                            if tax:
                                return Response(
                                    data={"message": "Cash Out updated."}, status=status.HTTP_201_CREATED
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
                print(serializer.errors)
                return Response(
                    data={"message": "Unable to update Cash Out."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
