# Stage 1: Build frontend
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production environment (hanya runtime, tanpa source code)
FROM node:20-slim
WORKDIR /app

# Hanya copy yang dibutuhkan runtime: dependencies, server, frontend, dan static assets
COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY index.html ./
COPY favicon.svg ./
COPY --from=builder /app/dist ./dist

ENV PORT=4000
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mindmap
ENV NODE_ENV=production

EXPOSE 4000
CMD ["node", "server.js"]
