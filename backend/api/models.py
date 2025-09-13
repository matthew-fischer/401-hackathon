from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=200)
    website = models.URLField(blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Resume(models.Model):
    """
    Stores both master resume and tailored resumes.
    Use `is_master=True` for the main resume.
    """
    is_master = models.BooleanField(default=False)
    text = models.TextField(blank=True)   # markdown / plain text
    file = models.FileField(upload_to="resumes/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{'Master' if self.is_master else 'Tailored'} Resume #{self.id}"


class Application(models.Model):
    STATUS_CHOICES = [
        ("saved", "Saved"),
        ("applied", "Applied"),
        ("phone", "Phone Screen"),
        ("onsite", "Onsite"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    job_url = models.URLField(blank=True)
    date_applied = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="saved")
    notes = models.TextField(blank=True)

    # Optional: which resume was used for this application
    resume_used = models.ForeignKey(
        Resume, null=True, blank=True, on_delete=models.SET_NULL, related_name="applications"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} @ {self.company.name} ({self.status})"


class Communication(models.Model):
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="communications"
    )
    date = models.DateTimeField()
    channel = models.CharField(max_length=50, blank=True)  # email, phone, LinkedIn, etc.
    summary = models.TextField()
    raw_text = models.TextField(blank=True)

    def __str__(self):
        return f"Comm on {self.date.date()} - {self.channel}"


class Reminder(models.Model):
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="reminders"
    )
    date_due = models.DateTimeField()
    message = models.CharField(max_length=255)
    done = models.BooleanField(default=False)

    def __str__(self):
        return f"Reminder: {self.message} ({'done' if self.done else 'pending'})"
