from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # start background scheduler once (avoid double start with autoreload)
        import os
        if os.environ.get("RUN_MAIN") != "true":
            return
        from apscheduler.schedulers.background import BackgroundScheduler
        from django.utils import timezone
        from django.core.mail import send_mail
        from django.conf import settings
        from .models import Reminder

        def dispatch_due():
            now = timezone.now()
            for r in Reminder.objects.filter(channel="email", sent_at__isnull=True, due_at__lte=now):
                if r.email:
                    try:
                        send_mail(
                            "Follow-up reminder",
                            r.message or f"Follow up on {r.application.company} – {r.application.role}",
                            getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
                            [r.email],
                            fail_silently=True,
                        )
                    except Exception:
                        pass
                r.mark_sent()

        sched = BackgroundScheduler(timezone=settings.TIME_ZONE)
        sched.add_job(dispatch_due, "interval", seconds=60, id="reminders", replace_existing=True)
        sched.start()
