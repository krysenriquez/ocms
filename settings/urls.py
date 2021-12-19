from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()

urlpatterns = [
    path("getwallets/", WalletView.as_view()),
    path("checkwalletcashout/", WalletScheduleView.as_view()),
]

urlpatterns += router.urls
