import Dice from "./Dice.js";
import { writeLine } from "./console/GameConsole.js";

export default class Game {
    constructor(config, gameConsole, security, fairNumberProtocol, helpProbability) {
        this.dices = config.dices;
        this.doLoop = true;
        this.console = gameConsole;
        this.security = security;
        this.fairNumberProtocol = fairNumberProtocol;
        this.helpProbability = helpProbability;
    }
    dices;
    doLoop;
    console;
    security;
    fairNumberProtocol;
    helpProbability;

    pickDice( isComputer = true, exceptDice = null) {
        const isFirst = exceptDice === null;
        const dices = Dice.getDicesExcept(this.dices,exceptDice);
        const selection = this.askToPickADice(dices, isComputer, isFirst);
        this.console.writeDiceWasPicked(dices[selection], isComputer, isFirst);
        return dices[selection];
    }
    askToPickADice(dices, isComputer, isFirst){
        return isComputer
            ? this.security.generateRandomNumber(0,dices.length - 1)
            : this.console.askPlayerToPickDice(dices, isFirst);
    }
    pickDices(isComputerFirst) {
        const firstDice = this.pickDice(isComputerFirst);
        const secondDice =  this.pickDice(!isComputerFirst, firstDice);

        return {
            player: isComputerFirst ? secondDice : firstDice,
            computer: isComputerFirst ? firstDice : secondDice,
        }
    }
    rollDice(dice, isComputer){
        this.console.writeTimeToRoll(isComputer);
        let fairNumber = this.fairNumberProtocol.getFairNumber();
        const rollResult = dice.roll(fairNumber);
        this.console.writeRollResult(isComputer, rollResult);
        return rollResult;
    }
    play(){
        const isComputerFirst = this.isComputerPicksFirst();
        const dices = this.pickDices(isComputerFirst);

        const computerRollResult = this.rollDice(dices.computer, true);
        const playerRollResult = this.rollDice(dices.player, false);

        const gameResult = this.getGameResult(playerRollResult, computerRollResult);
        this.console.writeGameResult(gameResult, playerRollResult, computerRollResult);

        this.console.anyKeyPress();
        return true;
    }
    getGameResult(playerRollResult, computerRollResult){
        return playerRollResult > computerRollResult
            ? GAME_RESULT.WIN
            : (playerRollResult < computerRollResult
                ? GAME_RESULT.LOST : GAME_RESULT.DRAW);
    }
    isComputerPicksFirst(){
        writeLine('Let\'s determine who makes the first move.');
        const computerSelection = this.security.generateRandomNumber(0,1);
        const verifiableValue = this.security.createVerifiableValue(computerSelection);
        this.console.writeComputerSelectedValue( verifiableValue, 1);
        const playerSelection =
            this.console.askPlayerRangeSelection('Try to guess my selection.', 1, HELP_FIST_STEP);
        this.console.writeComputerRevealValue(verifiableValue);
        return playerSelection !== computerSelection;
    }

}
const HELP_FIST_STEP = 'Enter 0 or 1.'
    + ' If you type the right number then you will choose dice first.'
    + ' Otherwise computer will chose first.';
export const GAME_RESULT = {
    WIN: 1,
    LOST: -1,
    DRAW: 0,
};