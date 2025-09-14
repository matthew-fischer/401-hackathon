from rest_framework import serializers
from .models import Application, Resume, Response, Communication

class CommunicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Communication
        fields = ['id', 'date_received', 'type', 'notes']

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'title', 'content_md']
        read_only_fields = ['id']

class ApplicationSerializer(serializers.ModelSerializer):
    communications = CommunicationSerializer(many=True, read_only=True)
    resume = ResumeSerializer(required=False)  # nested resume for creation

    class Meta:
        model = Application
        fields = ['id', 'company_name', 'position', 'date_applied', 'status', 'notes', 'communications', 'resume']

    def create(self, validated_data):
        resume_data = validated_data.pop('resume', None)
        # Create the application first
        application = Application.objects.create(**validated_data)
        if resume_data:
            # Create a new Resume and link it to the application
            resume = Resume.objects.create(**resume_data)
            application.resume = resume
            application.save()
        return application

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'
