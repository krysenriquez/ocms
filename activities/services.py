from activities.models import *
from activities.enums import *


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
