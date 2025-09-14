from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response as DRFResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from .models import Application, Resume, Response, Communication, Reminder
from .serializers import ApplicationSerializer, ResumeSerializer, ResponseSerializer, CommunicationSerializer, ReminderSerializer
import os
import tempfile
import pdfplumber
from markdownify import markdownify as md
import markdown2
from weasyprint import HTML
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered
from django.utils import timezone

# Initialize once (expensive if re-created every call)
converter = PdfConverter(artifact_dict=create_model_dict())

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

class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all().order_by("-due_at")
    serializer_class = ReminderSerializer
    permission_classes = [AllowAny]

    # GET /api/reminders/due/
    @action(detail=False, methods=["get"])
    def due(self, request):
        now = timezone.now()
        qs = Reminder.objects.filter(sent_at__isnull=True, due_at__lte=now)
        data = ReminderSerializer(qs, many=True).data
        # mark them as sent so we don't show twice
        qs.update(sent_at=now)
        return Response(data)

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

# ---------- Helpers ----------
def pdf_to_markdown(pdf_path):
    """
    Convert a PDF file into Markdown using marker.
    """
    rendered = converter(pdf_path)
    text, _, _ = text_from_rendered(rendered)
    return text  # already plain text / markdown-like

def markdown_to_pdf(markdown_text, output_file):
    """
    Convert Markdown text into a PDF.
    """
    html = markdown2.markdown(markdown_text)
    HTML(string=html).write_pdf(output_file)


# ---------- API Views ----------
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def pdf_to_markdown_view(request):
    """
    Upload a PDF resume, convert it to Markdown with marker,
    and store in the Resume model.
    """
    pdf_file = request.FILES.get('file')
    title = request.data.get("title", "Untitled Resume")
    application_id = request.data.get("application_id")  # optional

    if not pdf_file:
        return JsonResponse({"error": "No PDF file uploaded."}, status=400)

    # Save PDF temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        for chunk in pdf_file.chunks():
            tmp.write(chunk)
        tmp_path = tmp.name

    # Convert PDF → Markdown
    try:
        markdown_text = pdf_to_markdown(tmp_path)
    finally:
        os.unlink(tmp_path)

    # Attach to application if provided
    application = None
    if application_id:
        try:
            application = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return JsonResponse({"error": "Application not found."}, status=404)

    # Save Resume object
    resume = Resume.objects.create(
        title=title,
        content_md=markdown_text,
        application=application if application else None,
        is_master=(application is None),  # Master if not tied to an application
    )

    return JsonResponse({
        "id": resume.id,
        "title": resume.title,
        "content_md": resume.content_md,
        "is_master": resume.is_master,
        "application_id": resume.application.id if resume.application else None,
    })


@api_view(['POST'])
def markdown_to_pdf_view(request):
    """
    Convert Resume Markdown back to PDF.
    Can accept either raw markdown or a resume_id.
    """
    markdown_text = request.data.get("markdown")
    resume_id = request.data.get("resume_id")

    if not markdown_text and not resume_id:
        return JsonResponse({"error": "Provide either markdown text or a resume_id."}, status=400)

    # If resume_id provided, load from DB
    if resume_id:
        try:
            resume = Resume.objects.get(id=resume_id)
            markdown_text = resume.content_md
        except Resume.DoesNotExist:
            return JsonResponse({"error": "Resume not found."}, status=404)

    # Save PDF to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        output_file = tmp.name
        markdown_to_pdf(markdown_text, output_file)

    with open(output_file, "rb") as f:
        pdf_data = f.read()
    os.unlink(output_file)

    response = HttpResponse(pdf_data, content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="resume.pdf"'
    return response

