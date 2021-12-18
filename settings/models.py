from django.db import models
from .enums import Property
from activities.enums import WalletType
from users.enums import UserType
from django.contrib.postgres.fields import ArrayField


class Setting(models.Model):
    property = models.CharField(max_length=255, default=None, choices=Property.choices)
    value = models.DecimalField(
        default=0, max_length=256, decimal_places=2, max_digits=13, blank=True, null=True
    )

    class Meta:
        ordering = ["property"]

    def __str__(self):
        return "%s - %s" % (self.property, self.value)


class Wallet(models.Model):
    wallet = models.CharField(max_length=32, choices=WalletType.choices, blank=True, null=True)
    user_type = models.CharField(
        max_length=10,
        choices=UserType.choices,
        default=UserType.MEMBER,
    )

    class Meta:
        ordering = ["user_type"]

    def __str__(self):
        return "%s - %s" % (self.wallet, self.user_type)


class CashoutBracket(models.Model):
    wallet = models.CharField(max_length=32, choices=WalletType.choices, blank=True, null=True)
    bracket = ArrayField(
        models.DecimalField(
            default=0, max_length=256, decimal_places=2, max_digits=13, blank=True, null=True
        )
    )
