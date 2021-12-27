from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.utils import timezone
from .models import *


class SettingsSerializer(ModelSerializer):
    def update(self, instance, validated_data):
        instance.value = validated_data.get("value", instance.value)
        instance.save()

        return instance

    class Meta:
        model = Setting
        fields = [
            "property",
            "value",
        ]
