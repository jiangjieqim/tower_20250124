import { FightPureAnim } from "../../avatar/spine/FightPureAnim";
import { SpineAnimResultVo, SpineAnimUtils } from "../../avatar/spine/SpineAnimUtils";
import { AtlasPage, AtlasParserV, SpineUtil } from "../../avatar/spine/SpineManager";

export class Sell2Spine extends FightPureAnim{
    private readonly maxCount:number = 9;
    public get numAtlas(){
        return SpineUtil.sell2Atlas;
    }
    constructor(){
        super();
    }

    /**宝箱售卖 */
    public boxSell(exp:number,money:number){
        let anim = 0;
        let result = [];
        let numAtlas:AtlasPage = this.numAtlas;
        result = result.concat(SpineAnimUtils.sell(numAtlas, "+"+exp, "j",this.maxCount));//经验
        result = result.concat(SpineAnimUtils.sell(numAtlas, "+" + money, "h",this.maxCount));//金币
        this.setText(anim, result);
        this.play(0);
    }
    protected createDatas(str:string,pre:string){
        let numAtlas:AtlasPage = this.numAtlas;
        return SpineAnimUtils.sell(numAtlas, str, pre, 5, "h");
    }

    public playHappy(gouyu:number,fuyuan:number = 0){
        let anim = 1;
        let result = [];
        let numAtlas:AtlasPage = this.numAtlas;

        ///////////////////////////////////////////////////////////////////////////
        let _cell2:SpineAnimResultVo = new SpineAnimResultVo();
        _cell2.slot = "icon_jb6";
        if(!fuyuan){
            //清空福源隐藏
            _cell2.uv = numAtlas.getUV("blank");            
            result.push(_cell2);
            result = result.concat(this.createDatas("","a"));//福源
        } else {
            //设置福源显示
            _cell2.uv = numAtlas.getUV("icon_jp");
            result.push(_cell2);
            result = result.concat(this.createDatas( "+" + fuyuan,"a"));//福源
        }
        ///////////////////////////////////////////////////////////////////////////
        let _gouYuCell:SpineAnimResultVo = new SpineAnimResultVo();
        _gouYuCell.slot = "icon_jy5";
        //勾玉碎片
        if(!gouyu){
            //清空勾玉隐藏
            _gouYuCell.uv = numAtlas.getUV("blank");
            result.push(_gouYuCell);
            result = result.concat(this.createDatas( "","b"));//勾玉
        }else{
            _gouYuCell.uv = numAtlas.getUV("icon_sp");
            result.push(_gouYuCell);
            result = result.concat(this.createDatas( "+" + gouyu,"b"));//勾玉
        }
        this.play(anim);
        this.setText(anim, result);
    }
}

export class BetterEffectSpine extends FightPureAnim{
    // protected mAtlasPage:boolean = true;

    private get numAtlas(){
        let url = this.url.replace(".skel", ".atlas");
        return AtlasParserV.parse(Laya.Loader.getRes(url));
    }
    // let url = this.mUrl.replace(".skel", ".atlas");
    //             this._numAtlas = AtlasParserV.parse(Laya.Loader.getRes(url));

    public xxzdz(value:number,index:number){

        // ,that = null,endCall:Function = null,arg = null

        let result = [];
        // let cell:SpineAnimResultVo = new SpineAnimResultVo();
        // cell.slot = "icon_jy5";
        // cell.uv = this.numAtlas.getUV("icon1");//设置包子图集
        // result.push(cell);

        let _data = SpineAnimUtils.sell(this.numAtlas, "+" + value,"h", 5, "h");
        result = result.concat(_data);
        // this.play2(index);
        this.setText(index, result);
    }
}