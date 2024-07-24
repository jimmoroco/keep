let divContainerEdit;
let itemEdit;
let indexOnFocusSpan = false;

let square;

// reviewer // falta
document.body.addEventListener("click", function (e) {
    console.log("jim moroco-0.0");
    let elementClicked = e.target;
    if (elementClicked.classList.contains('no-edit')) {
        console.log("jim moroco-0");
        return;
    }
    if (divContainerEdit.classList.contains('hidden')) {
        console.log("jim moroco-1");
        return;
    }
    if (elementClicked.classList.contains('edit')) {
        console.log("jim moroco-2");
        return;
    }
    console.log("jim moroco-3");
    let inputElements = divContainerEdit.getElementsByClassName("element");
    for (let i = 0; i < inputElements.length; i++) {
        console.log("jim moroco-4");
        if (inputElements[i].value != "") {
            console.log("jim moroco-5");
            console.log("saveSquare")
            saveSquare();
            document.getElementById("div-square-edit").setAttribute('style', 'display:none');
            return;
        }
    }
<<<<<<< HEAD
=======
    console.log("jim moroco-6");
    // divContainerEdit.classList.add("edit-area");
    // divContainerEdit.classList.add("hidden");
>>>>>>> c7d237624ad3de996f2edca7bb80941cadd757dc
});

// reviewer  // falta
function saveSquare() {
    let inputTitle = document.getElementById(`input-title-${itemEdit}`);
    let checkBoxElements = divContainerEdit.getElementsByClassName("checkbox-item");
    console.log("checkBoxElements", checkBoxElements);
    let inputElements = divContainerEdit.getElementsByClassName("element done");
    console.log("inputElements", inputElements);
    let text = inputTitle.value + "¬";
    for (let i = 0; i < inputElements.length; i++) {
        text += checkBoxElements[i].checked + "¬";
        if (inputElements[i].getAttribute('data-has-next-element') == "1") {
            text += inputElements[i].value + "¬";
        }
    }
    text = text.substring(0, text.length - 1);
<<<<<<< HEAD
    console.log("text2:", text);
    
    divContainerEdit.classList.add("hidden");
    divContainerEdit.classList.add("display-flex");
=======
    console.log("text", text);
    let numberqSq = +qSquares + 1;
    localStorage.setItem(`square-${numberqSq}`, text);
    localStorage.setItem("qSquares", numberqSq);
    let divContainer = document.getElementById("div-container");
    addSquares(divContainer, text, numberqSq);
>>>>>>> c7d237624ad3de996f2edca7bb80941cadd757dc
}

// reviewer , falta
let qSquares;
window.addEventListener("load", function () {
    let iconPlus = document.getElementById("icon-plus")
    iconPlus.addEventListener("click", function () {
        showSquareEdit();
    });
    /////////
    qSquares = localStorage.getItem("qSquares");
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
    let squareItems = squareItem.split("¬");
    console.log("squareItems", squareItems);
    let html = "";
<<<<<<< HEAD
    html += `<div class='square square-${index}' onclick= showSquareEdit(this);>`; //  data-square='${qSquares}'
    html += squareItem;
    html += "</div>";
=======
    let i;
    let hasDoneItems = false;
    let squareId = `square-${index}`;
    html += "<div class='square cursor-hand ";
    html += squareId;
    html += "' id = '";
    html += squareId;
    html += "' readonly>";
    // html += "' onclick= 'showSquareEdit(this)' readonly>";
    html += "<div id='div-pending' class='square-pending'>";
    html += "<input type='text' id='input-title-0' class='title cursor-hand' disabled value='";
    html += squareItems[0];
    html += "'>";
    for (i = 1; i < squareItems.length; i = i + 2) {
        if (squareItems[i] == "true") {
            hasDoneItems = true;
            break;
        }
        html += "<div class='item'>";
        html += "<span class='plus'><input type='checkbox' class='checkbox-item cursor-hand appearance'></span>";
        html += "<input type='text' disabled class='element cursor-hand' value='";
        html += squareItems[i + 1];
        html += "'>";
        html += "</div>";
    }
    html += "</div>"; // end div-pending
    if (hasDoneItems) {
        html += "<hr id='hr-n'>";
        html += "<div id='div-done' class='square-done'>";
        for (let j = i; j < squareItems.length; j = j + 2) {
            html += "<div class='item'>";
            html += "<span class='plus'><input type='checkbox' class='checkbox-item cursor-hand' disabled checked></span>";
            html += "<input type='text' class='element line-through' value='";
            html += squareItems[j + 1];
            html += "'>";
            html += "</div>";
            console.log("squareItems[j + 1];", squareItems[j + 1]);
        }
        html += "</div>"; // end div-done
    }
    html += "</div>"; // end square
>>>>>>> c7d237624ad3de996f2edca7bb80941cadd757dc
    divContainer.insertAdjacentHTML("afterbegin", html);
    //
    document.getElementById(squareId).addEventListener("click", function () {
        console.log("jim67");
        showSquareEdit(this);
    }, false);


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

// reviewer , falta
function showSquareEdit() {
    console.log("showSquareEdit000000000");
    numberSquare = 0;
    itemEdit = 0;
    divContainerEdit.innerHTML = getDivSquareEdit();

    let inputTitle0 = document.getElementById("input-title-0");
    inputTitle0.focus();

    divContainerEdit.classList.remove("hidden");
}
// reviewer
function getDivSquareEdit() {
    let html = "";
    html += "<div id='div-square-edit' class='square-edit edit'>";
    html += "<div id='div-pending' class='square-pending edit'>";
    html += "<input type='text' id='input-title-0' class='title edit' ";
    html += "placeholder='Título' onkeypress='nextElementFromTitle(event,0,0);'>";
    html += "<div id='div-item-0-0' class='item edit' onmouseenter='onMouseEnterItem(this)' onmouseleave='onMouseLeaveItem(this)' draggable='true'>";
    html += "<span class='ghost mover edit' style='visibility:hidden;' onclick='moveItem(this)'>&#8801</span>";
    html += "<span class='plus edit'>+</span>";
    html += "<input type='text' id='input-element-0-0' class='element edit' ";
    html += "placeholder='Elemento de lista' data-has-next-element='0' ";
    html += "onkeypress='nextElement(event,0,1);' onfocusin='onFocusInInput(this)' onfocusout='onFocusOutInput(this)'>";
    html += "<span class='ghost close cursor-hand hidden edit' onclick='deleteItem(this)' onmouseenter='onMouseEnterSpan(true)' onmouseleave='onMouseEnterSpan(false)'>x</span>";
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
    const divDone = document.getElementById("div-done");
    if (divDone.innerHTML == "") {
        document.getElementById("div-square-edit").removeChild(document.getElementById("hr-n"));
    }
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
        actualElement.classList.toggle("done");
        actualElement.setAttribute('data-has-next-element', "1");
<<<<<<< HEAD
        /////
        let spanClose = actualElement.parentNode.getElementsByClassName("close")[0];
=======

        const [spanMover, spanClose] = actualElement.parentNode.querySelectorAll(".ghost");
>>>>>>> c7d237624ad3de996f2edca7bb80941cadd757dc
        if (spanClose) {
            spanMover.style.visibility = "visible";
            spanClose.classList.remove("hidden");
        }
<<<<<<< HEAD
        /////
=======
>>>>>>> c7d237624ad3de996f2edca7bb80941cadd757dc
    }
    detectEnter(event, nextElement);
}
// reviewer
function getInputCheckBox(checked) {
    let html = "";
    html += "<input type='checkbox' ";
    html += "class='checkbox-item cursor-hand appearance edit' ";
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
    html += "' class='item edit' onmouseenter='onMouseEnterItem(this)'";
    html += " onmouseleave='onMouseLeaveItem(this)'";
    html += " draggable='true'>";
    html += "<span class='ghost mover edit' style='visibility:hidden;'";
    html += " onclick='moveItem(this)'>&#8801</span>";
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
    html += "<span class='ghost close cursor-hand hidden edit' ";
    html += "onclick='deleteItem(this)' onmouseenter='onMouseEnterSpan(true)' ";
    html += "onmouseleave='onMouseEnterSpan(false)'>x</span>";
    html += "</div>";
    return html;
}
//reviewer
function moveItem(spanMover) {
    const divItem = spanMover.parentNode;
    //divItem.setAttribute('draggable', true);
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