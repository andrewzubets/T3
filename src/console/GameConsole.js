import {convertDiceToString} from "../Dice.js";
import {GAME_RESULT} from "../Game.js";
import readlineSync from "readline-sync";

export default class GameConsole {
    constructor(asker) {
        this.asker = asker;
    }
    asker;
    askPlayerSelection(question, options, helpMessage){
        return this.asker.askUser(question, options, helpMessage);
    }
    askPlayerRangeSelection(question, maxValue, helpMessage) {
        if(maxValue >= 9){
            throw new Error('askPlayerRangeSelection: maxValue exceeds 9 options.');
        }
        const options = Array(maxValue + 1)
            .fill(0).map((stub, index) => index);
        const selection = this.askPlayerSelection(question, options, helpMessage);
        return parseInt(selection);
    }
    askPlayerToPickDice(dices, isFirst) {
        const helpMessage = isFirst ? 'Select any dice.' : 'Select one of remaining dice.';
        if(isFirst){
            writeLine('You make the first move and choose a dice.');
        }
        return this.asker.askUser('Choose your dice:', dices.map(dice => {
            return convertDiceToString(dice);
        }), helpMessage);
    }
    writeComputerSelectedValue(verifiableValue, rangeMax) {
        const hmacValue = convertToColorMessage(verifiableValue.hmacValue, COLORS.CYAN);
        const range =  convertToColorMessage('0..' + rangeMax, COLORS.YELLOW);
        writeLine(`I selected a random value in the range ${range} (HMAC=${hmacValue}).`);
    }
    writeComputerRevealValue(verifiableValue, selectionWord = 'selection:') {
        const keyValue = convertToColorMessage(verifiableValue.verificationKey, COLORS.GREEN);
        const value = convertToColorMessage(verifiableValue.value, COLORS.YELLOW);
        writeLine(`My ${selectionWord} ${value} (KEY=${keyValue}).`);
    }
    writeFairNumberGenerationResult(computerNumber, playerNumber, fairNumber){
        writeLine('The fair number generation result is '
            + convertToColorMessage(
                `${computerNumber} + ${playerNumber} = ${fairNumber}`, COLORS.YELLOW)
            + ' (mod 6).'
        );
    }
    writeDiceWasPicked(dice, isComputer, isFirst = true) {
        const diceStr = convertToColorMessage(convertDiceToString(dice), COLORS.YELLOW);
        if(isComputer){
            const move = isFirst ? 'first' : 'second';
            writeLine(`I make the ${move} move and choose the ${diceStr} dice.`);
        }else{
            writeLine(`You choose the ${diceStr} dice.`);
        }
    }
    writeTimeToRoll(isComputer){
        writeLine(isComputer
            ? 'It\'s time for my roll.'
            : 'It\'s time for your roll.'
        );
    }
    writeRollResult(isComputer, rollResult) {
        const formattedRollResult = convertToColorMessage(rollResult, COLORS.YELLOW);
        writeLine(isComputer
            ? `My roll result is ${formattedRollResult}.`
            : `Your roll result is ${formattedRollResult}.`
        );
    }
    writeGameResult(gameResult, playerRollResult, computerRollResult){
        writeLine('\n-');
        if(gameResult === GAME_RESULT.WIN){
            writeLine(`You win (${playerRollResult} > ${computerRollResult})!`,COLORS.GREEN);
        }
        else
        if(gameResult === GAME_RESULT.LOST){
            writeLine(`You lost (${playerRollResult} < ${computerRollResult})!`,COLORS.RED);
        }
        else
        if(gameResult === GAME_RESULT.DRAW) {
            writeLine('It\'s draw!',COLORS.YELLOW);
        }
        writeLine('-');
    }
    anyKeyPress(){
        readlineSync.keyInPause( convertToColorMessage('\nPress any key to continue...\n', COLORS.CYAN),{
            guide: false
        });

    }
}

export const COLORS = {
    DEFAULT: 0,
    RED: 31,
    GREEN: 32,
    BLUE: 34,
    YELLOW: 33,
    CYAN: 36,
    BG_RED: 41,
    BG_GREEN: 42,
    BG_YELLOW: 43,
};

const CONSOLE_SELECTION_COLOR = COLORS.YELLOW;

export const convertToColorMessage = (message, color = COLORS.DEFAULT) => {
    return color === COLORS.DEFAULT
        ? message
        : `\x1b[${color}m${message}\x1b[0m`;
};
export const writeLine = (line = '', color = COLORS.DEFAULT) => {
    console.log(convertToColorMessage(line, color));
};
export const writeError = (message) => {
    console.error( convertToColorMessage('Error: ', COLORS.RED)
        + message);
}