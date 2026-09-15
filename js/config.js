// config.js — constantes de la aplicación
//
// Centralizar aquí evita magic strings dispersos por el código.
// Si algo cambia (clave de storage, duración de animación, etc.)
// se cambia en un solo lugar.

const Config = Object.freeze({

    // ── Storage ─────────────────────────────────────────────────
    STORAGE_KEY:         "keep_squares",
    STORAGE_KEY_LEGACY:  "qSquares",

    // ── UI ───────────────────────────────────────────────────────
    TOAST_DURATION_MS:   4000,    // duración del toast en pantalla
    UNDO_WINDOW_MS:      4000,    // ventana de tiempo para hacer undo
    ANIMATION_ENTER_MS:  300,     // duración del fade-in de tarjeta nueva

    // ── Validación ───────────────────────────────────────────────
    MAX_TITLE_LENGTH:    200,
    MAX_ITEM_LENGTH:     500,
    MAX_ITEMS_PER_NOTE:  100,

});
