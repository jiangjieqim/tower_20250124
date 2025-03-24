
export class Gm_req{
public protoid:number = 1000
	/*GM字符串*/
	public datas:string;

public write(b){
let len;
b.writeUTFString(this.datas||"");

}
	constructor(){}
}/*心跳请求 协议id:1001*/
export class Heartbeat_req{
public protoid:number = 1001
public write(b){
let len;

}
	constructor(){}
}/*心跳返回 协议id:1002*/
export class Heartbeat_revc{
public protoid:number = 1002
public read(b){
let len;

}
	constructor(){}
}/*踢出通知 协议id:1003*/
export class Kick_revc{
public protoid:number = 1003
	/*踢出原因  
    AccountDuplicate = 0,//同名账号登录
    Underage = 1,//未成年
    */
	public reason:number;

public read(b){
let len;
this.reason=b.readUint8()

}
	constructor(){}
}/*通用功能错误码 协议id:1004*/
export class Err_revc{
public protoid:number = 1004
	/*
        //错误码,描述,配置到\Project1\Excel\t_Err.xlsx中
    */
	public reason:number;

public read(b){
let len;
this.reason=b.readUint16()

}
	constructor(){}
}/*玩家等级变化 协议id:1005*/
export class PlayerLevelChange_revc{
public protoid:number = 1005
	/*玩家当前等级*/
	public level:number;

public read(b){
let len;
this.level=b.readUint16()

}
	constructor(){}
}/*玩家经验变化 协议id:1006*/
export class PlayerCurExpChange_revc{
public protoid:number = 1006
	/*当前等级下的经验值*/
	public curLevelExp:number;

public read(b){
let len;
this.curLevelExp=b.readUint32()

}
	constructor(){}
}/*奖杯变化后的值 协议id:1007*/
export class TrophyChange_revc{
public protoid:number = 1007
	/*角色最新的奖杯数量*/
	public trophy:number;

public read(b){
let len;
this.trophy=b.readUint32()

}
	constructor(){}
}/*玩家注册请求 协议id:3001*/
export class WebClientRegist_req{
public protoid:number = 3001
	/*平台类型*/
	public pid:number;

	/*账号id*/
	public account:string;

	/*账号密码*/
	public password:string;

public write(b){
let len;
b.writeUint8(this.pid);
b.writeUTFString(this.account||"");
b.writeUTFString(this.password||"");

}
	constructor(){}
}/*玩家注册返回 协议id:3002*/
export class WebClientRegist_revc{
public protoid:number = 3002
	/*错误码 Success = 0//注册成功Failed = 1,//注册失败AlreadyExist = 2,//该账号已经存在*/
	public errorID:number;

	/*
    平台类型 
    
    Internal = 0,内部登录 
    WxMini = 1,微信小游戏*/
	public pid:number;

public read(b){
let len;
this.errorID=b.readUint8()
this.pid=b.readUint8()

}
	constructor(){}
}/*玩家登录请求 协议id:3003*/
export class WebClientLogin_req{
public protoid:number = 3003
	/*平台类型*/
	public pid:number;

	/*账号id*/
	public account:string;

	/*账号密码*/
	public password:string;

	/*设备ID*/
	public sceneid:string;

	/*微信openid,非微信传空字符串*/
	public openid:string;

public write(b){
let len;
b.writeUint8(this.pid);
b.writeUTFString(this.account||"");
b.writeUTFString(this.password||"");
b.writeUTFString(this.sceneid||"");
b.writeUTFString(this.openid||"");

}
	constructor(){}
}/*玩家登录返回 协议id:3004*/
export class WebClientLogin_revc{
public protoid:number = 3004
	/*错误码
            Success = 0,//登录成功
            Failed = 1,//登录失败
            AccountStopUseing = 2,//账号停用中
            NoAccount = 3,//账号不存在
            PasswordError = 4,//密码错误
            Underage = 5, //未成年
    */
	public errorID:number;

	/*服务配置信息*/
	public serverConfig:stServerConfig=new stServerConfig();

	/*玩家数据*/
	public playerData:stPlayerData=new stPlayerData();

	/*玩家基础信息*/
	public BaseInfo:stPlayerBaseInfo=new stPlayerBaseInfo();

	/*0老角色 1新角色*/
	public newRole:number;

	/*赛季*/
	public season:number;

	/*是否是当天首次登录 0否 1是*/
	public todayFirstLogin:number;

	/*今日已获得的神魄次数,变化走10262(全量)*/
	public todaySpirit:number;

public read(b){
let len;
this.errorID=b.readUint8()
this.serverConfig.read(b);
this.playerData.read(b);
this.BaseInfo.read(b);
this.newRole=b.readUint8()
this.season=b.readUint8()
this.todayFirstLogin=b.readUint8()
this.todaySpirit=b.readUint8()

}
	constructor(){}
}/*空协议返回 协议id:3005*/
export class Empty_revc{
public protoid:number = 3005
	/*自定义空协议返回的code
        1 取消匹配成功
        2 战斗匹配功能卡佩戴不足
        3 战斗匹配一键佩戴功能卡成功后再次匹配战斗
        4 功能卡分解成功
        5 好友战等待超时
        6 创建房间时候功能卡不足
        7 进入房间功能卡不足
        8 pve体力不足(弃用)
        9 体力购买成功
        10 pvp/pve匹配超时
        11 关闭匹配界面
        12 匹配取消
        13 邀请码绑定成功
        14 切磋取消
        */
	public code:number;

public read(b){
let len;
this.code=b.readUint16()

}
	constructor(){}
}export class stServerConfig{
public protoid:number = undefined
	/*心跳间隔毫秒*/
	public HeartMillisecond:number;

	/*服务器时间(秒)*/
	public ServerTime:number;

	/*开服时间戳,没有传0*/
	public openTime:number;

public write(b){
let len;
b.writeUint32(this.HeartMillisecond);
b.writeUint32(this.ServerTime);
b.writeUint32(this.openTime);

}
public read(b){
let len;
this.HeartMillisecond=b.readUint32()
this.ServerTime=b.readUint32()
this.openTime=b.readUint32()

}
	constructor(){}
}export class stPlayerData{
public protoid:number = undefined
	/*账号*/
	public Account:string;

	/*角色昵称*/
	public NickName:string;

	/*账号ID*/
	public AccountId:number;

	/*头像*/
	public HeadUrl:string;

	/*区服id*/
	public serverId:number;

	/*区服名称*/
	public serverName:string;

	/*玩家当前等级*/
	public level:number;

	/*当前等级下的经验值*/
	public curLevelExp:number;

	/*初始的奖杯数*/
	public trophy:number;

	/*头像框*/
	public HeadFrame:number;

public write(b){
let len;
b.writeUTFString(this.Account||"");
b.writeUTFString(this.NickName||"");
b.writeUint32(this.AccountId);
b.writeUTFString(this.HeadUrl||"");
b.writeUint32(this.serverId);
b.writeUTFString(this.serverName||"");
b.writeUint16(this.level);
b.writeUint32(this.curLevelExp);
b.writeUint32(this.trophy);
b.writeUint8(this.HeadFrame);

}
public read(b){
let len;
this.Account=b.readUTFString()
this.NickName=b.readUTFString()
this.AccountId=b.readUint32()
this.HeadUrl=b.readUTFString()
this.serverId=b.readUint32()
this.serverName=b.readUTFString()
this.level=b.readUint16()
this.curLevelExp=b.readUint32()
this.trophy=b.readUint32()
this.HeadFrame=b.readUint8()

}
	constructor(){}
}export class stPlayerBaseInfo{
public protoid:number = undefined
	/*基础信息*/
	public moneyInfo:stCellValue[];

public write(b){
let len;

this.moneyInfo=this.moneyInfo||[];
len = this.moneyInfo.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.moneyInfo[i].write(b);
}

}
public read(b){
let len;
this.moneyInfo=this.moneyInfo||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.moneyInfo.push(item);

}

}
	constructor(){}
}export class stCellValue{
public protoid:number = undefined
	/*货币类型1:元宝 2:铜钱 */
	public id:number;

	/*数量*/
	public count:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint32(this.count);

}
public read(b){
let len;
this.id=b.readUint16()
this.count=b.readUint32()

}
	constructor(){}
}export class stCellValue2{
public protoid:number = undefined
	/*货币类型1:元宝 2:铜钱 */
	public id:number;

	/*数量（支持负数）*/
	public count:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeInt32(this.count);

}
public read(b){
let len;
this.id=b.readUint16()
this.count=b.readInt32()

}
	constructor(){}
}/*只推送变化的值 协议id:3009*/
export class ValChanel_revc{
public protoid:number = 3009
	/*数据列表*/
	public itemList:stCellValue[];

public read(b){
let len;
this.itemList=this.itemList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.itemList.push(item);

}

}
	constructor(){}
}/*初始化后通知 协议id:3010*/
export class Init_revc{
public protoid:number = 3010
public read(b){
let len;

}
	constructor(){}
}export class stActivityStatus{
public protoid:number = undefined
	/*活动id*/
	public activityId:number;

	/*1开启 0关闭*/
	public status:number;

	/*活动开始时间*/
	public starttime:number;

	/*活动结束时间 无结束为0*/
	public endtime:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint8(this.status);
b.writeUint32(this.starttime);
b.writeUint32(this.endtime);

}
public read(b){
let len;
this.activityId=b.readUint16()
this.status=b.readUint8()
this.starttime=b.readUint32()
this.endtime=b.readUint32()

}
	constructor(){}
}export class stActivityCell{
public protoid:number = undefined
	/*主功能对于的配置表id*/
	public id:number;

	/*
    默认:
    参数 0不可领取 1可领取 2已领取
    /////////////////////////////////////////////
    战令(a,b奖励 a非充值奖励 b充值奖励)
    0不可领取(未满足条件) 1可领取(未充值 a可领) 2已领取(未充值 a已领) 11可领取(已充值 a,b可领) 12已领取(已充值 a,b已领) 13领取中(已充值 a已领b可领) 14领取中(已充值 a可领b已领)

    8蟠桃盛宴(0不可领取 1可领取 2已领取 3可补领)

    弹出礼包(礼包领取的次数)
    */
	public param1:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint8(this.param1);

}
public read(b){
let len;
this.id=b.readUint16()
this.param1=b.readUint8()

}
	constructor(){}
}export class stActivity{
public protoid:number = undefined
	/*活动id*/
	public activityId:number;

	/*列表*/
	public datalist:stActivityCell[];

public write(b){
let len;
b.writeUint16(this.activityId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.activityId=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stActivityCell()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*活动列表 初始化一次 只发1已领取 2可领取 协议id:3084*/
export class ActivityListInit_revc{
public protoid:number = 3084
	/*列表状态*/
	public status:stActivityStatus[];

	/*列表数据*/
	public datalist:stActivity[];

public read(b){
let len;
this.status=this.status||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stActivityStatus()
item.read(b);
this.status.push(item);

}
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stActivity()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*活动数据变化的时候推送变量 或者活动数据主动变化的时候 协议id:3085*/
export class ActivityChange_revc{
public protoid:number = 3085
	/*0 代表只更新某一条,1 的代表整个datalist*/
	public type:number;

	/*列表*/
	public datalist:stActivity[];

public read(b){
let len;
this.type=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stActivity()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*活动状态数据列表,活动开启关闭变化的时候需要推送 协议id:3086*/
export class ActivityStatus_revc{
public protoid:number = 3086
	/*列表*/
	public datalist:stActivityStatus[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stActivityStatus()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取 协议id:3087*/
export class ActivityAction_req{
public protoid:number = 3087
	/*活动id*/
	public activityId:number;

	/*功能对于的配置表id(0标识一键领取)*/
	public id:number;

	/*
    额外信息参数(字符串为了后期扩展),默认未空。
    战令 不传或0是非任务 1标识每日任务 2每周任务 3赛季任务
    基金 传type
    电鱼活动 传抽取次数1(单次) 10(十连)
    大鹅活动 传抽取次数1(单次) 10(十连)
    */
	public extra:string;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint16(this.id);
b.writeUTFString(this.extra||"");

}
	constructor(){}
}/*月卡、终身卡初始化信息 协议id:3088*/
export class MonthCardInit_revc{
public protoid:number = 3088
	/*月卡的结束时间戳 0标识未购买月卡*/
	public monthCardEndUnix:number;

	/*每日奖励领取 flag是月卡奖励表fid cnt标识礼包状态*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.monthCardEndUnix=b.readUint32()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*月卡结束时间变化 协议id:3089*/
export class MonthCardUnix_revc{
public protoid:number = 3089
	/*月卡的结束时间戳 0标识未购买月卡*/
	public unix:number;

public read(b){
let len;
this.unix=b.readUint32()

}
	constructor(){}
}/*月卡、终身卡每日奖励领取次数变化(领的时候发变量,系统刷新是全量) 协议id:3090*/
export class MonthCardRewardTimes_revc{
public protoid:number = 3090
	/*0单个变量 1列表变化*/
	public isList:number;

	/*每日奖励领取 flag是月卡奖励表fid cnt标识礼包状态*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.isList=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*订单请求 协议id:3094*/
export class RechargeBill_req{
public protoid:number = 3094
	/*充值表id*/
	public id:number;

public write(b){
let len;
b.writeUint32(this.id);

}
	constructor(){}
}/*订单请求 协议id:3095*/
export class RechargeBill_revc{
public protoid:number = 3095
	/*充值表id*/
	public id:number;

	/*签名*/
	public val:string;

public read(b){
let len;
this.id=b.readUint32()
this.val=b.readUTFString()

}
	constructor(){}
}/*已领取充值双倍的信息初始化返回 协议id:3096*/
export class RechargeDoubledInit_revc{
public protoid:number = 3096
	/*已领取充值双倍的信息(充值表id)*/
	public datalist:number[];

public read(b){
let len;
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint16())
}

}
	constructor(){}
}/*已领取充值双倍的信息变化 协议id:3097*/
export class RechargeDoubled_revc{
public protoid:number = 3097
	/*已领取充值双倍的信息(充值表id)*/
	public datalist:number[];

public read(b){
let len;
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint16())
}

}
	constructor(){}
}/*道具不足 协议id:3107*/
export class ItemNotEnoughCode_revc{
public protoid:number = 3107
	/*t_item配置的f_itemid*/
	public id:number;

public read(b){
let len;
this.id=b.readUint32()

}
	constructor(){}
}/*获取服务器时间戳 协议id:3400*/
export class GetServerTimeMS_req{
public protoid:number = 3400
public write(b){
let len;

}
	constructor(){}
}/*获取服务器时间戳 协议id:3401*/
export class GetServerTimeMS_revc{
public protoid:number = 3401
	/*服务器时间(毫秒)*/
	public serverTime:number;

public read(b){
let len;
this.serverTime=b.readUint32()

}
	constructor(){}
}/*微信登录 协议id:3252*/
export class wxLogin_req{
public protoid:number = 3252
	/*微信小游戏appid*/
	public appid:string;

	/*微信用户openid*/
	public openid:string;

	/*数数distinctId*/
	public distinctId:string;

	/*选服http请求返回的token*/
	public token:string;

	/*0 不是断线重连 1 是断线重连*/
	public type:number;

	/*微信场景码,没有传0*/
	public scene:number;

	/*邀请者的玩家id，没有传0*/
	public inviterId:number;

	/*渠道id，没有传0*/
	public tunnelId:number;

	/*年龄*/
	public age:number;

public write(b){
let len;
b.writeUTFString(this.appid||"");
b.writeUTFString(this.openid||"");
b.writeUTFString(this.distinctId||"");
b.writeUTFString(this.token||"");
b.writeUint8(this.type);
b.writeUint16(this.scene);
b.writeUint32(this.inviterId);
b.writeUint32(this.tunnelId);
b.writeUint8(this.age);

}
	constructor(){}
}/*创建信息在3010之前发 协议id:3788*/
export class CreateRoleInfo_revc{
public protoid:number = 3788
	/*是否是新创角 0否 1是*/
	public isNew:number;

	/*创建角色的时间戳*/
	public createUnix:number;

public read(b){
let len;
this.isNew=b.readUint8()
this.createUnix=b.readUint32()

}
	constructor(){}
}/*区服详情*/
export class stServerItem{
public protoid:number = undefined
	/*区服名称*/
	public serverName:string;

	/*区服冠名*/
	public naming:string;

	/*区服ID*/
	public serverID:number;

	/*区服状态 1爆满 2畅通 3维护*/
	public serverState:number;

	/*是否是新服*/
	public isNew:number;

	/*区服下角色等级 0标识没有角色*/
	public roleLevel:number;

	/*玩家名*/
	public roleName:string;

public write(b){
let len;
b.writeUTFString(this.serverName||"");
b.writeUTFString(this.naming||"");
b.writeUint32(this.serverID);
b.writeUint8(this.serverState);
b.writeUint8(this.isNew);
b.writeUint8(this.roleLevel);
b.writeUTFString(this.roleName||"");

}
public read(b){
let len;
this.serverName=b.readUTFString()
this.naming=b.readUTFString()
this.serverID=b.readUint32()
this.serverState=b.readUint8()
this.isNew=b.readUint8()
this.roleLevel=b.readUint8()
this.roleName=b.readUTFString()

}
	constructor(){}
}/*使用道具 协议id:3106*/
export class UseItem_req{
public protoid:number = 3106
	/*使用场景0通用场景 1宝箱加速*/
	public type:number;

	/*物品列表*/
	public itemlist:stCellValue[];

	/*额外信息 type=1时候传递宝箱pos*/
	public extra:string;

public write(b){
let len;
b.writeUint8(this.type);

this.itemlist=this.itemlist||[];
len = this.itemlist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.itemlist[i].write(b);
}
b.writeUTFString(this.extra||"");

}
	constructor(){}
}export class stCellValueConvert{
public protoid:number = undefined
	/*原始道具信息*/
	public original:stCellValue=new stCellValue();

	/*是否被转化 0未转化 1转化为道具 2转化为英雄*/
	public isConverted:number;

	/*转化后对应id,未转化为0*/
	public convertedId:number;

	/*转化后的数量,未转化为0*/
	public convertedNum:number;

public write(b){
let len;
this.original.write(b);
b.writeUint8(this.isConverted);
b.writeUint16(this.convertedId);
b.writeUint32(this.convertedNum);

}
public read(b){
let len;
this.original.read(b);
this.isConverted=b.readUint8()
this.convertedId=b.readUint16()
this.convertedNum=b.readUint32()

}
	constructor(){}
}/*领取奖励 失败返回通用错误码 协议id:3025*/
export class Reward_revc{
public protoid:number = 3025
	/*类型0 默认通用类型,1宝箱获得的奖励 2新版pve新手引导奖励 3pvp回合制引导奖励 4套大鹅奖励*/
	public type:number;

	/*奖励数据列表*/
	public rewardList:stCellValue[];

	/*道具转化信息*/
	public convertedList:stCellValueConvert[];

	/*宝箱奖励*/
	public boxes:stBoxReward[];

public read(b){
let len;
this.type=b.readUint8()
this.rewardList=this.rewardList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.rewardList.push(item);

}
this.convertedList=this.convertedList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValueConvert()
item.read(b);
this.convertedList.push(item);

}
this.boxes=this.boxes||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBoxReward()
item.read(b);
this.boxes.push(item);

}

}
	constructor(){}
}/*服务器版本号 协议id:3262*/
export class ServerVersion_revc{
public protoid:number = 3262
	/*版本号*/
	public val:string;

public read(b){
let len;
this.val=b.readUTFString()

}
	constructor(){}
}/*邮件结构体*/
export class stMail{
public protoid:number = undefined
	/*邮件id*/
	public uid:number;

	/*邮件标题*/
	public title:string;

	/*邮件内容*/
	public content:string;

	/*邮件模板id 非0的就用模板*/
	public templateId:number;

	/*模板参数*/
	public params:string[];

	/*可领取的物品列表*/
	public itemlist:stCellValue[];

	/*邮件状态 0未读 1已读 2未领取 3已领取 4已删除*/
	public state:number;

	/*发布时间戳*/
	public time:number;

	/*到期时间戳 0标识不到期*/
	public expTime:number;

public write(b){
let len;
b.writeUint32(this.uid);
b.writeUTFString(this.title||"");
b.writeUTFString(this.content||"");
b.writeUint16(this.templateId);

this.params=this.params||[];
len = this.params.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUTFString(this.params[i]||"");
}

this.itemlist=this.itemlist||[];
len = this.itemlist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.itemlist[i].write(b);
}
b.writeUint8(this.state);
b.writeUint32(this.time);
b.writeUint32(this.expTime);

}
public read(b){
let len;
this.uid=b.readUint32()
this.title=b.readUTFString()
this.content=b.readUTFString()
this.templateId=b.readUint16()
this.params=this.params||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.params.push(b.readUTFString())
}
this.itemlist=this.itemlist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.itemlist.push(item);

}
this.state=b.readUint8()
this.time=b.readUint32()
this.expTime=b.readUint32()

}
	constructor(){}
}/*邮件红点（3010前和游戏中收到新邮件时都推） 协议id:3263*/
export class MailRed_revc{
public protoid:number = 3263
	/*红点 0无 1有红点*/
	public red:number;

public read(b){
let len;
this.red=b.readUint8()

}
	constructor(){}
}/*邮件列表（返回3265） 协议id:3264*/
export class MailList_req{
public protoid:number = 3264
	/*邮件id（删除已读、一键领取时传0）*/
	public uid:number;

	/*0返回邮件列表 1已读或领取 2删除*/
	public type:number;

public write(b){
let len;
b.writeUint32(this.uid);
b.writeUint8(this.type);

}
	constructor(){}
}/*邮件列表 协议id:3265*/
export class MailList_revc{
public protoid:number = 3265
	/*邮件列表*/
	public datalist:stMail[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMail()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*配置文件hash 协议id:3258*/
export class ConfigHash_revc{
public protoid:number = 3258
	/*值*/
	public val:string;

public read(b){
let len;
this.val=b.readUTFString()

}
	constructor(){}
}/*跨天刷新 协议id:3394*/
export class FundRefresh_req{
public protoid:number = 3394
public write(b){
let len;

}
	constructor(){}
}/*红点结构体*/
export class stRedDot{
public protoid:number = undefined
	/*红点类型,或者红点的值*/
	public type:number;

	/*红点id*/
	public id:number;

public write(b){
let len;
b.writeUint32(this.type);
b.writeUint32(this.id);

}
public read(b){
let len;
this.type=b.readUint32()
this.id=b.readUint32()

}
	constructor(){}
}/*红点列表 上线的时候有且只有一次推送 协议id:3267*/
export class RedDotUpdate_revc{
public protoid:number = 3267
	/*列表*/
	public datalist:stRedDot[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stRedDot()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*红点更新、添加 协议id:3268*/
export class RedDotUpdate_req{
public protoid:number = 3268
	/*列表*/
	public datalist:stRedDot[];

public write(b){
let len;

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
	constructor(){}
}/*红点删除 协议id:3269*/
export class RedDotDel_req{
public protoid:number = 3269
	/*列表*/
	public datalist:number[];

public write(b){
let len;

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint16(this.datalist[i]);
}

}
	constructor(){}
}/*形象*/
export class stSkin{
public protoid:number = undefined
	/*头部ID*/
	public f_HeadID:number;

	/*武器ID*/
	public f_WeaponID:number;

	/*盾ID*/
	public f_ShieldID:number;

	/*翅膀ID*/
	public f_WingID:number;

	/*马ID*/
	public f_MountID:number;

	/*身体ID*/
	public f_BodyID:number;

	/*远程攻击弹道，0表示非远程攻击*/
	public f_BulletPic:number;

	/*魔兽人物形象ID*/
	public f_WarSkinID:number;

	/*魔兽翅膀形象ID*/
	public f_WarWingID:number;

	/*魔兽坐骑形象ID*/
	public f_WarMountID:number;

public write(b){
let len;
b.writeUint16(this.f_HeadID);
b.writeUint16(this.f_WeaponID);
b.writeUint16(this.f_ShieldID);
b.writeUint16(this.f_WingID);
b.writeUint16(this.f_MountID);
b.writeUint16(this.f_BodyID);
b.writeUint16(this.f_BulletPic);
b.writeUint16(this.f_WarSkinID);
b.writeUint16(this.f_WarWingID);
b.writeUint16(this.f_WarMountID);

}
public read(b){
let len;
this.f_HeadID=b.readUint16()
this.f_WeaponID=b.readUint16()
this.f_ShieldID=b.readUint16()
this.f_WingID=b.readUint16()
this.f_MountID=b.readUint16()
this.f_BodyID=b.readUint16()
this.f_BulletPic=b.readUint16()
this.f_WarSkinID=b.readUint16()
this.f_WarWingID=b.readUint16()
this.f_WarMountID=b.readUint16()

}
	constructor(){}
}/*装备属性*/
export class stEquipAttr{
public protoid:number = undefined
	/*属性类型id*/
	public id:number;

	/*属性值*/
	public value:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint32(this.value);

}
public read(b){
let len;
this.id=b.readUint16()
this.value=b.readUint32()

}
	constructor(){}
}/*英雄信息*/
export class stElement{
public protoid:number = undefined
	/*英雄的流水号*/
	public uid:number;

	/*t_Hero.xlsx的f_heroid*/
	public fid:number;

	/*英雄皮肤id*/
	public skinId:number;

	/*英雄个数*/
	public num:number;

	/*地图上的x坐标*/
	public x:number;

	/*地图上的y坐标*/
	public y:number;

	/*0表示己方 >0表示敌方*/
	public playerId:number;

	/*0不是分身 1是分身*/
	public clone:number;

public write(b){
let len;
b.writeUint16(this.uid);
b.writeUint16(this.fid);
b.writeUint16(this.skinId);
b.writeUint8(this.num);
b.writeUint8(this.x);
b.writeUint8(this.y);
b.writeUint32(this.playerId);
b.writeUint8(this.clone);

}
public read(b){
let len;
this.uid=b.readUint16()
this.fid=b.readUint16()
this.skinId=b.readUint16()
this.num=b.readUint8()
this.x=b.readUint8()
this.y=b.readUint8()
this.playerId=b.readUint32()
this.clone=b.readUint8()

}
	constructor(){}
}/*组合 协议id:3270*/
export class ComposeMap_revc{
public protoid:number = 3270
	/*地图上已摆放的动物、格子列表（全部量）*/
	public datalist:stElement[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stElement()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*移动英雄（返回10005） 协议id:3271*/
export class ComposeItem_req{
public protoid:number = 3271
	/*动物、格子的流水号*/
	public uid:number;

	/*摆放在地图上的x坐标*/
	public x:number;

	/*摆放在地图上的y坐标*/
	public y:number;

public write(b){
let len;
b.writeUint16(this.uid);
b.writeUint8(this.x);
b.writeUint8(this.y);

}
	constructor(){}
}/*组合结果 协议id:3272*/
export class ComposeItem_revc{
public protoid:number = 3272
	/*1放置，2升级，3解锁地图格子*/
	public type:number;

	/*更新后的动物、格子信息信息（变化量）*/
	public updatelist:stElement[];

	/*升级动物后，消失的动物uid列表（变化量）*/
	public dellist:number[];

public read(b){
let len;
this.type=b.readUint8()
this.updatelist=this.updatelist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stElement()
item.read(b);
this.updatelist.push(item);

}
this.dellist=this.dellist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.dellist.push(b.readUint16())
}

}
	constructor(){}
}/*公告结构体*/
export class stNotice{
public protoid:number = undefined
	/*公告流水号*/
	public uid:number;

	/*公告类型（1弹出公告 3跑马灯）*/
	public type:number;

	/*弹出公告频率 1强弹（进入游戏时弹出）2不强弹（进入游戏时不弹出，用户点击公告按钮时弹出）*/
	public frequent:number;

	/*公告标题*/
	public title:string;

	/*公告内容*/
	public content:string;

	/*模板id*/
	public templateId:number;

	/*模板参数*/
	public params:string[];

	/*发布时间戳*/
	public time:number;

public write(b){
let len;
b.writeUint32(this.uid);
b.writeUint8(this.type);
b.writeUint8(this.frequent);
b.writeUTFString(this.title||"");
b.writeUTFString(this.content||"");
b.writeUint8(this.templateId);

this.params=this.params||[];
len = this.params.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUTFString(this.params[i]||"");
}
b.writeUint32(this.time);

}
public read(b){
let len;
this.uid=b.readUint32()
this.type=b.readUint8()
this.frequent=b.readUint8()
this.title=b.readUTFString()
this.content=b.readUTFString()
this.templateId=b.readUint8()
this.params=this.params||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.params.push(b.readUTFString())
}
this.time=b.readUint32()

}
	constructor(){}
}/*公告列表（3010前推，游戏中会主动推跑马灯公告） 协议id:3292*/
export class NoticeList_revc{
public protoid:number = 3292
	/*公告列表*/
	public datalist:stNotice[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stNotice()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*功能初始化数据(3010之前) 协议id:10000*/
export class FuncInit_revc{
public protoid:number = 10000
	/*已开启的功能列表*/
	public datalist:number[];

public read(b){
let len;
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint16())
}

}
	constructor(){}
}/*功能数据变化 协议id:10001*/
export class FuncChange_revc{
public protoid:number = 10001
	/*0功能关闭 1新增功能*/
	public type:number;

	/*变动的功能*/
	public datalist:number[];

public read(b){
let len;
this.type=b.readUint8()
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint16())
}

}
	constructor(){}
}/*定时任务时间数据*/
export class stTimer{
public protoid:number = undefined
	/*分类,0体力*/
	public category:number;

	/*时间戳,0标识定时任务结束*/
	public unix:number;

public write(b){
let len;
b.writeUint8(this.category);
b.writeUint32(this.unix);

}
public read(b){
let len;
this.category=b.readUint8()
this.unix=b.readUint32()

}
	constructor(){}
}/*定时任务时间数据初始化数据(3010之前) 协议id:10002*/
export class TimerInit_revc{
public protoid:number = 10002
	/*定时任务相关时间数据*/
	public datalist:stTimer[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTimer()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*定时任务时间变化或新增 协议id:10003*/
export class TimerChange_revc{
public protoid:number = 10003
	/*定时任务相关时间数据*/
	public datalist:stTimer[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTimer()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*刷新组合列表（返回10005） 协议id:10004*/
export class ComposeFresh_req{
public protoid:number = 10004
	/*刷新类型 1每回合系统刷新 2银币刷新 3广告刷新*/
	public type:number;

public write(b){
let len;
b.writeUint8(this.type);

}
	constructor(){}
}/*动物、格子变化量 协议id:10005*/
export class ComposeUpdate_revc{
public protoid:number = 10005
	/*功能卡id*/
	public cardId:number;

	/*功能卡序列号*/
	public serialNum:number;

	/*0刷新 1合成 2移动 3售卖 4功能卡 5赌博 6变身 7分身 8分身过期（移除英雄）9技能召唤 10消灭自己（技能）11冻结格子 12换成同品质的其他英雄*/
	public type:number;

	/*刷到的动物、格子列表*/
	public datalist:stElement[];

	/*升级动物后，消失的动物uid列表（变化量）*/
	public dellist:number[];

public read(b){
let len;
this.cardId=b.readUint16()
this.serialNum=b.readUint32()
this.type=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stElement()
item.read(b);
this.datalist.push(item);

}
this.dellist=this.dellist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.dellist.push(b.readUint16())
}

}
	constructor(){}
}/*动物、格子移动的信息*/
export class stMove{
public protoid:number = undefined
	/*x坐标*/
	public x:number;

	/*y坐标*/
	public y:number;

	/*动物、格子的uid*/
	public uid:number;

public write(b){
let len;
b.writeUint8(this.x);
b.writeUint8(this.y);
b.writeUint16(this.uid);

}
public read(b){
let len;
this.x=b.readUint8()
this.y=b.readUint8()
this.uid=b.readUint16()

}
	constructor(){}
}/*批量移动组合（返回10005） 协议id:10006*/
export class ComposeMove_req{
public protoid:number = 10006
	/*移动的动物、格子移动的信息*/
	public datalist:stMove[];

public write(b){
let len;

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
	constructor(){}
}/*动物结构体*/
export class stAnimal{
public protoid:number = undefined
	/*动物分类,对应t_Animal_List的f_type*/
	public type:number;

	/*当前动物的等级*/
	public level:number;

	/*当前动物的星级*/
	public star:number;

	/*当前动物所在格子的位置,0标识不在格子中*/
	public pos:number;

public write(b){
let len;
b.writeUint8(this.type);
b.writeUint16(this.level);
b.writeUint8(this.star);
b.writeUint8(this.pos);

}
public read(b){
let len;
this.type=b.readUint8()
this.level=b.readUint16()
this.star=b.readUint8()
this.pos=b.readUint8()

}
	constructor(){}
}/*动物初始化返回 协议id:10007*/
export class AnimalInit_revc{
public protoid:number = 10007
	/*解锁的动物信息*/
	public animals:stAnimal[];

	/*已解锁的动物格子id*/
	public slots:number[];

public read(b){
let len;
this.animals=this.animals||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stAnimal()
item.read(b);
this.animals.push(item);

}
this.slots=this.slots||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.slots.push(b.readUint8())
}

}
	constructor(){}
}/*动物格子增量,只增不减 协议id:10008*/
export class AnimalSlot_revc{
public protoid:number = 10008
	/*格子增量*/
	public slots:number[];

public read(b){
let len;
this.slots=this.slots||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.slots.push(b.readUint8())
}

}
	constructor(){}
}/*动物变化/新增 协议id:10009*/
export class Animal_revc{
public protoid:number = 10009
	/*0标识变化 1标识新增*/
	public type:number;

	/*动物变化/新增信息*/
	public animals:stAnimal[];

public read(b){
let len;
this.type=b.readUint8()
this.animals=this.animals||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stAnimal()
item.read(b);
this.animals.push(item);

}

}
	constructor(){}
}/*动物上下阵,返回10009 协议id:10010*/
export class AnimalMove_req{
public protoid:number = 10010
	/*动物分类,对应t_Animal_List的f_type*/
	public animalType:number;

	/*0标识下阵 >0上阵到具体位置*/
	public pos:number;

public write(b){
let len;
b.writeUint8(this.animalType);
b.writeUint8(this.pos);

}
	constructor(){}
}/*动物升级/升星 协议id:10011*/
export class AnimalRaise_req{
public protoid:number = 10011
	/*动物分类,对应t_Animal_List的f_type*/
	public animalType:number;

	/*0标识升级 1标识升星*/
	public action:number;

public write(b){
let len;
b.writeUint8(this.animalType);
b.writeUint8(this.action);

}
	constructor(){}
}/*英雄结构体*/
export class stHero{
public protoid:number = undefined
	/*英雄id,对应t_Hero.xlsx中f_heroid*/
	public id:number;

	/*当前英雄的等级*/
	public level:number;

	/*当前英雄穿戴的皮肤id*/
	public skinId:number;

	/*当前英雄拥有的皮肤*/
	public skins:number[];

	/*收藏的序列号 小于等于0标识未收藏,越大表示越近收藏*/
	public collect:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint16(this.level);
b.writeUint16(this.skinId);

this.skins=this.skins||[];
len = this.skins.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint16(this.skins[i]);
}
b.writeUint32(this.collect);

}
public read(b){
let len;
this.id=b.readUint8()
this.level=b.readUint16()
this.skinId=b.readUint16()
this.skins=this.skins||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.skins.push(b.readUint16())
}
this.collect=b.readUint32()

}
	constructor(){}
}/*英雄初始化返回 协议id:10012*/
export class HeroInit_revc{
public protoid:number = 10012
	/*解锁的英雄信息*/
	public heros:stHero[];

public read(b){
let len;
this.heros=this.heros||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHero()
item.read(b);
this.heros.push(item);

}

}
	constructor(){}
}/*英雄升级/升星 协议id:10013*/
export class HeroRaise_req{
public protoid:number = 10013
	/*英雄id*/
	public heroId:number;

	/*0标识升级 1标识升星*/
	public action:number;

	/*通用英雄升级道具*/
	public universal:stCellValue=new stCellValue();

public write(b){
let len;
b.writeUint8(this.heroId);
b.writeUint8(this.action);
this.universal.write(b);

}
	constructor(){}
}/*英雄变化/新增 协议id:10014*/
export class Hero_revc{
public protoid:number = 10014
	/*0标识变化 1标识新增 2切换皮肤返回 3收藏变化*/
	public type:number;

	/*英雄变化/新增信息*/
	public heros:stHero[];

public read(b){
let len;
this.type=b.readUint8()
this.heros=this.heros||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHero()
item.read(b);
this.heros.push(item);

}

}
	constructor(){}
}/*业务服登录到战斗服务器 协议id:10015*/
export class ClientLogin_req{
public protoid:number = 10015
	/*业务服的tcpId*/
	public tcpId:number;

public write(b){
let len;
b.writeUint16(this.tcpId);

}
	constructor(){}
}/*购买英雄 协议id:10016*/
export class HeroBuy_req{
public protoid:number = 10016
	/*英雄id*/
	public heroId:number;

public write(b){
let len;
b.writeUint8(this.heroId);

}
	constructor(){}
}/*英雄切换皮肤 协议id:10017*/
export class HeroSwitchSkin_req{
public protoid:number = 10017
	/*英雄id*/
	public heroId:number;

	/*皮肤id*/
	public skinId:number;

public write(b){
let len;
b.writeUint8(this.heroId);
b.writeUint16(this.skinId);

}
	constructor(){}
}/*英雄切换皮肤 协议id:10018*/
export class HeroBuySkin_req{
public protoid:number = 10018
	/*皮肤道具id*/
	public skinItemId:number;

public write(b){
let len;
b.writeUint16(this.skinItemId);

}
	constructor(){}
}/*英雄收藏,返回10014 协议id:10019*/
export class HeroCollect_req{
public protoid:number = 10019
	/*英雄id*/
	public heroId:number;

	/*0取消收藏 1收藏*/
	public action:number;

public write(b){
let len;
b.writeUint8(this.heroId);
b.writeUint8(this.action);

}
	constructor(){}
}/*宝箱处理 协议id:10029*/
export class BoxHandle_revc{
public protoid:number = 10029
	/*宝箱奖励*/
	public boxReward:stBoxReward=new stBoxReward();

public read(b){
let len;
this.boxReward.read(b);

}
	constructor(){}
}/*宝箱结构体*/
export class stBox{
public protoid:number = undefined
	/*宝箱id,对应t_Box_Reward_Rate的f_box_id*/
	public boxId:number;

	/*宝箱所在的栏位*/
	public pos:number;

	/*解锁可打开的时间(0即未解锁需用户点击解锁,当前时间>=解锁时间即可领取当前宝箱奖励)*/
	public unlockUnix:number;

	/*宝箱状态 0尚未解锁 1解锁中 2可开启 3可以解锁*/
	public state:number;

	/*解锁宝箱的消耗,可开启的消耗为空*/
	public costs:stCellValue[];

public write(b){
let len;
b.writeUint16(this.boxId);
b.writeUint8(this.pos);
b.writeUint32(this.unlockUnix);
b.writeUint8(this.state);

this.costs=this.costs||[];
len = this.costs.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.costs[i].write(b);
}

}
public read(b){
let len;
this.boxId=b.readUint16()
this.pos=b.readUint8()
this.unlockUnix=b.readUint32()
this.state=b.readUint8()
this.costs=this.costs||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.costs.push(item);

}

}
	constructor(){}
}/*宝箱信息初始化 协议id:10030*/
export class BoxInit_revc{
public protoid:number = 10030
	/*宝箱列表*/
	public boxes:stBox[];

public read(b){
let len;
this.boxes=this.boxes||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBox()
item.read(b);
this.boxes.push(item);

}

}
	constructor(){}
}/*宝箱删除,领取宝箱奖励后则删除宝箱 协议id:10031*/
export class BoxDel_revc{
public protoid:number = 10031
	/*宝箱所在的位置*/
	public datalist:number[];

public read(b){
let len;
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint8())
}

}
	constructor(){}
}/*宝箱处理 协议id:10032*/
export class BoxHandle_req{
public protoid:number = 10032
	/*0标识解锁宝箱(返回10033) 1标识领取宝箱奖励(返回10031+3009+10029(type=1)) 2使用道具解锁(返回10031+3009+10029(type=1))*/
	public action:number;

	/*宝箱所在的栏位*/
	public pos:number;

public write(b){
let len;
b.writeUint8(this.action);
b.writeUint8(this.pos);

}
	constructor(){}
}/*宝箱信息新增/变化 协议id:10033*/
export class BoxChange_revc{
public protoid:number = 10033
	/*0标识宝箱信息变化(解锁宝箱时候) 1新获得宝箱*/
	public type:number;

	/*宝箱列表*/
	public boxes:stBox[];

public read(b){
let len;
this.type=b.readUint8()
this.boxes=this.boxes||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBox()
item.read(b);
this.boxes.push(item);

}

}
	constructor(){}
}/*功能卡结构体*/
export class stFCard{
public protoid:number = undefined
	/*功能卡id,对应t_Function_Card*/
	public id:number;

	/*功能卡的数量*/
	public num:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint16(this.num);

}
public read(b){
let len;
this.id=b.readUint16()
this.num=b.readUint16()

}
	constructor(){}
}/*局内功能卡信息*/
export class stFCardInner{
public protoid:number = undefined
	/*当前功能卡的序列号(唯一)*/
	public serialNum:number;

	/*功能卡的位置*/
	public pos:number;

	/*功能卡id,对应t_Function_Card*/
	public fCardId:number;

	/*功能卡是否已使用 0未使用  1已使用 2使用但无效 3丢弃*/
	public used:number;

public write(b){
let len;
b.writeUint8(this.serialNum);
b.writeUint16(this.pos);
b.writeUint16(this.fCardId);
b.writeUint8(this.used);

}
public read(b){
let len;
this.serialNum=b.readUint8()
this.pos=b.readUint16()
this.fCardId=b.readUint16()
this.used=b.readUint8()

}
	constructor(){}
}/*功能卡保底信息*/
export class stFCardGuarante{
public protoid:number = undefined
	/*卡包ID*/
	public packageid:number;

	/*卡包ID对应的品质*/
	public qua:number;

	/*还有多少次触发保底*/
	public guarante:number;

public write(b){
let len;
b.writeUint8(this.packageid);
b.writeUint8(this.qua);
b.writeUint8(this.guarante);

}
public read(b){
let len;
this.packageid=b.readUint8()
this.qua=b.readUint8()
this.guarante=b.readUint8()

}
	constructor(){}
}/*功能卡方案*/
export class stFCardPlan{
public protoid:number = undefined
	/*方案id,如1 2 3*/
	public id:number;

	/*功能卡信息*/
	public cards:stFCard[];

public write(b){
let len;
b.writeUint8(this.id);

this.cards=this.cards||[];
len = this.cards.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.cards[i].write(b);
}

}
public read(b){
let len;
this.id=b.readUint8()
this.cards=this.cards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCard()
item.read(b);
this.cards.push(item);

}

}
	constructor(){}
}/*功能卡信息初始化 协议id:10034*/
export class FCardInit_revc{
public protoid:number = 10034
	/*拥有的功能卡列表*/
	public cards:stFCard[];

	/*方案id,如1 2 3*/
	public planId:number;

	/*功能卡方案*/
	public cardPlans:stFCardPlan[];

	/*保底列表*/
	public guaranteList:stFCardGuarante[];

public read(b){
let len;
this.cards=this.cards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCard()
item.read(b);
this.cards.push(item);

}
this.planId=b.readUint8()
this.cardPlans=this.cardPlans||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCardPlan()
item.read(b);
this.cardPlans.push(item);

}
this.guaranteList=this.guaranteList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCardGuarante()
item.read(b);
this.guaranteList.push(item);

}

}
	constructor(){}
}/*功能卡穿、脱,返回10043,toFight=1会额外返回10053 协议id:10035*/
export class FCardMove_req{
public protoid:number = 10035
	/*方案id,如1 2 3*/
	public planId:number;

	/*0脱 1穿*/
	public action:number;

	/*0否 1是(一键装备后去匹配战斗) 2(创建房间) 3(进入房间)*/
	public toFight:number;

	/*功能卡ID,若为0则标识一键脱、穿*/
	public fCardId:number;

public write(b){
let len;
b.writeUint8(this.planId);
b.writeUint8(this.action);
b.writeUint8(this.toFight);
b.writeUint16(this.fCardId);

}
	constructor(){}
}/*抽取功能卡,返回10051,10037 协议id:10036*/
export class FCardExtract_req{
public protoid:number = 10036
	/*卡包id*/
	public packageid:number;

public write(b){
let len;
b.writeUint8(this.packageid);

}
	constructor(){}
}/*功能卡数量变化(变化后的全量) 协议id:10037*/
export class FCardChange_revc{
public protoid:number = 10037
	/*拥有的功能卡列表*/
	public cards:stFCard[];

public read(b){
let len;
this.cards=this.cards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCard()
item.read(b);
this.cards.push(item);

}

}
	constructor(){}
}/*切换功能卡方案 协议id:10038*/
export class FCardPlanChange_req{
public protoid:number = 10038
	/*方案id,如1 2 3*/
	public planId:number;

public write(b){
let len;
b.writeUint8(this.planId);

}
	constructor(){}
}/*切换功能卡方案 协议id:10039*/
export class FCardPlanChange_revc{
public protoid:number = 10039
	/*方案id,如1 2 3*/
	public planId:number;

public read(b){
let len;
this.planId=b.readUint8()

}
	constructor(){}
}/*局内使用功能卡 协议id:10040*/
export class FCardUse_req{
public protoid:number = 10040
	/*局内功能卡的序列号*/
	public serialNum:number;

public write(b){
let len;
b.writeUint8(this.serialNum);

}
	constructor(){}
}/*局内功能卡初始化列表 协议id:10041*/
export class FCardInnerInit_revc{
public protoid:number = 10041
	/*局内功能卡信息*/
	public cards:stFCardInner[];

public read(b){
let len;
this.cards=this.cards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCardInner()
item.read(b);
this.cards.push(item);

}

}
	constructor(){}
}/*局内功能卡变化 协议id:10042*/
export class FCardInnerChange_revc{
public protoid:number = 10042
	/*谁用的功能卡*/
	public playerId:number;

	/*局内功能卡信息*/
	public cards:stFCardInner[];

public read(b){
let len;
this.playerId=b.readUint32()
this.cards=this.cards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCardInner()
item.read(b);
this.cards.push(item);

}

}
	constructor(){}
}/*功能卡方案数据变化(变化后的全量,直接=即可) 协议id:10043*/
export class FCardChangePlan_revc{
public protoid:number = 10043
	/*功能卡方案列表*/
	public cards:stFCardPlan[];

public read(b){
let len;
this.cards=this.cards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCardPlan()
item.read(b);
this.cards.push(item);

}

}
	constructor(){}
}/*局内功能卡信息*/
export class stTreasure{
public protoid:number = undefined
	/*对应t_Treasure的灵宝id*/
	public id:number;

	/*等级*/
	public level:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.level);

}
public read(b){
let len;
this.id=b.readUint8()
this.level=b.readUint8()

}
	constructor(){}
}/*文物/宝物信息初始化 协议id:10044*/
export class TreasureInit_revc{
public protoid:number = 10044
	/*还有多少次触发橙色保底*/
	public guarante:number;

	/*文物/宝物列表*/
	public datalist:stTreasure[];

public read(b){
let len;
this.guarante=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTreasure()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*抽取文物/宝物,返回10170+10046 协议id:10045*/
export class Treasure_req{
public protoid:number = 10045
	/*0默认单抽 1十连抽*/
	public flag:number;

public write(b){
let len;
b.writeUint8(this.flag);

}
	constructor(){}
}/*抽取文物/宝物变化或新增 协议id:10046*/
export class Treasure_revc{
public protoid:number = 10046
	/*0变化 1新增*/
	public flag:number;

	/*文物/宝物列表*/
	public datalist:stTreasure[];

public read(b){
let len;
this.flag=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTreasure()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*文物/宝物升级 协议id:10047*/
export class TreasureRaise_req{
public protoid:number = 10047
	/*对应t_Treasure的灵宝id*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.id);

}
	constructor(){}
}/*增加经验,开发测试环境下使用 协议id:10048*/
export class AddExp_req{
public protoid:number = 10048
	/*加的经验值,0标识默认,默认加100*/
	public cnt:number;

public write(b){
let len;
b.writeUint16(this.cnt);

}
	constructor(){}
}/*功能卡分解,返回10037,3005/4,3009,3025 协议id:10049*/
export class FCardBreakDown_req{
public protoid:number = 10049
	/*功能卡信息*/
	public cards:stFCard[];

public write(b){
let len;

this.cards=this.cards||[];
len = this.cards.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.cards[i].write(b);
}

}
	constructor(){}
}/*功能卡保底信息变化 协议id:10050*/
export class FCardGuaranteChange_revc{
public protoid:number = 10050
	/*保底信息变化*/
	public datalist:stFCardGuarante[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCardGuarante()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*收到的功能卡信息 协议id:10051*/
export class FCardExtract_revc{
public protoid:number = 10051
	/*卡包id*/
	public packageid:number;

	/*抽到的功能卡信息*/
	public cards:stFCard[];

public read(b){
let len;
this.packageid=b.readUint8()
this.cards=this.cards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCard()
item.read(b);
this.cards.push(item);

}

}
	constructor(){}
}/*收到的功能卡信息 协议id:10052*/
export class FCardBuyPackage_req{
public protoid:number = 10052
	/*卡包ID*/
	public packageid:number;

	/*购买的数量*/
	public num:number;

	/*0购买 1碎片兑换*/
	public flag:number;

public write(b){
let len;
b.writeUint8(this.packageid);
b.writeUint32(this.num);
b.writeUint8(this.flag);

}
	constructor(){}
}/*功能卡是否足够 协议id:10053*/
export class FCardEnough_revc{
public protoid:number = 10053
	/*o不足 1足够 2创建房间足够 3进入房间足够*/
	public enough:number;

public read(b){
let len;
this.enough=b.readUint8()

}
	constructor(){}
}/*局内功能卡变化 协议id:10054*/
export class FCardInnerCD_revc{
public protoid:number = 10054
	/*下次功能卡可用的时间戳,0标识都可以使用,初始化是0*/
	public unix:number;

public read(b){
let len;
this.unix=b.readUint32()

}
	constructor(){}
}export class stMonsterBirth{
public protoid:number = undefined
	/*怪的序列号*/
	public uid:number;

	/*怪f_id*/
	public fid:number;

	/*出生偏移时间（毫秒）*/
	public time:number;

	/*怪物总血量*/
	public blood:number;

	/*强化怪物总血量（先扣blood2 再扣blood1）*/
	public blood2:number;

	/*玩家id*/
	public playerId:number;

	/*boss消失时间（秒）*/
	public disappearTime:number;

	/*怪物当前位置*/
	public index:number;

	/*怪物当前血量*/
	public curBlood:number;

	/*强化怪物总血量*/
	public curBlood2:number;

	/*怪物皮肤（功能卡召唤时有，其他情况传0）*/
	public skinId:number;

public write(b){
let len;
b.writeUint32(this.uid);
b.writeUint16(this.fid);
b.writeUint32(this.time);
b.writeUint32(this.blood);
b.writeUint32(this.blood2);
b.writeUint32(this.playerId);
b.writeUint32(this.disappearTime);
b.writeUint16(this.index);
b.writeUint32(this.curBlood);
b.writeUint32(this.curBlood2);
b.writeUint32(this.skinId);

}
public read(b){
let len;
this.uid=b.readUint32()
this.fid=b.readUint16()
this.time=b.readUint32()
this.blood=b.readUint32()
this.blood2=b.readUint32()
this.playerId=b.readUint32()
this.disappearTime=b.readUint32()
this.index=b.readUint16()
this.curBlood=b.readUint32()
this.curBlood2=b.readUint32()
this.skinId=b.readUint32()

}
	constructor(){}
}export class stMonsterWalk{
public protoid:number = undefined
	/*怪的序列号*/
	public uid:number;

	/*移动一格需要的时间*/
	public time:number;

	/*小格子下标（从0开始，表示出生点1,1）当前的位置*/
	public index:number;

public write(b){
let len;
b.writeUint32(this.uid);
b.writeUint32(this.time);
b.writeUint16(this.index);

}
public read(b){
let len;
this.uid=b.readUint32()
this.time=b.readUint32()
this.index=b.readUint16()

}
	constructor(){}
}/*创建房间（进入竞技场发，返回10101） 协议id:10100*/
export class MonsterBirth_req{
public protoid:number = 10100
	/*1-pvp模式 2-pve模式 3-pvp回合制 4-pve困难模式 5-pve年兽*/
	public mode:number;

public write(b){
let len;
b.writeUint8(this.mode);

}
	constructor(){}
}/*怪物出生 协议id:10101*/
export class MonsterBirth_revc{
public protoid:number = 10101
	/*波次*/
	public wave:number;

	/*服务器当前时间（秒，偏移时间以此为基准）*/
	public serverTime:number;

	/*怪物出生信息列表*/
	public datalist:stMonsterBirth[];

public read(b){
let len;
this.wave=b.readUint8()
this.serverTime=b.readUint32()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMonsterBirth()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*怪物行走同步（服务器主动推送） 协议id:10102*/
export class MonsterWalk_revc{
public protoid:number = 10102
	/*怪物行走信息列表*/
	public datalist:stMonsterWalk[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMonsterWalk()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*技能效果*/
export class stFightSkillEffect{
public protoid:number = undefined
	/*技能类型type=1 params[0]技能id params[1]技能参数1 10008(攻击间隔)的属性值...*/
	public type:number;

	/*攻击者格子的uid*/
	public attackerUid:number;

	/*格子里的第几个人，0表示第一个*/
	public index:number;

	/*受击者列表*/
	public targetUids:number[];

	/*参数列表*/
	public params:number[];

public write(b){
let len;
b.writeUint8(this.type);
b.writeUint16(this.attackerUid);
b.writeUint8(this.index);

this.targetUids=this.targetUids||[];
len = this.targetUids.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint16(this.targetUids[i]);
}

this.params=this.params||[];
len = this.params.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint32(this.params[i]);
}

}
public read(b){
let len;
this.type=b.readUint8()
this.attackerUid=b.readUint16()
this.index=b.readUint8()
this.targetUids=this.targetUids||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.targetUids.push(b.readUint16())
}
this.params=this.params||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.params.push(b.readUint32())
}

}
	constructor(){}
}/*扣血*/
export class stSubBlood{
public protoid:number = undefined
	/*效果类型0-11
    
    0 物理伤害
    1 魔法伤害
    2 真实伤害
    3 暴击伤害
    4 恢复的blood
    5 恢复的blood2
    */
	public type:number;

	/*受击者*/
	public targetUid:number;

	/*血量伤害的值*/
	public value:number;

public write(b){
let len;
b.writeUint8(this.type);
b.writeUint16(this.targetUid);
b.writeUint32(this.value);

}
public read(b){
let len;
this.type=b.readUint8()
this.targetUid=b.readUint16()
this.value=b.readUint32()

}
	constructor(){}
}/*怪物移除 协议id:10103*/
export class MonsterRemove_revc{
public protoid:number = 10103
	/*怪物uid*/
	public targetUid:number;

public read(b){
let len;
this.targetUid=b.readUint16()

}
	constructor(){}
}/*怪物受击特效 协议id:10104*/
export class MonsterAttack_revc{
public protoid:number = 10104
	/*怪物受击信息列表*/
	public datalist:stFightSkillEffect[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFightSkillEffect()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*怪物减血 协议id:10105*/
export class MonsterBlood_revc{
public protoid:number = 10105
	/*怪物减血信息列表*/
	public datalist:stSubBlood[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSubBlood()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*怪物波次 协议id:10106*/
export class MonsterWave_revc{
public protoid:number = 10106
	/*波次*/
	public wave:number;

	/*下一波次的时间戳（秒）*/
	public nextWaveTime:number;

public read(b){
let len;
this.wave=b.readUint8()
this.nextWaveTime=b.readUint32()

}
	constructor(){}
}/*波次倒数 协议id:10107*/
export class WaveCountDown_revc{
public protoid:number = 10107
	/*倒计时（秒数）*/
	public num:number;

public read(b){
let len;
this.num=b.readUint8()

}
	constructor(){}
}/*英雄合成升级（返回10005） 协议id:10108*/
export class HeroUpgrade_req{
public protoid:number = 10108
	/*参与合成的uid数组*/
	public datalist:number[];

public write(b){
let len;

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint16(this.datalist[i]);
}

}
	constructor(){}
}/*取消匹配(返回3005 code=1) 协议id:10109*/
export class CancelMatch_req{
public protoid:number = 10109
public write(b){
let len;

}
	constructor(){}
}/*pvp房间内玩家的基础信息*/
export class stPlayerInRoom{
public protoid:number = undefined
	/*玩家角色ID*/
	public playerId:number;

	/*角色等级*/
	public playerLevel:number;

	/*角色昵称*/
	public nickName:string;

	/*奖杯数量*/
	public trophy:number;

	/*头像*/
	public headUrl:string;

	/*怪物最大上限*/
	public maxMonster:number;

	/*英雄数量最大上限*/
	public maxHero:number;

	/*称号id*/
	public titleId:number;

public write(b){
let len;
b.writeUint32(this.playerId);
b.writeUint16(this.playerLevel);
b.writeUTFString(this.nickName||"");
b.writeUint32(this.trophy);
b.writeUTFString(this.headUrl||"");
b.writeUint16(this.maxMonster);
b.writeUint8(this.maxHero);
b.writeUint16(this.titleId);

}
public read(b){
let len;
this.playerId=b.readUint32()
this.playerLevel=b.readUint16()
this.nickName=b.readUTFString()
this.trophy=b.readUint32()
this.headUrl=b.readUTFString()
this.maxMonster=b.readUint16()
this.maxHero=b.readUint8()
this.titleId=b.readUint16()

}
	constructor(){}
}/*pvp房间信息 协议id:10110*/
export class PvPRoomInfo_revc{
public protoid:number = 10110
	/*房间号*/
	public roomId:number;

	/*1-pvp模式 2-pve模式*/
	public mode:number;

	/*房间里的玩家信息*/
	public datalist:stPlayerInRoom[];

public read(b){
let len;
this.roomId=b.readUint32()
this.mode=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stPlayerInRoom()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*匹配结果返回,只用于关闭匹配界面 协议id:10111*/
export class PvPMatchResult_revc{
public protoid:number = 10111
	/*0匹配失败或超时 1匹配成功*/
	public flag:number;

public read(b){
let len;
this.flag=b.readUint8()

}
	constructor(){}
}/*请求创建房间(与战斗服务器通信) 协议id:10112*/
export class CreateRoom_req{
public protoid:number = 10112
	/*是否是好友战斗 1是 0否*/
	public isFriend:number;

	/*1-pvp模式 2-pve模式*/
	public mode:number;

	/*0非新手引导 1新手引导*/
	public isNewGuide:number;

	/*房间里面有哪些角色*/
	public datalist:stPlayerInRoom[];

public write(b){
let len;
b.writeUint8(this.isFriend);
b.writeUint8(this.mode);
b.writeUint8(this.isNewGuide);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
	constructor(){}
}/*胜利方战斗结束 协议id:10113*/
export class FightWin_req{
public protoid:number = 10113
	/*房间号*/
	public roomId:number;

	/*win的玩家*/
	public playerId:number;

public write(b){
let len;
b.writeUint32(this.roomId);
b.writeUint32(this.playerId);

}
	constructor(){}
}/*战斗结果*/
export class stFightResult{
public protoid:number = undefined
	/*玩家角色ID*/
	public playerId:number;

	/*机器人ID（不是机器人时传0）*/
	public robotId:number;

	/*0输 1赢*/
	public win:number;

	/*奖杯积分变化 赢是加 输是减*/
	public trophy:number;

	/*宝箱id,对应t_Box_Reward_Rate的f_box_id,为空则没有宝箱*/
	public boxIds:number[];

	/*宝箱所在的位置,0就是没有位置*/
	public boxPos:number;

	/*道具奖励列表,空则标识没有*/
	public itemList:stCellValue[];

	/*击杀怪物数量*/
	public killNum:number;

	/*pve是否最佳回合数 0否 1是*/
	public isBest:number;

	/*场上怪物数量*/
	public monsterNum:number;

public write(b){
let len;
b.writeUint32(this.playerId);
b.writeUint16(this.robotId);
b.writeUint8(this.win);
b.writeUint32(this.trophy);

this.boxIds=this.boxIds||[];
len = this.boxIds.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint16(this.boxIds[i]);
}
b.writeUint8(this.boxPos);

this.itemList=this.itemList||[];
len = this.itemList.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.itemList[i].write(b);
}
b.writeUint32(this.killNum);
b.writeUint8(this.isBest);
b.writeUint8(this.monsterNum);

}
public read(b){
let len;
this.playerId=b.readUint32()
this.robotId=b.readUint16()
this.win=b.readUint8()
this.trophy=b.readUint32()
this.boxIds=this.boxIds||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.boxIds.push(b.readUint16())
}
this.boxPos=b.readUint8()
this.itemList=this.itemList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.itemList.push(item);

}
this.killNum=b.readUint32()
this.isBest=b.readUint8()
this.monsterNum=b.readUint8()

}
	constructor(){}
}/*战斗结束结果 协议id:10114*/
export class FightResult_revc{
public protoid:number = 10114
	/*1-pvp模式 2-pve模式*/
	public mode:number;

	/*波次*/
	public wave:number;

	/*结果类型 1怪物数量 2未击杀妖王 3妖王剩余血量 4优先击杀最终妖王*/
	public type:number;

	/*战斗结果*/
	public datalist:stFightResult[];

	/*默认0，1表示pve新手引导*/
	public newGuide:number;

public read(b){
let len;
this.mode=b.readUint8()
this.wave=b.readUint8()
this.type=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFightResult()
item.read(b);
this.datalist.push(item);

}
this.newGuide=b.readUint8()

}
	constructor(){}
}/*召唤限时boss（返回10101、10123） 协议id:10115*/
export class SommonBoss_req{
public protoid:number = 10115
public write(b){
let len;

}
	constructor(){}
}/*强化结构体*/
export class stStrengthenItem{
public protoid:number = undefined
	/*0-4表示强化从左到右的顺序*/
	public pos:number;

	/*强化等级*/
	public level:number;

public write(b){
let len;
b.writeUint8(this.pos);
b.writeUint8(this.level);

}
public read(b){
let len;
this.pos=b.readUint8()
this.level=b.readUint8()

}
	constructor(){}
}/*强化等级信息（全部量） 协议id:10116*/
export class StrengthenList_revc{
public protoid:number = 10116
	/*强化等级数据列表*/
	public datalist:stStrengthenItem[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stStrengthenItem()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*强化某个品质的英雄（返回10118） 协议id:10117*/
export class StrengthenUpdate_req{
public protoid:number = 10117
	/*0-3表示强化从左到右的顺序*/
	public pos:number;

public write(b){
let len;
b.writeUint8(this.pos);

}
	constructor(){}
}/*强化某个品质的英雄（变化量） 协议id:10118*/
export class StrengthenUpdate_revc{
public protoid:number = 10118
	/*强化结果*/
	public data:stStrengthenItem=new stStrengthenItem();

public read(b){
let len;
this.data.read(b);

}
	constructor(){}
}/*显示召唤限时boss的按钮 协议id:10119*/
export class SommonBossShow_revc{
public protoid:number = 10119
	/*怪物的id，t_Monster表f_monsterid*/
	public monterId:number;

public read(b){
let len;
this.monterId=b.readUint16()

}
	constructor(){}
}/*召唤英雄花费 协议id:10120*/
export class SommonHeroCost_revc{
public protoid:number = 10120
	/*基础信息*/
	public moneyInfo:stCellValue[];

public read(b){
let len;
this.moneyInfo=this.moneyInfo||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.moneyInfo.push(item);

}

}
	constructor(){}
}/*卖掉英雄(返回10005, 3009) 协议id:10121*/
export class SellHero_req{
public protoid:number = 10121
	/*英雄uid*/
	public uid:number;

public write(b){
let len;
b.writeUint16(this.uid);

}
	constructor(){}
}/*召唤显示boss成功 协议id:10122*/
export class SommonBoss_revc{
public protoid:number = 10122
public read(b){
let len;

}
	constructor(){}
}/*pvp房间内玩家的基础信息*/
export class stTask{
public protoid:number = undefined
	/*任务id（t_Battle_Task表f_id）*/
	public taskId:number;

	/*任务完成数量*/
	public num:number;

	/*0未完成 1已完成（奖励再任务完成时自动发放）*/
	public state:number;

public write(b){
let len;
b.writeUint16(this.taskId);
b.writeUint32(this.num);
b.writeUint8(this.state);

}
public read(b){
let len;
this.taskId=b.readUint16()
this.num=b.readUint32()
this.state=b.readUint8()

}
	constructor(){}
}/*局内任务列表（全部量） 协议id:10123*/
export class TaskList_revc{
public protoid:number = 10123
	/*任务列表*/
	public datalist:stTask[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTask()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*局内任务更新（变化量） 协议id:10124*/
export class TaskUpdate_revc{
public protoid:number = 10124
	/*任务列表*/
	public datalist:stTask[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTask()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*局外战报结构体*/
export class stFightReport{
public protoid:number = undefined
	/*对手昵称*/
	public rivalNickName:string;

	/*对手头像*/
	public rivalHeadUrl:string;

	/*对手等级*/
	public rivalLevel:number;

	/*战斗开始时间（秒）*/
	public fightStartUnix:number;

	/*战斗时长（秒）*/
	public duration:number;

	/*战斗结果（0输 1赢）*/
	public win:number;

	/*奖杯变化数*/
	public trophy:number;

	/*战斗开始时的奖杯数量*/
	public trophy0:number;

	/*敌人奖杯变化数*/
	public enemyTrophy:number;

	/*敌人战斗开始时的奖杯数量*/
	public enemyTrophy0:number;

	/*敌人id*/
	public enemyId:number;

	/*胜负原因*/
	public result:number;

	/*是否是好友战斗 1是 0否*/
	public isFriend:number;

	/*结束时的波次*/
	public wave:number;

	/*神话英雄(英雄fid，己方多个用-分割|敌方多个用-分割)*/
	public superHeroFids:string;

	/*1-pvp模式 2-pve模式*/
	public mode:number;

public write(b){
let len;
b.writeUTFString(this.rivalNickName||"");
b.writeUTFString(this.rivalHeadUrl||"");
b.writeUint16(this.rivalLevel);
b.writeUint32(this.fightStartUnix);
b.writeUint16(this.duration);
b.writeUint8(this.win);
b.writeUint8(this.trophy);
b.writeUint32(this.trophy0);
b.writeUint8(this.enemyTrophy);
b.writeUint32(this.enemyTrophy0);
b.writeUint32(this.enemyId);
b.writeUint8(this.result);
b.writeUint8(this.isFriend);
b.writeUint8(this.wave);
b.writeUTFString(this.superHeroFids||"");
b.writeUint8(this.mode);

}
public read(b){
let len;
this.rivalNickName=b.readUTFString()
this.rivalHeadUrl=b.readUTFString()
this.rivalLevel=b.readUint16()
this.fightStartUnix=b.readUint32()
this.duration=b.readUint16()
this.win=b.readUint8()
this.trophy=b.readUint8()
this.trophy0=b.readUint32()
this.enemyTrophy=b.readUint8()
this.enemyTrophy0=b.readUint32()
this.enemyId=b.readUint32()
this.result=b.readUint8()
this.isFriend=b.readUint8()
this.wave=b.readUint8()
this.superHeroFids=b.readUTFString()
this.mode=b.readUint8()

}
	constructor(){}
}/*战报（返回10126） 协议id:10125*/
export class FightReport_req{
public protoid:number = 10125
public write(b){
let len;

}
	constructor(){}
}/*战报（全部量） 协议id:10126*/
export class FightReport_revc{
public protoid:number = 10126
	/*战报列表*/
	public datalist:stFightReport[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFightReport()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*查看英雄属性 协议id:10127*/
export class WatchHero_req{
public protoid:number = 10127
	/*英雄uid*/
	public uid:number;

public write(b){
let len;
b.writeUint16(this.uid);

}
	constructor(){}
}/*查看英雄属性 协议id:10128*/
export class WatchHero_revc{
public protoid:number = 10128
	/*英雄uid*/
	public uid:number;

	/*英雄lv*/
	public lv:number;

	/*属性列表*/
	public datalist:stCellValue[];

public read(b){
let len;
this.uid=b.readUint16()
this.lv=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*赌博请求 协议id:10129*/
export class Gamble_req{
public protoid:number = 10129
	/*1蓝色 2紫色 3橙色赌博*/
	public flag:number;

public write(b){
let len;
b.writeUint8(this.flag);

}
	constructor(){}
}/*局内战斗增加道具,开发环境下使用 协议id:10130*/
export class FightAddItems_req{
public protoid:number = 10130
	/*数据列表*/
	public itemList:stCellValue2[];

public write(b){
let len;

this.itemList=this.itemList||[];
len = this.itemList.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.itemList[i].write(b);
}

}
	constructor(){}
}/*赌博返回 协议id:10131*/
export class Gamble_revc{
public protoid:number = 10131
	/*1蓝色 2紫色 3橙色赌博*/
	public flag:number;

	/*0失败 1成功*/
	public success:number;

	/*合成神话英雄的id(Hero表f_heroid)*/
	public heroId:number;

public read(b){
let len;
this.flag=b.readUint8()
this.success=b.readUint8()
this.heroId=b.readUint16()

}
	constructor(){}
}/*合成神话英雄（返回10005） 协议id:10132*/
export class SuperHero_req{
public protoid:number = 10132
	/*合成神话英雄的id(Hero表f_heroid)*/
	public heroId:number;

public write(b){
let len;
b.writeUint16(this.heroId);

}
	constructor(){}
}/*场外任务列表*/
export class stTaskOut{
public protoid:number = undefined
	/*每日任务对应t_Daily_Task的f_id,累计任务对应t_Achieve_Task的f_id(相同f_task_type只给当前的id)*/
	public id:number;

	/*任务完成的数量*/
	public val:number;

	/*领取状态 0不可领取 1可领取 2已领取*/
	public status:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint32(this.val);
b.writeUint8(this.status);

}
public read(b){
let len;
this.id=b.readUint16()
this.val=b.readUint32()
this.status=b.readUint8()

}
	constructor(){}
}/*场外任务活跃度奖励*/
export class stTaskOutActivation{
public protoid:number = undefined
	/*活跃度奖励id*/
	public id:number;

	/*领取状态 0不可领取 1可领取 2已领取*/
	public status:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.status);

}
public read(b){
let len;
this.id=b.readUint8()
this.status=b.readUint8()

}
	constructor(){}
}/*每日与累计任务初始化信息 协议id:10133*/
export class TaskOutInit_revc{
public protoid:number = 10133
	/*每日的活跃度*/
	public activation:number;

	/*活跃度奖励领取情况*/
	public activationRewards:stTaskOutActivation[];

	/*每日任务详情*/
	public dailyTasks:stTaskOut[];

	/*成就任务详情,相同类型只给最新数据*/
	public achieveTasks:stTaskOut[];

public read(b){
let len;
this.activation=b.readUint16()
this.activationRewards=this.activationRewards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTaskOutActivation()
item.read(b);
this.activationRewards.push(item);

}
this.dailyTasks=this.dailyTasks||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTaskOut()
item.read(b);
this.dailyTasks.push(item);

}
this.achieveTasks=this.achieveTasks||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTaskOut()
item.read(b);
this.achieveTasks.push(item);

}

}
	constructor(){}
}/*领取任务奖励 协议id:10134*/
export class TaskOutReward_req{
public protoid:number = 10134
	/*0每日任务 1累计任务 2活跃度奖励*/
	public flag:number;

	/*(每日与累计对应表不一样,0代表一键领取)每日任务对应t_Daily_Task_Reward的f_id,累计任务对应t_Achieve_Task的f_id*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint16(this.id);

}
	constructor(){}
}/*任务每日活跃度变化 协议id:10135*/
export class TaskOutActivation_revc{
public protoid:number = 10135
	/*每日的活跃度,直接=*/
	public activation:number;

public read(b){
let len;
this.activation=b.readUint16()

}
	constructor(){}
}/*每日与累计任务数据变化 协议id:10136*/
export class TaskOutChange_revc{
public protoid:number = 10136
	/*0每日任务 1累计任务*/
	public flag:number;

	/*任务数据变化*/
	public tasks:stTaskOut[];

public read(b){
let len;
this.flag=b.readUint8()
this.tasks=this.tasks||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTaskOut()
item.read(b);
this.tasks.push(item);

}

}
	constructor(){}
}/*每日活跃度奖励变化 协议id:10137*/
export class TaskOutActivationReward_revc{
public protoid:number = 10137
	/*任务奖励领取详情*/
	public rewards:stTaskOutActivation[];

public read(b){
let len;
this.rewards=this.rewards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTaskOutActivation()
item.read(b);
this.rewards.push(item);

}

}
	constructor(){}
}/*兑换码（错误返回1004错误码，正确返回3009，3025） 协议id:10138*/
export class RedemptionCode_req{
public protoid:number = 10138
	/*兑换码*/
	public code:string;

public write(b){
let len;
b.writeUTFString(this.code||"");

}
	constructor(){}
}/*英雄技能条*/
export class stSkillBar{
public protoid:number = undefined
	/*格子uid*/
	public uid:number;

	/*技能条百分比*/
	public percent:number;

public write(b){
let len;
b.writeUint16(this.uid);
b.writeUint8(this.percent);

}
public read(b){
let len;
this.uid=b.readUint16()
this.percent=b.readUint8()

}
	constructor(){}
}/*英雄技能条 协议id:10139*/
export class SkillBar_revc{
public protoid:number = 10139
	/*英雄技能条列表*/
	public datalist:stSkillBar[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSkillBar()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*gm局内召唤英雄 协议id:10140*/
export class GMSommonHero_req{
public protoid:number = 10140
	/*召唤英雄的id*/
	public heroId:number;

	/*召唤的数量*/
	public num:number;

public write(b){
let len;
b.writeUint16(this.heroId);
b.writeUint16(this.num);

}
	constructor(){}
}/*重新进入战斗 返回10142之后开始局内数据更新 协议id:10141*/
export class EnterFightAgain_req{
public protoid:number = 10141
public write(b){
let len;

}
	constructor(){}
}/*场景信息 协议id:10142*/
export class FightSceneInfo_revc{
public protoid:number = 10142
	/*0 没有房间 1 有房间*/
	public status:number;

	/*1-pvp模式 2-pve模式*/
	public mode:number;

	/*英雄列表*/
	public heros:stElement[];

	/*怪物列表*/
	public monsters:stMonsterBirth[];

public read(b){
let len;
this.status=b.readUint8()
this.mode=b.readUint8()
this.heros=this.heros||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stElement()
item.read(b);
this.heros.push(item);

}
this.monsters=this.monsters||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMonsterBirth()
item.read(b);
this.monsters.push(item);

}

}
	constructor(){}
}/*局内全局buff*/
export class stBattleBuff{
public protoid:number = undefined
	/*buff属性id*/
	public attrId:number;

	/*1是增加，2是减小*/
	public operator:number;

	/*buff属性值*/
	public attrValue:number;

public write(b){
let len;
b.writeUint16(this.attrId);
b.writeUint8(this.operator);
b.writeUint16(this.attrValue);

}
public read(b){
let len;
this.attrId=b.readUint16()
this.operator=b.readUint8()
this.attrValue=b.readUint16()

}
	constructor(){}
}/*玩家的局内统计数据*/
export class stBattleData{
public protoid:number = undefined
	/*t_Battle_Statistics.xlsx的f_id*/
	public fid:number;

	/*任务详情*/
	public count:number;

public write(b){
let len;
b.writeUint8(this.fid);
b.writeUint16(this.count);

}
public read(b){
let len;
this.fid=b.readUint8()
this.count=b.readUint16()

}
	constructor(){}
}/*局内统计*/
export class stBattleStatistic{
public protoid:number = undefined
	/*玩家id*/
	public playerId:number;

	/*玩家的局内统计数据*/
	public datalist:stBattleData[];

	/*玩家的全局buff列表*/
	public bufflist:stBattleBuff[];

public write(b){
let len;
b.writeUint32(this.playerId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

this.bufflist=this.bufflist||[];
len = this.bufflist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.bufflist[i].write(b);
}

}
public read(b){
let len;
this.playerId=b.readUint32()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBattleData()
item.read(b);
this.datalist.push(item);

}
this.bufflist=this.bufflist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBattleBuff()
item.read(b);
this.bufflist.push(item);

}

}
	constructor(){}
}/*局内统计 协议id:10143*/
export class BattleStatistic_revc{
public protoid:number = 10143
	/*局内统计列表*/
	public datalist:stBattleStatistic[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBattleStatistic()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*局内统计更新 协议id:10144*/
export class BattleStatisticUpdate_revc{
public protoid:number = 10144
	/*局内统计更新列表*/
	public datalist:stBattleStatistic[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBattleStatistic()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*拉取局内统计数据 协议id:10145*/
export class BattleStatisticPull_req{
public protoid:number = 10145
public write(b){
let len;

}
	constructor(){}
}/*生涯统计相关数据*/
export class stCareer{
public protoid:number = undefined
	/*1(pvp最高奖杯数, pve最高回合数) 2累计场次 3累计胜利*/
	public flag:number;

	/*对应的数量*/
	public times:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint32(this.times);

}
public read(b){
let len;
this.flag=b.readUint8()
this.times=b.readUint32()

}
	constructor(){}
}/*pve首通奖励列表*/
export class stFirstPassRewardCoop{
public protoid:number = undefined
	/*对应t_First_Pass_Reward_Coop的f_id*/
	public id:number;

	/*领取状态 0不可领取 1可领取 2已领取*/
	public status:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.status);

}
public read(b){
let len;
this.id=b.readUint8()
this.status=b.readUint8()

}
	constructor(){}
}/*个人信息页面初始化 协议id:10146*/
export class HomepageInit_revc{
public protoid:number = 10146
	/*排位赛 pvp生涯统计列表,变化走10147,mode=1*/
	public datalist:stCareer[];

	/*突围战普通模式 pve统计列表,变化走10147,mode=2*/
	public pve:stCareer[];

	/*突围战困难模式统计列表,变化走10147,mode=4*/
	public pveHard:stCareer[];

	/*当前修改昵称消耗*/
	public nickNameCost:stCellValue[];

	/*当前拥有哪些头像,对应t_Head_Image的f_headid*/
	public heads:number[];

	/*当前拥有哪些头像框,对应t_Head_Image的f_headid*/
	public HeadFrames:number[];

	/*pve首通奖励列表,变量走10275*/
	public firstPassReward:stFirstPassRewardCoop[];

	/*点赞数*/
	public zan:number;

	/*开启的pve模式(0普通模式默认开启 1困难模式 2地域模式),变化走10346*/
	public pveModeExist:number;

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCareer()
item.read(b);
this.datalist.push(item);

}
this.pve=this.pve||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCareer()
item.read(b);
this.pve.push(item);

}
this.pveHard=this.pveHard||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCareer()
item.read(b);
this.pveHard.push(item);

}
this.nickNameCost=this.nickNameCost||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.nickNameCost.push(item);

}
this.heads=this.heads||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.heads.push(b.readUint8())
}
this.HeadFrames=this.HeadFrames||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.HeadFrames.push(b.readUint8())
}
this.firstPassReward=this.firstPassReward||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFirstPassRewardCoop()
item.read(b);
this.firstPassReward.push(item);

}
this.zan=b.readUint32()
this.pveModeExist=b.readUint8()

}
	constructor(){}
}/*生涯统计变化 协议id:10147*/
export class CareerStatsChange_revc{
public protoid:number = 10147
	/*1-pvp 2-pve 4-pvehard*/
	public mode:number;

	/*生涯统计变化*/
	public datalist:stCareer[];

public read(b){
let len;
this.mode=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCareer()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*头像、头像框变化 协议id:10148*/
export class HeadChange_req{
public protoid:number = 10148
	/*1头像 2头像框*/
	public flag:number;

	/*0则使用默认,可选择的头像及头像框id*/
	public val:string;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUTFString(this.val||"");

}
	constructor(){}
}/*头像、头像框变化 协议id:10149*/
export class HeadChange_revc{
public protoid:number = 10149
	/*1头像 2头像框*/
	public flag:number;

	/*0则使用默认,可选择的头像及头像框id*/
	public val:string;

public read(b){
let len;
this.flag=b.readUint8()
this.val=b.readUTFString()

}
	constructor(){}
}/*修改昵称 协议id:10150*/
export class NickNameChange_req{
public protoid:number = 10150
	/*昵称*/
	public nickName:string;

public write(b){
let len;
b.writeUTFString(this.nickName||"");

}
	constructor(){}
}/*修改昵称,修改成功则修改3004里面内容 协议id:10151*/
export class NickNameChange_revc{
public protoid:number = 10151
	/*昵称*/
	public nickName:string;

	/*下一次修改昵称消耗*/
	public nextCost:stCellValue[];

public read(b){
let len;
this.nickName=b.readUTFString()
this.nextCost=this.nextCost||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.nextCost.push(item);

}

}
	constructor(){}
}/*新获得头像、头像框 协议id:10152*/
export class HeadNew_revc{
public protoid:number = 10152
	/*1头像 2头像框*/
	public flag:number;

	/*新获得头像、头像框(增量)*/
	public datalist:number[];

public read(b){
let len;
this.flag=b.readUint8()
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint8())
}

}
	constructor(){}
}/*通用数量相关*/
export class stCommonTimes{
public protoid:number = undefined
	/*领取类型,根据不同模块去定义*/
	public flag:number;

	/*对应的数量,0未领取*/
	public times:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint32(this.times);

}
public read(b){
let len;
this.flag=b.readUint8()
this.times=b.readUint32()

}
	constructor(){}
}/*触发主动技能 协议id:10153*/
export class SkillActive_req{
public protoid:number = 10153
	/*触发主动技能的格子的uid*/
	public uid:number;

public write(b){
let len;
b.writeUint16(this.uid);

}
	constructor(){}
}/*通用领取奖励初始化 协议id:10154*/
export class CommonClaimRewardInit_revc{
public protoid:number = 10154
	/*通用领取信息*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*通用领取奖励 协议id:10155*/
export class CommonClaimRewards_req{
public protoid:number = 10155
	/*平台id*/
	public platId:number;

	/*
        1 完成新手领导领取奖励
        2 领取每日分享奖励
        3 taptap每日分享
        4 是否走新版新手引导 times 0不走 1走(弃用)
        5 新版pve新手引导奖励领取 times 0未领取 1、2、3已领取的关卡数(弃用)
        6 是否走pvp回合制新手引导 times 0不走 1走
        */
	public flag:number;

	/*额外的信息*/
	public extra:string;

public write(b){
let len;
b.writeUint8(this.platId);
b.writeUint8(this.flag);
b.writeUTFString(this.extra||"");

}
	constructor(){}
}/*通用领取奖励返回 协议id:10156*/
export class CommonClaimRewards_revc{
public protoid:number = 10156
	/*通用领取信息*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*好友战斗奖励 协议id:10157*/
export class FriendsFightRewardInit_revc{
public protoid:number = 10157
	/*stCommonTimes的flag代表位置(1,2,3), times=0不可领取 1可领取 2已领取*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*发起方好友房间 协议id:10158*/
export class FriendsRoom_req{
public protoid:number = 10158
	/*0取消房间 1创建房间*/
	public flag:number;

	/*1-pvp模式 2-pve模式 3-pve困难模式 4-pve年兽 5pve地域模式*/
	public mode:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint8(this.mode);

}
	constructor(){}
}/*通用领取奖励返回 协议id:10159*/
export class FriendsRoom_revc{
public protoid:number = 10159
	/*4位数房间标识*/
	public roomSn:string;

public read(b){
let len;
this.roomSn=b.readUTFString()

}
	constructor(){}
}/*加入好友房间 协议id:10160*/
export class FriendsRoomJoin_req{
public protoid:number = 10160
	/*1加入房间 2上线时候加入房间*/
	public flag:number;

	/*4位数房间标识*/
	public roomSn:string;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUTFString(this.roomSn||"");

}
	constructor(){}
}/*加入好友房间返回 协议id:10161*/
export class FriendsRoomJoin_revc{
public protoid:number = 10161
	/*0取消加入(取消roomSn传空) 1加入房间*/
	public flag:number;

public read(b){
let len;
this.flag=b.readUint8()

}
	constructor(){}
}/*领取好友战斗奖励 协议id:10162*/
export class FriendsFightReward_req{
public protoid:number = 10162
	/*奖励的位置1,2,3*/
	public pos:number;

public write(b){
let len;
b.writeUint8(this.pos);

}
	constructor(){}
}/*好友战斗奖励状态变化 协议id:10163*/
export class FriendsFightReward_revc{
public protoid:number = 10163
	/*stCommonTimes的flag代表位置(1,2,3), times=0不可领取 1可领取 2已领取*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*英雄移动的信息*/
export class stHeroMove{
public protoid:number = undefined
	/*英雄uid*/
	public uid:number;

	/*移动的x坐标*/
	public x:number;

	/*移动的y坐标*/
	public y:number;

public write(b){
let len;
b.writeUint16(this.uid);
b.writeUint8(this.x);
b.writeUint8(this.y);

}
public read(b){
let len;
this.uid=b.readUint16()
this.x=b.readUint8()
this.y=b.readUint8()

}
	constructor(){}
}/*英雄移动（3个英雄卖掉1个 或 合成神话英雄消耗了3个英雄中的1个时发） 协议id:10164*/
export class HeroMove_revc{
public protoid:number = 10164
	/*英雄移动数组*/
	public datalist:stHeroMove[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHeroMove()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*公共排行榜信息*/
export class stCommonRank{
public protoid:number = undefined
	/*玩家角色id*/
	public accountId:number;

	/*玩家等级*/
	public playerLevel:number;

	/*玩家昵称*/
	public nickName:string;

	/*头像*/
	public headUrl:string;

	/*头像框*/
	public HeadFrame:number;

	/*名次*/
	public ranking:number;

	/*称号id*/
	public titleId:number;

	/*(flag=0奖杯数量，1通关次数 2回合次数)*/
	public trophy:number;

	/*区服名称*/
	public serverName:string;

	/*pve波次排行榜(0普通模式 1困难模式 2地域模式)*/
	public mode:number;

public write(b){
let len;
b.writeUint32(this.accountId);
b.writeUint16(this.playerLevel);
b.writeUTFString(this.nickName||"");
b.writeUTFString(this.headUrl||"");
b.writeUint8(this.HeadFrame);
b.writeUint32(this.ranking);
b.writeUint16(this.titleId);
b.writeUint32(this.trophy);
b.writeUTFString(this.serverName||"");
b.writeUint16(this.mode);

}
public read(b){
let len;
this.accountId=b.readUint32()
this.playerLevel=b.readUint16()
this.nickName=b.readUTFString()
this.headUrl=b.readUTFString()
this.HeadFrame=b.readUint8()
this.ranking=b.readUint32()
this.titleId=b.readUint16()
this.trophy=b.readUint32()
this.serverName=b.readUTFString()
this.mode=b.readUint16()

}
	constructor(){}
}/*获取排行榜列表 协议id:10165*/
export class CommonRank_req{
public protoid:number = 10165
	/*0跨服 1单服*/
	public category:number;

	/*0原先pvp排行榜 1通关排行榜 2回合排行榜*/
	public flag:number;

public write(b){
let len;
b.writeUint8(this.category);
b.writeUint8(this.flag);

}
	constructor(){}
}/*排行榜列表返回 协议id:10166*/
export class CommonRank_revc{
public protoid:number = 10166
	/*0跨服 1单服*/
	public category:number;

	/*0原先pvp排行榜 1通关排行榜 2回合排行榜*/
	public flag:number;

	/*开服冲榜前100名的信息*/
	public datalist:stCommonRank[];

	/*当前玩家自己在开服冲榜的排名 长度=0则没有,最大长度为1*/
	public self:stCommonRank[];

public read(b){
let len;
this.category=b.readUint8()
this.flag=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonRank()
item.read(b);
this.datalist.push(item);

}
this.self=this.self||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonRank()
item.read(b);
this.self.push(item);

}

}
	constructor(){}
}/*查看排行榜里面数据详情 协议id:10167*/
export class WatchCommonRankDetail_req{
public protoid:number = 10167
	/*排行榜中玩家id*/
	public accountId:number;

public write(b){
let len;
b.writeUint32(this.accountId);

}
	constructor(){}
}/*查看排行榜里面数据详情 协议id:10168*/
export class WatchCommonRankDetail_revc{
public protoid:number = 10168
	/*玩家数据*/
	public playerData:stPlayerData=new stPlayerData();

	/*称号id*/
	public titleId:number;

	/*赛季*/
	public season:number;

	/*排位赛生涯统计列表*/
	public career:stCareer[];

	/*突围战普通模式pve生涯统计列表*/
	public careerPve:stCareer[];

	/*突围战困难模式pve生涯统计列表*/
	public careerPveHard:stCareer[];

	/*收藏列表 1英雄 2文物 3卡牌*/
	public collect:stCommonTimes[];

	/*点赞数*/
	public zan:number;

	/*当前好友有没有点赞 1已点 0未点*/
	public zanExist:number;

	/*与当前玩家是否是好友 1是 0否*/
	public isFriend:number;

	/*部分英雄信息,只有英雄id和等级*/
	public heros:stHero[];

	/*拥有的皮肤id*/
	public heroSkins:number[];

	/*部分宝物*/
	public treasures:stTreasure[];

	/*部分功能卡*/
	public cards:stFCard[];

public read(b){
let len;
this.playerData.read(b);
this.titleId=b.readUint16()
this.season=b.readUint8()
this.career=this.career||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCareer()
item.read(b);
this.career.push(item);

}
this.careerPve=this.careerPve||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCareer()
item.read(b);
this.careerPve.push(item);

}
this.careerPveHard=this.careerPveHard||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCareer()
item.read(b);
this.careerPveHard.push(item);

}
this.collect=this.collect||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.collect.push(item);

}
this.zan=b.readUint32()
this.zanExist=b.readUint8()
this.isFriend=b.readUint8()
this.heros=this.heros||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHero()
item.read(b);
this.heros.push(item);

}
this.heroSkins=this.heroSkins||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.heroSkins.push(b.readUint32())
}
this.treasures=this.treasures||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTreasure()
item.read(b);
this.treasures.push(item);

}
this.cards=this.cards||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFCard()
item.read(b);
this.cards.push(item);

}

}
	constructor(){}
}/*公共排行榜信息*/
export class stBoxReward{
public protoid:number = undefined
	/*宝箱id,对应t_Box_Reward_Rate的f_box_id*/
	public boxId:number;

	/*宝箱获得的奖励列表*/
	public datalist:stCellValueConvert[];

public write(b){
let len;
b.writeUint16(this.boxId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.boxId=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValueConvert()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*高级奖励 协议id:10169*/
export class PremiumRewards_revc{
public protoid:number = 10169
	/*获取到的英雄id*/
	public heroIds:number[];

	/*宝箱奖励*/
	public boxes:stBoxReward[];

	/*奖励数据列表*/
	public rewardList:stCellValue[];

	/*道具转化信息*/
	public convertedList:stCellValueConvert[];

public read(b){
let len;
this.heroIds=this.heroIds||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.heroIds.push(b.readUint8())
}
this.boxes=this.boxes||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBoxReward()
item.read(b);
this.boxes.push(item);

}
this.rewardList=this.rewardList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.rewardList.push(item);

}
this.convertedList=this.convertedList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValueConvert()
item.read(b);
this.convertedList.push(item);

}

}
	constructor(){}
}/*宝物抽取展示*/
export class stTreasureShow{
public protoid:number = undefined
	/*对应t_Treasure的灵宝id*/
	public id:number;

	/*灵宝的数量*/
	public num:number;

	/*转化后对应id,未转化为0*/
	public convertedId:number;

	/*转化后的数量,未转化为0*/
	public convertedNum:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.num);
b.writeUint16(this.convertedId);
b.writeUint32(this.convertedNum);

}
public read(b){
let len;
this.id=b.readUint8()
this.num=b.readUint8()
this.convertedId=b.readUint16()
this.convertedNum=b.readUint32()

}
	constructor(){}
}/*抽取文物/宝物展示 协议id:10170*/
export class TreasureShow_revc{
public protoid:number = 10170
	/*0默认单抽 1十连抽*/
	public flag:number;

	/*道具转化信息*/
	public datalist:stTreasureShow[];

	/*还有多少次触发橙色保底变化*/
	public guarante:number;

public read(b){
let len;
this.flag=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTreasureShow()
item.read(b);
this.datalist.push(item);

}
this.guarante=b.readUint8()

}
	constructor(){}
}/*通用奖励相关*/
export class stCommonReward{
public protoid:number = undefined
	/*奖励id*/
	public id:number;

	/*0不可领取 1可领取 2已领取*/
	public state:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint32(this.state);

}
public read(b){
let len;
this.id=b.readUint16()
this.state=b.readUint32()

}
	constructor(){}
}/*首页奖励初始化(高于当前奖杯数的奖励不发,默认不可领取) 协议id:10171*/
export class TrophyRewardInit_revc{
public protoid:number = 10171
	/*id是代表t_Trophy_Reward的f_id*/
	public datalist:stCommonReward[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonReward()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取首页奖励 协议id:10172*/
export class TrophyReward_req{
public protoid:number = 10172
	/*奖励id*/
	public id:number;

public write(b){
let len;
b.writeUint16(this.id);

}
	constructor(){}
}/*领取首页奖励返回(变量) 协议id:10173*/
export class TrophyReward_revc{
public protoid:number = 10173
	/*id是代表t_Trophy_Reward的f_id*/
	public datalist:stCommonReward[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonReward()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*赌博概率*/
export class stGambleProb{
public protoid:number = undefined
	/*1蓝色 2紫色 3橙色赌博*/
	public flag:number;

	/*对应概率(万分位)*/
	public prob:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint16(this.prob);

}
public read(b){
let len;
this.flag=b.readUint8()
this.prob=b.readUint16()

}
	constructor(){}
}/*赌博祈愿概率返回或变化 协议id:10174*/
export class GambleProb_revc{
public protoid:number = 10174
	/*是否初始化 0否则标识概率变化 1是创建房间或重连的时候发*/
	public init:number;

	/*对应的概率*/
	public datalist:stGambleProb[];

public read(b){
let len;
this.init=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stGambleProb()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*商城相关*/
export class stShop{
public protoid:number = undefined
	/*对应商城表或商城热卖的id*/
	public id:number;

	/*对应商品id购买的次数,热卖默认最高只能兑换1次*/
	public cnt:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.cnt);

}
public read(b){
let len;
this.id=b.readUint8()
this.cnt=b.readUint8()

}
	constructor(){}
}/*已刷热卖商城次数*/
export class stShopHotFresh{
public protoid:number = undefined
	/*0广告刷新 1使用道具刷新*/
	public type:number;

	/*已刷次数*/
	public cnt:number;

public write(b){
let len;
b.writeUint8(this.type);
b.writeUint8(this.cnt);

}
public read(b){
let len;
this.type=b.readUint8()
this.cnt=b.readUint8()

}
	constructor(){}
}/*商城初始化信息,充值双倍的还走3096 协议id:10175*/
export class ShopInit_revc{
public protoid:number = 10175
	/*t_Shop.xlsx中不展示隐藏的f_id*/
	public hideIds:number[];

	/*商品的购买或兑换次数(不限购的不推送)*/
	public datalist:stShop[];

	/*热卖领取信息(id是t_Shop_Hotsell.xlsx的f_id)*/
	public hotList:stShop[];

	/*热卖商品刷新次数*/
	public hotFreshList:stShopHotFresh[];

	/*当天结束的时间戳*/
	public todayEndUnix:number;

public read(b){
let len;
this.hideIds=this.hideIds||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.hideIds.push(b.readUint8())
}
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stShop()
item.read(b);
this.datalist.push(item);

}
this.hotList=this.hotList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stShop()
item.read(b);
this.hotList.push(item);

}
this.hotFreshList=this.hotFreshList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stShopHotFresh()
item.read(b);
this.hotFreshList.push(item);

}
this.todayEndUnix=b.readUint32()

}
	constructor(){}
}/*商城兑换或领取 协议id:10176*/
export class ShopExchange_req{
public protoid:number = 10176
	/*商城表的id*/
	public id:number;

	/*商品购买的次数*/
	public times:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.times);

}
	constructor(){}
}/*商城兑换或领取变化 协议id:10177*/
export class ShopExchange_revc{
public protoid:number = 10177
	/*商品的购买或兑换次数(不限购的不推送)*/
	public datalist:stShop[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stShop()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*商品从隐藏到显示,满足条件先发10177,10178 协议id:10178*/
export class ShopHideToDisplay_revc{
public protoid:number = 10178
	/*可展示列表增量*/
	public datalist:number[];

public read(b){
let len;
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint8())
}

}
	constructor(){}
}/*商城热卖刷新,返回10180,10182(flag=1) 协议id:10179*/
export class ShopHotFresh_req{
public protoid:number = 10179
	/*0广告刷新 1道具刷新*/
	public flag:number;

public write(b){
let len;
b.writeUint8(this.flag);

}
	constructor(){}
}/*商城热卖刷新次数变化 协议id:10180*/
export class ShopHotFresh_revc{
public protoid:number = 10180
	/*可展示列表增量*/
	public datalist:stShopHotFresh[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stShopHotFresh()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*热卖商城兑换,返回10182(flag=0) 协议id:10181*/
export class ShopHotExchange_req{
public protoid:number = 10181
	/*商城表的id*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.id);

}
	constructor(){}
}/*商城热卖信息变化 协议id:10182*/
export class ShopHotExchange_revc{
public protoid:number = 10182
	/*0单个热卖商品变化 1热卖列表变化(刷新列表或系统刷新)*/
	public flag:number;

	/*热卖商城已领变化*/
	public datalist:stShop[];

	/*当天结束的时间戳(flag=0的时候当前值为0不用处理)*/
	public todayEndUnix:number;

public read(b){
let len;
this.flag=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stShop()
item.read(b);
this.datalist.push(item);

}
this.todayEndUnix=b.readUint32()

}
	constructor(){}
}/*英雄主动技能按钮是否在cd中 协议id:10183*/
export class HeroActiveBtnCD_revc{
public protoid:number = 10183
	/*英雄格子的uid*/
	public uid:number;

	/*0未在cd中 1cd中不可用*/
	public cd:number;

public read(b){
let len;
this.uid=b.readUint16()
this.cd=b.readUint8()

}
	constructor(){}
}/*开始战斗（玩家进入房间并完成倒数） 协议id:10184*/
export class FightStart_req{
public protoid:number = 10184
public write(b){
let len;

}
	constructor(){}
}/*功能卡特效*/
export class stFuncCardEffect{
public protoid:number = undefined
	/*玩家id*/
	public playerId:number;

	/*卡牌id（t_Function_Card表f_card__templateid）*/
	public cardId:number;

	/*局内功能卡的序列号*/
	public serialNum:number;

	/*目标类型 1怪物 2英雄格子 3棋盘 4卡牌 5召唤/祈愿按钮*/
	public type:number;

	/*目标类型是怪物、英雄格子、卡牌时有，卡牌传序列号*/
	public uids:number[];

	/*状态 1特效生效 0特效过期*/
	public state:number;

public write(b){
let len;
b.writeUint32(this.playerId);
b.writeUint16(this.cardId);
b.writeUint32(this.serialNum);
b.writeUint8(this.type);

this.uids=this.uids||[];
len = this.uids.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint16(this.uids[i]);
}
b.writeUint8(this.state);

}
public read(b){
let len;
this.playerId=b.readUint32()
this.cardId=b.readUint16()
this.serialNum=b.readUint32()
this.type=b.readUint8()
this.uids=this.uids||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.uids.push(b.readUint16())
}
this.state=b.readUint8()

}
	constructor(){}
}/*功能卡特效 协议id:10185*/
export class FuncCardEffectUpdate_revc{
public protoid:number = 10185
	/*功能卡特效数据*/
	public datalist:stFuncCardEffect[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFuncCardEffect()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*直接使用功能卡gm 协议id:10186*/
export class GmInnerCard_req{
public protoid:number = 10186
	/*功能卡id（t_Function_Card表f_card__templateid）*/
	public cardId:number;

public write(b){
let len;
b.writeUint32(this.cardId);

}
	constructor(){}
}/*功能卡弹幕 协议id:10187*/
export class FuncardDanMu_revc{
public protoid:number = 10187
	/*卡牌使用者的玩家id*/
	public playerId:number;

	/*功能卡id（t_Function_Card表f_card__templateid）*/
	public cardId:number;

	/*弹幕数据*/
	public datalist:number[];

public read(b){
let len;
this.playerId=b.readUint32()
this.cardId=b.readUint32()
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint32())
}

}
	constructor(){}
}/*击杀妖王触发 协议id:10188*/
export class KillBoss_revc{
public protoid:number = 10188
	/*玩家id*/
	public playerid:number;

	/*妖王boss t_Monster id*/
	public bossId:number;

	/*是否优先击杀 1pvp优先击杀 2pve快速击杀*/
	public firstKill:number;

public read(b){
let len;
this.playerid=b.readUint32()
this.bossId=b.readUint32()
this.firstKill=b.readUint8()

}
	constructor(){}
}/*功能卡特效2 协议id:10189*/
export class FuncCardSpecialEffect_revc{
public protoid:number = 10189
	/*0卡牌使用无效*/
	public type:number;

	/*卡牌所属的玩家id*/
	public playerId:number;

	/*卡牌id*/
	public cardId:number;

public read(b){
let len;
this.type=b.readUint8()
this.playerId=b.readUint32()
this.cardId=b.readUint32()

}
	constructor(){}
}/*战令活动初始化信息 协议id:10190*/
export class BattlePassInit_revc{
public protoid:number = 10190
	/*战令等级*/
	public BattlePassLevel:number;

	/*当前战令等级下的经验*/
	public BattlePassLevelExp:number;

	/*任务列表*/
	public tasks:stTaskOut[];

public read(b){
let len;
this.BattlePassLevel=b.readUint16()
this.BattlePassLevelExp=b.readUint16()
this.tasks=this.tasks||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTaskOut()
item.read(b);
this.tasks.push(item);

}

}
	constructor(){}
}/*战令任务变化(领取走活动协议3087) 协议id:10191*/
export class BattlePassTaskChange_revc{
public protoid:number = 10191
	/*任务数据变化*/
	public tasks:stTaskOut[];

public read(b){
let len;
this.tasks=this.tasks||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTaskOut()
item.read(b);
this.tasks.push(item);

}

}
	constructor(){}
}/*购买战令经验 协议id:10192*/
export class BattlePassBuyExp_req{
public protoid:number = 10192
	/*购买数量*/
	public num:number;

public write(b){
let len;
b.writeUint32(this.num);

}
	constructor(){}
}/*战令等级变化 协议id:10193*/
export class BattlePassLevel_revc{
public protoid:number = 10193
	/*战令等级*/
	public level:number;

	/*战令当前等级下经验变化后的值*/
	public exp:number;

public read(b){
let len;
this.level=b.readUint16()
this.exp=b.readUint16()

}
	constructor(){}
}/*是否当日首次登录变化(活动数据之后发) 协议id:10194*/
export class TodayFirstLogin_revc{
public protoid:number = 10194
	/*是否首次登录 0否 1是*/
	public isFirst:number;

public read(b){
let len;
this.isFirst=b.readUint8()

}
	constructor(){}
}export class stLimitPackTime{
public protoid:number = undefined
	/*限时礼包的id对应t_Limited_Time_Pack的f_id*/
	public id:number;

	/*活动开始时间*/
	public starttime:number;

	/*活动结束时间 无结束为0*/
	public endtime:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint32(this.starttime);
b.writeUint32(this.endtime);

}
public read(b){
let len;
this.id=b.readUint8()
this.starttime=b.readUint32()
this.endtime=b.readUint32()

}
	constructor(){}
}/*限时礼包的开始与结束时间 协议id:10195*/
export class LimitPackTimeInit_revc{
public protoid:number = 10195
	/*限时礼包的开始与结束时间*/
	public datalist:stLimitPackTime[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stLimitPackTime()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*限时礼包的开始与结束时间变量(在活动数据之前发) 协议id:10196*/
export class LimitPackTime_revc{
public protoid:number = 10196
	/*限时礼包的开始与结束时间变量*/
	public datalist:stLimitPackTime[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stLimitPackTime()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stTitle{
public protoid:number = undefined
	/*称号id*/
	public id:number;

	/*称号的到期时间戳(0标识不过期)*/
	public exp:number;

	/*是否是新获得的称号*/
	public isNew:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint32(this.exp);
b.writeUint8(this.isNew);

}
public read(b){
let len;
this.id=b.readUint16()
this.exp=b.readUint32()
this.isNew=b.readUint8()

}
	constructor(){}
}/*称号初始化(3010之前发) 协议id:10197*/
export class TitleInit_revc{
public protoid:number = 10197
	/*当前配置中的称号*/
	public titleId:number;

	/*称号列表*/
	public datalist:stTitle[];

public read(b){
let len;
this.titleId=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTitle()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*切换称号 协议id:10198*/
export class TitleSwitch_req{
public protoid:number = 10198
	/*称号id*/
	public titleId:number;

public write(b){
let len;
b.writeUint16(this.titleId);

}
	constructor(){}
}/*切换称号 协议id:10199*/
export class TitleSwitch_revc{
public protoid:number = 10199
	/*当前配置中的称号*/
	public titleId:number;

public read(b){
let len;
this.titleId=b.readUint16()

}
	constructor(){}
}/*称号新增/删除 协议id:10200*/
export class TitleAction_revc{
public protoid:number = 10200
	/*0称号到期删除 1新增称号 2已有称号过期时间延长*/
	public action:number;

	/*称号列表*/
	public datalist:stTitle[];

public read(b){
let len;
this.action=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stTitle()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*点击新获得的称号 协议id:10201*/
export class TitleNewClick_req{
public protoid:number = 10201
	/*称号id*/
	public titleId:number;

public write(b){
let len;
b.writeUint16(this.titleId);

}
	constructor(){}
}/*局内战斗异常（关闭战斗界面） 协议id:10202*/
export class FightError_revc{
public protoid:number = 10202
public read(b){
let len;

}
	constructor(){}
}/*邀请及奖励详情初始化(全量) 协议id:10203*/
export class InviteInit_revc{
public protoid:number = 10203
	/*平台id*/
	public platId:number;

	/*绑定邀请 0未绑定 1已绑定*/
	public binded:number;

	/*邀请有效人数*/
	public validCnt:number;

	/*邀请总人数*/
	public invitedCnt:number;

	/*stCommonTimes的flag代表位置(奖励id), times=0不可领取 1可领取 2已领取*/
	public datalist:stCommonTimes[];

	/*每日分享 times=0未领取分享奖励 2已领取*/
	public dailyShare:stCommonTimes=new stCommonTimes();

public read(b){
let len;
this.platId=b.readUint8()
this.binded=b.readUint8()
this.validCnt=b.readUint16()
this.invitedCnt=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}
this.dailyShare.read(b);

}
	constructor(){}
}/*领取邀请奖励 协议id:10204*/
export class InviteReward_req{
public protoid:number = 10204
	/*对应奖励f_id*/
	public id:number;

public write(b){
let len;
b.writeUint16(this.id);

}
	constructor(){}
}/*领取邀请奖励状态变化 协议id:10205*/
export class InviteReward_revc{
public protoid:number = 10205
	/*stCommonTimes的flag代表位置(奖励id), times=0不可领取 1可领取 2已领取*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*邀请有效人数变化 协议id:10206*/
export class InvitedCnt_revc{
public protoid:number = 10206
	/*平台id*/
	public platId:number;

	/*0总邀请人数 1邀请有效人数*/
	public flag:number;

	/*人数*/
	public cnt:number;

public read(b){
let len;
this.platId=b.readUint8()
this.flag=b.readUint8()
this.cnt=b.readUint16()

}
	constructor(){}
}/*每日分享数据变化 协议id:10207*/
export class DailyShare_revc{
public protoid:number = 10207
	/*平台id*/
	public platId:number;

	/*每日分享 times=0未领取分享奖励 2已领取*/
	public data:stCommonTimes=new stCommonTimes();

public read(b){
let len;
this.platId=b.readUint8()
this.data.read(b);

}
	constructor(){}
}/*社区奖励详情初始化(全量) 协议id:10208*/
export class CommunityInit_revc{
public protoid:number = 10208
	/*times=0未领取分享奖励 2已领取*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取社区奖励 协议id:10209*/
export class CommunityReward_req{
public protoid:number = 10209
	/*0变成可领状态 1领取奖励*/
	public flag:number;

	/*社区奖励id*/
	public ids:number[];

public write(b){
let len;
b.writeUint8(this.flag);

this.ids=this.ids||[];
len = this.ids.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint8(this.ids[i]);
}

}
	constructor(){}
}/*领取社区奖励变化(领取+每日刷新) 协议id:10210*/
export class CommunityReward_revc{
public protoid:number = 10210
	/*times=0未领取分享奖励 2已领取*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*局内聊天 协议id:10211*/
export class FightChat_req{
public protoid:number = 10211
	/*表t_Battle_Communication的f_id*/
	public fid:number;

public write(b){
let len;
b.writeUint16(this.fid);

}
	constructor(){}
}/*局内聊天 协议id:10212*/
export class FightChat_revc{
public protoid:number = 10212
	/*玩家id*/
	public playerId:number;

	/*表t_Battle_Communication的f_id*/
	public fid:number;

public read(b){
let len;
this.playerId=b.readUint32()
this.fid=b.readUint16()

}
	constructor(){}
}export class stGuide{
public protoid:number = undefined
	/*新手引导的分组id*/
	public groupId:number;

	/*新手引导的排序id,0即当前分组全部完成*/
	public orderId:number;

public write(b){
let len;
b.writeUint8(this.groupId);
b.writeUint8(this.orderId);

}
public read(b){
let len;
this.groupId=b.readUint8()
this.orderId=b.readUint8()

}
	constructor(){}
}/*新手引导初始化 协议id:10213*/
export class GuideInit_revc{
public protoid:number = 10213
	/*新手引导*/
	public datalist:stGuide[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stGuide()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*新手引导变化 协议id:10214*/
export class Guide_req{
public protoid:number = 10214
	/*新手引导变化请求数据*/
	public data:stGuide=new stGuide();

public write(b){
let len;
this.data.write(b);

}
	constructor(){}
}/*新手引导变化 协议id:10215*/
export class Guide_revc{
public protoid:number = 10215
	/*新手变化*/
	public datalist:stGuide[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stGuide()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stChat{
public protoid:number = undefined
	/*序列号*/
	public uid:number;

	/*玩家角色ID*/
	public playerId:number;

	/*玩家当前等级*/
	public level:number;

	/*玩家昵称*/
	public nickName:string;

	/*玩家头像*/
	public headUrl:string;

	/*头像框*/
	public headFrame:number;

	/*称号id*/
	public titleId:number;

	/*头像上是否有钻石*/
	public diamond:number;

	/*角色最新的奖杯数量*/
	public trophy:number;

	/*当前最高奖杯所处的阶段*/
	public trophyStage:number;

	/*聊天内容*/
	public chat:string;

	/*表情id（默认0，表示没表情）*/
	public emojiId:number;

	/*类型 0默认专服内聊天 1好友私聊*/
	public type:number;

	/*时间戳*/
	public unix:number;

public write(b){
let len;
b.writeUint32(this.uid);
b.writeUint32(this.playerId);
b.writeUint16(this.level);
b.writeUTFString(this.nickName||"");
b.writeUTFString(this.headUrl||"");
b.writeUint8(this.headFrame);
b.writeUint8(this.titleId);
b.writeUint8(this.diamond);
b.writeUint32(this.trophy);
b.writeUint8(this.trophyStage);
b.writeUTFString(this.chat||"");
b.writeUint8(this.emojiId);
b.writeUint8(this.type);
b.writeUint32(this.unix);

}
public read(b){
let len;
this.uid=b.readUint32()
this.playerId=b.readUint32()
this.level=b.readUint16()
this.nickName=b.readUTFString()
this.headUrl=b.readUTFString()
this.headFrame=b.readUint8()
this.titleId=b.readUint8()
this.diamond=b.readUint8()
this.trophy=b.readUint32()
this.trophyStage=b.readUint8()
this.chat=b.readUTFString()
this.emojiId=b.readUint8()
this.type=b.readUint8()
this.unix=b.readUint32()

}
	constructor(){}
}export class stChatChannel{
public protoid:number = undefined
	/*频道id*/
	public channelId:number;

	/*频道聊天数据*/
	public datalist:stChat[];

public write(b){
let len;
b.writeUint8(this.channelId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.channelId=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stChat()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*聊天列表（全量） 协议id:10216*/
export class ChatListInit_revc{
public protoid:number = 10216
	/*聊天列表*/
	public datalist:stChatChannel[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stChatChannel()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*发起聊天 协议id:10217*/
export class Chat_req{
public protoid:number = 10217
	/*聊天内容*/
	public chat:string;

	/*type=0频道id type=1好友id*/
	public channelId:number;

	/*表情id（默认0，表示没表情）*/
	public emojiId:number;

	/*类型 0默认专服内聊天 1好友私聊*/
	public type:number;

public write(b){
let len;
b.writeUTFString(this.chat||"");
b.writeUint32(this.channelId);
b.writeUint8(this.emojiId);
b.writeUint8(this.type);

}
	constructor(){}
}/*聊天列表变化量（有新消息时主动推） 协议id:10218*/
export class Chat_revc{
public protoid:number = 10218
	/*消息列表*/
	public datalist:stChatChannel[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stChatChannel()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stFuncPopup{
public protoid:number = undefined
	/*功能id*/
	public funcId:number;

	/*0当前未强弹, 1已强弹*/
	public exist:number;

public write(b){
let len;
b.writeUint16(this.funcId);
b.writeUint8(this.exist);

}
public read(b){
let len;
this.funcId=b.readUint16()
this.exist=b.readUint8()

}
	constructor(){}
}/*功能强弹初始化 协议id:10219*/
export class FuncPopupInit_revc{
public protoid:number = 10219
	/*聊天列表*/
	public datalist:stFuncPopup[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFuncPopup()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*功能强弹更新 协议id:10220*/
export class FuncPopup_req{
public protoid:number = 10220
	/*功能id*/
	public datalist:number[];

public write(b){
let len;

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
b.writeUint16(this.datalist[i]);
}

}
	constructor(){}
}/*功能强弹变化 协议id:10221*/
export class FuncPopup_revc{
public protoid:number = 10221
	/*功能id*/
	public datalist:stFuncPopup[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFuncPopup()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*设置波次gm 协议id:10222*/
export class GmSetWave_req{
public protoid:number = 10222
	/*波次*/
	public wave:number;

public write(b){
let len;
b.writeUint8(this.wave);

}
	constructor(){}
}/*好友房间号是否存在 协议id:10223*/
export class FriendRoomExistInit_revc{
public protoid:number = 10223
	/*4位数房间标识*/
	public roomSn:string;

public read(b){
let len;
this.roomSn=b.readUTFString()

}
	constructor(){}
}export class stGodRoad{
public protoid:number = undefined
	/*成仙之路id*/
	public id:number;

	/*领取状态 0不可领取 1可领取 2已领取*/
	public status:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.status);

}
public read(b){
let len;
this.id=b.readUint8()
this.status=b.readUint8()

}
	constructor(){}
}/*成仙之路初始化 协议id:10224*/
export class GodRoadInit_revc{
public protoid:number = 10224
	/*成仙之路初始化*/
	public datalist:stGodRoad[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stGodRoad()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取成仙之路奖励 协议id:10225*/
export class GodRoad_req{
public protoid:number = 10225
	/*成仙之路id*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.id);

}
	constructor(){}
}/*成仙之路奖励变化 协议id:10226*/
export class GodRoad_revc{
public protoid:number = 10226
	/*成仙之路奖励变化*/
	public datalist:stGodRoad[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stGodRoad()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*肉鸽列表（有肉鸽选项时推，断线重连时推） 协议id:10227*/
export class RougeList_revc{
public protoid:number = 10227
	/*表t_Function_Coop的f_id*/
	public datalist:number[];

	/*选择过期时间戳*/
	public unix:number;

public read(b){
let len;
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint32())
}
this.unix=b.readUint32()

}
	constructor(){}
}/*肉鸽选择（返回10229） 协议id:10228*/
export class RougeChoose_req{
public protoid:number = 10228
	/*表t_Function_Coop的f_id*/
	public fid:number;

public write(b){
let len;
b.writeUint32(this.fid);

}
	constructor(){}
}/*肉鸽选择 协议id:10229*/
export class RougeChoose_revc{
public protoid:number = 10229
	/*做选择的玩家id*/
	public playerId:number;

	/*表t_Function_Coop的f_id*/
	public fid:number;

public read(b){
let len;
this.playerId=b.readUint32()
this.fid=b.readUint32()

}
	constructor(){}
}export class stPSCnt{
public protoid:number = undefined
	/*0观看广告 1花道具购买*/
	public type:number;

	/*对应次数*/
	public cnt:number;

public write(b){
let len;
b.writeUint8(this.type);
b.writeUint8(this.cnt);

}
public read(b){
let len;
this.type=b.readUint8()
this.cnt=b.readUint8()

}
	constructor(){}
}/*体力相关初始化 协议id:10230*/
export class PSInit_revc{
public protoid:number = 10230
	/*购买次数列表*/
	public datalist:stPSCnt[];

	/*体力下一次恢复时间戳,0标识没有*/
	public nextRecorverUnix:number;

	/*恢复满体力需要多少秒*/
	public secToFullPS:number;

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stPSCnt()
item.read(b);
this.datalist.push(item);

}
this.nextRecorverUnix=b.readUint32()
this.secToFullPS=b.readUint32()

}
	constructor(){}
}/*购买体力 协议id:10231*/
export class PSBuy_req{
public protoid:number = 10231
	/*0看广告 1道具消耗*/
	public flag:number;

public write(b){
let len;
b.writeUint8(this.flag);

}
	constructor(){}
}/*购买体力相关变化(变量) 协议id:10232*/
export class PSBuy_revc{
public protoid:number = 10232
	/*购买次数列表*/
	public datalist:stPSCnt[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stPSCnt()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*购买体力相关变化 协议id:10233*/
export class PSTime_revc{
public protoid:number = 10233
	/*体力下一次恢复时间戳,0标识没有*/
	public nextRecorverUnix:number;

	/*恢复满体力需要多少秒*/
	public secToFullPS:number;

public read(b){
let len;
this.nextRecorverUnix=b.readUint32()
this.secToFullPS=b.readUint32()

}
	constructor(){}
}/*判断房间是pvp还是pve 协议id:10234*/
export class RoomMode_req{
public protoid:number = 10234
	/*4位数房间标识*/
	public roomSn:string;

public write(b){
let len;
b.writeUTFString(this.roomSn||"");

}
	constructor(){}
}/*判断房间是pvp还是pve 协议id:10235*/
export class RoomMode_revc{
public protoid:number = 10235
	/*4位数房间标识*/
	public roomSn:string;

	/*1-pvp模式 2-pve模式*/
	public mode:number;

public read(b){
let len;
this.roomSn=b.readUTFString()
this.mode=b.readUint8()

}
	constructor(){}
}/*pve领取多倍奖励 协议id:10236*/
export class PveMultiReward_req{
public protoid:number = 10236
	/*房间号*/
	public roomId:number;

	/*2双倍奖励 3三倍奖励*/
	public multi:number;

public write(b){
let len;
b.writeUint32(this.roomId);
b.writeUint8(this.multi);

}
	constructor(){}
}/*绑定邀请码 协议id:10237*/
export class InviteBind_req{
public protoid:number = 10237
	/*平台id*/
	public platId:number;

	/*邀请码*/
	public code:string;

public write(b){
let len;
b.writeUint8(this.platId);
b.writeUTFString(this.code||"");

}
	constructor(){}
}/*绑定邀请码成功 协议id:10238*/
export class InviteBind_revc{
public protoid:number = 10238
	/*平台id*/
	public platId:number;

	/*绑定邀请 0未绑定 1已绑定*/
	public binded:number;

public read(b){
let len;
this.platId=b.readUint8()
this.binded=b.readUint8()

}
	constructor(){}
}/*同步在线时长 协议id:10239*/
export class OnlineSec_req{
public protoid:number = 10239
public write(b){
let len;

}
	constructor(){}
}/*在线时长变化,全量直接等 协议id:10240*/
export class OnlineSec_revc{
public protoid:number = 10240
	/*在线一共多少秒*/
	public sec:number;

public read(b){
let len;
this.sec=b.readUint32()

}
	constructor(){}
}/*玩家额外信息初始化 协议id:10241*/
export class PlayerExInfoInit_revc{
public protoid:number = 10241
	/*已登录天数*/
	public days:number;

public read(b){
let len;
this.days=b.readUint32()

}
	constructor(){}
}/*获取已登录天数,全量直接等 协议id:10242*/
export class LoginDays_revc{
public protoid:number = 10242
	/*已登录天数*/
	public days:number;

public read(b){
let len;
this.days=b.readUint32()

}
	constructor(){}
}export class stHolyBeastRankTime{
public protoid:number = undefined
	/*圣兽活动id*/
	public activityId:number;

	/*圣兽排行榜时间的开始时间戳*/
	public begin:number;

	/*圣兽排行榜时间的结束时间戳*/
	public end:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint32(this.begin);
b.writeUint32(this.end);

}
public read(b){
let len;
this.activityId=b.readUint16()
this.begin=b.readUint32()
this.end=b.readUint32()

}
	constructor(){}
}export class stHolyBeastData{
public protoid:number = undefined
	/*圣兽活动id*/
	public activityId:number;

	/*亲密度*/
	public num:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint32(this.num);

}
public read(b){
let len;
this.activityId=b.readUint16()
this.num=b.readUint32()

}
	constructor(){}
}export class stHolyBeastDataReward{
public protoid:number = undefined
	/*圣兽活动id*/
	public activityId:number;

	/*奖励状态列表*/
	public datalist:stHolyBeastDataRewardList[];

public write(b){
let len;
b.writeUint16(this.activityId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.activityId=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastDataRewardList()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stHolyBeastDataRewardList{
public protoid:number = undefined
	/*亲密度奖励id*/
	public id:number;

	/*0不可领取 1可领取 2已领取*/
	public state:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.state);

}
public read(b){
let len;
this.id=b.readUint8()
this.state=b.readUint8()

}
	constructor(){}
}export class stHolyBeastLog{
public protoid:number = undefined
	/*圣兽活动id*/
	public activityId:number;

	/*日志列表*/
	public datalist:stHolyBeastLogDetail[];

public write(b){
let len;
b.writeUint16(this.activityId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.activityId=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastLogDetail()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stHolyBeastLogDetail{
public protoid:number = undefined
	/*日志的序列号*/
	public serialNum:number;

	/*日志时间*/
	public time:number;

	/*玩家角色id*/
	public playerId:number;

	/*角色名称*/
	public nickName:string;

	/*对应t_HolyBeast_Draw_Rate的fid*/
	public drawId:number;

public write(b){
let len;
b.writeUint32(this.serialNum);
b.writeUint32(this.time);
b.writeUint32(this.playerId);
b.writeUTFString(this.nickName||"");
b.writeUint16(this.drawId);

}
public read(b){
let len;
this.serialNum=b.readUint32()
this.time=b.readUint32()
this.playerId=b.readUint32()
this.nickName=b.readUTFString()
this.drawId=b.readUint16()

}
	constructor(){}
}export class stHolyBeastRank{
public protoid:number = undefined
	/*圣兽活动id*/
	public activityId:number;

	/*开服冲榜前100名的信息*/
	public datalist:stCommonRank[];

	/*当前玩家自己在开服冲榜的排名 长度=0则没有,最大长度为1*/
	public self:stCommonRank[];

public write(b){
let len;
b.writeUint16(this.activityId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

this.self=this.self||[];
len = this.self.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.self[i].write(b);
}

}
public read(b){
let len;
this.activityId=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonRank()
item.read(b);
this.datalist.push(item);

}
this.self=this.self||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonRank()
item.read(b);
this.self.push(item);

}

}
	constructor(){}
}export class stHolyBeastTask{
public protoid:number = undefined
	/*圣兽活动id*/
	public activityId:number;

	/*任务详情*/
	public datalist:stHolyBeastTaskDetail[];

public write(b){
let len;
b.writeUint16(this.activityId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.activityId=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastTaskDetail()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stHolyBeastTaskDetail{
public protoid:number = undefined
	/*任务id*/
	public id:number;

	/*任务完成数量*/
	public cnt:number;

	/*0不可领取 1可领取 2已领取*/
	public state:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint16(this.cnt);
b.writeUint8(this.state);

}
public read(b){
let len;
this.id=b.readUint16()
this.cnt=b.readUint16()
this.state=b.readUint8()

}
	constructor(){}
}export class stHolyBeastExchange{
public protoid:number = undefined
	/*圣兽活动id*/
	public activityId:number;

	/*兑换数据列表*/
	public datalist:stHolyBeastExchangeDetail[];

public write(b){
let len;
b.writeUint16(this.activityId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.activityId=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastExchangeDetail()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stHolyBeastExchangeDetail{
public protoid:number = undefined
	/*兑换奖励id*/
	public id:number;

	/*已兑换数量*/
	public cnt:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint16(this.cnt);

}
public read(b){
let len;
this.id=b.readUint16()
this.cnt=b.readUint16()

}
	constructor(){}
}/*圣兽活动初始化或系统刷新 协议id:10243*/
export class HolyBeastInitOrFresh_revc{
public protoid:number = 10243
	/*圣兽活动各个排行榜开始与结束时间*/
	public rankTimeList:stHolyBeastRankTime[];

	/*圣兽活动亲密度数据,变化走10245(全量)*/
	public datalist:stHolyBeastData[];

	/*圣兽活动亲密度奖励领取情况,变化走10247(变量)*/
	public dataRewardList:stHolyBeastDataReward[];

	/*圣兽活动任务情况,变化走10253(变量)*/
	public taskList:stHolyBeastTask[];

	/*圣兽活动兑换数据,变化走10255(变量)*/
	public exchangeList:stHolyBeastExchange[];

public read(b){
let len;
this.rankTimeList=this.rankTimeList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastRankTime()
item.read(b);
this.rankTimeList.push(item);

}
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastData()
item.read(b);
this.datalist.push(item);

}
this.dataRewardList=this.dataRewardList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastDataReward()
item.read(b);
this.dataRewardList.push(item);

}
this.taskList=this.taskList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastTask()
item.read(b);
this.taskList.push(item);

}
this.exchangeList=this.exchangeList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastExchange()
item.read(b);
this.exchangeList.push(item);

}

}
	constructor(){}
}/*圣兽活动抽取/解救 协议id:10244*/
export class HolyBeastExtract_req{
public protoid:number = 10244
	/*圣兽活动id*/
	public activityId:number;

	/*抽取/解救次数*/
	public cnt:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint8(this.cnt);

}
	constructor(){}
}/*圣兽活动抽取/解救次数或亲密度 协议id:10245*/
export class HolyBeastExtract_revc{
public protoid:number = 10245
	/*抽取/解救次数*/
	public cnt:number;

	/*序列号*/
	public serialNum:number;

	/*数据变化后的全量直接=*/
	public datalist:stHolyBeastData[];

public read(b){
let len;
this.cnt=b.readUint8()
this.serialNum=b.readUint32()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastData()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取圣兽活动亲密度奖励 协议id:10246*/
export class HolyBeastExtractReward_req{
public protoid:number = 10246
	/*圣兽活动id*/
	public activityId:number;

	/*奖励id*/
	public id:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint16(this.id);

}
	constructor(){}
}/*圣兽活动亲密度奖励变化 协议id:10247*/
export class HolyBeastExtractReward_revc{
public protoid:number = 10247
	/*奖励数量变化量*/
	public datalist:stHolyBeastDataReward[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastDataReward()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*圣兽活动抽取/解救日志 协议id:10248*/
export class HolyBeastLog_req{
public protoid:number = 10248
	/*0自己的抽取日志/1全部的抽取日志*/
	public flag:number;

	/*圣兽活动id*/
	public activityId:number;

	/*flag=0直接传0, flag=1传0则拉取全量 >0则获取当前序列号之后的变量*/
	public serialNum:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint16(this.activityId);
b.writeUint32(this.serialNum);

}
	constructor(){}
}/*圣兽活动抽取/解救日志 协议id:10249*/
export class HolyBeastLog_revc{
public protoid:number = 10249
	/*0自己的抽取日志/1全部的抽取日志*/
	public flag:number;

	/*日志列表*/
	public datalist:stHolyBeastLog[];

public read(b){
let len;
this.flag=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastLog()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*打开圣兽活动抽取/解救排行榜 协议id:10250*/
export class HolyBeastRank_req{
public protoid:number = 10250
	/*圣兽活动id*/
	public activityId:number;

public write(b){
let len;
b.writeUint16(this.activityId);

}
	constructor(){}
}/*圣兽活动抽取/解救排行榜返回 协议id:10251*/
export class HolyBeastRank_revc{
public protoid:number = 10251
	/*排行榜列表*/
	public datalist:stHolyBeastRank[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastRank()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取圣兽活动任务奖励 协议id:10252*/
export class HolyBeastTask_req{
public protoid:number = 10252
	/*圣兽活动id*/
	public activityId:number;

	/*任务id*/
	public id:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint16(this.id);

}
	constructor(){}
}/*领取圣兽活动任务奖励返回 协议id:10253*/
export class HolyBeastTask_revc{
public protoid:number = 10253
	/*任务变量*/
	public datalist:stHolyBeastTask[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastTask()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*圣兽活动兑换请求 协议id:10254*/
export class HolyBeastExchange_req{
public protoid:number = 10254
	/*圣兽活动id*/
	public activityId:number;

	/*兑换物品配置id*/
	public id:number;

	/*兑换物品数量*/
	public cnt:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint16(this.id);
b.writeUint16(this.cnt);

}
	constructor(){}
}/*圣兽活动变量 协议id:10255*/
export class HolyBeastExchange_revc{
public protoid:number = 10255
	/*圣兽活动变量*/
	public datalist:stHolyBeastExchange[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stHolyBeastExchange()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*获取抽取奖励,返回3025 协议id:10256*/
export class GetHolyBeastExtractReward_req{
public protoid:number = 10256
	/*圣兽活动id*/
	public activityId:number;

	/*序列号*/
	public serialNum:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint32(this.serialNum);

}
	constructor(){}
}export class stSevenDayBigReward{
public protoid:number = undefined
	/*t_Sevenday_Task_Config表的f_id*/
	public id:number;

	/*0不可领取 1可领取 2已领取*/
	public state:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.state);

}
public read(b){
let len;
this.id=b.readUint8()
this.state=b.readUint8()

}
	constructor(){}
}export class stSevenDayTaskDetail{
public protoid:number = undefined
	/*任务id（t_Sevenday_Task表f_id）*/
	public id:number;

	/*任务完成数量*/
	public cnt:number;

	/*0不可领取 1可领取 2已领取*/
	public state:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint16(this.cnt);
b.writeUint8(this.state);

}
public read(b){
let len;
this.id=b.readUint16()
this.cnt=b.readUint16()
this.state=b.readUint8()

}
	constructor(){}
}/*七日活动初始化或系统刷新 协议id:10257*/
export class SevenDayInitOrFresh_revc{
public protoid:number = 10257
	/*解锁的天数（t_Sevenday_Task_Config表的f_id）*/
	public day:number;

	/*大奖数据列表（全部量）*/
	public bigRewardList:stSevenDayBigReward[];

	/*任务数据列表（全部量）*/
	public taskList:stSevenDayTaskDetail[];

public read(b){
let len;
this.day=b.readUint8()
this.bigRewardList=this.bigRewardList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSevenDayBigReward()
item.read(b);
this.bigRewardList.push(item);

}
this.taskList=this.taskList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSevenDayTaskDetail()
item.read(b);
this.taskList.push(item);

}

}
	constructor(){}
}/*七日活动任务更新 协议id:10258*/
export class SevenDayTaskUpdate_revc{
public protoid:number = 10258
	/*任务数据列表（变化量）*/
	public datalist:stSevenDayTaskDetail[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSevenDayTaskDetail()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取七日活动任务奖励（返回10258） 协议id:10259*/
export class SevenDayTaskReward_req{
public protoid:number = 10259
	/*任务id(t_Sevenday_Task表f_id)*/
	public id:number;

public write(b){
let len;
b.writeUint16(this.id);

}
	constructor(){}
}/*七日活动大奖状态更新 协议id:10260*/
export class SevenDayBigRewardUpdate_revc{
public protoid:number = 10260
	/*大奖数据列表（变化量）*/
	public datalist:stSevenDayBigReward[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSevenDayBigReward()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取七日活动任务奖励（返回10260） 协议id:10261*/
export class SevenDayBigReward_req{
public protoid:number = 10261
	/*任务id(t_Sevenday_Task_Config表f_id)*/
	public id:number;

public write(b){
let len;
b.writeUint16(this.id);

}
	constructor(){}
}/*今日已获得的神魄次数(全量) 协议id:10262*/
export class TodaySpirit_revc{
public protoid:number = 10262
	/*今日已获得的神魄次数*/
	public spirit:number;

public read(b){
let len;
this.spirit=b.readUint8()

}
	constructor(){}
}/*礼包购买英雄 协议id:10263*/
export class HeroBuyByPack_req{
public protoid:number = 10263
	/*t_Mythical_Choice表fid*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.id);

}
	constructor(){}
}export class stMonsterNum{
public protoid:number = undefined
	/*玩家id 0表示机器人*/
	public playerId:number;

	/*怪物数量*/
	public monsterNum:number;

public write(b){
let len;
b.writeUint32(this.playerId);
b.writeUint8(this.monsterNum);

}
public read(b){
let len;
this.playerId=b.readUint32()
this.monsterNum=b.readUint8()

}
	constructor(){}
}/*怪物数量同步（一秒一次） 协议id:10264*/
export class MonsterNum_revc{
public protoid:number = 10264
	/*怪物数量列表*/
	public datalist:stMonsterNum[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMonsterNum()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*召唤次数 协议id:10265*/
export class SommonTimes_revc{
public protoid:number = 10265
	/*召唤次数*/
	public num:number;

public read(b){
let len;
this.num=b.readUint16()

}
	constructor(){}
}/*pvp解锁条件任务*/
export class stPvPUnlockTask{
public protoid:number = undefined
	/*pvp解锁任务类型对应t_Pvp_Unlock_Condition的f_task_type*/
	public taskType:number;

	/*当前任务类型完成数量*/
	public val:number;

public write(b){
let len;
b.writeUint16(this.taskType);
b.writeUint16(this.val);

}
public read(b){
let len;
this.taskType=b.readUint16()
this.val=b.readUint16()

}
	constructor(){}
}/*pvp解锁信息初始化 协议id:10266*/
export class PvPUnlockInit_revc{
public protoid:number = 10266
	/*是否解锁 0未解锁 1已解锁*/
	public unlock:number;

	/*解锁条件数据(t_Pvp_Unlock_Condition) pvp未解锁时候只发f_task_type=28(累计收集100张技能卡) pvp解锁时候这里为空*/
	public tasks:stPvPUnlockTask[];

	/*已领了哪些奖励id,对应t_Pvp_Unlock_Condition的f_id，pvp已解锁发空*/
	public rewardExistIds:number[];

public read(b){
let len;
this.unlock=b.readUint8()
this.tasks=this.tasks||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stPvPUnlockTask()
item.read(b);
this.tasks.push(item);

}
this.rewardExistIds=this.rewardExistIds||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.rewardExistIds.push(b.readUint8())
}

}
	constructor(){}
}/*pvp解锁条件数据变化 协议id:10267*/
export class PvPUnlockTask_revc{
public protoid:number = 10267
	/*解锁条件数据(目前只有技能卡数据更新)*/
	public datalist:stPvPUnlockTask[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stPvPUnlockTask()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*pvp解锁奖励变化(全量) 协议id:10268*/
export class PvPUnlockRewards_revc{
public protoid:number = 10268
	/*已领了哪些奖励id,对应t_Pvp_Unlock_Condition的f_id*/
	public datalist:number[];

public read(b){
let len;
this.datalist=this.datalist||[];
len = b.readInt32();
for(let i = 0;i < len;i++){
this.datalist.push(b.readUint8())
}

}
	constructor(){}
}/*解锁pvp(领奖返回10268,解锁返回10270) 协议id:10269*/
export class PvPUnlock_req{
public protoid:number = 10269
	/*0领取解锁奖励 1解锁pvp(奖励都领了才能解锁)*/
	public flag:number;

	/*是否完成试炼 0未完成 1已完成*/
	public finishTrial:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint8(this.finishTrial);

}
	constructor(){}
}/*解锁pvp 协议id:10270*/
export class PvPUnlock_revc{
public protoid:number = 10270
	/*是否解锁 0未解锁 1已解锁*/
	public unlock:number;

public read(b){
let len;
this.unlock=b.readUint8()

}
	constructor(){}
}export class stNewInvite{
public protoid:number = undefined
	/*当日邀请栏位*/
	public pos:number;

	/*玩家id*/
	public playerId:number;

	/*头像*/
	public headUrl:string;

	/*领取状态 0不可领取 1可领取 2已领取*/
	public status:number;

public write(b){
let len;
b.writeUint8(this.pos);
b.writeUint32(this.playerId);
b.writeUTFString(this.headUrl||"");
b.writeUint8(this.status);

}
public read(b){
let len;
this.pos=b.readUint8()
this.playerId=b.readUint32()
this.headUrl=b.readUTFString()
this.status=b.readUint8()

}
	constructor(){}
}/*新邀请(初始化或系统刷新推送) 协议id:10271*/
export class NewInviteInitOrFresh_revc{
public protoid:number = 10271
	/*玩家是否可邀请 0不可邀请 1可邀请*/
	public canInvite:number;

	/*邀请列表,不可邀请时候为空*/
	public datalist:stNewInvite[];

public read(b){
let len;
this.canInvite=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stNewInvite()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取新邀请奖励,返回10273 协议id:10272*/
export class NewInvite_req{
public protoid:number = 10272
	/*当日邀请栏位*/
	public pos:number;

public write(b){
let len;
b.writeUint8(this.pos);

}
	constructor(){}
}/*新邀请相关变量(新邀请到了玩家或领取邀请奖励) 协议id:10273*/
export class NewInvite_revc{
public protoid:number = 10273
	/*邀请列表变化,新增或领取奖励*/
	public datalist:stNewInvite[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stNewInvite()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取pve首通奖励 协议id:10274*/
export class FirstPassRewardCoop_req{
public protoid:number = 10274
	/*首通奖励id对应t_First_Pass_Reward_Coop的f_id*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.id);

}
	constructor(){}
}/*pve首通奖励变量(可领或已领变化) 协议id:10275*/
export class FirstPassRewardCoop_revc{
public protoid:number = 10275
	/*pve首通奖励可领或已领变量*/
	public datalist:stFirstPassRewardCoop[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFirstPassRewardCoop()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stMainTask{
public protoid:number = undefined
	/*主线任务id*/
	public id:number;

	/*任务完成数量*/
	public val:number;

	/*领取状态 0不可领取 1可领取 2已领取*/
	public status:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint16(this.val);
b.writeUint8(this.status);

}
public read(b){
let len;
this.id=b.readUint16()
this.val=b.readUint16()
this.status=b.readUint8()

}
	constructor(){}
}/*主线任务初始化 协议id:10276*/
export class MainTaskInit_revc{
public protoid:number = 10276
	/*当前主线任务*/
	public mainTask:stMainTask=new stMainTask();

public read(b){
let len;
this.mainTask.read(b);

}
	constructor(){}
}/*领取主线任务奖励,返回10278 协议id:10277*/
export class MainTask_req{
public protoid:number = 10277
	/*主线任务id*/
	public id:number;

public write(b){
let len;
b.writeUint16(this.id);

}
	constructor(){}
}/*主线任务变化(领取或任务完成数量变化时推送) 协议id:10278*/
export class MainTask_revc{
public protoid:number = 10278
	/*当前主线任务*/
	public mainTask:stMainTask=new stMainTask();

public read(b){
let len;
this.mainTask.read(b);

}
	constructor(){}
}export class stFriendListItem{
public protoid:number = undefined
	/*玩家角色id*/
	public playerId:number;

	/*玩家等级*/
	public playerLevel:number;

	/*玩家昵称*/
	public nickName:string;

	/*头像*/
	public headUrl:string;

	/*头像框*/
	public headFrame:number;

	/*称号id*/
	public titleId:number;

	/*排位赛积分（奖杯数）*/
	public trophy:number;

	/*友情点数*/
	public friendship:number;

	/*0不在线 1在线*/
	public online:number;

	/*好友任务列表数据*/
	public datalist:stFriendTask[];

public write(b){
let len;
b.writeUint32(this.playerId);
b.writeUint16(this.playerLevel);
b.writeUTFString(this.nickName||"");
b.writeUTFString(this.headUrl||"");
b.writeUint8(this.headFrame);
b.writeUint16(this.titleId);
b.writeUint32(this.trophy);
b.writeUint32(this.friendship);
b.writeUint8(this.online);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.playerId=b.readUint32()
this.playerLevel=b.readUint16()
this.nickName=b.readUTFString()
this.headUrl=b.readUTFString()
this.headFrame=b.readUint8()
this.titleId=b.readUint16()
this.trophy=b.readUint32()
this.friendship=b.readUint32()
this.online=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFriendTask()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stFriendTask{
public protoid:number = undefined
	/*任务id*/
	public taskId:number;

	/*任务完成数量*/
	public num:number;

public write(b){
let len;
b.writeUint16(this.taskId);
b.writeUint32(this.num);

}
public read(b){
let len;
this.taskId=b.readUint16()
this.num=b.readUint32()

}
	constructor(){}
}/*好友列表（全部量） 协议id:10300*/
export class FriendList_revc{
public protoid:number = 10300
	/*0申请列表 1是好友列表 2搜索列表 3推荐列表*/
	public type:number;

	/*好友列表数据*/
	public datalist:stFriendListItem[];

public read(b){
let len;
this.type=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFriendListItem()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*好友列表刷新（返回10300） 协议id:10301*/
export class FriendList_req{
public protoid:number = 10301
	/*0申请列表 1是好友列表 3推荐列表*/
	public type:number;

public write(b){
let len;
b.writeUint8(this.type);

}
	constructor(){}
}/*好友管理 协议id:10302*/
export class FriendManage_req{
public protoid:number = 10302
	/*玩家角色id（type为0或1时，playerId为0表示申请好友的全部玩家）*/
	public playerId:number;

	/*0拒绝 1同意 2删除 3添加好友*/
	public type:number;

public write(b){
let len;
b.writeUint32(this.playerId);
b.writeUint8(this.type);

}
	constructor(){}
}/*好友搜索 协议id:10303*/
export class FriendSearch_req{
public protoid:number = 10303
	/*玩家id或昵称*/
	public name:string;

public write(b){
let len;
b.writeUTFString(this.name||"");

}
	constructor(){}
}/*好友任务列表（变化量） 协议id:10305*/
export class FriendTaskListUpdate_revc{
public protoid:number = 10305
	/*玩家角色id*/
	public playerId:number;

	/*好友任务列表数据*/
	public datalist:stFriendTask[];

public read(b){
let len;
this.playerId=b.readUint32()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFriendTask()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*给好友点赞（返回10307） 协议id:10306*/
export class FriendZan_req{
public protoid:number = 10306
	/*玩家id*/
	public playerId:number;

public write(b){
let len;
b.writeUint32(this.playerId);

}
	constructor(){}
}/*给好友点赞 协议id:10307*/
export class FriendZan_revc{
public protoid:number = 10307
	/*玩家id*/
	public playerId:number;

	/*点赞数*/
	public zan:number;

public read(b){
let len;
this.playerId=b.readUint32()
this.zan=b.readUint32()

}
	constructor(){}
}/*幸运转盘抽奖 协议id:10308*/
export class LotteryReward_req{
public protoid:number = 10308
	/*抽奖次数0单抽 1十连抽*/
	public flag:number;

public write(b){
let len;
b.writeUint8(this.flag);

}
	constructor(){}
}/*幸运转盘抽奖 协议id:10309*/
export class LotteryReward_revc{
public protoid:number = 10309
	/*抽奖次数0单抽 1十连抽*/
	public flag:number;

	/*抽奖获得的奖品id(flag=0的时候>0,连抽时候=0)*/
	public id:number;

	/*显示奖励的序列号(10分钟内有效)*/
	public serial:number;

public read(b){
let len;
this.flag=b.readUint8()
this.id=b.readUint8()
this.serial=b.readUint32()

}
	constructor(){}
}/*幸运转盘抽奖 协议id:10310*/
export class LotteryRewardShow_req{
public protoid:number = 10310
	/*显示奖励的序列号*/
	public serial:number;

public write(b){
let len;
b.writeUint32(this.serial);

}
	constructor(){}
}/*好友私聊操作 协议id:10311*/
export class FriendPrivateChatAction_req{
public protoid:number = 10311
	/*0删除(聊天列表删除对应聊天,没有返回,客户端直接将当前去掉) 1新增(好友列表点击聊天时候发,返回10313)*/
	public flag:number;

	/*好友的角色id*/
	public friendId:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint32(this.friendId);

}
	constructor(){}
}export class stFriendPrivateChatRole{
public protoid:number = undefined
	/*最近的聊天序列号,数字越大时间越新*/
	public uid:number;

	/*好友的角色id*/
	public friendId:number;

	/*玩家当前等级*/
	public level:number;

	/*玩家昵称*/
	public nickName:string;

	/*玩家头像*/
	public headUrl:string;

	/*头像框*/
	public headFrame:number;

	/*角色最新的奖杯数量*/
	public trophy:number;

	/*当前最高奖杯所处的阶段*/
	public trophyStage:number;

	/*是否有红点 0没 1有*/
	public hasRed:number;

public write(b){
let len;
b.writeUint32(this.uid);
b.writeUint32(this.friendId);
b.writeUint16(this.level);
b.writeUTFString(this.nickName||"");
b.writeUTFString(this.headUrl||"");
b.writeUint8(this.headFrame);
b.writeUint32(this.trophy);
b.writeUint8(this.trophyStage);
b.writeUint8(this.hasRed);

}
public read(b){
let len;
this.uid=b.readUint32()
this.friendId=b.readUint32()
this.level=b.readUint16()
this.nickName=b.readUTFString()
this.headUrl=b.readUTFString()
this.headFrame=b.readUint8()
this.trophy=b.readUint32()
this.trophyStage=b.readUint8()
this.hasRed=b.readUint8()

}
	constructor(){}
}/*好友私聊的角色列表 协议id:10312*/
export class FriendPrivateChatRoles_req{
public protoid:number = 10312
public write(b){
let len;

}
	constructor(){}
}/*好友私聊的角色列表 协议id:10313*/
export class FriendPrivateChatRoles_revc{
public protoid:number = 10313
	/*私聊的好友角色列表*/
	public datalist:stFriendPrivateChatRole[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stFriendPrivateChatRole()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*好友私聊的消息列表 协议id:10314*/
export class FriendPrivateChatContents_req{
public protoid:number = 10314
	/*好友的角色id*/
	public friendId:number;

public write(b){
let len;
b.writeUint32(this.friendId);

}
	constructor(){}
}/*好友私聊的消息列表 协议id:10315*/
export class FriendPrivateChatContents_revc{
public protoid:number = 10315
	/*好友的角色id*/
	public friendId:number;

	/*0变化量(数据往里面加) 1全量(直接等)*/
	public isHole:number;

	/*当前好友的聊天数据*/
	public datalist:stChat[];

public read(b){
let len;
this.friendId=b.readUint32()
this.isHole=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stChat()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*发起好友切磋,收到10317弹出等待界面 协议id:10316*/
export class FriendDiscuss_req{
public protoid:number = 10316
	/*1-pvp模式 2-pve模式 3-pve困难模式 4-pve年兽 5pve地域模式*/
	public mode:number;

	/*好友的角色id*/
	public friendId:number;

public write(b){
let len;
b.writeUint8(this.mode);
b.writeUint32(this.friendId);

}
	constructor(){}
}/*发起好友切磋发起成功(向发起者及接收者都推送) 协议id:10317*/
export class FriendDiscuss_revc{
public protoid:number = 10317
	/*0发起者 1受邀者*/
	public flag:number;

	/*1-pvp模式 2-pve模式 3-pve困难模式 4-pve年兽 5pve地域模式*/
	public mode:number;

	/*当前切磋的序列号(备用)*/
	public serial:number;

	/*切磋发起者的昵称*/
	public nickName:string;

public read(b){
let len;
this.flag=b.readUint8()
this.mode=b.readUint8()
this.serial=b.readUint32()
this.nickName=b.readUTFString()

}
	constructor(){}
}/*发起者取消好友切磋(返回原3005 code=14) 协议id:10318*/
export class FriendDiscussCancel_req{
public protoid:number = 10318
public write(b){
let len;

}
	constructor(){}
}/*受邀者操作好友切磋 协议id:10319*/
export class FriendDiscussAction_req{
public protoid:number = 10319
	/*0拒绝 1接受*/
	public action:number;

public write(b){
let len;
b.writeUint8(this.action);

}
	constructor(){}
}/*受邀者关闭好友切磋界面 协议id:10320*/
export class FriendDiscussAction_revc{
public protoid:number = 10320
public read(b){
let len;

}
	constructor(){}
}export class stPvpTurnBasedHp{
public protoid:number = undefined
	/*玩家id*/
	public playerId:number;

	/*玩家血量*/
	public hp:number;

public write(b){
let len;
b.writeUint32(this.playerId);
b.writeUint8(this.hp);

}
public read(b){
let len;
this.playerId=b.readUint32()
this.hp=b.readUint8()

}
	constructor(){}
}/*pvp回合制准备结束 协议id:10321*/
export class PvpTurnBasedReady_req{
public protoid:number = 10321
public write(b){
let len;

}
	constructor(){}
}/*pvp回合制玩家血量 协议id:10322*/
export class PvpTurnBasedHpList_revc{
public protoid:number = 10322
	/*血量数据*/
	public datalist:stPvpTurnBasedHp[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stPvpTurnBasedHp()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*pvp回合制玩家血量 协议id:10323*/
export class PvpTurnBasedHpUpdate_revc{
public protoid:number = 10323
	/*血量数据*/
	public datalist:stPvpTurnBasedHp[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stPvpTurnBasedHp()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*pvp回合制准备期间倒计时 协议id:10324*/
export class PvpTurnBasedCountDown_revc{
public protoid:number = 10324
	/*倒计时时间戳*/
	public unix:number;

	/*回合数*/
	public wave:number;

public read(b){
let len;
this.unix=b.readUint32()
this.wave=b.readUint8()

}
	constructor(){}
}/*好友列表点击查看好友 协议id:10325*/
export class FriendWatch_req{
public protoid:number = 10325
	/*好友角色id*/
	public accountId:number;

public write(b){
let len;
b.writeUint32(this.accountId);

}
	constructor(){}
}/*好友列表点击查看好友 协议id:10326*/
export class FriendWatch_revc{
public protoid:number = 10326
	/*好友数据(只给需要显示的数据)*/
	public playerData:stPlayerData=new stPlayerData();

	/*好友点赞数量*/
	public zanCnt:number;

	/*当前好友有没有点赞 1已点 0未点*/
	public zanExist:number;

	/*与当前玩家是否是好友 1是 0否*/
	public isFriend:number;

public read(b){
let len;
this.playerData.read(b);
this.zanCnt=b.readUint32()
this.zanExist=b.readUint8()
this.isFriend=b.readUint8()

}
	constructor(){}
}/*pvp回合制准备结束开始战斗 协议id:10327*/
export class PvpTurnBasedStartFight_revc{
public protoid:number = 10327
	/*1开始准备 2开始战斗 3准备结束 4开始肉鸽 5肉鸽结束*/
	public state:number;

public read(b){
let len;
this.state=b.readUint8()

}
	constructor(){}
}/*pvp回合制buff列表 协议id:10328*/
export class PvpTurnBasedBuffList_revc{
public protoid:number = 10328
	/*buff数据*/
	public datalist:stBattleBuff[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stBattleBuff()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*聊天红点 协议id:10329*/
export class ChatRed_revc{
public protoid:number = 10329
	/*类型 0默认专服内聊天 1好友私聊*/
	public type:number;

	/*是否有红点 0没 1有*/
	public hasRed:number;

public read(b){
let len;
this.type=b.readUint8()
this.hasRed=b.readUint8()

}
	constructor(){}
}/*离开好友私聊时候发送 协议id:10330*/
export class FriendPrivateChatOnLeave_req{
public protoid:number = 10330
	/*好友的角色id*/
	public friendId:number;

public write(b){
let len;
b.writeUint32(this.friendId);

}
	constructor(){}
}/*电鱼活动初始化或刷新 协议id:10331*/
export class CrazyFishInitOrFresh_revc{
public protoid:number = 10331
	/*t_Crazy_Fish_config的f_id,若为0则活动未开启*/
	public configId:number;

	/*保底次数*/
	public guarantee:number;

	/*本期充值购买次数*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.configId=b.readUint16()
this.guarantee=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*电鱼活动充值次数变化 协议id:10332*/
export class CrazyFishCharge_revc{
public protoid:number = 10332
	/*本期充值购买次数*/
	public datalist:stCommonTimes[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCommonTimes()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*兑换电鱼道具 协议id:10333*/
export class CrazyFishExchange_req{
public protoid:number = 10333
	/*兑换个数*/
	public cnt:number;

public write(b){
let len;
b.writeUint32(this.cnt);

}
	constructor(){}
}/*电鱼抽奖返回的序列号 协议id:10334*/
export class CrazyFishLottery_revc{
public protoid:number = 10334
	/*抽取次数 1单抽 10十连抽*/
	public cnt:number;

	/*序列号*/
	public serial:number;

	/*保底次数*/
	public guarantee:number;

public read(b){
let len;
this.cnt=b.readUint8()
this.serial=b.readUint32()
this.guarantee=b.readUint16()

}
	constructor(){}
}/*电鱼抽奖展示结果 协议id:10335*/
export class CrazyFishLotteryShow_req{
public protoid:number = 10335
	/*序列号*/
	public serial:number;

public write(b){
let len;
b.writeUint32(this.serial);

}
	constructor(){}
}/*回合结算奖励 协议id:10336*/
export class WaveSettleReward_revc{
public protoid:number = 10336
	/*当前回合*/
	public wave:number;

	/*0输 1赢*/
	public win:number;

	/*回合结算奖励数据*/
	public itemlist:stCellValue[];

public read(b){
let len;
this.wave=b.readUint8()
this.win=b.readUint8()
this.itemlist=this.itemlist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCellValue()
item.read(b);
this.itemlist.push(item);

}

}
	constructor(){}
}/*pvp回合制怪物数 协议id:10337*/
export class PvpTurnBasedMonsterNum_revc{
public protoid:number = 10337
	/*玩家id*/
	public playerId:number;

	/*总怪物数*/
	public total:number;

	/*杀死的怪物数*/
	public killNum:number;

public read(b){
let len;
this.playerId=b.readUint32()
this.total=b.readUint16()
this.killNum=b.readUint16()

}
	constructor(){}
}/*活动通用兑换 协议id:10338*/
export class ActivityExchange_req{
public protoid:number = 10338
	/*活动id*/
	public activityId:number;

	/*商品购买的次数*/
	public cnt:number;

public write(b){
let len;
b.writeUint16(this.activityId);
b.writeUint16(this.cnt);

}
	constructor(){}
}export class stCoverBigGoose{
public protoid:number = undefined
	/*大鹅位置*/
	public pos:number;

	/*大鹅位置上的奖励*/
	public reward:stCellValue=new stCellValue();

public write(b){
let len;
b.writeUint8(this.pos);
this.reward.write(b);

}
public read(b){
let len;
this.pos=b.readUint8()
this.reward.read(b);

}
	constructor(){}
}export class stCoverBigGooseTask{
public protoid:number = undefined
	/*套大鹅任务配置的f_id*/
	public id:number;

	/*套大鹅任务完成的数量*/
	public val:number;

	/*领取状态 0不可领取 1可领取 2已领取*/
	public status:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint16(this.val);
b.writeUint8(this.status);

}
public read(b){
let len;
this.id=b.readUint8()
this.val=b.readUint16()
this.status=b.readUint8()

}
	constructor(){}
}/*大鹅初始化信息 协议id:10339*/
export class CoverBigGooseInit_revc{
public protoid:number = 10339
	/*大奖id,t_Cover_Big_Goose_reward的f_id*/
	public bigPrize:number;

	/*已开奖的大鹅信息(未开奖的不推送)*/
	public datalist:stCoverBigGoose[];

	/*大鹅信息任务*/
	public tasks:stCoverBigGooseTask[];

public read(b){
let len;
this.bigPrize=b.readUint16()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCoverBigGoose()
item.read(b);
this.datalist.push(item);

}
this.tasks=this.tasks||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCoverBigGooseTask()
item.read(b);
this.tasks.push(item);

}

}
	constructor(){}
}/*大鹅对应奖励变量 协议id:10340*/
export class CoverBigGooseChange_revc{
public protoid:number = 10340
	/*0抽取变量(datalist是变量) 1重置大鹅奖励显示(datalist不传)*/
	public type:number;

	/*大鹅开奖变量*/
	public datalist:stCoverBigGoose[];

public read(b){
let len;
this.type=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCoverBigGoose()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*设置大鹅大奖 协议id:10341*/
export class CoverBigGooseBigPrize_req{
public protoid:number = 10341
	/*大奖id,t_Cover_Big_Goose_reward的f_id*/
	public id:number;

public write(b){
let len;
b.writeUint16(this.id);

}
	constructor(){}
}/*设置大鹅大奖 协议id:10342*/
export class CoverBigGooseBigPrize_revc{
public protoid:number = 10342
	/*大奖id,t_Cover_Big_Goose_reward的f_id*/
	public bigPrize:number;

public read(b){
let len;
this.bigPrize=b.readUint16()

}
	constructor(){}
}/*领取大鹅任务奖励 协议id:10343*/
export class CoverBigGooseTask_req{
public protoid:number = 10343
	/*套大鹅任务配置的f_id*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.id);

}
	constructor(){}
}/*领取大鹅任务变量 协议id:10344*/
export class CoverBigGooseTask_revc{
public protoid:number = 10344
	/*大鹅任务变量*/
	public tasks:stCoverBigGooseTask[];

public read(b){
let len;
this.tasks=this.tasks||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stCoverBigGooseTask()
item.read(b);
this.tasks.push(item);

}

}
	constructor(){}
}/*强化怪物的减血 协议id:10345*/
export class MonsterBlood2_revc{
public protoid:number = 10345
	/*强化怪物减血信息列表*/
	public datalist:stSubBlood[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSubBlood()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*pve模式开启变化变量 协议id:10346*/
export class PVEModes_revc{
public protoid:number = 10346
	/*0普通模式 1困难模式 2地域模式*/
	public modechange:number;

public read(b){
let len;
this.modechange=b.readUint8()

}
	constructor(){}
}export class stMonsterScale{
public protoid:number = undefined
	/*怪物uid*/
	public uid:number;

	/*缩放万分比*/
	public scale:number;

public write(b){
let len;
b.writeUint8(this.uid);
b.writeUint16(this.scale);

}
public read(b){
let len;
this.uid=b.readUint8()
this.scale=b.readUint16()

}
	constructor(){}
}/*怪物缩放比例 协议id:10347*/
export class MonsterScale_revc{
public protoid:number = 10347
	/*怪物缩放比例列表*/
	public datalist:stMonsterScale[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMonsterScale()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}export class stSpringFestivalRankTime{
public protoid:number = undefined
	/*春节年兽排行榜时间的开始时间戳*/
	public begin:number;

	/*春节年兽排行榜时间的结束时间戳*/
	public end:number;

public write(b){
let len;
b.writeUint32(this.begin);
b.writeUint32(this.end);

}
public read(b){
let len;
this.begin=b.readUint32()
this.end=b.readUint32()

}
	constructor(){}
}export class stSpringFestivalSignIn{
public protoid:number = undefined
	/*对应t_Spring_Festival_2025_Sign的f_id*/
	public id:number;

	/*状态 0不可签到 1已签到 2可补签(补签完成变成已签到) 3可签到*/
	public state:number;

public write(b){
let len;
b.writeUint8(this.id);
b.writeUint8(this.state);

}
public read(b){
let len;
this.id=b.readUint8()
this.state=b.readUint8()

}
	constructor(){}
}export class stSpringFestivalCommonTimes{
public protoid:number = undefined
	/*1当日驱赶年兽剩余次数 2当日购买驱赶年兽次数(非剩余)(购买走10338协议) 3当日已点赞次数(非剩余)*/
	public category:number;

	/*次数*/
	public times:number;

public write(b){
let len;
b.writeUint8(this.category);
b.writeUint16(this.times);

}
public read(b){
let len;
this.category=b.readUint8()
this.times=b.readUint16()

}
	constructor(){}
}export class stSpringFestivalRankPlayer{
public protoid:number = undefined
	/*角色id*/
	public playerId:number;

	/*头像*/
	public HeadUrl:string;

	/*昵称*/
	public nickName:string;

	/*头像框*/
	public HeadFrame:number;

public write(b){
let len;
b.writeUint32(this.playerId);
b.writeUTFString(this.HeadUrl||"");
b.writeUTFString(this.nickName||"");
b.writeUint8(this.HeadFrame);

}
public read(b){
let len;
this.playerId=b.readUint32()
this.HeadUrl=b.readUTFString()
this.nickName=b.readUTFString()
this.HeadFrame=b.readUint8()

}
	constructor(){}
}export class stSpringFestivalRank{
public protoid:number = undefined
	/*名次*/
	public rank:number;

	/*角色信息(2个角色)*/
	public playeres:stSpringFestivalRankPlayer[];

	/*伤害数值*/
	public damage:number;

	/*赞的次数*/
	public zan:number;

	/*有无点赞 1已点 0未点*/
	public zanExist:number;

	/*当前这对组合的唯一标识*/
	public uqSign:string;

public write(b){
let len;
b.writeUint32(this.rank);

this.playeres=this.playeres||[];
len = this.playeres.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.playeres[i].write(b);
}
b.writeUint32(this.damage);
b.writeUint32(this.zan);
b.writeUint8(this.zanExist);
b.writeUTFString(this.uqSign||"");

}
public read(b){
let len;
this.rank=b.readUint32()
this.playeres=this.playeres||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalRankPlayer()
item.read(b);
this.playeres.push(item);

}
this.damage=b.readUint32()
this.zan=b.readUint32()
this.zanExist=b.readUint8()
this.uqSign=b.readUTFString()

}
	constructor(){}
}/*年兽活动每日累计充值奖励情况*/
export class stSpringFestivalCharge{
public protoid:number = undefined
	/*t_Spring_Festival_2025_Daily_Recharge或t_Spring_Festival_2025_Daily_Recharge_Reward的f_id*/
	public id:number;

	/*任务完成的数量*/
	public val:number;

	/*领取状态 0不可领取 1可领取 2已领取*/
	public status:number;

public write(b){
let len;
b.writeUint16(this.id);
b.writeUint32(this.val);
b.writeUint8(this.status);

}
public read(b){
let len;
this.id=b.readUint16()
this.val=b.readUint32()
this.status=b.readUint8()

}
	constructor(){}
}export class stSpringFestivalShop{
public protoid:number = undefined
	/*商品fid，t_Spring_Festival_2025_Shop表f_id*/
	public fid:number;

	/*已购买次数*/
	public times:number;

public write(b){
let len;
b.writeUint8(this.fid);
b.writeUint8(this.times);

}
public read(b){
let len;
this.fid=b.readUint8()
this.times=b.readUint8()

}
	constructor(){}
}/*年兽活动初始化或系统刷新 协议id:10348*/
export class SpringFestivalInitOrFresh_revc{
public protoid:number = 10348
	/*年兽活动排行榜开始与结束时间*/
	public rankTime:stSpringFestivalRankTime=new stSpringFestivalRankTime();

	/*春节签到列表*/
	public signInList:stSpringFestivalSignIn[];

	/*春节相关操作次数*/
	public timeList:stSpringFestivalCommonTimes[];

	/*充值列表奖励数据*/
	public dailyRecharge:stSpringFestivalCharge[];

	/*累充列表奖励数据*/
	public dailyRechargeSum:stSpringFestivalCharge[];

	/*商店购买数据列表*/
	public datalist:stSpringFestivalShop[];

public read(b){
let len;
this.rankTime.read(b);
this.signInList=this.signInList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalSignIn()
item.read(b);
this.signInList.push(item);

}
this.timeList=this.timeList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalCommonTimes()
item.read(b);
this.timeList.push(item);

}
this.dailyRecharge=this.dailyRecharge||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalCharge()
item.read(b);
this.dailyRecharge.push(item);

}
this.dailyRechargeSum=this.dailyRechargeSum||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalCharge()
item.read(b);
this.dailyRechargeSum.push(item);

}
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalShop()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*春节年兽签到 协议id:10349*/
export class SpringFestivalSignIn_req{
public protoid:number = 10349
	/*对应t_Spring_Festival_2025_Sign的f_id*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.id);

}
	constructor(){}
}/*春节年兽签到变量 协议id:10350*/
export class SpringFestivalSignIn_revc{
public protoid:number = 10350
	/*春节签到变量*/
	public datalist:stSpringFestivalSignIn[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalSignIn()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*春节年兽功能相关次数变化量 协议id:10351*/
export class SpringFestivalCommonTimes_revc{
public protoid:number = 10351
	/*春节相关操作次数*/
	public timeList:stSpringFestivalCommonTimes[];

public read(b){
let len;
this.timeList=this.timeList||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalCommonTimes()
item.read(b);
this.timeList.push(item);

}

}
	constructor(){}
}/*打开春节活动排行榜 协议id:10352*/
export class SpringFestivalRank_req{
public protoid:number = 10352
public write(b){
let len;

}
	constructor(){}
}/*春节年兽活动排行榜返回 协议id:10353*/
export class SpringFestivalRank_revc{
public protoid:number = 10353
	/*排行榜列表*/
	public datalist:stSpringFestivalRank[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalRank()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*领取春节活动累充奖励 协议id:10354*/
export class SpringFestivalDailyRecharge_req{
public protoid:number = 10354
	/*0是下面列表页 1是上面累充*/
	public flag:number;

	/*t_Spring_Festival_2025_Daily_Recharge或t_Spring_Festival_2025_Daily_Recharge_Reward的f_id*/
	public id:number;

public write(b){
let len;
b.writeUint8(this.flag);
b.writeUint16(this.id);

}
	constructor(){}
}/*春节活动累充奖励变化的变量(领取或充值达到条件变化) 协议id:10355*/
export class SpringFestivalDailyRecharge_revc{
public protoid:number = 10355
	/*0是下面列表页 1是上面累充*/
	public flag:number;

	/*充值奖励变化*/
	public datalist:stSpringFestivalCharge[];

public read(b){
let len;
this.flag=b.readUint8()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalCharge()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*春节活动排行榜点赞,返回10351(当日点赞次数)+10360(排行榜上的数据) 协议id:10356*/
export class SpringFestivalZan_req{
public protoid:number = 10356
	/*当前这对组合的唯一标识*/
	public uqSign:string;

public write(b){
let len;
b.writeUTFString(this.uqSign||"");

}
	constructor(){}
}export class stMonsterAttr{
public protoid:number = undefined
	/*怪的序列号*/
	public uid:number;

	/*属性id*/
	public attrId:number;

public write(b){
let len;
b.writeUint32(this.uid);
b.writeUint32(this.attrId);

}
public read(b){
let len;
this.uid=b.readUint32()
this.attrId=b.readUint32()

}
	constructor(){}
}/*春节活动，年兽随机属性 协议id:10357*/
export class MonsterAttr_revc{
public protoid:number = 10357
	/*年兽随机属性列表*/
	public datalist:stMonsterAttr[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMonsterAttr()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*春节活动，商店购买（返回10359） 协议id:10358*/
export class SpringFestivalShop_req{
public protoid:number = 10358
	/*商品fid，t_Spring_Festival_2025_Shop表f_id*/
	public fid:number;

	/*购买数量*/
	public count:number;

public write(b){
let len;
b.writeUint8(this.fid);
b.writeUint8(this.count);

}
	constructor(){}
}/*春节活动，商店购买 协议id:10359*/
export class SpringFestivalShop_revc{
public protoid:number = 10359
	/*商店购买数据列表（变化量）*/
	public datalist:stSpringFestivalShop[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stSpringFestivalShop()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*春节活动排行榜点赞,返回10351 协议id:10360*/
export class SpringFestivalZan_revc{
public protoid:number = 10360
	/*当前这对组合的唯一标识*/
	public uqSign:string;

	/*赞的次数*/
	public zan:number;

	/*有无点赞 1已点 0未点*/
	public zanExist:number;

public read(b){
let len;
this.uqSign=b.readUTFString()
this.zan=b.readUint32()
this.zanExist=b.readUint8()

}
	constructor(){}
}/*怪物特效*/
export class stMonsterEffect{
public protoid:number = undefined
	/*怪的序列号*/
	public monsterUid:number;

	/*属性id*/
	public attrId:number;

	/*怪物特效的目标列表*/
	public datalist:stMonsterEffectTarget[];

public write(b){
let len;
b.writeUint32(this.monsterUid);
b.writeUint32(this.attrId);

this.datalist=this.datalist||[];
len = this.datalist.length;
b.writeInt32(len);
for(let i = 0;i < len;i++){
this.datalist[i].write(b);
}

}
public read(b){
let len;
this.monsterUid=b.readUint32()
this.attrId=b.readUint32()
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMonsterEffectTarget()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}/*怪物特效的目标*/
export class stMonsterEffectTarget{
public protoid:number = undefined
	/*类型 1怪物 2英雄格子 3棋盘*/
	public type:number;

	/*目标的序列号*/
	public uid:number;

public write(b){
let len;
b.writeUint8(this.type);
b.writeUint32(this.uid);

}
public read(b){
let len;
this.type=b.readUint8()
this.uid=b.readUint32()

}
	constructor(){}
}/*春节活动，怪物特效 协议id:10361*/
export class MonsterEffect_revc{
public protoid:number = 10361
	/*怪物特效列表*/
	public datalist:stMonsterEffect[];

public read(b){
let len;
this.datalist=this.datalist||[];

len = b.readInt32();
for(let i = 0;i < len;i++){
let item = new stMonsterEffect()
item.read(b);
this.datalist.push(item);

}

}
	constructor(){}
}