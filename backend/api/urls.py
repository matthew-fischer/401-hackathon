# tracker/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, ResumeViewSet, ResponseViewSet

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'resumes', ResumeViewSet, basename='resumes')
router.register(r'responses', ResponseViewSet, basename='responses')

urlpatterns = [
    path('', include(router.urls)),
]
