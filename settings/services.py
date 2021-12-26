from django.db.models.functions import TruncDate
from django.db.models import Q
from django.utils import timezone
from tzlocal import get_localzone
from settings.models import *
from settings.enums import *
from activities.models import Activity, Cashout
from activities.enums import ActivityType, CashoutStatus
import activities.services as ActivityService


def get_settings():
    return Setting.objects.all()


def get_setting(property):
    return Setting.objects.get(property=property).value


def get_wallet_first_cashout(wallet):
    property = "%s%s" % (wallet, "_CASHOUT_AMOUNT_FIRST")
    if property:
        return get_setting(property=property)


def get_wallet_second_cashout(wallet):
    property = "%s%s" % (wallet, "_CASHOUT_AMOUNT_SECOND")
    if property:
        return get_setting(property=property)


def get_wallet_can_cashout(account_id, wallet):
    if wallet != WalletType.W_WALLET and wallet != WalletType.C_WALLET:
        property = "%s%s" % (wallet, "_CASHOUT_DAY")
        if property:
            day = int(get_setting(property=property))
            if day == timezone.localtime().isoweekday():
                return True
            else:
                has_override = "%s%s" % (wallet, "_CAN_CASHOUT_OVERRIDE")
                if bool(int(get_setting(property=has_override))):
                    return True
                else:
                    return False
    elif wallet == WalletType.W_WALLET:
        return True


def check_if_has_cashout_today(account_id, wallet):
    local_tz = get_localzone()
    return Activity.objects.annotate(modified_local_tz=TruncDate("modified", tzinfo=local_tz)).filter(
        account__account_id=account_id,
        activity_type=ActivityType.CASHOUT,
        wallet=wallet,
        modified_local_tz=timezone.localtime().date(),
    )


def check_if_has_pending_cashout(account_id, wallet):
    return Cashout.objects.filter(
        Q(status=CashoutStatus.REQUESTED) | Q(status=CashoutStatus.APPROVED),
        account__account_id=account_id,
        wallet=wallet,
    )


def construct_cashout_amount(account_id, wallet):
    if wallet != WalletType.W_WALLET and wallet != WalletType.C_WALLET:
        cashout_count = len(ActivityService.get_cashouts(account_id, wallet))
        if cashout_count < 1:
            return get_wallet_first_cashout(wallet)
        else:
            return CashoutBracket.objects.get(wallet=wallet).bracket
    elif wallet == WalletType.W_WALLET:
        return get_wallet_first_cashout(wallet)
