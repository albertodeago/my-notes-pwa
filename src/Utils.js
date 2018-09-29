let instance = null;

class Utils {
    constructor() {
        if (!instance) {
           instance = this;
        }

        return instance;
    }

    getRandomString(possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', length = 6) {
        let str = ''
        for (let i = 0; i < length; i++)
            str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

        return str;
    }

    b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
        }));
    }
}

export default new Utils();