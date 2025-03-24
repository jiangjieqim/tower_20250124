import { E } from "../../../../G";
import { stFightReport } from "../../../../network/protocols/BaseProto";

export class FightReportVo {
    /**每行英雄的数量 */
    readonly rowCount:number = 3;
    data: stFightReport;
    /**己方英雄id列表 */
    selfHeros:number[] = [];
    enemyHeros:number[] = [];
    constructor(_data: stFightReport) {
        this.data = _data;
        let arr = _data.superHeroFids.split("|");
        this.selfHeros = this.parseHeros(arr[0]);
        this.enemyHeros = this.parseHeros(arr[1]);
        // console.log(1);
    }
    /**英雄的最大函数 */
    private get maxHeroRow() {
        let len = Math.max(this.selfHeros.length,this.enemyHeros.length);
        let n = Math.ceil(len/this.rowCount);
        return Math.max(1,n);
    }

    /**英雄所在范围区域 */
    get botY(){
        let _cellHeight:number = 295 + this.maxHeroRow * 80;
        return _cellHeight;
    }

    /**界面的高度 */
    get cellHeight(){
        let botHeight:number = 60;
        return this.botY + botHeight;
    }

    private parseHeros(data: string) {
        let heroids: number[] = [];
        if (!StringUtil.IsNullOrEmpty(data)) {
            let heros = data.split("-");
            for (let i = 0; i < heros.length; i++) {
                let s = heros[i];
                if (!StringUtil.IsNullOrEmpty(s)) {
                    heroids.push(parseInt(s));
                }
            }
        }
        return heroids;
    }

    /**
     * 
     * 
     * 


我方怪物数量过多，失败
敌方怪物数量过多，胜利
我方未击杀妖王，失败
敌方未击杀妖王，胜利
我方妖王剩余血量高于对方，失败
敌方妖王剩余血量高于我方，胜利
我方优先击杀最终妖王，胜利
敌方优先击杀最终妖王，失败

     */
    get resultDesc() {
        // let s1: string = ""
        // switch (this.data.result) {
        //     case EFightReson.MonsterCount:
        //         s1 = E.getLang("reson02");
        //         break;
        //     case EFightReson.KillMBoss:
        //         s1 = E.getLang("reson04");
        //         break;
        //     case EFightReson.BossBlood:
        //         s1 = E.getLang("reson05");
        //         break;
        //     case EFightReson.FirstKillBoss:
        //         s1 = E.getLang("reson06");
        //         break;
        // }

        // let target:string = "";
        // if(this.data.result == EFightReson.FirstKillBoss){
        //     if(this.data.win){
        //         target =  E.getLang("reson01");//我方
        //     }else{
        //         target =  E.getLang("reson03");//敌方
        //     }
        // }else{
        //     if(this.data.win){
        //         target =  E.getLang("reson03");//敌方
        //     }else{
        //         target =  E.getLang("reson01");//我方
        //     }
        // }

        let arr = E.getLang("fightresulttypes").split("|");
        return arr[(this.data.result - 1) * 2 + this.data.win] || "";
    }
}