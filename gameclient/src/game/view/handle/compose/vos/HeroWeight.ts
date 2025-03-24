import { stElement } from "../../../../network/protocols/BaseProto";
import { MainModel } from "../../main/model/MainModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeModel } from "../ComposeModel";
import { t_Hero_Synthesis_Weight } from "../t_Hero_Synthesis_Weight";
// class TempHeroVo {
//     heroId: number;
//     count: number;
// }

export class HeroWeight {

    /**计算英雄获得权重 */
    static calPercent(heroId: number) {
        let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(heroId);
        // this.icon.skin = HeroListProxy.Ins.getHeadIcon(_heroCfg.f_headid);
        /*
        heroId = 21 ---> f_synthesis                              f_synthesis_money
                         3-->f_qua(1) 4->f_qua(1)
                 
        t_Hero_Synthesis_Weight

        1：白卡
        2：蓝卡
        3：紫卡
        4：橙卡
        5：红卡
        6：局内金币
        7：局内幸运币
        */

        //英雄权重
        let _all_weight: number = 0;//总权重
        let _curWeight: number = 0;//自己的权重
        if(!StringUtil.IsNullOrEmpty(_heroCfg.f_synthesis)){
            let heroArr: string[] = _heroCfg.f_synthesis.split("|");//合成需要的英雄
            let _heroCountMaps = {};//英雄数量maps
            let heroList:stElement[] = ComposeModel.Ins.refreshList;
            for(let i = 0;i < heroList.length;i++){
                let cell = heroList[i];
                if(cell.playerId == MainModel.Ins.mRoleData.AccountId){
                    // if(cell.fid)
                    if(!_heroCountMaps[cell.fid]){
                        _heroCountMaps[cell.fid] = 0;
                    }
                    _heroCountMaps[cell.fid]+=cell.num;
                }
            }

            for (let i = 0; i < heroArr.length; i++) {
                let _compHeroId: number = parseInt(heroArr[i]);
                let _compHeroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(_compHeroId);
                let val: number = t_Hero_Synthesis_Weight.Ins.getWeight(_compHeroCfg.f_qua);
                _all_weight += val;
                if(_heroCountMaps[_compHeroId] && _heroCountMaps[_compHeroId] > 0){
                    _heroCountMaps[_compHeroId]--;
                    _curWeight += val;
                }
            }
        }

        if(!StringUtil.IsNullOrEmpty(_heroCfg.f_synthesis_money)){
            //货币消耗权重
            let _itemArr: string[] = _heroCfg.f_synthesis_money.split("|");
            for (let i = 0; i < _itemArr.length; i++) {
                let cell: string[] = _itemArr[i].split("-");
                let itemId: number = parseInt(cell[0]);
                let count: number = parseInt(cell[1]);
                let val = t_Hero_Synthesis_Weight.Ins.getWeight(itemId) * count;
                _all_weight += val;

                let have = MainModel.Ins.mRoleData.getVal(itemId);
                if (have > count) {
                    _curWeight += val;
                } else {
                    _curWeight += have / count * val;
                }
            }
        }
        // console.log(`_weight:${_weight}-->${_curWeight / _weight}`);

        //保留一位向下取整
        // this.tf.text = Math.floor(_curWeight / _weight * 100) + "%";
        return Math.floor(_curWeight / _all_weight * 100);
    }
}