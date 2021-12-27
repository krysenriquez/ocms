from django.db import models
from django.utils.translation import ugettext_lazy as _


class Property(models.TextChoices):
    (None, "--------")
    CODE_EXPIRATION = "CODE_EXPIRATION", _("Code Expiration")
    MAX_USER_ACCOUNT_LIMIT = "MAX_USER_ACCOUNT_LIMIT", _("Max User Account Limit")
    ENTRY_AMOUNT = "ENTRY_AMOUNT", _("Entry Amount")
    DIRECT_REFERRAL_AMOUNT = "DIRECT_REFERRAL_AMOUNT", _("Direct Referral Amount")
    PAIRING_BONUS_AMOUNT = "PAIRING_BONUS_AMOUNT", _("Pairing Bonus Amount")
    PAIRING_LIMIT_DAY = "PAIRING_LIMIT_DAY", _("Pairing Limit Day")
    UNLI_TEN_BONUS = "UNLI_TEN_BONUS", _("Unli Ten Bonus")
    UNLI_TEN_COUNT = "UNLI_TEN_COUNT", _("Unli Ten Count")
    WATCH_AND_EARN_AMOUNT = "WATCH_AND_EARN_AMOUNT", _("Watch and Earn Amount")
    UNILEVEL_GENERATION = "UNILEVEL_GENERATION", _("Unilevel Generation")
    UNILEVEL_AMOUNT_1_GEN = "UNILEVEL_AMOUNT_1_GEN", _("Unilevel Amount 1 Generation")
    UNILEVEL_AMOUNT_2_GEN = "UNILEVEL_AMOUNT_2_GEN", _("Unilevel Amount 2 Generation")
    UNILEVEL_AMOUNT_3_GEN = "UNILEVEL_AMOUNT_3_GEN", _("Unilevel Amount 3 Generation")
    UNILEVEL_AMOUNT_4_GEN = "UNILEVEL_AMOUNT_4_GEN", _("Unilevel Amount 4 Generation")
    UNILEVEL_AMOUNT_5_GEN = "UNILEVEL_AMOUNT_5_GEN", _("Unilevel Amount 5 Generation")
    UNILEVEL_AMOUNT_6_GEN = "UNILEVEL_AMOUNT_6_GEN", _("Unilevel Amount 6 Generation")
    UNILEVEL_AMOUNT_7_GEN = "UNILEVEL_AMOUNT_7_GEN", _("Unilevel Amount 7 Generation")
    UNILEVEL_AMOUNT_8_GEN = "UNILEVEL_AMOUNT_8_GEN", _("Unilevel Amount 8 Generation")
    UNILEVEL_AMOUNT_9_GEN = "UNILEVEL_AMOUNT_9_GEN", _("Unilevel Amount 9 Generation")
    UNILEVEL_AMOUNT_10_GEN = "UNILEVEL_AMOUNT_10_GEN", _("Unilevel Amount 10 Generation")
    E_WALLET_CASHOUT_AMOUNT_FIRST = "E_WALLET_CASHOUT_AMOUNT_FIRST", _("E-Wallet Cashout Amount First")
    E_WALLET_CASHOUT_AMOUNT_SECOND = "E_WALLET_CASHOUT_AMOUNT_SECOND", _(
        "E-Wallet Cashout Amount Second"
    )
    B_WALLET_CASHOUT_AMOUNT_FIRST = "B_WALLET_CASHOUT_AMOUNT_FIRST", _("B-Wallet Cashout Amount First")
    B_WALLET_CASHOUT_AMOUNT_SECOND = "B_WALLET_CASHOUT_AMOUNT_SECOND", _(
        "B-Wallet Cashout Amount Second"
    )
    W_WALLET_CASHOUT_AMOUNT_FIRST = "W_WALLET_CASHOUT_AMOUNT_FIRST", _("W-Wallet Cashout Amount First")
    B_WALLET_CASHOUT_DAY = "B_WALLET_CASHOUT_DAY", _("B-Wallet Cashout Day")
    E_WALLET_CASHOUT_DAY = "E_WALLET_CASHOUT_DAY", _("E-Wallet Cashout Day")
    E_WALLET_CAN_CASHOUT_OVERRIDE = "E_WALLET_CAN_CASHOUT_OVERRIDE", _("E-Wallet Can Cashout Override")
    B_WALLET_CAN_CASHOUT_OVERRIDE = "B_WALLET_CAN_CASHOUT_OVERRIDE", _("B-Wallet Can Cashout Override")
    LEADERSHIP_BONUS = "LEADERSHIP_BONUS", _("Leadership Bonus")
    COMPANY_CASHOUT_EARNING = "COMPANY_CASHOUT_EARNING", _("Company Cashout Earning")
