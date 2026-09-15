// render.js — proyección del estado en el DOM
//
// Recibe el estado completo y actualiza la UI.
// No consulta localStorage ni modifica el estado.

// ── Render principal ────────────────────────────────────────────

function render(state) {
    const divContainer = document.getElementById("div-container");
    divContainer.innerHTML = "";

    const visible  = getVisibleSquares(state);
    const pinned   = visible.filter(s => s.pinned);
    const unpinned = visible.filter(s => !s.pinned);

    if (pinned.length > 0) {
        divContainer.insertAdjacentHTML("beforeend", renderSectionLabel("Fijadas"));
        pinned.forEach(square => renderSquareCard(divContainer, square));
    }

    if (unpinned.length > 0) {
        // Solo mostrar la etiqueta "Otras notas" si también hay fijadas
        if (pinned.length > 0) {
            divContainer.insertAdjacentHTML("beforeend", renderSectionLabel("Otras notas"));
        }
        unpinned.forEach(square => renderSquareCard(divContainer, square));
    }
}

function renderSectionLabel(text) {
    return `<div class="section-label" role="heading" aria-level="2">${text}</div>`;
}

// ── Tarjeta de nota (modo lectura) ──────────────────────────────

function renderSquareCard(divContainer, square) {
    const pendingItems = square.items.filter(item => !item.checked);
    const doneItems    = square.items.filter(item => item.checked);

    const doneSection = doneItems.length > 0 ? `
        <hr class="no-edit" data-id="${square.id}" aria-hidden="true">
        <div class="square-done no-edit" data-id="${square.id}" role="list" aria-label="Completados">
            ${doneItems.map(item => renderCardItem(square.id, item.text, true)).join("")}
        </div>` : "";

    const title        = square.title || "Sin título";
    const pinnedClass  = square.pinned ? "pinned" : "";
    const pinLabel     = square.pinned ? "Desfijar nota" : "Fijar nota";
    const pinIcon      = square.pinned ? "📌" : "📍";
    const colorStyle   = square.color ? `style="background-color:${square.color}"` : "";

    const html = `
        <article class="square cursor-hand no-edit ${pinnedClass}"
                 id="square-${square.id}"
                 data-id="${square.id}"
                 draggable="true"
                 role="button"
                 tabindex="0"
                 ${colorStyle}
                 aria-label="Nota: ${escapeAttr(title)}. Clic para editar.">
            <div class="card-actions no-edit" data-id="${square.id}">
                <button class="pin-btn no-edit"
                        aria-label="${pinLabel}"
                        aria-pressed="${square.pinned}"
                        onclick="onPinSquareClick(event, this)"
                        data-id="${square.id}">${pinIcon}</button>
            </div>
            <div class="square-pending no-edit" data-id="${square.id}">
                <div class="no-edit title cursor-hand"
                     data-id="${square.id}"
                     aria-hidden="true">
                    ${title}
                </div>
                ${pendingItems.length > 0
                    ? `<div role="list" aria-label="Pendientes" class="no-edit" data-id="${square.id}">
                           ${pendingItems.map(item => renderCardItem(square.id, item.text, false)).join("")}
                       </div>`
                    : ""}
            </div>
            ${doneSection}
            <div class="trash no-edit"
                 onmouseenter="enterTrash(this)"
                 onmouseleave="leaveTrash(this)">
                <button class="trash-btn"
                        style="visibility:hidden"
                        aria-label="Eliminar nota"
                        onclick="onDeleteSquareClick(event, this)">&#128465;</button>
            </div>
        </article>`;

    divContainer.insertAdjacentHTML("beforeend", html);
}

function renderCardItem(squareId, text, checked) {
    const lineThrough  = checked ? "line-through" : "";
    const disabledAttr = checked ? "disabled checked" : "";
    const ariaChecked  = checked ? "true" : "false";
    return `
        <div class="item no-edit" data-id="${squareId}" role="listitem">
            <span class="plus" data-id="${squareId}" aria-hidden="true">
                <input type="checkbox"
                       class="checkbox-item cursor-hand appearance"
                       data-id="${squareId}"
                       aria-checked="${ariaChecked}"
                       ${disabledAttr}>
            </span>
            <div class="no-edit element cursor-hand ${lineThrough}"
                 data-id="${squareId}"
                 aria-label="${escapeAttr(text)}${checked ? " (completado)" : ""}">
                ${text}
            </div>
        </div>`;
}

// ── Panel de edición (modo escritura) ───────────────────────────

function renderEditPanel(squareId, square = null) {
    const titleValue      = square ? square.title : "";
    const existingItems   = square
        ? square.items.map((item, i) => renderEditListItem(squareId, i, item)).join("")
        : "";
    const firstEmptyIndex = square ? square.items.length : 0;
    const currentColor    = square ? (square.color || null) : null;

    return `
        <div id="div-square-edit"
             class="square-edit edit"
             role="dialog"
             style="${currentColor ? `background-color:${currentColor}` : ""}"
             aria-label="${square ? "Editar nota" : "Nueva nota"}">
            <div id="div-pending" class="square-pending edit">
                <div id="input-title-${squareId}"
                     class="title edit"
                     placeholder="Título"
                     contenteditable="true"
                     role="textbox"
                     aria-label="Título de la nota"
                     aria-multiline="false">${titleValue}</div>
                ${existingItems}
                ${renderNewListItem(squareId, firstEmptyIndex)}
            </div>
            <div id="div-done" class="square-done edit" role="list" aria-label="Completados"></div>
            <div class="color-toolbar edit" role="toolbar" aria-label="Color de la nota">
                ${renderColorPicker(squareId, currentColor)}
            </div>
        </div>`;
}

function renderEditListItem(squareId, elementId, item) {
    const checkedAttr      = item.checked ? "checked" : "";
    const lineThroughClass = item.checked ? "line-through" : "";
    return `
        <div id="div-item-${squareId}-${elementId}"
             class="item edit"
             draggable="true"
             role="listitem">
            <span class="ghost mover edit"
                  style="visibility:hidden;"
                  aria-hidden="true">&#8801;</span>
            <span class="plus edit" aria-hidden="true">
                <input type="checkbox"
                       class="checkbox-item cursor-hand appearance edit"
                       aria-label="Marcar como ${item.checked ? "pendiente" : "completado"}"
                       ${checkedAttr}/>
            </span>
            <div id="input-element-${squareId}-${elementId}"
                 class="element done edit ${lineThroughClass}"
                 contenteditable="true"
                 role="textbox"
                 aria-label="Elemento de lista"
                 placeholder="Elemento de lista"
                 data-has-next-element="1">${item.text}</div>
            <button class="ghost close cursor-hand hidden edit"
                    aria-label="Eliminar este elemento">x</button>
        </div>`;
}

function renderNewListItem(squareId, elementId) {
    return `
        <div id="div-item-${squareId}-${elementId}"
             class="item edit"
             draggable="true"
             role="listitem">
            <span class="ghost mover edit"
                  style="visibility:hidden;"
                  aria-hidden="true">&#8801;</span>
            <span class="plus edit" aria-hidden="true">+</span>
            <div id="input-element-${squareId}-${elementId}"
                 class="element edit"
                 contenteditable="true"
                 role="textbox"
                 aria-label="Elemento de lista"
                 placeholder="Elemento de lista"
                 data-has-next-element="0">
            </div>
            <button class="ghost close cursor-hand hidden edit"
                    aria-label="Eliminar este elemento">x</button>
        </div>`;
}

function renderCheckbox() {
    return `<input type="checkbox"
                   class="checkbox-item cursor-hand appearance edit"
                   aria-label="Marcar como completado"/>`;
}

// ── Paleta de colores ───────────────────────────────────────────

function renderColorPicker(squareId, currentColor) {
    const swatches = Config.CARD_COLORS.map(c => {
        const isSelected = c.value === currentColor;
        const bg         = c.value || "transparent";
        const border     = c.value ? c.value : "rgba(255,255,255,0.35)";
        return `
            <button class="color-swatch edit ${isSelected ? "color-swatch--active" : ""}"
                    style="background-color:${bg}; border-color:${border};"
                    aria-label="${c.label}"
                    aria-pressed="${isSelected}"
                    data-color="${c.value || ""}"
                    data-square-id="${squareId}"
                    onclick="onColorSwatchClick(event, this)"
                    title="${c.label}">
                ${isSelected ? "✓" : ""}
            </button>`;
    }).join("");

    return `<div class="color-swatches edit">${swatches}</div>`;
}

// ── Utilidad ────────────────────────────────────────────────────
// Escapa comillas para uso seguro dentro de atributos HTML
function escapeAttr(str) {
    return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
