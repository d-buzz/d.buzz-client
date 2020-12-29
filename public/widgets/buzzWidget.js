/* eslint-disable */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.__dbuzzwidget = factory());
}(this, function () {
    'use strict';

    const w = window;
    const d = w.document;

    function DbuzzWidget() {

        const resourceBaseUrl = "https://d.buzz";
        const buzzButtonHtmlPath = "/widgets/buzz_button.html";
        const dbuzzShareClass = "dbuzz-share-button";
        const intentUrlRegex = /d\.buzz\/#\/intent\/buzz/


        /**
         * Method for initialize class for all elements
         */
        this.i = function () {
            const b = d.getElementsByClassName(dbuzzShareClass);
            for (let i = b.length; i--;) {
                setIframe(b[i], i);
            }
        };

        const setIframe = function (el, i) {
            const ifrm = createElement("iframe");
            const size = getSize(el);
            const args = getSource(el, i);
            const source = resourceBaseUrl + buzzButtonHtmlPath + "#" + args;
            let style = "position: static; visibility: visible;";
            if (size === 'l') {
                style = style + 'width: 76px; height: 28px;';
            } else {
                style = style + 'width: 60px; height: 20px;';
            }
            ifrm.setAttribute('id', 'dbuzz-widget-' + i);
            ifrm.setAttribute('title', 'Dbuzz share button');
            ifrm.setAttribute('class', dbuzzShareClass);
            ifrm.setAttribute('allowtransparency', true);
            ifrm.setAttribute('scrolling', "no");
            ifrm.setAttribute('frameBorder', 0);
            ifrm.setAttribute('style', style);
            ifrm.setAttribute('src', source);
            el.parentNode.insertBefore(ifrm, el);
            el.remove();
        }

        const getSource = function (el, i) {
            const params = {
                original_referrer: encode(location.href),
                id: "dbuzz-widget-" + i,
                text: encode(getText(el)),
                size: getSize(el),
                url: encode(getUrl(el)),
                tags: getHashTags(el).trim()
            }
            let srcFormat = "";
            let args = [];
            let count = 0;
            Object.entries(params).forEach(function (e) {
                const [key, value] = e;
                if (value) {
                    if(srcFormat){
                        srcFormat += "&"; 
                    }
                    srcFormat += key + "={" + count + "}";
                    args.push(value);
                }
                count++;
            });
            return stringFormat(srcFormat, args);
        };
 
        const extractHrefParams = function (el, attr) {
            let params = "";
            const intentUrl  = getAttribute(el,"href");
            if(intentUrl){
                const validateUrl = validateIntentUrl(intentUrl);
                const query = validateUrl ? validateUrl.input : '';
                const queryParams = splitUrlQuery(decodeUrl(query));
                if(queryParams && queryParams[attr]){
                    params = queryParams[attr];
                }
            }
            return params;
        }

        const getUrl = function (el) {
            return extractHrefParams(el,'url') || getAttribute(el, 'data-url') || location.href || ' ';
        };

        const getText = function (el) {
            return extractHrefParams(el,'text') || 
                   getAttribute(el, 'data-text') || 
                   d.title || ' ';
        };

        const getSize = function (el) {
            let size = extractHrefParams(el,'size') || getAttribute(el, 'data-size') || 'medium';
            size = size.toLowerCase()
            if (size == "large" || size == "medium") {
                return size.charAt(0);
            } else {
                return 'm';
            }
        };

        const getHashTags = function (el) {
            return extractHrefParams(el,'tags') || getAttribute(el, 'data-hashtags') || ' ';
        };
        
        const createElement = function (el) {
            return d.createElement(el)
        }

        const getAttribute = function (el, attrName) {
            return el.getAttribute(attrName);
        };

        const decodeUrl = function (el) {
            const e = el && el.split("?");
            return 2 === e.length ? e[1] : "";
        }

        const encode = function (t) {
            return encodeURIComponent(t);
        };

        const decode = function (t) {
            return decodeURIComponent(t);
        };

        const splitUrlQuery = function (q) {
            let e = {};
            return q ? (q.split("&").forEach(function(t) {
                const n = t.split("=");
                const i = n[0];
                const v = n[1];
                if(2 === n.length){
                    e[i] = decode(v);
                }
            }),e) : {};
        }
        
        const stringFormat = function (str, args) {
            return str.replace(/\{(\d+)\}/g, function (m, n) {
                return args[n] || m;
            });
        };

        const validateIntentUrl = function (url) {
            return url.match(intentUrlRegex);
        }
    }

    // start
    const __dbuzzwidget = new DbuzzWidget();
    __dbuzzwidget.i();
    return {
        init: function () {
            __dbuzzwidget.i();
        }
    };
}));
