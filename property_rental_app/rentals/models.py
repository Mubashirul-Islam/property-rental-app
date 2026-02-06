from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=120)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.city})"


class Property(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    bedrooms = models.PositiveSmallIntegerField(default=1)
    bathrooms = models.DecimalField(max_digits=4, decimal_places=1, default=1)
    max_guests = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="properties")
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self) -> str:
        return self.title


class Image(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image_url = models.URLField(max_length=500)
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Image for {self.property_id}"
