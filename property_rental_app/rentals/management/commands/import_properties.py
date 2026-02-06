import csv
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

from rentals.models import Property, Location


class Command(BaseCommand):
    help = "Import properties from CSV file"

    def add_arguments(self, parser):
        parser.add_argument(
            "csv_file",
            type=str,
            help="Path to properties CSV file",
        )

    def handle(self, *args, **options):
        csv_file = options["csv_file"]
        created = 0
        skipped = 0

        with open(csv_file, newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                location = Location.objects.filter(
                    id=row["location_id"]
                ).first()

                if not location:
                    skipped += 1
                    continue

                prop, is_created = Property.objects.get_or_create(
                    id=row["id"],
                    defaults={
                        "title": row["title"],
                        "description": row["description"],
                        "price_per_night": row["price_per_night"],
                        "bedrooms": row["bedrooms"],
                        "bathrooms": row["bathrooms"],
                        "max_guests": row["max_guests"],
                        "is_active": row["is_active"].lower() == "true",
                        "created_at": parse_datetime(row["created_at"]),
                        "location": location,
                    },
                )

                if is_created:
                    created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"{created} properties imported, {skipped} skipped (missing location)"
            )
        )
