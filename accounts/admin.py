from django.contrib import admin
from .models import *


class AccountAdmin(admin.ModelAdmin):
    list_display = (
        "account_id",
        "first_name",
        "middle_name",
        "last_name",
        "account_status",
        "user",
        "parent",
        "referrer",
        "created",
    )

    class Meta:
        model = Account
        verbose_name_plural = "accounts"


admin.site.register(Account)
admin.site.register(PersonalInfo)
admin.site.register(ContactInfo)
admin.site.register(AddressInfo)
admin.site.register(AvatarInfo)
admin.site.register(Code)
