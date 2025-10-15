const { encrypt, decrypt } = require("../code");

exports.postEncrypt = (req, res, next) => {
    const { message, key, alphabet } = req.body;

    if (key.length > 6) {
        return res.render("index", {
            title: "Помилка",
            start: false,
            error: true,
            errorMessage: "Ключ не може бути довшим за 6 символів",
        });
    }

    const encrypted = encrypt(message, key, alphabet);

    console.log(encrypted.matrix);

    res.render("polEnc", {
        title: "Зашифровано",
        encrypted: encrypted.encrypted,
        rows: encrypted.rows,
        cols: encrypted.cols,
        matrix: encrypted.matrix,
        alphabet,
        key,
        error: false,
    });
};

exports.postDecrypt = (req, res, next) => {
    const { message, key, alphabet } = req.body;

    if (key.length > 6) {
        return res.render("polEnc", {
            title: "Помилка",
            start: false,
            error: true,
            errorMessage: "Ключ не може бути довшим за 6 символів",
        });
    }

    const decrypted = decrypt(message, key, alphabet);

    console.log(decrypted.matrix);

    res.render("index", {
        title: "Розшифровано",
        start: false,
        decrypted: decrypted.decrypted,
        rows: decrypted.rows,
        cols: decrypted.cols,
        matrix: decrypted.matrix,
        key,
        error: false,
    });
};
