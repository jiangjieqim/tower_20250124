import { stPlayerBaseInfo, stPlayerData } from "../../../../network/protocols/BaseProto";

export class MainBaseVo {
    viplv: number = 0;
    /**账号信息 */
    public mPlayer: stPlayerData;
    /**装备道具信息 */
    public mBaseInfo: stPlayerBaseInfo;

    AccountId: number;
    NickName: string;
    serverId: number;
    /**服务器名或者是别名 */
    serverName: string;
    lv:number;
    exp:number;
    trophy:number;
    HeadFrame:number;

    constructor() {
        this.AccountId = 0;
        this.NickName = "";
        this.serverId = 0;
        this.serverName = "";
        this.lv = 0;
        this.exp = 0;
        this.trophy = 0;
        this.HeadFrame = 0;
    }
}