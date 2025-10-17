const UKR_ALPHABET = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";

const ENG_ALPHABET = "abcdefghijklmnopqrstuvwxyz";

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

function doublePlayfairEncrypt(toEncrypt) {
    const { key1, key2, message, alphabet } = toEncrypt;

    console.log(key1, key2);

    const matrix1 = square(key1, alphabet);
    const matrix2 = square(key2, alphabet);

    const noSpacesMessage = message.split(" ").join("");

    const array = [];
    let index = 0;
    while (index < noSpacesMessage.length) {
        const firstLetter = noSpacesMessage.charAt(index);
        let secondLetter;
        if (alphabet === "eng") {
            secondLetter =
                index + 1 === noSpacesMessage.length
                    ? noSpacesMessage.charAt(index + 1) === "x"
                        ? "q"
                        : "x"
                    : noSpacesMessage.charAt(index + 1);

            // if (firstLetter === secondLetter) {
            //     if (firstLetter === "x") {
            //         array.push(`${firstLetter}q`);
            //     } else {
            //         array.push(`${firstLetter}x`);
            //     }
            //     index++;
            // } else {
            array.push(`${firstLetter}${secondLetter}`);
            index += 2;
            // }
        } else {
            secondLetter =
                index + 1 === noSpacesMessage.length
                    ? noSpacesMessage.charAt(index + 1) === "х"
                        ? "й"
                        : "х"
                    : noSpacesMessage.charAt(index + 1);

            // if (firstLetter === secondLetter) {
            //     if (firstLetter === "х") {
            //         array.push(`${firstLetter}й`);
            //     } else {
            //         array.push(`${firstLetter}х`);
            //     }
            //     index++;
            // } else {
            array.push(`${firstLetter}${secondLetter}`);
            index += 2;
            // }
        }
    }

    const map1 = new Map();
    const map2 = new Map();
    for (let i = 0; i < matrix1.rows; i++) {
        for (let j = 0; j < matrix1.cols; j++) {
            const char1 = matrix1.matrix[i][j].toLowerCase();
            const char2 = matrix2.matrix[i][j].toLowerCase();
            if (char1) map1.set(char1, [i, j]);
            if (char2) map2.set(char2, [i, j]);
            if (char1 === "i") {
                map1.set("j", [i, j]);
            }
            if (char2 === "i") {
                map2.set("j", [i, j]);
            }
        }
    }

    const encryptedArray = [];
    for (let i = 0; i < array.length; i++) {
        const char1 = array[i][0];
        const char2 = array[i][1];
        const mappedChar1 = map1.get(char1);
        const mappedChar2 = map2.get(char2);

        if (mappedChar1[0] === mappedChar2[0]) {
            encryptedArray.push(`${char2}${char1}`);
        } else {
            const encryptedChar1 =
                matrix2.matrix[mappedChar1[0]][mappedChar2[1]];
            const encryptedChar2 =
                matrix1.matrix[mappedChar2[0]][mappedChar1[1]];

            encryptedArray.push(`${encryptedChar1}${encryptedChar2}`);
        }
    }

    console.log(array);
    console.log(encryptedArray);
    console.log(matrix1.matrix);
    console.log(matrix2.matrix);

    // console.log(
    //     "DECRYPTING",
    //     doublePlayfairDecrypt({
    //         key1,
    //         key2,
    //         message: encryptedArray.join(""),
    //         alphabet,
    //     })
    // );

    return { encrypted: encryptedArray.join(""), matrix1, matrix2 };
}

function doublePlayfairDecrypt(toDecrypt) {
    const { key1, key2, message, alphabet } = toDecrypt;

    console.log(key1, key2);

    const matrix1 = square(key1, alphabet);
    const matrix2 = square(key2, alphabet);

    const noSpacesMessage = message.split(" ").join("");

    const array = [];
    let index = 0;
    while (index < noSpacesMessage.length) {
        const firstLetter = noSpacesMessage.charAt(index);
        let secondLetter;
        if (alphabet === "eng") {
            secondLetter =
                index + 1 === noSpacesMessage.length
                    ? noSpacesMessage.charAt(index + 1) === "x"
                        ? "q"
                        : "x"
                    : noSpacesMessage.charAt(index + 1);

            // if (firstLetter === secondLetter) {
            //     if (firstLetter === "x") {
            //         array.push(`${firstLetter}q`);
            //     } else {
            //         array.push(`${firstLetter}x`);
            //     }
            //     index++;
            // } else {
            array.push(`${firstLetter}${secondLetter}`);
            index += 2;
            // }
        } else {
            secondLetter =
                index + 1 === noSpacesMessage.length
                    ? noSpacesMessage.charAt(index + 1) === "х"
                        ? "й"
                        : "х"
                    : noSpacesMessage.charAt(index + 1);

            // if (firstLetter === secondLetter) {
            //     if (firstLetter === "х") {
            //         array.push(`${firstLetter}й`);
            //     } else {
            //         array.push(`${firstLetter}х`);
            //     }
            //     index++;
            // } else {
            array.push(`${firstLetter}${secondLetter}`);
            index += 2;
            // }
        }
    }

    const map1 = new Map();
    const map2 = new Map();
    for (let i = 0; i < matrix1.rows; i++) {
        for (let j = 0; j < matrix1.cols; j++) {
            const char1 = matrix1.matrix[i][j].toLowerCase();
            const char2 = matrix2.matrix[i][j].toLowerCase();
            if (char1) map1.set(char1, [i, j]);
            if (char2) map2.set(char2, [i, j]);
            if (char1 === "i") {
                map1.set("j", [i, j]);
            }
            if (char2 === "i") {
                map2.set("j", [i, j]);
            }
        }
    }

    const decryptedArray = [];
    for (let i = 0; i < array.length; i++) {
        const char1 = array[i][0];
        const char2 = array[i][1];
        const mappedChar1 = map2.get(char1);
        const mappedChar2 = map1.get(char2);

        if (mappedChar1[0] === mappedChar2[0]) {
            decryptedArray.push(`${char2}${char1}`);
        } else {
            const encryptedChar1 =
                matrix1.matrix[mappedChar1[0]][mappedChar2[1]];
            const encryptedChar2 =
                matrix2.matrix[mappedChar2[0]][mappedChar1[1]];

            decryptedArray.push(`${encryptedChar1}${encryptedChar2}`);
        }
    }

    console.log(array);
    console.log(decryptedArray);
    console.log(matrix1.matrix);
    console.log(matrix2.matrix);
    return { decrypted: decryptedArray.join(""), matrix1, matrix2 };
}

function textToBinary(text) {
    return text
        .split("")
        .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
        .join("");
}

function binaryToText(binary) {
    const bytes = binary.match(/.{1,8}/g) || [];
    return bytes.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}

function vernamEncrypt(toEncrypt) {
    const { key, message } = toEncrypt;

    const textBin = textToBinary(message);
    const keyBin = textToBinary(key).slice(0, textBin.length);

    let encryptedBin = "";
    for (let i = 0; i < textBin.length; i++) {
        let b = textBin[i] ^ keyBin[i];
        encryptedBin += b.toString();
    }

    console.log(encryptedBin);
    return { encryptedBin, textBin, keyBin };
}

function vernamDecrypt(toDecrypt) {
    const { key, messageBin } = toDecrypt;
    const keyBin = textToBinary(key).slice(0, messageBin.length);

    let textBin = "";
    for (let i = 0; i < messageBin.length; i++) {
        textBin += (messageBin[i] ^ keyBin[i]).toString();
    }

    return { decryptedText: binaryToText(textBin), keyBin, textBin };
}

module.exports = {
    square,
    encrypt,
    decrypt,
    gronsfeld,
    getKeys,
    doublePlayfairEncrypt,
    doublePlayfairDecrypt,
    vernamEncrypt,
    vernamDecrypt,
};
