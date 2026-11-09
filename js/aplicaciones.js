/* aplicaciones.js: pestañas de aplicaciones (patrón WAI-ARIA con teclado) */
(function () {
    'use strict';

    var pestanas = Array.prototype.slice.call(document.querySelectorAll('.pestana'));
    var paneles = Array.prototype.slice.call(document.querySelectorAll('.panel-pestana'));

    function activar(indice) {
        pestanas.forEach(function (p, i) {
            var activa = i === indice;
            p.setAttribute('aria-selected', String(activa));
            p.tabIndex = activa ? 0 : -1;
            paneles[i].hidden = !activa;
        });
    }

    pestanas.forEach(function (p, i) {
        p.addEventListener('click', function () { activar(i); });
        p.addEventListener('keydown', function (e) {
            var destino = null;
            if (e.key === 'ArrowRight') { destino = (i + 1) % pestanas.length; }
            if (e.key === 'ArrowLeft') { destino = (i - 1 + pestanas.length) % pestanas.length; }
            if (e.key === 'Home') { destino = 0; }
            if (e.key === 'End') { destino = pestanas.length - 1; }
            if (destino !== null) { e.preventDefault(); activar(destino); pestanas[destino].focus(); }
        });
    });

    // Permite llegar directamente con #generacion, #depuracion, etc.
    var hash = window.location.hash.replace('#', '');
    var inicial = pestanas.findIndex(function (p) { return p.dataset.panel === hash; });
    activar(inicial >= 0 ? inicial : 0);
})();
