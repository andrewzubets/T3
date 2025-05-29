import Dice from "./Dice.js";

const MINIMAL_DICES_LENGTH = 3;
const MINIMAL_DICE_SIDE_LENGTH = 6;
const INPUT_ARRAY_SEPARATOR = ',';

export default class GameConfig {
    constructor(data) {
        this.setDices(data);
    }
    dices;
    setDices(diceValues){
        if(diceValues.length < MINIMAL_DICES_LENGTH){
            throw new Error(`You must provide at least ${MINIMAL_DICES_LENGTH} dice sides.`);
        }
        this.dices = [];
        diceValues.forEach((diceValueRaw,diceIndex) => {
            const diceValue = diceValueRaw.split(INPUT_ARRAY_SEPARATOR);
            if(this.hasValidDiceSideValues(diceValue,diceIndex)){
                this.dices.push(new Dice(diceValue));
            }
        });
    }
    hasValidDiceSideValues(diceValue, diceIndex){
        if(diceValue.length < MINIMAL_DICE_SIDE_LENGTH){
            throw new Error(`Dice #${diceIndex + 1} values should be equal to ${MINIMAL_DICE_SIDE_LENGTH} or greater.`);
        }
        diceValue.forEach((diceSide,diceSideIndex) => {
            if(isNaN(diceSide) || diceSide <= 0){
                throw new Error(`Dice side #${diceSideIndex + 1} of #${diceIndex + 1} dice should be positive number.`);
            }
        });
        return true;
    }
    getDices(){
        return this.dices;
    }
}