# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the Next.js application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# We need to pass mock env vars during the build step for Next.js to compile
# They must be formatted as valid URLs to pass the Supabase client checks!
ENV NEXT_PUBLIC_SUPABASE_URL="https://mock.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="mock_anon_key"
ENV SUPABASE_SERVICE_ROLE_KEY="mock_service_key"
RUN npm run build

# Stage 3: Production Server
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the secure non-root user
USER nextjs

EXPOSE 3000

# Start the standalone Node.js server
CMD ["node", "server.js"]