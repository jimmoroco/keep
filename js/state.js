// state.js — estado central, reducer y dispatch
//
// El estado es la única fuente de verdad. El DOM y el localStorage
// son consecuencias del estado, nunca al revés.
//
// Flujo:
//   evento de usuario → dispatch(action) → reducer → nuevo estado → render + persist

// ── Estado inicial ──────────────────────────────────────────────

const initialState = {
    squares: []      // [{ id, title, items: [{ text, checked }] }]
};

let state = initialState;

// ── Acciones disponibles ────────────────────────────────────────

const Actions = {
    LOAD_SQUARES:  "LOAD_SQUARES",
    ADD_SQUARE:    "ADD_SQUARE",
    DELETE_SQUARE: "DELETE_SQUARE",
    TOGGLE_ITEM:   "TOGGLE_ITEM",
    DELETE_ITEM:   "DELETE_ITEM",
};

// ── Reducer — función pura, sin efectos secundarios ─────────────
//
// (state, action) → newState
// Nunca muta el estado recibido, siempre devuelve uno nuevo.

function reducer(currentState, action) {
    switch (action.type) {

        case Actions.LOAD_SQUARES:
            return { ...currentState, squares: action.squares };

        case Actions.ADD_SQUARE: {
            const newId = currentState.squares.length > 0
                ? Math.max(...currentState.squares.map(s => s.id)) + 1
                : 1;
            const newSquare = { id: newId, ...action.data };
            return { ...currentState, squares: [newSquare, ...currentState.squares] };
        }

        case Actions.DELETE_SQUARE:
            return {
                ...currentState,
                squares: currentState.squares.filter(s => s.id !== action.id)
            };

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

        default:
            return currentState;
    }
}

// ── Dispatch — único punto de entrada para cambios de estado ────
//
// Después de cada cambio: renderiza y persiste.
// Los efectos secundarios (DOM, localStorage) solo ocurren aquí.

function dispatch(action) {
    state = reducer(state, action);
    render(state);
    persist(state);
}

// ── Selector helper ─────────────────────────────────────────────

function getSquareById(id) {
    return state.squares.find(s => s.id === id) || null;
}
