from django.contrib import admin

from .models import Application, Resume, Company, Communication, Reminder

admin.site.register(Application)
admin.site.register(Resume)
admin.site.register(Company)
admin.site.register(Communication)
admin.site.register(Reminder)