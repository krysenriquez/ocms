from rest_framework import status, views, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.db.models import Q, Prefetch, F, Value as V, query
from django.db.models.functions import Concat
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from .serializers import *
from .models import *


class AccountAvatar(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountAvatarSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Account.objects.exclude(is_deleted=True)
        user_id = self.request.user.id
        if user_id is not None:
            queryset = queryset.filter(user=user_id)

            return queryset


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


class GenealogyAccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = GenealogyAccountSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = (
            Account.objects.prefetch_related(
                Prefetch(
                    "children",
                    queryset=Account.objects.prefetch_related(
                        Prefetch(
                            "children",
                            queryset=Account.objects.annotate(
                                accountName=Concat(
                                    F("first_name"),
                                    V(" "),
                                    F("middle_name"),
                                    V(" "),
                                    F("last_name"),
                                ),
                            )
                            .order_by("parent_side")
                            .all(),
                        )
                    )
                    .annotate(
                        account_name=Concat(
                            F("first_name"),
                            V(" "),
                            F("middle_name"),
                            V(" "),
                            F("last_name"),
                        ),
                    )
                    .order_by("parent_side")
                    .all(),
                ),
            )
            .annotate(
                account_name=Concat(F("first_name"), V(" "), F("middle_name"), V(" "), F("last_name")),
            )
            .all()
        )

        account_id = self.request.query_params.get("account_id", None)
        # accountNumber = self.request.query_params.get("accountNumber", None)

        if account_id is not None:
            queryset = queryset.filter(account_id=account_id)

            # if accountNumber is not None:
            #     accountNumbers = []
            #     for member in queryset:
            #         member.accountNumber = member.f_pk()
            #         if member.accountNumber == accountNumber:
            #             accountNumbers.append(member.pk)
            #     queryset = queryset.filter(accountId__in=accountNumbers)

            # for member in queryset:
            #     member.all_children_left_count = member.get_all_children_left_count()
            #     member.all_children_right_count = member.get_all_children_right_count()

            return queryset


class GenerateCodeView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = GenerateCodeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                data={"response_id": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                data={"response_id": status.HTTP_404_NOT_FOUND},
                status=status.HTTP_404_NOT_FOUND,
            )


class CodeViewSet(ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Code.objects.exclude(is_deleted=True)
        account_id = self.request.query_params.get("account_id", None)

        if account_id is not None:
            queryset = queryset.filter(account__account_id=account_id)

            return queryset