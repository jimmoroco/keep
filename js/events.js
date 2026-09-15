// events.js — captura de eventos del usuario
//
// Solo llama dispatch(). No toca localStorage ni el DOM directamente.
// Excepción válida: el panel de edición es UI temporal que no forma
// parte del estado persistido hasta que el usuario confirma.

let editContainer;
let editingSquareId;
let isEditingExisting = false;
let isHoveringCloseBtn = false;
let editingColor = null;    // color seleccionado en el panel antes de confirmar

// ── Inicialización ──────────────────────────────────────────────

function initEvents() {
    editContainer = document.getElementById("div-container-edit");

    document.getElementById("icon-plus").addEventListener("click", () => openEditPanel(null));
    document.body.addEventListener("click", onDocumentClick);
    document.body.addEventListener("keydown", onGlobalKeyDown);

    initEditPanelDelegation();
    initSearch();
    initDragAndDrop();
}

// ── Teclado global ──────────────────────────────────────────────

function onGlobalKeyDown(e) {
    if (e.key === "Escape" && !editContainer.classList.contains("hidden")) {
        if (hasPanelContent()) confirmSquare();
        closeEditPanel();
    }
}

// ── Clicks globales ─────────────────────────────────────────────

function onDocumentClick(e) {
    const clicked = e.target;

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
    if (hasPanelContent()) confirmSquare();
    closeEditPanel();
}

// ── Panel de edición ────────────────────────────────────────────

function openEditPanel(square) {
    if (square) {
        editingSquareId   = square.id;
        isEditingExisting = true;
        editingColor      = square.color || null;
    } else {
        editingSquareId   = 0;
        isEditingExisting = false;
        editingColor      = null;
    }

    editContainer.innerHTML = renderEditPanel(editingSquareId, square);
    editContainer.classList.remove("hidden");
    document.getElementById(`input-title-${editingSquareId}`).focus();
}

function closeEditPanel() {
    editContainer.classList.add("hidden");
    editContainer.innerHTML = "";
    isEditingExisting = false;
    editingColor      = null;
}

function hasPanelContent() {
    const title = editContainer.querySelector(".title");
    if (title && title.innerText.trim() !== "") return true;
    const elements = editContainer.querySelectorAll(".element[data-has-next-element='1']");
    return elements.length > 0;
}

function confirmSquare() {
    const titleEl    = document.getElementById(`input-title-${editingSquareId}`);
    const checkBoxes = Array.from(editContainer.getElementsByClassName("checkbox-item"));
    const itemEls    = Array.from(editContainer.querySelectorAll(".element[data-has-next-element='1']"));

    const items = itemEls.map((el, i) => ({
        checked: checkBoxes[i] ? checkBoxes[i].checked : false,
        text:    el.innerText.trim()
    })).filter(item => item.text !== "");

    const data = { title: titleEl.innerText.trim(), items, color: editingColor };

    if (isEditingExisting) {
        dispatch({ type: Actions.EDIT_SQUARE, id: editingSquareId, data });
    } else {
        dispatch({ type: Actions.ADD_SQUARE, data });
    }
}

// ── Delegación de eventos del panel de edición ──────────────────
//
// En lugar de onkeypress/onfocusin/onfocusout inline en cada elemento,
// un único listener en el container detecta el target y actúa.

function initEditPanelDelegation() {

    editContainer.addEventListener("keypress", function (e) {
        const target = e.target;

        if (target.classList.contains("title")) {
            const squareId   = +target.id.replace("input-title-", "");
            const firstInput = getListInput(squareId, 0);
            focusOnEnter(e, firstInput);
            return;
        }

        if (target.classList.contains("element") && target.isContentEditable) {
            const match = target.id.match(/input-element-(\d+)-(\d+)/);
            if (!match) return;
            const squareId  = +match[1];
            const elementId = +match[2];
            handleItemKeyPress(e, target, squareId, elementId);
        }
    });

    editContainer.addEventListener("focusin", function (e) {
        const target = e.target;
        if (!target.classList.contains("element")) return;
        if (!itemHasText(target)) return;

        const [spanMover, spanClose] = target.parentNode.querySelectorAll(".ghost");
        if (!spanClose) return;
        spanMover.style.visibility = "visible";
        spanClose.style.visibility = "visible";
    });

    editContainer.addEventListener("focusout", function (e) {
        const target = e.target;
        if (!target.classList.contains("element")) return;
        if (isHoveringCloseBtn) return;

        const [spanMover, spanClose] = target.parentNode.querySelectorAll(".ghost");
        if (!spanClose) return;
        spanMover.style.visibility = "hidden";
        spanClose.style.visibility = "hidden";
    });

    editContainer.addEventListener("mouseenter", function (e) {
        const item = e.target.closest(".item.edit");
        if (!item) return;
        const input = item.getElementsByClassName("element")[0];
        if (!itemHasText(input)) return;

        const [spanMover, spanClose] = item.querySelectorAll(".ghost");
        if (!spanClose) return;
        spanMover.style.visibility = "visible";
        spanClose.style.visibility = "visible";
    }, true);

    editContainer.addEventListener("mouseleave", function (e) {
        const item = e.target.closest(".item.edit");
        if (!item) return;
        const [spanMover, spanClose] = item.querySelectorAll(".ghost");
        if (!spanClose) return;
        const input = item.getElementsByClassName("element")[0];
        if (input !== document.activeElement) {
            spanMover.style.visibility = "hidden";
            spanClose.style.visibility = "hidden";
        }
    }, true);

    editContainer.addEventListener("change", function (e) {
        if (e.target.classList.contains("checkbox-item")) {
            checkedItem(e.target);
        }
    });

    editContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("close")) {
            deleteItem(e.target);
        }
        if (e.target.classList.contains("mover")) {
            moveItem(e.target);
        }
    });
}

// ── Tarjetas ────────────────────────────────────────────────────

function onPinSquareClick(e, btn) {
    e.stopPropagation();
    const id = +btn.getAttribute("data-id");
    const square = getSquareById(id);
    dispatch({ type: Actions.TOGGLE_PIN, id });
    showToast(square?.pinned ? "Nota desfijada" : "Nota fijada", "info");
}

function onColorSwatchClick(e, btn) {
    e.stopPropagation();
    const squareId = +btn.getAttribute("data-square-id");
    const color    = btn.getAttribute("data-color") || null;

    // Guardar en estado (con o sin nota existente)
    editingColor = color;

    if (isEditingExisting) {
        // Persistir sin re-renderizar para no destruir el panel abierto
        dispatch({ type: Actions.SET_COLOR, id: squareId, color, skipRender: true });
    }

    // Actualizar el fondo del panel en tiempo real
    const panel = document.getElementById("div-square-edit");
    if (panel) panel.style.backgroundColor = color || "";

    // Actualizar estado visual de los swatches
    document.querySelectorAll(".color-swatch").forEach(s => {
        const active = s.getAttribute("data-color") === (color || "");
        s.classList.toggle("color-swatch--active", active);
        s.setAttribute("aria-pressed", String(active));
        s.textContent = active ? "✓" : "";
    });
}

function onDeleteSquareClick(e, span) {    e.stopPropagation();
    const divSquare = span.parentNode.parentNode;
    const id        = +divSquare.id.replace("square-", "");

    dispatch({ type: Actions.DELETE_SQUARE, id });

    showToast("Nota eliminada", "info", {
        label:   "Deshacer",
        handler: () => {
            dispatch({ type: Actions.UNDO_DELETE });
        }
    });
}

function enterTrash(div) {
    div.firstElementChild.style.visibility = "visible";
}

function leaveTrash(div) {
    div.firstElementChild.style.visibility = "hidden";
}

// ── Toast ───────────────────────────────────────────────────────

function showToast(message, type = "info", action = null) {
    const container = document.getElementById("toast-container");
    const toast     = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    const text = document.createElement("span");
    text.textContent = message;
    toast.appendChild(text);

    if (action) {
        const btn = document.createElement("button");
        btn.className   = "toast__action";
        btn.textContent = action.label;
        btn.addEventListener("click", () => {
            action.handler();
            removeToast(toast);
        });
        toast.appendChild(btn);
    }

    container.appendChild(toast);

    const timer = setTimeout(() => removeToast(toast), Config.TOAST_DURATION_MS);

    // Cancelar el auto-dismiss si el usuario interactúa con el toast
    toast.addEventListener("mouseenter", () => clearTimeout(timer));
    toast.addEventListener("mouseleave", () =>
        setTimeout(() => removeToast(toast), 1500)
    );
}

function removeToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.add("removing");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
}

// ── Búsqueda en tiempo real ─────────────────────────────────────

function initSearch() {
    const input = document.getElementById("txtSearch");

    input.addEventListener("input", function () {
        dispatch({ type: Actions.SET_SEARCH, query: this.value });
        highlightSearchMatches(this.value.trim().toLowerCase());
    });

    input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            this.value = "";
            dispatch({ type: Actions.SET_SEARCH, query: "" });
            highlightSearchMatches("");
        }
    });
}

function highlightSearchMatches(query) {
    document.querySelectorAll(".square").forEach(sq => {
        if (!query) { sq.classList.remove("search-match"); return; }
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
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dragSourceId);
}

function onCardDragEnd(e) {
    const card = getCardFromTarget(e.target);
    if (card) card.classList.remove("dragging");
    document.querySelectorAll(".square.drag-over")
        .forEach(el => el.classList.remove("drag-over"));
    dragSourceId = null;
}

function onCardDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const card = getCardFromTarget(e.target);
    if (!card || +card.getAttribute("data-id") === dragSourceId) return;
    document.querySelectorAll(".square.drag-over")
        .forEach(el => el.classList.remove("drag-over"));
    card.classList.add("drag-over");
}

function onCardDragLeave(e) {
    const card = getCardFromTarget(e.target);
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

    const squares     = [...state.squares];
    const sourceIndex = squares.findIndex(s => s.id === dragSourceId);
    const targetIndex = squares.findIndex(s => s.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const [moved] = squares.splice(sourceIndex, 1);
    squares.splice(targetIndex, 0, moved);
    dispatch({ type: Actions.REORDER_SQUARES, squares });
}

// ── Items de lista (panel de edición) ───────────────────────────

function handleItemKeyPress(event, actualElement, squareId, elementId) {
    const hasNextElement = actualElement.getAttribute("data-has-next-element");
    const nextInput      = getListInput(squareId, elementId + 1);

    if (hasNextElement === "0") {
        const parentDiv = actualElement.parentNode.parentNode;
        parentDiv.insertAdjacentHTML("beforeend", renderNewListItem(squareId, elementId + 1));

        actualElement.previousElementSibling.innerHTML = renderCheckbox();
        actualElement.classList.add("done");
        actualElement.setAttribute("data-has-next-element", "1");

        const [spanMover, spanClose] = actualElement.parentNode.querySelectorAll(".ghost");
        if (spanClose) {
            spanMover.style.visibility = "visible";
            spanClose.style.visibility = "visible";
        }
    }

    focusOnEnter(event, getListInput(squareId, elementId + 1) || nextInput);
}

function checkedItem(checkBox) {
    const divItem     = checkBox.parentNode.parentNode;
    const inputTarget = checkBox.parentNode.nextElementSibling;

    checkBox.classList.toggle("appearance");
    inputTarget.classList.toggle("line-through");

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

// ── Helpers ─────────────────────────────────────────────────────

function focusOnEnter(event, element) {
    if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        if (element) element.focus();
    }
}

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

function onMouseEnterSpan(flag) {
    isHoveringCloseBtn = flag;
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
