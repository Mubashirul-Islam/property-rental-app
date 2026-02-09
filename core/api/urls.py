from django.urls import path
from .views import LocationListView, PropertyByLocationView, PropertyDetailView

urlpatterns = [
    path('locations/', LocationListView.as_view(), name='location-list'),
    path('properties/', PropertyByLocationView.as_view(), name='property-by-location'),
    path('properties/<int:property_id>/', PropertyDetailView.as_view(), name='property-detail'),
]
