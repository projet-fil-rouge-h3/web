# ── Stage 1 : Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copier les manifestes en premier pour exploiter le cache des layers
COPY package*.json ./
RUN npm ci

# Copier le reste des sources et builder
COPY . .
RUN npm run build

# ── Stage 2 : Serve ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS serve

# Copier uniquement le résultat du build (pas de node_modules, pas de sources)
COPY --from=build /app/dist /usr/share/nginx/html

# Config Nginx pour le SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/health || exit 1
