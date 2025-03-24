import {EventCenter} from "../../../rb/EventCenter";
import { mvc } from "../../../rb/Mvc";
import {Message} from "../../../rb/net/Message";
import {MessageManager} from "../../../rb/net/MessageManager";
import {GameContext} from "../context/GameContext";
import {GameModel} from "../model/GameModel";
import {GameView} from "../view/GameView";

export class GameController extends mvc.BaseController {

    token: string;
    saveObj: Object;

    constructor(c: GameContext) {
        super(c);
        this.saveObj = {};
    }

    init() {
        super.init();
        EventCenter.inst.on(Message.GAME, this, this.onMsg);
    }

    onMsg(msg: Message) {
        switch (msg.cmd) {
            case "enter":

                this.model.doInit();
                this.view.showView(1);//进入view




                break;
            case "save":
                break;
            default: break;
        }

        MessageManager.inst.completeMsg(msg);
    }

    // sendMsg(cmd: string, msgType: string, data: any, caller?: any, okFun?: any, errFun?: any, type = "get") {
    //     // if (!this.token) {
    //     //     // this.token = ExternalUtil.inst.platform.getToken();
    //     // }
    //     // data.token = this.token;
    //     HttpRequest.inst.sendCmd(cmd, msgType, data, caller, okFun, errFun, type);
    // }

    // stat(item: string, subitem: string, count: number = 1) {
    //     //HttpRequest.inst.stat(item, subitem, count);
    // }

    // save(data: any) {
    //     for (let key in data) {
    //         this.saveObj[key] = JSON.stringify(data[key]);
    //     }
    //     Laya.LocalStorage.setItem("localDt", JSON.stringify(this.saveObj));
    // }

    open(param?: any) {
        super.open(param);
    }

    close() {
        super.close();
    }

    get model(): GameModel {
        return this.context.model as GameModel;
    }

    get view(): GameView {
        return this.context.view as GameView;
    }

    destroy() {
        EventCenter.inst.offAllCaller(this);
        super.destroy();
    }
}