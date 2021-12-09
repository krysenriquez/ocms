from django.urls import path
from .api import AdminLoginView, GetCryptoKey, LogoutView, MemberLoginView, WhoAmIView

urlpatterns = [
    path("admin/", AdminLoginView.as_view()),
    path("member/", MemberLoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("whoami/", WhoAmIView.as_view()),
    path("get/", GetCryptoKey.as_view()),
]
