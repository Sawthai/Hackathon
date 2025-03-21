from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path("api/chat/", views.ai_chat,  name="ai_chat"),
    path('grocery_lists/', views.create_list, name="create_list"),
    path('api/chat/history/', views.summarize_chat_history, name="ai_summary")
    # path("api/previous_context/", views.previous_context, name="previous_context"),
]


