import { E } from "../../../../G";
import { stCareer } from "../../../../network/protocols/BaseProto";
export enum ERankType{
    /**突围战  */
    PVE = 0,
    /**排位赛 */
    PVP_ROUND = 1
}
export class PlayerInfoTxtCellVo {
    p0: string;
    p1: string;
    p2: string;
    p3: string;
    url:string;
    // data:stCareer[];
    constructor(url:string=""){
        // this.data = _data;
        this.p0 = "p0";
        this.p1 = "p1";
        this.p2 = "p2";
        this.p3 = "p3";
        if(!StringUtil.IsNullOrEmpty(url)){
            this.url = url;
        }
    }
    set sessonName(v:string){
        this.p0 = v;
    }
}
export enum EPlayerInfoMode{
    /**普通模式 */
    Normal = 1,
    /**困难模式 */
    Hard = 2,
    /**当前的生涯模式 */
    CurLife = 3
}
export class PlayerInfoCellVo {
    title: string;
    titleArr: string[];
    datalist1: PlayerInfoTxtCellVo[] = [];
    constructor(type: ERankType) {
        this.datalist1 = [];
        let arr = E.getLang(`titleArr${type}`).split("#");
        this.title = arr[0];
        this.titleArr = arr[1].split("|");
        
    }
    readonly TxtCellHeight:number = 71;
    get cellHeight(){
        return 126 + this.TxtCellHeight * this.datalist1.length;
    }

    get bgHeight(){
        return 101 + this.TxtCellHeight * this.datalist1.length;
    }

    addData(l: stCareer[],type:EPlayerInfoMode) {
        if (l.length) {
            let o = new PlayerInfoTxtCellVo();
            switch(type){
                case EPlayerInfoMode.Normal:
                    o.url = "remote/roleinfo/icon_pt_main.png";
                    break;
                case EPlayerInfoMode.Hard:
                    o.url = "remote/roleinfo/icon_kn_main.png";
                    break;
                case EPlayerInfoMode.CurLife:

                    break;
            }
            for (let i: number = 0; i < l.length; i++) {
                let vo = l[i];
                let key = `p${vo.flag}`;
                if(!StringUtil.IsNullOrEmpty(o[key])){
                    o[key] = vo.times;
                }
            }
            this.datalist1.push(o);
            return o;
        }
    }
}