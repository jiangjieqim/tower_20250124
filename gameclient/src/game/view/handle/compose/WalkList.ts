import { stMonsterWalk } from "../../../network/protocols/BaseProto";
import { ComposeConfig } from "./ComposeConfig";
import { FightUtils, RangleVal } from "./FightUtils";
import { EIsoRegion, IISOPos } from "./UnlockVo";
import { EMonsterPos, FightValueConfig, TowerMoveVo } from "./vos/FightValueConfig";
export class WalkVo{
    x:number;
    y:number;
    index:number;
    /**所在的区域 */
    region:EIsoRegion;
}
export class WalkList {
    type: EMonsterPos;
    rangleList: RangleVal[];
    paths:WalkVo[];
    constructor(type: EMonsterPos) {
        this.type = type;
        this.paths = this.splitPath;
    }
    private _splitPath: WalkVo[];
    
    createMoveVo(start:number,end:number,_walkVo:stMonsterWalk,owner:EMonsterPos){
        let paths = this.splitPath;
        let sub = end - start;
        if(sub < 0){
            // console.log(1);
            LogSys.Warn(`createMoveVo end is ${end},start is ${start}`);
        }
        let vo = new TowerMoveVo();
        let pos = paths[end];
        vo.time = sub / FightValueConfig.DEV_COUNT * _walkVo.time;
        vo.tx = pos.x;
        vo.ty = pos.y + (owner > EMonsterPos.Owner ? FightUtils.topOffsetY : 0);
        return vo;
    }
    
    /**分割 
     
    1,13 --------------> 22,13
     ^                     |
     |                     |
     |                     v
    1,1  <-------------- 22,1
      
    */
    public get splitPath() {
        if (!this._splitPath) {
            let h: number = (ComposeConfig.mapH + 2) * ComposeConfig.Div - 2;
            let w: number = (ComposeConfig.mapW + 2) * ComposeConfig.Div - 2;
            let moveList: IISOPos[] = [];
            let _cutList: IISOPos[] = [];
            //左路
            for (let i = 0; i < h; i++) {
                let vo = {} as IISOPos;
                vo.isoX = 1;
                vo.isoY = i + 1;
                vo.dir = EIsoRegion.Left;
                moveList.push(vo);
            }
            _cutList.push(moveList[0]);
            _cutList.push(moveList[moveList.length - 1]);
            //上路
            for (let i = 1; i < w; i++) {
                let vo = {} as IISOPos;
                vo.isoX = i + 1;
                vo.isoY = h;
                vo.dir = EIsoRegion.Top;
                moveList.push(vo);
            }
            _cutList.push(moveList[moveList.length - 1]);
            //右路
            for (let i = h; i > 1; i--) {
                let vo = {} as IISOPos;
                vo.isoX = w;
                vo.isoY = i - 1;
                vo.dir = EIsoRegion.Right;
                moveList.push(vo);
            }
            _cutList.push(moveList[moveList.length - 1]);
            //下路
            for (let i = w; i > 1; i--) {
                let vo = {} as IISOPos;
                vo.isoX = i - 1;
                vo.isoY = 1;
                vo.dir = EIsoRegion.Bottom;
                moveList.push(vo);
            }
            // _cutList.push(moveList[moveList.length-1]);
            //============================================
            const PER_DIV: number = FightValueConfig.DEV_COUNT;
            let _outlist: WalkVo[] = [];
            let _indexs: number[] = [];

            for (let i = 0; i < moveList.length; i++) {
                let start: IISOPos = moveList[i];
                let end: IISOPos = moveList[i + 1];
                if (end) {
                    // console.log(start,end);
                    let type = this.type;
                    let sx = FightUtils.convertX(start.isoX, type);
                    let sy = FightUtils.convertY(start.isoY, type);
                    let ex = FightUtils.convertX(end.isoX, type);
                    let ey = FightUtils.convertY(end.isoY, type);
                    let subX: number = (ex - sx) / PER_DIV;
                    let subY: number = (ey - sy) / PER_DIV;

                    let cell = _cutList.find(o => o.isoX == start.isoX && o.isoY == start.isoY);
                    if (cell) {
                        _indexs.push(_outlist.length);
                    }

                    // console.log("i:" + i + " " + JSON.stringify(start) + "->" + JSON.stringify(end) + " sx:" + sx + " sy:" + sy + " ex:" + ex + " ey:" + ey);
                    for (let n = 0; n < PER_DIV; n++) {
                        let x1 = sx + subX * n;
                        let y1 = sy + subY * n;
                        // console.log(x1,y1);
                        let walkVo = new WalkVo();
                        walkVo.x = x1;
                        walkVo.y = y1 + FightValueConfig.MonsterOffsetY;
                        walkVo.index = i + 1;
                        walkVo.region = start.dir;
                        _outlist.push(walkVo);//new Laya.Point(x1, y1)
                    }
                    // console.log("=======================================");
                }
            }
            _indexs.push(_outlist.length - 1);
            let l: RangleVal[] = [];
            for (let i = 0; i < _indexs.length; i++) {
                let min = i == 0 ? 0 : _indexs[i] + 1;
                let max = _indexs[i + 1];
                if (max) {
                    let _rangle = new RangleVal();
                    _rangle.min = min;
                    _rangle.max = max;
                    l.push(_rangle);
                }
            }
            this.rangleList = l;
            this._splitPath = _outlist;
        }
        return this._splitPath;
    }
}