/*
    ---------------------------------------------------------------------------
    ----------------------Option Box-------------------------------------------
    ---------------------------------------------------------------------------
*/

var OptionBox = function(rootElement) {
    if(rootElement == null)
        throw "Must pass a root element where to store option widgets";

    /*lista de builders pentru optiuni*/
    this._builders = [];
    /*elementul radacina unde vor fi stocate */
}


OptionBox.prototype.AddWidgetBuilder = function(name, builder) {
    if(name == null) throw "Widget Builder name cannot be null";
    if(builder == null) throw "Widget Builder cannot be null";

    this._builders[name] = builder;
}


OptionBox.prototype.BuildOption = function (name, params) {
    if (name == null) throw "Must specify Option name";

    if (this._builders[name] != null)
        return this._builders[name](params);
    else
        return null;

}
                

/*
    ---------------------------------------------------------------------------
    ----------------------Option Widget----------------------------------------
    ---------------------------------------------------------------------------
*/
var OptionWidget = function() {
}


OptionWidget.prototype.GetElement = function () {
    throw "not implemented";
}
                

/*
    ---------------------------------------------------------------------------
    ----------------------Widget Color-----------------------------------------
    ---------------------------------------------------------------------------
*/
OptionWidgetColor.prototype = new OptionWidget();
OptionWidgetColor.prototype.constructor = OptionWidgetColor;

function OptionWidgetColor(params) {
    this._element = null;
    this._params = params;

    if (this._params == null)
        this._params = {color:"#FFF"};
    
}


OptionWidgetColor.prototype.GetElement = function () {
    if (this._element == null)
        this._element = this._CreateElement();

    return this._element;
}


OptionWidgetColor.prototype._CreateElement = function () {
    /*divul container*/
    var root = document.createElement("div");

    root.style.float = "left";
    root.style.margin = "5px";
    root.style.width = "40px";
    root.style.height = "40px";
    root.style.backgroundColor = this._params.color;

    return root;
}
                
                

/*
    ---------------------------------------------------------------------------
    ----------------------ToolBox----------------------------------------------
    ---------------------------------------------------------------------------
*/

var ToolBox = function (toolContainer, optionsContainer) {
    if (toolContainer == null) throw "ToolBox container cannot be null";
    if (optionsContainer == null) throw "Options container cannot be null";

    /*elementul radacina pentru unelte*/
    this._toolContainer = toolContainer;
    /*elementul radacaina pentru optiuni*/
    this._optionsContainer = optionsContainer;

    /*lista de unelte*/
    this._tools = [];
    /*unealta curenta*/
    this._currentTool = null;

    /*evenimente*/
    var that = this;

    this._optionsContainer.onmouseover = function () {
        if (that._optionsContainer.style.opacity > 0) {
            $(that._optionsContainer).stop().animate({
                opacity: 1.0
            }, 200);
        }
    }

    this._optionsContainer.onmouseout = function () {
        if (that._optionsContainer.style.opacity > 0) {
            $(that._optionsContainer).stop().animate({
                opacity: 0.0
            }, 200);
        }
    }

    /*managerul de optiuni*/
    this._optionBox = new OptionBox(optionsContainer);

    /*adaugam tipurile de optiuni posibile*/
    this._optionBox.AddWidgetBuilder("Color", function (params) { return new OptionWidgetColor(params) });

}

ToolBox.prototype.AddTool = function (tool) {
    this._tools.push(tool);
    this._BuildToolOptions(tool);
}


ToolBox.prototype._BuildToolOptions = function (tool) {
    /*iteram prin toate optiunile uneltei si cream elementele*/
    for (var c in tool.Options) {
        var option = this._optionBox.BuildOption(tool.Options[c].type, tool.Options[c].params);
        tool.Options[c].Widget = option;

    }
}               

ToolBox.prototype.Pack = function () {
     for (t in this._tools) {
        var res = this._CreateToolElement(this._tools[t]);
        toolContainer.appendChild(res);
        this._tools[t].Element = res;
    }
}


ToolBox.prototype._CreateToolElement = function (tool) {
    if (this._toolContainer == null) throw "Tool cannot be empty";

    /*cream elementul container*/
    var res = document.createElement("div");
    var that = this;
    var currentTool = tool;

    /*evenimentele*/
    res.onclick = function () {
        that._ChangeToolSelection(currentTool);
    }

    /*evenimentele*/
    res.onmouseover = function () {
        that._ChangeToolHover(currentTool, true);
    }

    /*evenimentele*/
    res.onmouseout = function () {
        that._ChangeToolHover(currentTool, false);
    }

    /*iconita uneltei*/
    res.appendChild(tool.Icon);

    return res;
}


ToolBox.prototype._ChangeToolSelection = function (tool) {
    /*resetam starea eleentului selectat anterios*/
    if (this._currentTool != null) {
        this._currentTool.Element.style.backgroundColor = "";
    }

    this._currentTool = tool;

    if (this._currentTool != null) {
        this._currentTool.Element.style.backgroundColor = "#B1BDC9";
    }
}


ToolBox.prototype._ChangeToolHover = function (tool, enter) {
    if (tool != this._currentTool)
        return;

    if (enter)
        this._ShowOptionBox(tool);
    else
        this._HideOptionBox();

}


ToolBox.prototype._ShowOptionBox = function (tool) {
    /*modificam pozitia sa fie in aceiasi positie ca si tool-ul*/
    this._optionsContainer.style.left = tool.Element.offsetLeft + tool.Element.offsetWidth + "px";
    this._optionsContainer.style.top = tool.Element.offsetTop + "px";

    /*adaugam optiunle propriuzise*/
    while (this._optionsContainer.childNodes.length > 0)
        this._optionsContainer.removeChild(this._optionsContainer.firstChild);

    for (o in tool.Options) {
        if(tool.Options[o].Widget != null)
            this._optionsContainer.appendChild(tool.Options[o].Widget.GetElement());
    }

    $(this._optionsContainer).stop().animate({
        opacity: 1.0
    }, 200);

}


ToolBox.prototype._HideOptionBox = function() {
    $(this._optionsContainer).stop().animate({
        opacity: 0.0
    }, 200);		
}
                
                
                
                

/*
    ---------------------------------------------------------------------------
    ----------------------Abtract Tool-----------------------------------------
    ---------------------------------------------------------------------------
*/


var Tool = function () {
    /*iconita 50x50 ce va fi afisata in toolbox*/
    this.Icon = null;
    /*elementul dom asociat*/
    this.Element = null;

    /*lista de optiuni*/
    this.Options = [];
}

/*
    ---------------------------------------------------------------------------
    ----------------------Rectangle Tool---------------------------------------
    ---------------------------------------------------------------------------
*/

RectangleTool.prototype = new Tool();
RectangleTool.prototype.constructor = RectangleTool;

function RectangleTool() {
    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_rectangle.png";
    /*optiunile*/
    this.Options = [
        { id: "fgColor", type: "Color", params: { color: "#FFF"} },
        { id: "bgColor", type: "Color", params: { color: "#000"} },
        { id: "type", type: "Combo", params: { list: ["Rectangle", "Circle"]} }
    ];
}

/*
---------------------------------------------------------------------------
---------------------------Text Tool---------------------------------------
---------------------------------------------------------------------------
*/

TextTool.prototype = new Tool();
TextTool.prototype.constructor = TextTool;

function TextTool() {
    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_text.png";
    /*optiunile*/
    this.Options = [
        { id: "color", type: "Color", params: { color: "#FFF"} }
    ];
}
         
                