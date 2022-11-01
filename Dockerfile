

# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine
# Set the working directory to /app inside the container
WORKDIR /visualizador-vehiculos
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "npx", "serve", "build" ]

# Using node:16-alpine base image
#FROM node:16-alpine
#ENV NODE_ENV development
# Add a work directory
#WORKDIR /visualizador-vehiculos
# Cache and Install dependencies
#COPY package.json .
#COPY yarn.lock .
#RUN yarn install
#ENV PATH ="./node_modules/.bin:$PATH"
# Copy app files
#COPY . .
# Expose port
#RUN npm run build
# Start the app
#CMD [ "yarn", "start" ]