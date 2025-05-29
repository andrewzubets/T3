export default class VerifiableValue {
    constructor(value, verificationKey, hmacValue) {
        this.value = value;
        this.verificationKey = verificationKey;
        this.hmacValue = hmacValue;
    }
    value;
    verificationKey;
    hmacValue;
}