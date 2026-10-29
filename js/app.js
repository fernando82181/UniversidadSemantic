(function () {
  "use strict";

  const dataUrl = "../data/cursos.json";
  const page = document.body.dataset.page;
  const main = document.querySelector("[data-app-content]");

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  const initials = (name) => name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  const formatDate = (date) => new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00`));

  const statusClass = (status) => status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  const totalStudents = (courses) => courses.reduce(
    (total, course) => total + course.students.length,
    0
  );

  const courseCard = (course) => `
    <article class="ui card course-card">
      <div class="content">
        <div class="course-card-top">
          <span class="course-badge ${escapeHtml(course.accent)}">${escapeHtml(course.category)}</span>
          <span class="course-code">${escapeHtml(course.code)}</span>
        </div>
        <h3>${escapeHtml(course.name)}</h3>
        <p>${escapeHtml(course.description)}</p>
        <div class="course-card-meta">
          <span><strong>${course.students.length}</strong> estudiantes</span>
          <span><strong>${course.evaluations.length}</strong> evaluaciones</span>
        </div>
      </div>
      <div class="extra content">
        <a class="card-link" href="${escapeHtml(course.slug)}">Ver asignatura <span aria-hidden="true">→</span></a>
      </div>
    </article>`;

  const evaluationList = (evaluations) => evaluations.map((evaluation) => `
    <article class="evaluation-item">
      <div class="evaluation-heading">
        <strong>${escapeHtml(evaluation.title)}</strong>
        <span class="evaluation-weight">${evaluation.weight}%</span>
      </div>
      <p>${escapeHtml(evaluation.description)}</p>
      <div class="evaluation-meta">
        <time datetime="${escapeHtml(evaluation.date)}">${formatDate(evaluation.date)}</time>
        <span class="status-pill ${statusClass(evaluation.status)}">${escapeHtml(evaluation.status)}</span>
      </div>
    </article>`).join("");

  const studentList = (students) => students.map((student) => `
    <div class="student-row" data-student-name="${escapeHtml(student.name.toLowerCase())}">
      <span class="student-avatar" aria-hidden="true">${escapeHtml(initials(student.name))}</span>
      <div class="student-info">
        <strong>${escapeHtml(student.name)}</strong>
        <span>Código ${escapeHtml(student.code)}</span>
      </div>
    </div>`).join("");

  const renderDashboard = (data) => {
    const assessments = data.courses.reduce((total, course) => total + course.evaluations.length, 0);
    main.innerHTML = `
      <section class="hero-panel ui segment">
        <div class="hero-copy">
          <div class="eyebrow">Panel académico · ${escapeHtml(data.period)}</div>
          <h1>Enseñar también es<br>construir el futuro.</h1>
          <p>Un espacio para organizar tus asignaturas, acompañar a tus estudiantes y tener a la mano cada evaluación del semestre.</p>
          <a class="ui button hero-action" href="asignaturas.html">Explorar asignaturas <span aria-hidden="true">→</span></a>
        </div>
        <div class="hero-aside">
          <span>Periodo académico</span>
          <strong>${escapeHtml(data.period)}</strong>
          <span>${escapeHtml(data.institution)}</span>
        </div>
      </section>
      <section class="stat-grid" aria-label="Resumen académico">
        <article class="ui segment stat-card"><div><div class="stat-top">Asignaturas activas <span class="stat-icon" aria-hidden="true">▦</span></div><div class="stat-value">${data.courses.length}</div><div class="stat-footnote">En el periodo actual</div></div></article>
        <article class="ui segment stat-card"><div><div class="stat-top">Estudiantes inscritos <span class="stat-icon" aria-hidden="true">◎</span></div><div class="stat-value">${totalStudents(data.courses)}</div><div class="stat-footnote">Distribuidos por asignatura</div></div></article>
        <article class="ui segment stat-card"><div><div class="stat-top">Evaluaciones planeadas <span class="stat-icon" aria-hidden="true">✓</span></div><div class="stat-value">${assessments}</div><div class="stat-footnote">Con fechas y porcentajes</div></div></article>
      </section>
      <div class="section-header"><h2>Tus asignaturas</h2><a href="asignaturas.html">Ver todas <span aria-hidden="true">→</span></a></div>
      <section class="course-grid" aria-label="Asignaturas">${data.courses.map(courseCard).join("")}</section>
      <footer class="site-footer">Contenido demostrativo para apoyar la enseñanza de HTML, CSS y JavaScript. Listados y códigos de estudiantes ficticios.</footer>`;
  };

  const renderCourses = (data) => {
    main.innerHTML = `
      <header class="page-heading">
        <div><div class="eyebrow">Oferta académica · ${escapeHtml(data.period)}</div><h1>Mis asignaturas</h1><p>Consulta la información general, los grupos y las evaluaciones de cada materia.</p></div>
      </header>
      <section class="course-grid" aria-label="Listado de asignaturas">${data.courses.map(courseCard).join("")}</section>
      <footer class="site-footer">Las asignaturas y sus contenidos se pueden editar desde <code>data/cursos.json</code>.</footer>`;
  };

  const renderCourse = (data, course) => {
    const weightTotal = course.evaluations.reduce((total, evaluation) => total + evaluation.weight, 0);
    main.innerHTML = `
      <header class="page-heading">
        <div><div class="eyebrow"><a href="asignaturas.html">Asignaturas</a> / ${escapeHtml(course.category)}</div></div>
      </header>
      <section class="detail-banner ui segment">
        <div>
          <span class="course-badge ${escapeHtml(course.accent)}">${escapeHtml(course.category)}</span>
          <h1>${escapeHtml(course.name)}</h1>
          <p>${escapeHtml(course.description)}</p>
          <div class="info-grid">
            <div class="info-item"><span>Horario</span><strong>${escapeHtml(course.schedule)}</strong></div>
            <div class="info-item"><span>Ubicación</span><strong>${escapeHtml(course.location)}</strong></div>
            <div class="info-item"><span>Modalidad</span><strong>${escapeHtml(course.modality)}</strong></div>
          </div>
        </div>
        <span class="detail-code">${escapeHtml(course.code)}</span>
      </section>
      <div class="two-column">
        <div>
          <section class="ui segment content-panel">
            <h2>Propósito de la asignatura</h2>
            <p class="panel-description">${escapeHtml(course.objective)}</p>
            <h3>Contenidos temáticos</h3>
            <ul class="topic-list">${course.topics.map((topic) => `<li><span class="topic-check" aria-hidden="true">✓</span>${escapeHtml(topic)}</li>`).join("")}</ul>
          </section>
          <section class="ui segment content-panel content-panel-spaced">
            <h2>Evaluaciones del curso</h2>
            <p class="panel-description">Actividades previstas y su porcentaje de la nota final.</p>
            <div class="evaluation-list">${evaluationList(course.evaluations)}</div>
            <div class="total-weight"><span>Porcentaje total</span><strong>${weightTotal}%</strong></div>
          </section>
        </div>
        <section class="ui segment content-panel">
          <h2>Listado de estudiantes</h2>
          <div class="student-toolbar">
            <span class="student-count"><strong data-visible-count>${course.students.length}</strong> de ${course.students.length} estudiantes</span>
            <label class="ui input student-search"><input type="search" data-student-search placeholder="Buscar estudiante..." aria-label="Buscar estudiante por nombre"></label>
          </div>
          <div class="student-list" data-student-list>${studentList(course.students)}</div>
          <p class="empty-state" data-empty-state hidden>No hay estudiantes que coincidan con la búsqueda.</p>
        </section>
      </div>
      <footer class="site-footer">Datos ficticios de ejemplo · ${escapeHtml(data.institution)} · Periodo ${escapeHtml(data.period)}</footer>`;

    const search = main.querySelector("[data-student-search]");
    const rows = [...main.querySelectorAll("[data-student-name]")];
    const count = main.querySelector("[data-visible-count]");
    const emptyState = main.querySelector("[data-empty-state]");
    search.addEventListener("input", () => {
      const query = search.value.trim().toLocaleLowerCase("es");
      let visible = 0;
      rows.forEach((row) => {
        const matches = row.dataset.studentName.includes(query);
        row.hidden = !matches;
        visible += matches ? 1 : 0;
      });
      count.textContent = String(visible);
      emptyState.hidden = visible !== 0;
    });
  };

  const markActiveNavigation = () => {
    const currentPage = page === "dashboard" ? "index.html" : `${page}.html`;
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const active = link.getAttribute("href") === currentPage;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
    });
  };

  const initializeMenu = () => {
    const button = document.querySelector("[data-menu-toggle]");
    const sidebar = document.querySelector("[data-sidebar]");
    button.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", (event) => {
      if (window.innerWidth <= 820 && sidebar.classList.contains("is-open")
        && !sidebar.contains(event.target) && !button.contains(event.target)) {
        sidebar.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  };

  const load = async () => {
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) throw new Error(`No se pudo cargar el archivo de cursos (${response.status}).`);
      const data = await response.json();
      markActiveNavigation();
      initializeMenu();
      if (page === "dashboard") {
        renderDashboard(data);
      } else if (page === "asignaturas") {
        renderCourses(data);
      } else {
        const course = data.courses.find((item) => item.id === page);
        if (!course) throw new Error(`No existe la asignatura "${page}" en data/cursos.json.`);
        renderCourse(data, course);
      }
    } catch (error) {
      console.error("Error al cargar la información académica:", error);
      main.innerHTML = `<div class="load-error" role="alert">No fue posible cargar el contenido académico. Verifica que el proyecto se esté ejecutando desde un servidor local y que <code>data/cursos.json</code> esté disponible.</div>`;
    }
  };

  load();
})();
