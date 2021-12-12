from django.db.models.functions import TruncDate
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from tzlocal import get_localzone
from .models import *
from .enums import *
from activities.enums import *
from settings.enums import *
import activities.services as ActivityService
import settings.services as SettingsService
import logging

logger = logging.getLogger("ocmLogger")

settings = SettingsService.get_settings()


def comp_plan(request, new_member):
    # NOTE : Creates New Entry Activity
    create_entry_activity(request, new_member)
    pairing_limit_day = get_setting_value(Property.PAIRING_LIMIT_DAY)
    parents = new_member.get_all_parents_with_side()
    for parent in parents:
        # parent["account"] = current parent account
        # parent["side"] = side of new member respective to its current parent
        # current_child = previous parent of new member
        # current_sibling = sibling of previous parent of new member
        current_parent = parent["account"]
        current_child = parent["account"].children.filter(parent_side=parent["side"]).first()
        current_sibling = parent["account"].children.exclude(parent_side=parent["side"]).first()
        current_level = parent["level"]

        print("--- LOGIC STARTS HERE ---")
        if current_child == new_member:  # new_member 1st generation -- upwards direction
            if current_sibling:
                # find from binary where parent = current_parent and opposite of parent["side"] = current_sibling and parent["side"] = null
                pairing = find_binary(current_parent, current_sibling, parent["side"])
                if pairing:  # If Pairing is Found
                    todays_binary_match = find_binaries_today(current_parent)
                    # NOTE : Get todays total sales matches to check for Possible Flush Out if total matches is at limit
                    if len(todays_binary_match) < pairing_limit_day:
                        # if binary pairing is found update binary object
                        updated_binary, created_binary = update_binary(
                            pairing.id, new_member, parent["side"], BinaryType.SALES_MATCH
                        )
                        # NOTE : If binary is updated and not binary is created, create pairing activity
                        if updated_binary and created_binary is False:
                            create_pairing_activity(request, current_parent, updated_binary)
                    else:
                        updated_binary, created_binary = update_binary(
                            pairing.id, new_member, parent["side"], BinaryType.FLUSHED_OUT
                        )
                else:
                    create_binary(current_parent, new_member, parent["side"])
            else:
                # create new record on binary since there is not match on current_parent (This is the firest generation, this is the first child of the current_parent)
                create_binary(current_parent, new_member, parent["side"])
        else:  # new member 2nd generation and up -- upwards direction
            if current_sibling:
                # find from binary where parent = current_parent and opposite of parent["side"] =  current_sibling and parent["side"] = null
                pairing = find_binary(current_parent, current_sibling, parent["side"])
                if pairing:  # If Pairing is Found
                    todays_binary_match = find_binaries_today(current_parent)
                    # NOTE : Get todays total sales matches to check for Possible Flush Out if total matches is at limit
                    if len(todays_binary_match) < pairing_limit_day:
                        # if binary pairing is found update binary object
                        updated_binary, created_binary = update_binary(
                            pairing.id, new_member, parent["side"], BinaryType.SALES_MATCH
                        )
                        # NOTE : If binary is updated and not binary is created, create pairing activity
                        if updated_binary and created_binary is False:
                            create_pairing_activity(request, current_parent, updated_binary)
                    else:
                        updated_binary, created_binary = update_binary(
                            pairing.id, new_member, parent["side"], BinaryType.FLUSHED_OUT
                        )
                else:
                    # If no pairing match exists, sibling of previous parent has been matched
                    # get child of current sibling to check for matches on the sibling of his previous parent's children
                    current_sibling_children = current_sibling.get_all_children()
                    for current_sibling_child in reversed(current_sibling_children):
                        # current_sibling_child = current child of current_sibling for each of model's children
                        # find from binary where parent = current_parent and opposite of parent["side"] = current_sibling_child and parent["side"] = null
                        pairing = find_binary(current_parent, current_sibling_child, parent["side"])
                        if pairing:  # If Pairing is Found
                            todays_binary_match = find_binaries_today(current_parent)
                            # NOTE : Get todays total sales matches to check for Possible Flush Out if total matches is at limit
                            if len(todays_binary_match) < pairing_limit_day:
                                # if binary pairing is found update binary object
                                updated_binary, created_binary = update_binary(
                                    pairing.id, new_member, parent["side"], BinaryType.SALES_MATCH
                                )
                                # NOTE : If binary is updated and not binary is created, create pairing activity
                                if updated_binary and created_binary is False:
                                    create_pairing_activity(request, current_parent, updated_binary)
                                    break
                            else:
                                updated_binary, created_binary = update_binary(
                                    pairing.id, new_member, parent["side"], BinaryType.FLUSHED_OUT
                                )
                                break
                    if not pairing:
                        print("No Pairing")
                        print("Current Parent", current_parent)
                        print("New Member", new_member)
                        # create new record on binary
                        create_binary(current_parent, new_member, parent["side"])
            else:
                # create new record on binary
                create_binary(current_parent, new_member, parent["side"])

        if current_level <= get_setting_value(Property.UNILEVEL_GENERATION):
            current_unilevel_amount_property = "UNILEVEL_AMOUNT_{0}_GEN".format(current_level)
            create_unilevel_activity(
                request, current_parent, current_unilevel_amount_property, new_member
            )

        print("--- LOGIC ENDS HERE ---")


def find_binaries_today(parent=None):
    local_tz = get_localzone()
    return Binary.objects.annotate(modified_local_tz=TruncDate("modified", tzinfo=local_tz)).filter(
        parent=parent, binary_type=BinaryType.SALES_MATCH, modified_local_tz=timezone.localtime().date()
    )


def find_binary(parent=None, sibling=None, child_side=None):
    if child_side == ParentSide.LEFT:
        return (
            Binary.objects.filter(
                parent=parent.id,
                left_side__isnull=True,
                right_side=sibling.id,
                binary_type=BinaryType.PAIRING,
            )
            .order_by("id")
            .first()
        )
    else:
        return (
            Binary.objects.filter(
                parent=parent.id,
                left_side=sibling.id,
                right_side__isnull=True,
                binary_type=BinaryType.PAIRING,
            )
            .order_by("id")
            .first()
        )


def update_binary(id=None, child=None, child_side=None, binary_type=None):
    if child_side == ParentSide.LEFT:
        return Binary.objects.update_or_create(
            id=id, defaults={"left_side": child, "binary_type": binary_type}
        )
    else:
        return Binary.objects.update_or_create(
            id=id, defaults={"right_side": child, "binary_type": binary_type}
        )


def create_binary(parent=None, child=None, child_side=None):
    if child_side == ParentSide.LEFT:
        Binary.objects.update_or_create(
            parent=parent,
            left_side__isnull=True,
            defaults={"parent": parent, "left_side": child},
        )
    else:
        Binary.objects.update_or_create(
            parent=parent,
            right_side__isnull=True,
            defaults={"parent": parent, "right_side": child},
        )
        # Binary.objects.create(parent=parent, right_side=child)


def create_entry_activity(request, account=None):
    content_type = ContentType.objects.get(model="account")

    ActivityService.create_activity(
        account=account,
        activity_type=ActivityType.ENTRY,
        amount=settings.get(property=Property.ENTRY_AMOUNT).value,
        wallet=WalletType.C_WALLET,
        content_type=content_type,
        object_id=account.pk,
        user=request.user,
    )


def create_pairing_activity(request, account=None, binary=None):
    content_type = ContentType.objects.get(model="binary")

    ActivityService.create_activity(
        account=account,
        activity_type=ActivityType.PAIRING,
        amount=settings.get(property=Property.PAIRING_BONUS_AMOUNT).value,
        wallet=WalletType.B_WALLET,
        content_type=content_type,
        object_id=binary.pk,
        user=request.user,
    )


def create_referral_activity(request, sponsor=None, account=None):
    content_type = ContentType.objects.get(model="account")

    referral = ActivityService.create_activity(
        account=sponsor,
        activity_type=ActivityType.DIRECT_REFERRAL,
        amount=settings.get(property=Property.DIRECT_REFERRAL_AMOUNT).value,
        wallet=WalletType.B_WALLET,
        content_type=content_type,
        object_id=account.pk,
        user=request.user,
    )

    if referral:
        create_unli_ten_activity(request, sponsor)


def create_unli_ten_activity(request, sponsor=None):
    referral_count = len(sponsor.get_all_direct_referral_month())
    unli_ten_count = get_setting_value(Property.UNLI_TEN_COUNT)

    if referral_count % unli_ten_count == 0:
        ActivityService.create_activity(
            account=sponsor,
            activity_type=ActivityType.UNLI_TEN,
            amount=settings.get(property=Property.UNLI_TEN_BONUS).value,
            wallet=WalletType.E_WALLET,
            user=request.user,
        )


def create_unilevel_activity(
    request,
    parent=None,
    property=None,
    account=None,
):
    content_type = ContentType.objects.get(model="account")

    ActivityService.create_activity(
        account=parent,
        activity_type=ActivityType.UNILEVEL,
        amount=settings.get(property=property).value,
        wallet=WalletType.E_WALLET,
        content_type=content_type,
        object_id=account.pk,
        user=request.user,
    )


def create_watch_activity(request, account=None):
    # TODO Must send Token in order to limit Watch and Earn Creation
    return ActivityService.create_activity(
        account=account,
        activity_type=ActivityType.WATCH_AND_EARN,
        amount=settings.get(property=Property.WATCH_AND_EARN_AMOUNT).value,
        wallet=WalletType.W_WALLET,
        user=request.user,
    )


def get_setting_value(property):
    return settings.filter(property=property).first().value


# During Account Creation
# - Direct Referral - DONE
# - Check for Give me 10 - DONE


# During Update of Binary
# - Pairing Bonus on Sales Match - Done
# - Check for Flush Out (Limit 3 or System Properties) - Done
# - Unilevel (5 5 4 4 3 3 2 2 1 1 ) - Done

# During Withdrawals
# - Limit amount based on Wallet Limit
# - Cashout Allowed
# - Leadership Bonus

# Watch and Earn
# Add Token
