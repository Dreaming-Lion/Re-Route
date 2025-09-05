#!/usr/bin/env bash
set -euo pipefail


# Wait for DB
until python - <<'PY'
import os, time
import psycopg
host=os.environ.get('POSTGRES_HOST','db')
user=os.environ['POSTGRES_USER']
password=os.environ['POSTGRES_PASSWORD']
db=os.environ['POSTGRES_DB']
port=os.environ.get('POSTGRES_PORT','5432')
for _ in range(60):
    try:
        with psycopg.connect(host=host, user=user, password=password, dbname=db, port=port):
            print('DB ready')
            break
    except Exception as e:
        print('Waiting for DB...', e)
        time.sleep(1)
else:
    raise SystemExit('DB not ready')
PY


do :; done


# Bootstrap Django project if missing
if [ ! -f manage.py ]; then
    echo "Creating Django project..."
    django-admin startproject core .
    # Add basic settings for Postgres & CORS
    python - <<'PY'
from pathlib import Path
p=Path('core/settings.py')
s=p.read_text()
s=s.replace("ALLOWED_HOSTS = []", "import os\nALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS','*').split(',')")
s=s.replace("'django.middleware.security.SecurityMiddleware',",
"'django.middleware.security.SecurityMiddleware',\n 'corsheaders.middleware.CorsMiddleware',")
s=s.replace("MIDDLEWARE = [",
"MIDDLEWARE = [\n 'corsheaders.middleware.CorsMiddleware',")
s=s.replace("INSTALLED_APPS = [",
"INSTALLED_APPS = [\n 'corsheaders',")
s=s.replace("DATABASES = {\n 'default': {\n 'ENGINE': 'django.db.backends.sqlite3',\n 'NAME': BASE_DIR / 'db.sqlite3',\n }\n}",
"DATABASES = {\n 'default': {\n 'ENGINE': 'django.db.backends.postgresql',\n 'NAME': os.getenv('POSTGRES_DB'),\n 'USER': os.getenv('POSTGRES_USER'),\n 'PASSWORD': os.getenv('POSTGRES_PASSWORD'),\n 'HOST': os.getenv('POSTGRES_HOST', 'db'),\n 'PORT': os.getenv('POSTGRES_PORT', '5432'),\n }\n}")
s += "\nCORS_ALLOW_ALL_ORIGINS = True\n"
p.write_text(s)
PY
fi


python manage.py migrate
python manage.py runserver 0.0.0.0:8000