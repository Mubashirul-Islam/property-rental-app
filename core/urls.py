from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("properties/", views.property_list, name="property-list"),
    path("properties/<int:property_id>/", views.property_detail, name="property-detail"),
]
