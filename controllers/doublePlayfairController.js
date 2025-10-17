const { doublePlayfairEncrypt, doublePlayfairDecrypt } = require("../code");

exports.getDoublePlayfair = (req, res, next) => {
    res.render("doubleEnc", {
        title: "Подвійний квадрат Полібія",
        decrypted: null,
        error: false,
    });
};

exports.postEncrypt = (req, res, next) => {
    const { key1, key2, message, alphabet } = req.body;
    const result = doublePlayfairEncrypt({ key1, key2, message, alphabet });

    res.render("doubleDec", {
        title: "Зашифровано",
        key1,
        key2,
        alphabet,
        encrypted: result.encrypted,
        matrix1: result.matrix1,
        matrix2: result.matrix2,
        error: false,
        errorMessage: "",
    });
};

exports.postDecrypt = (req, res, next) => {
    const { key1, key2, message, alphabet } = req.body;
    const result = doublePlayfairDecrypt({ key1, key2, message, alphabet });

    res.render("doubleEnc", {
        title: "Розшифровано",
        key1,
        key2,
        decrypted: result.decrypted,
        matrix1: result.matrix1,
        matrix2: result.matrix2,
        error: false,
        errorMessage: "",
    });
};
