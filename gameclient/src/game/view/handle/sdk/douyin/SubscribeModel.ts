export class SubscribeID{
    // /**新版本提醒 */
    // static NEW_VERSION_TIPS:number = 1;
    // /**签到 */
    // static SIGN:number = 2;
    // /**看广告领元宝 */
    // static WATCH_GOLD:number = 3;

    /**侧边栏按钮弹起坐标 */
    static SIDER_POS:number = 10000;
}
class SubscribeMouseVo{
    /**点击坐标x */
    x:number;
    /**点击坐标y */
    y:number;
    
    id:number;
}
export class SubscribeModel{
    list:SubscribeMouseVo[] = [];
    // signMouseUp:Laya.Point = new Laya.Point();
    private static _ins:SubscribeModel;
    static get Ins(){
        if(!this._ins){
            this._ins = new SubscribeModel();
        }
        return this._ins;
    }
    private ids:number[] = [];
    public isNeed(id:number){
        return this.ids.indexOf(id) == -1;
    }

    push(id:number){
        if(this.ids.indexOf(id) == -1){
            this.ids.push(id);
        }
        LogSys.Log("save " + id);
    }
    getByID(id:number):SubscribeMouseVo{
        let cell = this.list.find(vo=>vo.id == id);
        return cell;
    }
    /**存储点击坐标 */
    mouseupSaveID(id:number){
        let t = Laya.Browser.clientWidth / Laya.stage.width;
        let x1 = Math.round(Laya.stage.mouseX * t);
        let y1 = Math.round(Laya.stage.mouseY * t);
        let vo = new SubscribeMouseVo();
        vo.id = id;
        vo.x = x1;
        vo.y = y1;

        let index = this.list.findIndex(vo=>vo.id == id);
        if(index!=-1){
            this.list.splice(index,1);
        }
        this.list.push(vo);
    }
}