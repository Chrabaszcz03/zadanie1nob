# syntax=docker/dockerfile:1


#etap 1 builder
FROM node:20-alpine AS builder
WORKDIR /app

#instalacja gita do pobrania kodu
RUN apk add --no-cache git


# pobranie kodu z repo z użyciem secretu buildkit
RUN --mount=type=secret,id=github_token \
    TOKEN=$(cat /run/secrets/github_token) && \
    git clone https://${TOKEN}@github.com/Chrabaszcz03/zadanie1nob.git .

#instalacja zależności
RUN npm install --omit=dev

#etap 2 produkcyjny
FROM node:20-alpine AS production

LABEL org.opencontainers.image.title="Zadanie1 Pawcho" \
      org.opencontainers.image.description="Część nieobowiazkowa" \
      org.opencontainers.image.authors="Piotr Chrabaszcz"

ENV PORT=3000 NODE_ENV=production
WORKDIR /app


#kopiowanie plików pobranych wczesniej przez gita
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/public/ ./public/

#wskazanie, że to jest na tym porcie
EXPOSE 3000

# healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

#użytkownik bez roota, kwestia najniższych możliwych uprawnień
USER node

CMD ["node", "server.js"]