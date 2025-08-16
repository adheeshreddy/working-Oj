# Base Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build tools and JDK
RUN apk update && apk add --no-cache \
    g++ \
    make \
    python3 \
    python3-dev \
    openjdk17

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose compiler port
EXPOSE 9000

# Run the compiler server
CMD ["node", "index.js"]
