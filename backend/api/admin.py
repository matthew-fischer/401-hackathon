from django.contrib import admin
from django.apps import apps

class AutoIDAdmin(admin.ModelAdmin):
    def __init__(self, model, admin_site):
        super().__init__(model, admin_site)
        # Prepend 'id' to whatever Django was going to display
        if not self.list_display or self.list_display == ('__str__',):
            self.list_display = ('id', '__str__')
        else:
            self.list_display = ('id',) + tuple(self.list_display)

# Auto-register all your models with AutoIDAdmin
app = apps.get_app_config('api')  # replace 'api' with your app name
for model_name, model in app.models.items():
    try:
        admin.site.register(model, AutoIDAdmin)
    except admin.sites.AlreadyRegistered:
        pass
