import Dice from "./Dice.js";

const MINIMAL_DICES_QUANTITY = 3;
const MINIMAL_DICE_VALUES_QUANTITY = 6;
const INPUT_ARRAY_SEPARATOR = ',';

export default class GameConfig {
    constructor(data) {
        this.setDices(data);
    }
    dices;
    setDices(diceValues){
        if(diceValues.length < MINIMAL_DICES_QUANTITY){
            throw new Error(`You must provide at least ${MINIMAL_DICES_QUANTITY} dices.`);
        }
        let dices = [];
        diceValues.forEach((diceValueRaw,diceIndex) => {
            const diceValue = diceValueRaw.split(INPUT_ARRAY_SEPARATOR);
            if(this.hasValidDiceSideValues(diceValue,diceIndex)){
                dices.push(new Dice(diceValue));
            }
        });
        if(this.hasValidSideValuesLength(dices)){
            this.dices = dices;
        }
    }
    hasValidSideValuesLength(dices) {
        let diceSideMaxLength = MINIMAL_DICE_VALUES_QUANTITY;
        dices.forEach(dice => {
            diceSideMaxLength = dice.sideValues.length > diceSideMaxLength
                ? dice.sideValues.length: diceSideMaxLength
        });
        if(!dices.every(dice => dice.sideValues.length === diceSideMaxLength)){
            throw new Error(`Dice side values quantity should be equal`);
        }
        return true;
    }
    hasValidDiceSideValues(diceValue, diceIndex){
        if(diceValue.length < MINIMAL_DICE_VALUES_QUANTITY){
            throw new Error(`Dice #${diceIndex + 1} value quantity should be equal to ${MINIMAL_DICE_VALUES_QUANTITY} or greater.`);
        }
        diceValue.forEach((diceSide,diceSideIndex) => {
            if(isNaN(diceSide) || diceSide <= 0){
                throw new Error(`Dice side #${diceSideIndex + 1} of #${diceIndex + 1} dice should be positive number.`);
            }
        });
        return true;
    }
}