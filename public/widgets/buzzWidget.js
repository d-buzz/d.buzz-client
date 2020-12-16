/* eslint-disable */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.BuzzWidget = factory());
}(this, function () {
    'use strict';

    const w = window;
    const d = w.document;

    function BuzzWidget() {

        const BUZZ_BUTTON_HTML_PATH = 'http://localhost:3000/widgets/buzz_button.html';

        /**
         * Method for get string in the special format by arguments
         * @param {string} str
         * @param {Array} args
         */
        const stringFormat = function (str, args) {
            return str.replace(/\{(\d+)\}/g, function (m, n) {
                return args[n] || m;
            });
        };

        /**
         * Method for initialize class for all elements
         */
        this.i = function () {
            const buzz = d.querySelectorAll('.dbuzz-share-button');
            for (let i = buzz.length; i--;) {
                setIframe(buzz[i], i);
            }
        };
        
        const getSource = function (el, i) {
            let linkSrc = getAttribute(el, 'href');
            if (!linkSrc) {
                const id =  "dbuzz-widget-"+i;
                const original_referrer = encode(location.href);
                const url = encode(getUrl(el));
                const text = encode(getText(el));
                const size = getSize(el);
                const tags = getHashTags(el);
                let srcFormat = 'original_referrer={0}&id={1}&size={2}&url={3}&text={4}';
                let args = [
                    original_referrer,
                    id,
                    size,
                    url,
                    text
                ]
                if (tags.trim()) {
                    srcFormat = srcFormat+"&tags={5}";
                    args.push(tags)
                }

                linkSrc = stringFormat(srcFormat, args)
            }
            return linkSrc
        };

        const setIframe = function (el, i) {
            const size = getSize(el);
            const ifrm = createElement("iframe");
            const args = getSource(el, i);
            const source = BUZZ_BUTTON_HTML_PATH+"#"+args;
            let style = "position: static; visibility: visible;";
            if(size === 'l'){
                style = style + 'width: 76px; height: 28px;';
            }else{
                style = style + 'width: 60px; height: 20px;';
            }
            ifrm.setAttribute('id', 'dbuzz-widget-' + i);
            ifrm.setAttribute('title', 'Dbuzz share button');
            ifrm.setAttribute('class', 'dbuzz-share-button');
            ifrm.setAttribute('allowtransparency', true);
            ifrm.setAttribute('scrolling', "no");
            ifrm.setAttribute('frameBorder', 0);
            ifrm.setAttribute('style', style);
            ifrm.setAttribute('src', source);
            el.parentNode.insertBefore(ifrm, el);
            el.remove();
        }

        const createElement = function (el) {
            return d.createElement(el)
        }

        /**
         * Method for getting url from page or options
         * @param {HTMLElement} share
         */
        const getUrl = function (share) {
            return getAttribute(share, 'data-url') || location.href || ' ';
        };

        /**
         * Method for getting title from page or options
         * @param {HTMLElement} share
         */
        const getTitle = function (share) {
            return getAttribute(share, 'data-title') || d.title || ' ';
        };

        /**
         * Method for getting description from page or options
         * @param {HTMLElement} share
         */
        const getText = function (share) {
            const metaDesc = d.querySelector('meta[name=description]');
            return getAttribute(share, 'data-text') || (metaDesc && getAttribute(metaDesc, 'content')) || ' ';
        };


        /**
        * Method for getting size from page or options
        * @param {HTMLElement} share
        */
        const getSize = function (share) {
            let size = getAttribute(share, 'data-size') || d.size || 'medium';
            size = size.toLowerCase()
            if (size == "large" || size == "medium") {
                return size.charAt(0);
            } else {
                return 'm';
            }
        };

        /**
         * Method for getting size from page or options
         * @param {HTMLElement} share
         */
        const getHashTags = function (share) {
            return getAttribute(share, 'data-hashtags') || d.hashtags || ' ';
        };

        /**
         * Method for get attribute value by name
         * @param {HTMLElement} el
         * @param {string} attrName
         */
        const getAttribute = function (el, attrName) {
            return el.getAttribute(attrName);
        };

        /**
         * Method for encoding text to URL format
         * @param {string} text
         */
        const encode = function (text) {
            return encodeURIComponent(text);
        };
    }

    // start
    const buzzWidget = new BuzzWidget();
    buzzWidget.i();

    return {
        update: function () {
            buzzWidget.i();
        }
    };

}));
