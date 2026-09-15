// app.js — punto de entrada
//
// Responsabilidades:
//   1. Cargar el estado desde localStorage (o migrar desde formato legacy)
//   2. Hacer el primer render
//   3. Inicializar los event listeners

window.addEventListener("load", function () {
    // Intentar cargar estado nuevo, luego legacy, luego estado vacío
    const saved = loadState() || migrateFromLegacy() || { squares: [] };

    // Hidratamos el estado global antes del primer render
    state = { ...initialState, ...saved };

    render(state);
    initEvents();
});
