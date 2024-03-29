from django import forms
from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import *


class UserCreationForm(forms.ModelForm):
    password = forms.CharField(label="Password", widget=forms.PasswordInput)
    password_confirm = forms.CharField(label="Password confirmation", widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ("username", "email_address")

    def clean_password2(self):
        password = self.cleaned_data.get("password")
        password_confirm = self.cleaned_data.get("password_confirm")
        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError("Passwords don't match")
        return password_confirm

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):

    password = ReadOnlyPasswordHashField(
        label=("Password"),
        help_text=(
            "Raw passwords are not stored, so there is no way to see "
            "this user's password, but you can change the password "
            'using <a href="../password/">this form</a>.'
        ),
    )

    class Meta:
        model = CustomUser
        fields = ("username", "email_address", "password", "user_type", "is_active")

    def clean_password(self):
        return self.initial["password"]


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    model = CustomUser

    list_display = ("username", "display_name", "email_address", "is_active", "is_staff", "is_superuser")
    list_filter = ("is_staff", "is_active", "user_type")
    fieldsets = (
        (None, {"fields": ("username", "email_address", "display_name", "password")}),
        (
            "Permissions",
            {
                "fields": (
                    "user_type",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "user_permissions",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email_address",
                    "display_name",
                    "password",
                    "password_confirm",
                ),
            },
        ),
    )
    search_fields = (
        "username",
        "email_address",
    )
    ordering = (
        "-id",
        "username",
        "email_address",
    )
    filter_horizontal = ()


users_models = [UserLogs, LogDetails]
admin.site.register(LogEntry)
admin.site.unregister(Group)
admin.site.register(CustomUser, UserAdmin)
admin.site.register(users_models)
