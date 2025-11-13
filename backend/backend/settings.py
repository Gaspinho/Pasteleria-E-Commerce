
from pathlib import Path
from datetime import timedelta
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-^ov68fvnm4gmiox5m10g@^%+n+0or9ohlsf5h%gh&7rm+8b+!w'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []
AUTH_USER_MODEL ='users.User'


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'users',
    'order',
    'product',
    'feedback',
    'base',
    'cake_Recipe',
    'decoration',
    'customizeorder',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

# ============================================
# SQLite Configuration (Current - Development)
# ============================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ============================================
# PostgreSQL Configuration (Production Ready)
# ============================================
# Uncomment the following configuration to use PostgreSQL
# Make sure to install psycopg2: pip install psycopg2-binary
#
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'pasteleria_db',              # Database name
#         'USER': 'postgres',                    # Database user
#         'PASSWORD': 'your_password',           # Database password
#         'HOST': 'localhost',                   # Database host (use 'localhost' for local)
#         'PORT': '5432',                        # Default PostgreSQL port
#         # Optional: Connection options for performance
#         'OPTIONS': {
#             'connect_timeout': 10,
#             'options': '-c statement_timeout=30000'  # 30 seconds timeout
#         },
#         # Connection pooling (optional but recommended for production)
#         'CONN_MAX_AGE': 600,  # Keep connections alive for 10 minutes
#     }
# }

# ============================================
# PostgreSQL with Environment Variables (Recommended for Production)
# ============================================
# For production, use environment variables to store sensitive data
# Install python-decouple: pip install python-decouple
# Then create a .env file with:
# DB_NAME=pasteleria_db
# DB_USER=postgres
# DB_PASSWORD=your_secure_password
# DB_HOST=localhost
# DB_PORT=5432
#
# from decouple import config
#
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': config('DB_NAME'),
#         'USER': config('DB_USER'),
#         'PASSWORD': config('DB_PASSWORD'),
#         'HOST': config('DB_HOST', default='localhost'),
#         'PORT': config('DB_PORT', default='5432'),
#         'CONN_MAX_AGE': 600,
#     }
# }

# ============================================
# PostgreSQL Cloud Services (Production Examples)
# ============================================

# --- AWS RDS PostgreSQL ---
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'pasteleria_db',
#         'USER': 'admin',
#         'PASSWORD': config('RDS_PASSWORD'),
#         'HOST': 'your-rds-instance.xxxxxxxxx.us-east-1.rds.amazonaws.com',
#         'PORT': '5432',
#         'OPTIONS': {
#             'sslmode': 'require',  # AWS RDS requires SSL
#         },
#         'CONN_MAX_AGE': 600,
#     }
# }

# --- Heroku PostgreSQL ---
# import dj_database_url
# DATABASES = {
#     'default': dj_database_url.config(
#         conn_max_age=600,
#         ssl_require=True
#     )
# }

# --- DigitalOcean Managed PostgreSQL ---
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'defaultdb',
#         'USER': 'doadmin',
#         'PASSWORD': config('DO_DB_PASSWORD'),
#         'HOST': 'your-db-cluster.db.ondigitalocean.com',
#         'PORT': '25060',
#         'OPTIONS': {
#             'sslmode': 'require',
#         },
#         'CONN_MAX_AGE': 600,
#     }
# }

# ============================================
# Migration Commands for PostgreSQL
# ============================================
# After switching to PostgreSQL, run these commands:
# 1. Install PostgreSQL adapter: pip install psycopg2-binary
# 2. Create database in PostgreSQL: createdb pasteleria_db
# 3. Run migrations: python manage.py makemigrations
# 4. Apply migrations: python manage.py migrate
# 5. Create superuser: python manage.py createsuperuser
# 6. (Optional) Load existing data: python manage.py loaddata backup.json


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=9),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

MEDIA_URL='/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

