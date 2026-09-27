/* =========================================================================
   TYPEWRITER — títulos H2
   -------------------------------------------------------------------------
   Script isolado e independente de js/script.js — não lê, não altera e não
   depende de nada que exista lá. Ele apenas observa os elementos <h2> da
   página e aplica um efeito visual de "digitação" quando cada um entra na
   tela, uma única vez.
 
   O texto original de cada h2 é preservado integralmente:
   - visualmente, cada letra é a mesma, só aparece de forma progressiva;
   - para leitores de tela, o texto completo continua disponível de forma
     normal (via um span visualmente oculto), então nada muda na acessibilidade.
 
   Se o usuário preferir menos movimento (prefers-reduced-motion) ou o
   navegador não suportar IntersectionObserver, este script não faz nada e
   o título permanece exatamente como está no HTML original.
   ========================================================================= */
(function () {
    'use strict';
 
    var reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduzMovimento || !('IntersectionObserver' in window)) return;
 
    /* Lê o intervalo entre letras definido no CSS (--tw-step), para manter
       a duração calculada aqui sempre sincronizada com a animação visual. */
    function lerPassoMs() {
        var valor = getComputedStyle(document.documentElement).getPropertyValue('--tw-step');
        var numero = parseFloat(valor);
        return isNaN(numero) ? 30 : numero;
    }
 
    function prepararTitulo(h2) {
        if (h2.dataset.twPronto) return;
        h2.dataset.twPronto = '1';
 
        var textoOriginal = h2.textContent;
        var contador = { i: 0 };
        var conteudo = document.createDocumentFragment();
 
        function processarTexto(texto) {
            for (var idx = 0; idx < texto.length; idx++) {
                var caractere = texto[idx];
                if (caractere === ' ') {
                    // espaço fica como texto normal, preservando a quebra de linha responsiva
                    conteudo.appendChild(document.createTextNode(' '));
                } else {
                    var span = document.createElement('span');
                    span.className = 'tw-char';
                    span.style.setProperty('--i', contador.i++);
                    span.textContent = caractere;
                    conteudo.appendChild(span);
                }
            }
        }
 
        Array.prototype.forEach.call(h2.childNodes, function (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                processarTexto(node.textContent);
            } else if (node.nodeName === 'BR') {
                conteudo.appendChild(document.createElement('br'));
            } else {
                // qualquer outro elemento eventualmente presente é preservado como está
                conteudo.appendChild(node.cloneNode(true));
            }
        });
 
        var cursor = document.createElement('span');
        cursor.className = 'tw-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.style.setProperty('--i', contador.i);
        conteudo.appendChild(cursor);
 
        var envolveLetras = document.createElement('span');
        envolveLetras.className = 'tw-chars';
        envolveLetras.setAttribute('aria-hidden', 'true');
        envolveLetras.appendChild(conteudo);
 
        var somenteLeitorDeTela = document.createElement('span');
        somenteLeitorDeTela.className = 'sr-only-tw';
        somenteLeitorDeTela.textContent = textoOriginal;
 
        h2.innerHTML = '';
        h2.appendChild(somenteLeitorDeTela);
        h2.appendChild(envolveLetras);
 
        var totalCaracteres = contador.i;
        var passoMs = lerPassoMs();
 
        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
 
                h2.classList.add('tw-active');
                observador.unobserve(h2);
 
                var duracaoTotal = (totalCaracteres + 2) * passoMs + 500;
                window.setTimeout(function () {
                    h2.classList.add('tw-cursor-done');
                }, duracaoTotal);
            });
        }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });
 
        observador.observe(h2);
    }
 
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('h2').forEach(prepararTitulo);
    });
})();
 