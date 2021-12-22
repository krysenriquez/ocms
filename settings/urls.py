from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()

urlpatterns = [
    path("getadminwallets/", WalletAdminView.as_view()),
    path("getmemberwallets/", WalletMemberView.as_view()),
    path("checkwalletcashout/", WalletScheduleView.as_view()),
    path("getcashouttax/", GetCashoutTaxView.as_view()),
]

urlpatterns += router.urls
