import { stElement } from "../../../../network/protocols/BaseProto";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { FightFactory } from "../FightFactory";
import { BaseAdmissionShow } from "./BaseAdmissionShow";

class ClearAdmissionShow extends BaseAdmissionShow{
    protected defaultAnim:EAvatarAnim = EAvatarAnim.TowerAtk;
    // private _time:number;
    constructor(callBack:Laya.Handler){
        super();
        // this._time = Laya.timer.currTimer;
        this.endHandler = callBack;
        this.url = `o/spine/succeed/Admission/Admission.skel`;
        this.load();
    }
    private readonly maskurl:string = `static/img_mask.png`;
    protected onCompleteHander() {
        super.onCompleteHander();
        this.skel.setSlotImg("Hero",this.maskurl);//img_mask img_y1
    }
    protected onPlayEnd() {
        super.onPlayEnd();
        // LogSys.Log(`花费时间 ${Laya.timer.currTimer - this._time} ms`);
    }
}

/**
 * 神话英雄横幅 \o\spine\succeed\Admission
*/
export class AdmissionShow extends BaseAdmissionShow {
    static isPlay: boolean = false;
    static heroVoList: stElement[] = [];

    heroVo: stElement;

    constructor() {
        super();
    }

    protected onCompleteHander() {
        super.onCompleteHander();
        let imageId: number = FightFactory.getImageId(this.heroVo);
        this.skel.setSlotImg("Hero", `o/heroshow/${imageId}.png`);
    }

    dispose() {
        let cleanAct: ClearAdmissionShow = new ClearAdmissionShow(new Laya.Handler(this, this.onCleanAct));
        // this.onCleanAct();
    }

    private onCleanAct(){
        super.dispose();
        AdmissionShow.isPlay = false;
        if (AdmissionShow.heroVoList.length > 0) {
            let id = AdmissionShow.heroVoList.shift();
            FightFactory.createAdmission(id);
        }
    }
}