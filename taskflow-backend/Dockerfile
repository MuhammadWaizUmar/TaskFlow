# ---- Backend: Express API ----
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy dependency files first so this layer is cached until they change
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the app code
COPY src ./src

# Run as the built-in non-root user, not root
USER node

EXPOSE 5000
CMD ["node", "src/server.js"]
