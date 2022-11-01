# Using node:16-alpine base image
FROM node:16-alpine
ENV NODE_ENV production
# Add a work directory
WORKDIR /visualizador-vehiculos
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
ENV PATH ="./node_modules/.bin:$PATH"
# Copy app files
COPY . .
# Expose port
RUN npm run build
# Start the app
CMD [ "yarn", "start" ]