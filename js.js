const INPUT_CHECKBOX = "<input type='checkbox' class='checkbox-item appearance' onchange='checkedItem(this)'/>";

let hasNextElement;
let square;

window.addEventListener("load", function () {
    hasNextElement = false;
    square = document.getElementsByClassName("square")[0];
    let title = document.getElementsByClassName("title")[0];
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
});

function checkedItem(checkBox) {
    checkBox.classList.toggle("appearance");
}

function nextElement(event) {
    if (!hasNextElement) {
        square.insertAdjacentHTML("beforeend", getPendingItem());
        
        let previousElement = event.target;
        previousElement.previousSibling.previousSibling.innerHTML = INPUT_CHECKBOX;
        hasNextElement = true;
    }
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        console.log("13");
    }
}

function getPendingItem() {
    let html = "";
    html += "<div class='item'>";
    html += "<span class='plus'>&#128930;</span>";
    html += "<div class='element' contenteditable='true' placeholder='Elemento de lista'></div>";
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