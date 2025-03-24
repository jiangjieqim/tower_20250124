import { EBattle_Config, t_Battle_Config } from "../compose/t_Battle_Config";
import { t_FightGuideConfig, EFightGuide } from "./t_FightGuideConfig";
/*

8	2	11-guidemask1	指引拖拽				
9	2	11-guidestart	开始帧循环				
10	3		功能开启动画			64-betterBtn	
11	3	64-betterBtn	祈愿页签按钮		64-betterBtn		
12	3	24-con1-child0-btn	祈愿				
13	3	24-btn_close	祈愿关闭按钮				
14	3	11-guidestart					
15	4		功能开启动画			64-fairyBtn	
16	4	64-fairyBtn	神话按钮		64-fairyBtn		
17	4	25-summonBtn	神话召唤按钮				
18	4	11-guidestart	开始帧循环				
19	5	64-con1-child2-btn	第3张功能卡				1002
20	5	11-guidestart					

引导到uid为8的英雄位置 11-griduid-8

玩家初始卡牌：1,3,1001，10，57
牌库卡牌：1003,1002，其他随便塞，玩家看不到
第一波出怪间隔：500毫秒    关卡时间：15秒
第二波出怪间隔：200毫秒    关卡时间：15秒
第三波出怪间隔：就1个boss  关卡时间：20秒
1、进入战斗画面VS人机（人机名称：新人导师，奖杯数，100）
2、开始出怪（这一波共20只，怪物id：10001），出到第3只怪的时候，游戏暂停，出现引导召唤英雄，召唤5次 （英雄id：3,1,4,5,7） 文本：”快点击召唤按钮“，我方召唤完之后，敌方也会进行召唤，英雄id：4,1,10，8,2，间隔 300毫秒
完成召唤后，继续出怪
3、出到第15只怪的时候，引导点击查看卡牌及卡牌效果，卡牌id：1001，文本：”点击卡牌可查看具体效果，每张卡牌都具有特殊的能力，在关键时刻或许可以扭转战局。“
4、引导点击使用卡牌，卡牌id：1001，文本：”快使用卡牌窃取对手的资源“
5、引导玩家查看卡牌弹幕，文本：”这里可以查看到卡牌的使用结果，也可以看到对方使用的卡牌记录哦“
6、再引导召唤2次，获得一蓝（英雄id：9）+一紫（英雄id：11 飘召唤成功横幅） 我方召唤完之后，敌方也会进行召唤，英雄id：8,12，间隔 300毫秒
7、怪物增多（这一波有40个怪，怪物id：10002，移速快，出怪间隔短）（期间怪物数量超过35，会有横幅）
8、等怪物出完后，引导使用全屏秒杀卡（卡牌id：1003）牌杀死我方怪物   全屏特效（震撼效果）文本：”危险！怪物入侵，我们快守不住了！快使用卡牌消灭怪物“ 
9、第三波出BOSS来袭（横幅）怪物id：10003  这时候敌方合成出杨戬，英雄id：25
10、打3秒发现打不动，引导玩家祈愿  文本：”祈愿可以有概率获得高品质英雄“ 
再引导点击紫色祈愿 文本：”让我们来尝试史诗英雄祈愿“ 
11、祈愿成功（紫色，英雄id：15），引导关闭祈愿 文本：”太幸运啦，成功祈愿获得史诗英雄小白龙，这下我们可以进行神话英雄合成了“ 
点击神话按钮，文本：”快进行神话英雄合成吧，我已经迫不及待了“ 
12、点击召唤神话---孙悟空 文本：”点击召唤按钮，招募强力神话英雄孙悟空一举消灭妖王“ 
13、引导拖动悟空，文本：”孙悟空是近战英雄，拖动至妖王附近可以更快击杀妖王“ 
14、引导用户暗杀卡牌把对方唐僧杀死（卡牌id：1002），文本：”对手快坚持不住了，使用暗杀消灭对方神话英雄，给对手致命一击“ ，等待波次时间结束，对方没有在限定时间内杀死BOSS，游戏我方胜利 弹胜负原因，弹结算奖励
*/
export class FightGuideData {
    /**每次召唤的价格 */
    sommonOffsetPrice;
    /**召唤的道具id */
    sommonPriceItemId: number;
    /**召唤初始值 */
    sommonPriceInitVal: number;
    /**怪物波次数据 */
    wave: string;
    /**终止时间配置 */
    // stopStr: string;
    init() {
        let itemArr = t_Battle_Config.Ins.getValueById(EBattle_Config.SommonMoney).split("-");
        let itemonceArr = t_Battle_Config.Ins.getValueById(EBattle_Config.SommonMoneyOnce).split("-");
        this.sommonOffsetPrice = parseInt(itemonceArr[1]);
        this.sommonPriceItemId = parseInt(itemArr[0]);
        this.sommonPriceInitVal = parseInt(itemArr[1]);
        this.wave = t_FightGuideConfig.Ins.getValueById(EFightGuide.Wave);
        // this.stopStr = t_FightGuideConfig.Ins.getValueById(EFightGuide.WaveStop);

        // if(debug){
        //     this.wave = `12-10001-1|14-10002-40|20-10003-1`;
        // }
    
        
    }
}