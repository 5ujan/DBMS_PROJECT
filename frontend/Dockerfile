# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the frontend port
EXPOSE 3333

# Build and serve the frontend app
CMD ["npm", "run", "dev"]
