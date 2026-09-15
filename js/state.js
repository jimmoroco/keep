// state.js — estado central, reducer y dispatch
//
// Flujo:
//   evento de usuario → dispatch(action) → reducer → nuevo estado → render + persist

// ── Estado inicial ──────────────────────────────────────────────

const initialState = {
    squares:     [],   // [{ id, title, items: [{ text, checked }] }]
    searchQuery: ""    // texto de búsqueda activo
};

let state = initialState;

// ── Acciones disponibles ────────────────────────────────────────

const Actions = {
    LOAD_SQUARES:    "LOAD_SQUARES",
    ADD_SQUARE:      "ADD_SQUARE",
    EDIT_SQUARE:     "EDIT_SQUARE",
    DELETE_SQUARE:   "DELETE_SQUARE",
    REORDER_SQUARES: "REORDER_SQUARES",
    TOGGLE_ITEM:     "TOGGLE_ITEM",
    DELETE_ITEM:     "DELETE_ITEM",
    SET_SEARCH:      "SET_SEARCH",
};

// ── Reducer — función pura, sin efectos secundarios ─────────────

function reducer(currentState, action) {
    switch (action.type) {

        case Actions.LOAD_SQUARES:
            return { ...currentState, squares: action.squares };

        case Actions.ADD_SQUARE: {
            const newId = currentState.squares.length > 0
                ? Math.max(...currentState.squares.map(s => s.id)) + 1
                : 1;
            return {
                ...currentState,
                squares: [{ id: newId, ...action.data }, ...currentState.squares]
            };
        }

        case Actions.EDIT_SQUARE: {
            const squares = currentState.squares.map(square =>
                square.id === action.id
                    ? { ...square, ...action.data }
                    : square
            );
            return { ...currentState, squares };
        }

        case Actions.DELETE_SQUARE:
            return {
                ...currentState,
                squares: currentState.squares.filter(s => s.id !== action.id)
            };

        // action.squares es el array reordenado completo
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

        default:
            return currentState;
    }
}

// ── Dispatch ────────────────────────────────────────────────────
//
// SET_SEARCH no persiste: es UI efímera, no datos del usuario.

function dispatch(action) {
    state = reducer(state, action);
    render(state);
    if (action.type !== Actions.SET_SEARCH) {
        persist(state);
    }
}

// ── Selectores ──────────────────────────────────────────────────

function getSquareById(id) {
    return state.squares.find(s => s.id === id) || null;
}

function getVisibleSquares(currentState) {
    const query = currentState.searchQuery.trim().toLowerCase();
    if (!query) return currentState.squares;
    return currentState.squares.filter(square =>
        square.title.toLowerCase().includes(query) ||
        square.items.some(item => item.text.toLowerCase().includes(query))
    );
}
