from django.db import models
from django.conf import settings

class Todo(models.Model):
    label = models.CharField(max_length=128)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
