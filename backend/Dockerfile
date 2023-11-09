# Use an official Python runtime as a parent image
FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update
RUN python3 -m pip install --upgrade pip
RUN apt-get install -y postgresql-client  # installed to support PostgreSQL database connections
#RUN apt-get clean
#RUN rm -rf /var/lib/apt/lists/*


# Copy the Django project files into the container at /app/
COPY backend/ /app/


# Install project dependencies
COPY backend/requirements.txt /app/
RUN python3 -m pip install -r requirements.txt
RUN python3 -m pip install psycopg2-binary # for PostgreSQL database

#RUN python3.9 manage.py makemigrations # ? but should be here
#RUN python3.9 manage.py migrate


#RUN echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')" | python3.9 manage.py shell



## Start the application with Django's built-in development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
