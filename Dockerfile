FROM mhart/alpine-node:14
ENV APP_HOME /app
WORKDIR ${APP_HOME}
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
ENV HOST 0.0.0.0
EXPOSE 3000
CMD [ "yarn", "dev"]
