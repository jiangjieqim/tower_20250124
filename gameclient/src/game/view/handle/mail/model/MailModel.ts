import { stMail } from "../../../../network/protocols/BaseProto";

export enum EMailStatus{
    /**未读 */
    notRead = 0,

    /**已读 */
    isReaded = 1,

    /**2未领取 */
    notLingqu = 2,

    /**3已领取 */
    isLingqued = 3,

    /**4已删除的邮件*/
    isDeleted = 4,
}

export enum EMailReqType{

    /**列表 */
    List = 0,

    /**领取 */
    LingQuOrRead = 1,

    /**领取 */
    Del = 2,

}

export class MailModel extends Laya.EventDispatcher{
    private static _ins: MailModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new MailModel();
        }
        return this._ins;
    } 

    public redTip:number;
    public mailList:stMail[];

    public static UPDATE_MAIL:string = "UPDATE_MAIL";
    public static UPDATE_REDTIP:string = "UPDATE_REDTIP";

    constructor(){
        super();
    }

    public isRedTip(){
        return this.redTip;
    }

    /**是否有邮件可以领取 */
    public get hasMailCanLingqu(){
        if(this.mailList.length<=0){
            return false;
        }
        for(let i = 0;i < this.mailList.length;i++){
            let cell = this.mailList[i];
            if(cell.state == EMailStatus.notLingqu){
                return true;
            }
        }
        return false;
    }

    public isMask(value:stMail){
        if(value.state == EMailStatus.isLingqued){
            return 1;
        }
        if(value.itemlist.length == 0 && value.state == EMailStatus.isReaded){
            return 1;
        }
        return 0;
    }
}