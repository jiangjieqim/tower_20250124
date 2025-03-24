import { ComposeEvent } from "../compose/ComposeEvent";
import { ComposeModel } from "../compose/ComposeModel";
import { IFightGuide } from "./FightGuide";
import { EGuideEvent, GuideModel } from "./GuideModel";
// import { PveGuide } from "./PveGuide";
/**引导回退检测 */
export class GuidePreCheck {
    private guide:IFightGuide;
    constructor(guide:IFightGuide) {
        this.guide = guide;
        GuideModel.Ins.on(EGuideEvent.GuidePre, this, this.onGuidePreUpdate);
    }

    dispose() {
        GuideModel.Ins.off(EGuideEvent.GuidePre, this, this.onGuidePreUpdate);
    }
    private get model() {
        return ComposeModel.Ins;
    }
    /**回退检测 
     * 
     *  类型|数据
     * 
    */
    private onGuidePreUpdate(param: string, eventName: string) {
        // Laya.timer.callLater(this,this.onGuidePreLater,[param]);
        let arr = param.split("|");
        let type = parseInt(arr[0]);
        // let status:number = 0;
        if (type == 1) {
            let uid: number = parseInt(arr[1]);
            // 1|3 获得uid等于3的新英雄下一步 否则回退到上一步

            let vo = this.model.refreshList.find(o => o.uid == uid);

            LogSys.Log(`${eventName} ::::检测存在英雄uid:${uid} 状态:${vo == undefined ? "fail" : "succeed"}`);
            if (vo) {
                GuideModel.Ins.nextGuideStep();
            } else {
                // GuideModel.Ins.removeYD();
                let n:number = 1;
                // if(arr[2]){
                //     n = parseInt(arr[2]);
                // }
                GuideModel.Ins.preGuideStep(n);
                this.model.once(ComposeEvent.HeroAdd, this, this.onGuidePreUpdate, [param, "HeroAdd"]);
            }
            //===========================================================
        }
        else if (type == 2) {
            //2|5召唤第5次触发下一步 否则回退到上一步 
            let count: number = parseInt(arr[1]);
            if (this.guide.sommonCount >= count - 1) {
                GuideModel.Ins.nextGuideStep();
            } else {
                GuideModel.Ins.preGuideStep();
            }
        }
        else if (type == 3) {
            //3|1|3 uid等于1的英雄有3个的时候下一步 否则回退
            let uid: number = parseInt(arr[1]);
            let heroCount: number = parseInt(arr[2]);
            let vo = this.model.refreshList.find(o => o.uid == uid);
            let v:string = "next";
            if (vo && vo.uid == uid && vo.num == heroCount) {
                GuideModel.Ins.nextGuideStep();
            } else {
                v = "pre";
                GuideModel.Ins.preGuideStep();
                this.model.once(ComposeEvent.HeroUpdate, this, this.onGuidePreUpdate, [param, "HeroUpdate"]);
            }
            LogSys.Log(`${eventName} ::::检测英雄数量 ${JSON.stringify(vo)}--->${v}`);
        }
        else if(type == 4){
            // 4|23:::::召唤到英雄id为23的英雄
            let heroId:number = parseInt(arr[1]);
            let vo = this.model.refreshList.find(o => o.fid == heroId);
            LogSys.Log(`${eventName} ::::检测英雄heroId ${JSON.stringify(vo)}`);
            if(vo){
                GuideModel.Ins.nextGuideStep();
            }else{
                GuideModel.Ins.preGuideStep();
                this.model.once(ComposeEvent.HeroAdd, this, this.onGuidePreUpdate, [param, "HeroAdd"]);
            }

        }
    }
}