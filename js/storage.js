// storage.js — capa de persistencia (localStorage)
//
// Solo lee y escribe. No conoce el estado ni la UI.
// Toda la lógica de negocio vive en state.js.

// ── Carga ───────────────────────────────────────────────────────

function loadState() {
    let raw;
    try {
        raw = localStorage.getItem(Config.STORAGE_KEY);
    } catch (e) {
        // localStorage no disponible (modo privado bloqueado, etc.)
        console.warn("Keep: localStorage no disponible.", e);
        return null;
    }

    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch (e) {
        // JSON corrupto: loguear y descartar para no bloquear la app
        console.warn("Keep: estado corrupto en localStorage, descartando.", e);
        try {
            // Guardar copia de respaldo antes de descartar
            localStorage.setItem(`${Config.STORAGE_KEY}_corrupted`, raw);
            localStorage.removeItem(Config.STORAGE_KEY);
        } catch { /* si tampoco se puede escribir, ignorar */ }
        return null;
    }
}

// ── Persistencia ────────────────────────────────────────────────

function persist(state) {
    try {
        localStorage.setItem(Config.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        if (e.name === "QuotaExceededError") {
            showToast("Sin espacio para guardar. Elimina algunas notas.", "error");
        } else {
            console.warn("Keep: no se pudo persistir el estado.", e);
        }
    }
}

// ── Migración del formato legacy ────────────────────────────────
//
// Formato viejo: múltiples claves "square-N" con valores "título¬checked¬texto¬..."
// Se ejecuta una sola vez y luego limpia las claves antiguas.

function migrateFromLegacy() {
    let countRaw;
    try {
        countRaw = localStorage.getItem(Config.STORAGE_KEY_LEGACY);
    } catch {
        return null;
    }

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
            } catch { /* continúa con el parseo legacy */ }
        }

        // Formato viejo: "título¬true¬texto¬false¬texto2"
        const parts = raw.split("¬");
        const items = [];
        for (let j = 1; j < parts.length; j += 2) {
            items.push({
                checked: parts[j] === "true",
                text:    parts[j + 1] || ""
            });
        }
        squares.push({ id: i, title: parts[0], items });
    }

    if (squares.length === 0) return null;

    // Limpiar claves legacy
    try {
        for (let i = 1; i <= count; i++) {
            localStorage.removeItem(`square-${i}`);
            localStorage.removeItem(`r-square-${i}`);
        }
        localStorage.removeItem(Config.STORAGE_KEY_LEGACY);
    } catch { /* si falla la limpieza, no es crítico */ }

    return { squares };
}
