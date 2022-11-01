# pull the official base image
FROM node:alpine
# set working direction
WORKDIR /visualizador-vehiculos
# add `/app/node_modules/.bin` to $PATH
ENV PATH ="./node_modules/.bin:$PATH"
# install application dependencies
COPY package.json .
COPY package-lock.json .
RUN npm i
# add app
COPY . .
# start app
RUN npm run build --production
CMD ["npm", "start"]


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