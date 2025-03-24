export class PveGuideModel {
    /**是否是pve引导 */
    get isRunning() {
        return Laya.Utils.getQueryString('pveguide');
    }
}