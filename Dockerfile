FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend/ ./backend/

# Copy frontend build
COPY dist/ ./dist/

# Expose port (Railway will override this with its own PORT env var)
EXPOSE 5000

CMD ["python", "backend/app.py"]
