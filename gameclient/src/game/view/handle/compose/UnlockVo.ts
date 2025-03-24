import { stElement } from "../../../network/protocols/BaseProto";

/**已经解锁的格子组件数据 */
export class UnlockVo{
    /**局部单位格子数组 */
    private posList:IISOPos[] = [];
    gobalList:IISOPos[] = []
    data:stElement;
    get isoX(){
        return this.data.x;
    }
    get isoY(){
        return this.data.y;
    }
    constructor(o:stElement){
        // this.data = o;
        // let cfganimal:Configs.t_Animal_dat = t_Animal.Ins.GetDataById(o.fid);
        // let cfg = ComposetypeProxy.Ins.getCfgByType(cfganimal.f_map);
        // let arr: string[] = cfg.f_val.split("|");
        // for (let i = 0; i < arr.length; i++) {
        //     let s = arr[i].split("-");
        //     let isoX: number = parseInt(s[0]);
        //     let isoY: number = parseInt(s[1]);
        //     this.posList.push({ isoX: isoX, isoY: isoY } as IISOPos);
        //     this.gobalList.push({ isoX: isoX+this.data.x, isoY: isoY+this.data.y } as IISOPos);
        // }
    }

    /**全局坐标检测 */
    isGlobalPartOf(x:number,y:number){
        let cx = this.data.x;
        let cy = this.data.y;
        for(let i = 0;i < this.posList.length;i++){
            let o = this.posList[i];
            if(cx + o.isoX == x && cy + o.isoY == y){
                return true;
            }
        }
    }
}
export enum EIsoRegion{
    Null = -1,
    Left = 0,
    Top = 1,
    Right = 2,
    Bottom = 3,
}
export interface IISOPos {
    isoX: number;
    isoY: number;
    dir:number;
}