import { E } from "../../../../G";
import { stSpringFestivalCharge, stSpringFestivalCommonTimes, stSpringFestivalRank, stSpringFestivalRankTime, stSpringFestivalShop, stSpringFestivalSignIn } from "../../../../network/protocols/BaseProto";

export class NewYearModel extends Laya.EventDispatcher{
    private static _ins: NewYearModel;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new NewYearModel();
        }
        return this._ins;
    } 

    public static UPDATE_VIEW:string = "UPDATE_VIEW";
    public static UPDATE_SHOP:string = "UPDATE_SHOP";
    public static UPDATE_SIGN:string = "UPDATE_SIGN";
    public static UPDATE_RANK:string = "UPDATE_RANK";
    public static UPDATE_RECHARGE:string = "UPDATE_RECHARGE";

    public rankTime:stSpringFestivalRankTime;
    public signInList:stSpringFestivalSignIn[];
    public timeList:stSpringFestivalCommonTimes[];
    public rankList:stSpringFestivalRank[];
    public dailyRechargeList:stSpringFestivalCharge[];
    public dailyRechargeSumList:stSpringFestivalCharge[];
    public shoplist:stSpringFestivalShop[];

    constructor(){
        super();
        this.signInList = [];
        this.timeList = [];
        this.dailyRechargeList = [];
        this.dailyRechargeSumList = [];
        this.shoplist = [];
    }

    public isRedTip(){
        if(this.isRedTab1() || this.isRedTab3() || this.isRedTab4()){
            return true;
        }
        return false;
    }

    public isRedTab1(){
        if(!this.isOpen())return false;
        let num = this.getNumById(1);
        if(num > 0){
            return true;
        }
        return false;
    }

    public isRedTab3(){
        if(!this.isOpen())return false;
        if(this.isSign()){
            return true;
        }
        return false;
    }

    public isRedTab4(){
        if(!this.isOpen())return false;
        for(let i:number=0;i<this.dailyRechargeList.length;i++){
            if(this.dailyRechargeList[i].status == 1){
                return true;
            }
        }
        for(let i:number=0;i<this.dailyRechargeSumList.length;i++){
            if(this.dailyRechargeSumList[i].status == 1){
                return true;
            }
        }
        return false;
    }

    public isOpen(flag:boolean = false){
        if(!this.rankTime){
            if(flag)E.ViewMgr.ShowMidError("活动已结束");
            return false;
        }
        if(TimeUtil.serverTime > this.rankTime.end){
            if(flag)E.ViewMgr.ShowMidError("活动已结束");
            return false;
        }
        return true;
    }

    public getNumById(id:number){
        if(this.timeList.length == 0){
            return 0;
        }
        return this.timeList.find(ele => ele.category == id).times;
    }

    public isSign(){
        for(let i:number=0;i<this.signInList.length;i++){
            if(this.signInList[i].state == 3){
                return true;
            }
        }
        return false;
    }
}