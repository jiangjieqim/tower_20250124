(function () {
  'use strict';

  class EventID {
  }
  EventID.WEBSOCKET_MESSAGE = "WEBSOCKET_MESSAGE";
  EventID.WEBSOCKET_CLOSED = "WEBSOCKET_CLOSED";
  EventID.WEBSOCKET_ERROR = "WEBSOCKET_ERROR";
  EventID.KickNtf = "KickNtf";
  EventID.ConnectRegist = "ConnectRegist";
  EventID.WEBSOCKET_SELECTSERVER = "WEBSOCKET_SELECTSERVER";
  EventID.PlayerKickTheLineNtf = "PlayerKickTheLineNtf";
  EventID.WebClientRegistRsp = "WebClientRegistRsp";
  EventID.WebClientLoginRsp = "WebClientLoginRsp";
  EventID.ButtonDisable = "ButtonDisable";
  EventID.ButtonCtlClick = "ButtonCtlClick";
  EventID.GameStart = "GameStart";
  EventID.FreeRes = "FreeRes";
  EventID.TextureDestroy = "TextureDestroy";

  class StringUtil {
      static SplitToString(value, sprelator = "#") {
          if (value == "0")
              return [];
          let result = [];
          let sArray = value.split(sprelator);
          for (let i = 0; i < sArray.length; i++)
              result.push(sArray[i]);
          return result;
      }
      static SplitToNumber(value, sprelator = "#") {
          if (value == "0")
              return [];
          let result = [];
          let sArray = value.split(sprelator);
          for (let i = 0; i < sArray.length; i++)
              result.push(parseInt(sArray[i]));
          return result;
      }
      static removeTrailingZeros(num) {
          return parseFloat(num.toFixed(10));
      }
      static clearCnyDecimal(v) {
          return this.removeTrailingZeros(v);
      }
      static ParseInt(str) {
          let intNum = parseFloat(str);
          if (intNum)
              return Math.floor(intNum);
          return 0;
      }
      static ParseNum(str) {
          let num = parseFloat(str);
          if (num)
              return num;
          return 0;
      }
      static get Empty() { return ""; }
      static toInt(str, radix = 10) {
          if (!str || str.length == 0)
              return 0;
          return parseInt(str, radix);
      }
      static toFloat(str) {
          if (!str || str.length == 0)
              return 0;
          return parseFloat(str);
      }
      static getNumBytes(str) {
          let realLength = 0, len = str.length, charCode = -1;
          for (var i = 0; i < len; i++) {
              charCode = str.charCodeAt(i);
              if (charCode >= 0 && charCode <= 128)
                  realLength += 1;
              else
                  realLength += 2;
          }
          return realLength;
      }
      static convertName(str, limit = 12) {
          let result = "";
          let realLength = 0, len = str.length, charCode = -1;
          let need = false;
          for (var i = 0; i < len; i++) {
              charCode = str.charCodeAt(i);
              if (charCode >= 0 && charCode <= 128) {
                  realLength += 1;
              }
              else {
                  realLength += 2;
              }
              if (realLength <= limit) {
                  result += str[i];
              }
              else {
                  need = true;
              }
          }
          if (need) {
              result += "...";
          }
          return result;
      }
      static addZero(str, len, dir = 0) {
          let _str = "";
          let _len = str.length;
          let str_pre_zero = "";
          let str_end_zero = "";
          if (dir == 0)
              str_end_zero = "0";
          else
              str_pre_zero = "0";
          if (_len < len) {
              let i = 0;
              while (i < len - _len) {
                  _str = str_pre_zero + _str + str_end_zero;
                  ++i;
              }
              return _str + str;
          }
          return str;
      }
      static trim(input) {
          if (input == null) {
              return "";
          }
          return input.replace(/^\s+|\s+$""^\s+|\s+$/g, "");
      }
      static trimLeft(input) {
          if (input == null) {
              return "";
          }
          return input.replace(/^\s+""^\s+/, "");
      }
      static trimRight(input) {
          if (input == null) {
              return "";
          }
          return input.replace(/\s+$""\s+$/, "");
      }
      static minuteFormat(seconds) {
          let min = Math.floor(seconds / 60);
          let sec = Math.floor(seconds % 60);
          let min_str = min < 10 ? ("0" + min.toString()) : (min.toString());
          let sec_str = sec < 10 ? ("0" + sec.toString()) : (sec.toString());
          return min_str + ":" + sec_str;
      }
      static hourFormat(seconds) {
          let hour = Math.floor(seconds / 3600);
          let hour_str = hour < 10 ? ("0" + hour.toString()) : (hour.toString());
          return hour_str + ":" + StringUtil.minuteFormat(seconds % 3600);
      }
      static format(str, ...args) {
          if (args.length > 0 && typeof (args[0]) == "object") {
              args = args[0];
          }
          for (let i = 0; i < args.length; i++) {
              str = str.replace(new RegExp("\\{" + i + "\\}"), args[i]);
          }
          return str;
      }
      static beginsWith(input, prefix) {
          return prefix == input.substring(0, prefix.length);
      }
      static endsWith(input, suffix) {
          return suffix == input.substring(input.length - suffix.length);
      }
      static getGUIDString() {
          let d = Date.now();
          if (window.performance && typeof window.performance.now === "function") {
              d += performance.now();
          }
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
              let r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
      }
      static firstUpperCase(word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
      }
      static formatDashWord(word, capFirst = false) {
          let first = true;
          let result = "";
          word.split('_').forEach((sec) => {
              if (first) {
                  if (capFirst) {
                      result = StringUtil.firstUpperCase(sec);
                  }
                  else {
                      result = sec;
                  }
                  first = false;
              }
              else {
                  result = result + StringUtil.firstUpperCase(sec);
              }
          });
          return result;
      }
      static substring(str, start, end) {
          return str.substring(start, end);
      }
      static strToObject(str) {
          const strToObj = JSON.parse(str);
          return strToObj;
      }
      static objToStr(obj) {
          const objToStr = JSON.stringify(obj);
          return objToStr;
      }
      static IsNullOrEmpty(str) {
          if (str == undefined)
              return true;
          if (str == null)
              return true;
          if (str.length == 0)
              return true;
          if (str == "null")
              return true;
          if (str == "")
              return true;
          return false;
      }
      static Contains(str, item) {
          return str.indexOf(item) != -1;
      }
      static CheckResourcesVersion(path) {
          let result = Laya.ResourceVersion.manifest[path];
          if (result == null) {
              return path;
          }
          return result;
      }
      static NumToWord(num) {
          if (num < this.numWords.length && num > 0)
              return this.numWords[num];
          return this.Empty;
      }
      static toChinesNum(num) {
          let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
          let unit = ['', '十', '百', '千', '万'];
          num = parseInt(num);
          let getWan = (temp) => {
              let strArr = temp.toString().split('').reverse();
              let newNum = '';
              let newArr = [];
              strArr.forEach((item, index) => {
                  let a = changeNum[item] + unit[index];
                  newArr.unshift(item === '0' ? changeNum[item] : a);
              });
              let numArr = [];
              newArr.forEach((m, n) => {
                  if (m !== '零')
                      numArr.push(n);
              });
              if (newArr.length > 1) {
                  newArr.forEach((m, n) => {
                      if (newArr[newArr.length - 1] === '零') {
                          if (n <= numArr[numArr.length - 1]) {
                              newNum += m;
                          }
                      }
                      else {
                          newNum += m;
                      }
                  });
              }
              else {
                  newNum = newArr[0];
              }
              return newNum;
          };
          let overWan = Math.floor(num / 10000);
          let noWan = (num % 10000).toString();
          if (noWan.toString().length < 4) {
              noWan = '0' + noWan;
          }
          let s1 = overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num);
          if (num >= 10 && num < 20) {
              s1 = s1.substr(1, 2);
          }
          return s1;
      }
      static replaceComments(data) {
          return data = data.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
      }
      static CutByteLen(str, len, suffix = "...") {
          let str_length = 0;
          let str_len = 0;
          let str_cut = new String();
          str_len = str.length;
          for (let i = 0; i < str_len; i++) {
              let a = str.charAt(i);
              str_length++;
              if (escape(a).length > 4) {
                  str_length++;
              }
              str_cut = str_cut.concat(a);
              if (str_length >= len) {
                  str_cut = str_cut.concat(suffix);
                  return str_cut;
              }
          }
          if (str_length < len) {
              return str;
          }
      }
      static val2m(val, atlas = false) {
          let _1y = 99999999;
          let checkVal = 9999;
          if (val > checkVal && val <= _1y) {
              val = val / checkVal;
              return Math.floor(val * (checkVal / 1000)) + (atlas ? "k" : "k");
          }
          else if (val >= _1y) {
              val = val / _1y;
              return Math.floor(val * (checkVal / 10000000)) + (atlas ? "m" : "m");
          }
          return Math.ceil(val).toString();
      }
      static val3m(val, atlas = false) {
          let _1y = 100000000;
          let checkVal = 100000;
          if (val >= checkVal && val < _1y) {
              val = val / checkVal;
              return Math.floor(val * (checkVal / 10000)) + (atlas ? "w" : "万");
          }
          else if (val >= _1y) {
              val = val / _1y;
              return Math.floor(val) + (atlas ? "y" : "亿");
          }
          return val.toString();
      }
      static val4m(val, atlas = false) {
          let _1y = 100000000;
          let checkVal = 10000;
          if (val >= checkVal && val < _1y) {
              val = val / checkVal;
              return Math.floor(val * (checkVal / 10000)) + (atlas ? "w" : "万");
          }
          else if (val >= _1y) {
              val = val / _1y;
              return Math.floor(val) + (atlas ? "y" : "亿");
          }
          return Math.ceil(val).toString();
      }
      static val2Atlas(val) {
          return this.val2m(val, true);
      }
      static moneyCv(v) {
          return v / 100;
      }
      static toPercent(val) {
          if (typeof val == "string") {
              val = parseInt(val);
          }
          return (val / 100).toFixed(2) + "%";
      }
      static DebugCubeText(s, count = 15) {
          let o = "\n";
          let space = s;
          for (let i = 0; i < count - s.length; i++) {
              space += " ";
          }
          let s1 = "";
          o += "+";
          for (let i = 0; i < count; i++) {
              o += "-";
          }
          o += "+";
          s1 = o;
          o += "\n|";
          o += space;
          o += "|";
          o += s1;
          return o;
      }
  }
  StringUtil.numWords = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

  class DebugUtil {
      static get canDraw() {
          return debug;
      }
      static draw(p, color = "#00ff00", w, h, x = 0, y = 0, full = false, lineW = 1) {
          if (p) {
              this.realDraw(p, color, w, h, x, y, full, lineW);
          }
      }
      static realDraw(p, color = "#00ff00", w, h, x = 0, y = 0, full = false, lineW = 1) {
          if (this.canDraw) {
              let keyName = "debugspr";
              if (p.getChildByName(keyName)) {
                  p.getChildByName(keyName).removeSelf();
              }
              let spr = new Laya.Sprite();
              spr.name = keyName;
              spr.mouseThrough = true;
              spr.width = p.width;
              spr.height = p.height;
              spr.graphics.clear();
              let offset = 3;
              spr.graphics.drawRect(x + offset, y + offset, (w || p.width) - offset * 2, (h || p.height) - offset * 2, !full ? null : color, color, lineW);
              spr.alpha = full ? 0.5 : 1;
              p.addChild(spr);
          }
      }
      static drawCross(p, x = 0, y = 0, _size = 10, _color = "#0000ff") {
          if (this.canDraw) {
              let con = new Laya.Sprite();
              let size = _size;
              con.graphics.clear();
              con.graphics.drawLine(x - size, y, x + size, y, _color);
              con.graphics.drawLine(x, y - size, x, y + size, _color);
              p.addChild(con);
          }
      }
      static drawRect(p, x = 0, y = 0, _size = 10, _color = "#00ff00") {
          if (this.canDraw) {
              let con = new Laya.Sprite();
              let n = _size;
              con.graphics.clear();
              con.graphics.drawRect(x - n / 2, y - n / 2, n, n, null, _color, 1);
              p.addChild(con);
          }
      }
      static drawCirle(p, x = 0, y = 0, _size = 5, _color = "#ff0000") {
          if (this.canDraw) {
              let con = new Laya.Sprite();
              con.graphics.clear();
              con.graphics.drawCircle(x, y, _size, null, _color, 1);
              p.addChild(con);
          }
      }
      static drawTF(view, content, color = "#ffffff", ox = 0, oy = 0) {
          if (this.canDraw) {
              this.realDrawTF(view, content, color, ox, oy);
          }
      }
      static realDrawTF(view, content, color = "#ff0000", ox, oy) {
          let key = "debugTf";
          view.getChildByName(key);
          if (view.getChildByName(key)) {
              view.getChildByName(key).removeSelf();
          }
          if (StringUtil.IsNullOrEmpty(content)) {
              return;
          }
          let lb = new Laya.Label();
          lb.stroke = 2;
          lb.strokeColor = "#000000";
          lb.color = color;
          view.addChild(lb);
          lb.x = ox;
          lb.y = oy;
          lb.name = key;
          lb.fontSize = 18;
          lb.text = content;
      }
      static createTf() {
          let tf = new Laya.Label();
          tf.fontSize = 22;
          tf.color = "#00ff00";
          tf.stroke = 2;
          tf.strokeColor = "#000000";
          return tf;
      }
  }
  DebugUtil.COLOR_PURPLE = "#ff00ff";

  class TimeCheckCtl {
      constructor() {
          this.curTime = 0;
          this.checkSubMs = 0;
      }
      setTime(ms, actionHandler) {
          this.checkSubMs = ms;
          this._actionHandler = actionHandler;
      }
      delayStart() {
          Laya.timer.clear(this, this.start);
          Laya.timer.once(this.checkSubMs, this, this.start);
      }
      start() {
          let sub = Laya.timer.currTimer - this.curTime;
          let _time = 0;
          let s = sub - this.checkSubMs;
          if (s < 0) {
              _time = s;
          }
          else {
              this.curTime = Laya.timer.currTimer;
          }
          this._actionHandler.runWith(_time);
      }
      dispose() {
          this._actionHandler = null;
      }
  }

  class ButtonCtl {
      constructor(skin, onClick = null, scaleAnim = true) {
          this.oldx = 0;
          this.oldy = 0;
          this.refScale = 1.0;
          this.useSound = true;
          DebugUtil.draw(skin, DebugUtil.COLOR_PURPLE);
          this.refScale = skin.scaleX;
          this.clickHandler = onClick;
          this.scaleAnim = scaleAnim;
          this.skin = skin;
          this.skin.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
          this.skin.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
          this.skin.on(Laya.Event.CLICK, this, this.onMouseClick);
          this.oldx = this.skin.x;
          this.oldy = this.skin.y;
      }
      set visible(v) {
          if (this.skin.visible != v) {
              this.skin.visible = v;
          }
      }
      get visible() {
          return this.skin.visible;
      }
      get isOpen() {
          return true;
      }
      set bgSkin(url) {
          let img = this.skin;
          img.skin = url;
      }
      set gray(v) {
          this.skin.gray = v;
          for (let i = 0; i < this.skin.numChildren; i++) {
              this.skin.getChildAt(i).gray = v;
          }
      }
      static Create(skin, onClick, scaleAnim = true) {
          return new ButtonCtl(skin, onClick, scaleAnim);
      }
      static CreateBtn(skin, that, func, scaleAnim = true, args, bStopPropagation = false) {
          let btn = this.Create(skin, new Laya.Handler(that, func, args), scaleAnim);
          btn.bStopPropagation = bStopPropagation;
          return btn;
      }
      setDelayTime(s) {
          if (!this.timeCtl) {
              this.timeCtl = new TimeCheckCtl();
          }
          this.timeCtl.setTime(s * 1000, new Laya.Handler(this, this.onActionHandler));
      }
      onActionHandler(time) {
          if (time != 0) {
          }
          else {
              if (this.clickHandler) {
                  this.clickHandler.run();
              }
          }
      }
      onMouseClick(e) {
          if (this.bStopPropagation) {
              e.stopPropagation();
          }
          this.doClickHandler();
      }
      set mouseEnable(v) {
          if (v) {
              this.skin.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
              this.skin.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
              this.skin.on(Laya.Event.CLICK, this, this.onMouseClick);
          }
          else {
              this.skin.off(Laya.Event.MOUSE_DOWN, this, this.onDown);
              this.skin.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
              this.skin.off(Laya.Event.CLICK, this, this.onMouseClick);
          }
          this.clearUp();
      }
      set mouseThrough(v) {
          this.skin.mouseThrough = v;
      }
      set grayMouseDisable(v) {
          this.mouseEnable = !v;
          this.gray = v;
      }
      onMouseUp() {
          this.clearUp();
      }
      playSound() {
          if (this.useSound) {
              ButtonCtl.E.AudioMgr.PlayUI("sound_anniu.mp3");
          }
      }
      onDown() {
          this.playSound();
          let _scale = 0.95 * this.refScale;
          if (!this.scaleAnim) {
              _scale = 1.0 * this.refScale;
          }
          else {
              this.skin.scaleX = this.skin.scaleY = _scale;
          }
          this.skin.x = this.oldx + (this.skin.width * (this.refScale - _scale)) / 2;
          this.skin.y = this.oldy + (this.skin.height * (this.refScale - _scale)) / 2;
          Laya.timer.once(500, this, this.clearUp);
      }
      doClickHandler() {
          if (ButtonCtl.disable) {
              ButtonCtl.E.EventMgr.emit(EventID.ButtonDisable);
              return;
          }
          if (this.timeCtl) {
              this.timeCtl.start();
          }
          else {
              let tempSkin = this.skin;
              if (this.clickHandler) {
                  this.clickHandler.run();
              }
              ButtonCtl.E.EventMgr.emit(EventID.ButtonCtlClick, tempSkin);
          }
      }
      setpos(x, y) {
          this.oldx = x;
          this.oldy = y;
          this.clearUp();
      }
      set hitRect(v) {
          this.skin.hitArea = v;
          DebugUtil.draw(this.skin, DebugUtil.COLOR_PURPLE, v.width, v.height, v.x, v.y);
      }
      setX(v) {
          this.oldx = v;
          this.clearUp();
      }
      getX() {
          return this.oldx;
      }
      getY() {
          return this.oldy;
      }
      setY(v) {
          this.oldy = v;
          this.clearUp();
      }
      clearUp() {
          if (this.skin && !this.skin.destroyed) {
              this.skin.scaleX = this.skin.scaleY = this.refScale;
              this.skin.x = this.oldx;
              this.skin.y = this.oldy;
          }
      }
      dispose() {
          if (this.timeCtl) {
              this.timeCtl.dispose();
          }
          if (this.skin) {
              this.skin.off(Laya.Event.MOUSE_DOWN, this, this.onDown);
              this.skin.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
              this.skin.off(Laya.Event.CLICK, this, this.onMouseClick);
              this.clearUp();
          }
          else {
          }
          this.skin = null;
          this.clickHandler = null;
      }
  }
  ButtonCtl.disable = false;

  class CheckBoxCtl {
      constructor(skin, contentStr) {
          this.skin = skin;
          this.bg = skin.bg;
          this.gou = skin.gou;
          this.content = skin.content;
          this.gou.mouseEnabled = false;
          if (this.content) {
              this.content.mouseEnabled = false;
              if (contentStr) {
                  this.content.text = contentStr;
              }
          }
          this.bg.mouseEnabled = true;
          this.btn = ButtonCtl.CreateBtn(this.bg, this, this.onClick, false);
      }
      onClick() {
          if (this.checkHandler && this.checkHandler.run() == false) {
              return;
          }
          this.selected = !this.gou.visible;
          if (this.selectHander) {
              this.selectHander.runWith(this.selected);
          }
      }
      set selected(v) {
          this.gou.visible = v;
      }
      get selected() {
          return this.gou.visible;
      }
      set visible(v) {
          this.bg.visible = this.gou.visible = v;
          if (this.content) {
              this.content.visible = v;
          }
      }
      dispose() {
          this.btn.dispose();
      }
      set disable(v) {
          this.bg.mouseEnabled = !v;
      }
      set gray(v) {
          this.bg.gray = v;
          this.gou.gray = v;
          if (this.content) {
              this.content.gray = v;
          }
      }
  }

  class CsTimeVo {
      constructor(_time) {
          let hour = Math.floor(_time / 3600);
          let minute = Math.floor(_time / 60) % 60;
          let sec = _time % 60;
          this.hour = hour;
          this.minute = minute;
          this.sec = sec;
      }
  }
  class TimeUtil {
      static Init() {
          this._startTime = Laya.timer.currTimer;
      }
      static get DeltaTimeS() { return Laya.timer.delta * 0.001; }
      static get FixedDeltaTimeMS() { return 20; }
      static get TimeSinceStartupS() { return (Laya.timer.currTimer - this._startTime) / 1000.0; }
      static get TimeScale() { return Laya.timer.scale; }
      static set TimeScale(scale) { Laya.timer.scale = scale; }
      static timeFormatStr(_time, _isHour = false) {
          let hour = Math.floor(_time / 3600);
          let minute = Math.floor(_time / 60) % 60;
          let sec = _time % 60;
          if (_isHour) {
              let hideHourZero = true;
              let v = "0";
              if (hideHourZero) {
                  v = "";
              }
              return (hour < 10 ? (v + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute) + ':' + (sec < 10 ? ('0' + sec) : sec);
          }
          else {
              return (minute < 10 ? ('0' + minute) : minute) + ':' + (sec < 10 ? ('0' + sec) : sec);
          }
      }
      static getHMS(_sec) {
          return new CsTimeVo(_sec);
      }
      static set serverTimeV(v) {
          let sub = v - Laya.timer.currTimer / 1000;
          this._subTime = sub;
      }
      static get serverTime() {
          if (isNaN(this.serverTimeMS)) {
              return (Date.now()) / 1000;
          }
          return Math.ceil(this.serverTimeMS / 1000);
      }
      static isNotToday(time) {
          let zero = this.curZeroTime;
          if (time < zero) {
              return true;
          }
          else {
              return false;
          }
      }
      static get serverTimeMS() {
          let t = Laya.timer;
          let v = 0;
          if (t) {
              v = Laya.timer.currTimer;
          }
          return (this._subTime == undefined ? 0 : this._subTime) * 1000 + v;
      }
      static get serverTimeOutStr() {
          let a = this.serverTimeMS;
          return isNaN(a) ? ("#client time# " + this.timestamtoTime(Date.now(), "-", " ", ":", ":", true)) : this.timestamtoTime(a, "-", " ", ":", ":", true);
      }
      static toSecond(str, sign = ":") {
          let _arr = str.split(sign);
          return parseInt(_arr[0]) * 3600 + parseInt(_arr[1]) * 60 + parseInt(_arr[2]);
      }
      static getTimeStamp(str) {
          let t = new Date(str.replace(' ', "T") + '+08:00').getTime();
          return t;
      }
      static timestamtoTime(v, k = "-", dk = " ", tk = ":", prefix = "0", ms = false) {
          let date = new Date(v);
          let Y = date.getFullYear() + k;
          let M = (date.getMonth() + 1 < 10 ? prefix + (date.getMonth() + 1) : date.getMonth() + 1) + k;
          let D = date.getDate() + dk;
          let h = date.getHours() + tk;
          let m = date.getMinutes() + tk;
          let s = date.getSeconds();
          return Y + M + D + h + m + s + (ms ? "." + date.getMilliseconds() : "");
      }
      static timestamtoTime3(v) {
          let date = new Date(v);
          let Y = date.getFullYear() + "年";
          let M = date.getMonth() + 1 + "月";
          let D = date.getDate() + "日";
          return Y + M + D;
      }
      static timestamtoTime1(v, k = "-", dk = " ", tk = ":", hasYear = true) {
          let date = new Date(v * 1000);
          let Y = date.getFullYear() + k;
          let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + k;
          let D = date.getDate() < 10 ? "0" + date.getDate() + dk : date.getDate() + dk;
          let h = date.getHours() < 10 ? "0" + date.getHours() + tk : date.getHours() + tk;
          let m = date.getMinutes() < 10 ? "0" + date.getMinutes() + tk : date.getMinutes() + tk;
          let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          return (hasYear ? Y : "") + M + D + h + m + s;
      }
      static timestamtoTime2(v) {
          let date = new Date(v * 1000);
          let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "月";
          let D = date.getDate() < 10 ? "0" + date.getDate() + "日   " : date.getDate() + "日   ";
          let h = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
          let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          return M + D + h + m;
      }
      static timesMonthDay(v) {
          let date = new Date(v * 1000);
          let M = (date.getMonth() + 1) + "月";
          let D = date.getDate() + "日";
          let h = date.getHours() + ":";
          let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          return M + D + " " + h + m;
      }
      static getMonthDay(sec) {
          let date = new Date(sec * 1000);
          let k = "/";
          let M = (date.getMonth() + 1) + k;
          let D = date.getDate();
          return M + D;
      }
      static timeToStr(v, k = "-", dk = " ", tk = ":") {
          return this.timestamtoTime(v * 1000);
      }
      static GetCurDayZero(time) {
          let date = new Date(time);
          let t = new Date(date.toLocaleDateString()).getTime();
          return t;
      }
      static getZeroSecond(time) {
          return this.GetCurDayZero(time * 1000) / 1000;
      }
      static get curZeroTime() {
          return this.getZeroSecond(this.serverTime);
      }
      static getDay() {
          let t = this.serverTime;
          let date = new Date(t * 1000);
          let day = date.getDay();
          return day;
      }
      static getDayString(day) {
          let weeks = ["日", "一", "二", "三", "四", "五", "六"];
          return weeks[day];
      }
      static getHourMin(t) {
          let day = Math.floor(t / 86400);
          let time = t % 86400;
          let a = this.timeFormatStr(time, true).split(":");
          return { day: day, hour: parseInt(a[0]), minutes: parseInt(a[1]), sec: parseInt(a[2]) };
      }
      static subTime(t) {
          if (t < 0) {
              return "";
          }
          if (t < 3600) {
              return this.timeFormatStr(t);
          }
          else if (t >= 3600 && t < 86400) {
              return this.timeFormatStr(t, true);
          }
          else if (t >= 86400) {
              let o = this.getHourMin(t);
              if (o.minutes > 0) {
                  return `${o.day}天${o.hour}小时${o.minutes}分钟`;
              }
              else if (o.hour > 0) {
                  return `${o.day}天${o.hour}小时`;
              }
              return `${o.day}天`;
          }
      }
      static subTimeCC(t) {
          if (t < 0) {
              return "";
          }
          if (t < 3600) {
              return this.timeFormatStr(t);
          }
          else if (t >= 3600 && t < 86400) {
              return this.timeFormatStr(t, true);
          }
          else if (t >= 86400) {
              let o = this.getHourMin(t);
              if (o.minutes > 0) {
                  return `${o.day}天${o.hour}小时`;
              }
              else if (o.hour > 0) {
                  return `${o.day}天${o.hour}小时`;
              }
              return `${o.day}天`;
          }
      }
      static subTimeC(t, min = "分") {
          let o = this.getHourMin(t);
          let st = "";
          if (t >= 60) {
              if (o.day > 0) {
                  st += o.day + "天";
              }
              if (o.hour > 0) {
                  st += o.hour + "小时";
              }
              if (o.minutes > 0) {
                  st += o.minutes + min;
              }
          }
          else {
              if (t > 0) {
                  st = t + "秒";
              }
          }
          return st;
      }
      static subTimeHMS(t) {
          if (t < 0) {
              return "";
          }
          let o = this.getHourMin(t);
          let h = o.hour + o.day * 24;
          if (h > 0) {
              return `${h}时${o.minutes}分${o.sec}秒`;
          }
          if (o.minutes > 0) {
              return `${o.minutes}分${o.sec}秒`;
          }
          return `${o.sec}秒`;
      }
      static subTimeHMS_EN(t) {
          let p = ":";
          if (t < 0) {
              return "";
          }
          let o = this.getHourMin(t);
          let h = o.hour + o.day * 24;
          let m = o.minutes;
          m = m < 10 ? "0" + m : m;
          let sec = o.sec < 10 ? "0" + o.sec : o.sec;
          if (h > 0) {
              return `${h < 10 ? "0" + h : h}${p}${m}${p}${sec}`;
          }
          if (o.minutes > 0) {
              return `${m}${p}${sec}`;
          }
          return `00${p}${sec}`;
      }
      static getTimeShow(time) {
          let oneYear = 3600 * 24 * 365;
          let oneMonth = oneYear / 12;
          if (time < 60 || time >= 60 && time <= 3600) {
              return Math.ceil(time / 60) + "分钟";
          }
          else if (time >= 3600 && time < 3600 * 24) {
              return Math.ceil(time / 3600) + "小时";
          }
          else if (time >= 3600 * 24 && time < oneMonth) {
              return Math.ceil(time / (3600 * 24)) + "天";
          }
          else if (time >= oneMonth && time < oneYear) {
              return Math.ceil(time / oneMonth) + "月";
          }
          return Math.ceil(time / (oneYear)) + "年";
      }
      static ShowTime(t, serverTime) {
          let zero = this.GetCurDayZero(t);
          let curZero = this.GetCurDayZero(serverTime);
          if (zero == curZero) {
              let date = new Date(t);
              let h = date.getHours();
              let m = date.getMinutes();
              return `${h}:${m}`;
          }
          else {
              let sub = curZero - zero;
              let oneDay = 86400 * 1000;
              if (sub <= oneDay) {
                  let date = new Date(t);
                  let h = date.getHours();
                  let m = date.getMinutes();
                  return `昨天 ${h}:${m}`;
              }
              else if (sub > oneDay && sub <= oneDay * 7) {
                  let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                  let date = new Date(t);
                  let day = date.getDay();
                  let h = date.getHours();
                  let m = date.getMinutes();
                  let week = weeks[day];
                  return `${week} ${h}:${m}`;
              }
              else if (sub > oneDay * 7 && sub < oneDay * 365) {
                  let date = new Date(t);
                  let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
                  let D = date.getDate();
                  let h = date.getHours();
                  let m = date.getMinutes();
                  return `${M}月${D}日 ${h}:${m}`;
              }
              else {
                  let date = new Date(t);
                  let Y = date.getFullYear();
                  let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
                  let D = date.getDate();
                  let h = date.getHours();
                  let m = date.getMinutes();
                  return `${Y}年${M}月${D}日 ${h}:${m}`;
              }
          }
      }
      static getUnixByWeek(dayOfWeek, time) {
          let t = this.serverTime;
          var currentDate = new Date(t * 1000);
          var currentDay = currentDate.getDay() ? currentDate.getDay() : 7;
          let day;
          const now = currentDate.getTime();
          day = new Date(now + (dayOfWeek - currentDay) * 86400000);
          const [HH, mm, ss] = time.split(':').map(Number);
          day.setHours(HH || 0, mm || 0, ss || 0, 0);
          var timestamp = Math.round(day.getTime() / 1000);
          return timestamp;
      }
  }
  TimeUtil._startTime = 0;

  var ELogLevel;
  (function (ELogLevel) {
      ELogLevel[ELogLevel["LOG"] = 1] = "LOG";
      ELogLevel[ELogLevel["WARN"] = 2] = "WARN";
      ELogLevel[ELogLevel["ERROR"] = 3] = "ERROR";
  })(ELogLevel || (ELogLevel = {}));
  class LogSys {
      static get isWx() {
          if (this._isWx == undefined) {
              let wx = window['wx'];
              if (wx) {
                  let o = wx.getSystemInfoSync();
                  if (o) {
                      if (o.platform == "devtools") {
                      }
                      else {
                          this._isWx = true;
                      }
                  }
              }
              else {
                  this._isWx = false;
              }
          }
          return this._isWx;
      }
      static get time() {
          return TimeUtil.timestamtoTime(Date.now(), "-", " ", ":", "0", true);
      }
      static Log(...args) {
          if (this.CanLog(ELogLevel.LOG)) {
              console.log(this.time + "\t[Log]", args.toString());
          }
      }
      static Info(...args) {
          if (this.CanLog(ELogLevel.LOG)) {
              console.info(this.time + "[Info]", args.toString());
          }
      }
      static Warn(...args) {
          if (this.CanLog(ELogLevel.WARN)) {
              console.warn(this.time + "\t[Warn]", args.toString());
          }
      }
      static Trace(...arg) {
          if (this.CanLog(ELogLevel.LOG)) {
              console.trace(this.time + "\t[Trace]", arg.toString());
          }
      }
      static Error(...args) {
          if (this.CanLog(ELogLevel.ERROR)) {
              console.error(this.time + "\t[Error]", args.toString());
          }
      }
      static Json(json) {
          if (this.CanLog(ELogLevel.LOG))
              console.log("[Json]", JSON.stringify(json));
      }
      static CanLog(level) {
          if (debug) {
              return true;
          }
          return LogSys.IsEnable && this.isValidLevel(level);
      }
      static isValidLevel(level) { if (LogSys.Level <= level)
          return true; return false; }
  }
  LogSys.IsEnable = false;
  LogSys.Level = ELogLevel.LOG;

  class TabControl {
      constructor() {
          this.btnCtlList = [];
          this._selectIndex = -1;
      }
      f_defaultItemHandler(curSkin, index, sel) {
          let skin = curSkin;
          skin.tf.text = this.dataArr[index];
          if (sel) {
              skin.img.skin = "remote/main/main/anniu_2.png";
          }
          else {
              skin.img.skin = "remote/main/main/anniu_1.png";
          }
      }
      static Create(target, selHandler, itemHandler) {
          let _tab = new TabControl();
          _tab.selHandler = new Laya.Handler(target, selHandler);
          _tab.itemHandler = new Laya.Handler(target, itemHandler);
          return _tab;
      }
      set visible(v) {
          for (let i = 0; i < this.items.length; i++) {
              this.items[i].visible = v;
          }
      }
      init(items, selHandler, itemHandler) {
          this.items = items;
          if (itemHandler) {
              this.itemHandler = itemHandler;
          }
          else {
              this.itemHandler = new Laya.Handler(this, this.f_defaultItemHandler);
          }
          this.selHandler = selHandler;
          let _dataList = [];
          this.btnCtlList = [];
          for (let i = 0; i < items.length; i++) {
              let cell = items[i];
              let _btnCtl = ButtonCtl.CreateBtn(cell, this, this.onItemClick, false, [i]);
              this.btnCtlList.push(_btnCtl);
              _dataList.push(i);
          }
          this.setData(_dataList);
      }
      get curDataArr() {
          return this.dataArr;
      }
      get selectItemData() {
          return this.dataArr[this.selectIndex];
      }
      onItemClick(i) {
          this.selectIndex = i;
      }
      dispose() {
          while (this.btnCtlList.length) {
              let btn = this.btnCtlList.shift();
              btn.dispose();
          }
          this.items = null;
          this.itemHandler = null;
          this.selHandler = null;
      }
      setData(data) {
          this.dataArr = data;
          let len = data.length;
          if (len > this.items.length) {
              LogSys.Warn('TabControl ,please add much more items');
          }
          for (let i = 0; i < this.items.length; i++) {
              let cell = this.items[i];
              if (i < len) {
                  cell.visible = true;
              }
              else {
                  cell.visible = false;
              }
              this.itemHandler.runWith([cell, i, this._selectIndex == i, this.dataArr[i]]);
          }
      }
      get selectIndex() {
          return this._selectIndex;
      }
      set selectIndex(v) {
          if (this.checkHandler && !this.checkHandler.runWith(v)) {
              return;
          }
          if (this._selectIndex == v) {
              return;
          }
          if (v + 1 > this.items.length) {
              return;
          }
          for (let i = 0; i < this.dataArr.length; i++) {
              let item = this.items[i];
              this.itemHandler.runWith([item, i, v == i, this.dataArr[i]]);
          }
          this._selectIndex = v;
          this.selHandler.runWith(v);
      }
      refreshTabsView() {
          let v = this._selectIndex;
          for (let i = 0; i < this.dataArr.length; i++) {
              let item = this.items[i];
              this.itemHandler.runWith([item, i, v == i, this.dataArr[i]]);
          }
      }
      forceSelectIndex(v) {
          this._selectIndex = -1;
          this.selectIndex = v;
      }
      static createTabCtl(skins, styles, selectHandler, labs) {
          let tab = new TabControlDecorator(skins, styles, selectHandler, labs);
          return tab;
      }
  }
  class TabControlDecorator {
      constructor(skins, _styles, _selectHandler, _labs) {
          this._tab = new TabControl();
          if (!StringUtil.IsNullOrEmpty(_labs)) {
              this._lbArr = _labs.split("|");
          }
          this._styles = _styles;
          this._tab.init(skins, _selectHandler, new Laya.Handler(this, this.itemTabHandler));
      }
      dispose() {
          this._tab.dispose();
      }
      itemTabHandler(tabSkin, index, sel, data) {
          let style;
          if (sel) {
              style = this._styles[0];
          }
          else {
              style = this._styles[1];
          }
          tabSkin.img.skin = style.skin;
          tabSkin.tf.color = style.color;
          tabSkin.tf.strokeColor = style.strokeColor;
          if (this._lbArr) {
              tabSkin.tf.text = this._lbArr[index] || "";
          }
      }
      set selectIndex(v) {
          this._tab.selectIndex = v;
      }
  }

  class TimeCtl {
      constructor(tf) {
          this.destroyed = false;
          this.ticket = 0;
          this.tf = tf;
      }
      setText(v) {
          if (this.destroyed) {
          }
          else {
              if (this.tf) {
                  this.tf.text = v;
              }
          }
      }
      start(s, update = null, end = null) {
          this.end = end;
          this.updateHandler = update;
          this.ticket = s;
          this.timeTick();
      }
      get tickVal() {
          return this.ticket;
      }
      timeTick() {
          if (this.ticket > 0) {
              if (this.updateHandler != null) {
                  this.updateHandler.runWith(this.ticket);
              }
              else {
                  this.setText(this.ticket.toString());
              }
              Laya.timer.once(1000, this, this.timeTick);
          }
          else {
              Laya.timer.clear(this, this.timeTick);
              if (this.end != null) {
                  this.end.run();
              }
          }
          this.subTicket();
      }
      subTicket() {
          this.ticket--;
      }
      stop() {
          this.ticket = -1;
          Laya.timer.clear(this, this.timeTick);
      }
      dispose() {
          this.stop();
          this.tf = null;
          this.destroyed = true;
      }
  }

  class HttpUtil {
      static err(_url, errHandler, errData) {
          if (errHandler) {
              errHandler.runWith(errData);
          }
          if (this.E) {
              this.E.sendTrack("HttpRequest", { error: errData, val: _url });
          }
      }
      static complete(callBack, data) {
          callBack.runWith(data);
      }
      static httpGet(url, callBack, errHandler) {
          let http = new Laya.HttpRequest();
          http.once(Laya.Event.COMPLETE, this, this.complete, [callBack]);
          LogSys.Log(url);
          http.send(url, null, "get");
          http.once(Laya.Event.ERROR, this, this.err, [url, errHandler]);
      }
      static httpPost(url, data, callBack) {
          let http = new Laya.HttpRequest();
          http.once(Laya.Event.COMPLETE, this, this.complete, [callBack]);
          LogSys.Log(url);
          http.send(url, data, "post");
          http.once(Laya.Event.ERROR, this, this.err, [url]);
      }
  }

  class LayoutUtil {
      static CenterLayout(container, cellW, gap, row) {
          let allw;
          allw = container.numChildren * (cellW + gap) - gap;
          let offset = allw / 2;
          if (row == -1) {
              row = Number.MAX_VALUE;
              offset = allw / 2;
          }
          else {
              offset = (row * (cellW + gap)) / 2 - gap;
          }
          let _resetIndex = 0;
          let oy = 0;
          for (let i = 0; i < container.numChildren; i++) {
              let cell = container.getChildAt(i);
              cell.x = _resetIndex * (cellW + gap) - offset;
              cell.y = oy;
              _resetIndex++;
              if (_resetIndex >= row) {
                  _resetIndex = 0;
                  oy += (cellW + gap);
              }
          }
      }
  }

  class RandomUtil {
      static RandomNext() {
          return Math.random();
      }
      static RandomRound(min, max) {
          let _min = min;
          let _max = max;
          if (_min > _max) {
              _min = max;
              _max = min;
          }
          let range = _max - _min;
          let rand = Math.random();
          return min + (rand * range);
      }
      static RandomRoundInt(min, max) {
          let _min = min;
          let _max = max;
          if (_min > _max) {
              _min = max;
              _max = min;
          }
          var range = _max - _min;
          var rand = Math.random();
          let result = Math.round(min + (rand * range));
          result = result >= max ? result - 1 : result;
          return result;
      }
      static RandomBoolean() {
          let ran = this.RandomNext();
          return ran >= 0.5;
      }
      static RandomByWeights(weights) {
          let sum = 0;
          for (let w of weights) {
              sum += w;
          }
          let rand = RandomUtil.RandomRound(0, sum);
          sum = 0;
          for (let i = 0; i < weights.length; i++) {
              sum += weights[i];
              if (rand <= sum)
                  return i;
          }
      }
      static OnWhetherItMeetsTheRequirementsByProportion(proportion, start, end, bCantains = false) {
          if (bCantains) {
              if (this.RandomRoundInt(start, end) <= proportion)
                  return true;
          }
          else {
              if (this.RandomRoundInt(start, end) < proportion)
                  return true;
          }
          return false;
      }
      static RandomCountList(lst) {
          let rand = this.RandomRoundInt(0, lst.length);
          if (rand < lst.length / 2) {
              rand = 0;
          }
          let randLst = this.RandomArray(lst);
          return randLst.splice(0, rand);
      }
      static RandomArray(lst) {
          let result = lst.sort(() => {
              return 0.5 - Math.random();
          });
          return result;
      }
      static RandSeed(seed) {
          seed = (seed * 9301 + 49297) % 233280;
          return [seed, ((seed / (233280.0)) * 100 | 0)];
      }
  }

  class ListUtil {
      static Contains(lst, item) {
          return lst.indexOf(item) >= 0 ? true : false;
      }
      static ContainsArray(lst1, items) {
          if (items.length == 0)
              return false;
          for (let i = 0; i < items.length; i++) {
              if (!this.Contains(lst1, items[i]))
                  return false;
          }
          return true;
      }
      static Add(self, item) {
          self.push(item);
      }
      static SafeAdd(self, item) {
          if (!this.Contains(self, item))
              self.push(item);
      }
      static SafeAddRange(self, items) {
          for (let i = 0; i < items.length; i++) {
              if (this.Contains(self, items[i]))
                  continue;
              self.push(items[i]);
          }
      }
      static AddRange(self, items) {
          for (let i = 0; i < items.length; i++) {
              self.push(items[i]);
          }
      }
      static Remove(self, item) {
          let index1 = self.indexOf(item);
          while (index1 != -1) {
              self.splice(index1, 1);
              index1 = self.indexOf(item);
          }
      }
      static RemoveAt(self, index) {
          if (index < 0)
              index = 0;
          if (index < self.length) {
              return self.splice(index, 1)[0];
          }
          return null;
      }
      static RemoveContainsRange(self, other) {
          for (let i = 0; i < other.length; i++) {
              if (this.Contains(self, other[i]))
                  this.RemoveAllCotains(self, other[i]);
          }
          return self;
      }
      static RemoveUnContainsRange(self, other) {
          let templst = this.Copy(self);
          for (let i = 0; i < templst.length; i++) {
              if (this.Contains(other, templst[i]))
                  continue;
              this.RemoveAllCotains(self, templst[i]);
          }
          return self;
      }
      static RemoveAllCotains(self, item) {
          while (this.Contains(self, item)) {
              this.Remove(self, item);
          }
          return self;
      }
      static Copy(lst) {
          let newlst = [];
          if (!this.IsNullOrEmpty(lst)) {
              for (let i = 0; i < lst.length; i++) {
                  ListUtil.Add(newlst, lst[i]);
              }
          }
          return newlst;
      }
      static Random(lst) {
          let newlst = [];
          while (lst.length != 0) {
              let index = RandomUtil.RandomRoundInt(0, lst.length);
              let item = lst[index];
              ListUtil.Add(newlst, item);
              ListUtil.Remove(lst, item);
          }
          return newlst;
      }
      static GetRandomOne(lst) {
          let i = RandomUtil.RandomRoundInt(0, lst.length);
          return lst[i];
      }
      static RandomNumFromRange(lst, num) {
          let templst = [];
          if (lst.length <= num) {
              templst = lst;
          }
          else {
              let count = 0;
              while (count < num) {
                  let tempindex = RandomUtil.RandomRoundInt(0, lst.length);
                  if (!ListUtil.Contains(templst, lst[tempindex])) {
                      count++;
                      ListUtil.Add(templst, lst[tempindex]);
                  }
              }
          }
          return templst;
      }
      static RandomNumIndexFromRange(lst, num) {
          let result = [];
          let templst = [];
          if (lst.length <= num) {
              templst = lst;
          }
          else {
              let count = 0;
              while (count < num) {
                  let tempindex = RandomUtil.RandomRoundInt(0, lst.length);
                  if (!ListUtil.Contains(templst, lst[tempindex])) {
                      count++;
                      ListUtil.Add(templst, lst[tempindex]);
                      ListUtil.Add(result, tempindex);
                  }
              }
          }
          return result;
      }
      static GetRange(lst, start, end) {
          let templst = [];
          templst = lst.slice(start, end);
          return templst;
      }
      static GetIndexList(lst) {
          let lstIndexs = [];
          for (let i = 0; i < lst.length; i++) {
              this.Add(lstIndexs, i);
          }
          return lstIndexs;
      }
      static GetIndex(lst, item) {
          for (let i = 0; i < lst.length; i++) {
              const element = lst[i];
              if (element == item) {
                  return i;
              }
          }
          return -1;
      }
      static GetContainsIndexList(self, other) {
          let lstIndexs = [];
          for (let i = 0; i < other.length; i++) {
              const item = other[i];
              let index = this.GetIndex(self, item);
              if (index > 0 && index < self.length) {
                  this.Add(lstIndexs, index);
              }
          }
          return lstIndexs;
      }
      static Insert(lst, item, index) {
          if (index >= lst.length) {
              lst.push(item);
              return lst;
          }
          let result = [];
          for (let i = 0; i < lst.length; i++) {
              if (i < index) {
                  result.push(lst[i]);
              }
              else if (i == index) {
                  result.push(item);
                  result.push(lst[i]);
              }
              else {
                  result.push(lst[i]);
              }
          }
          return result;
      }
      static IsNullOrEmpty(lst) {
          return lst == null || lst.length == 0;
      }
  }

  let TWO_PWR_16_DBL = 1 << 16;
  let TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
  let TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
  let pow_dbl = Math.pow;
  let INT_CACHE = {};
  let wasm = null;
  let UINT_CACHE = {};
  function isLong(obj) {
      return (obj && obj["__isLong__"]) === true;
  }
  function fromString(str, unsigned = undefined, radix = undefined) {
      if (str.length === 0)
          throw Error('empty string');
      if (typeof unsigned === 'number') {
          radix = unsigned;
          unsigned = false;
      }
      else {
          unsigned = !!unsigned;
      }
      if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
          return unsigned ? UZERO : ZERO;
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
          throw RangeError('radix');
      var p;
      if ((p = str.indexOf('-')) > 0)
          throw Error('interior hyphen');
      else if (p === 0) {
          return fromString(str.substring(1), unsigned, radix).neg();
      }
      var radixToPower = fromNumber(pow_dbl(radix, 8));
      var result = ZERO;
      for (var i = 0; i < str.length; i += 8) {
          var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
          if (size < 8) {
              var power = fromNumber(pow_dbl(radix, size));
              result = result.mul(power).add(fromNumber(value));
          }
          else {
              result = result.mul(radixToPower);
              result = result.add(fromNumber(value));
          }
      }
      result.unsigned = unsigned;
      return result;
  }
  function fromValue(val, unsigned = false) {
      if (typeof val === 'number')
          return fromNumber(val, unsigned);
      if (typeof val === 'string')
          return fromString(val, unsigned);
      return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
  }
  function fromInt(value, unsigned = false) {
      var obj, cachedObj, cache;
      if (unsigned) {
          value >>>= 0;
          if (cache = 0 <= value && value < 256) {
              cachedObj = UINT_CACHE[value];
              if (cachedObj)
                  return cachedObj;
          }
          obj = fromBits(value, 0, true);
          if (cache)
              UINT_CACHE[value] = obj;
          return obj;
      }
      else {
          value |= 0;
          if (cache = -128 <= value && value < 128) {
              cachedObj = INT_CACHE[value];
              if (cachedObj)
                  return cachedObj;
          }
          obj = fromBits(value, value < 0 ? -1 : 0, false);
          if (cache)
              INT_CACHE[value] = obj;
          return obj;
      }
  }
  var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
  function fromNumber(value, unsigned = false) {
      if (isNaN(value))
          return unsigned ? UZERO : ZERO;
      if (unsigned) {
          if (value < 0)
              return UZERO;
          if (value >= TWO_PWR_64_DBL)
              return MAX_UNSIGNED_VALUE;
      }
      else {
          if (value <= -TWO_PWR_63_DBL)
              return MIN_VALUE;
          if (value + 1 >= TWO_PWR_63_DBL)
              return MAX_VALUE;
      }
      if (value < 0)
          return fromNumber(-value, unsigned).neg();
      return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
  }
  class uint64 {
      constructor(low = 0, high = 0, unsigned = true) {
          this.unsigned = true;
          this.low = low;
          this.high = high;
          this.unsigned = !!unsigned;
      }
      zero() {
          this.high = this.low = 0;
      }
      write(b) {
          b.writeUint32(this.high);
          b.writeUint32(this.low);
      }
      read(b) {
          this.high = b.readUint32();
          this.low = b.readUint32();
      }
      isZero() {
          return this.high === 0 && this.low === 0;
      }
      eq(other) {
          return this.equals(other);
      }
      equals(other) {
          if (!isLong(other))
              other = fromValue(other);
          if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
              return false;
          return this.high === other.high && this.low === other.low;
      }
      ;
      div(divisor) {
          return this.divide(divisor);
      }
      shiftRight(numBits) {
          if (isLong(numBits))
              numBits = numBits.toInt();
          if ((numBits &= 63) === 0)
              return this;
          else if (numBits < 32)
              return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
          else
              return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
      }
      shr(n) {
          return this.shiftRight(n);
      }
      add(addend) {
          if (!isLong(addend))
              addend = fromValue(addend);
          var a48 = this.high >>> 16;
          var a32 = this.high & 0xFFFF;
          var a16 = this.low >>> 16;
          var a00 = this.low & 0xFFFF;
          var b48 = addend.high >>> 16;
          var b32 = addend.high & 0xFFFF;
          var b16 = addend.low >>> 16;
          var b00 = addend.low & 0xFFFF;
          var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
          c00 += a00 + b00;
          c16 += c00 >>> 16;
          c00 &= 0xFFFF;
          c16 += a16 + b16;
          c32 += c16 >>> 16;
          c16 &= 0xFFFF;
          c32 += a32 + b32;
          c48 += c32 >>> 16;
          c32 &= 0xFFFF;
          c48 += a48 + b48;
          c48 &= 0xFFFF;
          return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
      }
      ;
      sub(subtrahend) {
          if (!isLong(subtrahend))
              subtrahend = fromValue(subtrahend);
          return this.add(subtrahend.neg());
      }
      ;
      not() {
          return fromBits(~this.low, ~this.high, this.unsigned);
      }
      ;
      neg() {
          if (!this.unsigned && this.eq(MIN_VALUE))
              return MIN_VALUE;
          return this.not().add(ONE);
      }
      ;
      shru(numBits) {
          if (isLong(numBits))
              numBits = numBits.toInt();
          if ((numBits &= 63) === 0)
              return this;
          if (numBits < 32)
              return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
          if (numBits === 32)
              return fromBits(this.high, 0, this.unsigned);
          return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
      }
      ;
      divide(divisor) {
          if (!isLong(divisor))
              divisor = fromValue(divisor);
          if (divisor.isZero())
              throw Error('division by zero');
          if (wasm) {
              if (!this.unsigned && this.high === -0x80000000 && divisor.low === -1 && divisor.high === -1) {
                  return this;
              }
              var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(this.low, this.high, divisor.low, divisor.high);
              return fromBits(low, wasm["get_high"](), this.unsigned);
          }
          if (this.isZero())
              return this.unsigned ? UZERO : ZERO;
          var approx, rem, res;
          if (!this.unsigned) {
              if (this.eq(MIN_VALUE)) {
                  if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                      return MIN_VALUE;
                  else if (divisor.eq(MIN_VALUE))
                      return ONE;
                  else {
                      var halfThis = this.shr(1);
                      approx = halfThis.div(divisor).shl(1);
                      if (approx.eq(ZERO)) {
                          return divisor.isNegative() ? ONE : NEG_ONE;
                      }
                      else {
                          rem = this.sub(divisor.mul(approx));
                          res = approx.add(rem.div(divisor));
                          return res;
                      }
                  }
              }
              else if (divisor.eq(MIN_VALUE))
                  return this.unsigned ? UZERO : ZERO;
              if (this.isNegative()) {
                  if (divisor.isNegative())
                      return this.neg().div(divisor.neg());
                  return this.neg().div(divisor).neg();
              }
              else if (divisor.isNegative())
                  return this.div(divisor.neg()).neg();
              res = ZERO;
          }
          else {
              if (!divisor.unsigned)
                  divisor = divisor.toUnsigned();
              if (divisor.gt(this))
                  return UZERO;
              if (divisor.gt(this.shru(1)))
                  return UONE;
              res = UZERO;
          }
          rem = this;
          while (rem.gte(divisor)) {
              approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
              var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
              while (approxRem.isNegative() || approxRem.gt(rem)) {
                  approx -= delta;
                  approxRes = fromNumber(approx, this.unsigned);
                  approxRem = approxRes.mul(divisor);
              }
              if (approxRes.isZero())
                  approxRes = ONE;
              res = res.add(approxRes);
              rem = rem.sub(approxRem);
          }
          return res;
      }
      ;
      toInt() {
          return this.unsigned ? this.low >>> 0 : this.low;
      }
      ;
      toString(radix = undefined) {
          radix = radix || 10;
          if (radix < 2 || 36 < radix)
              throw RangeError('radix');
          if (this.isZero())
              return '0';
          if (this.isNegative()) {
              if (this.eq(MIN_VALUE)) {
                  var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                  return div.toString(radix) + rem1.toInt().toString(radix);
              }
              else
                  return '-' + this.neg().toString(radix);
          }
          var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
          var result = '';
          while (true) {
              var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
              rem = remDiv;
              if (rem.isZero())
                  return digits + result;
              else {
                  while (digits.length < 6)
                      digits = '0' + digits;
                  result = '' + digits + result;
              }
          }
      }
      isNegative() {
          return !this.unsigned && this.high < 0;
      }
      toUnsigned() {
          if (this.unsigned)
              return this;
          return fromBits(this.low, this.high, true);
      }
      ;
      comp(other) {
          if (!isLong(other))
              other = fromValue(other);
          if (this.eq(other))
              return 0;
          var thisNeg = this.isNegative(), otherNeg = other.isNegative();
          if (thisNeg && !otherNeg)
              return -1;
          if (!thisNeg && otherNeg)
              return 1;
          if (!this.unsigned)
              return this.sub(other).isNegative() ? -1 : 1;
          return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
      }
      ;
      gte(other) {
          return this.comp(other) > 0;
      }
      ;
      ge(other) {
          return this.gte(other);
      }
      gt(other) {
          return this.comp(other) > 0;
      }
      ;
      lt(other) {
          return this.comp(other) < 0;
      }
      ;
      isOdd() {
          return (this.low & 1) === 1;
      }
      ;
      mul(multiplier) {
          if (this.isZero())
              return this;
          if (!isLong(multiplier))
              multiplier = fromValue(multiplier);
          if (wasm) {
              var low = wasm["mul"](this.low, this.high, multiplier.low, multiplier.high);
              return fromBits(low, wasm["get_high"](), this.unsigned);
          }
          if (multiplier.isZero())
              return this.unsigned ? UZERO : ZERO;
          if (this.eq(MIN_VALUE))
              return multiplier.isOdd() ? MIN_VALUE : ZERO;
          if (multiplier.eq(MIN_VALUE))
              return this.isOdd() ? MIN_VALUE : ZERO;
          if (this.isNegative()) {
              if (multiplier.isNegative())
                  return this.neg().mul(multiplier.neg());
              else
                  return this.neg().mul(multiplier).neg();
          }
          else if (multiplier.isNegative())
              return this.mul(multiplier.neg()).neg();
          if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
              return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
          var a48 = this.high >>> 16;
          var a32 = this.high & 0xFFFF;
          var a16 = this.low >>> 16;
          var a00 = this.low & 0xFFFF;
          var b48 = multiplier.high >>> 16;
          var b32 = multiplier.high & 0xFFFF;
          var b16 = multiplier.low >>> 16;
          var b00 = multiplier.low & 0xFFFF;
          var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
          c00 += a00 * b00;
          c16 += c00 >>> 16;
          c00 &= 0xFFFF;
          c16 += a16 * b00;
          c32 += c16 >>> 16;
          c16 &= 0xFFFF;
          c16 += a00 * b16;
          c32 += c16 >>> 16;
          c16 &= 0xFFFF;
          c32 += a32 * b00;
          c48 += c32 >>> 16;
          c32 &= 0xFFFF;
          c32 += a16 * b16;
          c48 += c32 >>> 16;
          c32 &= 0xFFFF;
          c32 += a00 * b32;
          c48 += c32 >>> 16;
          c32 &= 0xFFFF;
          c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
          c48 &= 0xFFFF;
          return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
      }
      ;
      toNumber() {
          if (this.unsigned)
              return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
          return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
      }
      ;
  }
  let MIN_VALUE = fromBits(0, 0x80000000 | 0, false);
  let MAX_VALUE = fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false);
  let NEG_ONE = fromInt(-1);
  let ONE = fromInt(1);
  let UONE = fromInt(1, true);
  let UZERO = fromInt(0, true);
  let ZERO = fromInt(0);
  let TWO_PWR_24_DBL = 1 << 24;
  let MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true);
  let TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
  uint64.prototype['__isLong__'];
  Object.defineProperty(uint64.prototype, "__isLong__", {
      value: true
  });
  function fromBits(lowBits, highBits, unsigned) {
      return new uint64(lowBits, highBits, unsigned);
  }

  class Callback {
      static Create(caller, callback) {
          let func = new Callback();
          func._caller = caller;
          func._callback = callback;
          return func;
      }
      get Caller() { return this._caller; }
      get CallBack() { return this._callback; }
      Clear() {
          this._caller = null;
          this._callback = null;
      }
      Invoke(data) {
          if (this._callback) {
              return this._callback.call(this._caller, data);
          }
      }
  }

  class Dictionary {
      constructor() {
          this._keys = [];
          this._values = [];
          this._len = 0;
      }
      ToJsonObj() {
          const result = {};
          result.keys = this._keys;
          result.values = this._values;
          return result;
      }
      FromJsonObj(obj) {
          this._keys = obj.keys;
          this._values = obj.values;
      }
      Add(key, value) {
          let idx = this._keys.indexOf(key, 0);
          if (idx != -1) {
              this._keys[idx] = key;
              this._values[idx] = value;
              return true;
          }
          this._keys.push(key);
          this._values.push(value);
          this._len++;
          return true;
      }
      Remove(key) {
          let idx = this._keys.indexOf(key, 0);
          if (idx != -1) {
              this._keys.splice(idx, 1);
              this._values.splice(idx, 1);
              this._len--;
          }
      }
      Key(value) {
          let idx = this._values.indexOf(value);
          if (idx != -1)
              return this._keys[idx];
          return null;
      }
      Value(key) {
          let idx = this._keys.indexOf(key);
          if (idx != -1)
              return this._values[idx];
          return null;
      }
      TryGetValueListByCondition(value) {
          let list = [];
          for (let v of this._values) {
              if (value(v))
                  list[list.length] = v;
          }
          return list;
      }
      TryGetAnyByCondition(value) {
          let dic = {};
          for (let k of this._keys) {
              let idx = this._keys.indexOf(k, 0);
              if (value(this._values[idx]))
                  dic[k] = this._values[idx];
          }
          return dic;
      }
      TryGetKeyListByCondition(func) {
          let list = [];
          for (let k of this._keys) {
              if (func(k))
                  list[list.length] = k;
          }
          return list;
      }
      HasKey(key) {
          let ks = this._keys;
          for (let i = 0; i < ks.length; i++) {
              if (ks[i] == key)
                  return true;
          }
          return false;
      }
      SortByKey() {
          for (let i = this._keys.length - 1; i >= 0; i--) {
              for (let j = this._keys.length - 1; j >= 0; j--) {
                  if (Number(this._keys[i]) > Number(this._keys[i + 1])) {
                      let tmpK = this._keys[i];
                      let tmpV = this._values[i];
                      this._keys[i] = this._keys[i + 1];
                      this._values[i] = this._values[i + 1];
                      this._keys[i + 1] = tmpK;
                      this._values[i + 1] = tmpV;
                  }
              }
          }
          return true;
      }
      GetLength() { return this._len; }
      GetValueByIndex(idx) {
          if (idx < 0 || idx > +this._len)
              return;
          let v = this._values[idx];
          return v;
      }
      GetKeyByIndex(idx) {
          if (idx < 0 || idx > +this._len)
              return;
          let k = this._keys[idx];
          return k;
      }
      Values() { return this._values; }
      Keys() { return this._keys; }
      Clear() {
          while (this._keys.length > 0)
              this._keys.pop();
          while (this._values.length > 0) {
              let vt = this._values.pop();
              vt = null;
          }
          this._keys.length = 0;
          this._values.length = 0;
          this._len = 0;
      }
      Foreach(func) {
          let idx = -1;
          for (let k of this._keys) {
              idx = this._keys.indexOf(k);
              if (idx != -1) {
                  func(k, this._values[idx]);
              }
          }
      }
  }

  class EventManager {
      constructor() {
          this._handles = null;
          this._hasInit = false;
      }
      Init() {
          if (this._hasInit)
              return false;
          this._hasInit = true;
          if (this._handles != null) {
              this._handles.Foreach((k, v) => {
                  if (v != null)
                      v = [];
                  return true;
              });
          }
          this._handles = new Dictionary();
          return true;
      }
      Clear() {
      }
      emit(eventId, data) {
          if (!this._hasInit)
              return;
          if (data) {
              data.eventName = eventId;
          }
          if (this._handles.HasKey(eventId) && this._handles != null) {
              this._handles.Value(eventId).forEach((i) => {
                  i.Invoke(data);
              });
          }
      }
      on(eventName, target, callback) {
          this._handles.Add(eventName, this._handles.Value(eventName) || []);
          let item = Callback.Create(target, callback);
          ListUtil.Add(this._handles.Value(eventName), item);
      }
      off(eventName, target, callback) {
          if (this._handles.HasKey(eventName) && this._handles.Value(eventName) != null) {
              ListUtil.Copy(this._handles.Value(eventName)).forEach((i) => {
                  if (i.Caller == target && i.CallBack == callback) {
                      ListUtil.Remove(this._handles.Value(eventName), i);
                      if (this._handles.Value(eventName).length == 0)
                          this._handles.Remove(eventName);
                  }
              });
          }
      }
  }

  var SERVERTYPE;
  (function (SERVERTYPE) {
      SERVERTYPE[SERVERTYPE["CLOSE"] = 1] = "CLOSE";
      SERVERTYPE[SERVERTYPE["SELECTTYPE"] = 2] = "SELECTTYPE";
      SERVERTYPE[SERVERTYPE["KickNtf"] = 3] = "KickNtf";
  })(SERVERTYPE || (SERVERTYPE = {}));
  class ClientSocket {
      constructor() {
          this.blen = 0;
          this.needReconnect = false;
          this.totalReconnectCount = 3;
          this.curReconnectCount = 0;
      }
      get HEART_TIME() {
          let v = ClientSocket.HeartMillisecond;
          if (!v) {
              v = 2000;
          }
          return v;
      }
      ConnectByUrl(url, target, callback) {
          this._url = url;
          if (!this._socket) {
              this._socket = new Laya.Socket();
              this._socket.endian = Laya.Socket.BIG_ENDIAN;
          }
          this._target = target;
          this._callback = callback;
          console.log('ConnectByUrl:' + url);
          this._socket.connectByUrl(url);
          this.regEvents();
      }
      regEvents() {
          if (this._socket) {
              this._socket.on(Laya.Event.OPEN, this, this.socketOpenHandler);
              this._socket.on(Laya.Event.MESSAGE, this, this.socketMessageHandler);
              this._socket.on(Laya.Event.CLOSE, this, this.socketCloseHandler);
              this._socket.on(Laya.Event.ERROR, this, this.socketErrorHandler);
          }
      }
      remEvents() {
          if (this._socket) {
              this._socket.off(Laya.Event.OPEN, this, this.socketOpenHandler);
              this._socket.off(Laya.Event.MESSAGE, this, this.socketMessageHandler);
              this._socket.off(Laya.Event.CLOSE, this, this.socketCloseHandler);
              this._socket.off(Laya.Event.ERROR, this, this.socketErrorHandler);
          }
      }
      get headMSGID() {
          return 1001;
      }
      get hasLog() {
          return Laya.Utils.getQueryString("proto_log");
      }
      binSendMsg(msg) {
          if (!this.IsConnect()) {
              console.log("socket 为空");
              return;
          }
          let cmd = msg.protoid;
          let data = new Laya.Byte();
          data.pos = 0;
          data.endian = Laya.Byte.BIG_ENDIAN;
          if (typeof msg == "string") {
              throw Error("检查是否是json格式的协议");
          }
          msg.write(data);
          if (this.hasLog) {
              this.blen += data.length;
              if (cmd != this.headMSGID) {
                  if (!this.checkCmd(cmd)) {
                      console.log("..send:" + TimeUtil.serverTimeOutStr, msg, data.length + " bytes ");
                  }
              }
          }
          let msgByteArr = new Laya.Byte();
          msgByteArr.pos = 0;
          msgByteArr.endian = Laya.Byte.BIG_ENDIAN;
          msgByteArr.writeUint16(cmd);
          msgByteArr.writeUint32(data.length);
          if (data.length > 0) {
              msgByteArr.writeArrayBuffer(data.buffer);
          }
          this._socket.send(msgByteArr.buffer);
      }
      SendMessage(msgId, msg) {
          if (!this.IsConnect()) {
              console.log("socket 为空");
              return;
          }
          let data = new Laya.Byte();
          data.pos = 0;
          data.endian = Laya.Byte.BIG_ENDIAN;
          data.writeUTFBytes(msg);
          let msgByteArr = new Laya.Byte();
          msgByteArr.pos = 0;
          msgByteArr.endian = Laya.Byte.BIG_ENDIAN;
          msgByteArr.writeUint16(msgId);
          msgByteArr.writeUint32(data.length);
          if (data.length > 0) {
              msgByteArr.writeArrayBuffer(data.buffer);
          }
          this._socket.send(msgByteArr.buffer);
          if (msgId != this.headMSGID) {
          }
      }
      checkCmd(cmdId) {
          if (debug) {
              let disable = false;
              let disableCMD = Laya.Utils.getQueryString("disableCMD");
              if (disableCMD) {
                  let arr = disableCMD.split("@");
                  if (arr.indexOf(cmdId.toString()) != -1) {
                      disable = true;
                  }
              }
              return disable;
          }
          return false;
      }
      readMessage(msg) {
          let data = new Laya.Byte();
          data.writeArrayBuffer(msg);
          data.pos = 0;
          data.endian = Laya.Byte.BIG_ENDIAN;
          let cmdId = data.getUint16();
          let datalen = data.getUint32();
          let protoByte = new Laya.Byte();
          let protoUint8Arr = data.getUint8Array(data.pos, datalen);
          protoByte.writeArrayBuffer(protoUint8Arr.buffer);
          protoByte.pos = 0;
          protoByte.endian = Laya.Byte.BIG_ENDIAN;
          let obj = this.getParseObj(cmdId);
          if (obj) {
              if (this.hasLog) {
                  this.blen += protoByte.length;
                  if (cmdId != this.headMSGID) {
                      let disable = this.checkCmd(cmdId);
                      if (!disable) {
                          console.log("" + Laya.timer.currTimer + ",read:" + TimeUtil.serverTimeOutStr, obj, "cmd:" + cmdId + " len:" + protoByte.length);
                      }
                  }
              }
              if (cmdId != this.headMSGID) {
                  if (obj.read) {
                      obj.read(protoByte);
                      protoByte.clear();
                      let msgInfo = { msgId: cmdId, data: obj };
                      this.E.EventMgr.emit(EventID.WEBSOCKET_MESSAGE, msgInfo);
                  }
                  else {
                      console.error(cmdId + " 协议未添加监听!");
                  }
              }
          }
          else {
              console.error("协议:" + cmdId + "未定义");
          }
      }
      IsConnect() {
          return this._socket && this._socket.connected;
      }
      close() {
          if (this._socket)
              this._socket.close();
      }
      socketOpenHandler() {
          LogSys.Log("webSocket is open");
          this.StartOrStopHeartbeat(true);
          this.totalReconnectCount = 10;
          this.curReconnectCount = 0;
          this.serverType = SERVERTYPE.CLOSE;
          if (this._callback != null)
              this._callback.bind(this._target)();
      }
      onReadList() {
          if (this._msgList.length > 0) {
              let cell = this._msgList.shift();
              this.readMessage(cell);
          }
      }
      socketMessageHandler(msg = null) {
          this.readMessage(msg);
      }
      SetReconnectCall(callback) {
          this.reconnectCallback = callback;
      }
      socketCloseHandler() {
          LogSys.Log("webSocket is close");
          this.E.sendTrack("webSocket is close", { "curReconnectCount": this.curReconnectCount });
          this.StartOrStopHeartbeat(false);
          this.clean();
          if (this.serverType == SERVERTYPE.SELECTTYPE) {
              this.E.MsgMgr.reset();
              this.E.EventMgr.emit(EventID.ConnectRegist);
          }
          else if (this.serverType == SERVERTYPE.KickNtf) {
              this.E.EventMgr.emit(EventID.KickNtf, null);
          }
          else {
              if (this.curReconnectCount == 0)
                  this.needReconnect = true;
              if (this.needReconnect && this.curReconnectCount < this.totalReconnectCount) {
                  ++this.curReconnectCount;
                  LogSys.Warn("curReconnectCount:::" + this.curReconnectCount);
                  Laya.timer.callLater(this, () => {
                      if (this.reconnectCallback != null)
                          this.reconnectCallback.Invoke({ caller: this, callback: null });
                  });
              }
              else {
                  this.needReconnect = false;
                  if (this._callback != "")
                      this._callback = "";
                  this.E.EventMgr.emit(EventID.WEBSOCKET_CLOSED, null);
              }
          }
      }
      socketErrorHandler() {
          LogSys.Log("webSocket Error is close");
          this.E.sendTrack("webSocket Error is close", { "curReconnectCount": this.curReconnectCount });
          this.StartOrStopHeartbeat(false);
          this.clean();
          Laya.timer.once(1000, this, this.onCurRec);
      }
      onCurRec() {
          LogSys.Log("onCurRec>>>>>>>>>>");
          this.E.sendTrack("onCurRec", { "curReconnectCount": this.curReconnectCount });
          if (this.curReconnectCount >= this.totalReconnectCount) {
              this.E.EventMgr.emit(EventID.WEBSOCKET_ERROR, null);
              LogSys.Log("onCurRec>>>>>>>>>>,EventID.WEBSOCKET_ERROR");
              return;
          }
          if (this._socket && this._socket.connected) {
              LogSys.Log("onCurRec>>>>>>>>>>,connectedOKOKOK>>>>");
              return;
          }
          else {
              if (this.reconnectCallback != null)
                  this.reconnectCallback.Invoke({ caller: this, callback: null });
              this.curReconnectCount++;
              LogSys.Log("onCurRec>>>>>>>>>>,connected>>>>", this.curReconnectCount);
          }
      }
      clean() {
          if (this._socket) {
              this._socket.close();
              this.remEvents();
              this._socket = null;
          }
      }
      SetHeartbeatCall(callback) {
          this._heartbeatCallback = callback;
      }
      StartOrStopHeartbeat(b) {
          if (this._heartbeatTimer)
              this._heartbeatTimer.clear(this, this.headbeatHandler);
          if (b) {
              if (this._heartbeatTimer == null)
                  this._heartbeatTimer = new Laya.Timer();
              this._heartbeatTimer.once(this.HEART_TIME, this, this.headbeatHandler);
          }
      }
      headbeatHandler() {
          if (this._heartbeatCallback != null)
              this._heartbeatCallback.Invoke();
          this._heartbeatTimer.once(this.HEART_TIME, this, this.headbeatHandler);
      }
  }
  ClientSocket.mJsonString = false;

  window['TimeUtil'] = TimeUtil;
  window['Callback'] = Callback;
  window['LogSys'] = LogSys;
  window["ClientSocket"] = ClientSocket;
  window['EventID'] = EventID;
  window['uint64'] = uint64;
  window['StringUtil'] = StringUtil;
  window['RandomUtil'] = RandomUtil;
  window['ListUtil'] = ListUtil;
  window['SERVERTYPE'] = SERVERTYPE;
  window['TimeCtl'] = TimeCtl;
  window['DebugUtil'] = DebugUtil;
  window['TimeCheckCtl'] = TimeCheckCtl;
  window['EventManager'] = EventManager;
  window['Dictionary'] = Dictionary;
  window['ButtonCtl'] = ButtonCtl;
  window['CheckBoxCtl'] = CheckBoxCtl;
  window['TabControl'] = TabControl;
  window['HttpUtil'] = HttpUtil;
  window['LayoutUtil'] = LayoutUtil;

}());
//# sourceMappingURL=gamelib.js.map
