import { mvc } from "../../../rb/Mvc";
import {GameContext} from "../context/GameContext";
import {GameController} from "../controller/GameController";
import {GameView} from "../view/GameView";

export class GameModel extends mvc.BaseModel {

    constructor(c: GameContext) {
        super(c);
    }

    init() {
        super.init();
    }

    open(param?: any) {
        super.open();
    }

    close() {
        super.close();
    }

    destroy() {
        super.destroy();
    }


    doInit() {

    }

    get view(): GameView {
        return this.context.view as GameView;
    }

    get controller(): GameController {
        return this.context.controller as GameController;
    }
}