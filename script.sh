#!/bin/sh
js1="/testnet/`find build/static/js/2.*.js`"
js2="/testnet/`find build/static/js/main.*.js`"
sed  -e "s#/build/static/js/main.[^\"]*.js#${js2}#g" -e "s#/build/static/js/2.[^\"]*.js#${js1}#g"  -i build/index.html