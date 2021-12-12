from settings.models import *
from settings.enums import *


def get_settings():
    return Setting.objects.all()


def get_setting(property):
    return Setting.objects.get(property=property).value
