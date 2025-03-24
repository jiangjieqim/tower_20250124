import { ui } from "../../ui/layaMaxUI";
import { stSkin } from "../network/protocols/BaseProto";
import { AvatarMonsterView } from "../view/handle/avatar/AvatarMonsterView";
import { AvatarView, EAttackType } from "../view/handle/avatar/AvatarView";

export enum EBuySkinStyle{
    /**默认的加减的方式 */
    Default = 1,
    /**滑动条的方式 */
    Sider = 2,
}

/**
 * 用于魔兽,戳爆三国的适配
 */
export interface IGameAdapter {
    //公共部分===============================================
    /**昵称处理 */
    convertNickName(name:string):string;
    /**显示觉醒之后可以看到的属性 */
    bShowWeeker:boolean;
    /**BOSS缩放值转化 */
    convertBossScale(url:string);
    getOffsetyByImageId(imageId:number,mHasHorse:boolean);
    //=======================================================
    /**武馆动作 */
    heroAnim:string;
    /**武馆的动作索引转化 */
    getHeroAnimIndex(index:number):number;
    /**武馆特效 */
    heroHouseEffect:boolean;
    heroHouseScaleConvert(scale:number);
    //=======================================================
    /**新人礼包背景图 */
    newPlayerImg(url:string);
    //==========================================
    /**创建一个展示形象 */
    // createAvatarSkin(imageId:number); 
    /**主角的外观ID */
    leadImageId:number;
    /**主角的战旗 */
    leadFlagId:number;
    /**主角的光环 */
    leadHaloId:number
    /**随机外观 */
    randomSkin(avatar:AvatarMonsterView);
    /**设置皮肤 魔兽会设置相关形象*/
    setSkin(avatar:AvatarView,v:stSkin);
    /**属性面板上的角色 */
    // getAttrAvatar(heroContainer:Laya.Sprite,accoutID:number);
    /**获取(戳爆-坐骑)(魔兽-战旗)的icon */
    getMountIcon(f_MountID:number);
    /**创建坐骑(战旗)*/
    createMount(f_MountID:number);
    /**战斗字体的间距偏移 */
    fontOffsetX:number;
    /**获取武馆英雄Avatar的皮肤 */
    // (cfg:Configs.t_Gym_NPC_Image_dat):stSkin;
    /**刷新角色皮肤 */
    refreshAvatar(avatar:AvatarView,skin:stSkin);

    /**tab颜色 */
    tabColor:string[];
    /**物品颜色 */
    itemColor:string[];
    /**购买的方式  
     * true 滑条的购买方式  
     * false 加减的方式
     **/
    msiderbuy:EBuySkinStyle;
    /**坐骑中已经解锁的颜色 */
    unlockColor:string;

    /**打开元宝商城 */
    openGold();
    /**头像转化 */
    convertHead(url:string):string;

    /**是否显示折扣小角标 */
    discountImgVisible:boolean;
    /**缩放值 */
    // fontScale:number;
    refreshTabColor(lb:Laya.Label,sel:boolean);
    /**boss动作适配 */
    bossConvertAnim(index:number):number;
    /**初始化挂机按钮 */
    getExporeBtn(skin);//ui.views.main.ui_main_icon_09UI
    /**获取背景 */
    getBG();
    init();
    getAttackType(imgage:number):EAttackType;
    /**设置任务品质 */
    setTaskQuaIcon(img:Laya.Image,icon:string);
    /**签到颜色 */
    signColor:string;
    /**是否加载翅膀和马匹 */
    mLoadWingHorse:boolean;

    /**割须弃袍形象 */
    // getGxqpSkinVo():stSkin;

    // getDuanwuSkin();
    // getDuanwuAtlas();
}