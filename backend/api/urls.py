# tracker/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, ResumeViewSet, ResponseViewSet, CommunicationViewSet

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'resumes', ResumeViewSet, basename='resumes')
router.register(r'responses', ResponseViewSet, basename='responses')
router.register(r'communications', CommunicationViewSet, basename='communications')
router.register(r'reminders', CommunicationViewSet, basename='reminders')
urlpatterns = [
    path('', include(router.urls)),
]
