from decimal import Decimal
from .models import *
from .enums import *
from django.utils import timezone
from settings.enums import *
from settings.models import Setting


def get_settings():
    return Setting.objects.all()


settings = get_settings()


def get_setting_value(property):
    return settings.filter(property=property).first().value


def create_activity(
    account=None,
    activity_type=None,
    amount=None,
    wallet=None,
    content_type=None,
    object_id=None,
    user=None,
):
    return Activity.objects.create(
        account=account,
        activity_type=activity_type,
        activity_amount=amount,
        wallet=wallet,
        content_type=content_type,
        object_id=object_id,
        created_by=user,
    )


def get_cashouts(account_id, wallet):
    return Activity.objects.filter(
        account__account_id=account_id, activity_type=ActivityType.CASHOUT, wallet=wallet
    ).exclude(is_deleted=True)


def process_create_cashout_request(request):
    from accounts.models import Account

    account = get_object_or_404(Account, account_id=request.data["account_id"])
    if request.user.is_authenticated and account:
        data = {
            "account": account.pk,
            "amount": request.data["amount"],
            "details": [
                {
                    "name": request.data["details"]["name"],
                    "phone_number": request.data["details"]["phone_number"],
                    "method": request.data["details"]["method"],
                    "note": request.data["details"]["note"],
                }
            ],
        }

        return data


def get_cashout_total_tax():
    leadership_bonus = get_setting_value(Property.LEADERSHIP_BONUS)
    company_earnings = get_setting_value(Property.COMPANY_CASHOUT_EARNING)
    return leadership_bonus + company_earnings


def process_create_cashout_activity(request, cashout):
    if cashout:
        content_type = ContentType.objects.get(model="cashout")
        total_tax = get_cashout_total_tax()

        return create_activity(
            account=cashout.account,
            activity_type=ActivityType.CASHOUT,
            amount=cashout.amount * Decimal(1 - total_tax),
            wallet=request.data["wallet"],
            content_type=content_type,
            object_id=cashout.pk,
            user=request.user,
        )


def process_save_cashout_status(request):
    cashout = Cashout.objects.get(id=request.data["cashout_id"].lstrip("0"))
    if cashout:
        if cashout.status == CashoutStatus.REQUESTED:
            if request.data["status"] == CashoutStatus.APPROVED:
                data = {
                    "approved_date": timezone.localtime(),
                    "approved_by": request.user.pk,
                }
            elif request.data["status"] == CashoutStatus.RELEASED:
                data = {
                    "approved_date": timezone.localtime(),
                    "approved_by": request.user.pk,
                    "released_date": timezone.localtime(),
                    "released_by": request.user.pk,
                }
            elif request.data["status"] == CashoutStatus.DENIED:
                data = {
                    "denied_date": timezone.localtime(),
                    "denied_by": request.user.pk,
                }
        elif cashout.status == CashoutStatus.APPROVED:
            if request.data["status"] == CashoutStatus.RELEASED:
                data = {
                    "released_date": timezone.localtime(),
                    "released_by": request.user.pk,
                }
            elif request.data["status"] == CashoutStatus.DENIED:
                data = {
                    "denied_date": timezone.localtime(),
                    "denied_by": request.user.pk,
                }

        data["status"] = request.data["status"]

        return cashout, data


def process_create_payout_activity(request, updated_cashout):
    if updated_cashout:
        content_type = ContentType.objects.get(model="cashout")
        total_tax = get_cashout_total_tax()
        return create_activity(
            account=updated_cashout.account,
            activity_type=ActivityType.PAYOUT,
            amount=updated_cashout.amount * Decimal(1 - total_tax),
            wallet=WalletType.C_WALLET,
            content_type=content_type,
            object_id=updated_cashout.pk,
            user=request.user,
        )


def process_create_leadership_activity(request, updated_cashout):
    from accounts.models import Account

    if updated_cashout:
        account = get_object_or_404(Account, id=updated_cashout.account.pk)
        leadership_bonus = get_setting_value(Property.LEADERSHIP_BONUS)
        content_type = ContentType.objects.get(model="cashout")
        return create_activity(
            account=account.referrer,
            activity_type=ActivityType.LEADERSHIP,
            amount=updated_cashout.amount * Decimal(leadership_bonus),
            wallet=WalletType.E_WALLET,
            content_type=content_type,
            object_id=updated_cashout.pk,
            user=request.user,
        )


def process_create_company_earning_activity(request, updated_cashout):
    from accounts.models import Account

    if updated_cashout:
        company_earnings = get_setting_value(Property.COMPANY_CASHOUT_EARNING)
        content_type = ContentType.objects.get(model="cashout")
        return create_activity(
            account=updated_cashout.account,
            activity_type=ActivityType.COMPANY_TAX,
            amount=updated_cashout.amount * Decimal(company_earnings),
            wallet=WalletType.C_WALLET,
            content_type=content_type,
            object_id=updated_cashout.pk,
            user=request.user,
        )


def create_watch_activity(request, account=None):
    return create_activity(
        account=account,
        activity_type=ActivityType.WATCH_AND_EARN,
        amount=settings.get(property=Property.WATCH_AND_EARN_AMOUNT).value,
        wallet=WalletType.W_WALLET,
        user=request.user,
    )
