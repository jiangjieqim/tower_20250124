import { EViewType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { IComposeModel } from "../compose/ICompose";
import { ComposeTips } from "../compose/views/ComposeTips";
import { GuideModel } from "./GuideModel";

/*
类型|参数1|参数2
1|1 检测合成按钮中的合成目标英雄的uid是否是1
4|23 没有英雄id23回退
5|25 界面25关闭中回退
*/

//=======================================
//#region params
/*
#######################################################################################
================= f_check_param =================

回退条件

4|23 没有英雄id23
5|25 EViewType的25界面关闭中
6|25 EViewType的25界面打开中
7|1  场景中存在uid==1的英雄
8|1  合成售卖小界面(EViewType.CompSell 39)中的uid不等于1


例子
7|1;8|1@7|1;5|39

; 与
@ 或

===================== f_dir ============================
tip所在的位置:上(1)下(0)右偏移(2)

0 tips框在上方
1 tips框在下方
2 tips框在左边

================= guidepre 的 f_param ==================
类型|数据部分1|数据部分2

1|3   获得到uid等于3的英雄下一步 否则回退
3|2|3 uid等于2的英雄有3个的时候下一步 否则回退
4|23  召唤到英雄id为23的英雄 否则回退

#######################################################################################
=============== t_PVE_Guide_Next${num} 条件触发下一个任务================

0 
f_time=1000  执行到1000毫秒之后下一个任务

1 
param="10003|2050|0" monsterid==10003的怪物移动到2050索引坐标之后下一个任务

2 
param="1|700|0"  阵营为0的流水号1的怪物移动到索引坐标700之后下一个任务
根据怪物流水号锁定(怪物流水号|怪物坐标索引|目标阵营) 

3
param="1" 流水号为1的怪物死亡的时候触发下一个任务

4 
所有怪物死亡触发(param:目标阵营)
param="0" 阵营为0的所有的怪物死亡的时候触发下一个任务

5 
param="64-fairyBtn" ui(64)组件(fairyBtn)显示的时候触发下一个任务

6 
param="2" 2类型的Boss(妖王)出生的时候触发 参数2,3代表boss类型下一个任务

7 
param="2|1200" 2类型的Boss(妖王)boss移动到索引位置1200的时候 参数2,3代表boss类型下一个任务

8 
param="23|0" 阵营0的出现heroid为23的英雄触发下一个任务

9
param="1" 怪物uid==1出生的时候触发

*/
//#endregion 

/**检测是否需要回退一步 */
export class CheckParamUtils{
    private static checkCell(guide:GuideModel,s:string){
        let arr = s.split("|");
        let model = guide.model;
        let type:number = parseInt(arr[0]);
        if(type == 4){
            let heroId: number = parseInt(arr[1]);
            let vo = model.refreshList.find(o => o.fid == heroId);
            if (vo) {

            } else {
                return true;
            }

        }
        else if(type == 5){
            let uiView: number = parseInt(arr[1]);
            if(!E.ViewMgr.isOpenReg(uiView)){
                return true;
            }            
        }
        else if(type == 6){
            let uiView: number = parseInt(arr[1]);
            if(E.ViewMgr.isOpenReg(uiView)){
                return true;
            }     
        }
        else if(type == 7){
            let uid:number = parseInt(arr[1]);
            if(model.refreshList.find(o=>o.uid == uid)){
                return true;
            }
        }else if(type == 8){
            if(E.ViewMgr.isOpenReg(EViewType.CompSell)){
                //合成售卖小界面开着
                let uid:number = parseInt(arr[1]);
                let _data = (E.ViewMgr.Get(EViewType.CompSell) as ComposeTips).data;
                if(_data){
                    if( _data.uid == uid){

                    }else{
                        // guide.preGuideStep();//回退
                        return true;//开着的售卖界面中的英雄uid不是1
                    }
                }
            }
        }
        return false;
    }

    private static checkArr(guide:GuideModel,f_check_param:string){
        let arr = f_check_param.split(";");//与标识符

        for(let i = 0;i < arr.length;i++){
            let s = arr[i];
            if(!StringUtil.IsNullOrEmpty(s)){
                if(this.checkCell(guide,s) == false){
                    return false;
                }
            }
        }

        // guide.preGuideStep();
        return true;
    }

    static check(guide:GuideModel,f_check_param:string,viewType:EViewType){
        let model:IComposeModel = guide.model;
        if(!model){
            return false;
        }
        if(!StringUtil.IsNullOrEmpty(f_check_param)){

            let orList = f_check_param.split("@");//或标识符
            let _status:boolean = false;
            for(let i = 0;i < orList.length;i++){
                let s1 = orList[i];
                if(!StringUtil.IsNullOrEmpty(s1)){
                    if(this.checkArr(guide,s1)){
                        LogSys.Log(`${viewType!=EViewType.None ? "hide:"+viewType:""} check ${s1} succeed pre step...`);
                        _status = true;
                        break;
                    }
                }
            }
            if(_status){
                guide.preGuideStep();
                return true;
            }
            //=============================================

            // if(f_check_param.indexOf(";")!=-1){
            //     return this.checkArr(guide,f_check_param);
            // }

/*
            let arr = f_check_param.split("|");
            let type:number = parseInt(arr[0]);
            if(type == 1){
                // 类型|参数1|参数2
                // 1 :检测合成按钮逻辑  1|1 检测合成按钮中的合成目标英雄的uid是否是1
                //1|1
                let uid:number = parseInt(arr[1]);
                if(model.refreshList.find(o=>o.uid == uid)){
                    if(E.ViewMgr.isOpenReg(EViewType.CompSell)){
                        //合成售卖小界面开着
                        let _data = (E.ViewMgr.Get(EViewType.CompSell) as ComposeTips).data;
                        if(_data){
                            if( _data.uid == uid){

                            }else{
                                guide.preGuideStep();//回退
                                return true;//开着的售卖界面中的英雄uid不是1
                            }
                        }
                    }else{
                        guide.preGuideStep();//回退
                        return true;
                    }
                }
                // 7|1;8|1@7|1;5|39
            }
*/            


            // else if(type == 2){
            //     //2 检测祈愿界面是否关闭 关闭就回退
            //     if(E.ViewMgr.isOpenReg(EViewType.Gamble)){

            //     }else{
            //         guide.preGuideStep();//回退
            //         return true;
            //     }
            // }
            //============================================


            // else if(type == 3){
            //     if(!E.ViewMgr.isOpenReg(EViewType.Mythos)){
            //         //3 :检测神话按钮逻辑  3|23 是否拥有英雄id23
            //         let heroId: number = parseInt(arr[1]);
            //         let vo = model.refreshList.find(o => o.fid == heroId);
            //         if (vo) {
            //         } else {
            //             GuideModel.Ins.preGuideStep();
            //             return true;
            //         }
            //     }
            // }                    
            //============================================

        }

        return false;
    }
}