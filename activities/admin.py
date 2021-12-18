from django.contrib import admin
from .models import *


class ActivityAdmin(admin.ModelAdmin):
    list_display = ("activity_type", "account", "activity_amount", "wallet", "created", "modified")
    search_fields = ("account__id",)
    list_filter = ("activity_type", "wallet")
    ordering = ("-modified",)

    class Meta:
        model = Activity
        verbose_name_plural = "Activities"


class CashoutAdmin(admin.ModelAdmin):
    list_display = (
        "account",
        "amount",
        "status",
        "released_date",
        "released_by",
        "approved_date",
        "approved_by",
        "modified",
    )
    search_fields = ("account__id",)
    list_filter = ("status",)
    ordering = ("modified",)

    class Meta:
        model = Cashout
        verbose_name_plural = "Cashouts"


admin.site.register(Activity, ActivityAdmin)
admin.site.register(Cashout, CashoutAdmin)
