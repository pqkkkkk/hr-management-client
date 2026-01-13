# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Accept build arguments for React Environment Variables
ARG REACT_APP_SPRING_API_BASE_URL
ARG REACT_APP_DOTNET_API_BASE_URL

# Set them as Environment Variables for the build process
ENV REACT_APP_SPRING_API_BASE_URL=$REACT_APP_SPRING_API_BASE_URL
ENV REACT_APP_DOTNET_API_BASE_URL=$REACT_APP_DOTNET_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
