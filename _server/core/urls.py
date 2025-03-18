from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('grocery_lists/', views.create_list, name="create_list"),
    path("api/chat/", views.ai_chat, name="ai_chat"),
]