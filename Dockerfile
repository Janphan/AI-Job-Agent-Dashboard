FROM node:22-alpine AS builder
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM pierrezemb/gostatic
COPY --from=builder /app/dist/ /srv/http/
CMD ["-port","8080","-https-promote", "-enable-logging"]
