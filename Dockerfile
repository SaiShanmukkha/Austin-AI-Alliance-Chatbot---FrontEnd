# Base image for building
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies separately to leverage Docker caching
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts

# Copy only necessary project files
COPY . .

# Build the application
RUN pnpm run normal-build



# Production Deployment stage
FROM node:22-alpine AS runner
WORKDIR /app

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
RUN chown -R node:node /app/.next

# Set environment variable
ENV NODE_ENV=production
EXPOSE 3000

# Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the app
CMD ["pnpm", "start"]
