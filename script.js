/* ================================================================
   PORTAFOLIO — Erwin J. Meléndez
   script.js  |  Toda la lógica interactiva del sitio
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────────
     1. TEXTO ANIMADO EN EL HÉROE
        Edita el array "roles" para cambiar los textos que rotan.
     ────────────────────────────────────────────────────────────── */
  const elementoAnimado = document.getElementById('texto-animado');
  const roles = [
    'Coordinador de Operaciones',
    'Analista de Datos',
    'Desarrollador FrontEnd',
    'Profesor de Matemáticas',
  ];

  let indiceRol     = 0;
  let indiceLetra   = 0;
  let borrando      = false;
  let esperando     = false;

  function escribir() {
    if (esperando) return;

    const rolActual = roles[indiceRol];

    if (!borrando) {
      /* Escribe letra a letra */
      elementoAnimado.textContent = rolActual.slice(0, ++indiceLetra);
      if (indiceLetra === rolActual.length) {
        /* Pausa antes de borrar */
        esperando = true;
        setTimeout(() => { borrando = true; esperando = false; }, 2000);
      }
    } else {
      /* Borra letra a letra */
      elementoAnimado.textContent = rolActual.slice(0, --indiceLetra);
      if (indiceLetra === 0) {
        borrando = false;
        indiceRol = (indiceRol + 1) % roles.length;
      }
    }

    setTimeout(escribir, borrando ? 45 : 75);
  }

  if (elementoAnimado) escribir();


  /* ──────────────────────────────────────────────────────────────
     2. NAVEGACIÓN — MENÚ HAMBURGUESA
     ────────────────────────────────────────────────────────────── */
  const hamburguesa = document.getElementById('hamburguesa');
  const navLista    = document.getElementById('nav-lista');

  if (hamburguesa && navLista) {
    hamburguesa.addEventListener('click', () => {
      hamburguesa.classList.toggle('activo');
      navLista.classList.toggle('abierto');
    });

    /* Cierra el menú al seleccionar un enlace */
    navLista.querySelectorAll('a').forEach(enlace => {
      enlace.addEventListener('click', () => {
        hamburguesa.classList.remove('activo');
        navLista.classList.remove('abierto');
      });
    });
  }


  /* ──────────────────────────────────────────────────────────────
     3. SOMBRA EN LA NAVBAR AL HACER SCROLL
     ────────────────────────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('con-sombra', window.scrollY > 24);
    }, { passive: true });
  }


  /* ──────────────────────────────────────────────────────────────
     4. ANIMACIONES DE ENTRADA AL HACER SCROLL (Intersection Observer)
        Todo elemento con clase .reveal aparece al entrar al viewport.
     ────────────────────────────────────────────────────────────── */
  const elementosReveal = document.querySelectorAll('.reveal');

  const observadorReveal = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada, i) => {
      if (entrada.isIntersecting) {
        /* Retraso escalonado para grupos de elementos */
        setTimeout(() => {
          entrada.target.classList.add('visible');
        }, entrada.target.dataset.delay || 0);
        observadorReveal.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementosReveal.forEach(el => observadorReveal.observe(el));


  /* ──────────────────────────────────────────────────────────────
     5. BARRAS DE HABILIDADES
        Se animan cuando la sección entra al viewport.
        El valor data-nivel (0–100) define el ancho de la barra.
     ────────────────────────────────────────────────────────────── */
  const barras = document.querySelectorAll('.barra-fill');

  const observadorBarras = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const nivel = entrada.target.dataset.nivel || 0;
        entrada.target.style.width = nivel + '%';
        observadorBarras.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.4 });

  barras.forEach(b => observadorBarras.observe(b));


  /* ──────────────────────────────────────────────────────────────
     6. FORMULARIO DE CONTACTO
        Conecta aquí tu servicio preferido (Formspree, EmailJS…).
        Por defecto muestra un mensaje de confirmación.
     ────────────────────────────────────────────────────────────── */
  const btnEnviar = document.getElementById('btn-enviar');
  const aviso     = document.getElementById('form-aviso');

  if (btnEnviar) {
    btnEnviar.addEventListener('click', () => {
      const nombre  = document.getElementById('f-nombre')?.value.trim();
      const correo  = document.getElementById('f-correo')?.value.trim();
      const mensaje = document.getElementById('f-mensaje')?.value.trim();

      /* Validación básica */
      if (!nombre || !correo || !mensaje) {
        alert('Por favor completa los campos obligatorios.');
        return;
      }

      /* ── Para conectar Formspree, reemplaza el bloque de abajo: ──
         fetch('https://formspree.io/f/TU_ID', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ nombre, correo, mensaje })
         });
      */

      /* Muestra confirmación */
      if (aviso) aviso.classList.add('visible');
      btnEnviar.textContent = '¡Mensaje enviado! ✓';
      btnEnviar.disabled = true;
    });
  }


  /* ──────────────────────────────────────────────────────────────
     7. ENLACE ACTIVO EN LA NAVEGACIÓN (basado en scroll)
     ────────────────────────────────────────────────────────────── */
  const secciones = document.querySelectorAll('section[id]');
  const enlaces   = document.querySelectorAll('.nav-lista a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    secciones.forEach(seccion => {
      const top    = seccion.offsetTop;
      const alto   = seccion.offsetHeight;
      const id     = seccion.getAttribute('id');
      const enlace = document.querySelector(`.nav-lista a[href="#${id}"]`);

      if (enlace) {
        if (scrollY >= top && scrollY < top + alto) {
          enlaces.forEach(e => e.style.color = '');
          enlace.style.color = 'var(--acento)';
        }
      }
    });
  }, { passive: true });

});
