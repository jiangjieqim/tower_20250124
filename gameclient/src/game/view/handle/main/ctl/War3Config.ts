export class War3Config {
    /**spine前缀 */
    public static Prefix:string = "h";
    /**旗帜偏移 */
    public static FlagOffsetX:number = 50;

    static GetHead(icon:string){
        return `o/Image_Head/${icon}.png`;
    }
    /**BOSS缩放值*/
    static BOSS_SCALE:number = 2.0;
    /**飞行单位偏移 */
    static SkyFlyOffsetY:number = 50;
}