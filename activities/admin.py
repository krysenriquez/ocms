from django.contrib import admin
from .models import *


class ActivityAdmin(admin.ModelAdmin):
    list_display = ("activity_type", "account", "activity_amount", "wallet", "created")
    search_fields = ("account__id",)
    list_filter = ("activity_type",)

    class Meta:
        model = Activity
        verbose_name_plural = "Activities"


admin.site.register(Activity, ActivityAdmin)
admin.site.register(Cashout)
