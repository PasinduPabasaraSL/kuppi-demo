# ---------- Stage 1: build the static files ----------
# Node is needed to run Vite, but only while building.
FROM node:22-alpine AS build

WORKDIR /app

# Manifests first so the install layer stays cached.
COPY package.json package-lock.json ./

# Not --omit=dev here: Vite itself is a devDependency and we need it to build.
RUN npm ci

COPY . .

# Vite bakes VITE_ variables into the bundle when it builds, so the API URL has
# to be known now - setting it at docker run would be too late.
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Stage 2: serve them ----------
# A fresh, tiny image. Node and node_modules are left behind in stage 1.
FROM nginx:alpine

# React Router handles /demo, /notes and /quiz in the browser, so nginx must
# return index.html for those paths instead of a 404.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# The only thing carried over from the build stage is the finished dist/ folder.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# The nginx base image already does this; spelled out here so the file explains
# itself. Containers need a process that stays in the foreground.
CMD ["nginx", "-g", "daemon off;"]
