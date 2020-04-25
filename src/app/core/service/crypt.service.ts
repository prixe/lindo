const crypto = cryptoLib;
const algorithm = 'aes-256-ctr';

export class CryptService {
    public encrypt(text: string, password: string) {
        let cipher = crypto.createCipher(algorithm, password);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
    }

    public decrypt(text: string, password: string) {
        let decipher = crypto.createDecipher(algorithm, password);
        let dec = decipher.update(text, 'hex', 'utf8');

        dec += decipher.final('utf8');

        return dec;
    }

    public createHash(text: string) {
        return crypto.createHash('sha512').update('lindo' + text).digest("hex");
    }

    public createHashMd5(text: string) {
        return crypto.createHash('md5').update(text).digest("hex");
    }
}
