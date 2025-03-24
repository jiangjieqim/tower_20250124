import { mvc } from "../../rb/Mvc";
import {GameContext} from "./context/GameContext";

export class GameModule extends mvc.BaseModule {

    private static _inst: GameModule;
    static get inst(): GameModule {
        if (!GameModule._inst) {
            GameModule._inst = new GameModule();
        }
        return GameModule._inst;
    }

    constructor() {
        super();
    }

    init() {
        this.mapId = "GameModule";
        super.init();
        let gameCtx = new GameContext("gameCtx");
        this.contexts.push(gameCtx);
    }

    open() {
        super.open();
        this.switchContext("gameCtx");
    }

    close() {
        super.close();
    }

    destory() {
        super.destory();

    }
}