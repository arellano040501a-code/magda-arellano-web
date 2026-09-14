// ==========================================
// APP.JS · Motor de la página de Magda
// v1.1.1
// ==========================================

function esc(text) {
  return String(text ?? "")
    .replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
}


// ------------------------------------------
// TARJETAS DE PROYECTOS
// ------------------------------------------

function tarjetaProyecto(p) {
  const portada = p.portada
    ? `<img src="${esc(p.portada)}" alt="Portada de ${esc(p.titulo)}">`
    : `<div class="cover-placeholder">Portada próximamente</div>`;

  return `
    <article class="project-card">
      <a href="${esc(p.ficha)}" class="project-card-link">
        <div class="project-cover">
          ${portada}
        </div>
        <h3>${esc(p.titulo)}</h3>
      </a>
    </article>
  `;
}


// ------------------------------------------
// FILTRAR PROYECTOS SEGÚN LA PÁGINA
// ------------------------------------------

// FILTRAR Y CARRUSELES DE INICIO
function filtrarProyectos() {
  const path = location.pathname.toLowerCase();

  function ordenarPorFecha(lista) {
    return [...lista].sort((a, b) => {
      if (!a.agregada && !b.agregada) return 0;
      if (!a.agregada) return 1;
      if (!b.agregada) return -1;

      return new Date(b.agregada) - new Date(a.agregada);
    });
  }

  function prepararCarrusel(id, tipo) {
    const track = document.getElementById(id);
    if (!track) return;

    const proyectosTipo = ordenarPorFecha(
      proyectos.filter(p => p.tipo === tipo)
    ).slice(0, 8);

    track.innerHTML = proyectosTipo
      .map(tarjetaProyecto)
      .join("");

    const total = proyectosTipo.length;

    track.classList.toggle("is-carousel", total > 4);
    track.classList.toggle("is-centered", total <= 4);

    const contenedor = track.closest(".home-carousel");
    if (!contenedor) return;

    contenedor?.scrollTo({
  left: 0,
  behavior: "instant"
});

    const seccion = contenedor.closest(".home-projects");
    const pista = seccion.querySelector(".carousel-hint");

if (pista) {
  pista.style.display = total > 4 ? "block" : "none";
}

    const controlesAnteriores = seccion.querySelector(
      ".carousel-controls"
    );

    if (controlesAnteriores) {
      controlesAnteriores.remove();
    }

    if (total > 4) {
      const controles = document.createElement("div");
      controles.className = "carousel-controls";

      controles.innerHTML = `
        <button
          type="button"
          class="carousel-button carousel-prev"
          aria-label="Ver proyectos anteriores">
          ←
        </button>

        <button
          type="button"
          class="carousel-button carousel-next"
          aria-label="Ver proyectos siguientes">
          →
        </button>
      `;

      contenedor.after(controles);

      const anterior = controles.querySelector(".carousel-prev");
      const siguiente = controles.querySelector(".carousel-next");

      const tarjeta = track.querySelector(".project-card");

if (tarjeta) {
  const anchoTarjeta =
    tarjeta.getBoundingClientRect().width + 24;

  anterior.addEventListener("click", () => {
    contenedor.scrollBy({
      left: -anchoTarjeta,
      behavior: "smooth"
    });
  });

  siguiente.addEventListener("click", () => {
    contenedor.scrollBy({
      left: anchoTarjeta,
      behavior: "smooth"
    });
  });
}
    }
  }

  // INICIO
  prepararCarrusel("novelas-home", "Novela");
  prepararCarrusel("relatos-home", "Relato");

  // PÁGINAS NOVELAS / RELATOS
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  let lista = proyectos;

  if (path.includes("novelas")) {
    lista = proyectos.filter(p => p.tipo === "Novela");
  } else if (path.includes("relatos")) {
    lista = proyectos.filter(p => p.tipo === "Relato");
  }

  grid.innerHTML = lista.map(tarjetaProyecto).join("");

}


// ------------------------------------------
// FICHA INDIVIDUAL
// ------------------------------------------

function cargarFicha() {
  const ficha = document.getElementById("project-detail");

  if (!ficha) return;

  const id = new URLSearchParams(location.search).get("id");

  const proyecto = proyectos.find(p => p.id === id);

  // Si no existe el proyecto
  if (!proyecto) {
    document.title = "Proyecto no encontrado · Magda Arellano";

    ficha.innerHTML = `
      <section class="not-found">
        <h1>Proyecto no encontrado</h1>

        <p>
          Parece que esta historia no existe o que el enlace ya no está disponible.
        </p>

        <a class="button primary" href="index.html">
          Volver al inicio
        </a>
      </section>
    `;

    return;
  }

  document.title = `${proyecto.titulo} · Magda Arellano`;


  // ==========================================
  // ETIQUETAS
  // ==========================================

  const etiquetas = (proyecto.etiquetas || [])
    .map(tag => `
      <span class="tag">
        ${esc(tag)}
      </span>
    `)
    .join("");


  // ==========================================
  // CLASIFICACIÓN
  // ==========================================

  const clasificacion = proyecto.clasificacion
    ? esc(proyecto.clasificacion)
    : "";


  // ==========================================
  // PORTADA
  // ==========================================

  const portada = proyecto.portada
    ? `
      <img
        src="${esc(proyecto.portada)}"
        alt="Portada de ${esc(proyecto.titulo)}"
      >
    `
    : `
      <div class="cover-placeholder">
        Portada próximamente
      </div>
    `;

  // ==========================================
  // CAPÍTULOS PUBLICADOS
  // ==========================================

  const capitulosPublicados = Array.isArray(proyecto.capitulosPublicados)
    ? proyecto.capitulosPublicados
    : [];

  const cantidadPublicados = capitulosPublicados.length;

  // ==========================================
  // BOTÓN DE LECTURA
  // ==========================================

  let botonLectura = "";

const primerCapitulo =
  Array.isArray(proyecto.capitulosPublicados) &&
  proyecto.capitulosPublicados.length > 0
    ? proyecto.capitulosPublicados[0]
    : null;

if (primerCapitulo) {
  botonLectura = `
    <a
      class="button primary"
      href="${esc(primerCapitulo.url)}"
    >
      Comenzar a leer
    </a>
  `;
}


  // ==========================================
  // INFORMACIÓN
  // ==========================================

  const info = `
  <div class="info">

    <div class="info-card">
      <b>Tipo</b>
      <span>${esc(proyecto.tipo)}</span>
    </div>

    <div class="info-card">
      <b>Estado</b>
      <span>${esc(proyecto.estado)}</span>
    </div>

    <div class="info-card">
      <b>Género</b>
      <span>${esc(proyecto.genero)}</span>
    </div>

    <div class="info-card">
  <b>Capítulos</b>
  <span>${cantidadPublicados}</span>
</div>

  </div>
`;


  // ==========================================
// CAPÍTULOS
// ==========================================


let capitulosHTML = `
  <section class="chapters-section">

    <div class="section-head">

      <h2>Capítulos</h2>

      <span class="chapter-count">
        ${cantidadPublicados}
        publicado${cantidadPublicados === 1 ? "" : "s"}
      </span>

    </div>
`;

if (cantidadPublicados > 0) {

  const arcos = Array.isArray(proyecto.arcos)
  ? proyecto.arcos
  : [];

function nombreParte(numero) {
  const unidades = [
    "",
    "PRIMERA",
    "SEGUNDA",
    "TERCERA",
    "CUARTA",
    "QUINTA",
    "SEXTA",
    "SÉPTIMA",
    "OCTAVA",
    "NOVENA",
    "DÉCIMA"
  ];

  if (numero < unidades.length) {
    return `${unidades[numero]} PARTE`;
  }

  return `PARTE ${numero}`;
}

if (arcos.length > 0) {

  arcos.forEach((arco, indice) => {

    const capitulosDelArco = capitulosPublicados.filter(
      capitulo =>
        capitulo.numero >= arco.desde &&
        capitulo.numero <= arco.hasta
    );

    if (!capitulosDelArco.length) return;

    capitulosHTML += `
      <div class="chapter-arc">

        <h3 class="arc-title">
          ${nombreParte(indice + 1)} · «${esc(arco.nombre)}»
        </h3>

        <div class="chapter-list">

          ${capitulosDelArco
            .map(capitulo => `
              <a
                class="chapter-item"
                href="${esc(capitulo.url)}"
              >
                <div>

                  <small>
  ${esc(
    capitulo.etiqueta === "Capítulo"
      ? `Capítulo ${String(capitulo.numero).padStart(2, "0")}`
      : capitulo.etiqueta || String(capitulo.numero).padStart(2, "0")
  )}
</small>

                  <strong>
                    ${esc(capitulo.titulo)}
                  </strong>

                </div>

                <b>→</b>

              </a>
            `)
            .join("")}

        </div>

      </div>
    `;
  });

} else {

  capitulosHTML += `
    <div class="chapter-list">

      ${capitulosPublicados
        .map(capitulo => `
          <a
            class="chapter-item"
            href="${esc(capitulo.url)}"
          >
            <div>

              <small>
                Capítulo ${String(capitulo.numero).padStart(2, "0")}
              </small>

              <strong>
                ${esc(capitulo.titulo)}
              </strong>

            </div>

            <b>→</b>

          </a>
        `)
        .join("")}

    </div>
  `;

}

} else {

  capitulosHTML += `
    <p class="chapters-empty">
      Aún no hay capítulos publicados.
    </p>
  `;

}

capitulosHTML += `
  </section>
`;


  // ==========================================
  // FICHA COMPLETA
  // ==========================================

  ficha.innerHTML = `

    <section class="project-hero">

      <div class="project-cover">
        ${portada}
      </div>


      <div class="project-copy">

        <p class="eyebrow">
  ${esc(proyecto.tipo)}
  ${clasificacion ? ` · ${clasificacion}` : ""}
  ${proyecto.estado ? ` · ${esc(proyecto.estado)}` : ""}
</p>

        <h1>
          ${esc(proyecto.titulo)}
        </h1>

        ${
          proyecto.frase
            ? `
              <p class="lead">
                ${esc(proyecto.frase)}
              </p>
            `
            : ""
        }

        ${
          etiquetas
            ? `
              <div class="tags">
                ${etiquetas}
              </div>
            `
            : ""
        }

        ${
          botonLectura
            ? `
              <div class="buttons">
                ${botonLectura}
              </div>
            `
            : ""
        }

      </div>

    </section>


    <section id="info">

  <div class="section-head">

    <h2>Información</h2>

    ${
      proyecto.actualizada
        ? `
          <span class="updated">
            Actualizada · ${esc(proyecto.actualizada)}
          </span>
        `
        : ""
    }

  </div>

  ${info}

</section>


    ${
      proyecto.sinopsis
        ? `
          <section class="synopsis-section">

            <h2>Sinopsis</h2>

            <p class="synopsis">
              ${esc(proyecto.sinopsis)}
            </p>

          </section>
        `
        : ""
    }


    ${capitulosHTML}

  `;
}


// ------------------------------------------
// INICIO
// ------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  filtrarProyectos();
  cargarFicha();
});