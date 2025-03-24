import Image = Laya.Image;
import Button = Laya.Button;

export class SkinHelp {

    //设置图片路径
    public static SetImageSkin(image: Image, skin: string) {
        image.skin = skin;
    }

    //设置按钮图片路径
    public static SetButtonSkin(button: Button, skin: string) {
        button.skin = skin;
    }

}