import { ECreateHero } from "../../vos/EFightEnum";
import { HeroAvatarView } from "../HeroAvatarView";

/**纯皮肤形象装饰器 */
export class ImageSkinAvatarDecorator {
    avatar:HeroAvatarView;
    constructor(avatar:HeroAvatarView,imageId:number){
        avatar.resId = imageId;
        avatar.resType = ECreateHero.ImageId;
        this.avatar = avatar;
    }
}