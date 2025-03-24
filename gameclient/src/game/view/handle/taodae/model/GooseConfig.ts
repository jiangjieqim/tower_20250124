export class GooseConfig {
    /**大鹅动画 */
    static get UseTimeMS(): number {
        if(this.mSkipAnim){
            return 0;
        }
        return 830;
    }
    static get RewardDelay() {
        return this.UseTimeMS * 2;
    }

    /**
     * 是否跳过动画
     */
    static mSkipAnim: boolean = false;
}

export enum EGooseType {
    /**金鹅 */
    Gold = 3,
}