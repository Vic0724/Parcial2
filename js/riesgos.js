/* riesgos.js: lista de chequeo de uso responsable con progreso */
(function () {
    'use strict';

    var casillas = Array.prototype.slice.call(document.querySelectorAll('.lista-chequeo input'));
    var barra = document.getElementById('barra-chequeo');
    var texto = document.getElementById('texto-chequeo');
    var barraContenedor = document.getElementById('progreso-chequeo');
    var reiniciar = document.getElementById('reiniciar-chequeo');

    function actualizar() {
        var marcadas = casillas.filter(function (c) { return c.checked; }).length;
        var porcentaje = Math.round((marcadas / casillas.length) * 100);
        barra.style.width = porcentaje + '%';
        barraContenedor.setAttribute('aria-valuenow', String(porcentaje));
        if (marcadas === casillas.length) {
            texto.textContent = 'Completaste las ' + casillas.length + ' verificaciones: el código generado ya puede pasar a revisión por pares.';
        } else {
            texto.textContent = marcadas + ' de ' + casillas.length + ' verificaciones completadas.';
        }
    }

    casillas.forEach(function (c) { c.addEventListener('change', actualizar); });
    if (reiniciar) {
        reiniciar.addEventListener('click', function () {
            casillas.forEach(function (c) { c.checked = false; });
            actualizar();
        });
    }
    actualizar();
})();
