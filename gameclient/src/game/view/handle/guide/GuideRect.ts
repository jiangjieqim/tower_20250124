// import { ButtonCtl } from "../../../../frame/view/ButtonCtl";
import { E } from "../../../G";
import { GuideModel } from "./GuideModel";
enum EShowsmallView{
    /**
     * 中心区域挖空
     */
    None = 0,
    /**
     * 点击引导组件区域 不进行入下一个引导
     */
    Normal = 1,
    /**
     * 点击任意区域下一个引导
     */
    NextGuide = 2,//点任意区域进入下一个
    /**
     * 整个区域不可点击
     */
    DisableClick = 3,//任何区域不可点击
}
export class GuideRect{
    private p:Laya.Sprite;
    private sprList:Laya.Sprite[] = [];
    private spr1:Laya.Sprite = new Laya.Sprite();
    private spr2:Laya.Sprite = new Laya.Sprite();
    private spr3:Laya.Sprite = new Laya.Sprite();    
    private spr4:Laya.Sprite = new Laya.Sprite();
    private centerSpr:Laya.Sprite = new Laya.Sprite();
    private sprSelf:Laya.Sprite = new Laya.Sprite();
    static Alpha:number = 0.5;
    private btns:ButtonCtl[] = [];

    constructor(){
        this.init();
    }
    private init(){
        this.sprList.push(
            this.spr1,
            this.spr2,
            this.spr3,
            this.spr4,
            this.centerSpr
        )
    }
    disposeBtns(){
        while(this.btns.length){
            let btn = this.btns.shift();
            btn.dispose();
        }
    }
    hide(){
        this.disposeBtns();
        for(let i = 0;i < this.sprList.length;i++){
            // this.drawSpr(this.sprList[i],pos,i);
            let spr = this.sprList[i];
            if(spr.parent){
                spr.removeSelf();
            }
        }
        if(this.sprSelf.parent){
            this.sprSelf.removeSelf();
        }
    }

    draw(p:Laya.Sprite,sp:Laya.Sprite,_cfg:Configs.t_Tasks_Guide_dat){
        this.p = p;
        let pos = (p.parent as Laya.Sprite).localToGlobal(new Laya.Point(p.x,p.y));
        for(let i = 0;i < this.sprList.length;i++){
            this.drawSpr(_cfg,this.sprList[i],pos,i,_cfg.f_showsmallview);
        }
        if(_cfg.f_showsmallview == EShowsmallView.NextGuide){
            // if(debug){
            // this.sprSelf.graphics.clear();
            // this.sprSelf.graphics.drawRect(0,0,sp.width,sp.height,"#ff0000");
            // this.sprSelf.alpha = 0.25;
            // }
            // DebugUtil.draw(this.sprSelf,"#00ff00",this.sprSelf.width,this.sprSelf.height,0,0,true);
            this.sprSelf.hitArea = new Laya.Rectangle(0,0,sp.width,sp.height);
            let btn = ButtonCtl.CreateBtn(this.sprSelf,this,this.onClick,false,[_cfg,'sprSelf']);
            this.btns.push(btn);
            // this.sprSelf.pos(pos.x,pos.y);
            btn.setpos(pos.x,pos.y);
            p.parent.addChild(this.sprSelf);
        }
    }
    
    private onClick(_cfg:Configs.t_Tasks_Guide_dat,type:number|string){
        if(_cfg.f_closeUI){
            E.ViewMgr.Close(parseInt(_cfg.f_GuidePosition.split("-")[0]))
        }
        GuideModel.Ins.nextGuideStep();
    }
    private drawSpr(_cfg:Configs.t_Tasks_Guide_dat,spr1:Laya.Sprite,pos:Laya.Point,type:number,f_showsmallview:number){
        let offsetX:number = this.p.x;
        let offsetY:number = this.p.y;
        // let colors = ["#ff0000","#ff00ff","#ffff00","00ff00"];
        // let _color:string = colors[type];
        let _color:string = "#000000";

        if(Laya.Utils.getQueryString(`guide_color`)){
            _color = ["#ff0000","#ff00ff","#ffff00","00ff00","887700"][this.sprList.indexOf(spr1)];
        }

        spr1.alpha = GuideRect.Alpha;
        spr1.graphics.clear();
        let rect:Laya.Rectangle;
        switch(type){
            case 0:
                spr1.x = -pos.x + offsetX;
                spr1.y = -pos.y + offsetY;
                rect = new Laya.Rectangle(0,0,Laya.stage.width,pos.y);
                break;
            case 1:
                spr1.x = -pos.x + offsetX;
                spr1.y = this.p.height + offsetY;
                // spr1.graphics.drawRect(0, 0, Laya.stage.width, (Laya.stage.height - pos.y - this.height), _color);
                rect = new Laya.Rectangle(0, 0, Laya.stage.width, (Laya.stage.height - pos.y - this.p.height));
                break;
            case 2:
                spr1.x = -pos.x + offsetX;
                spr1.y = 0 + offsetY;
                // spr1.graphics.drawRect(0, 0, pos.x, this.height, _color);
                rect = new Laya.Rectangle(0, 0, pos.x, this.p.height);
                break;
            case 3:
                spr1.x = this.p.width + offsetX;
                spr1.y = 0 + offsetY;
                // spr1.graphics.drawRect(0, 0, Laya.stage.width-pos.x-this.height, this.height, _color);
                rect = new Laya.Rectangle(0, 0, Laya.stage.width-pos.x-this.p.width, this.p.height);
                break;
            case 4:
                //center
                if(f_showsmallview == EShowsmallView.DisableClick){
                    spr1.x = pos.x;
                    spr1.y = pos.y;
                    rect = new Laya.Rectangle(0, 0,this.p.width, this.p.height);
                }
                break;
            }
            if (rect) {
                if(f_showsmallview == EShowsmallView.DisableClick){
                    if(debug){
                        spr1.graphics.drawRect(rect.x, rect.y, rect.width, rect.height, _color);
                    }
                }else{
                    spr1.graphics.drawRect(rect.x, rect.y, rect.width, rect.height, _color);
                }
                spr1.hitArea = rect;
                spr1.mouseEnabled = true;
                // spr1.on(Laya.Event.CLICK,this,this.onClick,[type]);
                if (f_showsmallview == EShowsmallView.NextGuide) {
                    let _btn = ButtonCtl.CreateBtn(spr1, this, this.onClick, false, [_cfg, type]);
                    this.btns.push(_btn);
                }
                // spr1.zOrder = this.zOrder-1;
                this.p.parent.addChild(spr1);
            }
    }
}