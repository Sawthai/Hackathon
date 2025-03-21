from django.db import models
from django.contrib.auth.models import User

class GroceryList(models.Model):
    name = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Item(models.Model):
    name = models.TextField()
    purchased = models.BooleanField()
    grocery_list = models.ForeignKey("GroceryList", on_delete=models.CASCADE)

class ChatMessage(models.Model):
    SENDER_CHOICES = (
        ('user', 'User'),
        ('bot', 'Bot'),
    )
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Make optional

    def __str__(self):
        return f"{self.sender} at {self.timestamp}: {self.message[:50]}"