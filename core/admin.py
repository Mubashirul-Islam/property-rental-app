from django.contrib import admin

from .models import Image, Location, Property


class ImageInline(admin.TabularInline):
	model = Image
	extra = 1
	fields = ("image", "alt_text", "is_primary")


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
	list_display = ("address", "city", "country", "latitude", "longitude")
	list_filter = ("country", "city")
	search_fields = ("address", "city", "country")
	ordering = ("country", "city", "address")


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
	list_display = (
		"title",
		"location",
		"price_per_night",
		"bedrooms",
		"bathrooms",
		"max_guests",
		"is_active",
		"created_at",
	)
	list_filter = ("is_active", "location__country", "location__city")
	search_fields = ("title", "description", "location__address", "location__city")
	ordering = ("-created_at",)
	list_select_related = ("location",)
	readonly_fields = ("created_at",)
	inlines = [ImageInline]
	fieldsets = (
		("Listing", {"fields": ("title", "description", "location")}),
		(
			"Details",
			{
				"fields": (
					"price_per_night",
					"bedrooms",
					"bathrooms",
					"max_guests",
					"is_active",
				)
			},
		),
		("Timestamps", {"fields": ("created_at",)}),
	)


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
	list_display = ("property", "alt_text", "is_primary")
	list_filter = ("is_primary",)
	search_fields = ("property__title", "alt_text")
