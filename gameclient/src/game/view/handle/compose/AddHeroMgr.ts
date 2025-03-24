import { stElement } from "../../../network/protocols/BaseProto";
import { ComposeModel } from "./ComposeModel";
import { HeroBaseDecorator } from "./HeroBaseDecorator";
import { ComposeUpdateVo } from "./HeroCreateMgr";
import { ComposeDragGrid } from "./views/ComposeDragGrid";
import { IAddHero, IUpdateHero } from "./vos/EFightEnum";


class GridHeroVo{
    grid:ComposeDragGrid;
    obj: IAddHero;
    o:stElement;
    time:number;
}

export class AddHeroMgr extends HeroBaseDecorator{
    private get model(){
        return ComposeModel.Ins;
    }
    private heroList:GridHeroVo[] = [];
    stop() {
        // throw new Error("Method not implemented.");
        this.target.stop();
        this.heroList = [];
    }
    start() {
        // throw new Error("Method not implemented.");
        this.target.start();
        // this.heroList = [];
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    onLoop(){
        this.target.onLoop();
        if(this.heroList.length > 0){
            let vo = this.heroList[0];
            if(vo.time <= this.model.curAdapter.clockTimeMs){
                if(this.model.fightView){
                    this.model.fightView.addHeroToStage(vo.grid,vo.obj,vo.o);
                    this.heroList.shift();
                }
            }
        }
    }
    constructor(target:HeroBaseDecorator){
        super();
        this.target = target;
    }

    addChildHero(grid:ComposeDragGrid,obj: IAddHero,o:stElement,time:number){
        let vo = new GridHeroVo();
        vo.grid = grid;
        vo.obj = obj;
        vo.time = time;
        vo.o = o;
        this.heroList.push(vo);
    }
    createHero(vo:ComposeUpdateVo,sync:boolean){
        this.target.createHero(vo,sync);
    }
}