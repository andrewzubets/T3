import {COLORS, convertToColorMessage} from "./GameConsole.js";

export default class ConsoleSelectOption {
    constructor(key, value, displayKey = null, color = COLORS.DEFAULT) {
        this.key = key;
        this.displayKey = !displayKey ? key : displayKey;
        this.value = value;
        this.color = color;
    }
    key;
    displayKey;
    value;
    color;
    getDisplay(){
        return convertToColorMessage(this.key + ' - ' + this.value, this.color);
    }
}

export const HELP_OPTION
    = new ConsoleSelectOption('?','Help', '?', COLORS.CYAN);
export const EXIT_OPTION
    = new ConsoleSelectOption('x','Exit','X', COLORS.RED);
