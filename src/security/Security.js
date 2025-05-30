import crypto  from 'node:crypto';
import VerifiableValue from "./VerifiableValue.js";

export default class Security {
    generateRandomNumber(min,max){
        return crypto.randomInt(min, max);
    }
    generateVerificationKey(){
        return crypto.randomBytes(32).toString('hex');
    }
    evaluateHmac3_256(key, message) {
        const hmac = crypto.createHmac('sha3-256', key);
        hmac.update(message.toString());
        return hmac.digest('hex');
    }
    createVerifiableValue(value) {
        const verificationKey = this.generateVerificationKey();
        const hmacValue = this.evaluateHmac3_256(verificationKey, value);
        return new VerifiableValue(value, verificationKey, hmacValue);
    }
}