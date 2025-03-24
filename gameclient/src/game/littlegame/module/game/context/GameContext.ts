import { mvc } from "../../../rb/Mvc";
import {Message} from "../../../rb/net/Message";
import {MessageManager} from "../../../rb/net/MessageManager";
import {GameController} from "../controller/GameController";
import {GameModel} from "../model/GameModel";
import {GameView} from "../view/GameView";

export class GameContext extends mvc.BaseContext {
    constructor(name: string, parent: mvc.BaseContext = null) {
        super(name, parent);
    }

    init() {

    }

    open() {//打开模块
        if (!this.controller) {
            this.controller = new GameController(this);
        }
        if (!this.model) {
            this.model = new GameModel(this);
        }
        if (!this.view) {
            this.view = new GameView(this);
        }
        super.open();//直接看 GameController的open
        MessageManager.inst.continueQueue(Message.GAME);
    }

    close() {
        super.close();
    }

    destory() {
        super.destory();
    }
}