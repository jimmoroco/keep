// storage.js — capa de persistencia (localStorage)

const STORAGE_KEY_COUNT = "qSquares";

function getSquareCount() {
    const count = localStorage.getItem(STORAGE_KEY_COUNT);
    return count ? +count : 0;
}

function setSquareCount(count) {
    localStorage.setItem(STORAGE_KEY_COUNT, count);
}

function getSquareData(index) {
    const raw = localStorage.getItem(`square-${index}`);
    if (!raw) return null;

    // Soporte para formato legacy (separador ¬) y nuevo formato JSON
    if (raw.startsWith("{")) {
        return JSON.parse(raw);
    }

    // Migración del formato legacy al vuelo
    return migrateLegacyFormat(raw);
}

function saveSquareData(index, data) {
    localStorage.setItem(`square-${index}`, JSON.stringify(data));
}

function deleteSquareData(index) {
    const data = localStorage.getItem(`square-${index}`);
    if (data) {
        // Guardamos copia de respaldo con prefijo r-
        localStorage.setItem(`r-square-${index}`, data);
    }
    localStorage.removeItem(`square-${index}`);
}

// Migración del formato viejo: "título¬true¬texto¬false¬texto2"
function migrateLegacyFormat(raw) {
    const parts = raw.split("¬");
    const items = [];
    for (let i = 1; i < parts.length; i += 2) {
        items.push({
            checked: parts[i] === "true",
            text: parts[i + 1] || ""
        });
    }
    return {
        title: parts[0],
        items
    };
}
