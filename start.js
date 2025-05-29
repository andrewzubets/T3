import Game from "./src/Game.js";
import GameConsole, {writeError} from './src/console/GameConsole.js';
import FairNumberProtocol from "./src/security/FairNumberProtocol.js";
import Security from "./src/security/Security.js";
import GameConfig from "./src/GameConfig.js";
import HelpProbability from './src/console/HelpProbability.js';
import ConsoleAsker from "./src/console/ConsoleAsker.js";

try {
    const configData = new GameConfig(process.argv.slice(2));

    const helpProbability = new HelpProbability(configData);
    const consoleAsker = new ConsoleAsker(helpProbability);
    const gameConsole = new GameConsole(consoleAsker);
    const security = new Security();
    const fairNumberProtocol = new FairNumberProtocol(gameConsole, security);

    const game = new Game(
        configData,
        gameConsole,
        security,
        fairNumberProtocol,
        helpProbability
    );
    while (game.play()){}
}
catch (error){
    writeError(error.message);
}