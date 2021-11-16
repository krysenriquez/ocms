from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.db.models import Q, Prefetch, F, Value as V
from django.db.models.functions import Concat
from .serializers import *
from .models import *


class AccountViewSet(ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id", None)

        if user_id is not None:
            queryset = Account.objects.filter(user_id=user_id).exclude(is_active=False)
            if queryset.exists():
                return queryset
        else:
            return Response(
                data={"message": "Account not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
