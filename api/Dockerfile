FROM node:lts-alpine as build
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json",  "./"]
RUN npm install --production --silent
COPY . .

FROM node:lts-alpine
WORKDIR /app/backend
RUN npm install -g pm2  
COPY --from=build /usr/src/app /app/backend
EXPOSE 8080
# RUN adduser -u node -D -s /bin/sh -g ping node
RUN chown -R node /app/backend
USER node
# CMD ["node", "index.js"]
CMD [ "pm2-runtime","index.js" ]


