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

    // ── Paleta de colores de tarjetas ────────────────────────────
    // Misma paleta que Google Keep, adaptada al tema oscuro.
    // null = sin color (fondo por defecto)
    CARD_COLORS: [
        { id: "default",  label: "Predeterminado", value: null        },
        { id: "red",      label: "Rojo",           value: "#5c2b29"   },
        { id: "orange",   label: "Naranja",         value: "#614a19"   },
        { id: "yellow",   label: "Amarillo",        value: "#635d19"   },
        { id: "green",    label: "Verde",           value: "#345920"   },
        { id: "teal",     label: "Verde azulado",   value: "#16504b"   },
        { id: "blue",     label: "Azul",            value: "#2d555e"   },
        { id: "darkblue", label: "Azul oscuro",     value: "#1e3a5f"   },
        { id: "purple",   label: "Morado",          value: "#42275e"   },
        { id: "pink",     label: "Rosa",            value: "#5b2245"   },
        { id: "brown",    label: "Marrón",          value: "#442f19"   },
        { id: "gray",     label: "Gris",            value: "#3c3f43"   },
    ],

});
