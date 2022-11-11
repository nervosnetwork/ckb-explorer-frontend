FROM node:12.22.8-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build ./
COPY front.conf.tmp /etc/nginx/conf.d/

ENV REACT_APP_API_URL=https://testnet-api.explorer.nervos.org
ENV REACT_APP_CHAIN_TYPE=testnet
ENV REACT_APP_GA_ID=G-F4MS15DMS6
ENV REACT_APP_MAINNET_URL=https://explorer.nervos.org
ENV REACT_APP_TESTNET_NAME=pudge

EXPOSE 80