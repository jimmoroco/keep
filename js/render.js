// render.js — construcción y manipulación del DOM

function renderSquareCard(divContainer, index) {
    const data = getSquareData(index);
    if (!data) return;

    const pendingItems = data.items.filter(item => !item.checked);
    const doneItems = data.items.filter(item => item.checked);

    const doneSection = doneItems.length > 0 ? `
        <hr id="hr-n" class="no-edit" data-id="${index}">
        <div id="div-done" class="square-done no-edit" data-id="${index}">
            ${doneItems.map(item => renderCardItem(index, item.text, true)).join("")}
        </div>` : "";

    const html = `
        <div class="square cursor-hand no-edit square-${index}"
             id="square-${index}"
             data-id="${index}"
             readonly>
            <div id="div-pending" class="square-pending no-edit" data-id="${index}">
                <div id="input-title-square-${index}"
                     class="no-edit title cursor-hand"
                     data-id="${index}"
                     disabled>
                    ${data.title}
                </div>
                ${pendingItems.map(item => renderCardItem(index, item.text, false)).join("")}
            </div>
            ${doneSection}
            <div class="trash no-edit"
                 onmouseenter="enterTrash(this)"
                 onmouseleave="leaveTrash(this)">
                <span style="visibility:hidden"
                      onclick="deleteSquare(this)">&#128465</span>
            </div>
        </div>`;

    divContainer.insertAdjacentHTML("afterbegin", html);
}

function renderCardItem(index, text, checked) {
    const lineThrough = checked ? "line-through" : "";
    const disabledAttr = checked ? "disabled checked" : "";
    return `
        <div class="item no-edit" data-id="${index}">
            <span class="plus" data-id="${index}">
                <input type="checkbox"
                       class="checkbox-item cursor-hand appearance"
                       data-id="${index}"
                       ${disabledAttr}>
            </span>
            <div disabled class="no-edit element cursor-hand ${lineThrough}" data-id="${index}">
                ${text}
            </div>
        </div>`;
}

function renderEditPanel(squareId) {
    return `
        <div id="div-square-edit" class="square-edit edit">
            <div id="div-pending" class="square-pending edit">
                <div id="input-title-${squareId}"
                     class="title edit"
                     placeholder="Título"
                     contenteditable="true"
                     onkeypress="onTitleKeyPress(event, ${squareId}, 0);">
                </div>
                <div id="div-item-${squareId}-0"
                     class="item edit"
                     onmouseenter="onMouseEnterItem(this)"
                     onmouseleave="onMouseLeaveItem(this)"
                     draggable="true">
                    <span class="ghost mover edit"
                          style="visibility:hidden;"
                          onclick="moveItem(this)">&#8801</span>
                    <span class="plus edit">+</span>
                    <div id="input-element-${squareId}-0"
                         class="element edit"
                         contenteditable="true"
                         placeholder="Elemento de lista"
                         data-has-next-element="0"
                         onkeypress="onItemKeyPress(event, 0, 1);"
                         onfocusin="onFocusInInput(this)"
                         onfocusout="onFocusOutInput(this)">
                    </div>
                    <span class="ghost close cursor-hand hidden edit"
                          onclick="deleteItem(this)"
                          onmouseenter="onMouseEnterSpan(true)"
                          onmouseleave="onMouseEnterSpan(false)">x</span>
                </div>
            </div>
            <div id="div-done" class="square-done edit"></div>
        </div>`;
}

function renderNewListItem(squareId, elementId) {
    return `
        <div id="div-item-${squareId}-${elementId}"
             class="item edit"
             onmouseenter="onMouseEnterItem(this)"
             onmouseleave="onMouseLeaveItem(this)"
             draggable="true">
            <span class="ghost mover edit"
                  style="visibility:hidden;"
                  onclick="moveItem(this)">&#8801</span>
            <span class="plus edit">+</span>
            <div id="input-element-${squareId}-${elementId}"
                 class="element edit"
                 contenteditable="true"
                 placeholder="Elemento de lista"
                 data-has-next-element="0"
                 onkeypress="onItemKeyPress(event, ${squareId}, ${elementId + 1});"
                 onfocusin="onFocusInInput(this)"
                 onfocusout="onFocusOutInput(this)">
            </div>
            <span class="ghost close cursor-hand hidden edit"
                  onclick="deleteItem(this)"
                  onmouseenter="onMouseEnterSpan(true)"
                  onmouseleave="onMouseEnterSpan(false)">x</span>
        </div>`;
}

function renderCheckbox() {
    return `<input type="checkbox"
                   class="checkbox-item cursor-hand appearance edit"
                   onchange="checkedItem(this)"/>`;
}
