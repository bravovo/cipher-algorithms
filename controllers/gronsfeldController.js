const { gronsfeld } = require("../code");

const UKR_ALPHABET = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";

const ENG_ALPHABET = "abcdefghijklmnopqrstuvwxyz";

exports.getEncrypt = (req, res, next) => {
    res.render("gronEnc", {
        error: false,
        title: "Гронсфельд",
        decrypted: undefined,
    });
};

exports.postEncrypt = (req, res, next) => {
    const { message, key, alphabet } = req.body;

    const {
        encoded: encrypted,
        keys,
        rawKeys,
    } = gronsfeld(
        +key,
        message,
        false,
        alphabet === "ua"
            ? UKR_ALPHABET
            : alphabet === "eng"
            ? ENG_ALPHABET
            : undefined
    );

    res.render("gronDec", {
        title: "Зашифровано",
        encrypted,
        keys,
        rawKeys,
        error: false,
        alphabet,
    });
};

exports.postDecrypt = (req, res, next) => {
    const { message, key, alphabet } = req.body;

    const {
        encoded: decrypted,
        keys,
        rawKeys,
    } = gronsfeld(
        +key,
        message,
        true,
        alphabet === "ua"
            ? UKR_ALPHABET
            : alphabet === "eng"
            ? ENG_ALPHABET
            : undefined
    );

    res.render("gronEnc", {
        title: "Розшифровано",
        decrypted,
        keys,
        rawKeys,
        error: false,
        alphabet,
    });
};
