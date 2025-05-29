import {convertDiceToString} from "../Dice.js";
import {AlignmentEnum, AsciiTable3} from "ascii-table3";
import {COLORS, convertToColorMessage} from "./GameConsole.js";

export default class HelpProbability {
    constructor(configData) {
        const table = this.calculateProbabilityTable(configData.dices);
        this.renderedTable = this.renderProbabilityTable(table);
    }
    renderedTable;
    renderProbabilityTable(tableData) {
        const table = new AsciiTable3('Win probability');
        table.setAlign(10, AlignmentEnum.CENTER);
        table.setStyle('unicode-single');
        table.setHeading('User dice v', ...tableData.heading);
        tableData.rows.forEach(row => {
            let displayRow = [row.headingCell];
            row.cells.forEach(cell => displayRow.push(
                this.getProbabilityCellDisplay(cell, tableData.maxProbability)
            ));
            table.addRow(...displayRow);
        });
        return table.toString();
    }
    getRenderedProbabilityTable() {
        return this.renderedTable;
    }
    prepareHeadingAndRows (dices) {
        let heading = [];
        let rows = [];
        dices.map((dice, diceIndex) => {
            const diceDisplay = convertDiceToString(dice,false);
            heading.push(diceDisplay);
            rows[diceIndex] = { headingCell: diceDisplay, cells: []};
        });
        return {
            heading: heading,
            rows: rows,
            maxProbability: 0,
        }
    }
    countPlayerWins (playerDice, computerDice) {
        let wins = 0;
        playerDice.forEachValue(playerValue => {
            computerDice.forEachValue(computerValue => wins+=playerValue > computerValue ? 1 : 0);
        });
        return wins;
    }
     getProbabilityCellDisplay (cell, maxProbability = 0) {
        let displayValue = cell.probability.toFixed(4);
        let color = COLORS.BLUE;
        if(cell.isAvailable){
            color = cell.probability >= maxProbability ? COLORS.GREEN : COLORS.YELLOW;
        }else{
            displayValue = `- (${displayValue})`;
        }
        return convertToColorMessage(displayValue, color);
    }
     calculateProbabilityTable (dices) {
        let table = this.prepareHeadingAndRows(dices);
        dices.forEach((playerDice, playerDiceIndex) => {
            let cells = table.rows[playerDiceIndex].cells;
            dices.forEach((computerDice, computerDiceIndex) => {
                const probability = this.calculatePlayerWinProbability(playerDice, computerDice);
                table.maxProbability = probability > table.maxProbability
                    ? probability : table.maxProbability;
                cells.push(createProbabilityRowCell(probability,
                    playerDiceIndex !== computerDiceIndex));
            });
        });
        return table;
    }
    calculatePlayerWinProbability (playerDice, computerDice) {
        return this.countPlayerWins(playerDice,computerDice) / DICE_ALL_OUTCOMES;
    }
}

const createProbabilityRowCell = (probability, isAvailable) => ({
    probability: probability,
    isAvailable: isAvailable,
});

const DICE_ALL_OUTCOMES = 36;