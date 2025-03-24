import { E } from "../../../G";
import { MainModel } from "../main/model/MainModel";
import { AvatarMainSkinView } from "./AvatarBaseView";
/**
 * 主角
 */
export class AvatarMainView extends AvatarMainSkinView{
    private model:MainModel;
    private _showHorse:boolean;
    /**
     * @param showHorse 是否有马
     */
    constructor(showHorse:boolean = true){
        super();
        this._showHorse = showHorse;
        // this._zqModel = ZuoQiModel.Ins;
        this.model = MainModel.Ins;
        this.equipList = [];//this.model.getEquipList();
        if(showHorse){
            this.rideId = 0;//this._zqModel.rideVo.rideId;
        }
        this.wingId = 0;//this.model.wingId;
        this.initRes();
    }

    private onEquipChange(){
        this.refreshSkin();
    }

    public start(){
        super.start();
        if(this._showHorse){
            // this._zqModel.on(ZuoQiEvent.RideOwnerInfoUpdate,this,this.onRideOwnerInfoUpdate);
        }
        // this.model.on(MainEvent.EquipChange,this,this.onEquipChange);
        // this.model.on(MainEvent.UpdateWingId,this,this.onWingUpdate);
        // HuanZhuangModel.Ins.on(HuanZhuangEvent.UpdateStyle,this,this.onUpdateStyle);
        this.onHuanZhuanEvt();

        // WowHuanZhuangModel.Ins.on(WowHuanZhuangModel.UPDATA_SKINID,this,this.onHaloChange);
        this.onHaloChange();
    }

    /**形象 光环 战旗*/
    private onHaloChange(){
        Laya.timer.callLater(this,this.onUpadateSkin);
    }

    private onUpadateSkin(){
        this.refreshImageID(E.gameAdapter.leadImageId);
        this.refreshHalo(E.gameAdapter.leadHaloId);
        this.refreshFlagId(E.gameAdapter.leadFlagId);
    }

    private onUpdateStyle(){
        this.onHuanZhuanEvt();
    }
    private onHuanZhuanEvt(){
        this.onEquipChange();
        if(this._showHorse){
            this.onRideOwnerInfoUpdate();
        } 
        this.onWingUpdate();
    }
    /**坐骑更新 */
    private onRideOwnerInfoUpdate(){
        //let style = this.getOtherStyle(EEquipType.ZuoQi,this._zqModel.rideVo.rideId);
        // this.updateRide(this._zqModel.rideVo.mainid);
    }
    protected removeAllLis(){
        if(this._showHorse){
            // this._zqModel.off(ZuoQiEvent.RideOwnerInfoUpdate,this,this.onRideOwnerInfoUpdate);
        }
        // this.model.off(MainEvent.EquipChange,this,this.onEquipChange);
        // this.model.off(MainEvent.UpdateWingId,this,this.onWingUpdate);
        // HuanZhuangModel.Ins.off(HuanZhuangEvent.UpdateStyle,this,this.onUpdateStyle);
        // WowHuanZhuangModel.Ins.off(WowHuanZhuangModel.UPDATA_SKINID,this,this.onHaloChange);
    }
    // public stop(){
    //     super.stop();
    //     this.removeAllLis();
    // }

    private onWingUpdate(){
        // this.updateWing(this.model.wingId);
    }
}