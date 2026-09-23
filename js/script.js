/* =========================================================================
   PRESS KIT — DJ DE PISEIRO
   -------------------------------------------------------------------------
   >>> TODOS OS DADOS DO ARTISTA FICAM AQUI. <<<
   Altere apenas o objeto ARTISTA para atualizar nome, contatos e o PDF
   em toda a página (header, hero, contato, rodapé e botões de download).
   ========================================================================= */

const ARTISTA = {
    nome: "DJ DANDAN VIEIRA",
    whatsapp: "5511999999999",                 // só números, com DDI e DDD
    instagram: "https://instagram.com/",        // link completo do perfil
    email: "contato@email.com",
    telefone: "+55 (11) 99999-9999",            // exibido na seção de contato
    pressKit: "assets/press-kit/press-kit-dj.pdf"  // PDF oficial (coloque o arquivo aqui)
};

/* Nome do arquivo salvo no download */
const PRESS_KIT_ARQUIVO = "press-kit-dj.pdf";

/* ======================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ------------------------------------------------------------------
       1. Preenchimento automático dos dados do artista
       ------------------------------------------------------------------ */
    const soNumeros = (v) => (v || '').replace(/\D/g, '');

    document.querySelectorAll('[data-artista="nome"]').forEach(el => {
        el.textContent = ARTISTA.nome;
    });
    document.title = ARTISTA.nome + ' — DJ de Piseiro | Press Kit e Contratação';

    const contatos = {
        whatsapp:  'https://wa.me/' + soNumeros(ARTISTA.whatsapp) + '?text=' +
                   encodeURIComponent('Olá! Vim pelo site e gostaria de informações para contratar o ' + ARTISTA.nome + '.'),
        instagram: ARTISTA.instagram,
        email:     'mailto:' + ARTISTA.email
    };

    document.querySelectorAll('[data-contato]').forEach(el => {
        const tipo = el.getAttribute('data-contato');
        if (tipo === 'telefone-txt') { el.textContent = ARTISTA.telefone; return; }
        if (tipo === 'email-txt')    { el.textContent = ARTISTA.email; return; }
        if (contatos[tipo]) el.href = contatos[tipo];
    });

    const anoEl = document.getElementById('ano');
    if (anoEl) anoEl.textContent = new Date().getFullYear();


    /* ------------------------------------------------------------------
       2. Press Kit — download e visualização do PDF
          O arquivo deve estar em: assets/press-kit/press-kit-dj.pdf
       ------------------------------------------------------------------ */
    const status = document.getElementById('pkStatus');

    let toastEl = null;

    function avisar(msg) {
        // aviso dentro da seção Press Kit
        if (status) {
            status.textContent = msg;
            status.classList.add('is-visible');
            window.clearTimeout(status._t);
            status._t = window.setTimeout(() => {
                status.classList.remove('is-visible');
                status.textContent = '';
            }, 7000);
        }

        // aviso flutuante, para quando o botão é acionado fora da seção
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            toastEl.setAttribute('role', 'status');
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        toastEl.classList.add('is-visible');
        window.clearTimeout(toastEl._t);
        toastEl._t = window.setTimeout(() => toastEl.classList.remove('is-visible'), 6000);
    }

    const mensagemArquivoAusente =
        'Arquivo ainda não encontrado. Envie o PDF oficial para ' + ARTISTA.pressKit +
        ' para ativar o download.';

    function baixarPressKit(ev) {
        ev.preventDefault();

        // Tenta baixar o PDF como arquivo. Se o arquivo existir, o download
        // acontece normalmente; se não existir, mostramos um aviso claro.
        fetch(ARTISTA.pressKit, { method: 'GET' })
            .then(res => {
                if (!res.ok) throw new Error('arquivo ausente');
                return res.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = PRESS_KIT_ARQUIVO;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 2000);
                avisar('Download iniciado — ' + PRESS_KIT_ARQUIVO);
            })
            .catch(() => {
                // Fallback: deixa o navegador tentar direto pelo caminho do arquivo.
                const a = document.createElement('a');
                a.href = ARTISTA.pressKit;
                a.download = PRESS_KIT_ARQUIVO;
                document.body.appendChild(a);
                a.click();
                a.remove();
                avisar(mensagemArquivoAusente);
            });
    }

    function visualizarPressKit(ev) {
        ev.preventDefault();
        fetch(ARTISTA.pressKit, { method: 'HEAD' })
            .then(res => { if (!res.ok) throw new Error('ausente'); })
            .then(() => window.open(ARTISTA.pressKit, '_blank', 'noopener'))
            .catch(() => avisar(mensagemArquivoAusente));
    }

    document.querySelectorAll('[data-presskit-download]').forEach(el => {
        el.setAttribute('href', ARTISTA.pressKit);
        el.setAttribute('download', PRESS_KIT_ARQUIVO);
        el.addEventListener('click', baixarPressKit);
    });

    document.querySelectorAll('[data-presskit-view]').forEach(el => {
        el.setAttribute('href', ARTISTA.pressKit);
        el.addEventListener('click', visualizarPressKit);
    });


    /* ------------------------------------------------------------------
       3. Menu hambúrguer (mobile)
       ------------------------------------------------------------------ */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    function fecharMenu() {
        document.body.classList.remove('menu-aberto');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Abrir menu');
    }

    burger.addEventListener('click', () => {
        const aberto = document.body.classList.toggle('menu-aberto');
        burger.setAttribute('aria-expanded', String(aberto));
        burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', fecharMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharMenu(); });


    /* ------------------------------------------------------------------
       4. Header sólido ao rolar + CTA fixo do press kit (mobile)
       ------------------------------------------------------------------ */
    const header = document.querySelector('.hdr');
    const stickyCta = document.getElementById('stickyCta');
    const hero = document.getElementById('inicio');

    function aoRolar() {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 40);

        if (stickyCta) {
            const pertoDoFim = (window.innerHeight + y) > (document.body.offsetHeight - 240);
            stickyCta.classList.toggle('is-visible', y > 420 && !pertoDoFim);
        }
    }
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });


    /* ------------------------------------------------------------------
       5. Entrada suave dos blocos + link ativo do menu
       ------------------------------------------------------------------ */
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !reduzir) {
        const obsRevelar = new IntersectionObserver((entradas) => {
            entradas.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    obsRevelar.unobserve(e.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

        document.querySelectorAll('.reveal').forEach(el => obsRevelar.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }

    const links = Array.from(document.querySelectorAll('.nav__link'));
    const secoes = links
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        const obsSecao = new IntersectionObserver((entradas) => {
            entradas.forEach(e => {
                if (!e.isIntersecting) return;
                links.forEach(l => l.classList.toggle(
                    'is-active',
                    l.getAttribute('href') === '#' + e.target.id
                ));
            });
        }, { threshold: 0.35 });
        secoes.forEach(s => obsSecao.observe(s));
    }


    /* ------------------------------------------------------------------
       6. Galeria — lightbox
       ------------------------------------------------------------------ */
    const shots = Array.from(document.querySelectorAll('.shot__btn'));
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCap = document.getElementById('lbCap');
    const lbIndex = document.getElementById('lbIndex');
    const lbTotal = document.getElementById('lbTotal');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    let atual = 0;
    let origem = null;

    lbTotal.textContent = shots.length;

    function abrir(i) {
        atual = (i + shots.length) % shots.length;
        const btn = shots[atual];
        lbImg.src = btn.dataset.full;
        lbImg.alt = btn.querySelector('img').alt;
        lbCap.textContent = btn.dataset.cap || '';
        lbIndex.textContent = atual + 1;
        lb.hidden = false;
        requestAnimationFrame(() => lb.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function fechar() {
        lb.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(() => { lb.hidden = true; lbImg.src = ''; }, 200);
        if (origem) origem.focus();
    }

    shots.forEach((btn, i) => {
        btn.addEventListener('click', () => { origem = btn; abrir(i); });
    });

    lbClose.addEventListener('click', fechar);
    lbPrev.addEventListener('click', () => abrir(atual - 1));
    lbNext.addEventListener('click', () => abrir(atual + 1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lightbox__stage')) fechar(); });

    document.addEventListener('keydown', e => {
        if (lb.hidden) return;
        if (e.key === 'Escape') fechar();
        if (e.key === 'ArrowRight') abrir(atual + 1);
        if (e.key === 'ArrowLeft') abrir(atual - 1);
    });

    // gesto de swipe no celular
    let toqueX = null;
    lb.addEventListener('touchstart', e => { toqueX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
        if (toqueX === null) return;
        const dx = e.changedTouches[0].clientX - toqueX;
        if (Math.abs(dx) > 50) abrir(atual + (dx < 0 ? 1 : -1));
        toqueX = null;
    }, { passive: true });

    // toque na imagem avança para a próxima
    lbImg.addEventListener('click', () => abrir(atual + 1));


    /* ------------------------------------------------------------------
       7. Escala tipográfica do nome no hero
          O nome é ajustado para preencher a largura útil sem ser cortado —
          funciona com qualquer nome artístico que for cadastrado.
       ------------------------------------------------------------------ */
    const nomeHero = document.querySelector('.hero__title .l1');

    function ajustarNome() {
        if (!nomeHero) return;
        const medida = nomeHero.parentElement.clientWidth;
        if (!medida) return;

        nomeHero.style.fontSize = '100px';
        const largura = nomeHero.scrollWidth;
        if (!largura) return;

        const teto = window.innerWidth < 860 ? window.innerWidth * 0.26 : 216;
        const tamanho = Math.min((medida / largura) * 100, teto);
        nomeHero.style.fontSize = Math.max(34, Math.floor(tamanho)) + 'px';
    }

    ajustarNome();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(ajustarNome);
    }
    window.addEventListener('load', ajustarNome);

    let redimensionando;
    window.addEventListener('resize', () => {
        window.clearTimeout(redimensionando);
        redimensionando = window.setTimeout(ajustarNome, 150);
    });
});
