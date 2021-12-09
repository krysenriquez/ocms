import uuid
from django.db import models
from django.db.models.enums import Choices
from .enums import AccountStatus, CodeStatus, CodeType, Gender, ParentSide, BinaryType


def account_avatar_directory(instance, filename):
    return "accounts/{0}/avatar/{1}".format(instance.account.account_id, filename)


class Account(models.Model):
    account_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    parent = models.ForeignKey(
        "self",
        related_name="children",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    parent_side = models.CharField(max_length=10, choices=ParentSide.choices, null=True, blank=True)
    activation_code = models.ForeignKey(
        "accounts.Code",
        related_name="account_activated",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    referrer = models.ForeignKey(
        "self",
        related_name="referrals",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    first_name = models.CharField(max_length=255, null=True, blank=True)
    middle_name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    last_name = models.CharField(max_length=255, null=True, blank=True)
    account_status = models.CharField(
        max_length=11,
        choices=AccountStatus.choices,
        default=AccountStatus.DRAFT,
    )
    user = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        related_name="account_user",
        null=True,
        blank=True,
    )
    created_by = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        related_name="account_created",
        null=True,
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    deleted = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(
        default=False,
    )

    class Meta:
        ordering = ["-created", "-id"]

    def get_full_name(self):
        return "%s %s %s" % (self.first_name, self.middle_name, self.last_name)

    def get_all_children(self, children):
        for account in self.children.all():
            children.append(account)
            account.get_all_children(children)
        return children

    def __str__(self):
        return "%s" % (self.get_full_name())


class PersonalInfo(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="personal_info")
    birthdate = models.DateField(
        blank=True,
        null=True,
    )
    gender = models.CharField(max_length=6, choices=Gender.choices, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s" % (self.account)


class ContactInfo(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="contact_info")
    contact_number = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s : %s" % (
            self.account,
            self.contact_number,
        )


class AddressInfo(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="address_info")
    street = models.TextField(
        blank=True,
        null=True,
    )
    city = models.TextField(
        blank=True,
        null=True,
    )
    state = models.TextField(
        blank=True,
        null=True,
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Addresses"

    def __str__(self):
        return "%s : %s" % (self.account, self.full_address)

    def full_address(self):
        return "%s %s %s" % (self.street, self.city, self.state)


class AvatarInfo(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="avatar_info")
    file_name = models.CharField(max_length=255, null=True, blank=True)
    file_attachment = models.ImageField(blank=True, upload_to=account_avatar_directory)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s : %s - %s" % (
            self.account,
            self.file_attachment,
            self.file_name,
        )


class Code(models.Model):
    code = models.CharField(max_length=8, null=True, blank=True)
    code_type = models.CharField(max_length=32, choices=CodeType.choices, default=CodeType.ACTIVATION)
    status = models.CharField(max_length=32, choices=CodeStatus.choices, default=CodeStatus.ACTIVE)
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, null=True, blank=True, related_name="codes"
    )
    created_by = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        related_name="code_created_by",
        null=True,
    )
    description = models.TextField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    deleted = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(
        default=False,
    )
    quantity = None

    def __str__(self):
        return "%s - %s : %s - %s" % (
            self.account,
            self.code,
            self.code_type,
            self.status,
        )

    def update_status(self):
        account = Account.objects.filter(activation_code=self)
        if account:
            if self.status == CodeStatus.ACTIVE:
                self.status = CodeStatus.USED
                self.save()

    # def time_since_created(self):
    #     general_settings = apps.get_model("settings", "GeneralSetting")
    #     general_setting = general_settings.objects.all().first()
    #     code_expiration_seconds = (
    #         general_setting.code_expiration * 60 * 60
    #     )  # Convert Code Expiration Hours to Seconds
    #     now = datetime.now()
    #     time_since_insertion = timedelta.total_seconds(
    #         (datetime.now(timezone.utc) + timedelta(hours=8)) - (self.updated_at + timedelta(hours=8))
    #     )
    #     seconds = code_expiration_seconds - time_since_insertion

    #     if seconds <= 0:
    #         if self.status == "Active":
    #             self.status = "Deactivated"
    #             self.save()

    #         return "Expired"

    #     return convert(seconds)


class Binary(models.Model):
    parent = models.ForeignKey(
        Account,
        related_name="binary",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    left_side = models.ForeignKey(
        Account,
        related_name="left_side",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    right_side = models.ForeignKey(
        Account,
        related_name="right_side",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    binary_type = models.CharField(max_length=32, choices=BinaryType.choices, default=BinaryType.PAIRING)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    deleted = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(
        default=False,
    )
