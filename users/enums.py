from django.db import models
from django.utils.translation import ugettext_lazy as _


class UserType(models.TextChoices):
    DEVELOPER = "DEVELOPER", _("Developer")
    ADMIN = "ADMIN", _("Admin")
    MEMBER = "MEMBER", _("Member")
