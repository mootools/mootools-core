import flash.external.*;
import flash.filters.DropShadowFilter;

//----------------------------------------------------------------------------------------------------------//

function init(){

	ExternalInterface.addCallback("setText", this, setText);
	ExternalInterface.addCallback("setStyles", this, setStyles);
	ExternalInterface.addCallback("render", this, render);
	ExternalInterface.addCallback("makeShadow", this, makeShadow);

	ExternalInterface.call(onLoad);

};

//----------------------------------------------------------------------------------------------------------//

var globalFilters = false;
var myText = false;

var txtFormat = new TextFormat();

txtFormat.font = "font";

var txtField = this.createTextField("txtField", 0, 0, 1, 1, 1);

txtField.embedFonts = true;
txtField.autoSize = "left";
txtField.html = true;
txtField.multiline = true;
txtField.antiAliasType = "advanced";

function makeShadow(distance, angleInDegrees, color, alpha, blur, strength){
	var shadowFilter = new DropShadowFilter(distance, angleInDegrees, color, alpha, blur, blur, strength, 5);
	globalFilters = [shadowFilter];
};

function setStyles(tColor, tSize, tBold, tItalic, tUnderLine, tLetterSpacing, tFont){
	if (tColor) txtFormat.color = tColor;
	if (tSize) txtFormat.size = tSize;
	if (tBold) txtFormat.bold = true;
	if (tItalic) txtFormat.italic = true;
	if (tUnderLine) txtFormat.underline = true;
	if (tLetterSpacing) txtFormat.letterSpacing = tLetterSpacing;
	if (tFont) txtFormat.font = tFont;
};

function setText(txt){
	myText = txt;
};

function render(shadOw){
	txtField.htmlText = myText;
	txtField.setTextFormat(txtFormat);
	if (shadOw && globalFilters) txtField.filters = globalFilters;
	else txtField.filters = [];
	return[txtField._width, txtField._height];
};

//----------------------------------------------------------------------------------------------------------//

init();