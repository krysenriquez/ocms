from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from .enums import ActivityType, CashoutMethod, WalletType, CashoutStatus


class Activity(models.Model):
    account = models.ForeignKey(
        "accounts.Account",
        on_delete=models.SET_NULL,
        related_name="activity",
        null=True,
        blank=True,
    )
    activity_type = models.CharField(max_length=32, choices=ActivityType.choices, blank=True, null=True)
    activity_amount = models.DecimalField(
        default=0, max_length=256, decimal_places=2, max_digits=13, blank=True, null=True
    )
    wallet = models.CharField(max_length=32, choices=WalletType.choices, blank=True, null=True)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="activity_content_type",
        blank=True,
        null=True,
    )
    object_id = models.PositiveIntegerField(
        blank=True,
        null=True,
    )
    content_object = GenericForeignKey(
        "content_type",
        "object_id",
    )
    created_by = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        related_name="activity_created",
        null=True,
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    deleted = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(
        default=False,
    )

    class Meta:
        verbose_name_plural = "Activities"

    def __str__(self):
        return "%s - %s" % (self.activity_type, self.account)

    def get_activity_details(self):
        generic_object = self.content_type.model_class().objects.get(id=self.object_id)
        detail = []

        if generic_object:
            if self.activity_type == ActivityType.ENTRY:
                detail = "Entry on %s" % (str(generic_object.pk).zfill(5))
            elif self.activity_type == ActivityType.DIRECT_REFERRAL:
                detail = "Direct Referral on %s" % (str(generic_object.pk).zfill(5))
            elif self.activity_type == ActivityType.PAIRING:
                detail = "Binary Pairing on %s and %s" % (
                    str(generic_object.left_side.pk).zfill(5),
                    str(generic_object.right_side.pk).zfill(5),
                )
            elif self.activity_type == ActivityType.LEADERSHIP:
                detail = "Leadership Bonus %s" % (str(generic_object.account).zfill(5))
            elif self.activity_type == ActivityType.UNILEVEL:
                detail = "Unilevel Entry on %s" % (str(generic_object.pk).zfill(5))
            elif self.activity_type == ActivityType.CASHOUT:
                detail = "Cashout on Transaction #%s" % (generic_object.pk)
        else:
            if self.activity_type == ActivityType.UNLI_TEN:
                detail = "Reached 10 Referrals"
            elif self.activity_type == ActivityType.WATCH_AND_EARN:
                detail = "Earned from watching"

        return "%s" % (detail)

    def get_content_type_model(self):
        return "%s" % (self.content_type.model)


class Cashout(models.Model):
    account = models.ForeignKey(
        "accounts.Account",
        on_delete=models.SET_NULL,
        related_name="cashout",
        null=True,
        blank=True,
    )
    amount = models.DecimalField(
        default=0, max_length=256, decimal_places=2, max_digits=13, blank=True, null=True
    )
    status = models.CharField(
        max_length=32,
        choices=CashoutStatus.choices,
        default=CashoutStatus.REQUESTED,
    )
    released_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    released_by = models.ForeignKey(
        "users.CustomUser",
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="released_cashout",
    )
    approved_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    approved_by = models.ForeignKey(
        "users.CustomUser",
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="approved_cashout",
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    deleted = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(
        default=False,
    )


class CashoutDetails(models.Model):
    cashout = models.ForeignKey(Cashout, on_delete=models.CASCADE, related_name="details")
    name = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    method = models.CharField(max_length=32, choices=CashoutMethod.choices, blank=True, null=True)
    note = models.TextField(null=True, blank=True)
