// events.js — captura de eventos del usuario
//
// Solo llama dispatch(). No toca localStorage ni el DOM directamente.
// Excepción válida: el panel de edición es UI temporal que no forma
// parte del estado persistido hasta que el usuario confirma.

let editContainer;
let editingSquareId;
let isHoveringCloseBtn = false;

// ── Inicialización ──────────────────────────────────────────────

function initEvents() {
    editContainer = document.getElementById("div-container-edit");

    document.getElementById("icon-plus").addEventListener("click", function () {
        openEditPanel(0);
    });

    document.body.addEventListener("click", onDocumentClick);
}

// ── Clicks globales ─────────────────────────────────────────────

function onDocumentClick(e) {
    const clicked = e.target;

    if (clicked.classList.contains("no-edit")) {
        if (clicked.hasAttribute("data-id")) {
            const squareId = +clicked.getAttribute("data-id");
            openEditPanel(squareId);
        }
        return;
    }

    if (editContainer.classList.contains("hidden")) return;
    if (clicked.classList.contains("edit")) return;

    // Click fuera del panel: confirmar si hay contenido
    const inputElements = editContainer.getElementsByClassName("element");
    for (let i = 0; i < inputElements.length; i++) {
        if (inputElements[i].innerText.trim() !== "") {
            confirmSquare();
            closeEditPanel();
            return;
        }
    }
}

// ── Panel de edición ────────────────────────────────────────────

function openEditPanel(squareId) {
    editingSquareId = squareId;
    editContainer.innerHTML = renderEditPanel(squareId);
    editContainer.classList.remove("hidden");
    document.getElementById(`input-title-${squareId}`).focus();
}

function closeEditPanel() {
    editContainer.classList.add("hidden");
    editContainer.innerHTML = "";
}

// Lee el formulario de edición y dispara ADD_SQUARE
function confirmSquare() {
    const titleEl  = document.getElementById(`input-title-${editingSquareId}`);
    const checkBoxes = Array.from(editContainer.getElementsByClassName("checkbox-item"));
    const itemEls    = Array.from(editContainer.getElementsByClassName("element done"));

    const items = itemEls
        .filter(el => el.getAttribute("data-has-next-element") === "1")
        .map((el, i) => ({
            checked: checkBoxes[i] ? checkBoxes[i].checked : false,
            text: el.innerText.trim()
        }));

    dispatch({
        type: Actions.ADD_SQUARE,
        data: {
            title: titleEl.innerText.trim(),
            items
        }
    });
}

// ── Tarjetas ────────────────────────────────────────────────────

function onDeleteSquareClick(span) {
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

// ── Items de lista (panel de edición) ───────────────────────────
//
// checkedItem y deleteItem operan sobre el DOM del panel de edición,
// que es UI temporal. El estado real se persiste solo al confirmar.

function checkedItem(checkBox) {
    const divItem    = checkBox.parentNode.parentNode;
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
