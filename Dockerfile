# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install 'serve' package to serve static files
RUN npm install -g serve

# Copy build files from build stage
COPY --from=build /app/dist ./dist

# Expose port 8084
EXPOSE 8084

# Start serving the app
# -s flag handles SPA routing (redirects to index.html)
CMD ["serve", "-s", "dist", "-l", "8084"]
