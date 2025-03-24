export abstract class MainIconListBase {
    /**按钮间隔 */
    protected cellGap:number = 0;
    protected minRow: number = 1;
    /**f_pos排序 */
    protected f_posSortHandler(a: Configs.t_MainIcon_dat, b: Configs.t_MainIcon_dat) {
        if (a.f_pos < b.f_pos) {
            return -1;
        }
        else if (a.f_pos > b.f_pos) {
            return 1;
        }
        return 0;
    }
    abstract init(): void;
    abstract refresh(): void;



    /**f_sort排序 */
    protected f_sortSortHandler(a: Configs.t_MainIcon_dat, b: Configs.t_MainIcon_dat) {
        if (a.f_sort < b.f_sort) {
            return -1;
        }
        else if (a.f_sort > b.f_sort) {
            return 1;
        }
        return 0;
    }
}