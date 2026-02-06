from django.contrib import admin

from .models import Image, Location, Property


admin.site.register(Location)
admin.site.register(Property)
admin.site.register(Image)
