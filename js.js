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
            console.log("jiooooooooooom");
            if (divSquareEdit.children[0].innerText != "") {
                console.log("jieeeeeeeeem");
                qSquares++;
                squareItem = getHTMLSquare();
                localStorage.setItem(`square-${qSquares}`, squareItem);
                localStorage.setItem("qSquares", qSquares);
                addSquares(squareItem, qSquares);
            }
            divSquareEdit.classList.add("hidden");
        }
    }
});

window.addEventListener("load", function () {
    qSquares = localStorage.getItem("qSquares");
    if (qSquares == null) localStorage.setItem("qSquares", 0);

    divContainer = document.getElementsByClassName("container")[0];
    divSquareEdit = document.getElementById("div-square-edit");

    let iconPlus = document.getElementById("icon-plus")
    iconPlus.addEventListener("click", function () {
        showSquareEdit();
    });

    if (qSquares > 0) {
        let squareItem;
        for (let index = 1; index <= qSquares; index++) {
            squareItem = localStorage.getItem(`square-${index}`);
            addSquares(squareItem, index);
        }
    }

    // square = document.getElementsByClassName("square")[0];
    // square.addEventListener("click", function () {
    //     console.log("78");
    //     showSquareEdit(this);
    // });
});

function getHTMLSquare() {
    let squareItem = divSquareEdit.innerHTML;
    squareItem = squareItem.replace(/contenteditable="true"/g, `contenteditable="false"`);
    squareItem = squareItem.replace(/type="checkbox" class=/g, `type="checkbox" disabled="true" style="cursor:pointer" class=`);
    return squareItem;
}

function getHTMLSquareEdit(html) {
    console.log("moroco");
    console.log(html);
    html = html.replace(/contenteditable="false"/g, `contenteditable="true"`);
    //squareItem = squareItem.replace(/type="checkbox" disabled="true" style="cursor:pointer" class=/g, `type="checkbox" class=`);
    return html;
}

function showSquareEdit(squareHTML) {
    console.log("jim");
    if (squareHTML) {
        // console.log("jim-100");
        // console.log("1", squareHTML);
        let classId = `square-${squareHTML.dataset.square}`;
        // console.log("2", classId);
        divSquareEdit.innerHTML = getHTMLSquareEdit(squareHTML.innerHTML);
        divSquareEdit.classList.add("exists"); //document.getElementsByClassName(classId)[0].innerHTML;
    }
    else {
        console.log("jim-200");
        divSquareEdit.innerHTML = DIV_SQUARE_EDIT;
        title = document.getElementsByClassName("title")[0];
        let element = document.getElementById("element-0");
        title.addEventListener("keypress", function (event) {
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                element.focus();
            }
        });
        element.addEventListener("keypress", function (event) {
            nextElement(event);
        });
        divSquareEdit.classList.remove("exists")
    }
    divSquareEdit.classList.remove("hidden");
    //title.focus();
}

function addSquares(squareItem, qSquares) {
    let html = "";
    //console.log("qSquares", qSquares);
    html += `<div class='square square-${qSquares}' onclick= showSquareEdit(this); data-square='${qSquares}'>`;
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