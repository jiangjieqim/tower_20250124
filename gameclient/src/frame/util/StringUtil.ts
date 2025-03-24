// import { E } from "../../game/G";

// /**字符串工具类*/
// export class StringUtil {

//     /**切割字符串
//      * @param value 
//      * @param sprelator 标记
//     */
//     public static SplitToString(value: string, sprelator: string = "#"): string[] {
//         if (value == "0") return [];
//         let result: string[] = [];
//         let sArray: string[] = value.split(sprelator);

//         for (let i: number = 0; i < sArray.length; i++)
//             result.push(sArray[i]);
//         return result;
//     }

//     /**切割数字
//      * @param value
//      * @param sprelator 标记
//     */
//     public static SplitToNumber(value, sprelator: string = "#"): number[] {
//         if (value == "0") return [];
//         let result: number[] = [];
//         let sArray: string[] = value.split(sprelator);
//         for (let i: number = 0; i < sArray.length; i++)
//             result.push(parseInt(sArray[i]));
//         return result;
//     }

//     // private static removeTrailingZeros(num:string) {
//     //     return num.toString().replace(/(\.[0-9]*[1-9])0+$/, "$1");
//     // }

//     private static removeTrailingZeros(num:number) {
//         return parseFloat(num.toFixed(10));
//     }
//     public static clearCnyDecimal(v: number) {
//         return this.removeTrailingZeros(v);
//     }

//     /**字符串转整形
//      * @param str 字符串
//     */
//     public static ParseInt(str: string): number {
//         let intNum = parseFloat(str);
//         if (intNum)
//             return Math.floor(intNum);
//         return 0;
//     }

//     /**字符串转数字
//      * @param str 字符串
//     */
//     public static ParseNum(str: string): number {
//         let num = parseFloat(str);
//         if (num)
//             return num;
//         return 0;
//     }

//     /**空字符串*/
//     public static get Empty(): string { return ""; }

//     /**转整型
//      * @param str 数字字符串
//      * @param radix 数字基数-进制
//      */
//     public static toInt(str: string, radix: number = 10): number {
//         if (!str || str.length == 0) return 0;
//         return parseInt(str, radix);
//     }
//     /**转浮点型
//      * @param str 数字字符串
//     */
//     public static toFloat(str: string): number {
//         if (!str || str.length == 0) return 0;
//         return parseFloat(str);
//     }

//     /**
//      * 获取字符串真实长度,注：
//      * 1.普通数组，字符占1字节；汉子占两个字节
//      * 2.如果变成编码，可能计算接口不对
//      */
//     public static getNumBytes(str: string): number {
//         let realLength = 0, len = str.length, charCode = -1;
//         for (var i = 0; i < len; i++) {
//             charCode = str.charCodeAt(i);
//             if (charCode >= 0 && charCode <= 128) realLength += 1;
//             else realLength += 2;
//         }
//         return realLength;
//     }
//     /**玩家昵称超过6个字，就变成“XXXXXX...” */
//     public static convertName(str:string,limit:number = 12){
//         let result:string = "";
//         let realLength = 0, len = str.length, charCode = -1;
//         let need:boolean = false;
//         for (var i = 0; i < len; i++) {
//             charCode = str.charCodeAt(i);
//             if (charCode >= 0 && charCode <= 128) {
//                 realLength += 1;
//             }
//             else {
//                 realLength += 2;
//             }
//             if(realLength<=limit){
//                 result+=str[i];
//             }else{
//                 need = true;
//             }
//         }
//         if(need){
//             result+="...";
//         }
//         return result;
//     }


//     /**
//      * 补零
//      * @param str
//      * @param len
//      * @param dir 0-后；1-前
//      * @return
//      */
//     public static addZero(str: string, len: number, dir: number = 0): string {
//         let _str: string = "";
//         let _len: number = str.length;
//         let str_pre_zero: string = "";
//         let str_end_zero: string = "";
//         if (dir == 0)
//             str_end_zero = "0";
//         else
//             str_pre_zero = "0";

//         if (_len < len) {
//             let i: number = 0;
//             while (i < len - _len) {
//                 _str = str_pre_zero + _str + str_end_zero;
//                 ++i;
//             }

//             return _str + str;
//         }

//         return str;
//     }

//     /**
//      * 去除左右空格
//      * @param input
//      * @return
//      */
//     public static trim(input: string): string {
//         if (input == null) {
//             return "";
//         }
//         return input.replace(/^\s+|\s+$""^\s+|\s+$/g, "");
//     }

//     /**
//      * 去除左侧空格
//      * @param input
//      * @return
//      */
//     public static trimLeft(input: string): string {
//         if (input == null) {
//             return "";
//         }
//         return input.replace(/^\s+""^\s+/, "");
//     }

//     /**
//      * 去除右侧空格
//      * @param input
//      * @return
//      */
//     public static trimRight(input: string): string {
//         if (input == null) {
//             return "";
//         }
//         return input.replace(/\s+$""\s+$/, "");
//     }

//     /**
//      * 分钟与秒格式(如-> 40:15)
//      * @param seconds 秒数
//      * @return
//      */
//     public static minuteFormat(seconds: number): string {
//         let min: number = Math.floor(seconds / 60);
//         let sec: number = Math.floor(seconds % 60);

//         let min_str: string = min < 10 ? ("0" + min.toString()) : (min.toString());
//         let sec_str: string = sec < 10 ? ("0" + sec.toString()) : (sec.toString());

//         return min_str + ":" + sec_str;
//     }

//     /**
//      * 时分秒格式(如-> 05:32:20)
//      * @param seconds(秒)
//      * @return
//      */
//     public static hourFormat(seconds: number): string {
//         let hour: number = Math.floor(seconds / 3600);
//         let hour_str: String = hour < 10 ? ("0" + hour.toString()) : (hour.toString());
//         return hour_str + ":" + StringUtil.minuteFormat(seconds % 3600);
//     }

//     /**
//      * 格式化字符串
//      * @param str 需要格式化的字符串，【"杰卫，这里有{0}个苹果，和{1}个香蕉！", 5,10】
//      * @param args 参数列表
//      */
//     public static format(str: string, ...args: any[]): string {
//         if (args.length > 0 && typeof (args[0]) == "object") {
//             args = args[0];
//         }
//         for (let i = 0; i < args.length; i++) {
//             str = str.replace(new RegExp("\\{" + i + "\\}"), args[i]);//"gm"
//         }
//         return str;
//     }

//     /**
//      * 以指定字符开始
//      */
//     public static beginsWith(input: string, prefix: string): boolean {
//         return prefix == input.substring(0, prefix.length);
//     }

//     /**
//      * 以指定字符结束
//      */
//     public static endsWith(input: string, suffix: string): boolean {
//         return suffix == input.substring(input.length - suffix.length);
//     }

//     /**guid*/
//     public static getGUIDString(): string {
//         let d = Date.now();
//         if (window.performance && typeof window.performance.now === "function") {
//             d += performance.now(); //use high-precision timer if available
//         }
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//             let r = (d + Math.random() * 16) % 16 | 0;
//             d = Math.floor(d / 16);
//             return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//         });
//     }

//     /**首字母大写
//      * @param word 字符串
//      */
//     public static firstUpperCase(word: string): string {
//         return word.charAt(0).toUpperCase() + word.slice(1);
//     }

//     /**格式化下划线的单词
//      * 
//      */
//     public static formatDashWord(word: string, capFirst: boolean = false) {
//         let first = true;
//         let result = "";
//         word.split('_').forEach((sec: string) => {
//             if (first) {
//                 if (capFirst) {
//                     result = StringUtil.firstUpperCase(sec);
//                 } else {
//                     result = sec;
//                 }
//                 first = false;
//             } else {
//                 result = result + StringUtil.firstUpperCase(sec);
//             }
//         });
//         return result;
//     }

//     /**
//      * 截取字符串
//      * @param str 字符串
//      * @param start 开始位置
//      * @param end 结束位置
//      */
//     public static substring(str: string, start: number, end: number): string {
//         return str.substring(start, end);
//     }

//     // /**
//     //  * 截取字符串
//     //  * @param str 字符串
//     //  * @param start 开始位置
//     //  * @param long 截取长度
//     //  */
//     // public static substr(str: string, start: number, long: number): string {
//     //     return str.substr(start, long);
//     // }

//     /**
//      * 字符串转对象
//      * @param str
//      */
//     public static strToObject(str: string) {
//         const strToObj = JSON.parse(str);
//         return strToObj;
//     }

//     /**
//      * 对象转字符串
//      * @param obj
//      */
//     public static objToStr(obj: Object): string {
//         const objToStr = JSON.stringify(obj)
//         return objToStr;
//     }

//     /**判断字符串是否为null*/
//     public static IsNullOrEmpty(str: string): boolean {
//         if (str == undefined) return true;
//         if (str == null) return true;
//         if (str.length == 0) return true;
//         if (str == "null") return true;
//         if (str == "") return true;

//         return false;
//     }

//     /**是否包含字符串
//      * @param str 字符串
//      * @param item 查询字符串
//     */
//     public static Contains(str: string, item: string): boolean {
//         return str.indexOf(item) != -1;
//     }

//     /**检测资源版本
//     */
//     public static CheckResourcesVersion(path: string): string {
//         let result = Laya.ResourceVersion.manifest[path];
//         if (result == null) {
//             return path;
//         }
//         return result;
//     }

//     private static readonly numWords: string[] = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九","十"];
//     /**数字转中文字符0-9
//      * @param num 传入数字
//     */
//     public static NumToWord(num: number): string {
//         if (num < this.numWords.length && num > 0)
//             return this.numWords[num];
//         return this.Empty;
//     }
//     public static toChinesNum(num) {
//         let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
//         let unit = ['', '十', '百', '千', '万']
//         num = parseInt(num)
//         let getWan = (temp) => {
//           let strArr = temp.toString().split('').reverse()
//           let newNum = ''
//           let newArr = []
//             strArr.forEach((item, index) => {
//                  let a = changeNum[item] + unit[index];
//                 //  if (num > 1 && num < 10 && item == 1) {
//                 //      a = unit[index];
//                 //  }
//                 newArr.unshift(item === '0' ? changeNum[item] : a)
//             })
//           let numArr = []
//           newArr.forEach((m, n) => {
//             if (m !== '零') numArr.push(n)
//           })
//           if (newArr.length > 1) {
//             newArr.forEach((m, n) => {
//               if (newArr[newArr.length - 1] === '零') {
//                 if (n <= numArr[numArr.length - 1]) {
//                   newNum += m
//                 }
//               } else {
//                 newNum += m
//               }
//             })
//           } else {
//             newNum = newArr[0]
//           }
   
//           return newNum
//         }
//         let overWan = Math.floor(num / 10000)
//         let noWan = (num % 10000).toString();
//         if (noWan.toString().length < 4) {
//           noWan = '0' + noWan;
//         }
        
//         let s1 = overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num);
//         if(num >= 10 && num < 20){
//             s1 = s1.substr(1,2);
//         }
//         return s1;
//       }

//     //移除注释/**/
//     public static replaceComments(data) {
//         return data = data.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
//     }

//     //调用方法，传入字符串和需要返回的字节长度即可
//     public static CutByteLen(str, len, suffix = "...") {
//         let str_length = 0;
//         let str_len = 0;
//         let str_cut = new String();
//         str_len = str.length;
//         for (let i = 0; i < str_len; i++) {
//             let a = str.charAt(i);
//             str_length++;
//             if (escape(a).length > 4) {
//                 //中文字符的长度经编码之后大于4
//                 str_length++;
//             }
//             str_cut = str_cut.concat(a);
//             if (str_length >= len) {
//                 //达到目标长度，即为字符串加上省略号并返回
//                 str_cut = str_cut.concat(suffix);
//                 return str_cut;
//             }
//         }
//         //如果字符串长度小于需要裁切的长度，直接返回
//         if (str_length < len) {
//             return str;
//         }
//     }

//     // private static cv(val:number) {
//     //     let s = val.toFixed(1);
//     //     let arr = s.split(".");
//     //     let s1 = arr[0];
//     //     if (arr[1] != "0") {
//     //         s1 += arr[1];
//     //     }
//     //     return s1;
//     // }

//     /**大于等于100000显示100.0k 大于等于10000000的显示10.0m*/
//     // private static val1m(val:number){
//     //      if(val >= 100000 && val < 10000000){
//     //         val = val/1000;
//     //         return this.cv(val)+"k";
//     //     }else if(val >= 10000000){
//     //         val = val / 1000000;
//     //         return this.cv(val)+"m";
//     //     }
//     //     return val.toString();
//     // }

//     /**
//      * 大于等于9999显示10k
//      * 大于等于99999999显示10m
//      * 
//      * 
//      * @param atlas 是否是中文 
//      */
//     public static val2m(val: number, atlas: boolean = false) {
//         let _1y = 99999999;
//         let checkVal = 9999;
//         if (val > checkVal && val <= _1y) {
//             val = val / checkVal;
//             return Math.floor(val * (checkVal/1000)) + (atlas ? "k" : "k");
//         } else if (val >= _1y) {
//             val = val / _1y;
//             return Math.floor(val * (checkVal/10000000)) + (atlas ? "m" : "m");
//         }
//         return Math.ceil(val).toString(); //向上取整
//     }

//     public static val3m(val: number, atlas: boolean = false) {
//         let _1y = 100000000;
//         let checkVal = 100000;
//         if (val >= checkVal && val < _1y) {
//             val = val / checkVal;
//             return Math.floor(val * (checkVal/10000)) + (atlas ? "w" : "万");
//         } else if (val >= _1y) {
//             val = val / _1y;
//             return Math.floor(val) + (atlas ? "y" : "亿");
//         }
//         return val.toString();
//     }

//     public static val4m(val: number, atlas: boolean = false) {
//         let _1y = 100000000;
//         let checkVal = 10000;
//         if (val >= checkVal && val < _1y) {
//             val = val / checkVal;
//             return Math.floor(val * (checkVal/10000)) + (atlas ? "w" : "万");
//         } else if (val >= _1y) {
//             val = val / _1y;
//             return Math.floor(val) + (atlas ? "y" : "亿");
//         }
//         return Math.ceil(val).toString(); //向上取整
//     }

//     public static val2Atlas(val: number){
//         return this.val2m(val,true);
//     }
//     /**货币转化  分转元*/
//     public static moneyCv(v:number){
//         return v / 100;
//     }

//     /**0.00% */
//     public static toPercent(val:number|string){
//         if(typeof val == "string"){
//             val = parseInt(val);
//         }
//         return (val / 100).toFixed(2) + "%";
//     }

//     // public static getCnMoney(index:number){
//     // return E.getLang("MoneyVal")[index];
//     // }

//     public static DebugCubeText(s:string,count:number = 15){
//         let o = "\n";
//         let space:string = s;
//         for(let i = 0;i < count -  s.length;i++){
//             space+=" ";
//         }
//         let s1 = "";
//         o+="+"
//         for(let i =0;i < count;i++){
//             o+="-";
//         }
//         o+="+"
//         s1 = o;
//         o+="\n|"
//         o+=space;
//         o+="|";
//         o+=s1;
//         return o;
//     }
// }