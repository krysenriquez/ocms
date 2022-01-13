from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()
router.register(r"getprofile",AccountProfileViewSet)
router.register(r"getmembers", AccountListViewSet)
router.register(r"getreferrals", AccountReferralsViewSet)
router.register(r"getunliten", AccountUnliTenViewSet)
router.register(r"getbinaryprofile", BinaryAccountProfileViewSet)
router.register(r"genealogy", GenealogyAccountViewSet)
router.register(r"getaccountcodes", CodeViewSet)
router.register(r"getallaccountcodes", CodeAdminViewSet)
router.register(r"getbinary", BinaryViewSet)
router.register(r"getbinaryaccountprofile", BinaryAccountProfileViewSet)
router.register(r"gettopbinarysummary", AccountBinaryViewSet)
router.register(r"gettopearners", AccountWalletViewSet)

urlpatterns = [
    path("create/", CreateAccountView.as_view()),
    path("verifyaccount/", VerifyAccountView.as_view()),
    path("getcodestatus/", GetCodeStatusView.as_view()),
    path("generatecode/", GenerateCodeView.as_view()),
    path("verifysponsorcode/", VerifySponsorCodeView.as_view()),
]

urlpatterns += router.urls
