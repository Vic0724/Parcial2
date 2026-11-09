/* futuro.js: filtro de tareas (delegables / criterio humano) */
(function () {
    'use strict';

    var filtros = Array.prototype.slice.call(document.querySelectorAll('.filtro'));
    var tarjetas = Array.prototype.slice.call(document.querySelectorAll('[data-tipo]'));
    var estado = document.getElementById('estado-filtro');

    function filtrar(tipo) {
        var visibles = 0;
        tarjetas.forEach(function (t) {
            var mostrar = tipo === 'todas' || t.dataset.tipo === tipo;
            t.hidden = !mostrar;
            if (mostrar) { visibles++; }
        });
        filtros.forEach(function (f) { f.setAttribute('aria-pressed', String(f.dataset.filtro === tipo)); });
        estado.textContent = 'Mostrando ' + visibles + ' de ' + tarjetas.length + ' tareas.';
    }

    filtros.forEach(function (f) {
        f.addEventListener('click', function () { filtrar(f.dataset.filtro); });
    });
    filtrar('todas');
})();
