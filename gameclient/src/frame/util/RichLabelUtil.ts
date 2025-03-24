import HTMLDivElement = Laya.HTMLDivElement;
/**测试富文本*/
export class TestRichLabel {

    constructor() {
        let richtext: MRichText = new MRichText();
        richtext.SetContent("xxx");
        richtext.SetColor("red");
        richtext.SetItalic(true);
        richtext.SetFontSize(32);

        let richtext2: MRichText = new MRichText()
            .SetContent("yyy")
            .SetColor("green")
            .SetItalic(true)
            .SetFontSize(32);

        let div: HTMLDivElement = new HTMLDivElement();
        div.innerHTML = richtext.HTMLText + richtext2.HTMLText;

        Laya.stage.addChild(div);

    }
}

/**富文本*/
export class MRichText {

    constructor() { }

    private mHtml: string;
    private m_style: string;
    private m_content: string;

    private get mStyle(): string {
        this.m_style = "style='";
        this.m_style += "italic:" + this.mItalic + ";";
        this.m_style += "bold:" + this.mBold + ";";
        this.m_style += "letter-spacing:" + this.mLetterSpacing + "px;";
        this.m_style += "font-family:" + this.mFontFamily + ";";
        this.m_style += "font-size:" + this.mFontSize + "px;";
        this.m_style += "color:" + this.mColor + ";";
        this.m_style += "stroke:" + this.mStroke + "px;";
        this.m_style += "strokeColor:" + this.mStrokeColor + ";";
        this.m_style += "padding:" + this.mPadding + ";";
        this.m_style += "vertical-align:" + this.mVerticalAlign + ";";
        this.m_style += "align:" + this.mAlign + ";";

        this.m_style += "'";
        return this.m_style;
    }

    /**斜体-------------------------------------------------------*/
    private m_italic: boolean;
    private m_italic_default: boolean = false;
    private get mItalic() {
        if (this.m_italic == null || this.m_italic == undefined)
            this.m_italic = this.m_italic_default;
        return this.m_italic;
    }
    /**设置斜体
     * @param b -是否倾斜
    */
    public SetItalic(b: boolean): MRichText {
        this.m_italic = b;
        this._setHtml();
        return this;
    }

    /**加粗-------------------------------------------------------*/
    private m_bold: boolean;
    private m_bold_default: boolean = false;
    private get mBold() {
        if (this.m_bold == null || this.m_bold == undefined)
            this.m_bold = this.m_bold_default;
        return this.m_bold;
    }
    /**设置加粗*/
    public SetBold(b: boolean): MRichText {
        this.m_bold = b;
        this._setHtml();
        return this;
    }

    /**字间距-------------------------------------------------------*/
    private m_letter_spacing: number;
    private m_letter_spacing_default: number = 1;
    private get mLetterSpacing(): number {
        if (this.m_letter_spacing == null || this.m_letter_spacing == undefined)
            this.m_letter_spacing = this.m_letter_spacing_default;
        return this.m_letter_spacing;
    }

    public SetLetterSpacing(num: number): MRichText {
        this.m_letter_spacing = num;
        this._setHtml();
        return this;
    }

    /**字体-------------------------------------------------------*/
    private m_font_family: string;
    private m_font_family_default: string = "Arial";
    private get mFontFamily(): string {
        if (!this.m_font_family || this.m_font_family == "")
            this.m_font_family = this.m_font_family_default;
        return this.m_font_family;
    }
    public SetFontFamily(font: string): MRichText {
        this.m_font_family = font;
        this._setHtml();
        return this;
    }


    /**字体大小-------------------------------------------------------*/
    private m_font_size: number;
    private m_font_size_default: number = 16;
    private get mFontSize(): number {
        if (this.m_font_size == undefined || this.m_font_size == null)
            this.m_font_size = this.m_font_size_default;
        return this.m_font_size;
    }

    public SetFontSize(num: number): MRichText {
        this.m_font_size = num;
        this._setHtml();
        return this;
    }


    /**颜色-------------------------------------------------------*/
    private m_color: string = "";
    private m_color_default: string = "#ffffff";
    private get mColor(): string {
        if (!this.m_color || this.m_color == "")
            this.m_color = this.m_color_default;
        return this.m_color;
    }

    /**设置字体颜色-------------------------------------------------------*/
    public SetColor(color: string): MRichText {
        this.m_color = color;
        this._setHtml();
        return this;
    }

    /**描边宽度-------------------------------------------------------*/
    private m_stroke: number;
    private m_stroke_default: number = 1;
    private get mStroke(): number {
        if (this.m_stroke == undefined || this.m_stroke == null)
            this.m_stroke = this.m_stroke_default;
        return this.m_stroke;
    }

    /**设置描边宽度*/
    public SetStroke(num: number): MRichText {
        this.m_stroke = num;
        this._setHtml();
        return this;
    }


    /**描边颜色-------------------------------------------------------*/
    private m_stroke_color: string = "";
    private m_stroke_color_default: string = "#000000";
    private get mStrokeColor(): string {
        if (!this.m_stroke_color || this.m_stroke_color == "")
            this.m_stroke_color = this.m_stroke_color_default;
        return this.m_stroke_color;
    }

    public SetStrokeColor(color: string): MRichText {
        this.m_stroke_color = color;
        this._setHtml();
        return this;
    }


    /**边距-------------------------------------------------------*/
    private m_padding: string;
    private m_padding_default: string = "0px 0px 0px 0px";
    private get mPadding(): string {
        if (!this.m_padding || this.m_padding == "")
            this.m_padding = this.m_padding_default;
        return this.m_padding;
    }
    /**设置边距
     * @param trbl 上 右 下 左
    */
    public SetPadding(top: number, right: number, bot: number, left: number): MRichText {
        this.m_padding = top + "px " + right + "px " + bot + "px " + left + "px ";
        this._setHtml();
        return this;
    }

    /**垂直对齐方式-------------------------------------------------------*/
    private m_vertical_align: string;
    private m_vertical_align_default: string = "top";//top bottom middle
    private get mVerticalAlign(): string {
        if (!this.m_vertical_align || this.m_vertical_align == "")
            this.m_vertical_align = this.m_vertical_align_default;
        return this.m_vertical_align;
    }

    /**
     * 设置垂直对齐方式
     * @param str -top bottom middle
    */
    public SetVerticalAlign(str: string): MRichText {
        this.m_vertical_align = str;
        this._setHtml();
        return this;
    }

    /**水平对齐方式-------------------------------------------------------*/
    private m_align: string;
    private m_align_default: string = "left";//left center right
    private get mAlign(): string {
        if (!this.m_align || this.m_align == "")
            this.m_align = this.m_align_default;
        return this.m_align;
    }

    /**
     * 设置水平对齐方式
     * @param str -left center right
    */
    public SetAlign(str: string): MRichText {
        this.m_align = str;
        this._setHtml();
        return this;
    }

    //todo:剩余内容 需要时再添加

    // private m_line_height;
    // private m_bg_color;
    // private m_border_color;
    // private m_width: number;
    // private height: number;



    /**设置文本内容
     * @param str -纯文本内容，不包含标签
    */
    public SetContent(str: string): MRichText {
        this.m_content = str;
        this._setHtml();
        return this;
    }

    public Refresh(): void {
        this._setHtml();
    }

    private _setHtml() {

        this.mHtml = "<span #>" + this.m_content + "</span>";
        this.mHtml = this.mHtml.replace('#', this.mStyle);

        // console.log(this.mHtml);
    }

    public get HTMLText(): string {
        return this.mHtml;
    }



}