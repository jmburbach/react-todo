from django.db import models


class Item(models.Model):
    label = models.CharField(max_length=128)
    completed = models.BooleanField(default=False)
