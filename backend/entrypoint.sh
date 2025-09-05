#!/usr/bin/env bash
set -euo pipefail

echo "▶ Backend bootstrap"

# 0) DB 대기 (psycopg v3 우선, 없으면 psycopg2로 폴백)
python - <<'PY'
import os, time, sys
host=os.environ.get('POSTGRES_HOST','db')
user=os.environ.get('POSTGRES_USER','postgres')
password=os.environ.get('POSTGRES_PASSWORD','postgres')
db=os.environ.get('POSTGRES_DB','postgres')
port=int(os.environ.get('POSTGRES_PORT','5432'))

def wait_psycopg3():
    import psycopg
    for i in range(60):
        try:
            with psycopg.connect(host=host, user=user, password=password, dbname=db, port=port):
                print("DB ready (psycopg)")
                return True
        except Exception as e:
            print("Waiting for DB (v3)...", e)
            time.sleep(1)
    return False

def wait_psycopg2():
    import psycopg2
    for i in range(60):
        try:
            conn=psycopg2.connect(host=host, user=user, password=password, dbname=db, port=port)
            conn.close()
            print("DB ready (psycopg2)")
            return True
        except Exception as e:
            print("Waiting for DB (v2)...", e)
            time.sleep(1)
    return False

ok=False
try:
    ok=wait_psycopg3()
except Exception as e:
    print("psycopg v3 not available:", e)

if not ok:
    try:
        ok=wait_psycopg2()
    except Exception as e:
        print("psycopg2 not available:", e)

if not ok:
    raise SystemExit("DB not ready after retries")
PY

# 1) 프로젝트가 없으면 생성
if [ ! -f manage.py ]; then
  echo "• Creating Django project..."
  django-admin startproject core .

  # 기본 settings 수정(멀티 실행에도 안전하게)
  python - <<'PY'
import re, os
from pathlib import Path
p=Path('core/settings.py')
s=p.read_text()

# ALLOWED_HOSTS를 환경변수 기반으로
if "ALLOWED_HOSTS =" in s:
    s=re.sub(r"ALLOWED_HOSTS\s*=\s*\[[^\]]*\]", "import os\nALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS','*').split(',')", s, count=1)

# INSTALLED_APPS에 corsheaders 추가(중복 방지)
if "INSTALLED_APPS" in s and "corsheaders" not in s:
    s=re.sub(r"INSTALLED_APPS\s*=\s*\[", "INSTALLED_APPS = [\n    'corsheaders',", s, count=1)

# MIDDLEWARE 맨 위에 corsheaders 추가(중복 방지)
if "MIDDLEWARE" in s and "corsheaders.middleware.CorsMiddleware" not in s:
    s=re.sub(r"MIDDLEWARE\s*=\s*\[", "MIDDLEWARE = [\n    'corsheaders.middleware.CorsMiddleware',", s, count=1)

# DB: sqlite → postgres (처음 생성된 형태만 교체)
s = s.replace(
    "DATABASES = {\n    'default': {\n        'ENGINE': 'django.db.backends.sqlite3',\n        'NAME': BASE_DIR / 'db.sqlite3',\n    }\n}",
    "DATABASES = {\n    'default': {\n        'ENGINE': 'django.db.backends.postgresql',\n        'NAME': os.getenv('POSTGRES_DB'),\n        'USER': os.getenv('POSTGRES_USER'),\n        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),\n        'HOST': os.getenv('POSTGRES_HOST', 'db'),\n        'PORT': os.getenv('POSTGRES_PORT', '5432'),\n    }\n}"
)

# CORS 허용(개발용)
if "CORS_ALLOW_ALL_ORIGINS" not in s:
    s += "\nCORS_ALLOW_ALL_ORIGINS = True\n"

Path('core/settings.py').write_text(s)
PY
fi

# 2) 마이그레이션 & 실행
python manage.py migrate
# 개발 서버(운영은 gunicorn 사용 권장)
exec python manage.py runserver 0.0.0.0:8000
