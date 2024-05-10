const INPUT_CHECKBOX = `<input type='checkbox'
                               class='checkbox-item appearance edit'
                               onchange='checkedItem(this)'
                        />`;
let divContainerEdit;
let itemEdit;



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
//function

// reviewer
function getDivSquareEdit() {
    let html = "";
    html += "<div id='div-square-edit' class='square-edit edit'>";
    html += "<div id='div-pending' class='square-pending edit'>";
    html += "<input type='text' id='input-title-0' class='title edit' ";
    html += "placeholder='Título' onkeypress='nextElementFromTitle(event,0,0);'>";
    html += "<div id='div-item-0-0' class='item edit'><span class='plus edit'>+</span>";
    html += "<input type='text' id='input-element-0-0' class='element edit' ";
    html += "placeholder='Elemento de lista' data-has-next-element='0' ";
    html += "onkeypress='nextElement(event,0,1);'>";
    html += "</div></div>";    
    html += "<div id='div-done' class='square-done edit'>";
    html += "</div></div>";
    return html;
}

// reviewer
function nextElementFromTitle(event, squareId, elementId) {
    let element = getAnyElement(squareId, elementId);
    detectEnter(event, element);
}

// reviewer
function getAnyElement(squareId, elementId) {
    return document.getElementById(`input-element-${squareId}-${elementId}`);
}

// reviewer falta
function checkedItem(checkBox) {
    checkBox.classList.toggle("appearance");
    let divDone = document.getElementById("div-done");
    //html += "<hr class='edit'>"; beforebegin
    divDone.insertAdjacentHTML("beforeend", "jim moroco");
    checkBox.parentNode.nextSibling.classList.toggle("line-through");

}

// reviewer
function nextElement(event, squareId, elementId) {
    let actualElement = event.target;
    let hasNextElement = actualElement.getAttribute('data-has-next-element');
    let nextElement = getAnyElement(squareId, elementId);
    if (hasNextElement == "0") {
        let parentActualElement = actualElement.parentNode.parentNode;
        parentActualElement.insertAdjacentHTML("beforeend", getPendingItem(squareId, elementId));
        //console.log("parentActualElement",parentActualElement);
        actualElement.previousSibling.innerHTML = INPUT_CHECKBOX;
        actualElement.setAttribute('data-has-next-element', "1");
    }
    detectEnter(event, nextElement);
}

// reviewer
function detectEnter(event, element) {
    let keycode = (event.keyCode ? event.keyCode : event.which);
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
    html += "' class='item edit'>";
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
    html += ");'>";
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