from rest_framework import serializers
from core.models import Location, Property, Image


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image', 'alt_text', 'is_primary']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'address', 'city', 'country', 'latitude', 'longitude']


class PropertySerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'price_per_night',
            'bedrooms', 'bathrooms', 'max_guests', 'is_active',
            'created_at', 'location', 'images', 'primary_image'
        ]
    
    def get_primary_image(self, obj):
        primary = obj.primary_image()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.url)
            return primary.url
        return None
