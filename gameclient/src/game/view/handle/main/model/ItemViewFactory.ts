import { E } from "../../../../G";
import { stCellValue } from "../../../../network/protocols/BaseProto";
import { SoltItemView } from "../views/icon/SoltItemView";
import { ItemVo } from "../vos/ItemVo";
import { MainModel } from "./MainModel";
import { VoUtils } from "./VoUtils";

interface IItemCfg
{
    id:number;
    count:number;
}

// export interface IJJC_PlayerItem{
//     mingcitf:Laya.Label;
//     rankImg:Laya.Image;
//     jifen:Laya.Image;
//     jifenTf:Laya.Label;
// }
export class ItemViewFactory{
    // private static soltItemKey:string  = "soltItem";



    private static createSoltItem(cls,key:string){
        // let cell:SoltItemView = Laya.Pool.getItemByClass(this.soltItemKey,SoltItemView);
        let cell = Laya.Pool.getItemByClass(key, cls);
        return cell;
    }

    public static parseItem(str:string){
        let l = [];
        let a = str.split("|");
        for (let i = 0; i < a.length; i++) {
            let arr = a[i].split("-");
            let item = {} as IItemCfg;
            item.id = parseInt(arr[0]);
            item.count = parseInt(arr[1]);
            l.push(item);
        }
        if(l.length > 1){
            return l;
        }
        else if(l.length == 1){
            return l[0];
        }
        return [];
    }

    private static LeftLayout(container:Laya.Sprite,cellW:number,gap:number,row:number){
        // let allw:number = container.numChildren * (cellW + gap) - gap;
        let offset = 0;//allw/2;
        if(row == -1){
            row = Number.MAX_VALUE;
        }
        let _resetIndex:number = 0;
        let oy:number = 0;

        for(let i = 0;i < container.numChildren;i++){
            let cell = container.getChildAt(i) as Laya.Sprite;
            cell.x = _resetIndex * (cellW + gap) - offset;
            cell.y = oy;
            _resetIndex++;
            if(_resetIndex >= row){
                _resetIndex = 0;
                oy += (cellW + gap);
            }
        }
    }
    
    private static RightLayout(container:Laya.Sprite,cellW:number,gap:number){
        let allw:number = container.numChildren * (cellW + gap) - gap;
        let offset = -allw;
        for(let i = 0;i < container.numChildren;i++){
            let cell = container.getChildAt(i) as Laya.Sprite;
            cell.x = i * (cellW + gap) + offset;
        }
    }

    public static clear(container:Laya.Sprite,sign:string){
        while(container.numChildren){
            let cell = container.getChildAt(0);
            Laya.Pool.recover(sign,cell);
            cell.removeSelf();
        }
    }

    private static clearSolt(container:Laya.Sprite,key:string){
        this.clear(container,key);
    }

    public static convertItemList(str: string): ItemVo[] {
        let arr: string[] = str.split("|");
        let _l: ItemVo[] = [];
        if (str != "") {
            for (let i = 0; i < arr.length; i++) {
                let cell: string[] = arr[i].split("-");
                let _itemVo: ItemVo = new ItemVo();
                _itemVo.cfgId = parseInt(cell[0]);
                _itemVo.count = parseInt(cell[1]);
                _l.push(_itemVo)
            }
        }
        return _l;
    }
    
    public static convertItem(str: string): ItemVo {
       return this.convertItemList(str)[0];
    }

    public static convertCellList(str: string): stCellValue[] {
        // let arr: string[] = str.split("|");
        // let _l: stCellValue[] = [];
        // if (str != "") {
        //     for (let i = 0; i < arr.length; i++) {
        //         let cell: string[] = arr[i].split("-");
        //         let _itemVo:stCellValue = new stCellValue();
        //         _itemVo.id = parseInt(cell[0]);
        //         _itemVo.count = parseInt(cell[1]);
        //         _l.push(_itemVo)
        //     }
        // }
        // return _l;
        return VoUtils.convertCellList(str);
    }

    static cellValue2ItemVos(l:stCellValue[]){
        let _l1:ItemVo[] = [];
        for(let i = 0;i < l.length;i++){
            let _itemVo = new ItemVo();
            let o:stCellValue = l[i];
            _itemVo.cfgId = o.id;
            _itemVo.count = o.count;
            _l1.push(_itemVo);
        }
        return _l1;
    }

    /**
     * 奖励渲染
     * @param con 奖励容器
     * @param str 物品字符传20202-1|22929-2
     * @param gap 间隔
     * @param scale 缩放
     * @param align "left" "center" "right" 默认居中
     * @param cls 格子视图类
     * @param key 格子key
     * @param row -1代表不换行 >=0 代表一行放几个
     */
    public static renderItemSlots(con:Laya.Sprite,str:string|any[],isClick:boolean = true,gap:number = 10,
        scale:number = 1,align:string = "center",cls:any = SoltItemView,row:number = -1)   //100  ,w:number = 100 soltItem

    {
        // ,key:string="SoltItemView",row:number = -1
        let key:string;
        //let row:number = -1;
        let slotSkinList = [];
        if(typeof cls.CLS_KEY == "string"){
            key = cls.CLS_KEY;
        }else{
            E.debugMsgBox(`please check you cls's CLS_KEY`);
        }
        this.clearSolt(con,key);
        let itemList = [];
        if(typeof str == "string"){
           itemList = this.convertItemList(str);
        }else{
            
            for (let i = 0; i < str.length; i++) {
                let v: stCellValue = str[i];
                if (v instanceof stCellValue || 
                    str[i].hasOwnProperty('id') && str[i].hasOwnProperty('count')) 
                {
                    let cell = new ItemVo();
                    cell.cfgId = v.id;
                    cell.count = v.count;
                    itemList.push(cell);
                }else{
                    itemList.push(v);
                }
            }
        }
        // let w:number  = 100;
        let width:number = 0;
        for(let i = 0;i < itemList.length;i++){
            let item:SoltItemView = this.createSoltItem(cls,key) as SoltItemView;
            let skin = item;
            skin.scaleX = skin.scaleY = scale;
            item.setData(itemList[i],isClick);
            con.addChild(skin as Laya.Sprite);
            width = skin.width;
            slotSkinList.push(item);
        }
        align = align || "left";
        let w = width;
        if(align == "center"){
            LayoutUtil.CenterLayout(con,w*scale,gap,row);
        }else if(align == "left"){
            this.LeftLayout(con,w*scale,gap,row);
        }else if(align == "right"){
            this.RightLayout(con,w*scale,gap);
        }
        // DebugUtil.draw(con);
        return slotSkinList;
    }

    public static mergeItems(l:string[]){
        let _itemsMap = {};
        for(let i = 0;i < l.length;i++){
            let s:string = l[i];
            let itemVos:ItemVo[]= this.convertItemList(s);
            for(let n = 0;n <itemVos.length;n++){
                let cell = itemVos[n];
                if(!_itemsMap[cell.cfgId]){
                    _itemsMap[cell.cfgId] = 0;
                }
                _itemsMap[cell.cfgId] += cell.count;
            }
        }

        let str = "";
        for (let cfgid in _itemsMap) {
            str += `${cfgid}-${_itemsMap[cfgid]}|`
        }
        if (str.length > 0) {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }

    public static LayoutLabels(con:Laya.Sprite){
        let w:number = 0;
        for(let i = 0;i < con.numChildren;i++){
            let label:Laya.Label = con.getChildAt(i) as Laya.Label;
            label.x = w;
            w += label.textField.textWidth;
        }
    }

    /**获取容器中的间隔 */
    public static gapAndClear(con: Laya.Sprite): number {
        let _ls: Laya.Sprite[] = [];
        for (let i = 0; i < con.numChildren; i++) {
            let spr = con.getChildAt(i) as Laya.Sprite;
            _ls.push(spr);
        }
        let _gap: number = 0;
        if (_ls.length >= 2) {
            _gap = Math.abs(_ls[_ls.length - 1].x - _ls[_ls.length - 2].x) - _ls[_ls.length - 1].width;
        }
        while (con.numChildren > 0) {
            con.getChildAt(0).removeSelf();
        }
        return _gap;
    }

    // public static setStar(con: Laya.Sprite, curStar: number, maxStar: number ,isCenX:boolean = true,se:number = 1) {
    //     let normal1 = [`remote/common/base/star.png`, `remote/common/base/star_1.png`];
    //     let high1 = [`remote/common/base/star_2.png`, `remote/common/base/star_3.png`];

    //     let curArr = [];
    //     const MaxVal: number = 6;
    //     if (maxStar > MaxVal ) {

    //         if( curStar > MaxVal){
    //             curArr = high1;
    //             maxStar -= MaxVal;
    //             curStar -= MaxVal;
    //         }else{
    //             curArr = normal1;
    //             maxStar = MaxVal;
    //         }
    //     } else {
    //         curArr = normal1;
    //     }

    //     let l: Laya.Image[] = [];
    //     for (let i = 0; i < con.numChildren; i++) {
    //         l.push(con.getChildAt(i) as Laya.Image);
    //     }
    //     let item = l[0];
    //     // let parent:Laya.Sprite = item.parent as Laya.Sprite;
    //     let cellWidth: number = item.width;

    //     for (let i = 0; i < l.length; i++) {
    //         let _star = l[i];
    //         if (i < maxStar) {
    //             if (i < curStar) {
    //                 _star.skin = curArr[0];
    //             } else {
    //                 _star.skin = curArr[1];
    //             }
    //             _star.visible = true;
    //         } else {
    //             // _star.skin = "";
    //             _star.visible = false;
    //         }
    //         _star.x = i * _star.width;
    //     }
    //     if(isCenX){
    //         if(se == 1){
    //             con.x = ((con.parent as Laya.Sprite).width - maxStar * cellWidth) / 2 - 2;
    //         }else{
    //             con.x = (con.parent as Laya.Sprite).width/2 -  maxStar * cellWidth/2 * se;
    //         }
    //     }
        
    //     // console.log(parent.x);
    // }

    // public static setlb(lb:Laya.Label,itemVo:ItemVo){
    //     lb.text = itemVo.count + "";
    //     let have = MainModel.Ins.mRoleData.getVal(itemVo.cfgId);
    //     if(have >= itemVo.count){
    //         lb.color = "#ffffff";
    //     }else{
    //         lb.color = "#ff0000";
    //     }
    // }

    public static setlb2(lb:Laya.Label,itemId:number,needCount:number){
        lb.text = needCount + "";
        let have = MainModel.Ins.mRoleData.getVal(itemId);
        if(have >= needCount){
            lb.color = "#ffffff";
            return true;
        }else{
            lb.color = "#ff0000";
        }
    }
}