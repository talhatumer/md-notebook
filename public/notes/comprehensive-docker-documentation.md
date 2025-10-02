# Comprehensive Docker Documentation

## Table of Contents
1. Introduction to Docker
2. Installation
3. Core Concepts
4. Essential Commands
5. Dockerfiles
6. Image Management
7. Container Management
8. Docker Compose
9. Networking
10. Volumes & Storage
11. Advanced Topics
12. Production Best Practices

---

## Introduction to Docker

### What is Docker?

**Docker** is a platform for developing, shipping, and running applications in **containers**. Containers package software with all its dependencies, ensuring consistency across different environments.

**Key Benefits:**
- **Portability**: Run anywhere - development, staging, production
- **Consistency**: "Works on my machine" becomes "works everywhere"
- **Isolation**: Applications run in isolated environments
- **Efficiency**: Lightweight compared to virtual machines
- **Scalability**: Easy to scale horizontally

### Docker vs Virtual Machines

| Feature | Docker Containers | Virtual Machines |
|---------|------------------|------------------|
| **Startup Time** | Seconds | Minutes |
| **Size** | MBs | GBs |
| **Performance** | Native | Overhead |
| **Isolation** | Process-level | Full OS |
| **Resource Usage** | Minimal | High |

---

## Installation

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
sudo docker run hello-world
```

### macOS

```bash
# Download Docker Desktop from docker.com
# Or use Homebrew
brew install --cask docker
```

### Windows

Download **Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop) and follow the installation wizard.

### Post-Installation (Linux)

```bash
# Add your user to docker group (avoid using sudo)
sudo usermod -aG docker $USER

# Logout and login again, then verify
docker run hello-world
```

---

## Core Concepts

### Images

A Docker **image** is a read-only template containing:
- Application code
- Runtime environment
- System tools and libraries
- Dependencies

> **Think of it as:** A snapshot or blueprint for creating containers

### Containers

A **container** is a runnable instance of an image. It's an isolated process with its own filesystem, networking, and process space.

> **Think of it as:** A running application with everything it needs

### Registry

A **registry** stores Docker images. The default is **Docker Hub**, but private registries are also common.

**Popular Registries:**
- Docker Hub (hub.docker.com)
- Amazon ECR
- Google Container Registry
- Azure Container Registry
- GitHub Container Registry

### Architecture

```
┌─────────────────────────────────────┐
│         Docker Client (CLI)          │
└──────────────┬──────────────────────┘
               │ Docker API
┌──────────────▼──────────────────────┐
│         Docker Daemon (dockerd)      │
├──────────────────────────────────────┤
│  Images | Containers | Networks      │
│  Volumes | Build | Orchestration     │
└──────────────────────────────────────┘
```

---

## Essential Commands

### Image Commands

```bash
# Pull an image from registry
docker pull ubuntu:22.04

# List local images
docker images
docker image ls

# Remove an image
docker rmi ubuntu:22.04
docker image rm ubuntu:22.04

# Build an image from Dockerfile
docker build -t myapp:1.0 .

# Tag an image
docker tag myapp:1.0 username/myapp:1.0

# Push to registry
docker push username/myapp:1.0

# Inspect image details
docker inspect ubuntu:22.04

# View image history
docker history ubuntu:22.04
```

### Container Commands

```bash
# Run a container
docker run ubuntu:22.04

# Run with options
docker run -d -p 8080:80 --name webserver nginx

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop webserver

# Start a stopped container
docker start webserver

# Restart a container
docker restart webserver

# Remove a container
docker rm webserver

# Force remove a running container
docker rm -f webserver

# Execute command in running container
docker exec -it webserver bash

# View container logs
docker logs webserver
docker logs -f webserver  # Follow logs

# Inspect container details
docker inspect webserver

# View container resource usage
docker stats

# Copy files to/from container
docker cp file.txt webserver:/path/to/destination
docker cp webserver:/path/to/file.txt ./local/
```

### Common Docker Run Options

| Option | Description | Example |
|--------|-------------|---------|
| `-d` | Detached mode | `docker run -d nginx` |
| `-p` | Port mapping | `docker run -p 8080:80 nginx` |
| `--name` | Container name | `docker run --name web nginx` |
| `-e` | Environment variable | `docker run -e KEY=value nginx` |
| `-v` | Volume mount | `docker run -v /host:/container nginx` |
| `-it` | Interactive terminal | `docker run -it ubuntu bash` |
| `--rm` | Auto-remove on exit | `docker run --rm ubuntu` |
| `--network` | Network mode | `docker run --network host nginx` |
| `--restart` | Restart policy | `docker run --restart always nginx` |

### System Commands

```bash
# View Docker disk usage
docker system df

# Clean up unused resources
docker system prune

# Clean up everything (use with caution!)
docker system prune -a --volumes

# Display Docker version
docker version

# Display system information
docker info
```

---

## Dockerfiles

A **Dockerfile** is a text file with instructions to build a Docker image.

### Basic Syntax

```dockerfile
# Use official base image
FROM ubuntu:22.04

# Set working directory
WORKDIR /app

# Copy files from host to image
COPY package.json .

# Run commands during build
RUN apt-get update && apt-get install -y nodejs

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Define default command
CMD ["node", "server.js"]
```

### Dockerfile Instructions

#### FROM
Specifies the base image.

```dockerfile
FROM node:18-alpine
FROM python:3.11-slim
FROM ubuntu:22.04
```

#### WORKDIR
Sets the working directory for subsequent instructions.

```dockerfile
WORKDIR /app
# All following commands run in /app
```

#### COPY vs ADD

```dockerfile
# COPY - Simple file copy (preferred)
COPY package.json /app/
COPY . /app/

# ADD - Can extract archives and download URLs
ADD archive.tar.gz /app/
ADD https://example.com/file.txt /app/
```

> **Best Practice:** Use `COPY` unless you specifically need `ADD`'s features.

#### RUN
Executes commands during build time.

```dockerfile
# Single command
RUN apt-get update

# Multiple commands (better for layer optimization)
RUN apt-get update && \
    apt-get install -y python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

#### CMD vs ENTRYPOINT

```dockerfile
# CMD - Can be overridden at runtime
CMD ["python", "app.py"]

# ENTRYPOINT - Always executes, CMD becomes parameters
ENTRYPOINT ["python"]
CMD ["app.py"]

# Together: docker run image test.py
# Executes: python test.py
```

#### ENV
Sets environment variables.

```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
ENV PATH=/app/bin:$PATH
```

#### EXPOSE
Documents which ports the container listens on.

```dockerfile
EXPOSE 80
EXPOSE 443
EXPOSE 3000/tcp
EXPOSE 8080/udp
```

> **Note:** `EXPOSE` is documentation only. Use `-p` flag to actually publish ports.

#### VOLUME
Creates a mount point for persistent data.

```dockerfile
VOLUME /data
VOLUME ["/var/log", "/var/db"]
```

#### USER
Sets the user for subsequent commands.

```dockerfile
# Create user and switch
RUN useradd -m appuser
USER appuser
```

#### ARG
Defines build-time variables.

```dockerfile
ARG VERSION=1.0
ARG BUILD_DATE

RUN echo "Building version $VERSION"

# Use at build time
# docker build --build-arg VERSION=2.0 .
```

#### LABEL
Adds metadata to image.

```dockerfile
LABEL maintainer="dev@example.com"
LABEL version="1.0"
LABEL description="My web application"
```

### Complete Example: Node.js Application

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

# Start application
CMD ["node", "dist/server.js"]
```

### Multi-Stage Builds

Multi-stage builds reduce final image size by separating build dependencies from runtime.

```dockerfile
# Stage 1: Build
FROM golang:1.21 AS builder

WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o app

# Stage 2: Runtime
FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Copy only the binary
COPY --from=builder /src/app .

CMD ["./app"]
```

**Benefits:**
- Smaller final image
- No build tools in production image
- Better security

### Dockerfile Best Practices

#### 1. Use Specific Tags

```dockerfile
# ❌ Bad - unpredictable
FROM node:latest

# ✅ Good - reproducible
FROM node:18.17.0-alpine3.18
```

#### 2. Minimize Layers

```dockerfile
# ❌ Bad - multiple layers
RUN apt-get update
RUN apt-get install -y python3
RUN apt-get clean

# ✅ Good - single optimized layer
RUN apt-get update && \
    apt-get install -y python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

#### 3. Leverage Build Cache

```dockerfile
# ✅ Good - dependencies cached separately
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

#### 4. Use .dockerignore

Create a `.dockerignore` file:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.DS_Store
*.md
```

#### 5. Don't Run as Root

```dockerfile
RUN useradd -m -u 1001 appuser
USER appuser
```

#### 6. Order Instructions Wisely

Place frequently changing instructions last:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./        # Changes rarely
RUN npm ci                   # Changes rarely
COPY . .                     # Changes frequently
CMD ["npm", "start"]
```

---

## Image Management

### Building Images

```bash
# Build from Dockerfile in current directory
docker build -t myapp:1.0 .

# Build with different Dockerfile
docker build -t myapp:1.0 -f Dockerfile.prod .

# Build with build arguments
docker build --build-arg VERSION=2.0 -t myapp:2.0 .

# Build without cache
docker build --no-cache -t myapp:1.0 .

# Build with target stage (multi-stage)
docker build --target builder -t myapp:builder .
```

### Tagging Images

```bash
# Tag existing image
docker tag myapp:1.0 myapp:latest
docker tag myapp:1.0 username/myapp:1.0

# Multiple tags during build
docker build -t myapp:1.0 -t myapp:latest .
```

**Tagging Strategy:**
- `latest` - Most recent stable version
- `1.0`, `1.0.1` - Specific versions
- `dev`, `staging`, `prod` - Environment-specific
- `commit-sha` - Tied to git commit

### Image Layers

Docker images are composed of **layers**. Each Dockerfile instruction creates a new layer.

```bash
# View image layers
docker history myapp:1.0

# Inspect layer details
docker inspect myapp:1.0
```

**Layer Optimization:**
- Each `RUN`, `COPY`, `ADD` creates a layer
- Layers are cached and reused
- Smaller layers = faster builds
- Combine commands to reduce layers

### Pushing to Registry

#### Docker Hub

```bash
# Login
docker login

# Tag for Docker Hub
docker tag myapp:1.0 username/myapp:1.0

# Push
docker push username/myapp:1.0

# Push all tags
docker push --all-tags username/myapp
```

#### Private Registry

```bash
# Tag for private registry
docker tag myapp:1.0 registry.example.com/myapp:1.0

# Login to private registry
docker login registry.example.com

# Push
docker push registry.example.com/myapp:1.0
```

### Saving and Loading Images

```bash
# Save image to tar file
docker save -o myapp.tar myapp:1.0

# Load image from tar file
docker load -i myapp.tar

# Export container filesystem
docker export container_name > container.tar

# Import filesystem as image
docker import container.tar myapp:imported
```

### Image Security Scanning

```bash
# Scan image for vulnerabilities (Docker Scout)
docker scout cves myapp:1.0

# Scan with detailed report
docker scout quickview myapp:1.0
```

---

## Container Management

### Container Lifecycle

```
┌─────────┐
│ Created │
└────┬────┘
     │ docker start
┌────▼────┐
│ Running │◄──┐
└────┬────┘   │ docker restart
     │        │
     │ docker stop/kill
┌────▼────┐   │
│ Stopped │───┘
└────┬────┘
     │ docker rm
┌────▼────┐
│ Removed │
└─────────┘
```

### Running Containers

```bash
# Simple run
docker run nginx

# Run in background (detached)
docker run -d nginx

# Run with name
docker run -d --name webserver nginx

# Run with port mapping
docker run -d -p 8080:80 nginx

# Run with environment variables
docker run -d -e DB_HOST=localhost -e DB_PORT=5432 postgres

# Run with volume mount
docker run -d -v /host/path:/container/path nginx

# Run with automatic removal
docker run --rm ubuntu echo "Hello World"

# Run interactively
docker run -it ubuntu bash

# Run with resource limits
docker run -d --memory="512m" --cpus="1.5" nginx

# Run with restart policy
docker run -d --restart unless-stopped nginx
```

### Restart Policies

| Policy | Description |
|--------|-------------|
| `no` | Never restart (default) |
| `on-failure[:max-retries]` | Restart on non-zero exit |
| `always` | Always restart |
| `unless-stopped` | Always restart unless manually stopped |

```bash
docker run -d --restart always nginx
docker run -d --restart on-failure:3 myapp
```

### Managing Running Containers

```bash
# Attach to running container
docker attach container_name

# Execute command in container
docker exec container_name ls -la

# Interactive shell
docker exec -it container_name bash

# Execute as specific user
docker exec -u root -it container_name bash

# View container logs
docker logs container_name

# Follow logs in real-time
docker logs -f container_name

# Show last 100 lines
docker logs --tail 100 container_name

# Show logs with timestamps
docker logs -t container_name
```

### Container Inspection

```bash
# View container details
docker inspect container_name

# Get specific field
docker inspect -f '{{.State.Status}}' container_name
docker inspect -f '{{.NetworkSettings.IPAddress}}' container_name

# View port mappings
docker port container_name

# View processes in container
docker top container_name

# View resource usage
docker stats container_name
```

### Stopping and Removing Containers

```bash
# Stop container (SIGTERM, then SIGKILL after grace period)
docker stop container_name

# Stop immediately (SIGKILL)
docker kill container_name

# Stop multiple containers
docker stop $(docker ps -q)

# Remove stopped container
docker rm container_name

# Force remove running container
docker rm -f container_name

# Remove all stopped containers
docker container prune

# Remove all containers (stopped and running)
docker rm -f $(docker ps -aq)
```

### Container Monitoring

```bash
# Real-time resource usage
docker stats

# Container events
docker events

# Filter events
docker events --filter container=webserver

# View container changes
docker diff container_name
```

---

## Docker Compose

**Docker Compose** manages multi-container applications using YAML configuration.

### Installation

Docker Compose V2 comes with Docker Desktop. For Linux:

```bash
# Already included as docker compose (note: no hyphen)
docker compose version
```

### Basic docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    volumes:
      # Named volume for data persistence
      - db_data:/var/lib/postgresql/data
      # Bind mount for initialization scripts
      - ./db/init:/docker-entrypoint-initdb.d:ro
      # Bind mount for configuration
      - ./db/postgresql.conf:/etc/postgresql/postgresql.conf:ro

  app:
    build: .
    volumes:
      # Application data
      - app_data:/app/data
      # Logs (separate volume for easier management)
      - app_logs:/app/logs
      # Temporary files in memory
      - type: tmpfs
        target: /app/tmp
        tmpfs:
          size: 100m

volumes:
  db_data:
    driver: local
  app_data:
    driver: local
  app_logs:
    driver: local
```

> **Best Practice:** Use named volumes for production data, bind mounts for configuration and development.

### Data Persistence Patterns

```bash
# Pattern 1: Database with persistent storage
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -v pg_data:/var/lib/postgresql/data \
  postgres:15

# Pattern 2: Application with logs
docker run -d \
  --name app \
  -v app_data:/app/data \
  -v app_logs:/app/logs \
  myapp:latest

# Pattern 3: Development with live reload
docker run -d \
  --name devapp \
  -v $(pwd)/src:/app/src:ro \
  -v /app/node_modules \
  node:18
```

---

## Advanced Topics

### Security Best Practices

#### 1. Use Non-Root Users

```dockerfile
FROM node:18-alpine

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership
WORKDIR /app
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

CMD ["node", "server.js"]
```

#### 2. Scan for Vulnerabilities

```bash
# Scan image with Docker Scout
docker scout cves nginx:latest

# Use Trivy
docker run aquasec/trivy image myapp:latest

# Use Snyk
snyk container test myapp:latest
```

#### 3. Use Minimal Base Images

```dockerfile
# ❌ Large attack surface
FROM ubuntu:22.04

# ✅ Minimal attack surface
FROM alpine:3.18

# ✅ Even better - distroless
FROM gcr.io/distroless/nodejs:18
```

#### 4. Don't Store Secrets in Images

```bash
# ❌ Bad - secrets in environment
docker run -e DB_PASSWORD=secret123 myapp

# ✅ Good - use Docker secrets (Swarm)
echo "secret123" | docker secret create db_password -
docker service create --secret db_password myapp

# ✅ Good - use external secret management
docker run --env-file <(vault kv get -format=json secret/app) myapp
```

#### 5. Sign and Verify Images

```bash
# Enable Docker Content Trust
export DOCKER_CONTENT_TRUST=1

# Push signed image
docker push username/myapp:latest

# Pull only signed images
docker pull username/myapp:latest
```

#### 6. Limit Container Capabilities

```bash
# Drop all capabilities, add only needed ones
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx

# Run in read-only mode
docker run --read-only --tmpfs /tmp nginx

# Prevent privilege escalation
docker run --security-opt=no-new-privileges nginx
```

### Resource Limits

#### CPU Limits

```bash
# Limit to 1.5 CPUs
docker run -d --cpus="1.5" nginx

# CPU shares (relative weight)
docker run -d --cpu-shares=512 nginx

# Specific CPU cores
docker run -d --cpuset-cpus="0,1" nginx
```

#### Memory Limits

```bash
# Hard memory limit
docker run -d --memory="512m" nginx

# Memory + swap limit
docker run -d --memory="512m" --memory-swap="1g" nginx

# Memory reservation (soft limit)
docker run -d --memory-reservation="256m" nginx

# OOM kill disable (use with caution)
docker run -d --memory="512m" --oom-kill-disable nginx
```

#### I/O Limits

```bash
# Block IO weight
docker run -d --blkio-weight=500 nginx

# Read/write bandwidth limits
docker run -d \
  --device-write-bps=/dev/sda:10mb \
  --device-read-bps=/dev/sda:10mb \
  nginx
```

**Docker Compose Example:**

```yaml
services:
  web:
    image: nginx
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
```

### Health Checks

#### Dockerfile Health Check

```dockerfile
FROM nginx:alpine

COPY healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD /usr/local/bin/healthcheck.sh
```

**healthcheck.sh:**

```bash
#!/bin/sh
curl -f http://localhost/health || exit 1
```

#### Docker Run Health Check

```bash
docker run -d \
  --health-cmd="curl -f http://localhost/health || exit 1" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  --health-start-period=40s \
  nginx
```

#### Docker Compose Health Check

```yaml
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
  
  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    image: myapi
    depends_on:
      db:
        condition: service_healthy  # Wait for db to be healthy
```

#### Check Health Status

```bash
# View health status
docker ps
docker inspect --format='{{.State.Health.Status}}' container_name

# View health logs
docker inspect --format='{{json .State.Health}}' container_name | jq
```

### Logging

#### Logging Drivers

```bash
# Default json-file driver
docker run -d nginx

# Use syslog
docker run -d --log-driver syslog nginx

# Use journald
docker run -d --log-driver journald nginx

# Use fluentd
docker run -d --log-driver fluentd --log-opt fluentd-address=localhost:24224 nginx

# Disable logging
docker run -d --log-driver none nginx
```

#### Configure Logging

```bash
# Set log options
docker run -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx
```

**Docker Compose:**

```yaml
services:
  web:
    image: nginx
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        labels: "production"
        env: "os,customer"
```

#### Centralized Logging Example

```yaml
version: '3.8'

services:
  app:
    image: myapp
    logging:
      driver: fluentd
      options:
        fluentd-address: localhost:24224
        tag: app.logs

  fluentd:
    image: fluent/fluentd:v1.16
    volumes:
      - ./fluentd/conf:/fluentd/etc
      - fluentd_logs:/fluentd/log
    ports:
      - "24224:24224"
      - "24224:24224/udp"

  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
    volumes:
      - es_data:/usr/share/elasticsearch/data

  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  fluentd_logs:
  es_data:
```

### Multi-Platform Images

Build images for multiple architectures:

```bash
# Enable buildx
docker buildx create --name multiarch --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t username/myapp:latest \
  --push \
  .
```

**Dockerfile for Multi-Platform:**

```dockerfile
FROM --platform=$BUILDPLATFORM golang:1.21 AS builder

ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH

WORKDIR /src
COPY . .

RUN GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o app

FROM alpine:latest
COPY --from=builder /src/app /app
CMD ["/app"]
```

---

## Production Best Practices

### Image Optimization

#### 1. Minimize Image Size

```dockerfile
# ✅ Multi-stage build with Alpine
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
USER node
CMD ["node", "dist/server.js"]
```

#### 2. Layer Caching Strategy

```dockerfile
# Install dependencies first (changes rarely)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code (changes frequently)
COPY . .
RUN npm run build
```

#### 3. Use .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.*
.DS_Store
coverage
.vscode
.idea
*.md
Dockerfile
docker-compose.yml
.dockerignore
dist
build
```

### CI/CD Integration

#### GitHub Actions Example

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache,mode=max
```

#### GitLab CI Example

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest

test:
  stage: test
  image: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  script:
    - npm test

deploy:
  stage: deploy
  script:
    - docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker-compose up -d
  only:
    - main
```

### Monitoring and Observability

#### Prometheus Metrics

```yaml
version: '3.8'

services:
  app:
    image: myapp
    ports:
      - "3000:3000"
    labels:
      - "prometheus.scrape=true"
      - "prometheus.port=3000"
      - "prometheus.path=/metrics"

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"

volumes:
  prometheus_data:
  grafana_data:
```

**prometheus.yml:**

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'docker-containers'
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
    relabel_configs:
      - source_labels: [__meta_docker_container_label_prometheus_scrape]
        regex: "true"
        action: keep
      - source_labels: [__meta_docker_container_label_prometheus_port]
        target_label: __address__
        regex: (.+)
        replacement: $1

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

### Debugging Techniques

#### 1. Interactive Debugging

```bash
# Start container with shell
docker run -it --entrypoint /bin/bash myapp

# Override command
docker run -it myapp /bin/sh

# Debug running container
docker exec -it container_name bash

# Run as root
docker exec -it -u 0 container_name bash
```

#### 2. Inspect Container State

```bash
# View detailed container info
docker inspect container_name

# Check exit code
docker inspect -f '{{.State.ExitCode}}' container_name

# View environment variables
docker inspect -f '{{.Config.Env}}' container_name

# Check mounts
docker inspect -f '{{.Mounts}}' container_name
```

#### 3. Log Analysis

```bash
# View logs with timestamps
docker logs -t container_name

# Follow logs in real-time
docker logs -f --tail 100 container_name

# Filter logs by time
docker logs --since 30m container_name
docker logs --since "2024-01-01T00:00:00" container_name
```

#### 4. Network Debugging

```bash
# Install network tools in container
docker exec -it container_name apt-get update && apt-get install -y curl iputils-ping

# Check connectivity
docker exec container_name ping other_container
docker exec container_name curl http://api:5000/health

# Inspect network
docker network inspect bridge
```

#### 5. Resource Monitoring

```bash
# Real-time stats
docker stats

# Specific container
docker stats container_name

# No streaming (single output)
docker stats --no-stream

# Custom format
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### Production Deployment Checklist

```yaml
# production-ready docker-compose.yml
version: '3.8'

services:
  app:
    image: registry.example.com/myapp:${VERSION}
    
    # Restart policy
    restart: unless-stopped
    
    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    
    # Health check
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    # Security
    user: "1001:1001"
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    
    # Logging
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    
    # Environment from file
    env_file:
      - .env.production
    
    # Volumes (read-only where possible)
    volumes:
      - app_data:/app/data
      - ./config:/app/config:ro
      - type: tmpfs
        target: /tmp
        tmpfs:
          size: 100m
    
    # Networks
    networks:
      - frontend
      - backend
    
    # Dependencies with health checks
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started

volumes:
  app_data:
    driver: local

networks:
  frontend:
  backend:
    internal: true
```

### Performance Optimization Tips

1. **Use specific image tags** - Never use `latest` in production
2. **Minimize layers** - Combine RUN commands
3. **Leverage build cache** - Order Dockerfile instructions wisely
4. **Use multi-stage builds** - Separate build and runtime dependencies
5. **Choose minimal base images** - Alpine or distroless
6. **Remove unnecessary files** - Use .dockerignore
7. **Avoid installing recommended packages** - `apt-get install --no-install-recommends`
8. **Clean package cache** - `rm -rf /var/lib/apt/lists/*`
9. **Use volumes for data** - Don't store data in containers
10. **Set resource limits** - Prevent resource exhaustion

### Security Hardening

```dockerfile
# Security-hardened Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set correct permissions
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node healthcheck.js || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/server.js"]
```

---

## Quick Reference

### Most Used Commands

```bash
# Images
docker pull image:tag
docker build -t name:tag .
docker images
docker rmi image:tag

# Containers
docker run -d -p 8080:80 --name web nginx
docker ps
docker stop container
docker rm container
docker logs -f container
docker exec -it container bash

# Cleanup
docker system prune -a
docker volume prune
docker network prune

# Compose
docker compose up -d
docker compose down
docker compose logs -f
docker compose ps
```

### Dockerfile Instructions

```dockerfile
FROM image:tag                  # Base image
WORKDIR /app                    # Set working directory
COPY src dest                   # Copy files
ADD src dest                    # Copy + extract/download
RUN command                     # Execute command
ENV KEY=value                   # Set environment variable
EXPOSE port                     # Document port
VOLUME /path                    # Create mount point
USER username                   # Set user
CMD ["executable", "arg"]       # Default command
ENTRYPOINT ["executable"]       # Command prefix
HEALTHCHECK CMD command         # Health check
ARG name=default                # Build argument
LABEL key=value                 # Metadata
```

### Docker Compose Quick Reference

```yaml
version: '3.8'
services:
  name:
    image: image:tag
    build: ./path
    ports:
      - "8080:80"
    volumes:
      - vol:/path
      - ./local:/container
    environment:
      - KEY=value
    env_file:
      - .env
    depends_on:
      - other
    networks:
      - net
    restart: unless-stopped
    command: override
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]

volumes:
  vol:

networks:
  net:
```

---

## Conclusion

This comprehensive guide covered Docker from fundamentals to production-ready practices. Key takeaways:

- **Start simple** - Master basic commands before advanced features
- **Think in containers** - Each service should be isolated and self-contained
- **Use multi-stage builds** - Keep production images lean
- **Never run as root** - Security first
- **Monitor everything** - Logs, metrics, health checks
- **Automate deployment** - CI/CD integration is essential
- **Test locally** - Docker ensures consistency across environments

**Next Steps:**
1. Practice with example projects
2. Explore Docker Swarm or Kubernetes for orchestration
3. Implement CI/CD pipelines
4. Study security best practices
5. Monitor and optimize production workloads

**Additional Resources:**
- Official Docker Documentation: https://docs.docker.com
- Docker Hub: https://hub.docker.com
- Best Practices: https://docs.docker.com/develop/dev-best-practices

Happy Dockerizing! 🐳
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - frontend
    depends_on:
      - api

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/myapp
    networks:
      - frontend
      - backend
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend

networks:
  frontend:
  backend:

volumes:
  db_data:
```

### Compose Commands

```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Build and start
docker compose up --build

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# View running services
docker compose ps

# View logs
docker compose logs

# Follow logs
docker compose logs -f api

# Execute command in service
docker compose exec api bash

# Scale service
docker compose up -d --scale api=3

# View service configuration
docker compose config

# Restart services
docker compose restart
```

### Complete Example: Web Application Stack

```yaml
version: '3.8'

services:
  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: nginx_proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
      - api
    networks:
      - frontend
    restart: unless-stopped

  # Web frontend
  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production
    container_name: web_app
    expose:
      - "3000"
    environment:
      - API_URL=http://api:5000
    networks:
      - frontend
    restart: unless-stopped

  # API backend
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: api_server
    expose:
      - "5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/appdb
      - REDIS_URL=redis://cache:6379
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - .env
    volumes:
      - ./backend/uploads:/app/uploads
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - frontend
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # PostgreSQL database
  db:
    image: postgres:15-alpine
    container_name: postgres_db
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=appdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis cache
  cache:
    image: redis:7-alpine
    container_name: redis_cache
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - backend
    restart: unless-stopped

  # Worker/Queue processor
  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.worker
    container_name: queue_worker
    environment:
      - REDIS_URL=redis://cache:6379
      - DATABASE_URL=postgresql://postgres:password@db:5432/appdb
    depends_on:
      - cache
      - db
    networks:
      - backend
    restart: unless-stopped
    deploy:
      replicas: 2

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

### Service Configuration Options

#### Build Configuration

```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile.prod
      args:
        - BUILD_ENV=production
        - VERSION=1.0
      target: production
      cache_from:
        - app:cache
```

#### Environment Variables

```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - API_KEY=abc123
    env_file:
      - .env
      - .env.production
```

#### Volumes and Bind Mounts

```yaml
services:
  app:
    volumes:
      # Named volume
      - data:/var/lib/data
      # Bind mount
      - ./config:/app/config:ro
      # Anonymous volume
      - /app/node_modules
```

#### Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

#### Health Checks

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 1m
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Compose Override Files

**docker-compose.override.yml** (automatically loaded):

```yaml
version: '3.8'

services:
  api:
    volumes:
      - ./api:/app  # Mount source for development
    environment:
      - DEBUG=true
```

**docker-compose.prod.yml** (explicitly specified):

```yaml
version: '3.8'

services:
  api:
    image: myregistry/api:prod
    deploy:
      replicas: 3
```

```bash
# Use specific override file
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

## Networking

Docker provides several networking drivers for container communication.

### Network Types

| Driver | Description | Use Case |
|--------|-------------|----------|
| **bridge** | Default, isolated network | Single host |
| **host** | No isolation, uses host network | Performance critical |
| **overlay** | Multi-host networking | Docker Swarm |
| **macvlan** | Assign MAC address | Legacy apps |
| **none** | No networking | Isolated containers |

### Bridge Network (Default)

```bash
# Create custom bridge network
docker network create mynetwork

# Create with specific subnet
docker network create --driver bridge --subnet=172.20.0.0/16 mynetwork

# Run container on custom network
docker run -d --name web --network mynetwork nginx

# Connect running container to network
docker network connect mynetwork container_name

# Disconnect from network
docker network disconnect mynetwork container_name
```

**Container Communication:**

```bash
# Containers on same network can communicate by name
docker network create appnet
docker run -d --name db --network appnet postgres
docker run -d --name api --network appnet myapi

# API can connect to: postgresql://db:5432
```

### Host Network

```bash
# Use host network (no isolation)
docker run -d --network host nginx

# Container uses host's network stack directly
# No port mapping needed
```

> **Warning:** Host networking reduces isolation and may cause port conflicts.

### Network Commands

```bash
# List networks
docker network ls

# Inspect network details
docker network inspect mynetwork

# Remove network
docker network rm mynetwork

# Remove unused networks
docker network prune

# View container's networks
docker inspect -f '{{json .NetworkSettings.Networks}}' container_name
```

### DNS and Service Discovery

Containers on the same user-defined network can resolve each other by name:

```yaml
# docker-compose.yml
services:
  web:
    image: nginx
    networks:
      - mynet
  
  api:
    image: myapi
    networks:
      - mynet
    environment:
      # Web can be reached at http://web:80
      - WEB_URL=http://web

networks:
  mynet:
```

### Port Mapping

```bash
# Map container port to host
docker run -d -p 8080:80 nginx
# Host:8080 → Container:80

# Map to random host port
docker run -d -P nginx

# Map specific interface
docker run -d -p 127.0.0.1:8080:80 nginx

# Map UDP port
docker run -d -p 53:53/udp dns-server

# Map multiple ports
docker run -d -p 80:80 -p 443:443 nginx
```

### Advanced Networking Example

```yaml
version: '3.8'

services:
  web:
    image: nginx
    networks:
      frontend:
        ipv4_address: 172.20.0.10
      backend:
    ports:
      - "80:80"

  api:
    image: myapi
    networks:
      backend:
        aliases:
          - api-service
    expose:
      - "5000"

  db:
    image: postgres
    networks:
      backend:
    environment:
      - POSTGRES_PASSWORD=secret

networks:
  frontend:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
  backend:
    driver: bridge
    internal: true  # No external access
```

---

## Volumes & Storage

Docker provides three main storage options: **volumes**, **bind mounts**, and **tmpfs mounts**.

### Storage Types Comparison

| Type | Managed by | Location | Use Case |
|------|-----------|----------|----------|
| **Volumes** | Docker | `/var/lib/docker/volumes/` | Production data |
| **Bind Mounts** | User | Anywhere on host | Development |
| **tmpfs** | Memory | RAM | Temporary/sensitive data |

### Named Volumes

```bash
# Create volume
docker volume create mydata

# List volumes
docker volume ls

# Inspect volume
docker volume inspect mydata

# Remove volume
docker volume rm mydata

# Remove unused volumes
docker volume prune

# Use volume with container
docker run -d -v mydata:/data postgres
```

**Volume in Docker Compose:**

```yaml
services:
  db:
    image: postgres
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
    driver: local
```

### Bind Mounts

Bind mounts map a host file/directory to container.

```bash
# Mount host directory
docker run -d -v /host/path:/container/path nginx

# Read-only mount
docker run -d -v /host/path:/container/path:ro nginx

# Using --mount (more explicit)
docker run -d \
  --mount type=bind,source=/host/path,target=/container/path \
  nginx
```

**Development Example:**

```yaml
services:
  web:
    image: node:18
    volumes:
      # Mount source code
      - ./src:/app/src
      # Don't mount node_modules
      - /app/node_modules
    working_dir: /app
    command: npm run dev
```

### tmpfs Mounts

Store data in memory (lost on container stop).

```bash
# Create tmpfs mount
docker run -d --tmpfs /tmp nginx

# With size limit
docker run -d --tmpfs /tmp:rw,size=100m,mode=1777 nginx
```

### Volume Drivers

```bash
# Use specific volume driver
docker volume create --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.1,rw \
  --opt device=:/path/to/dir \
  nfs_volume
```

### Backup and Restore

#### Backup Volume

```bash
# Backup volume to tar file
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/backup.tar.gz -C /data .
```

#### Restore Volume

```bash
# Restore from tar file
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  ubuntu tar xzf /backup/backup.tar.gz -C /data
```

### Volume Management Best Practices

```yaml
version: '3.8'

services: