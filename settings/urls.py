from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()
router.register(r"getadminsettings", SettingsViewSet)


urlpatterns = [
    path("updateadminsettings/",UpdateSettingsView.as_view()),
    path("getadminwallets/", WalletAdminView.as_view()),
    path("getmemberwallets/", WalletMemberView.as_view()),
    path("checkwalletcashout/", WalletScheduleView.as_view()),
    path("getcashouttax/", GetCashoutTaxView.as_view()),
]

urlpatterns += router.urls
