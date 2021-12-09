from django.db import models


class StringProperty(models.Model):
    property = models.CharField(max_length=255, null=True, blank=True)
    value = models.IntegerField(default=10)

    class Meta:
        ordering = ["property"]

    def __str__(self):
        return "%s - %s" % (self.property, self.value.toString())
