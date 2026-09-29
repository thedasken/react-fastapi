FROM node:22-alpine AS build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_API_URL=/api
ARG APP_NAME="React FastAPI"
ARG APP_VERSION=0.0.1
ENV VITE_API_URL=$VITE_API_URL
ENV APP_NAME=$APP_NAME
ENV APP_VERSION=$APP_VERSION

RUN npm run build

FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
