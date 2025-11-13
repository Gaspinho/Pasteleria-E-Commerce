# PostgreSQL Configuration Guide

## Table of Contents
1. [Local PostgreSQL Setup](#local-postgresql-setup)
2. [Environment Variables](#environment-variables)
3. [Cloud PostgreSQL Services](#cloud-postgresql-services)
4. [Migration from SQLite](#migration-from-sqlite)
5. [Troubleshooting](#troubleshooting)

---

## Local PostgreSQL Setup

### Windows

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download and install PostgreSQL (version 12 or higher recommended)

2. **Install psycopg2**
   ```bash
   pip install psycopg2-binary
   ```

3. **Create Database**
   ```bash
   # Open PostgreSQL command line (psql)
   psql -U postgres

   # Create database
   CREATE DATABASE pasteleria_db;

   # Create user (optional)
   CREATE USER pasteleria_user WITH PASSWORD 'your_secure_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE pasteleria_db TO pasteleria_user;

   # Exit
   \q
   ```

4. **Update Django Settings**
   - Edit `backend/settings.py`
   - Uncomment PostgreSQL configuration
   - Update credentials

### Linux/Mac

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # macOS (using Homebrew)
   brew install postgresql
   ```

2. **Start PostgreSQL Service**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start postgresql
   sudo systemctl enable postgresql

   # macOS
   brew services start postgresql
   ```

3. **Create Database**
   ```bash
   # Switch to postgres user
   sudo -u postgres psql

   # Create database
   CREATE DATABASE pasteleria_db;

   # Create user
   CREATE USER pasteleria_user WITH PASSWORD 'your_secure_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE pasteleria_db TO pasteleria_user;

   # Exit
   \q
   ```

---

## Environment Variables

### Using python-decouple

1. **Install python-decouple**
   ```bash
   pip install python-decouple
   ```

2. **Create .env file** in backend directory
   ```env
   # Database Configuration
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=pasteleria_db
   DB_USER=pasteleria_user
   DB_PASSWORD=your_secure_password
   DB_HOST=localhost
   DB_PORT=5432

   # Django Settings
   SECRET_KEY=your_secret_key_here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1

   # CORS Settings
   CORS_ORIGIN_WHITELIST=http://localhost:3000,http://localhost:3001
   ```

3. **Update settings.py**
   ```python
   from decouple import config

   SECRET_KEY = config('SECRET_KEY')
   DEBUG = config('DEBUG', default=False, cast=bool)
   ALLOWED_HOSTS = config('ALLOWED_HOSTS').split(',')

   DATABASES = {
       'default': {
           'ENGINE': config('DB_ENGINE'),
           'NAME': config('DB_NAME'),
           'USER': config('DB_USER'),
           'PASSWORD': config('DB_PASSWORD'),
           'HOST': config('DB_HOST', default='localhost'),
           'PORT': config('DB_PORT', default='5432'),
           'CONN_MAX_AGE': 600,
       }
   }
   ```

4. **Add .env to .gitignore**
   ```
   .env
   ```

---

## Cloud PostgreSQL Services

### AWS RDS PostgreSQL

1. **Create RDS Instance**
   - Go to AWS RDS Console
   - Create PostgreSQL database
   - Note: endpoint, port, username, password

2. **Security Group**
   - Allow inbound traffic on port 5432
   - Add your IP or application server IP

3. **Django Configuration**
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'pasteleria_db',
           'USER': 'admin',
           'PASSWORD': config('RDS_PASSWORD'),
           'HOST': 'your-instance.xxxxxxxxx.us-east-1.rds.amazonaws.com',
           'PORT': '5432',
           'OPTIONS': {
               'sslmode': 'require',
           },
           'CONN_MAX_AGE': 600,
       }
   }
   ```

### Heroku PostgreSQL

1. **Add PostgreSQL Add-on**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. **Install dj-database-url**
   ```bash
   pip install dj-database-url
   ```

3. **Update settings.py**
   ```python
   import dj_database_url

   DATABASES = {
       'default': dj_database_url.config(
           conn_max_age=600,
           ssl_require=True
       )
   }
   ```

### DigitalOcean Managed PostgreSQL

1. **Create Managed Database**
   - Go to DigitalOcean Dashboard
   - Create PostgreSQL database cluster
   - Download CA certificate

2. **Django Configuration**
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'defaultdb',
           'USER': 'doadmin',
           'PASSWORD': config('DO_DB_PASSWORD'),
           'HOST': 'your-cluster.db.ondigitalocean.com',
           'PORT': '25060',
           'OPTIONS': {
               'sslmode': 'require',
               'sslrootcert': '/path/to/ca-certificate.crt',
           },
           'CONN_MAX_AGE': 600,
       }
   }
   ```

---

## Migration from SQLite

### Backup Current Data

1. **Export SQLite Data**
   ```bash
   python manage.py dumpdata > backup.json
   ```

2. **Export specific apps**
   ```bash
   python manage.py dumpdata users > users_backup.json
   python manage.py dumpdata product > products_backup.json
   python manage.py dumpdata order > orders_backup.json
   ```

### Switch to PostgreSQL

1. **Update settings.py** with PostgreSQL configuration

2. **Run Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

4. **Load Data**
   ```bash
   python manage.py loaddata backup.json
   ```

   If you encounter errors, load app by app:
   ```bash
   python manage.py loaddata users_backup.json
   python manage.py loaddata products_backup.json
   python manage.py loaddata orders_backup.json
   ```

---

## Troubleshooting

### Connection Issues

**Error: "FATAL: password authentication failed"**
- Check username and password
- Verify PostgreSQL user exists
- Check pg_hba.conf authentication method

**Error: "could not connect to server"**
- Check PostgreSQL service is running
- Verify HOST and PORT settings
- Check firewall settings

### Performance Optimization

1. **Connection Pooling**
   ```python
   DATABASES = {
       'default': {
           # ... other settings
           'CONN_MAX_AGE': 600,  # Keep connections for 10 minutes
       }
   }
   ```

2. **Database Indexes**
   ```python
   class Meta:
       indexes = [
           models.Index(fields=['email']),
           models.Index(fields=['created_at']),
       ]
   ```

3. **Query Optimization**
   ```python
   # Use select_related for foreign keys
   orders = Order.objects.select_related('user', 'product')

   # Use prefetch_related for many-to-many
   products = Product.objects.prefetch_related('reviews')
   ```

### Backup Strategies

**Automated Backups**
```bash
# Create backup script
pg_dump -U pasteleria_user -h localhost pasteleria_db > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U pasteleria_user -h localhost pasteleria_db < backup_20240101.sql
```

**Django Management Command**
```bash
# Backup
python manage.py dumpdata --indent 2 > backup_$(date +%Y%m%d).json

# Restore
python manage.py loaddata backup_20240101.json
```

---

## Additional Resources

- Django Database Documentation: https://docs.djangoproject.com/en/4.0/ref/databases/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- psycopg2 Documentation: https://www.psycopg.org/docs/

---

## Support

For issues or questions:
1. Check Django logs: `python manage.py runserver --verbosity 3`
2. Check PostgreSQL logs
3. Review Django database documentation
