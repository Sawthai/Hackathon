from django.db import models
from django.contrib.auth.models import User

class SessionList(models.Model):
    name = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Item(models.Model):
    name = models.TextField()
    session_list = models.ForeignKey(SessionList, on_delete=models.CASCADE)
