from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import *
from .enums import *
from .services import *
from .serializers import *
from users.enums import UserType


class SettingsViewSet(ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get"]

    def get_queryset(self):
        if self.request.user.user_type == UserType.ADMIN:
            queryset = Setting.objects.all().order_by("-property")

            return queryset


class UpdateSettingsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.user_type == UserType.ADMIN:
            settings = request.data
            instances = []
            for setting in settings:
                obj = Setting.objects.get(property=setting["property"])
                if obj:
                    obj.property = setting["property"]
                    obj.value = setting["value"]
                    obj.save()
                    instances.append(obj)

            serializer = SettingsSerializer(instances, many=True)
            if serializer:
                return Response(
                    data={"message": "System Settings Updated."}, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    data={"message": "Unable to create Update System Settings."},
                    status=status.HTTP_400_BAD_REQUEST,
                )


class WalletMemberView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user_type = request.user.user_type

        if user_type is not None and request.user.is_authenticated:
            wallet_arr = []
            wallets = Wallet.objects.filter(user_type=UserType.MEMBER)

            if wallets:
                for wallet in wallets:
                    wallet_arr.append(wallet.wallet)

                return Response(
                    data={"wallets": wallet_arr},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    data={"message": "No Wallet available for Account."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                data={"message": "Unable to get Wallet list."},
                status=status.HTTP_404_NOT_FOUND,
            )


class GetCashoutTaxView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user_type = request.user.user_type

        if user_type is not None and request.user.is_authenticated:
            leadership_bonus = Setting.objects.get(property=Property.LEADERSHIP_BONUS).value
            company_earning = Setting.objects.get(property=Property.COMPANY_CASHOUT_EARNING).value
            total_tax = leadership_bonus + company_earning

            if total_tax:
                return Response(
                    data={"tax": total_tax},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    data={"tax": 0},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                data={"message": "Unable to get Wallet list."},
                status=status.HTTP_404_NOT_FOUND,
            )


class WalletAdminView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user_type = request.user.user_type

        if user_type != UserType.MEMBER and request.user.is_authenticated:
            wallet_arr = []
            wallets = Wallet.objects.all()

            if wallets:
                for wallet in wallets:
                    wallet_arr.append(wallet.wallet)

                return Response(
                    data={"wallets": wallet_arr},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    data={"message": "No Wallet available for Account."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                data={"message": "Unable to get Wallet list."},
                status=status.HTTP_404_NOT_FOUND,
            )


class WalletScheduleView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user_type = request.user.user_type

        if user_type is not None and request.user.is_authenticated:
            wallet = request.data.get("wallet")
            account_id = request.data.get("account_id")
            if get_wallet_can_cashout(account_id, wallet):
                no_cashout_today = not check_if_has_cashout_today(account_id, wallet)
                if no_cashout_today:
                    has_no_pending_cashout = not check_if_has_pending_cashout(account_id, wallet)
                    print(has_no_pending_cashout)
                    if has_no_pending_cashout:
                        bracket = construct_cashout_amount(account_id, wallet)
                        return Response(
                            data={"bracket": bracket},
                            status=status.HTTP_200_OK,
                        )
                    else:
                        return Response(
                            data={"message": "Pending Cashout request existing for Wallet."},
                            status=status.HTTP_403_FORBIDDEN,
                        )
                else:
                    return Response(
                        data={"message": "Max Cash Out reached today."},
                        status=status.HTTP_403_FORBIDDEN,
                    )
            else:
                return Response(
                    data={"message": "Cash Out currently unavailable."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            return Response(
                data={"message": "Unable to get Wallet list."},
                status=status.HTTP_404_NOT_FOUND,
            )
