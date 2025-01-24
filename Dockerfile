# Stage 1: Build the React frontend
FROM node:16 as frontend-build

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy frontend package.json and package-lock.json
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ .

# Build the frontend
RUN npm run build

# Stage 2: Build the Express backend
FROM node:16 as backend-build

# Set the working directory for the backend
WORKDIR /app/backend

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ .

# Stage 3: Final image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy built frontend files from the frontend-build stage
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy backend files from the backend-build stage
COPY --from=backend-build /app/backend ./backend

# Install backend dependencies in the final image
WORKDIR /app/backend
RUN npm install --production

# Expose the backend port
EXPOSE 5000

# Command to start the backend server
CMD ["npm", "start"]