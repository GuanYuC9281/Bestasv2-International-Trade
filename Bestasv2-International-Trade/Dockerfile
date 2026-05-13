FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy client dependencies
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000 5000

# Start command
CMD ["npm", "run", "dev"]
