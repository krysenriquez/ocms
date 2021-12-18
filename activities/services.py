from .models import *
from .enums import *


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


def process_create_cashout_activity(request, cashout):
    if cashout:
        content_type = ContentType.objects.get(model="cashout")

        return create_activity(
            account=cashout.account,
            activity_type=ActivityType.CASHOUT,
            amount=cashout.amount,
            wallet=request.data["wallet"],
            content_type=content_type,
            object_id=cashout.pk,
            user=request.user,
        )
