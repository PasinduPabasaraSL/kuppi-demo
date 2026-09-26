# A small official Node image. Alpine keeps this around 150 MB instead of ~1 GB.
FROM node:22-alpine

# Every command below runs inside /app in the container.
WORKDIR /app

# Copy the manifests on their own first. Docker caches each step, so npm only
# re-runs when these two files change - not on every source edit.
COPY package.json package-lock.json ./

# ci installs exactly the versions in the lock file.
# --omit=dev skips nodemon, which we only need while developing.
RUN npm ci --omit=dev

# Now the source. .dockerignore keeps the host node_modules out of the image.
COPY . .

# Tells Express to run in production mode.
ENV NODE_ENV=production

# Documentation for whoever runs the image. This publishes nothing on its own -
# you still need docker run -p 5000:5000.
EXPOSE 5000

# The process the container runs. Plain node, not nodemon: this is not development.
CMD ["node", "src/server.js"]
