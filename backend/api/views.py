from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response as DRFResponse
from .models import Application, Resume, Response, Communication
from .serializers import ApplicationSerializer, ResumeSerializer, ResponseSerializer, CommunicationSerializer

class CommunicationViewSet(viewsets.ModelViewSet):
    queryset = Communication.objects.all()
    serializer_class = CommunicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()   # no filtering by user
    serializer_class = ApplicationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()  # do not assign user

    @action(detail=True, methods=['get', 'post'], serializer_class=CommunicationSerializer)
    def communications(self, request, pk=None):
        app = self.get_object()
        if request.method == 'GET':
            serializer = self.get_serializer(app.communications.all(), many=True)
            return DRFResponse(serializer.data)
        elif request.method == 'POST':
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(application=app)
                return DRFResponse(serializer.data, status=201)
            return DRFResponse(serializer.errors, status=400)

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
