from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()
router.register(r"getactivitysummary", ActivityViewSet)
router.register(r"getwalletsummary", ActivityMemberWalletViewSet)
router.register(r"getallwalletsummary", ActivityAdminWalletViewSet)
router.register(r"getrecentactivities", RecentActivityViewSet)
router.register(r"getcashouts", CashoutMemberViewSet)
router.register(r"getadmincashouts", CashoutAdminViewSet)

urlpatterns = [
    path("getallwalletinfo/", WalletAdminView.as_view()),
    path("getwalletinfo/", WalletMemberView.as_view()),
    path("getactivitysummaryinfo/", SummaryMemberView.as_view()),
    path("getallactivitysummaryinfo/", SummaryAdminView.as_view()),
    path("getpaymentmethods/", CashoutMethodView.as_view()),
    path("request/", RequestCashoutView.as_view()),
    path("getpendingcashouts/", PendingCashoutsAdminViewSet.as_view()),
    path("getcashoutstatus/", CashoutStatusView.as_view()),
    path("updatecashoutstatus/", UpdatedCashoutStatusView.as_view()),
    path("watch/", CreateWatchActivityView.as_view()),
]

urlpatterns += router.urls
