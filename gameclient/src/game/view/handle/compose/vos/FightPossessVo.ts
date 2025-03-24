import { ComposeModel } from "../ComposeModel";

export class FightPossessVo {
    leftVal: number = 0;//左值 玩家自己
    rightVal: number = 0;//右值 对方
    constructor(cfg: Configs.t_Battle_Statistics_dat) {
        let model = ComposeModel.Ins;
        let battleStaticList = model.battleStaticList;


        /*
        let vo = battleStaticList.find(o=>o.playerId == model.ownerPlayer.playerId && o.fid == cfg.f_id);
        if(vo){
            this.leftVal = vo.count;
        }
        let other = battleStaticList.find(o=>o.playerId == model.enemyPlayer.playerId && o.fid == cfg.f_id);
        if(other){
            this.rightVal = other.count;
        }

        */
        let vo =  battleStaticList.find(o=>o.playerId == model.ownerPlayer.playerId);
        if(vo){
            let cell = vo.datalist.find(obj=>obj.fid == cfg.f_id);
            if(cell){
                this.leftVal = cell.count;
            }else{
                this.leftVal = 0;
            }
        }
        let other = battleStaticList.find(o=>o.playerId == model.enemyPlayer.playerId);
        if(other){
            let cell = other.datalist.find(obj=>obj.fid == cfg.f_id);
            if(cell){
                this.rightVal = cell.count;
            }else{
                this.rightVal = 0;
            }
        }
    }
}