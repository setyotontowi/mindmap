FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first for caching layers
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Create a directory to store the SQLite database
RUN mkdir -p /app/data

# Default environment variables
ENV PORT=4000
ENV DB_PATH=/app/data/mindmap.db
ENV NODE_ENV=production

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]
