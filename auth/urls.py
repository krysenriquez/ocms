from django.urls import path
from .api import AdminLoginView, LogoutView, MemberLoginView, WhoAmIView

urlpatterns = [
    path("admin/", AdminLoginView.as_view()),
    path("member/", MemberLoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("whoami/", WhoAmIView.as_view()),
]
