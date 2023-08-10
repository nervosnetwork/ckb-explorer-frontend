FROM node:18.13.0-alpine as builder

ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG API_URL=https://testnet-api.explorer.nervos.org
ARG CHAIN_TYPE=testnet
ARG GA_ID
ARG MAINNET_URL=https://explorer.nervos.org
ARG TESTNET_NAME=pudge
ARG IS_MAINTAINING=false

ENV REACT_APP_SENTRY_DSN=$SENTRY_DSN
ENV REACT_APP_API_URL=$API_URL
ENV REACT_APP_CHAIN_TYPE=$CHAIN_TYPE
ENV REACT_APP_GA_ID=$GA_ID
ENV REACT_APP_MAINNET_URL=$MAINNET_URL
ENV REACT_APP_TESTNET_NAME=$TESTNET_NAME
ENV REACT_APP_IS_MAINTAINING=$IS_MAINTAINING


WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --ignore-platform

COPY . ./

RUN yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build ./
COPY front.conf /etc/nginx/conf.d/front.conf

EXPOSE 80
