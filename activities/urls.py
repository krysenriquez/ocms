from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()
router.register(r"getactivitysummary", ActivityViewSet)
router.register(r"getwalletsummary", ActivityWalletViewSet)
router.register(r"getcashouts", CashoutViewSet)

urlpatterns = [
    path("getwalletinfo/", ActivityView.as_view()),
    path("getpaymentmethods/", CashoutMethodView.as_view()),
    path("request/", RequestCashoutView.as_view()),
]

urlpatterns += router.urls
