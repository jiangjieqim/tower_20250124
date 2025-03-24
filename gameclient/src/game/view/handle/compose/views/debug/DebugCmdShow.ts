import { MainModel } from "../../../main/model/MainModel";
import { IDebugDecorator } from "./DebugTxtShow";
class CmdVo {
    time: number;
    str: string;
    constructor(str: string, time: number) {
        this.str = str;
        this.time = time;
    }
}
export class DebugCmdShow extends IDebugDecorator {
    private curCmds: CmdVo[] = [];
    /**
     * gm("hero_inner 1;hero_inner 2;hero_inner 3")
     * @param str 
     */
    parseCmd(str: string): void {
        let cmdList = str.split(";");
        // throw new Error("Method not implemented.");
        for (let i = 0; i < cmdList.length; i++) {
            let s = cmdList[i];
            if (!StringUtil.IsNullOrEmpty(s)) {
                // this.curCmds.push(s);
                this.curCmds.push(new CmdVo(s, Laya.timer.currTimer + 100 * i));
            }
        }
    }

    onLoop(): void {
        // throw new Error("Method not implemented.");
        this.target.onLoop();
        if (this.curCmds.length) {
            let vo = this.curCmds[0];
            if (vo.time <= Laya.timer.currTimer) {
                this.curCmds.shift();
                MainModel.Ins.gm(vo.str);
            }
        }
    }
    init() {
        // throw new Error("Method not implemented.");
        this.target.init();
        Laya.timer.frameLoop(1, this, this.onLoop);
    }
}