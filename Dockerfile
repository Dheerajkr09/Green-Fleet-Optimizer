FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend/ ./backend/

# Copy frontend build
COPY dist/ ./dist/

# Koyeb uses PORT env variable (default 8000)
ENV PORT=8000
EXPOSE 8000

CMD ["python", "backend/app.py"]
