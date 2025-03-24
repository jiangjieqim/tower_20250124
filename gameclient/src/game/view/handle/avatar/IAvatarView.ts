import { stSkin } from "../../../network/protocols/BaseProto";

export interface IAvatarView extends Laya.Sprite {
    dispose();
    stop();
    mSkin:stSkin;
}