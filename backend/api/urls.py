from django.urls import path
from . import views
urlpatterns = [
    path("applications/", views.get_applications),
    path("applications/<int:pk>/", views.get_applications),
    path("resumes/", views.get_resumes),
    path("resumes/<int:resume_id>/versions/", views.get_resume_versions),
    path("applications/<int:application_id>/comms/", views.get_communications),
    path("reminders/", views.get_reminders),
    path("reminders/<int:pk>/", views.get_reminders),
]
