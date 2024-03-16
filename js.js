const INPUT_CHECKBOX = "<input type='checkbox' class='checkbox-item appearance' onchange='checkedItem(this)'/>";
const DIV_SQUARE_EDIT = "<div id = 'div-title' class='title edit' contenteditable='true' placeholder='Título'></div><div id = 'div-item' class='item edit'><span class='plus edit'>&#128930;</span><input type='text' class='element edit' placeholder='Elemento de lista' data-has-next-element = '0' id='element-0'></div>";

let square;
let elementNumber = 0;
let elementId;
let qSquares;
let title;

document.addEventListener("click", function (e) {
    const classList = e.target.classList;
    let clickInSquareEdit = false;
    for (let i = 0; i < classList.length; i++) {
        if (classList[i] == "edit") {
            clickInSquareEdit = true;
            break;
        }
    }
    if (!clickInSquareEdit) {
        console.log("!clickInSquareEdit");
        let divSquareEdit = document.getElementById("div-square-edit");
        console.log("title",title);
        if (title.innerText != "") {
            console.log("ddd");
            localStorage.setItem(`square-${qSquares++}`, divSquareEdit.innerHTML);
        }
        divSquareEdit.classList.add("hidden");
    }
});

window.addEventListener("load", function () {
    qSquares = localStorage.getItem("qSquares");
    if (qSquares == null) localStorage.setItem("qSquares", 0);

    square = document.getElementsByClassName("square")[0];

    title = document.getElementsByClassName("title")[0];
    let element = document.getElementsByClassName("element")[0];
    let iconPlus = document.getElementById("icon-plus")
    let divSquareEdit = document.getElementById("div-square-edit");

    title.addEventListener("keypress", function (event) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            element.focus();
        }
    });

    element.addEventListener("keypress", function (event) {
        nextElement(event);
    });

    iconPlus.addEventListener("click", function (e) {        
        divSquareEdit.classList.remove("hidden");
        //divSquareEdit.innerHTML = DIV_SQUARE_EDIT;
        title.focus();
    });

    if (qSquares > 0) {
        let squareItem;
        for (let index = 1; index <= qSquares; index++) {
            squareItem = array[index];

        }
    }
});

function checkedItem(checkBox) {
    checkBox.classList.toggle("appearance");
}

function nextElement(event) {
    let actualElement = event.target;
    let hasNextElement = actualElement.getAttribute('data-has-next-element');
    if (hasNextElement == "0") {
        let parentActualElement = actualElement.parentNode.parentNode;
        parentActualElement.insertAdjacentHTML("beforeend", getPendingItem());
        if (event.target.id == "element-0") {
            actualElement.previousSibling.previousSibling.innerHTML = INPUT_CHECKBOX;
        }
        else {
            actualElement.previousSibling.innerHTML = INPUT_CHECKBOX;
        }
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
    html += "<input type='text' class='element edit' placeholder='Elemento de lista' data-has-next-element = '0' id='";
    html += elementId;
    html += "'>";
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