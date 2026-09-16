/* ==========================================
   LECTOR · MAGDA ARELLANO
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const reader = document.querySelector(".reader");

  if (!reader) return;

  const proyectoId = reader.dataset.proyecto;
  const capituloActual = Number(reader.dataset.capitulo);

  const proyecto = Array.isArray(proyectos)
    ? proyectos.find(item => item.id === proyectoId)
    : null;


  /* ==========================================
     PANELES
     ========================================== */

  const indexPanel = document.querySelector(
    ".reader-panel.left"
  );

  const settingsPanel = document.querySelector(
    ".reader-panel.right"
  );


  /* ==========================================
     CREAR VELO
     ========================================== */

  const overlay = document.createElement("div");

  overlay.className = "reader-overlay";

  document.body.appendChild(overlay);


  /* ==========================================
     FUNCIONES DE APERTURA Y CIERRE
     ========================================== */

  function cerrarPaneles() {

    indexPanel?.classList.remove("open");

    settingsPanel?.classList.remove("open");

    overlay.classList.remove("open");

  }


  function abrirPanel(panel) {

    if (!panel) return;

    indexPanel?.classList.remove("open");

    settingsPanel?.classList.remove("open");

    panel.classList.add("open");

    overlay.classList.add("open");

  }


  /* ==========================================
     BOTÓN DEL ÍNDICE
     ========================================== */

  const indexButton = document.querySelector(
    "[data-reader-index]"
  );


  if (indexButton && indexPanel) {

    indexButton.addEventListener("click", () => {

      if (indexPanel.classList.contains("open")) {

        cerrarPaneles();

      } else {

        abrirPanel(indexPanel);

      }

    });

  }


  /* ==========================================
     BOTÓN DE CONFIGURACIÓN
     ========================================== */

  const settingsButton = document.querySelector(
    "[data-reader-settings]"
  );


  if (settingsButton && settingsPanel) {

    settingsButton.addEventListener("click", () => {

      if (settingsPanel.classList.contains("open")) {

        cerrarPaneles();

      } else {

        abrirPanel(settingsPanel);

      }

    });

  }


  /* ==========================================
     BOTONES DE CIERRE
     ========================================== */

  function agregarBotonCerrar(panel) {

    if (!panel) return;

    const boton = document.createElement("button");

    boton.type = "button";

    boton.className = "reader-panel-close";

    boton.setAttribute(
      "aria-label",
      "Cerrar"
    );

    boton.textContent = "×";

    panel.prepend(boton);

    boton.addEventListener("click", cerrarPaneles);

  }


  agregarBotonCerrar(indexPanel);

  agregarBotonCerrar(settingsPanel);


  /* ==========================================
     CERRAR AL HACER CLIC FUERA
     ========================================== */

  overlay.addEventListener(
    "click",
    cerrarPaneles
  );


  /* ==========================================
     ESC PARA CERRAR
     ========================================== */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      cerrarPaneles();

    }

  });


  /* ==========================================
     CERRAR AL SELECCIONAR UN CAPÍTULO
     ========================================== */

  document.querySelectorAll(
    ".reader-panel a"
  ).forEach(enlace => {

    enlace.addEventListener(
      "click",
      cerrarPaneles
    );

  });


  /* ==========================================
     MODO CLARO / OSCURO
     ========================================== */

  const botonClaro = document.querySelector(
    "[data-theme='light']"
  );

  const botonOscuro = document.querySelector(
    "[data-theme='dark']"
  );


  if (botonClaro) {

    botonClaro.addEventListener("click", () => {

      document.body.classList.remove(
        "reader-dark"
      );

    });

  }


  if (botonOscuro) {

    botonOscuro.addEventListener("click", () => {

      document.body.classList.add(
        "reader-dark"
      );

    });

  }


  /* ==========================================
     COMPROBAR PROYECTO
     ========================================== */

  if (!proyecto) {

    console.error(
      "No se encontró el proyecto:",
      proyectoId
    );

    return;

  }


    /* ==========================================
     ENLACE A LA FICHA DEL PROYECTO
     ========================================== */

  const enlaceProyecto = document.querySelector(
    "[data-reader-project]"
  );

  if (enlaceProyecto) {

    enlaceProyecto.textContent =
      proyecto.titulo;

    enlaceProyecto.href =
      `../../${proyecto.ficha}`;

  }


  /* ==========================================
     CAPÍTULOS PUBLICADOS
     ========================================== */

  const capitulos = Array.isArray(
    proyecto.capitulosPublicados
  )
    ? proyecto.capitulosPublicados
    : [];


  const capitulo = capitulos.find(
    item =>
      Number(item.numero) === capituloActual
  );


  /* ==========================================
     SI EL CAPÍTULO TODAVÍA NO ESTÁ PUBLICADO
     ========================================== */

  if (!capitulo) {

    console.warn(
      "Este capítulo todavía no está publicado:",
      capituloActual
    );

    return;

  }


  /* ==========================================
     TÍTULO DEL CAPÍTULO
     ========================================== */

  const numeroElemento = document.querySelector(
    ".chapter-number"
  );

  const tituloElemento = document.querySelector(
    ".chapter-title"
  );


  if (numeroElemento) {

  if (capitulo.etiqueta === "Capítulo") {

    numeroElemento.textContent =
      `Capítulo ${String(
        capitulo.numero
      ).padStart(2, "0")}`;

  } else if (capitulo.etiqueta) {

    numeroElemento.textContent =
      capitulo.etiqueta;

  } else {

    numeroElemento.textContent = "";

  }

}


  if (tituloElemento) {

    tituloElemento.textContent =
      capitulo.titulo;

  }


  /* ==========================================
     ÍNDICE DE CAPÍTULOS
     ========================================== */

  const indice = document.querySelector(
    ".reader-index-list"
  );


  if (indice) {

    indice.innerHTML = capitulos
      .map(item => {

        const activo =
          Number(item.numero) === capituloActual;

        if (activo) {

  return `
    <span
      class="current"
      aria-current="page"
    >
      ${String(item.numero).padStart(2, "0")}
      — ${item.titulo}
    </span>
  `;

}

return `
  <a href="../../${item.url}">
    ${String(item.numero).padStart(2, "0")}
    — ${item.titulo}
  </a>
`;

      })
      .join("");

  }


  /* ==========================================
     NAVEGACIÓN ANTERIOR / SIGUIENTE
     ========================================== */

  const anterior = capitulos.find(
    item =>
      Number(item.numero) ===
      capituloActual - 1
  );


  const siguiente = capitulos.find(
    item =>
      Number(item.numero) ===
      capituloActual + 1
  );


  const enlaceAnterior = document.querySelector(
    ".chapter-navigation .previous"
  );


  const enlaceSiguiente = document.querySelector(
    ".chapter-navigation .next"
  );


  if (enlaceAnterior) {

    if (anterior) {

      enlaceAnterior.href =
        `../../${anterior.url}`;

      enlaceAnterior.textContent =
        "← Anterior";

      enlaceAnterior.classList.remove(
        "nav-disabled"
      );

    } else {

      enlaceAnterior.removeAttribute(
        "href"
      );

      enlaceAnterior.textContent =
        "← Anterior";

      enlaceAnterior.classList.add(
        "nav-disabled"
      );

    }

  }


  if (enlaceSiguiente) {

    if (siguiente) {

      enlaceSiguiente.href =
        `../../${siguiente.url}`;

      enlaceSiguiente.textContent =
        "Siguiente →";

      enlaceSiguiente.classList.remove(
        "nav-disabled"
      );

    } else {

      enlaceSiguiente.removeAttribute(
        "href"
      );

      enlaceSiguiente.textContent =
        "Siguiente →";

      enlaceSiguiente.classList.add(
        "nav-disabled"
      );

    }

  }

});