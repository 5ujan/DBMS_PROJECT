# Use Node.js 18 as base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all backend files
COPY . .

# Expose port 5555 for backend
EXPOSE 5555

# Start the backend
CMD ["node", "app.js"]
