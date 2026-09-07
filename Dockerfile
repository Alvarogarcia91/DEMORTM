FROM node:20-slim

WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy remaining source code
COPY . .

# Expose server port
EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
