import { Injectable } from "@angular/core";
const algorithm = 'aes-256-ctr';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';

@Injectable()
export class CryptService {
    public encrypt(text: string, password: string) {
        let cipher = createCipheriv(algorithm, password, null);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
    }

    public decrypt(text: string, password: string) {
        let decipher = createDecipheriv(algorithm, password, null);
        let dec = decipher.update(text, 'hex', 'utf8');

        dec += decipher.final('utf8');

        return dec;
    }

    public createHash(text: string) {
        return createHash('sha512').update('lindo' + text).digest("hex");
    }

    public createHashMd5(text: string) {
        return createHash('md5').update(text).digest("hex");
    }
}
