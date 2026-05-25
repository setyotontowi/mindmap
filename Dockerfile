FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first for caching layers
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Default environment variables
ENV PORT=4000
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mindmap
ENV NODE_ENV=production

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]
