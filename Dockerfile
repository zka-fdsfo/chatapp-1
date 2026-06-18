# ---------- FRONTEND BUILD ----------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build


# ---------- BACKEND ----------
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY backend .

# Copy React build into backend
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 5000

CMD ["node", "server.js"]