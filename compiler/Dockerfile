# Use a base image with a recent version of Node.js for Alpine Linux
FROM node:18-alpine

# Set the working directory for the application
WORKDIR /app

# Install necessary build tools and languages
# apk is the package manager for Alpine Linux.
RUN apk update && apk add --no-cache \
    g++ \
    python3 \
    py3-pip \
    openjdk21

# The rest of the setup is for the Node.js server inside this container
# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files into the container
COPY . .

# Expose the port for the compiler server
EXPOSE 9000

# Command to run the Node.js server
CMD ["node", "index.js"]
