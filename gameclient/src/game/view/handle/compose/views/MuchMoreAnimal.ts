import { ComposeDragGrid } from "./ComposeDragGrid";

export class MuchMoreAnimal extends Laya.Sprite{
    // private gridList1:AnimalAvatar[] = [];

    /**增加格子 */
    addEmptyGrid(isoX:number,isoY:number){
        // let _animal: AnimalAvatar = new AnimalAvatar();
        // _animal.addEmpty(isoX,isoY);
        // this.gridList1.push(_animal);
        // this.addChild(_animal);
    }
    
    setDataAnim(l:ComposeDragGrid[]){
        // for(let i = 0;i < l.length;i++){
        //     let o = l[i];
        //     let _animal: AnimalAvatar = new AnimalAvatar();
        //     _animal.useAnchorXY = false;
        //     _animal.loadCfg(null,o.cfg);
        //     _animal.x = o.curIsoX * _animal.unitW;
        //     _animal.y = o.curIsoY * _animal.unitH;
        //     this.addChild(_animal);
        //     this.gridList1.push(_animal);
        // }
    }
    dispose(){
        // while(this.gridList1.length){
        //     let cell = this.gridList1.shift();
        //     cell.dispose();
        // }
    }
}