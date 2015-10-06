# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


def update_todos(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Todo = apps.get_model('todo', 'Todo')
    user = User.objects.all()[0]
    Todo.objects.update(user=user)


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='user',
            field=models.ForeignKey(null=True, to=settings.AUTH_USER_MODEL),
        ),
        migrations.RunPython(update_todos),
        migrations.AlterField(
            model_name='todo',
            name='user',
            field=models.ForeignKey(null=False, to=settings.AUTH_USER_MODEL),
        ),
    ]
