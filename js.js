let divContainerEdit;
let itemEdit;
let indexOnFocusSpan = false;

let square;

document.body.addEventListener("click", function (e) {
    let elementClicked = e.target;
    if (elementClicked.classList.contains('no-edit')) {
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
            console.log("saveSquare")
            saveSquare();
            return;
        }
    }
    // divContainerEdit.classList.add("edit-area");
    // divContainerEdit.classList.add("hidden");
});

// reviewer  // falta
function saveSquare() {
    let inputTitle = document.getElementById(`input-title-${itemEdit}`);
    console.log("inputTitle", inputTitle);
    let checkBoxElements = divContainerEdit.getElementsByClassName("checkbox-item");
    let inputElements = divContainerEdit.getElementsByClassName("element");
    let text = inputTitle.value + "¬";
    for (let i = 0; i < checkBoxElements.length; i++) {
        console.log("checkBoxElements[i].value", checkBoxElements[i].value);
        if (checkBoxElements[i].value != "") {

        }
        text += inputElements[i].value + "¬";
    }
    console.log("text:", text);
    text = text.substring(0, text.length - 1);
    console.log("text2:", text);
    // let inputTitle = document.getElementById(`input-title-${itemEdit}`);
    //itemEdit
    //console.log("text:", text);
    //document.getElementById("div-square-edit").classList.add("hidden");
    //document.getElementById("div-container-edit").style.display = 'none';
    divContainerEdit.classList.add("hidden");
    divContainerEdit.classList.add("display-flex");
}

// reviewer , falta
window.addEventListener("load", function () {
    let iconPlus = document.getElementById("icon-plus")
    iconPlus.addEventListener("click", function () {
        showSquareEdit();
    });
    /////////
    let qSquares = localStorage.getItem("qSquares");
    if (qSquares == null) {
        localStorage.setItem("qSquares", 0);
    }
    /////////
    if (qSquares > 0) {
        let squareItem;
        let divContainer = document.getElementById("div-container");
        for (let index = 1; index <= qSquares; index++) {
            squareItem = localStorage.getItem(`square-${index}`);
            if (squareItem) {
                addSquares(divContainer, squareItem, index);
            }
        }
    }
    divContainerEdit = document.getElementById("div-container-edit");
});

// revisar la línea del showSquereEdit, al parecer no va
function addSquares(divContainer, squareItem, index) {
    let html = "";
    //console.log("qSquares", qSquares);
    html += `<div class='square square-${index}' onclick= showSquareEdit(this);>`; //  data-square='${qSquares}'
    html += squareItem;
    html += "</div>";
    divContainer.insertAdjacentHTML("afterbegin", html);
}

function getValuesForSquare() {
    //listas[i].split("¬"); ~
    let title = document.getElementById("numberSquare");
    // **let squareItem = divSquareEdit.innerHTML;
    squareItem = squareItem.replace(/type="checkbox" class=/g, `type="checkbox" disabled="true" style="cursor:pointer" class=`);
    return squareItem;
}

function getHTMLSquareEdit(html) {
    html = html.replace(/contenteditable="false"/g, `contenteditable="true"`);
    //squareItem = squareItem.replace(/type="checkbox" disabled="true" style="cursor:pointer" class=/g, `type="checkbox" class=`);
    return html;
}

// reviewer , falta
function showSquareEdit() {
    numberSquare = 0;
    itemEdit = 0;
    divContainerEdit.innerHTML = getDivSquareEdit();

    let inputTitle0 = document.getElementById("input-title-0");
    inputTitle0.focus();


    //    let showSquare = target.getAttribute('data-show-square');
    //target.setAttribute('data-show-square', "1");
    //divContainerEdit.classList.add("display-flex");
    divContainerEdit.classList.remove("hidden");
    console.log("showSquareEdit")
}
// reviewer
function getDivSquareEdit() {
    let html = "";
    html += "<div id='div-square-edit' class='square-edit edit'>";
    html += "<div id='div-pending' class='square-pending edit'>";
    html += "<input type='text' id='input-title-0' class='title edit' ";
    html += "placeholder='Título' onkeypress='nextElementFromTitle(event,0,0);'>";
    html += "<div id='div-item-0-0' class='item edit' onmouseenter='onMouseEnterItem(this)' onmouseleave='onMouseLeaveItem(this)'>";
    html += "<span class='ghost mover edit' style='visibility:hidden;'>&#8801</span>";
    html += "<span class='plus edit'>+</span>";
    html += "<input type='text' id='input-element-0-0' class='element edit' ";
    html += "placeholder='Elemento de lista' data-has-next-element='0' ";
    html += "onkeypress='nextElement(event,0,1);' onfocusin='onFocusInInput(this)' onfocusout='onFocusOutInput(this)'>";
    html += "<span class='ghost close hidden edit' onclick='deleteItem(this)' onmouseenter='onMouseEnterSpan(true)' onmouseleave='onMouseEnterSpan(false)'>x</span>";
    html += "</div></div>";
    html += "<div id='div-done' class='square-done edit'>";
    html += "</div></div>";
    return html;
}
//reviewer
function onMouseEnterSpan(flag) {
    indexOnFocusSpan = flag;
}
//reviewer
function deleteItem(span) {
    span.parentNode.parentNode.removeChild(span.parentNode);
    indexOnFocusSpan = false;
}
//reviewer
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
//reviewer
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
//reviewer
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
//reviewer
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
//reviewer
function hasTextInInput(input) {
    let hasNextElement = input.getAttribute('data-has-next-element');
    return hasNextElement == "1";
}
// reviewer
function nextElementFromTitle(event, squareId, elementId) {
    const element = getAnyElement(squareId, elementId);
    detectEnter(event, element);
}
// reviewer
function getAnyElement(squareId, elementId) {
    return document.getElementById(`input-element-${squareId}-${elementId}`);
}
// reviewer
function getIdForAnyElement(element) {
    let elementId = element.id;
    let indexStart = elementId.lastIndexOf('-') + 1;
    return +elementId.substring(indexStart);
}

// reviewer
function checkedItem(checkBox) {
    const divItem = checkBox.parentNode.parentNode;
    const inputTarget = checkBox.parentNode.nextSibling;
    checkBox.classList.toggle("appearance");
    inputTarget.classList.toggle("line-through");
    //
    const divDone = document.getElementById("div-done");
    const divPending = document.getElementById("div-pending");
    //
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
// reviewer
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
// reviewer
function nextElement(event, squareId, elementId) {
    const actualElement = event.target;
    const hasNextElement = actualElement.getAttribute('data-has-next-element');
    const nextElement = getAnyElement(squareId, elementId);
    if (hasNextElement == "0") {
        const parentActualElement = actualElement.parentNode.parentNode;
        parentActualElement.insertAdjacentHTML("beforeend", getPendingItem(squareId, elementId));
        actualElement.previousSibling.innerHTML = getInputCheckBox(false);
        actualElement.setAttribute('data-has-next-element', "1");
        //****
        const [spanMover, spanClose] = actualElement.parentNode.querySelectorAll(".ghost");
        if (spanClose) {
            spanMover.style.visibility = "visible";
            spanClose.classList.remove("hidden");
        }
        //****
    }
    detectEnter(event, nextElement);
}
// reviewer
function getInputCheckBox(checked) {
    let html = "";
    html += "<input type='checkbox' ";
    html += "class='checkbox-item appearance edit' ";
    html += "onchange='checkedItem(this)'/>";
    return html;
}

// reviewer
function detectEnter(event, element) {
    const keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        element.focus();
    }
}

// reviewer
function getPendingItem(squareId, elementId) {
    let html = "";
    html += "<div id='div-item-";
    html += squareId;
    html += "-";
    html += elementId;
    html += "' class='item edit' onmouseenter='onMouseEnterItem(this)' onmouseleave='onMouseLeaveItem(this)'>";
    html += "<span class='ghost mover edit' style='visibility:hidden;'>&#8801</span>";
    html += "<span class='plus edit'>+</span>";
    html += "<input type='text' id='input-element-";
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
    html += ");' onfocusin='onFocusInInput(this)' onfocusout='onFocusOutInput(this)'>";
    html += "<span class='ghost close hidden edit' onclick='deleteItem(this)' onmouseenter='onMouseEnterSpan(true)' onmouseleave='onMouseEnterSpan(false)'>x</span>";
    html += "</div>";
    return html;
}

function addEventsAtPendingItems() {
    let items = document.getElementsByClassName("pending-item");
    let litems = items.length;
    for (let i = 0; i < litems; i++) {
        items[i].addEventListener("click", function () {
            //console.log("moroco" + i);
        });
    }
}