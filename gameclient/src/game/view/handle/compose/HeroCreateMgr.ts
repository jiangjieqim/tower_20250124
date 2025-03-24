import { ComposeUpdate_revc, stElement } from "../../../network/protocols/BaseProto";
import { ComposeModel } from "./ComposeModel";
import { HeroBaseDecorator } from "./HeroBaseDecorator";
import { ComposeDragGrid } from "./views/ComposeDragGrid";
import { IAddHero } from "./vos/EFightEnum";

export class ComposeUpdateVo{
    data:ComposeUpdate_revc;
    /**更新时间戳 */
    time:number;
    /**偏移时间 */
    offset:number;
}
/**英雄创建装饰器 */
export class HeroCreateMgr extends HeroBaseDecorator{
    private get model(){
        return ComposeModel.Ins;
    }
    private _heroList:ComposeUpdateVo[] = [];

    stop(){
        while(this._heroList.length){
            this._heroList.shift();
        }
        Laya.timer.clear(this, this.onLoop);
    }

    start(){
        for(let i = 0;i < this._heroList.length;i++){
            let cell = this._heroList[i];
            cell.time = this.model.curAdapter.clockTimeMs + cell.offset;
        }
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    onLoop(){
        if(this._heroList.length > 0){
            let vo = this._heroList[0];
            if(vo.time <= this.model.curAdapter.clockTimeMs){
                this.model.refreshHeros(vo.data);
                this._heroList.shift();
            }
        }
    }

    createHero(vo:ComposeUpdateVo,sync:boolean){
        if(sync){
            this.model.refreshHeros(vo.data);
        }else{
            this._heroList.push(vo);
        }
    }

    addChildHero(grid:ComposeDragGrid,obj: IAddHero,o:stElement,time:number){
        
    }
}