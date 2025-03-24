//测试服 #####################################################################################
var initConfig = {
	asset: "https://winserver-game.wanhuir.com/Project1/Client/towertrunk/resource/",
	platform: 1,
	sy_url: "https://dev-server-game.wanhuir.com/tower",
	channel_key: "勇者挑战微信",
	ttappid: "05aab6eb058f41d3afd88147fa9b0aa1",
	adunitid: "adunit-69f12ee7fb73bd85",
	ver: "dev",
	appid: "tower_kaifazhong",
	debug: true,
	openid:"jjq1"//自定义用户

}
window["initConfig"] = initConfig;

//性能调试测试服 #####################################################################################
var initConfig = {
	asset: "https://winserver-game.wanhuir.com/Project1/Client/towertrunk/resource/",
	platform: 1,
	sy_url: "https://dev-server-game.wanhuir.com/tower",
	channel_key: "勇者挑战微信",
	ttappid: "05aab6eb058f41d3afd88147fa9b0aa1",
	adunitid: "adunit-69f12ee7fb73bd85",
	ver: "dev",
	appid: "tower_kaifazhong",
	debug: true,
	openid:"user003",//自定义用户	user00115
  
	Stat:1,
	debugshow:true,
	debug:true,
	// timeScale:0.1,
	//=============================
	disableSpineCache:true,
	disableTALog:true,
	// memoryDebugCount:20,
}
window["initConfig"] = initConfig;

/*


模式：回合制pvp
需要任务面板
初始货币：6-300|7-5
召唤价格：6-30 （无递增）
双方血量：1

引导流程：
1、播放战斗横幅
对手名称：新人导师
对手奖杯数：100
对手头像id：1
引导类型：强引导

2、任务面板：召唤英雄    任务说明：召唤10次英雄  （召唤英雄id：1,2,11,4,6,7,15,9,3,19）15:44 2024/12/28
引导点击召唤，引导一次后，玩家自由操作（只是没有强引导，但玩家只能点召唤），玩家3秒没有操作，”召唤按钮“出现弱引导的手指。

引导类型：弱引导，3秒之后没操作会有小手指

3、完成后，任务面板更新
任务面板：祈愿英雄    任务说明：祈愿3次英雄 
引导玩家进行1次蓝色（成功，英雄id：10）
2次紫色祈愿（第二次失败（给个提示框，祈愿也是可能失败的哦）
第三次成功，英雄id：12）
引导类型：强引导

4、完成后，任务面板更新
任务面板：召唤神话    任务说明：召唤神话英雄孙悟空
引导玩家点击召唤神话英雄孙悟空（弱引导，不操作一直用手引导指点）
引导类型：弱
祈愿锁定不让他点了

5、完成后，任务面板更新
任务面板：调整站位    任务说明：将孙悟空拖动至合适位置
引导玩家将孙悟空拖动至左上角（0,2），在这之前英雄是无法拖动的。（此时悟空的攻击距离的圈一直显示到结束）16:10 2024/12/28


6、完成后，任务面板消失
任务面板：准备战斗    任务说明：点击开始按钮

引导玩家点击开始战斗，点击后，敌人开始召唤，英雄id：（1,3,5,7,9,14,18），大概2秒召唤完成，然后进入战斗）

选择肉鸽------------------------------3张牌：（火烧，偷英雄，暗杀）

7、战斗开始，引导玩家点击中间区域（文本：每次战斗失败将会扣除1次血量，血量为0则战斗失败）
正常出怪打怪

 
8、完成后，任务面板更新
赢下比赛    提示：优先击杀怪物，取得战斗胜利



9：等我方怪物击杀完成，战斗结束，对方扣血，引导结束。

remark:已经召唤了孙悟空就需要skep引导
*/

/*
var initConfig = {
	asset:"https://winserver-game.wanhuir.com/Project1/Client/towertrunk/resource/",
	// asset:"https://cdnserver-game.wanhuir.com/cbsg/tower_2024_12_12/rev_out/",

	platform:1,
	sy_url:"https://server-game.wanhuir.com/tower",
	channel_key: "勇者挑战微信",
	ttappid:"05aab6eb058f41d3afd88147fa9b0aa1",  
	adunitid:"adunit-69f12ee7fb73bd85",
	ver:"tower_gray"
}
window["initConfig"] = initConfig;
*/
