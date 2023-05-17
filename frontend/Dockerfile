# Use the official Node.js 14 image as the base
FROM node:14

# Set the working directory inside the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port that the React app is listening on 
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
