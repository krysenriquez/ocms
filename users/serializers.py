from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from .models import *
from accounts.serializers import AccountAvatarSerializer


class ResetPasswordSerializer(serializers.Serializer):
    newPassword = serializers.CharField(required=True)
    user = serializers.IntegerField(required=True)

    class Meta:
        model = CustomUser
        fields = "__all__"

    def validate_new_password(self, value):
        validate_password(value)
        return value


class ChangePasswordSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(required=True)
    newPassword = serializers.CharField(required=True)
    user = serializers.IntegerField(required=True)

    class Meta:
        model = CustomUser
        fields = "__all__"

    def validate_new_password(self, value):
        validate_password(value)
        return value


class ContentTypeSerializer(ModelSerializer):
    class Meta:
        model = ContentType
        fields = "__all__"


class UserLogsDetailsSerializer(ModelSerializer):
    class Meta:
        model = LogDetails
        fields = "__all__"
        read_only_fields = ("logDetails",)


class UserLogsSerializer(ModelSerializer):
    actionTypeText = serializers.CharField(read_only=True)
    logDetails = UserLogsDetailsSerializer(many=True, required=False)
    userName = serializers.CharField(read_only=True)

    def create(self, validated_data):
        logDetails = validated_data.pop("logDetails")
        log = UserLogs.objects.create(**validated_data)

        for detail in logDetails:
            LogDetails.objects.create(**detail, logDetails=log)

        return log

    class Meta:
        model = UserLogs
        fields = "__all__"


class UserSerializer(ModelSerializer):
    def create(self, validated_data):
        user = CustomUser.objects.create(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.display_name = validated_data.get("display_name", instance.display_name)
        instance.email_address = validated_data.get("email_address", instance.email_address)
        instance.user_type = validated_data.get("user_type", instance.user_type)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.save()

        return instance

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "user_id",
            "display_name",
            "username",
            "email_address",
            "user_type",
            "is_active",
        ]


class UserAccountSerializer(ModelSerializer):
    account_user = AccountAvatarSerializer(many=True, required=False)
    remaining = serializers.IntegerField(required=False)

    class Meta:
        model = CustomUser
        fields = ["account_user", "remaining"]
