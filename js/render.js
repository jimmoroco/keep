// render.js — proyección del estado en el DOM
//
// Recibe el estado completo y actualiza la UI.
// No consulta localStorage ni modifica el estado.

// ── Render principal ────────────────────────────────────────────

function render(state) {
    const divContainer = document.getElementById("div-container");
    divContainer.innerHTML = "";

    const visible = getVisibleSquares(state);
    visible.forEach(square => renderSquareCard(divContainer, square));
}

// ── Tarjeta de nota (modo lectura) ──────────────────────────────

function renderSquareCard(divContainer, square) {
    const pendingItems = square.items.filter(item => !item.checked);
    const doneItems    = square.items.filter(item => item.checked);

    const doneSection = doneItems.length > 0 ? `
        <hr class="no-edit" data-id="${square.id}">
        <div class="square-done no-edit" data-id="${square.id}">
            ${doneItems.map(item => renderCardItem(square.id, item.text, true)).join("")}
        </div>` : "";

    const html = `
        <div class="square cursor-hand no-edit"
             id="square-${square.id}"
             data-id="${square.id}"
             draggable="true">
            <div class="square-pending no-edit" data-id="${square.id}">
                <div class="no-edit title cursor-hand" data-id="${square.id}">
                    ${square.title}
                </div>
                ${pendingItems.map(item => renderCardItem(square.id, item.text, false)).join("")}
            </div>
            ${doneSection}
            <div class="trash no-edit"
                 onmouseenter="enterTrash(this)"
                 onmouseleave="leaveTrash(this)">
                <span style="visibility:hidden"
                      onclick="onDeleteSquareClick(event, this)">&#128465;</span>
            </div>
        </div>`;

    divContainer.insertAdjacentHTML("beforeend", html);
}

function renderCardItem(squareId, text, checked) {
    const lineThrough  = checked ? "line-through" : "";
    const disabledAttr = checked ? "disabled checked" : "";
    return `
        <div class="item no-edit" data-id="${squareId}">
            <span class="plus" data-id="${squareId}">
                <input type="checkbox"
                       class="checkbox-item cursor-hand appearance"
                       data-id="${squareId}"
                       ${disabledAttr}>
            </span>
            <div class="no-edit element cursor-hand ${lineThrough}" data-id="${squareId}">
                ${text}
            </div>
        </div>`;
}

// ── Panel de edición (modo escritura) ───────────────────────────
//
// Si se pasa un objeto `square`, precarga los datos para edición.
// Si no, renderiza un panel vacío para nota nueva.

function renderEditPanel(squareId, square = null) {
    const titleValue = square ? square.title : "";
    const existingItems = square
        ? square.items.map((item, i) => renderEditListItem(squareId, i, item)).join("")
        : "";
    const firstEmptyIndex = square ? square.items.length : 0;

    return `
        <div id="div-square-edit" class="square-edit edit">
            <div id="div-pending" class="square-pending edit">
                <div id="input-title-${squareId}"
                     class="title edit"
                     placeholder="Título"
                     contenteditable="true"
                     onkeypress="onTitleKeyPress(event, ${squareId}, 0);">${titleValue}</div>
                ${existingItems}
                ${renderNewListItem(squareId, firstEmptyIndex)}
            </div>
            <div id="div-done" class="square-done edit"></div>
        </div>`;
}

// Item precargado al editar una nota existente
function renderEditListItem(squareId, elementId, item) {
    const checkedAttr  = item.checked ? "checked" : "";
    const lineThroughClass = item.checked ? "line-through" : "";
    return `
        <div id="div-item-${squareId}-${elementId}"
             class="item edit"
             onmouseenter="onMouseEnterItem(this)"
             onmouseleave="onMouseLeaveItem(this)"
             draggable="true">
            <span class="ghost mover edit" style="visibility:hidden;"
                  onclick="moveItem(this)">&#8801;</span>
            <span class="plus edit">
                <input type="checkbox"
                       class="checkbox-item cursor-hand appearance edit"
                       onchange="checkedItem(this)"
                       ${checkedAttr}/>
            </span>
            <div id="input-element-${squareId}-${elementId}"
                 class="element done edit ${lineThroughClass}"
                 contenteditable="true"
                 placeholder="Elemento de lista"
                 data-has-next-element="1"
                 onkeypress="onItemKeyPress(event, ${squareId}, ${elementId + 1});"
                 onfocusin="onFocusInInput(this)"
                 onfocusout="onFocusOutInput(this)">${item.text}</div>
            <span class="ghost close cursor-hand hidden edit"
                  onclick="deleteItem(this)"
                  onmouseenter="onMouseEnterSpan(true)"
                  onmouseleave="onMouseEnterSpan(false)">x</span>
        </div>`;
}

function renderNewListItem(squareId, elementId) {
    return `
        <div id="div-item-${squareId}-${elementId}"
             class="item edit"
             onmouseenter="onMouseEnterItem(this)"
             onmouseleave="onMouseLeaveItem(this)"
             draggable="true">
            <span class="ghost mover edit" style="visibility:hidden;"
                  onclick="moveItem(this)">&#8801;</span>
            <span class="plus edit">+</span>
            <div id="input-element-${squareId}-${elementId}"
                 class="element edit"
                 contenteditable="true"
                 placeholder="Elemento de lista"
                 data-has-next-element="0"
                 onkeypress="onItemKeyPress(event, ${squareId}, ${elementId + 1});"
                 onfocusin="onFocusInInput(this)"
                 onfocusout="onFocusOutInput(this)">
            </div>
            <span class="ghost close cursor-hand hidden edit"
                  onclick="deleteItem(this)"
                  onmouseenter="onMouseEnterSpan(true)"
                  onmouseleave="onMouseEnterSpan(false)">x</span>
        </div>`;
}

function renderCheckbox() {
    return `<input type="checkbox"
                   class="checkbox-item cursor-hand appearance edit"
                   onchange="checkedItem(this)"/>`;
}
