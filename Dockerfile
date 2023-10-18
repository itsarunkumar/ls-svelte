# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (or pnpm-lock.json) to the container
COPY package.json pnpm-lock.yaml ./

# Install project dependencies using pnpm
RUN pnpm install

# Copy the entire application source code into the container
COPY . .

RUN pnpm db

# Build your SvelteKit application
RUN pnpm  build

# Expose the port that your application will run on
EXPOSE 3000

# Define the command to start your application
CMD [ "node", "build/" ]
