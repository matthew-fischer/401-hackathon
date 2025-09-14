from rest_framework import serializers
from .models import Application, Resume, Response, Communication, Reminder

class CommunicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Communication
        fields = ['id', 'date_received', 'type', 'notes']

class ApplicationSerializer(serializers.ModelSerializer):
    communications = CommunicationSerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'company_name', 'position', 'date_applied', 'status', 'notes', 'communications']


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = "__all__"
        read_only_fields = ("id","sent_at","created_at")