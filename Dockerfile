FROM node:16-alpine
# Override the base log level (info).
ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /visualizador-vehiculos
# Install and configure `serve`.
RUN npm install -g serve
CMD serve -s build
EXPOSE 3000

# Install all dependencies of the current project.
COPY package.json package.json
#COPY npm-shrinkwrap.json npm-shrinkwrap.json
RUN npm install

# Copy all local files into the image.
COPY . .

# Build for production.
RUN npm run build --production


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