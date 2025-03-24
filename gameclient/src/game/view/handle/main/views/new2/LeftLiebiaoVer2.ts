// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { MainModel } from "../../model/MainModel";
import { SettingBtn } from "./LeftSmallFuncIcon";
/**第二个版本的按钮列表 */
export class LeftLiebiaoVer2{
    /**按钮间隔 */
    private readonly cellGap:number = 80;
    private btnList:SettingBtn[] = [];
    private con:Laya.Sprite;
    constructor(chatbg:Laya.Sprite){
        let con = new Laya.Sprite();
        this.con = con;
        con.width = 100;
        con.height = 100;
        // if(debug){
        // con.graphics.drawRect(0,0,100,100,null,"#ff0000");
        con.y = chatbg.y - con.height;
        DebugUtil.draw(con);
        chatbg.parent.addChild(con);

        let l = [];
        // t_SettingList.Ins.getByType(ESettingType.OutSide);
        for(let i = 0;i < l.length;i++){
            let cfg = l[i];
            let btn = MainModel.Ins.createBtnByFuncid(cfg.f_funcid);
            btn.hitRect = new Laya.Rectangle(0,0,this.cellGap,this.cellGap);
            this.btnList.push(btn);
        }
        // MainModel.Ins.on(MainEvent.UpdateListView,this,this.updateBtnPos);
        this.updateBtnPos();
    }
    private updateBtnPos() {
        let cellGap: number = this.cellGap;
        let index:number = 0;
        for (let i = 0; i < this.btnList.length; i++) {
            let btn: SettingBtn = this.btnList[i];
            if (btn) {
                if (btn.isOpen) {
                    let x = index * cellGap;
                    let y = 0;
                    btn.setpos(x, y);
                    btn.visible = true;
                    this.con.addChild(btn.skin);
                    index++;
                } else {
                    btn.visible = false;
                }
            }
        }
    }
}