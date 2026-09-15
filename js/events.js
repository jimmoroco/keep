// events.js — captura de eventos del usuario
//
// Solo llama dispatch(). No toca localStorage ni el DOM directamente.
// Excepción válida: el panel de edición es UI temporal que no forma
// parte del estado persistido hasta que el usuario confirma.

let editContainer;
let editingSquareId;
let isEditingExisting = false;
let isHoveringCloseBtn = false;

// ── Inicialización ──────────────────────────────────────────────

function initEvents() {
    editContainer = document.getElementById("div-container-edit");

    document.getElementById("icon-plus").addEventListener("click", function () {
        openEditPanel(null);
    });

    document.body.addEventListener("click", onDocumentClick);
    initSearch();
    initDragAndDrop();
}

// ── Clicks globales ─────────────────────────────────────────────

function onDocumentClick(e) {
    const clicked = e.target;

    // El botón + tiene su propio listener, no lo interceptamos acá
    if (clicked.id === "icon-plus") return;

    // Click en una tarjeta en modo lectura: abrir en edición
    if (clicked.classList.contains("no-edit") && clicked.hasAttribute("data-id")) {
        const squareId = +clicked.getAttribute("data-id");
        const square   = getSquareById(squareId);
        if (square) openEditPanel(square);
        return;
    }

    if (editContainer.classList.contains("hidden")) return;
    if (clicked.classList.contains("edit")) return;

    // Click fuera del panel: guardar si hay contenido, luego cerrar
    if (hasPanelContent()) {
        confirmSquare();
    }
    closeEditPanel();
}

// ── Panel de edición ────────────────────────────────────────────

// square = null → nota nueva | square = objeto → edición existente
function openEditPanel(square) {
    if (square) {
        editingSquareId   = square.id;
        isEditingExisting = true;
    } else {
        // ID temporal para los IDs del DOM del formulario
        editingSquareId   = 0;
        isEditingExisting = false;
    }

    editContainer.innerHTML = renderEditPanel(editingSquareId, square);
    editContainer.classList.remove("hidden");
    document.getElementById(`input-title-${editingSquareId}`).focus();
}

function closeEditPanel() {
    editContainer.classList.add("hidden");
    editContainer.innerHTML = "";
    isEditingExisting = false;
}

function hasPanelContent() {
    const elements = editContainer.getElementsByClassName("element");
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].innerText.trim() !== "") return true;
    }
    const title = editContainer.querySelector(".title");
    return title && title.innerText.trim() !== "";
}

// Lee el formulario y dispara ADD_SQUARE o EDIT_SQUARE
function confirmSquare() {
    const titleEl    = document.getElementById(`input-title-${editingSquareId}`);
    const checkBoxes = Array.from(editContainer.getElementsByClassName("checkbox-item"));

    // Capturamos todos los elementos de lista que tengan texto confirmado
    // (data-has-next-element="1" significa que el usuario presionó Enter en ese item)
    const itemEls = Array.from(editContainer.querySelectorAll(".element[data-has-next-element='1']"));

    const items = itemEls.map((el, i) => ({
        checked: checkBoxes[i] ? checkBoxes[i].checked : false,
        text:    el.innerText.trim()
    })).filter(item => item.text !== "");

    const data = {
        title: titleEl.innerText.trim(),
        items
    };

    if (isEditingExisting) {
        dispatch({ type: Actions.EDIT_SQUARE, id: editingSquareId, data });
    } else {
        dispatch({ type: Actions.ADD_SQUARE, data });
    }
}

// ── Tarjetas ────────────────────────────────────────────────────

function onDeleteSquareClick(e, span) {
    e.stopPropagation();
    const divSquare = span.parentNode.parentNode;
    const id = +divSquare.id.replace("square-", "");
    dispatch({ type: Actions.DELETE_SQUARE, id });
}

function enterTrash(div) {
    div.firstElementChild.style.visibility = "visible";
}

function leaveTrash(div) {
    div.firstElementChild.style.visibility = "hidden";
}

// ── Búsqueda en tiempo real ─────────────────────────────────────

function initSearch() {
    const input = document.getElementById("txtSearch");

    input.addEventListener("input", function () {
        dispatch({ type: Actions.SET_SEARCH, query: this.value });
        highlightSearchMatches(this.value.trim().toLowerCase());
    });

    // Escape limpia la búsqueda
    input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            this.value = "";
            dispatch({ type: Actions.SET_SEARCH, query: "" });
            highlightSearchMatches("");
        }
    });
}

function highlightSearchMatches(query) {
    const squares = document.querySelectorAll(".square");
    squares.forEach(sq => {
        if (!query) {
            sq.classList.remove("search-match");
            return;
        }
        const squareId = +sq.getAttribute("data-id");
        const square   = getSquareById(squareId);
        if (!square) return;

        const matches =
            square.title.toLowerCase().includes(query) ||
            square.items.some(item => item.text.toLowerCase().includes(query));

        sq.classList.toggle("search-match", matches);
    });
}

// ── Drag & drop de tarjetas ─────────────────────────────────────

let dragSourceId = null;

function initDragAndDrop() {
    const container = document.getElementById("div-container");

    // Delegamos en el container para cubrir tarjetas renderizadas dinámicamente
    container.addEventListener("dragstart", onCardDragStart);
    container.addEventListener("dragend",   onCardDragEnd);
    container.addEventListener("dragover",  onCardDragOver);
    container.addEventListener("dragleave", onCardDragLeave);
    container.addEventListener("drop",      onCardDrop);
}

function getCardFromTarget(target) {
    return target.closest(".square");
}

function onCardDragStart(e) {
    const card = getCardFromTarget(e.target);
    if (!card) return;

    dragSourceId = +card.getAttribute("data-id");
    card.classList.add("dragging");

    // Necesario para que Firefox inicie el drag
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dragSourceId);
}

function onCardDragEnd(e) {
    const card = getCardFromTarget(e.target);
    if (card) card.classList.remove("dragging");

    // Limpiar cualquier drag-over que haya quedado
    document.querySelectorAll(".square.drag-over")
        .forEach(el => el.classList.remove("drag-over"));

    dragSourceId = null;
}

function onCardDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const card = getCardFromTarget(e.target);
    if (!card || +card.getAttribute("data-id") === dragSourceId) return;

    // Resaltar solo la tarjeta sobre la que estamos
    document.querySelectorAll(".square.drag-over")
        .forEach(el => el.classList.remove("drag-over"));
    card.classList.add("drag-over");
}

function onCardDragLeave(e) {
    const card = getCardFromTarget(e.target);
    // relatedTarget evita flickering al moverse entre hijos
    if (card && !card.contains(e.relatedTarget)) {
        card.classList.remove("drag-over");
    }
}

function onCardDrop(e) {
    e.preventDefault();
    const card = getCardFromTarget(e.target);
    if (!card) return;

    card.classList.remove("drag-over");

    const targetId = +card.getAttribute("data-id");
    if (targetId === dragSourceId || dragSourceId === null) return;

    // Reordenar el array de squares moviendo el source antes del target
    const squares     = [...state.squares];
    const sourceIndex = squares.findIndex(s => s.id === dragSourceId);
    const targetIndex = squares.findIndex(s => s.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = squares.splice(sourceIndex, 1);
    squares.splice(targetIndex, 0, moved);

    dispatch({ type: Actions.REORDER_SQUARES, squares });
}

// ── Items de lista (panel de edición) ───────────────────────────
//
// checkedItem y deleteItem operan sobre el DOM del panel de edición,
// que es UI temporal. El estado real se persiste solo al confirmar.

function checkedItem(checkBox) {
    const divItem     = checkBox.parentNode.parentNode;
    const inputTarget = checkBox.parentNode.nextElementSibling;

    checkBox.classList.toggle("appearance");
    inputTarget.classList.toggle("line-through");
    inputTarget.readOnly = checkBox.checked;

    const divDone    = document.getElementById("div-done");
    const divPending = document.getElementById("div-pending");

    if (checkBox.checked) {
        divPending.removeChild(divItem);
        if (divDone.innerHTML.trim() === "") {
            divDone.insertAdjacentHTML("beforebegin", `<hr id="hr-n" class="edit">`);
        }
        divDone.appendChild(divItem);
    } else {
        restoreItemToPending(divPending, divItem);
        if (divDone.innerHTML.trim() === "") {
            document.getElementById("hr-n")?.remove();
        }
    }
}

function deleteItem(span) {
    span.parentNode.remove();
    isHoveringCloseBtn = false;
    const divDone = document.getElementById("div-done");
    if (divDone?.innerHTML.trim() === "") {
        document.getElementById("hr-n")?.remove();
    }
}

function moveItem(spanMover) {
    spanMover.parentNode.style.transform = "scale(1.09)";
}

// ── Hover en items ──────────────────────────────────────────────

function onMouseEnterItem(div) {
    const input = div.getElementsByClassName("element")[0];
    if (!itemHasText(input)) return;

    const [spanMover, spanClose] = div.querySelectorAll(".ghost");
    if (!spanClose) return;

    spanMover.style.visibility = "visible";
    spanClose.classList.remove("hidden");
}

function onMouseLeaveItem(div) {
    const [spanMover, spanClose] = div.querySelectorAll(".ghost");
    if (!spanClose) return;

    const input = div.getElementsByClassName("element")[0];
    if (input !== document.activeElement) {
        spanMover.style.visibility = "hidden";
        spanClose.classList.add("hidden");
    }
}

function onMouseEnterSpan(flag) {
    isHoveringCloseBtn = flag;
}

// ── Focus en inputs ─────────────────────────────────────────────

function onFocusInInput(input) {
    if (!itemHasText(input)) return;

    const [spanMover, spanClose] = input.parentNode.querySelectorAll(".ghost");
    if (!spanClose) return;

    spanMover.style.visibility = "visible";
    spanClose.classList.remove("hidden");
}

function onFocusOutInput(input) {
    if (isHoveringCloseBtn) return;

    const [spanMover, spanClose] = input.parentNode.querySelectorAll(".ghost");
    if (!spanClose) return;

    spanMover.style.visibility = "hidden";
    spanClose.classList.add("hidden");
}

// ── Teclado ─────────────────────────────────────────────────────

function onTitleKeyPress(event, squareId, elementId) {
    focusOnEnter(event, getListInput(squareId, elementId));
}

function onItemKeyPress(event, squareId, elementId) {
    const actualElement  = event.target;
    const hasNextElement = actualElement.getAttribute("data-has-next-element");
    const nextInput      = getListInput(squareId, elementId);

    if (hasNextElement === "0") {
        const parentDiv = actualElement.parentNode.parentNode;
        parentDiv.insertAdjacentHTML("beforeend", renderNewListItem(squareId, elementId));

        actualElement.previousElementSibling.innerHTML = renderCheckbox();
        actualElement.classList.toggle("done");
        actualElement.setAttribute("data-has-next-element", "1");

        const [spanMover, spanClose] = actualElement.parentNode.querySelectorAll(".ghost");
        if (spanClose) {
            spanMover.style.visibility = "visible";
            spanClose.classList.remove("hidden");
        }
    }

    focusOnEnter(event, nextInput);
}

function focusOnEnter(event, element) {
    if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        if (element) element.focus();
    }
}

// ── Helpers ─────────────────────────────────────────────────────

function getListInput(squareId, elementId) {
    return document.getElementById(`input-element-${squareId}-${elementId}`);
}

function extractIndexFromId(element) {
    const id = element.id;
    return +id.substring(id.lastIndexOf("-") + 1);
}

function itemHasText(input) {
    return input.getAttribute("data-has-next-element") === "1";
}

function restoreItemToPending(divPending, itemToRestore) {
    const items    = divPending.getElementsByClassName("item");
    const targetId = extractIndexFromId(itemToRestore);

    for (let i = 0; i < items.length; i++) {
        if (extractIndexFromId(items[i]) > targetId) {
            divPending.insertBefore(itemToRestore, items[i]);
            return;
        }
    }
    divPending.insertBefore(itemToRestore, null);
}
