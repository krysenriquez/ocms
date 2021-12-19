from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.utils import timezone
from .models import *


class ActivitySerializer(ModelSerializer):
    amount = serializers.DecimalField(
        required=False,
        decimal_places=2,
        max_digits=13,
    )
    activity_details = serializers.CharField(source="get_activity_details", required=False)

    class Meta:
        model = Activity
        fields = [
            "activity_type",
            "amount",
            "activity_details",
        ]


class CashoutDetailsSerializer(ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = CashoutDetails
        fields = "__all__"
        read_only_fields = ("cashout",)


class CreatCashoutSerializer(ModelSerializer):
    id = serializers.IntegerField(required=False)
    details = CashoutDetailsSerializer(many=True, required=False)
    account_name = serializers.CharField(source="account.get_account_name", required=False)

    def create(self, validated_data):
        details = validated_data.pop("details")
        cashout = Cashout.objects.create(**validated_data)

        for detail in details:
            CashoutDetails.objects.create(**detail, cashout=cashout)

        return cashout

    class Meta:
        model = Cashout
        fields = "__all__"


class CashoutSerializer(ModelSerializer):
    details = CashoutDetailsSerializer(many=True, required=False)

    class Meta:
        model = Cashout
        fields = [
            "amount",
            "status",
            "released_date",
            "approved_date",
            "details",
        ]
