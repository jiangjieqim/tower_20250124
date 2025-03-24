export class AvatarConfig {
    /**身高的上下偏移 */
    public static effectOffsetY: number = 0;

    /**无坐骑的时候的角色高度 */
    public static get normalHeight(): number {
        return 135 + this.effectOffsetY;
    }
    /**有坐骑的高度 */
    public static get hasHorseHeight(): number {
        return 170 + this.effectOffsetY;
    }
    /**左边的格位最大值 */
    public static readonly LeftPosMax:number = 6;
}