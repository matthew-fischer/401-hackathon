from django.contrib import admin

from .models import Application, Resume, Response

admin.site.register(Application)
admin.site.register(Resume)
admin.site.register(Response)