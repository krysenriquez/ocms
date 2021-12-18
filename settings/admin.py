from django.contrib import admin
from settings.models import CashoutBracket, Setting, Wallet


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


class WalletAdmin(admin.ModelAdmin):
    list_display = (
        "wallet",
        "user_type",
    )

    class Meta:
        model = Wallet
        verbose_name_plural = "Wallets"


class CashoutBracketAdmin(admin.ModelAdmin):
    list_display = (
        "wallet",
        "bracket",
    )

    class Meta:
        model = CashoutBracket
        verbose_name_plural = "CashoutBrackets"


admin.site.register(Setting, SettingAdmin)
admin.site.register(Wallet, WalletAdmin)
admin.site.register(CashoutBracket, CashoutBracketAdmin)
