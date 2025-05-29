export default class FairNumberProtocol {
    constructor(gameConsole, security) {
        this.console = gameConsole;
        this.security = security;
    }
    console;
    security;
    rangeMax = 5;
    computerNumberVerifiable;
    playerNumber;
    fairNumber;
    getFairNumber() {
        this.setComputerNumber();
        this.console.writeComputerSelectedValue(this.computerNumberVerifiable, this.rangeMax);
        this.setPlayerNumber();
        this.console.writeComputerRevealValue(this.computerNumberVerifiable, 'number is');
        this.calculateFairNumber();
        this.console.writeFairNumberGenerationResult(
            this.computerNumberVerifiable.value,
            this.playerNumber,
            this.fairNumber
        );
        return this.fairNumber;
    }
    setComputerNumber(){
        const computerNumber = this.security.generateRandomNumber(0, this.rangeMax);
        this.computerNumberVerifiable = this.security.createVerifiableValue(computerNumber);
    }
    setPlayerNumber() {
        this.playerNumber = this.console.askPlayerRangeSelection(
            'Add your number modulo 6.', 5, FAIR_NUMBER_HELP_MESSAGE);
    }
    calculateFairNumber() {
        this.fairNumber = (this.computerNumberVerifiable.value + this.playerNumber) % 6;
    }
}

const FAIR_NUMBER_HELP_MESSAGE = 'To create fair number computer and player'
    + ' selecting random number in range 0..5. Then modulo 6 being applied.';
