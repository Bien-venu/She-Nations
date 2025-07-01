FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*


# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy wait script and app
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

COPY . .

# Ensure static directory exists
RUN mkdir -p /app/static

EXPOSE 8082

# Use wait-for-db before launching Gunicorn
ENTRYPOINT ["/wait-for-db.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8082", "shenations.wsgi:application"]
