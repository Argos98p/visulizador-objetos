# Using node:16-alpine base image
FROM node:16-alpine

# Set /app as the default work directory
WORKDIR /app-visualizador

# copy package.json to the working directory for packages installation
COPY package.json /app-visualizador

# Install npm dependencies
RUN yarn install

# Copy all the project files to the working directory
COPY . .
# Build for production.
RUN npm run build --production

# Install `serve` to run the application.
RUN npm install -g serve

# Set the command to start the node server.
CMD serve -s build
# Expose the port of your application to bind with the host port
EXPOSE 9094


# run your app
#CMD ["yarn", "start"]