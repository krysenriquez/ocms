"""ocms URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from django.shortcuts import redirect

urlpatterns = [
    path("developers-admin/", admin.site.urls),
    # Oc-Admin
    path("oc-admin", lambda request: redirect("oc-admin/login", permanent=False)),
    path("oc-admin/login", ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html"))),
    path(
        "oc-admin/dashboard", ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html"))
    ),
    path("oc-admin/wallets", ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html"))),
    path(
        "oc-admin/cash-outs", ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html"))
    ),
    path("oc-admin/members", ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html"))),
    path(
        "oc-admin/sales-matches",
        ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html")),
    ),
    path(
        "oc-admin/flush-outs", ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html"))
    ),
    path(
        "oc-admin/referrals", ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html"))
    ),
    path(
        "oc-admin/unli-ten", ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html"))
    ),
    path(
        "oc-admin/activation-codes",
        ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html")),
    ),
    path(
        "oc-admin/system-settings",
        ensure_csrf_cookie(TemplateView.as_view(template_name="admins/base.html")),
    ),
    # Member
    path("", lambda request: redirect("member/login", permanent=False)),
    path("login", lambda request: redirect("member/login", permanent=False)),
    path("member", lambda request: redirect("member/login", permanent=False)),
    path("member/login", ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html"))),
    path(
        "member/dashboard", ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html"))
    ),
    path(
        "member/genealogy", ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html"))
    ),
    path("member/earn", ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html"))),
    path(
        "member/activation-codes",
        ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html")),
    ),
    path("member/cashout", ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html"))),
    path("member/profile", ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html"))),
    path("member/account", ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html"))),
    path(
        "member/account/edit",
        ensure_csrf_cookie(TemplateView.as_view(template_name="members/base.html")),
    ),
    # APIs
    path("webapi/users/", include("users.urls"), name="users"),
    path("webapi/auth/", include("auth.urls"), name="auth"),
    path("webapi/accounts/", include("accounts.urls"), name="accounts"),
    path("webapi/activities/", include("activities.urls"), name="activities"),
    path("webapi/settings/", include("settings.urls"), name="settings"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "One Creations Marketing Admin"
admin.site.site_title = "One Creations Marketing"
admin.site.index_title = "Welcome to One Creations Marketing Admin"
admin.autodiscover()

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL)
