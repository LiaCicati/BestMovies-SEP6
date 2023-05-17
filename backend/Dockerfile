# Use the official Node.js 14 image as the base
FROM node:14

# Set the working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the port the Express app is listening on 
EXPOSE 3001

# Start the Node.js application
CMD ["npm", "start"]
