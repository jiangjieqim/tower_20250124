export interface IMeiTuan{
    getUserInfo(param);
    supportShortcut(param);
    queryShortcut(param);
    addShortcut(param);
    getLaunchOptionsSync();
    getSystemInfoSync();
}
export let meituan:IMeiTuan = window['mt'];
