from rest_framework.routers import DefaultRouter
from .api import *
from django.urls import path

router = DefaultRouter()
router.register(r"accountavatar", AccountAvatar)
router.register(r"genealogy", GenealogyAccountViewSet)
router.register(r"codes", CodeViewSet)

urlpatterns = [path("generatecode/", GenerateCodeView.as_view())]

urlpatterns += router.urls
