
export default class Dice {
    constructor(sideValues) {
        this.sideValues = sideValues.map(sideValue => parseInt(sideValue));
    }
    sideValues;

    static getDicesExceptForIndex(dices, diceIndex) {
        return dices.slice(0, diceIndex).concat(dices.slice(diceIndex + 1));
    }
    static getDicesExcept(dices, exceptDice = null) {
        return exceptDice instanceof Dice
            ? this.getDicesExceptForIndex(dices, dices.indexOf(exceptDice))
            : dices;
    }
    roll(number) {
        return this.sideValues[number];
    }
    forEachValue(callback) {
        return this.sideValues.forEach(callback);
    }
}


export const convertDiceToString = (dice, withBrackets = true) => {
    const stringValue = dice.sideValues.toString();
    return withBrackets ? '[' + stringValue + ']' : stringValue;
};
