/* funcionamiento.js: pasos del modelo y tokenizador didáctico */
(function () {
    'use strict';

    // ---- Pasos del proceso (patrón de pestañas accesible) ----
    var botones = Array.prototype.slice.call(document.querySelectorAll('.paso-boton'));
    var paneles = Array.prototype.slice.call(document.querySelectorAll('.paso-panel'));

    function activar(indice) {
        botones.forEach(function (b, i) {
            var activo = i === indice;
            b.setAttribute('aria-selected', String(activo));
            b.tabIndex = activo ? 0 : -1;
            paneles[i].hidden = !activo;
        });
    }

    botones.forEach(function (b, i) {
        b.addEventListener('click', function () { activar(i); });
        b.addEventListener('keydown', function (e) {
            var destino = null;
            if (e.key === 'ArrowRight') { destino = (i + 1) % botones.length; }
            if (e.key === 'ArrowLeft') { destino = (i - 1 + botones.length) % botones.length; }
            if (destino !== null) { e.preventDefault(); activar(destino); botones[destino].focus(); }
        });
    });
    if (botones.length) { activar(0); }

    // ---- Tokenizador didáctico ----
    // Los modelos reales usan tokenizadores por subpalabras (p. ej. BPE).
    // Aquí se separa por palabras, números y símbolos para visualizar la idea.
    var campo = document.getElementById('texto-token');
    var salida = document.getElementById('salida-tokens');
    var total = document.getElementById('total-tokens');
    var contador = document.getElementById('contador-token');

    function tokenizar(texto) {
        return texto.match(/[A-Za-zÁÉÍÓÚáéíóúÑñÜü_]+|\d+|[^\sA-Za-z\d]/g) || [];
    }

    function mostrar() {
        var texto = campo.value;
        var tokens = tokenizar(texto);
        salida.innerHTML = '';
        tokens.forEach(function (t) {
            var span = document.createElement('span');
            span.className = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü_\d]+$/.test(t) ? 'ficha' : 'ficha simbolo';
            span.textContent = t;
            salida.appendChild(span);
        });
        total.textContent = tokens.length === 1 ? '1 token' : tokens.length + ' tokens';
        contador.textContent = texto.length + ' / ' + campo.maxLength;
    }

    if (campo) {
        campo.addEventListener('input', mostrar);
        mostrar();
    }
})();
