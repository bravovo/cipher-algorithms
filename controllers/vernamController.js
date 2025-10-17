const { vernamEncrypt, vernamDecrypt } = require("../code");

exports.getVernamEncrypt = (req, res, next) => {
    res.render("vernamEnc", {
        title: "Шифр Вернама",
        error: false,
        errorMessage: "",
        decrypted: { decryptedText: null },
    });
};

exports.postVernamEncrypt = (req, res, next) => {
    const { key, message } = req.body;

    const encrypted = vernamEncrypt({ key, message });

    res.render("vernamDec", {
        title: "Зашифровано",
        error: false,
        errorMessage: "",
        encrypted,
        key,
    });
};

exports.postVernamDecrypt = (req, res, next) => {
    const { key, message } = req.body;

    const decrypted = vernamDecrypt({ key, messageBin: message });

    res.render("vernamEnc", {
        title: "Розшифровано",
        error: false,
        errorMessage: "",
        decrypted,
        key,
    });
};
