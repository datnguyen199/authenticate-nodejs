FROM node:13-alpine

LABEL author.name="datnguyen" \
  author.email="nnd.nguyennhudat@gmail.com"

ENV APP_PATH /app
WORKDIR ${APP_PATH}

COPY . .

RUN npm install

CMD ["npm", "start"]
