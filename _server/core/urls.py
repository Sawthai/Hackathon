from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path("api/chat/", views.ai_chat, name="ai_chat"),
    path('session_lists/', views.create_session_list, name="create_session_list"),
        path('view_session_lists/', views.my_session_lists, name="my_session_lists"),
            path('session_lists/<int:id>/delete/', views.delete_session_list, name="delete_session_list"),
]
