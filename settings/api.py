from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import *
from .enums import *
from .services import *
from users.enums import UserType


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
        if request.user.is_authenticated:
            wallet = request.data.get("wallet")
            account_id = request.data.get("account_id")
            if get_wallet_can_cashout(account_id, wallet):
                no_cashout_today = not check_if_has_cashout_today(account_id, wallet)
                if no_cashout_today:
                    bracket = construct_cashout_amount(account_id, wallet)
                    return Response(
                        data={"bracket": bracket},
                        status=status.HTTP_200_OK,
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
