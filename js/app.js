// app.js — punto de entrada, inicialización

window.addEventListener("load", function () {
    // Inicializar qSquares si no existe
    if (localStorage.getItem("qSquares") === null) {
        setSquareCount(0);
    }

    initEvents();

    const squareCount = getSquareCount();
    if (squareCount > 0) {
        const divContainer = document.getElementById("div-container");
        for (let index = 1; index <= squareCount; index++) {
            renderSquareCard(divContainer, index);
        }
    }
});
