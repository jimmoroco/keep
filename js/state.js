// state.js — estado central, reducer y dispatch
//
// Flujo:
//   evento de usuario → dispatch(action) → reducer → nuevo estado → render + persist

// ── Estado inicial ──────────────────────────────────────────────

const initialState = {
    squares:       [],    // [{ id, title, items: [{ text, checked }] }]
    searchQuery:   "",    // texto de búsqueda activo
    lastDeleted:   null,  // { square, timestamp } — ventana de undo
};

let state = initialState;

// ── Acciones disponibles ────────────────────────────────────────

const Actions = Object.freeze({
    LOAD_SQUARES:    "LOAD_SQUARES",
    ADD_SQUARE:      "ADD_SQUARE",
    EDIT_SQUARE:     "EDIT_SQUARE",
    DELETE_SQUARE:   "DELETE_SQUARE",
    UNDO_DELETE:     "UNDO_DELETE",
    REORDER_SQUARES: "REORDER_SQUARES",
    TOGGLE_ITEM:     "TOGGLE_ITEM",
    DELETE_ITEM:     "DELETE_ITEM",
    SET_SEARCH:      "SET_SEARCH",
    TOGGLE_PIN:      "TOGGLE_PIN",
    SET_COLOR:       "SET_COLOR",
});

// ── Reducer — función pura, sin efectos secundarios ─────────────

function reducer(currentState, action) {
    switch (action.type) {

        case Actions.LOAD_SQUARES:
            return { ...currentState, squares: action.squares };

        case Actions.ADD_SQUARE: {
            const data = sanitizeSquareData(action.data);
            if (!isValidSquare(data)) return currentState;

            const newId = currentState.squares.length > 0
                ? Math.max(...currentState.squares.map(s => s.id)) + 1
                : 1;
            return {
                ...currentState,
                squares: [{ id: newId, pinned: false, ...data }, ...currentState.squares]
            };
        }

        case Actions.EDIT_SQUARE: {
            const data = sanitizeSquareData(action.data);
            if (!isValidSquare(data)) return currentState;

            const squares = currentState.squares.map(square =>
                square.id === action.id ? { ...square, ...data } : square
            );
            return { ...currentState, squares };
        }

        case Actions.DELETE_SQUARE: {
            const deleted = currentState.squares.find(s => s.id === action.id);
            return {
                ...currentState,
                squares:     currentState.squares.filter(s => s.id !== action.id),
                lastDeleted: deleted
                    ? { square: deleted, timestamp: Date.now() }
                    : currentState.lastDeleted,
            };
        }

        case Actions.UNDO_DELETE: {
            if (!currentState.lastDeleted) return currentState;

            const { square, timestamp } = currentState.lastDeleted;
            const expired = Date.now() - timestamp > Config.UNDO_WINDOW_MS;
            if (expired) return currentState;

            return {
                ...currentState,
                // Reinsertar en la posición original (al principio si no hay pista)
                squares:     [square, ...currentState.squares],
                lastDeleted: null,
            };
        }

        case Actions.REORDER_SQUARES:
            return { ...currentState, squares: action.squares };

        case Actions.TOGGLE_ITEM: {
            const squares = currentState.squares.map(square => {
                if (square.id !== action.squareId) return square;
                const items = square.items.map((item, i) =>
                    i === action.itemIndex ? { ...item, checked: !item.checked } : item
                );
                return { ...square, items };
            });
            return { ...currentState, squares };
        }

        case Actions.DELETE_ITEM: {
            const squares = currentState.squares.map(square => {
                if (square.id !== action.squareId) return square;
                const items = square.items.filter((_, i) => i !== action.itemIndex);
                return { ...square, items };
            });
            return { ...currentState, squares };
        }

        case Actions.SET_SEARCH:
            return { ...currentState, searchQuery: action.query };

        case Actions.TOGGLE_PIN: {
            const squares = currentState.squares.map(square =>
                square.id === action.id
                    ? { ...square, pinned: !square.pinned }
                    : square
            );
            return { ...currentState, squares };
        }

        case Actions.SET_COLOR: {
            const squares = currentState.squares.map(square =>
                square.id === action.id
                    ? { ...square, color: action.color }
                    : square
            );
            return { ...currentState, squares };
        }

        default:
            return currentState;
    }
}

// SET_SEARCH no persiste ni re-renderiza: es filtro de UI efímero.
// SET_COLOR en edición activa: persiste pero no re-renderiza (el panel se
// actualiza directamente en events.js para no destruir el formulario abierto).
function dispatch(action) {
    state = reducer(state, action);
    if (action.type === Actions.SET_SEARCH) return;
    if (action.type === Actions.SET_COLOR && action.skipRender) {
        persist(state);
        return;
    }
    render(state);
    persist(state);
}

// ── Validación y sanitización ───────────────────────────────────

function isValidSquare(data) {
    return data.title.trim() !== "" || data.items.length > 0;
}

function sanitizeSquareData(data) {
    return {
        title: data.title.slice(0, Config.MAX_TITLE_LENGTH).trim(),
        color: data.color || null,
        items: data.items
            .slice(0, Config.MAX_ITEMS_PER_NOTE)
            .map(item => ({
                ...item,
                text: item.text.slice(0, Config.MAX_ITEM_LENGTH).trim()
            }))
            .filter(item => item.text !== ""),
    };
}

// ── Selectores ──────────────────────────────────────────────────

function getSquareById(id) {
    return state.squares.find(s => s.id === id) || null;
}

function getVisibleSquares(currentState) {
    const query = currentState.searchQuery.trim().toLowerCase();
    const squares = query
        ? currentState.squares.filter(square =>
            square.title.toLowerCase().includes(query) ||
            square.items.some(item => item.text.toLowerCase().includes(query))
          )
        : currentState.squares;

    // Fijadas primero, luego el resto, conservando orden relativo en cada grupo
    return [
        ...squares.filter(s => s.pinned),
        ...squares.filter(s => !s.pinned),
    ];
}
