import ConsoleSelectOption, {EXIT_OPTION, HELP_OPTION} from "./ConsoleSelectOption.js";
import readlineSync from "readline-sync";
import {COLORS, writeLine} from "./GameConsole.js";

export default class ConsoleAsker {
    constructor(helpProbability) {
        this.helpProbability = helpProbability;
    }

    helpProbability;
    charCode; /* '0' */
    options;
    display;
    question = '';
    readOptions;
    reset(){
        this.charCode = 48; /* '0' */
        this.options = [];
    }
    prepare(options){
        this.reset();
        this.setOptions(options);
        this.display = this.getDisplay();
    }
    setOptions(options) {
        options.forEach(item => {
            this.options.push(new ConsoleSelectOption(this.getCurrentKey(), item));
            this.setNextKey();
        });
        this.options.push(HELP_OPTION);
        this.options.push(EXIT_OPTION);
        let keyList = this.getKeyList(this.options);
        this.evaluateReadOptionsFromOptions(this.options, keyList);
    }
    getCurrentKey(){
        return String.fromCharCode(this.charCode);
    }
    setNextKey() {
        this.charCode = this.charCode === 57 /* '9' */ ? 97 /* 'a' */ : this.charCode + 1;
    }
    evaluateReadOptionsFromOptions(options, keyList){
        this.readOptions = {
            hideEchoBack:       false,
            trueValue:          null,
            falseValue:         null,
            caseSensitive:      false,
            phContent: function(param) {
                return param === 'itemsCount' ? options.length + '' :
                    param === 'firstItem' ? (options[0] + '').trim() :
                        param === 'lastItem' ? (options[options.length - 1] + '').trim() : null;
            },
            limit: keyList
        };
    }
    getKeyList(options){
        let keyList = '';
        options.forEach(option => keyList+=option.key);
        return keyList;
    }
    getDisplay() {
        let display = this.question + NEW_LINE;
        this.options.forEach(option => {
            display+= option.getDisplay() + NEW_LINE;
        });
        display+='Your selection: ';
        return display;
    }
    askUser(question, options, helpMessage) {
        this.prepare(options);
        let userChoice;
        do {
            userChoice = readlineSync.keyIn(this.display, this.readOptions).toLowerCase();
            if(this.isSpecialOptionChoice(userChoice)){
                this.onSpecialOptionChoice(userChoice, helpMessage);
            }
        } while (userChoice === HELP_OPTION.key);
        return userChoice;
    }
    isSpecialOptionChoice(userChoice) {
        return userChoice === EXIT_OPTION.key
            || userChoice === HELP_OPTION.key;
    }
    onSpecialOptionChoice(userChoice, helpMessage){
        if(userChoice === EXIT_OPTION.key){
            process.exit(1);
        }
        if(userChoice === HELP_OPTION.key){
            writeLine('Help info:', COLORS.YELLOW);
            writeLine(this.helpProbability.getRenderedProbabilityTable());
            writeLine( helpMessage, COLORS.YELLOW);
        }
    }
}

const NEW_LINE = '\n';