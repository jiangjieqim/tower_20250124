import { AtlasPage, IUvResult } from "./SpineManager";

export class SpineAnimResultVo{
    /**值 */
    val:string;
    /**插槽名 SpineUtil.forEachSlot(this.baseSkel); 获取所有的插槽*/
    slot:string;
    /**图集对应的纹理UV 
     * 
     * _cell.uv = atlas.getUV("blank"); 这是一个空白格
     * 
    */
    uv:IUvResult;
}

export class SpineAnimUtils{
    private static readonly blank:string = "blank";

    private static getPrefix(index:number){
        let s = "s";
        switch(index){
            case 4:
                s = "s";
                break;
            case 5:
                s = "b";
                break;
            case 6:
            case 7:
                s = "x";
                break;
        }
        // this.prefix = s;
        // super.play(index);
        return s;
    }

    static createFight(atlas:AtlasPage,index:number,val:string,algin:string = "left"){
        // let atlas = SpineUtil.fightEffectAtlas;

        let max = 9;

        let half:number = 0;
        if(algin == "left"){
            half = 0;
        }else if(algin == "center"){
            half = Math.ceil((max - val.length)/2);//居中
        }

        let prefix = this.getPrefix(index);

        let a = "";
        if(val.length > 0){
            a = val[0];
        }else{
            return [];
        }

        let slotArr = a+"12345678";
        let list1:SpineAnimResultVo[] = [];
        for(let i = 0;i < half;i++){
            let uv = atlas.getUV(this.blank);//空白
            // SpineUtil.f_setSlotUV(this.baseSkel, urlKey, prefix+slotArr[i], uv);
            let _cell:SpineAnimResultVo = new SpineAnimResultVo();
            _cell.slot = prefix+slotArr[i];
            _cell.val = this.blank;
            _cell.uv = uv;
            list1.push(_cell);
        }

        for (let i = half; i < max; i++) {
            let slotName = val[i-half];
            let _slot = "";
            _slot = prefix + slotArr[i];
            let uv;
            let _cell:SpineAnimResultVo = new SpineAnimResultVo();

            if (slotName) {
                uv = atlas.getUV(prefix + slotName);
                _cell.val = prefix + slotName;
            } else {
                uv = atlas.getUV(this.blank);//空白
                _cell.val = this.blank;
            }
            // SpineUtil.f_setSlotUV(this.baseSkel, urlKey, _slot, uv);
            _cell.uv = uv;
            _cell.slot = _slot;
            list1.push(_cell);
        }
        return list1;
    }

    /**
     * @param atlas AtlasPage配置数据
     * @param _data 字符数据 如"+1120"
     * @param pre 插槽前缀
     * @param numMax 插槽最大数
     * @param atlasPre 图集前缀
     */
    public static sell(atlas:AtlasPage,_data:string,pre:string = "h",numMax:number = 3,atlasPre?:string){
        // let pre = "h";
        let list1:SpineAnimResultVo[] = [];
        
        let hSlot:string[] = [];    
        hSlot.push(pre+"+");
        let max = numMax+1;
        for(let i = 0;i < max;i++){
            hSlot.push(pre+(i+1));
        }
        for(let i = 0;i < max;i++){
            let _cell:SpineAnimResultVo = new SpineAnimResultVo();
            _cell.slot = hSlot[i];
            let curVal = _data[i];
            
            list1.push(_cell);
            
            if(curVal!=undefined){
                _cell.uv = atlas.getUV(atlasPre ? atlasPre + curVal: pre + curVal);
            }else{
                _cell.uv = atlas.getUV("blank");
            }

        }
        return list1;
    }

}

