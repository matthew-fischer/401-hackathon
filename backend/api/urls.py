# tracker/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, ResumeViewSet, ResponseViewSet, ReminderViewSet, due_notifications

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'resumes', ResumeViewSet, basename='resumes')
router.register(r'responses', ResponseViewSet, basename='responses')
router.register(r"reminders", ReminderViewSet)

urlpatterns = [
    path('', include(router.urls)),
     path("api/", include(router.urls)),
     path("api/notifications/", due_notifications),
]
