#!/bin/sh
css="/testnet/`find static/css/main.*.css`"
js1="/testnet/`find static/js/2.*.js`"
js2="/testnet/`find static/js/main.*.js`"
sed  -e "s#/static/css/main.[^\"]*.css#${css}#g" -e "s#/static/js/main.[^\"]*.js#${js2}#g" -e "s#/static/js/2.[^\"]*.js#${js1}#g"  -i index.html