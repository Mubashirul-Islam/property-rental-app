from django.shortcuts import render

from .models import Property


def property_grid(request):
    properties = (
        Property.objects.filter(is_active=True)
        .select_related("location")
        .prefetch_related("images")
        .order_by("-created_at")
    )
    return render(request, "property_grid.html", {"properties": properties})
