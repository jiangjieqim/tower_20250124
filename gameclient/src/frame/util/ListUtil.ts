// // import {RandomUtil} from "./RandomUtil";

// /**列表工具类*/
// export class ListUtil {

//     /**是否包含*/
//     public static Contains<T>(lst: T[], item: T): boolean {
//         return lst.indexOf(item) >= 0 ? true : false;
//     }

//     /**是否包含列表*/
//     public static ContainsArray<T>(lst1: T[], items: T[]): boolean {

//         if (items.length == 0)
//             return false;

//         for (let i: number = 0; i < items.length; i++) {
//             if (!this.Contains(lst1, items[i]))
//                 return false;
//         }
//         return true;
//     }

//     /**添加对象
//      * 如果已存在也会继续添加
//     */
//     static Add<T>(self: T[], item: T): void {
//         self.push(item);
//     }

//     /**添加对象
//      * 如果已存在，则不会重复添加
//     */
//     static SafeAdd<T>(self: T[], item: T): void {
//         if (!this.Contains(self, item))
//             self.push(item);
//     }

//     /**添加列表*/
//     static SafeAddRange<T>(self: T[], items: T[]): void {

//         for (let i: number = 0; i < items.length; i++) {
//             if (this.Contains(self, items[i]))
//                 continue;
//             self.push(items[i]);
//         }
//     }

//     /**添加列表*/
//     static AddRange<T>(self: T[], items: T[]): void {
//         for (let i: number = 0; i < items.length; i++) {
//             self.push(items[i]);
//         }
//     }

//     /**移除对象*/
//     static Remove<T>(self: T[], item: T) {

//         let index1 = self.indexOf(item);
//         while(index1!=-1){
//             self.splice(index1, 1);
//             index1 = self.indexOf(item);
//         }
//         // let index: number = self.indexOf(item);
//         // if (index >= 0)
//             // self.splice(index, 1);
//     }

//     /**通过索引移除对象
//      * @param index 索引
//     */
//     static RemoveAt<T>(self: T[], index: number): any {
//         if (index < 0)
//             index = 0;

//         if (index < self.length) {
//             return self.splice(index, 1)[0];
//         }

//         return null;
//     }

//     /**
//      * 移除列表
//      * 从当前列表中移除已包含的对方列表内容
//      * @param self 当前列表
//      * @param other 对方列表
//     */
//     public static RemoveContainsRange<T>(self: T[], other: T[]): T[] {
//         for (let i: number = 0; i < other.length; i++) {
//             if (this.Contains(self, other[i]))
//                 this.RemoveAllCotains(self, other[i]);
//         }
//         return self;
//     }

//     /** 从己方移除未在对方列表内的对象
//      * @param self 当前列表
//      * @param other 对方列表
//     */
//     public static RemoveUnContainsRange<T>(self: T[], other: T[]): T[] {
//         let templst = this.Copy(self);
//         for (let i: number = 0; i < templst.length; i++) {
//             if (this.Contains(other, templst[i])) continue;
//             this.RemoveAllCotains(self, templst[i]);
//         }
//         return self;
//     }

//     /**移除列表内所有该对象
//      * @param self 当前列表
//      * @param item 目标对象
//     */
//     public static RemoveAllCotains<T>(self: T[], item: T): T[] {
//         while (this.Contains(self, item)) {
//             this.Remove(self, item);
//         }
//         return self;
//     }

//     /**复制列表
//      * @param lst 目标列表
//     */
//     static Copy<T>(lst: T[]): T[] {
//         let newlst = [];
//         if (!this.IsNullOrEmpty(lst)) {
//             for (let i: number = 0; i < lst.length; i++) {
//                 ListUtil.Add(newlst, lst[i]);
//             }
//         }
//         return newlst;
//     }

//     /**打乱*/
//     static Random<T>(lst: T[]): T[] {
//         let newlst = [];
//         while (lst.length != 0) {
//             let index: number = RandomUtil.RandomRoundInt(0, lst.length);
//             let item = lst[index];
//             ListUtil.Add(newlst, item);
//             ListUtil.Remove(lst, item);
//         }
//         return newlst;
//     }

//     /**获取随机一个成员
//      * @param lst 列表
//      */
//     public static GetRandomOne<T>(lst: T[]): T {
//         let i = RandomUtil.RandomRoundInt(0, lst.length);
//         return lst[i];
//     }

//     /**列表中随机指定数量
//      * @param lst 列表
//      * @param num 数量
//      */
//     public static RandomNumFromRange<T>(lst: T[], num: number): T[] {
//         let templst: T[] = [];
//         if (lst.length <= num) {
//             templst = lst;
//         }
//         else {
//             let count = 0;
//             while (count < num) {
//                 let tempindex = RandomUtil.RandomRoundInt(0, lst.length);

//                 if (!ListUtil.Contains(templst, lst[tempindex])) {
//                     count++;
//                     ListUtil.Add(templst, lst[tempindex]);
//                 }
//             }
//         }
//         return templst;
//     }

//     /**列表中随机指定数量的下标
//      * @param lst 列表
//      * @param num 数量
//      */
//     public static RandomNumIndexFromRange<T>(lst: T[], num: number): number[] {
//         let result: number[] = [];
//         let templst: T[] = [];
//         if (lst.length <= num) {
//             templst = lst;
//         }
//         else {
//             let count = 0;
//             while (count < num) {
//                 let tempindex = RandomUtil.RandomRoundInt(0, lst.length);

//                 if (!ListUtil.Contains(templst, lst[tempindex])) {// 检测是否相同
//                     count++;
//                     ListUtil.Add(templst, lst[tempindex]);
//                     ListUtil.Add(result, tempindex);
//                 }
//             }
//         }
//         return result;
//     }

//     /**获取指定长度的列表
//      * @param lst 列表
//      * @param start 起始索引 包含当前位置
//      * @param end 结束索引  不包含当前位置
//     */
//     public static GetRange<T>(lst: T[], start: number, end: number): T[] {
//         let templst: T[] = [];
//         templst = lst.slice(start, end);
//         return templst;
//     }

//     /**获取由下标组成的新列表
//      * @param lst 列表
//      */
//     public static GetIndexList<T>(lst: T[]): number[] {
//         let lstIndexs: number[] = [];
//         for (let i = 0; i < lst.length; i++) {
//             this.Add(lstIndexs, i);
//         }
//         return lstIndexs;
//     }

//     /**获取下标
//      * @param lst 
//      * @param item 
//      */
//     public static GetIndex<T>(lst: T[], item: T): number {
//         for (let i = 0; i < lst.length; i++) {
//             const element = lst[i];
//             if (element == item) {
//                 return i;
//             }
//         }
//         return -1;
//     }

//     /**获取对方在己方列表中的下标
//      * @param self 
//      * @param other 
//      */
//     public static GetContainsIndexList<T>(self: T[], other: T[]): number[] {
//         let lstIndexs: number[] = [];
//         for (let i = 0; i < other.length; i++) {
//             const item = other[i];
//             let index = this.GetIndex(self, item);// 获取当前条目在己方列表中的下标
//             if (index > 0 && index < self.length) {
//                 this.Add(lstIndexs, index);
//             }
//         }
//         return lstIndexs;
//     }

//     /**插入指定位置, 返回一个新列表
//      * @param lst 列表
//      * @param item 条目
//      * @param index 下标位置
//      */
//     public static Insert<T>(lst: T[], item: T, index: number): T[] {
//         if (index >= lst.length) {// 直接插入到末尾
//             lst.push(item);
//             return lst;
//         }
//         let result: T[] = [];
//         for (let i = 0; i < lst.length; i++) {
//             if (i < index) {
//                 result.push(lst[i]);
//             }
//             else if (i == index) {
//                 result.push(item);
//                 result.push(lst[i]);
//             }
//             else {
//                 result.push(lst[i]);
//             }
//         }
//         return result;
//     }

//     /**列表是否为空*/
//     public static IsNullOrEmpty<T>(lst: T[]): boolean {
//         return lst == null || lst.length == 0;
//     }
// }