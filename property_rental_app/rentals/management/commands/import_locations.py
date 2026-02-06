import csv
from django.core.management.base import BaseCommand
from rentals.models import Location


class Command(BaseCommand):
    help = "Import locations from CSV file"

    def add_arguments(self, parser):
        parser.add_argument(
            "csv_file",
            type=str,
            help="Path to locations CSV file",
        )

    def handle(self, *args, **options):
        csv_file = options["csv_file"]
        created = 0

        with open(csv_file, newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                location, is_created = Location.objects.get_or_create(
                    id=row["id"],
                    defaults={
                        "address": row["address"],
                        "city": row["city"],
                        "country": row["country"],
                        "latitude": row["latitude"] or None,
                        "longitude": row["longitude"] or None,
                    },
                )

                if is_created:
                    created += 1

        self.stdout.write(
            self.style.SUCCESS(f"{created} locations imported successfully")
        )
