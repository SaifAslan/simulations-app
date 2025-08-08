# # Use official Node image
# FROM node:22.14.0-alpine3.21

# # Set working directory
# WORKDIR /app

# COPY . . 

# # Install root dependencies (like concurrently)
# COPY package*.json ./
# RUN npm install

# # Copy both frontend and backend
# COPY src ./src

# # Install frontend dependencies
# WORKDIR /app/src/frontend
# RUN npm install

# # Install backend dependencies
# WORKDIR /app/src/food-sim-api
# RUN npm install

# # Move back to root for running both
# WORKDIR /app

# # Expose frontend (3000) and backend (3030)
# EXPOSE 3000 3030

# # Run both servers concurrently
# CMD ["npm", "run", "dev"]

# Use official Node image
FROM node:22.14.0-alpine3.21

# Set working directory
WORKDIR /app

# Copy root package files and install dependencies (concurrently etc.)
COPY package*.json ./
RUN npm install

# Copy frontend package files and install dependencies
WORKDIR /app/src/frontend
COPY src/frontend/package*.json ./
RUN npm install

# Copy backend package files and install dependencies
WORKDIR /app/src/backend
COPY src/backend/package*.json ./
RUN npm install

# Now copy the rest of the code (after dependencies are cached)
WORKDIR /app
COPY . .

# Make run_tests.sh executable if needed
RUN chmod +x ./run_tests.sh || true

# Default envs (override at runtime)
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:3030

# Expose frontend and backend ports
EXPOSE 3000 3030

# Default command
CMD ["npm", "run", "dev"]
