const UKR_ALPHABET = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";
const UKR_ALPHABET_LEN = UKR_ALPHABET.length;

const ENG_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const ENG_ALPHABET_LEN = ENG_ALPHABET.length;

function getKeys(key) {
    const keys = [];
    while (key > 0) {
        keys.unshift(key % 10);
        key = Math.floor(key / 10);
    }
    return keys;
}

function gronsfeld(key, message, decode = false, alphabet = UKR_ALPHABET) {
    const len = alphabet.length;
    message = message.toLowerCase().split(" ").join("");

    if (key < 0) {
        return null;
    }

    const rawKeys = getKeys(key);

    let encoded = "";
    const keys = [];
    for (let i = 0; i < message.length; i++) {
        let letterIndex = alphabet.indexOf(message[i]);
        if (letterIndex !== -1) {
            const shiftIndex = i % rawKeys.length;
            const shift = rawKeys[shiftIndex];
            keys.push(rawKeys[shiftIndex]);
            let calc = decode ? letterIndex - shift : letterIndex + shift;

            if (calc >= len) calc -= len;
            if (calc < 0) calc += len;

            encoded += alphabet[calc];
        } else {
            encoded += message[i];
        }
    }
    return { encoded, keys, rawKeys };
}

// console.log(Gronsfeld(13579, "hhwtjob", true, ENG_ALPHABET));
// console.log(Gronsfeld(21, "я,а"));

function square(key, alphabet) {
    const lang = alphabet === "eng" ? ENG_ALPHABET : UKR_ALPHABET;
    const cols = key.length;
    const rows =
        alphabet === "eng"
            ? Math.ceil((lang.length - 1) / cols)
            : Math.ceil(lang.length / cols);
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(" "));

    let index = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (lang[index] === "j") {
                index++;
                col--;
                continue;
            }
            if (row === 0) {
                matrix[row][col] = key[col];
            } else {
                if (key.includes(lang[index])) {
                    col--;
                } else {
                    matrix[row][col] = lang[index] ?? " ";
                }
                index++;
            }
        }
    }

    return { matrix, cols, rows };
}

/*
function encrypt(message, key) { 
    message = message.toLowerCase(); 
    const { matrix, cols, rows } = square(key); 
    let encrypted = ""; 
    for (let char of message) { 
        if (char === " ") { 
            encrypted += char; continue; 
        } 
        for (let i = 0; i < rows; i++) { 
            for (let j = 0; j < cols; j++) { 
                if (char === matrix[i][j]) { 
                    if (i + 1 < rows) { 
                        encrypted += matrix[i + 1][j]; 
                    } else { 
                        encrypted += matrix[0][j]; 
                    }
                } 
            } 
        } 
    } 
    return { encrypted, matrix, cols, rows }; 
}
*/

function encrypt(message, key, alphabet) {
    message = message.toLowerCase();
    const { matrix, cols, rows } = square(key, alphabet);

    const map = new Map();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const char = matrix[i][j].toLowerCase();
            if (char) map.set(char, [i, j]);
            if (char === "i") {
                map.set("j", [i, j]);
            }
        }
    }

    let encrypted = "";
    for (const char of message) {
        if (char === " ") {
            encrypted += " ";
            continue;
        }

        const pos = map.get(char);
        if (!pos) {
            encrypted += char;
            continue;
        }

        const [i, j] = pos;
        const nextRow = (i + 1) % rows;
        encrypted += matrix[nextRow][j];
    }

    return { encrypted, matrix, cols, rows };
}
function decrypt(message, key, alphabet) {
    message = message.toLowerCase();
    const { matrix, cols, rows } = square(key, alphabet);

    const map = new Map();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const char = matrix[i][j].toLowerCase();
            if (char) map.set(char, [i, j]);
            if (char === "i") {
                map.set("j", [i, j]);
            }
        }
    }
    console.log(map.get(" "));

    let decrypted = "";
    for (const char of message) {
        if (char === " ") {
            decrypted += " ";
            continue;
        }

        const pos = map.get(char);
        if (!pos) {
            decrypted += char;
            continue;
        }

        const [i, j] = pos;
        const nextRow = (i - 1 + rows) % rows;
        decrypted += matrix[nextRow][j];
    }

    return { decrypted, matrix, cols, rows };
}

module.exports = { square, encrypt, decrypt, gronsfeld, getKeys };
