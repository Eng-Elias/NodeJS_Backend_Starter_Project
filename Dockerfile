# Stage 1: Base image with dependencies
FROM node:24-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Stage 2: Development image
FROM base AS development
CMD ["npm", "run", "dev"]

# Stage 3: Production image
FROM base AS production
COPY . .
RUN npm run build
CMD ["npm", "start"]
