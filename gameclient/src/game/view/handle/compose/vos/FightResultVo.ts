import { E } from "../../../../G";
import { FightResult_revc, stFightResult } from "../../../../network/protocols/BaseProto";
import { MainModel } from "../../main/model/MainModel";
/*战斗结算结果 */
export class FightResultVo {
    owner: stFightResult;
    enemy: stFightResult
    private _data: FightResult_revc;
    constructor(_data: FightResult_revc) {
        this._data = _data;
        // this._data.datalist.pop();
        let _ownerIndex = this._data.datalist.findIndex(o => o.playerId == MainModel.Ins.mRoleData.AccountId);
        let owner: stFightResult = this._data.datalist[_ownerIndex];
        let enemy: stFightResult = this._data.datalist[_ownerIndex == 1 ? 0 : 1];

        this.owner = owner;
        this.enemy = enemy;

        this.owner = this.checkErr(this.owner);
        this.enemy = this.checkErr(this.enemy);
    }

    private checkErr(_data:stFightResult){
        if(_data){
            return _data;
        }
        let vo = new stFightResult();
        vo.boxIds = [];
        vo.boxPos = 0;
        vo.isBest = 0;
        vo.itemList = [];
        vo.killNum  = 0;
        vo.monsterNum = 0;
        vo.playerId = MainModel.Ins.mRoleData.AccountId;
        vo.trophy = 0;
        E.uploadErr(JSON.stringify(this._data));
        return vo;
    }
    get data(){
        return this._data;
    }
    get type() {
        if(Laya.Utils.getQueryString("reson")){
            return parseInt(Laya.Utils.getQueryString("reson"));
        }
        return this._data.type;
    }
}