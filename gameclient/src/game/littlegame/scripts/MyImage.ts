import { Global } from "../Global";

export class MyImage extends Laya.Image {
    constructor() {
        super();

    }

    set skin(value: string) {

        // console.log("MyImage::skin",value);
        if (value == null) {
            super.skin = value;
        }
        else {
            super.skin = Global.subPath + value;
        }

    }
}