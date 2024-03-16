const INPUT_CHECKBOX = "<input type='checkbox' class='checkbox-item appearance edit' onchange='checkedItem(this)'/>";
//const DIV_SQUARE_EDIT = "<div id = 'div-title' class='title edit' contenteditable='true' placeholder='Título'></div><div id = 'div-item' class='item edit'><span class='plus edit'>&#128930;</span><input type='text' class='element edit' placeholder='Elemento de lista' data-has-next-element = '0' id='element-0'></div>";
const DIV_SQUARE_EDIT = "<div id='div-title' class='title edit' contenteditable='true' placeholder='Título'></div><div id='div-item' class='item edit'><span class='plus edit'>&#128930;</span><div contenteditable='true' class='element edit' placeholder='Elemento de lista' data-has-next-element='0' id='element-0'></div></div>";

let square;
let elementNumber = 0;
let elementId;
let qSquares;
let divSquareEdit;
let title;
let divContainer;

document.addEventListener("click", function (e) {
    if (!divSquareEdit.classList.contains("hidden")) {
        //console.log("jim");
        let classList = e.target.classList;
        let clickInSquareEdit = false;
        let squareItem;
        for (let i = 0; i < classList.length; i++) {
            if (classList[i] == "edit") {
                clickInSquareEdit = true;
                break;
            }
        }
        if (!clickInSquareEdit) {
            if (title.innerText != "") {
                qSquares++;
                squareItem = getHTMLSquare();
                localStorage.setItem(`square-${qSquares}`, squareItem);
                localStorage.setItem("qSquares", qSquares);
                addSquares(squareItem);
            }
            divSquareEdit.classList.add("hidden");
        }
    }
});

function getHTMLSquare() {
    let squareItem = divSquareEdit.innerHTML;
    squareItem = squareItem.replace(/contenteditable="true"/g, `contenteditable="false"`);
    squareItem = squareItem.replace(/type="checkbox" class=/g, `type="checkbox" disabled style="cursor:pointer" class=`);
    return squareItem;
}

window.addEventListener("load", function () {
    qSquares = localStorage.getItem("qSquares");
    if (qSquares == null) localStorage.setItem("qSquares", 0);
    square = document.getElementsByClassName("square")[0];
    divContainer = document.getElementsByClassName("container")[0];

    let iconPlus = document.getElementById("icon-plus")

    divSquareEdit = document.getElementById("div-square-edit");

    iconPlus.addEventListener("click", function (e) {
        divSquareEdit.classList.remove("hidden");
        divSquareEdit.innerHTML = DIV_SQUARE_EDIT;
        title = document.getElementsByClassName("title")[0];
        let element = document.getElementsByClassName("element")[0];
        title.addEventListener("keypress", function (event) {
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                element.focus();
            }
        });
        element.addEventListener("keypress", function (event) {
            nextElement(event);
        });
        title.focus();
    });

    if (qSquares > 0) {
        let squareItem;
        for (let index = 1; index <= qSquares; index++) {
            squareItem = localStorage.getItem(`square-${index}`);
            addSquares(squareItem);
        }
    }
});

function addSquares(squareItem) {
    let html = "";
    html += "<div class='square'>";
    html += squareItem;
    html += "</div>";
    divContainer.insertAdjacentHTML("afterbegin", html);
}

function checkedItem(checkBox) {
    checkBox.classList.toggle("appearance");
}

function nextElement(event) {
    let actualElement = event.target;
    let hasNextElement = actualElement.getAttribute('data-has-next-element');
    if (hasNextElement == "0") {
        let parentActualElement = actualElement.parentNode.parentNode;
        parentActualElement.insertAdjacentHTML("beforeend", getPendingItem());
        // if (event.target.id == "element-0") {
        //     actualElement.previousSibling.previousSibling.innerHTML = INPUT_CHECKBOX;
        // }
        // else {
        actualElement.previousSibling.innerHTML = INPUT_CHECKBOX;
        //}
        elementId = document.getElementById(elementId);
        elementId.addEventListener("keypress", function (event) {
            nextElement(event);
        });
        actualElement.setAttribute('data-has-next-element', "1");
    }
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        elementId.focus();
    }
}

function getPendingItem() {
    elementNumber++;
    elementId = "element-" + elementNumber;
    let html = "";
    html += "<div class='item edit'>";
    html += "<span class='plus edit'>&#128930;</span>";
    //html += "<input type='text' class='element edit' placeholder='Elemento de lista' data-has-next-element = '0' id='";
    html += "<div contenteditable='true' class='element edit' placeholder='Elemento de lista' data-has-next-element = '0' id='";
    html += elementId;
    //html += "'>";
    html += "'></div>";
    html += "</div>";
    return html;
}

function addEventsAtPendingItems() {
    let items = document.getElementsByClassName("pending-item");
    let litems = items.length;
    for (let i = 0; i < litems; i++) {
        items[i].addEventListener("click", function () {
            console.log("moroco" + i);
        });
    }
}