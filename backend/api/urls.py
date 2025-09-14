# tracker/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, ResumeViewSet, ResponseViewSet, CommunicationViewSet, pdf_to_markdown_view, markdown_to_pdf_view

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'resumes', ResumeViewSet, basename='resumes')
router.register(r'responses', ResponseViewSet, basename='responses')
router.register(r'communications', CommunicationViewSet, basename='communications')

urlpatterns = [
    path('', include(router.urls)),
    path('pdf-to-markdown/', pdf_to_markdown_view),  # New endpoint for PDF to Markdown conversion
    path('markdown-to-pdf/', markdown_to_pdf_view),  # New endpoint for Markdown to PDF conversion
]
