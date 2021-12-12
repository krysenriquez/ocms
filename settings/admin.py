from django.contrib import admin
from settings.models import Setting


class SettingAdmin(admin.ModelAdmin):
    list_display = (
        "property",
        "value",
    )

    search_fields = ("=property",)
    ordering = ("property",)

    class Meta:
        model = Setting
        verbose_name_plural = "Settings"


admin.site.register(Setting, SettingAdmin)
