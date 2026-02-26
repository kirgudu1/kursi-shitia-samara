/* /aff-wrap.ecole.js
 * «Хитроссылки» — клик по [data-cta-url] с доменом ecolespb.ru
 * оборачивает в трекинг go.avnxt.site и открывает в новой вкладке.
 * Для поисковиков ссылок не существует (нет тега <a>).
 * sub2 = URL текущей страницы.
 */

(function () {
    'use strict';

    // === НАСТРОЙКИ ===
    var WRAP_BASE = 'https://go.avnxt.site/b7cc620e1bfb8531';
    var ERID = 'LdtCKaoMZ';
    var M_PARAM = '2';
    var MATCH_HOST = 'ecolespb.ru';

    // === УТИЛИТЫ ===

    function isEcoleDomain(hostname) {
        if (!hostname) return false;
        return hostname === MATCH_HOST || hostname.endsWith('.' + MATCH_HOST);
    }

    function buildWrapped(originalHref) {
        var params = [
            'erid=' + encodeURIComponent(ERID),
            'm=' + encodeURIComponent(M_PARAM),
            'dl=' + encodeURIComponent(originalHref),
            'sub1=' + encodeURIComponent(originalHref),
            'sub2=' + encodeURIComponent(location.href)
        ];
        return WRAP_BASE + '?' + params.join('&');
    }

    // === ОБРАБОТЧИК КЛИКОВ ===

    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-cta-url]');
        if (!el) return;

        var rawUrl = el.getAttribute('data-cta-url');
        if (!rawUrl) return;

        var absolute;
        try {
            absolute = new URL(rawUrl, location.href).href;
        } catch (err) {
            return;
        }

        // Проверяем — наш домен?
        try {
            var u = new URL(absolute);
            if (!isEcoleDomain(u.hostname)) return; // не наш — пропускаем
        } catch (err) {
            return;
        }

        var finalUrl = buildWrapped(absolute);
        window.open(finalUrl, '_blank', 'noopener');
        e.preventDefault();
    });

    // === SAFETY: оборачиваем случайные <a> на ecolespb.ru (если проскочат) ===

    function wrapStrayAnchors(root) {
        var anchors = (root || document).querySelectorAll('a[href]');
        for (var i = 0; i < anchors.length; i++) {
            var a = anchors[i];
            if (a.hasAttribute('data-aff-ecole')) continue;
            var href = a.getAttribute('href');
            if (!href) continue;
            try {
                var u = new URL(href, location.href);
                if (!/^https?:$/i.test(u.protocol)) continue;
                if (u.href.indexOf(WRAP_BASE) === 0) continue;
                if (!isEcoleDomain(u.hostname)) continue;
            } catch (e) { continue; }

            var abs = new URL(href, location.href).href;
            a.setAttribute('href', buildWrapped(abs));
            a.setAttribute('data-aff-ecole', '1');
            var rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
            ['nofollow', 'noopener', 'noreferrer', 'sponsored'].forEach(function (f) {
                if (rel.indexOf(f) === -1) rel.push(f);
            });
            a.setAttribute('rel', rel.join(' '));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { wrapStrayAnchors(); });
    } else {
        wrapStrayAnchors();
    }

    new MutationObserver(function (muts) {
        muts.forEach(function (m) {
            if (!m.addedNodes) return;
            m.addedNodes.forEach(function (n) {
                if (n.nodeType !== 1) return;
                if (n.tagName === 'A') wrapStrayAnchors(n.parentNode);
                else wrapStrayAnchors(n);
            });
        });
    }).observe(document.documentElement, { childList: true, subtree: true });

})();
