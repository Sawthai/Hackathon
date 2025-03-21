from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path("api/chat/", views.ai_chat,  name="ai_chat"),
    path('grocery_lists/', views.create_list, name="create_list"),
]


