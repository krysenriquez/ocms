from django.db import models
from django.utils.translation import ugettext_lazy as _


class ActivityType(models.TextChoices):
    # * --- C-Wallet
    ENTRY = "ENTRY", _("Entry")  # * No Foreign Key
    PAYOUT = "PAYOUT", _("Payout")  # * Foreign Key to Cashout
    COMPANY_TAX = "COMPANY_TAX", _("Company Tax")  # * Foreign Key to Cashout
    # * --- B-Wallet
    DIRECT_REFERRAL = "DIRECT_REFERRAL", _("Direct Referral")  # * Foreign Key to Sponsored Account
    PAIRING = "PAIRING", _("Pairing")  # * Foreign Key to Binary
    # * --- E-Wallet
    LEADERSHIP = "LEADERSHIP", _("Leadership")  # * Foreign Key to Cashout
    UNLI_TEN = "UNLI_TEN", _("Unli Ten")  # * No Foreign Key
    UNILEVEL = "UNILEVEL", _("Uni Level")  # * Foreign Key to Entry Account
    # * --- W-Wallet
    WATCH_AND_EARN = "WATCH_AND_EARN", _("Watch and Earn")  # * No Foreign Key
    CASHOUT = "CASHOUT", _("Cashout")  # * Foreign Key to Cashout


class WalletType(models.TextChoices):
    C_WALLET = "C_WALLET", _("Company Wallet")
    B_WALLET = "B_WALLET", _("Binary Wallet")
    E_WALLET = "E_WALLET", _("Enterprise Wallet")
    W_WALLET = "W_WALLET", _("Watch Wallet")


class CashoutStatus(models.TextChoices):
    REQUESTED = "REQUESTED", _("Requested")
    APPROVED = "APPROVED", _("Approved")
    RELEASED = "RELEASED", _("Released")
    DENIED = "DENIED", _("Denied")


class CashoutMethod(models.TextChoices):
    CEBUANA = "CEBUANA", _("Cebuana")
    G_CASH = "G_CASH", _("G-Cash")
    PALAWAN_EXPRESS = "PALAWAN_EXPRESS", _("Palawan Express")
    UNION_BANK = "UNION_BANK", _("Union Bank")
    BDO = "BDO", _("BDO")
