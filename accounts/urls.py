from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()
router.register(r"getmembers", AccountListViewSet)
router.register(r"getunliten", AccountUnliTenViewSet)
router.register(r"genealogy", GenealogyAccountViewSet)
router.register(r"getaccountcodes", CodeViewSet)
router.register(r"getbinary", BinaryViewSet)

urlpatterns = [
    path("create/", CreateAccountView.as_view()),
    path("generatecode/", GenerateCodeView.as_view()),
    path("verifysponsorcode/", VerifySponsorCodeView.as_view()),
    path("test/", TestView.as_view()),
]

urlpatterns += router.urls
