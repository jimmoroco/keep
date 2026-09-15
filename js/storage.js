// storage.js — capa de persistencia (localStorage)
//
// Solo lee y escribe. No conoce el estado ni la UI.
// Toda la lógica de negocio vive en state.js.

const STORAGE_KEY = "keep_squares";

// ── Carga ───────────────────────────────────────────────────────

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        // JSON corrupto: intentar migración del formato legacy
        return null;
    }
}

// ── Persistencia ────────────────────────────────────────────────

function persist(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Migración del formato legacy ────────────────────────────────
//
// Formato viejo: múltiples claves "square-N" con valores "título¬checked¬texto¬..."
// Lo leemos una sola vez y lo convertimos al nuevo formato unificado.

function migrateFromLegacy() {
    const countRaw = localStorage.getItem("qSquares");
    if (!countRaw) return null;

    const count = +countRaw;
    if (count === 0) return null;

    const squares = [];
    for (let i = 1; i <= count; i++) {
        const raw = localStorage.getItem(`square-${i}`);
        if (!raw) continue;

        // Si ya es JSON nuevo, parsearlo directo
        if (raw.startsWith("{")) {
            try {
                const parsed = JSON.parse(raw);
                squares.push({ id: i, ...parsed });
                continue;
            } catch { /* continúa con el formato viejo */ }
        }

        // Formato viejo: "título¬true¬texto¬false¬texto2"
        const parts = raw.split("¬");
        const items = [];
        for (let j = 1; j < parts.length; j += 2) {
            items.push({
                checked: parts[j] === "true",
                text: parts[j + 1] || ""
            });
        }
        squares.push({ id: i, title: parts[0], items });
    }

    if (squares.length === 0) return null;

    // Limpiar claves legacy del localStorage
    for (let i = 1; i <= count; i++) {
        localStorage.removeItem(`square-${i}`);
        localStorage.removeItem(`r-square-${i}`);
    }
    localStorage.removeItem("qSquares");

    return { squares };
}
