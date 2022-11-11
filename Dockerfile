FROM node:12.22.8-alpine as builder

ARG API_URL=https://testnet-api.explorer.nervos.org
ARG CHAIN_TYPE=testnet
ARG GA_ID=G-F4MS15DMS6
ARG MAINNET_URL=https://explorer.nervos.org
ARG TESTNET_NAME=pudge

ENV REACT_APP_API_URL=$API_URL
ENV REACT_APP_CHAIN_TYPE=$CHAIN_TYPE
ENV REACT_APP_GA_ID=$GA_ID
ENV REACT_APP_MAINNET_URL=$MAINNET_URL
ENV REACT_APP_TESTNET_NAME=$TESTNET_NAME


WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build ./
COPY front.conf /etc/nginx/conf.d/front.conf

EXPOSE 80