import { E } from "../G";
import { stSkin } from "../network/protocols/BaseProto";
import { AvatarConfig } from "../view/handle/avatar/AvatarConfig";
import { AvatarMonsterView } from "../view/handle/avatar/AvatarMonsterView";
import { AvatarView, EAttackType } from "../view/handle/avatar/AvatarView";
import { ESystemRefreshTime } from "../view/handle/main/ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../view/handle/main/ctl/System_RefreshTimeProxy";
import { MainModel } from "../view/handle/main/model/MainModel";
import { t_Head_Image } from "../view/handle/roleinfo/proxy/t_Head_Image";
import { EBuySkinStyle, IGameAdapter } from "./IGameAdapter";

export class BaseAdapter implements IGameAdapter {
    setSkin(avatar: AvatarView, v: stSkin) {
        throw new Error("Method not implemented.");
    }
    // getHeroStSkin(cfg: Configs.t_Gym_NPC_Image_dat): stSkin {
    // throw new Error("Method not implemented.");
    // }
    refreshAvatar(avatar: AvatarView, skin: stSkin) {
        throw new Error("Method not implemented.");
    }
    heroHouseEffect:boolean = true;
    mLoadWingHorse:boolean = true;
    heroHouseScaleConvert(scale:number){
        return scale;
    }
    newPlayerImg(url:string){
        return url;
    }
    init(){

    }
    convertBossScale(url:string){
        return 1;
    }
    bShowWeeker:boolean = true;
    unlockColor: string = "";
    heroAnim: string;
    getHeroAnimIndex(index: number): number {
        throw new Error("Method not implemented.");
    }
    // createAvatarSkin(imageId: number) {
        // throw new Error("Method not implemented.");
    // }
    get leadImageId(): number {
        return 0;
    }
    get leadFlagId(): number {
        return 0;
    }

    get leadHaloId(): number {
        return 0;
    }
    randomSkin(avatar: AvatarMonsterView) {
        throw new Error("Method not implemented.");
    }
  
    // getAttrAvatar(heroContainer: Laya.Sprite, accoutID: number) {
    //     throw new Error("Method not implemented.");
    // }
    getMountIcon(f_MountID: number) {
        throw new Error("Method not implemented.");
    }
    createMount(f_MountID: number) {
        throw new Error("Method not implemented.");
    }
    fontOffsetX: number;

    get tabColor(): string[] {
        return E.getLang("tabColor").split(";");
    }
    //===================================================================
    // fontScale:number = 0.75;
    get itemColor(): string[] {
        return E.getLang("itemColor").split(";");
    }

    get signColor():string
    {
        return E.getLang("signColor");
    }
    get msiderbuy(): EBuySkinStyle {
        if (Laya.Utils.getQueryString("msiderbuy")) {
            return parseInt(Laya.Utils.getQueryString("msiderbuy"));
        }
        return EBuySkinStyle.Sider;
    }

    openGold() {
        // ShopModel.Ins.showShopView();
    }
    convertHead(url: string): string {
        if(!StringUtil.IsNullOrEmpty(url) && parseInt(url) > 0){
            let cfg =  t_Head_Image.Ins.getCfgByIdAndType(parseInt(url),1);
            if(cfg){
                return t_Head_Image.Ins.getIconSkin(cfg.f_imageID);
            }else{
                LogSys.Error(`t_Head_Image:${url}`);
            }
            return "";
        }
        return url;
    }
    convertNickName(name: string): string {
        if (System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.NotModfityNickName)) {
            return MainModel.Ins.mRoleData.NickName;
        }
        return name;
    }
    get discountImgVisible() {
        let _status = System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.DiscountImgVisible);
        return _status == "0";
    }
    refreshTabColor(lb:Laya.Label,sel:boolean){
        let color = sel ? "#EEE4CA": "#9A6051";
        lb.color = color;
    }
    bossConvertAnim(index:number):number{
        return index;
    }
    getExporeBtn(skin){//ui.views.main.ui_main_icon_09UI
        skin.removeSelf();
        return;
    }

    getBG(){
        // let bgURL:string;
        // if(main.skinStyle == EMainSkin.Kotow){
        //     bgURL = "static/bg2.jpg";
        // }else if(main.skinStyle == EMainSkin.Drum){
        //     bgURL =  "static/bg3.jpg";
        // }
        return "static/bg2.jpg";
    }
    getAttackType(imgage:number):EAttackType{
        return EAttackType.ThreeKingdomNormal;
    }
    setTaskQuaIcon(img:Laya.Image,icon:string){
        img.skin = "";
    }

    getOffsetyByImageId(imageId:number,mHasHorse:boolean){
        let nh:number = AvatarConfig.normalHeight;
        let oy:number = 0;
        if(imageId){
            // let cfg = WowHuanZhuangListProxy.Ins.getByImageId(imageId);
            // oy = cfg.f_FlyImage == 1 ? War3Config.SkyFlyOffsetY : 0;
        }
        let ry:number = oy + nh;
        if(mHasHorse){
            ry = AvatarConfig.hasHorseHeight;
        }
        return ry;
    }

    // getGxqpSkinVo():stSkin{
    //    return FuJiangModel.Ins.getFuJiangSkin(parseInt(E.getLang("gxqpimageid")));
    // }
    // getDuanwuSkin(){
    //     return new ui.views.duanwu.ui_duanwu_mainUI();
    // }
    // getDuanwuAtlas(){
    //     return "duanwu.atlas";
    // }
    // getDuanwuTitleSkin(subType:EFeastType){
    //     return "";
    // }
    // getPackageImg(type:EFeastType){
    //    return ""
    // }
    // getRankImg(type:EFeastType){
    //     return ""
    // }
}