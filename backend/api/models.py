from django.db import models
from django.contrib.auth.models import User

class Application(models.Model):
    STAGE_CHOICES = [
        ('applied', 'Applied'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('rejected', 'Rejected'),
    ]

    company_name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    date_applied = models.DateField()
    status = models.CharField(max_length=20, choices=STAGE_CHOICES, default='applied')
    notes = models.TextField(blank=True, null=True)
    resume = models.OneToOneField(
        'Resume',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='application'
    )

    def __str__(self):
        return f"{self.position} at {self.company_name}"

class Resume(models.Model):
    title = models.CharField(max_length=100)
    content_md = models.TextField()
    is_master = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({'Master' if self.is_master else 'Tailored'})"

class Response(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    date_received = models.DateField()
    type = models.CharField(max_length=20, choices=[('interview', 'Interview'), ('rejection', 'Rejection'), ('offer', 'Offer')])
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.type} for {self.application.position} at {self.application.company_name}"
    
class Communication(models.Model):
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="communications"
    )
    date_received = models.DateField()
    type = models.CharField(
        max_length=20,
        choices=[
            ('interview', 'Interview Invitation'),
            ('rejection', 'Rejection'),
            ('offer', 'Job Offer'),
            ('communication', 'Communication'),
        ]
    )
    notes = models.TextField(blank=True, null=True)

