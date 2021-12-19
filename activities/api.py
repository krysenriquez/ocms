from django.db.models.deletion import CASCADE
from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.db.models import Sum, F, Q, Case, When
from django.db.models.functions import Coalesce
from .serializers import *
from .models import *
from .enums import *
from .services import process_create_cashout_activity, process_create_cashout_request
from users.enums import UserType


class ActivityView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        account_id = request.data.get("account_id")
        wallet = request.data.get("wallet")
        if account_id is not None and wallet is not None and request.user.is_authenticated:
            activities = []
            wallet_total = []
            if wallet == WalletType.C_WALLET:
                activities = (
                    Activity.objects.filter(wallet=wallet)
                    .values("activity_type")
                    .annotate(activity_total=Sum(F("activity_amount")))
                )
                wallet_total = activities.aggregate(total=Sum("activity_total")).get("total")
            else:
                activities = (
                    Activity.objects.filter(account__account_id=account_id, wallet=wallet)
                    .values("activity_type")
                    .annotate(
                        activity_total=Case(
                            When(
                                Q(activity_type=ActivityType.CASHOUT), then=0 - Sum(F("activity_amount"))
                            ),
                            When(~Q(activity_type=ActivityType.CASHOUT), then=Sum(F("activity_amount"))),
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
                status=status.HTTP_404_NOT_FOUND,
            )


class ActivityViewSet(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Activity.objects.exclude(is_deleted=True)
        account_id = self.request.query_params.get("account_id", None)
        wallet = self.request.query_params.get("wallet", None)

        if account_id is not None and wallet is not None:
            if wallet == WalletType.C_WALLET and self.request.user.user_type == UserType.ADMIN:
                queryset = (
                    queryset.filter(wallet=wallet)
                    .annotate(
                        amount=Case(
                            When(
                                Q(activity_type=ActivityType.CASHOUT), then=0 - Sum(F("activity_amount"))
                            ),
                            When(~Q(activity_type=ActivityType.CASHOUT), then=Sum(F("activity_amount"))),
                        )
                    )
                    .order_by("modified")
                )
            elif wallet != WalletType.C_WALLET:
                queryset = (
                    queryset.filter(account__account_id=account_id, wallet=wallet)
                    .annotate(
                        amount=Case(
                            When(
                                Q(activity_type=ActivityType.CASHOUT), then=0 - Sum(F("activity_amount"))
                            ),
                            When(~Q(activity_type=ActivityType.CASHOUT), then=Sum(F("activity_amount"))),
                        )
                    )
                    .order_by("modified")
                )

            return queryset


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


class CashoutViewSet(ModelViewSet):
    queryset = Cashout.objects.all()
    serializer_class = CashoutSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Cashout.objects.exclude(is_deleted=True)
        account_id = self.request.query_params.get("account_id", None)

        if account_id is not None:
            queryset = queryset.filter(account__account_id=account_id).order_by("modified")

            return queryset


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
                    data={"message": "Cashout Request created."}, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    data={"message": "Unable to register Cashout Activity."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            print(serializer.errors)
            return Response(
                data={"message": "Unable to create Cashout."},
                status=status.HTTP_400_BAD_REQUEST,
            )
