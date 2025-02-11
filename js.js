let divContainerEdit;
let itemEdit;
let indexOnFocusSpan = false;
let square;

// refactor
let qSquares;
window.addEventListener("load", function () {
    qSquares = localStorage.getItem("qSquares");
    if (qSquares == null) {
        localStorage.setItem("qSquares", 0);
    }
    let iconPlus = document.getElementById("icon-plus")
    iconPlus.addEventListener("click", function () {
        showSquareEdit(0);
    });
    if (qSquares > 0) {
        let divContainer = document.getElementById("div-container");
        for (let index = 1; index <= qSquares; index++) {
            addSquares(divContainer, index);
        }
    }
    divContainerEdit = document.getElementById("div-container-edit");
});
// refactor
document.body.addEventListener("click", function (e) {
    let elementClicked = e.target;
    let itemId;
    if (elementClicked.classList.contains('no-edit')) {
        if (elementClicked.hasAttribute("data-id")) {
            itemId = elementClicked.getAttribute("data-id");
            let divContainer = document.getElementById("div-container");
            addSquares(divContainer, itemId);
        }
        return;
    }
    if (divContainerEdit.classList.contains('hidden')) {
        return;
    }
    if (elementClicked.classList.contains('edit')) {
        return;
    }
    let inputElements = divContainerEdit.getElementsByClassName("element");
    for (let i = 0; i < inputElements.length; i++) {
        if (inputElements[i].value != "") {
            saveSquare();
            document.getElementById("div-square-edit").setAttribute('style', 'display:none');
            return;
        }
    }
});
// refactor
function saveSquare() {
    let divTitle = document.getElementById(`input-title-${itemEdit}`);
    let checkBoxElements = divContainerEdit.getElementsByClassName("checkbox-item");
    let divElements = divContainerEdit.getElementsByClassName("element done");
    let text = divTitle.innerText + "¬";
    for (let i = 0; i < divElements.length; i++) {
        text += checkBoxElements[i].checked + "¬";
        if (divElements[i].getAttribute('data-has-next-element') == "1") {
            text += divElements[i].innerText + "¬";
        }
    }
    text = text.substring(0, text.length - 1);
    let numberqSq = +qSquares + 1;
    localStorage.setItem(`square-${numberqSq}`, text);
    localStorage.setItem("qSquares", numberqSq);
    let divContainer = document.getElementById("div-container");
    addSquares(divContainer, numberqSq);
}
// refactor
function addSquares(divContainer, index) {
    let squareItem = localStorage.getItem(`square-${index}`);
    if (!squareItem) {
        return;
    }
    let squareItems = squareItem.split("¬");
    let html = "";
    let i;
    let hasDoneItems = false;
    let squareId = `square-${index}`;
    html += "<div class='square cursor-hand no-edit ";
    html += squareId;
    html += "' id = '";
    html += squareId;
    html += "' data-id=";
    html += index;
    html += " readonly>";
    html += "<div id='div-pending' class='square-pending no-edit' ";
    html += " data-id=";
    html += index;
    html += ">";
    html += "<div id='input-title-";
    html += squareId;
    html += "' class='no-edit title cursor-hand' ";
    html += " data-id=";
    html += index;
    html += " disabled>";
    html += squareItems[0];
    html += "</div>";
    for (i = 1; i < squareItems.length; i = i + 2) {
        if (squareItems[i] == "true") {
            hasDoneItems = true;
            break;
        }
        html += "<div class='item no-edit'";
        html += " data-id=";
        html += index;
        html += ">";
        html += "<span class='plus'";
        html += " data-id=";
        html += index;
        html += ">";
        html += "<input type='checkbox' ";
        html += "class='checkbox-item cursor-hand appearance'";
        html += " data-id=";
        html += index;
        html += ">";
        html += "</span>";
        html += "<div disabled class='no-edit element cursor-hand'";
        html += " data-id=";
        html += index;
        html += ">";
        html += squareItems[i + 1];
        html += "</div>";
        html += "</div>"; // end class item
    }
    html += "</div>"; // end div-pending
    if (hasDoneItems) {
        html += "<hr id='hr-n' class='no-edit'";
        html += " data-id=";
        html += index;
        html += ">";
        html += "<div id='div-done' class='square-done no-edit'";
        html += " data-id=";
        html += index;
        html += ">";
        for (let j = i; j < squareItems.length; j = j + 2) {
            html += "<div class='item no-edit'";
            html += " data-id=";
            html += index;
            html += ">";
            html += "<span class='plus'";
            html += " data-id=";
            html += index;
            html += ">";
            html += "<input type='checkbox' ";
            html += "class='checkbox-item cursor-hand no-edit'";
            html += " data-id=";
            html += index;
            html += " disabled checked></span>";
            html += "<div class='no-edit element line-through'";
            html += " data-id=";
            html += index;
            html += ">";
            html += squareItems[j + 1];
            html += "</div>";
            html += "</div>"; // end class item
        }
        html += "</div>"; // end div-done
    }
    html += "<div class='trash no-edit' ";
    html += "onmouseenter='enterTrash(this)' ";
    html += "onmouseleave='leaveTrash(this)'>";
    html += "<span style='visibility:hidden' ";
    html += "onclick='deleteSquare(this)'>&#128465</span>";
    html += "</div>"; // end class trash
    html += "</div>"; // end square
    divContainer.insertAdjacentHTML("afterbegin", html);
}
function deleteSquare(span) {
    let divSquare = span.parentNode.parentNode;
    let idDivSquare = divSquare.id;
    squareItem = localStorage.getItem(idDivSquare);
    localStorage.setItem(`r-${idDivSquare}`, squareItem);
    localStorage.removeItem(idDivSquare);
    divSquare.remove();
}
function enterTrash(div) {
    div.firstChild.style.visibility = "visible";
}
function leaveTrash(div) {
    div.firstChild.style.visibility = "hidden";
}
function getValuesForSquare() {
    let title = document.getElementById("numberSquare");
    squareItem = squareItem.replace(/type="checkbox" class=/g, `type="checkbox" disabled="true" style="cursor:pointer" class=`);
    return squareItem;
}
function getHTMLSquareEdit(html) {
    html = html.replace(/contenteditable="false"/g, `contenteditable="true"`);
    return html;
}
// refactor
function showSquareEdit(item) {
    itemEdit = item;
    divContainerEdit.innerHTML = getDivSquareEdit(item);
    divContainerEdit.classList.remove("hidden");

    let inputTitle0 = document.getElementById(`input-title-${item}`);
    inputTitle0.focus();
}
function getDivSquareEdit(item) {
    let html = "";
    html += "<div id='div-square-edit' class='square-edit edit'>";
    html += "<div id='div-pending' class='square-pending edit'>";
    html += "<div id='input-title-";
    html += item;
    html += "' class='title edit' ";
    html += "placeholder='Título' contenteditable='true' ";
    html += "onkeypress='nextElementFromTitle(event,";
    html += item;
    html += ",0);'>";
    html += "</div>";
    html += "<div id='div-item-";
    html += item;
    html += "-0' class='item edit' onmouseenter='onMouseEnterItem(this)' ";
    html += "onmouseleave='onMouseLeaveItem(this)' draggable='true'>";
    html += "<span class='ghost mover edit' style='visibility:hidden;' ";
    html += "onclick='moveItem(this)'>&#8801</span>";
    html += "<span class='plus edit'>+</span>";
    html += "<div id='input-element-";
    html += item;
    html += "-0' class='element edit' contenteditable='true'";
    html += "placeholder='Elemento de lista' data-has-next-element='0' ";
    html += "onkeypress='nextElement(event,0,1);' onfocusin='onFocusInInput(this)' ";
    html += "onfocusout='onFocusOutInput(this)'>";
    html += "</div>";
    html += "<span class='ghost close cursor-hand hidden edit' onclick='deleteItem(this)' ";
    html += "onmouseenter='onMouseEnterSpan(true)' onmouseleave='onMouseEnterSpan(false)'>x</span>";
    html += "</div></div>";
    html += "<div id='div-done' class='square-done edit'>";
    html += "</div></div>";
    return html;
}
function onMouseEnterSpan(flag) {
    indexOnFocusSpan = flag;
}
function deleteItem(span) {
    span.parentNode.parentNode.removeChild(span.parentNode);
    indexOnFocusSpan = false;
    const divDone = document.getElementById("div-done");
    if (divDone.innerHTML == "") {
        document.getElementById("div-square-edit").removeChild(document.getElementById("hr-n"));
    }
}
function onMouseEnterItem(div) {
    const input = div.getElementsByClassName("element")[0];
    if (!hasTextInInput(input)) {
        return;
    }
    const [spanMover, spanClose] = div.querySelectorAll(".ghost");
    if (!spanClose) {
        return;
    }
    spanMover.style.visibility = "visible";
    spanClose.classList.remove("hidden");
}
function onMouseLeaveItem(div) {
    const [spanMover, spanClose] = div.querySelectorAll(".ghost");
    if (!spanClose) {
        return;
    }
    const input = div.getElementsByClassName("element")[0];
    if (input != document.activeElement) {
        spanMover.style.visibility = "hidden";
        spanClose.classList.add("hidden");
    }
}
function onFocusInInput(input) {
    const div = input.parentNode;
    if (!hasTextInInput(input)) {
        return;
    }
    const [spanMover, spanClose] = div.querySelectorAll(".ghost");
    if (!spanClose) {
        return;
    }
    spanMover.style.visibility = "visible";
    spanClose.classList.remove("hidden");
}
function onFocusOutInput(input) {
    const div = input.parentNode;
    const [spanMover, spanClose] = div.querySelectorAll(".ghost");
    if (!spanClose) {
        return;
    }
    if (indexOnFocusSpan) {
        return;
    }
    spanMover.style.visibility = "hidden";
    spanClose.classList.add("hidden");
}
function hasTextInInput(input) {
    let hasNextElement = input.getAttribute('data-has-next-element');
    return hasNextElement == "1";
}
function nextElementFromTitle(event, squareId, elementId) {
    const element = getAnyElement(squareId, elementId);
    detectEnter(event, element);
}
function getAnyElement(squareId, elementId) {
    return document.getElementById(`input-element-${squareId}-${elementId}`);
}
function getIdForAnyElement(element) {
    let elementId = element.id;
    let indexStart = elementId.lastIndexOf('-') + 1;
    return +elementId.substring(indexStart);
}
function checkedItem(checkBox) {
    const divItem = checkBox.parentNode.parentNode;
    const inputTarget = checkBox.parentNode.nextSibling;
    checkBox.classList.toggle("appearance");
    inputTarget.classList.toggle("line-through");
    const divDone = document.getElementById("div-done");
    const divPending = document.getElementById("div-pending");
    inputTarget.readOnly = checkBox.checked;
    if (checkBox.checked) {
        divPending.removeChild(divItem);
        if (divDone.innerHTML == "") {
            divDone.insertAdjacentHTML("beforebegin", "<hr id='hr-n' class='edit'>");
        }
        divDone.appendChild(divItem);
    }
    else {
        appendChildToDivDone(divPending, divItem);
        if (divDone.innerHTML == "") {
            document.getElementById("div-square-edit").removeChild(document.getElementById("hr-n"));
        }
    }
}
function appendChildToDivDone(div, itemPending) {
    let items = div.getElementsByClassName("item");
    let id = getIdForAnyElement(itemPending);
    if (id == 0) {
        div.insertBefore(itemPending, items[0]);
        return;
    }
    let idItem;
    for (let i = 0; i < items.length; i++) {
        idItem = getIdForAnyElement(items[i]);
        if (idItem > id) {
            div.insertBefore(itemPending, items[i]);
            return;
        }
    }
    div.insertBefore(itemPending, null);
}
function nextElement(event, squareId, elementId) {
    const actualElement = event.target;
    const hasNextElement = actualElement.getAttribute('data-has-next-element');
    const nextElement = getAnyElement(squareId, elementId);
    if (hasNextElement == "0") {
        const parentActualElement = actualElement.parentNode.parentNode;
        parentActualElement.insertAdjacentHTML("beforeend", getPendingItem(squareId, elementId));
        actualElement.previousSibling.innerHTML = getInputCheckBox(false);
        actualElement.classList.toggle("done");
        actualElement.setAttribute('data-has-next-element', "1");

        const [spanMover, spanClose] = actualElement.parentNode.querySelectorAll(".ghost");
        if (spanClose) {
            spanMover.style.visibility = "visible";
            spanClose.classList.remove("hidden");
        }
    }
    detectEnter(event, nextElement);
}
function getInputCheckBox(checked) {
    let html = "";
    html += "<input type='checkbox' ";
    html += "class='checkbox-item cursor-hand appearance edit' ";
    html += "onchange='checkedItem(this)'/>";
    return html;
}
function detectEnter(event, element) {
    const keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        element.focus();
    }
}
function getPendingItem(squareId, elementId) {
    let html = "";
    html += "<div id='div-item-";
    html += squareId;
    html += "-";
    html += elementId;
    html += "' class='item edit' ";
    html += "onmouseenter='onMouseEnterItem(this)' ";
    html += "onmouseleave='onMouseLeaveItem(this)' ";
    html += "draggable='true'>";
    html += "<span class='ghost mover edit' style='visibility:hidden;' ";
    html += "onclick='moveItem(this)'>&#8801</span>";
    html += "<span class='plus edit'>+</span>";
    html += "<div id='input-element-";
    html += squareId;
    html += "-";
    html += elementId;
    html += "' class='element edit' ";
    html += "placeholder='Elemento de lista' ";
    html += "data-has-next-element='0' ";
    html += "onkeypress='nextElement(event,";
    html += squareId;
    html += ",";
    elementId = elementId + 1;
    html += elementId;
    html += ");' onfocusin='onFocusInInput(this)' ";
    html += "onfocusout='onFocusOutInput(this)' ";
    html += "contenteditable='true'>";
    html += "</div>";
    html += "<span class='ghost close cursor-hand hidden edit' ";
    html += "onclick='deleteItem(this)' onmouseenter='onMouseEnterSpan(true)' ";
    html += "onmouseleave='onMouseEnterSpan(false)'>x</span>";
    html += "</div>";
    return html;
}
function moveItem(spanMover) {
    const divItem = spanMover.parentNode;
    divItem.setAttribute('style', 'transform:scale(1.09)');
}
function addEventsAtPendingItems() {
    let items = document.getElementsByClassName("pending-item");
    let litems = items.length;
    for (let i = 0; i < litems; i++) {
        items[i].addEventListener("click", function () {
        });
    }
}