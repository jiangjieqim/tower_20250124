
/**AES加密工具类*/
export class AESUtil {

    private static get _KEY() { return "abc12345abc12345abc12345abc12345"; }
    private static get _IV() { return "1234567890123456" }

    /**AES加密*/
    public static Encrypt(o: string): string {

        var key = CryptoJS.enc.Utf8.parse(this._KEY);
        var iv = CryptoJS.enc.Utf8.parse(this._IV);
        let srcs = CryptoJS.enc.Utf8.parse(o);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.ciphertext.toString().toUpperCase();

    }

    /**AES解密*/
    public static DEncrypt(str: string): string {
        var key = CryptoJS.enc.Utf8.parse(this._KEY);
        var iv = CryptoJS.enc.Utf8.parse(this._IV);

        let encryptHexStr = CryptoJS.enc.Hex.parse(str);
        let srcs = CryptoJS.enc.Base64.stringify(encryptHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }

    public static TestAES() {
        // let str: string = "123woshi一个人！！===";
        let json = {
            name: "123",
            age: 10,
            sign: "--!",
        }
        let str = JSON.stringify(json);
        let tmpAES = this.Encrypt(str);
        console.log("加密后：" + tmpAES);
        let tmpDES = this.DEncrypt(tmpAES);

        // let json=
        console.log("解密后：" + tmpDES);
    }

}