/* main.js: comportamiento común a todas las páginas */
(function () {
    'use strict';

    // Menú plegable en pantallas pequeñas
    var boton = document.getElementById('nav-toggle');
    var lista = document.getElementById('nav-lista');

    if (boton && lista) {
        boton.addEventListener('click', function () {
            var abierto = lista.classList.toggle('abierto');
            boton.setAttribute('aria-expanded', String(abierto));
            boton.textContent = abierto ? 'Cerrar' : 'Menú';
        });

        // Escape cierra el menú (control y libertad del usuario)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lista.classList.contains('abierto')) {
                lista.classList.remove('abierto');
                boton.setAttribute('aria-expanded', 'false');
                boton.textContent = 'Menú';
                boton.focus();
            }
        });
    }

    // Año actual en el pie
    var anio = document.getElementById('anio');
    if (anio) { anio.textContent = new Date().getFullYear(); }
})();
