from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Application, Resume, Response
from .serializers import ApplicationSerializer, ResumeSerializer, ResponseSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()   # no filtering by user
    serializer_class = ApplicationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()  # do not assign user

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()

class ResponseViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()
