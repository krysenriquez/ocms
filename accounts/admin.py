from django.contrib import admin
from .models import *


class AccountAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "middle_name",
        "last_name",
        "account_status",
        "user",
        "parent",
        "referrer",
        "activation_code",
        "created",
    )

    search_fields = ("=id",)

    class Meta:
        model = Account
        verbose_name_plural = "Accounts"


class BinaryAdmin(admin.ModelAdmin):
    list_display = ("parent", "left_side", "right_side", "binary_type", "created", "modified")

    search_fields = (
        "parent__account_id",
        "left_side__account_id",
        "right_side__account_id",
    )

    list_filter = ("binary_type",)

    class Meta:
        model = Binary
        verbose_name_plural = "Binaries"


admin.site.register(Account, AccountAdmin)
admin.site.register(PersonalInfo)
admin.site.register(ContactInfo)
admin.site.register(AddressInfo)
admin.site.register(AvatarInfo)
admin.site.register(Code)
admin.site.register(Binary, BinaryAdmin)
