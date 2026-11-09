/* demo.js: demostración práctica
   Simulación educativa SIN conexión a un modelo real.
   Flujo: instrucción -> código generado -> revisión (lista + pruebas) -> corrección -> decisión. */
(function () {
    'use strict';

    /* ---------- Catálogo de tareas que la simulación reconoce ---------- */
    var TAREAS = {
        factorial: {
            nombre: 'factorial',
            palabras: ['factorial'],
            version1:
"function factorial(n) {\n" +
"  let resultado = 1;\n" +
"  for (let i = 1; i < n; i++) {\n" +
"    resultado *= i;\n" +
"  }\n" +
"  return resultado;\n" +
"}",
            version2:
"function factorial(n) {\n" +
"  if (!Number.isInteger(n) || n < 0) {\n" +
"    throw new RangeError('n debe ser un entero >= 0');\n" +
"  }\n" +
"  let resultado = 1;\n" +
"  for (let i = 2; i <= n; i++) {\n" +
"    resultado *= i;\n" +
"  }\n" +
"  return resultado;\n" +
"}",
            pruebas: [
                { texto: 'factorial(0)', args: [0], esperado: 1 },
                { texto: 'factorial(1)', args: [1], esperado: 1 },
                { texto: 'factorial(5)', args: [5], esperado: 120 },
                { texto: 'factorial(-1)', args: [-1], error: true }
            ],
            hallazgo: 'El ciclo usa i < n y omite el último factor; además no valida números negativos.'
        },
        correo: {
            nombre: 'validarCorreo',
            palabras: ['correo', 'email', 'e-mail', 'mail'],
            version1:
"function validarCorreo(texto) {\n" +
"  return /^\\S+@\\S+$/.test(texto);\n" +
"}",
            version2:
"function validarCorreo(texto) {\n" +
"  if (typeof texto !== 'string') return false;\n" +
"  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(texto.trim());\n" +
"}",
            pruebas: [
                { texto: 'validarCorreo("ana@correo.com")', args: ['ana@correo.com'], esperado: true },
                { texto: 'validarCorreo("ana@correo")', args: ['ana@correo'], esperado: false },
                { texto: 'validarCorreo("ana perez@x.com")', args: ['ana perez@x.com'], esperado: false },
                { texto: 'validarCorreo(null)', args: [null], esperado: false }
            ],
            hallazgo: 'La expresión regular acepta direcciones sin dominio de primer nivel (ana@correo) y falla si no recibe texto.'
        },
        promedio: {
            nombre: 'promedio',
            palabras: ['promedio', 'media', 'notas'],
            version1:
"function promedio(notas) {\n" +
"  let suma = 0;\n" +
"  for (const nota of notas) {\n" +
"    suma += nota;\n" +
"  }\n" +
"  return suma / notas.length;\n" +
"}",
            version2:
"function promedio(notas) {\n" +
"  const validas = notas.filter(Number.isFinite);\n" +
"  if (validas.length === 0) return 0;\n" +
"  const suma = validas.reduce((a, b) => a + b, 0);\n" +
"  return suma / validas.length;\n" +
"}",
            pruebas: [
                { texto: 'promedio([80, 90, 100])', args: [[80, 90, 100]], esperado: 90 },
                { texto: 'promedio([])', args: [[]], esperado: 0 },
                { texto: 'promedio([70, "x", 90])', args: [[70, 'x', 90]], esperado: 80 }
            ],
            hallazgo: 'Con un arreglo vacío divide entre cero (NaN) y los valores no numéricos contaminan el resultado.'
        },
        palindromo: {
            nombre: 'esPalindromo',
            palabras: ['palindromo', 'palíndromo', 'capicua'],
            version1:
"function esPalindromo(texto) {\n" +
"  const invertido = texto.split('').reverse().join('');\n" +
"  return texto === invertido;\n" +
"}",
            version2:
"function esPalindromo(texto) {\n" +
"  const limpio = texto\n" +
"    .normalize('NFD')\n" +
"    .replace(/[\\u0300-\\u036f]/g, '')\n" +
"    .toLowerCase()\n" +
"    .replace(/[^a-z0-9]/g, '');\n" +
"  return limpio === limpio.split('').reverse().join('');\n" +
"}",
            pruebas: [
                { texto: 'esPalindromo("radar")', args: ['radar'], esperado: true },
                { texto: 'esPalindromo("hola")', args: ['hola'], esperado: false },
                { texto: 'esPalindromo("Anita lava la tina")', args: ['Anita lava la tina'], esperado: true },
                { texto: 'esPalindromo("Sé verlas al revés")', args: ['Sé verlas al revés'], esperado: true }
            ],
            hallazgo: 'Distingue mayúsculas, espacios y tildes, por lo que rechaza frases que sí son palíndromos.'
        }
    };

    var EJEMPLOS = {
        factorial: 'Escribe una función en JavaScript que calcule el factorial de un número.',
        correo: 'Crea una función que valide si un correo electrónico es válido.',
        promedio: 'Haz una función que calcule el promedio de un arreglo de notas.',
        palindromo: 'Escribe una función que indique si una frase es un palíndromo.'
    };

    /* ---------- Referencias al DOM ---------- */
    var $ = function (id) { return document.getElementById(id); };
    var formulario = $('form-instruccion');
    var selector = $('ejemplo');
    var instruccion = $('instruccion');
    var contador = $('contador-instruccion');
    var estadoGen = $('estado-generacion');
    var codigo = $('codigo-generado');
    var nombreArchivo = $('nombre-archivo');
    var etapaRevision = $('etapa-revision');
    var chequeo = Array.prototype.slice.call(document.querySelectorAll('#lista-revision input'));
    var btnPruebas = $('btn-pruebas');
    var tablaCuerpo = $('tabla-pruebas');
    var tablaContenedor = $('contenedor-tabla');
    var estadoPruebas = $('estado-pruebas');
    var hallazgo = $('hallazgo');
    var btnCorregir = $('btn-corregir');
    var etapaDecision = $('etapa-decision');
    var btnAceptar = $('btn-aceptar');
    var btnRechazar = $('btn-rechazar');
    var mensajeFinal = $('mensaje-final');
    var btnReiniciar = $('btn-reiniciar');

    var estado = { tarea: null, version: 0, aprobado: false };

    /* ---------- Utilidades ---------- */
    function sinTildes(t) {
        return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function detectarTarea(texto) {
        var limpio = sinTildes(texto);
        var claves = Object.keys(TAREAS);
        for (var i = 0; i < claves.length; i++) {
            var t = TAREAS[claves[i]];
            for (var j = 0; j < t.palabras.length; j++) {
                if (limpio.indexOf(sinTildes(t.palabras[j])) !== -1) { return claves[i]; }
            }
        }
        return null;
    }

    function escapar(t) {
        return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function marcarEstado(el, clase, texto) {
        el.className = 'estado ' + clase;
        el.textContent = texto;
    }

    function mostrarCodigo(tarea, version) {
        var fuente = version === 1 ? TAREAS[tarea].version1 : TAREAS[tarea].version2;
        codigo.innerHTML = escapar(fuente);
        nombreArchivo.textContent = TAREAS[tarea].nombre + '.js  ·  versión ' + version;
    }

    function ejecutarPrueba(tarea, version, prueba) {
        var fuente = version === 1 ? tarea.version1 : tarea.version2;
        try {
            var fn = new Function(fuente + '; return ' + tarea.nombre + ';')();
            var resultado = fn.apply(null, prueba.args);
            if (prueba.error) {
                return { ok: false, obtenido: String(resultado) + ' (no lanzó error)' };
            }
            var ok = Object.is(resultado, prueba.esperado);
            return { ok: ok, obtenido: formato(resultado) };
        } catch (e) {
            if (prueba.error) { return { ok: true, obtenido: e.name + ': ' + e.message }; }
            return { ok: false, obtenido: e.name + ': ' + e.message };
        }
    }

    function formato(v) {
        return typeof v === 'string' ? '"' + v + '"' : String(v);
    }

    function esperadoTexto(p) {
        return p.error ? 'lanza un error' : formato(p.esperado);
    }

    function bloquearEtapa(etapa, bloqueada) {
        etapa.setAttribute('aria-disabled', String(bloqueada));
        Array.prototype.forEach.call(etapa.querySelectorAll('input, button'), function (el) {
            el.disabled = bloqueada;
        });
    }

    function reiniciarRevision() {
        chequeo.forEach(function (c) { c.checked = false; });
        tablaCuerpo.innerHTML = '';
        tablaContenedor.hidden = true;
        hallazgo.hidden = true;
        btnCorregir.hidden = true;
        marcarEstado(estadoPruebas, 'espera', 'Pruebas sin ejecutar');
        mensajeFinal.hidden = true;
        estado.aprobado = false;
        bloquearEtapa(etapaDecision, true);
    }

    /* ---------- Contador y ejemplos ---------- */
    function actualizarContador() {
        contador.textContent = instruccion.value.length + ' / ' + instruccion.maxLength;
    }

    selector.addEventListener('change', function () {
        if (selector.value && EJEMPLOS[selector.value]) {
            instruccion.value = EJEMPLOS[selector.value];
            actualizarContador();
        }
    });
    instruccion.addEventListener('input', actualizarContador);
    actualizarContador();

    /* ---------- Etapa 1: generar ---------- */
    formulario.addEventListener('submit', function (e) {
        e.preventDefault();
        var texto = instruccion.value.trim();
        if (texto.length < 8) {
            marcarEstado(estadoGen, 'fallo', 'Escribe una instrucción de al menos 8 caracteres.');
            instruccion.focus();
            return;
        }
        var clave = detectarTarea(texto);
        reiniciarRevision();
        if (!clave) {
            estado.tarea = null;
            codigo.textContent = '// Sin resultado';
            nombreArchivo.textContent = 'sin-archivo.js';
            bloquearEtapa(etapaRevision, true);
            marcarEstado(estadoGen, 'fallo', 'La simulación solo reconoce: factorial, correo, promedio y palíndromo. Elige un ejemplo de la lista.');
            return;
        }
        marcarEstado(estadoGen, 'espera', 'Generando código…');
        codigo.textContent = '// El asistente está procesando la instrucción…';
        window.setTimeout(function () {
            estado.tarea = clave;
            estado.version = 1;
            mostrarCodigo(clave, 1);
            marcarEstado(estadoGen, 'ok', 'Código generado (versión 1). Todavía NO está verificado.');
            bloquearEtapa(etapaRevision, false);
            btnPruebas.focus();
        }, 700);
    });

    /* ---------- Etapa 2: revisar ---------- */
    btnPruebas.addEventListener('click', function () {
        if (!estado.tarea) { return; }
        var tarea = TAREAS[estado.tarea];
        tablaCuerpo.innerHTML = '';
        var fallos = 0;
        tarea.pruebas.forEach(function (p) {
            var r = ejecutarPrueba(tarea, estado.version, p);
            if (!r.ok) { fallos++; }
            var fila = document.createElement('tr');
            fila.innerHTML =
                '<th scope="row"><code>' + escapar(p.texto) + '</code></th>' +
                '<td>' + escapar(esperadoTexto(p)) + '</td>' +
                '<td>' + escapar(r.obtenido) + '</td>' +
                '<td class="' + (r.ok ? 'ok' : 'fallo') + '">' + (r.ok ? '✔ Pasa' : '✘ Falla') + '</td>';
            tablaCuerpo.appendChild(fila);
        });
        tablaContenedor.hidden = false;

        if (fallos > 0) {
            marcarEstado(estadoPruebas, 'fallo', fallos + ' de ' + tarea.pruebas.length + ' pruebas fallan. No aceptes este código.');
            hallazgo.hidden = false;
            hallazgo.querySelector('p').innerHTML = '<strong>Hallazgo de la revisión:</strong> ' + escapar(tarea.hallazgo);
            btnCorregir.hidden = estado.version === 2;
            estado.aprobado = false;
            bloquearEtapa(etapaDecision, true);
        } else {
            marcarEstado(estadoPruebas, 'ok', 'Las ' + tarea.pruebas.length + ' pruebas pasan.');
            hallazgo.hidden = true;
            btnCorregir.hidden = true;
            estado.aprobado = true;
            bloquearEtapa(etapaDecision, false);
        }
    });

    /* ---------- Corrección (segunda iteración del asistente) ---------- */
    btnCorregir.addEventListener('click', function () {
        estado.version = 2;
        mostrarCodigo(estado.tarea, 2);
        marcarEstado(estadoGen, 'ok', 'Versión 2 generada a partir del hallazgo. Vuelve a ejecutar las pruebas.');
        btnCorregir.hidden = true;
        hallazgo.hidden = true;
        tablaContenedor.hidden = true;
        marcarEstado(estadoPruebas, 'espera', 'Pruebas sin ejecutar');
        bloquearEtapa(etapaDecision, true);
        btnPruebas.focus();
    });

    /* ---------- Etapa 3: decisión humana ---------- */
    btnAceptar.addEventListener('click', function () {
        var marcadas = chequeo.filter(function (c) { return c.checked; }).length;
        mensajeFinal.hidden = false;
        if (marcadas < chequeo.length) {
            mensajeFinal.className = 'aviso alerta';
            mensajeFinal.querySelector('p').innerHTML = '<strong>Falta revisión humana.</strong> Las pruebas pasan, pero marcaste ' + marcadas + ' de ' + chequeo.length + ' puntos de la lista. Las pruebas automáticas no sustituyen entender el código.';
        } else {
            mensajeFinal.className = 'aviso exito';
            mensajeFinal.querySelector('p').innerHTML = '<strong>Código aceptado.</strong> Pasó las pruebas y la lista de revisión. Aun así, conviene registrar en el commit que fue asistido por IA y revisado por una persona.';
        }
    });

    btnRechazar.addEventListener('click', function () {
        mensajeFinal.hidden = false;
        mensajeFinal.className = 'aviso';
        mensajeFinal.querySelector('p').innerHTML = '<strong>Código descartado.</strong> Rechazar una propuesta es una decisión válida: puedes reformular la instrucción con más contexto y volver a generar.';
    });

    /* ---------- Empezar de nuevo (reversibilidad) ---------- */
    btnReiniciar.addEventListener('click', function () {
        selector.value = '';
        instruccion.value = '';
        actualizarContador();
        estado.tarea = null;
        codigo.textContent = '// Aquí aparecerá el código generado.';
        nombreArchivo.textContent = 'sin-archivo.js';
        marcarEstado(estadoGen, 'espera', 'Esperando una instrucción');
        reiniciarRevision();
        bloquearEtapa(etapaRevision, true);
        selector.focus();
    });

    /* Estado inicial */
    bloquearEtapa(etapaRevision, true);
    bloquearEtapa(etapaDecision, true);
})();
