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
    account_name = serializers.CharField(source="account.get_account_name", required=False)
    account_number = serializers.CharField(source="account.get_account_number", required=False)

    class Meta:
        model = Activity
        fields = [
            "wallet",
            "account_name",
            "account_number",
            "activity_type",
            "amount",
            "activity_details",
            "created",
            "modified",
        ]


class CashoutDetailsSerializer(ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = CashoutDetails
        fields = "__all__"
        read_only_fields = ("cashout",)


class CreateCashoutSerializer(ModelSerializer):
    id = serializers.IntegerField(required=False)
    details = CashoutDetailsSerializer(many=True, required=False)
    account_name = serializers.CharField(source="account.get_account_name", required=False)

    def create(self, validated_data):
        details = validated_data.pop("details")
        cashout = Cashout.objects.create(**validated_data)

        for detail in details:
            CashoutDetails.objects.create(**detail, cashout=cashout)

        return cashout

    def update(self, instance, validated_data):
        instance.status = validated_data.get("status", instance.status)
        instance.approved_date = validated_data.get("approved_date", instance.approved_date)
        instance.approved_by = validated_data.get("approved_by", instance.approved_by)
        instance.released_date = validated_data.get("released_date", instance.released_date)
        instance.released_by = validated_data.get("released_by", instance.released_by)
        instance.save()

        return instance

    class Meta:
        model = Cashout
        fields = "__all__"


class CashoutMemberSerializer(ModelSerializer):
    details = CashoutDetailsSerializer(many=True, required=False)
    cashout_number = serializers.CharField(source="get_cashout_number", required=False)

    class Meta:
        model = Cashout
        fields = [
            "cashout_number",
            "amount",
            "status",
            "released_date",
            "approved_date",
            "details",
        ]


class CashoutAdminSerializer(ModelSerializer):
    details = CashoutDetailsSerializer(many=True, required=False)
    cashout_number = serializers.CharField(source="get_cashout_number", required=False)
    account_number = serializers.CharField(source="account.get_account_number", required=False)
    account_name = serializers.CharField(source="account.get_account_name", required=False)

    class Meta:
        model = Cashout
        fields = [
            "cashout_number",
            "account_number",
            "account_name",
            "amount",
            "status",
            "released_date",
            "approved_date",
            "details",
        ]
