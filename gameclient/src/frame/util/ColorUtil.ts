
export class ColorUtil {

    /**红色*/
    public static get RED(): Laya.Color { return Laya.Color.RED; }
    /**绿色*/
    public static get GREEN(): Laya.Color { return Laya.Color.GREEN; }
    /**蓝色*/
    public static get BLUE(): Laya.Color { return Laya.Color.BLUE; }
    /**蓝绿色*/
    public static get CYAN(): Laya.Color { return Laya.Color.CYAN; }
    /**黄色*/
    public static get YELLOW(): Laya.Color { return Laya.Color.YELLOW; }
    /**品红色*/
    public static get MAGENTA(): Laya.Color { return Laya.Color.MAGENTA; }
    /**灰色*/
    public static get GRAY(): Laya.Color { return Laya.Color.GRAY; }
    /**白色*/
    public static get WHITE(): Laya.Color { return Laya.Color.WHITE; }
    /**黑色*/
    public static get BLACK(): Laya.Color { return Laya.Color.BLACK; }

    /**判断颜色是否相等*/
    public static Same(c1: Laya.Color, c2: Laya.Color): boolean {
        if (c1.r == c2.r &&
            c1.g == c2.g &&
            c1.b == c2.b &&
            c1.a == c2.a)
            return true;
        return true;
    }

    /**是否在红色的范围
     * 不考虑alpha
    */
    public static IsRed(r: number, g: number, b: number): boolean {
        // console.log(" r:" + r + " g:" + g + " b:" + b);

        if (r >= 180 && r <= 255 && g >= 0 && g <= 50 && b >= 0 && b <= 50) {
            //is red
            // console.log(" r:" + r + " g:" + g + " b:" + b);

            return true;
        }
        return false;
    }

    /**滤镜
     * @param type 1：变暗 2：变黑
    */
    public static CreateColorFilter(type = 0): Array<Laya.ColorFilter> {
        if (type == 1) {//变暗
            var colorV = 0.6;
            var colorMat = [
                colorV, 0, 0, 0, 0,//R
                0, colorV, 0, 0, 0,//G
                0, 0, colorV, 0, 0,//B
                0, 0, 0, 1, 0,//A
            ];
            var colorFilter = new Laya.ColorFilter(colorMat);
            return [colorFilter];
        }
        else if (type == 2) {//变黑
            var colorV = 0;
            var colorMat = [
                colorV, 0, 0, 0, 0,//R
                0, colorV, 0, 0, 0,//G
                0, 0, colorV, 0, 0,//B
                0, 0, 0, 1, 0,//A
            ];
            var colorFilter = new Laya.ColorFilter(colorMat);
            return [colorFilter];
        }
        return [];
    }

    private static componentToHex(c) {// 转换回16进制格式
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    static getColorInverse(color: string) {
        // 将颜色转换为RGB
        let rgb = {
            r: parseInt(color.substr(1, 2), 16),
            g: parseInt(color.substr(3, 2), 16),
            b: parseInt(color.substr(5, 2), 16),
        };
        // 对每个颜色通道取反
        rgb.r = 255 - rgb.r;
        rgb.g = 255 - rgb.g;
        rgb.b = 255 - rgb.b;
        return "#" + this.componentToHex(rgb.r) + this.componentToHex(rgb.g) + this.componentToHex(rgb.b);
    }
}