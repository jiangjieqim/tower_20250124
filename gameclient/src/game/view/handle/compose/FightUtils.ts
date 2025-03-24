import { stElement, stMonsterWalk } from "../../../network/protocols/BaseProto";
import { HeroListProxy } from "../towertmainhero/proxy/HeroProxy";
import { ComposeConfig } from "./ComposeConfig";
import { EIsoRegion, IISOPos } from "./UnlockVo";
import { EMonsterPos, FightValueConfig, TowerMoveVo } from "./vos/FightValueConfig";
import { WalkList } from "./WalkList";
export class RangleVal{
    min:number;
    max:number;
}
export class FightUtils {

    private static height;
    /**
     * 顶部的Y偏移
     */
    static topOffsetY:number;
    private static moveList:IISOPos[];
    /**转化为像素坐标 */
    static convertX(x: number,owner:EMonsterPos) {
        return ComposeConfig.MapCellW * x + ComposeConfig.MapCellW / 2;
    }

    static convertY(y: number,owner:EMonsterPos) {
        if(owner > EMonsterPos.Owner){
            return y * ComposeConfig.MapCellH + ComposeConfig.MapCellH / 2 /*+ this.topOffsetY*/;
        }
        return (this.height - y) * ComposeConfig.MapCellH + ComposeConfig.MapCellH / 2;
    }

    static init(){
        let h: number = (ComposeConfig.mapH + 2) * ComposeConfig.Div - 1;
        this.height = h;
    }
    /**区块位置转换为像素位置 */
    static IsoxToPosX(isoX:number) {
        return isoX * ComposeConfig.cellW + ComposeConfig.cellW / 2;
    }
    static IsoyToPosY(isoY:number,owner:EMonsterPos) {
        if(owner > EMonsterPos.Owner){
            return isoY * ComposeConfig.cellH + ComposeConfig.cellH / 2 + this.topOffsetY;
        }
        return (ComposeConfig.mapH - isoY - 1) * ComposeConfig.cellH + ComposeConfig.cellH / 2;
    }
    /*

    <--------24----------->
    +---------------------+  ^
    |                     |  |
    |                     |  15
    |                     |  |
    |                     |  v
    +---------------------+

    2024-11-7 10:5:13.32	[Log] -->isox 1 isoy 13
    2024-11-7 10:5:13.32	[Log] -->isox 22 isoy 13
    2024-11-7 10:5:13.33	[Log] -->isox 22 isoy 1
    2024-11-7 10:5:13.33	[Log] -->isox 1 isoy 1

    */
    public static get curMoveList(){
        if(!this.moveList){
            // let time = Laya.timer.currTimer;
            let h: number = (ComposeConfig.mapH + 2) * ComposeConfig.Div - 2;//13
            let w: number = (ComposeConfig.mapW + 2) * ComposeConfig.Div - 2;//22

            let moveList: IISOPos[] = [];
            for (let i = 0; i < h; i++) {
                let vo = {} as IISOPos;
                vo.isoX = 1;
                vo.isoY = i + 1;
                moveList.push(vo);
            }
            // let v1 = moveList[moveList.length-1];
            // LogSys.Log(`-->isox ${v1.isoX} isoy ${v1.isoY}`);
            for (let i = 1; i < w; i++) {
                let vo = {} as IISOPos;
                vo.isoX = i + 1;
                vo.isoY = h;
                moveList.push(vo);
            }
            // v1 = moveList[moveList.length-1];
            // LogSys.Log(`-->isox ${v1.isoX} isoy ${v1.isoY}`);
            for (let i = h; i > 1; i--) {
                let vo = {} as IISOPos;
                vo.isoX = w;
                vo.isoY = i - 1;
                moveList.push(vo);
            }
            // v1 = moveList[moveList.length-1];
            // LogSys.Log(`-->isox ${v1.isoX} isoy ${v1.isoY}`);
            for (let i = w; i > 1; i--) {
                let vo = {} as IISOPos;
                vo.isoX = i-1;
                vo.isoY = 1;
                moveList.push(vo);
            }
            // v1 = moveList[moveList.length-1];
            // LogSys.Log(`-->isox ${v1.isoX} isoy ${v1.isoY}`);
            this.moveList = moveList;
        }
        return this.moveList;
    }

    static getPos(index:number) {
        return this.curMoveList[index];
    }

    static getNextIndex(index:number){
        return this.curMoveList[index + 1] == undefined ? 0 : index + 1;
    }

    static getNextPos(i:number){
        let index = this.getNextIndex(i);
        return this.getPos(index);
    }

    static getLength(sx:number,sy:number,endX:number,endY:number){
        let x1 = endX - sx;
        let y1 = endY - sy;

        if(x1 == 0  && y1 == 0){
            return 0;
        }
        let len = Math.sqrt(x1 * x1 + y1 * y1);
        return len;
    }
    /**绘制虚线 */
    static drawBrokenLine(_lineSpr:Laya.Sprite,sx:number,sy:number,endX:number,endY:number,sectionLen:number,curColor:string,lineWidth:number){
        _lineSpr.graphics.clear();
        // this._lineSpr.graphics.drawLines(0,0,[sx,sy,endX,endY],"#ffff00",this.lineWidth);

        let x1 = endX - sx;
        let y1 = endY - sy;

        let len = this.getLength(sx,sy,endX,endY);

        if(len == 0){
            return;
        }

        let nx = x1 / len;
        let ny = y1 / len;
        
        if( isNaN(nx) || isNaN(ny)){

        }else{
            let mLen = sectionLen;//the length of each section
            let m:number  = len / mLen;//section count
            
            let x2:number = sx;
            let y2:number = sy;

            let l:Laya.Point[] = [];
            
            l.push(new Laya.Point(x2,y2));
            for(let i = 0;i < m;i++){
                x2 += nx * mLen;
                y2 += ny * mLen;
                l.push(new Laya.Point(x2,y2));
                if(l.length % 2 == 1){
                    let fx = l[i-1].x;
                    let fy = l[i-1].y;
                    let toX = l[i].x;
                    let toY = l[i].y
                    _lineSpr.graphics.drawLine(fx, fy, toX, toY, curColor, lineWidth);
                }
            }
            // console.log(`m is ${m} l'len is ${l.length}`,l);
        }
    }

//#region 格内站位
    /*
    |<----- cellW ----->|
    +----+----+----+----+------
    |    |    |    |    |    ^
    +----+----B----+----+    |
    |    |    |    |    |    |
    +----+----A----+----+  cellH
    |    |    |    |    |    |
    +----C----+----D----+    |
    |    |    |    |    |    v
    +----+----+----+----+------
    */
    static getAvatarPos(heroCfg: Configs.t_Hero_dat,index:number,isoX:number,isoY:number,owner:EMonsterPos){
//#endregion
        let ox:number = FightUtils.IsoxToPosX(isoX);
        let oy: number = FightUtils.IsoyToPosY(isoY,owner);
        // if (heroCfg.f_qua >= FightValueConfig.MAX_QUA) {
        //     return [ox,oy];
        // } else {
        //     let div:number = 8;
        //     switch(index){
        //         case 0:
        //             //B
        //             return [ox, oy - h / div];
        //         case 1:
        //             //C
        //             return [ox - w / div, oy + h / div];
        //         case 2:
        //             //D
        //             return [ox + w / div, oy + h / div];
        //     }
        // }
        return this.convertAvatarPos(heroCfg,index,ox,oy);
    }

    static getAvataLocalrPos(heroId:number,index:number,owner:EMonsterPos){
        let heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(heroId);
        let ox: number = ComposeConfig.cellW / 2;
        let oy: number =  ComposeConfig.cellH / 2;
        return this.convertAvatarPos(heroCfg,index,ox,oy);
    }


    private static convertAvatarPos(heroCfg: Configs.t_Hero_dat,index:number,ox:number,oy:number){
        let w: number = ComposeConfig.cellW;
        let h: number = ComposeConfig.cellH;
        let pos:Laya.Point = new Laya.Point();
        if (heroCfg.f_qua >= FightValueConfig.MAX_QUA) {
            // return [ox, oy];
            pos.x = ox;
            pos.y = oy;
        } else {
            let div: number = 8;
            switch (index) {
                case 0:
                    //B
                    // return [ox, oy - h / div];
                    pos.x = ox;
                    pos.y = oy - h / div;
                    break;
                case 1:
                    //C
                    // return [ox - w / div, oy + h / div];
                    pos.x = ox - w / div;
                    pos.y =  oy + h / div;
                    break;
                case 2:
                    //D
                    // return [ox + w / div, oy + h / div];
                    pos.x = ox + w / div;
                    pos.y = oy + h / div;
                    break;
            }
        }
        return pos;
    }

    private static walks:WalkList[];

    static getWalkByType(type:EMonsterPos){
        if(!this.walks){
            this.walks = [];
            this.walks.push(new WalkList(EMonsterPos.Owner));
            this.walks.push(new WalkList(EMonsterPos.OtherPlayer));
        }
        return this.walks.find(o=>o.type == type);
    }
    /**
     * 构建行走行走行为
     * @param oldIndex 上次的所在索引
     * @param _walkVo 
     */
    static buildWalkList(old:number,_walkVo:stMonsterWalk,owner:EMonsterPos):TowerMoveVo[]{
        let walk = this.getWalkByType(owner);
        let paths = walk.splitPath;
        let cur:number = _walkVo.index;
        let oldIndex = walk.rangleList.findIndex(o => old >= o.min && old <= o.max);
        let curIndex = walk.rangleList.findIndex(o => cur >= o.min && cur <= o.max);
        if (oldIndex == curIndex) {
            return [walk.createMoveVo(old, _walkVo.index, _walkVo,owner)];
        } else {
            let v1 = walk.createMoveVo(old, walk.rangleList[oldIndex].max, _walkVo,owner)
            let v2 = walk.createMoveVo(walk.rangleList[curIndex].min, _walkVo.index, _walkVo,owner);
            return [v1, v2];
        }
    }

    /**获取其方向 */
    static getRegion(owner: EMonsterPos, oldIndex: number) {
        let walk = this.getWalkByType(owner);
        let path =  walk.splitPath;
        let vo = path[oldIndex]
        if(vo){
            return vo.region;
        }
        LogSys.Error(`did't not find...${oldIndex}`);
        return EIsoRegion.Null;
    }

    /**检测主角是否可以移动到目标区块位置 */
    static isOwnerCanMove(mIsoX: number, mIsoY: number){
        if (mIsoX >= 0 && mIsoX <= ComposeConfig.mapW - 1 && mIsoY >= 0 && mIsoY <= ComposeConfig.mapH - 1) {
            return true;
        }
    }

    /**计算英雄的可攻击半径 */
    static calculateFightRadiu(heroId: number) {
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        let radiu: number = ComposeConfig.cellW / 3 * (cfg.f_range);
        return radiu;
    }
    // /**怪物的波次时间 */
    // static getDisappearTime(monsterId:number){
    //     // return ComposeModel.Ins.curAdapter.getDisappearTime(monsterId);
    //     return 0;
    // }

    static cloneStElement(vo:stElement){
        let _v = new stElement();
        _v.fid = vo.fid;
        _v.num = vo.num;
        _v.playerId = vo.playerId;
        _v.uid = vo.uid;
        _v.x = vo.x;
        _v.y = vo.y;
        return _v;
    }

    static convertProgressVal(w:number,cur:number,max:number){
        let v =  cur / max;
        if(v == 0){
            return 1;
        }
        if(v > 1){
            v = 1;
        }
        return v * w;//FightValueConfig.BloodProgressWidth;
    }

}