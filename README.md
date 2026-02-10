# Property Rental App

## Overview

Property Rental App is a Django project that provides a minimal property search UI and a small REST API for locations and listings. The UI includes a home search page with autocomplete, a results page with pagination, and a property detail page with an image carousel.

## Features

- Location search with autocomplete
- Property results with client-side pagination (8 per page)
- Property detail view with multi-image carousel
- Django admin with inline image management

## Tech Stack

- Django
- Django REST Framework
- SQLite
- Vanilla HTML, CSS, JS

## Getting Started

#### 1. Clone the Repository

```bash
git clone https://github.com/Mubashirul-Islam/property-rental-app.git
```

#### 2. Navigate to project directory

```bash
cd property-rental-app
```

#### 3. Create Virtual Environment

(recommended)

```bash
uv venv
```

or

```bash
python3 -m venv .venv
```

#### 4. Activate Virtual Environment

```bash
source .venv/bin/activate
```

#### 5. Install Dependencies

```bash
uv sync
```

or

```bash
pip install -r requirements.txt
```

#### 6. Create superuser for admin access

```bash
python manage.py createsuperuser
```

#### 7. Run Server

```bash
python manage.py runserver
```

The application will be accessible at `http://127.0.0.1:8000/`

## Project Structure

```
property-rental-app/
├── config/                # Django project settings and URLs
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── core/                  # Main app (models, views, admin)
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   ├── api/               # DRF serializers and API views
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── management/        # Custom management commands
│   │   └── commands/
│   │       ├── import_locations.py
│   │       └── import_properties.py
│   ├── migrations/
│   └── templates/         # App templates (unused if using root templates/)
├── templates/             # HTML templates
│   ├── base.html
│   ├── home.html
│   ├── property_list.html
│   └── property_detail.html
├── static/                # Frontend assets
│   ├── css/
│   │   ├── base.css
│   │   ├── home.css
│   │   ├── properties.css
│   │   └── detail.css
│   └── js/
│       ├── home.js
│       ├── properties.js
│       └── detail.js
├── media/                 # Uploaded media (dev)
│   └── property_images/
├── db.sqlite3             # SQLite database
├── manage.py
├── locations.csv          #Dummy data
├── properties.csv         #Dummy data
└── README.md
```

## Frontend Pages

- / : Home search page
- /properties/ : Results page (expects city or country query param)
- /properties/`<id>`/ : Property detail page

## API Endpoints

- /api/locations/ : List all locations
- /api/properties/?city=CityName : Properties filtered by city
- /api/properties/?country=CountryName : Properties filtered by country
- /api/properties/`<id>`/ : Property details

## Notes

- Media files are served from /media/ in development.
- Static assets are in static/ and templates are in templates/.
