from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()
router.register(r"genealogy", GenealogyAccountViewSet)
router.register(r"getaccountcodes", CodeViewSet)

urlpatterns = [
    path("create/", CreateAccountView.as_view()),
    path("generatecode/", GenerateCodeView.as_view()),
    path("verifysponsorcode/", VerifySponsorCodeView.as_view()),
]

urlpatterns += router.urls
