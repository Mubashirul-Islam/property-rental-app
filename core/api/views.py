from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.models import Location, Property
from .serializers import LocationSerializer, PropertySerializer
from rest_framework.views import APIView


class LocationListView(generics.ListAPIView):
    """
    API endpoint that returns all cities and countries from the Locations table.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"locations": serializer.data})


class PropertyByLocationView(APIView):
    """
    API endpoint that returns properties filtered by city or country.
    Query params: ?city=Dhaka  OR  ?country=Bangladesh
    """
    def get(self, request):
        city = request.query_params.get('city', None)
        country = request.query_params.get('country', None)
        
        properties = Property.objects.filter(is_active=True)
        
        if city:
            properties = properties.filter(location__city__iexact=city)
        if country:
            properties = properties.filter(location__country__iexact=country)
        
        serializer = PropertySerializer(properties, many=True, context={'request': request})
        
        return Response({
            "count": properties.count(),
            "properties": serializer.data
        })


class PropertyDetailView(APIView):
    """
    API endpoint that returns a single property by its ID.
    """
    def get(self, request, property_id):
        property_obj = get_object_or_404(Property, id=property_id, is_active=True)
        serializer = PropertySerializer(property_obj, context={'request': request})
        
        return Response({
            "property": serializer.data
        })