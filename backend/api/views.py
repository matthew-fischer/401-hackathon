# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Application, Resume, Communication, Reminder
from .serializers import ApplicationSerializer, ResumeSerializer, CommunicationSerializer, ReminderSerializer
from rest_framework import generics
from rest_framework import status
from rest_framework.views import APIView

@api_view(['GET', 'POST'])
def get_applications(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                app = Application.objects.get(pk=pk)
                serializer = ApplicationSerializer(app)
                return Response(serializer.data)
            except Application.DoesNotExist:
                return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            apps = Application.objects.all()
            serializer = ApplicationSerializer(apps, many=True)
            return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PATCH':
        try:
            app = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ApplicationSerializer(app, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        try:
            app = Application.objects.get(pk=pk)
            app.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Application.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_resumes(request):
    resumes = Resume.objects.all()
    serializer = ResumeSerializer(resumes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def get_resume_versions(request, resume_id):
    try:
        resume = Resume.objects.get(pk=resume_id)
    except Resume.DoesNotExist:
        return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
    data = request.data.copy()
    data['resume'] = resume_id
    serializer = ResumeVersionSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def get_communications(request, application_id):
    if request.method == 'GET':
        comms = Communication.objects.filter(application_id=application_id)
        serializer = CommunicationSerializer(comms, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data.copy()
        data['application'] = application_id
        serializer = CommunicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'PATCH'])
def get_reminders(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                reminder = Reminder.objects.get(pk=pk)
                serializer = ReminderSerializer(reminder)
                return Response(serializer.data)
            except Reminder.DoesNotExist:
                return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            reminders = Reminder.objects.all()
            serializer = ReminderSerializer(reminders, many=True)
            return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ReminderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PATCH':
        try:
            reminder = Reminder.objects.get(pk=pk)
        except Reminder.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReminderSerializer(reminder, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)