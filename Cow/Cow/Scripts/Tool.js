﻿/*
---------------------------------------------------------------------------
----------------------Option Box-------------------------------------------
---------------------------------------------------------------------------
*/

var OptionBox = function (rootElement) {
    if (rootElement == null)
        throw "Must pass a root element where to store option widgets";

    /*lista de builders pentru optiuni*/
    this._builders = [];
    /*elementul radacina unde vor fi stocate */
}


OptionBox.prototype.AddWidgetBuilder = function (name, builder) {
    if (name == null) throw "Widget Builder name cannot be null";
    if (builder == null) throw "Widget Builder cannot be null";

    this._builders[name] = builder;
}


OptionBox.prototype.BuildOption = function (id, type, params) {
    if (type == null) throw "Must specify Option type";
    if (id == null) throw "Must specify Option id";

    if (this._builders[type] != null)
        return this._builders[type](id, params);
    else
        return null;

}

/*
---------------------------------------------------------------------------
----------------------Option Widget----------------------------------------
---------------------------------------------------------------------------
*/
var OptionWidget = function (id, params) {
    this._id = id;
    this._params = params;
}

OptionWidget.prototype.GetElement = function () {
    throw "not implemented";
}

OptionWidget.prototype.OptionChanged = function (value) {
    if (this.Parent != null) {
        this.Parent.OptionChanged(this._id, value);
    }
}
/*
---------------------------------------------------------------------------
----------------------Widget Color-----------------------------------------
---------------------------------------------------------------------------
*/
OptionWidgetColor.prototype = Object.create(OptionWidget.prototype);
OptionWidgetColor.prototype.constructor = OptionWidgetColor;

function OptionWidgetColor(id, params) {
    this._element = null;
    this._params = params;
    this._id = id;

    if (this._params == null)
        this._params = { color: "#FFF" };

}

OptionWidgetColor.prototype.GetElement = function () {
    if (this._element == null)
        this._element = this._CreateElement();

    return this._element;
}

OptionWidgetColor.prototype._CreateElement = function () {
    /*divul container*/
    var root = document.createElement("div");

    root.className = "colorBox";
    root.style.backgroundColor = this._params.color;

    var that = this;

    /*cand se da click pe element afisam coolor chooserul*/
    root.onclick = function (e) {
        /*lazy init*/
        if (document.colorChooser == null)
            document.colorChooser = new color_select("document.colorChooser"); /*lol*/

        /*setam functia ce va fi apelata cand se schimba culoarea*/
        document.colorChooser.change_update_function = function (color) {
            that._UpdateColor(color);
        }
        /*atasam color chooserul la elementul curent si ii setam culoarea initiala*/
        document.colorChooser.attach_to_element(root);
        document.colorChooser.setrgb(Util.ColorToHex(root.style.backgroundColor));

        /*afisam color chooserul*/
        document.colorChooser.show();

    }

    return (this._element = root);
}


OptionWidgetColor.prototype._UpdateColor = function (color) {
    this._element.style.backgroundColor = color;

    /*facem update catre tool*/
    this.OptionChanged({ color: color });

}

/*
---------------------------------------------------------------------------
----------------------Widget Combo-----------------------------------------
---------------------------------------------------------------------------
*/
OptionWidgetCombo.prototype = Object.create(OptionWidget.prototype);
OptionWidgetCombo.prototype.constructor = OptionWidgetCombo;

function OptionWidgetCombo(id, params) {
    this._element = null;
    this._params = params;
    this._id = id;

    if (this._params == null)
        this._params = { list: [] };

}

OptionWidgetCombo.prototype.GetElement = function () {
    if (this._element == null)
        this._element = this._CreateElement();

    return this._element;
}

OptionWidgetCombo.prototype._CreateElement = function () {
    var that = this;

    /*comboboxul ce va contine elementele*/
    var root = document.createElement("select");
    root.className = "combo";

    /*cream cate o optiune pentru fiecare element din lista*/
    for (var i = 0; i < this._params.list.length; i++) {
        var option = document.createElement("option");

        option.innerHTML = this._params.list[i];
        option.value = this._params.list[i];
        root.appendChild(option);
    }

    root.onchange = function (e) {
        that._UpdateComboValue(root.value);
    }

    return (this._element = root);
}


OptionWidgetCombo.prototype._UpdateComboValue = function (value) {
    this.OptionChanged({ value: value });
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
    this._optionBox.AddWidgetBuilder("Color", function (id, params) { return new OptionWidgetColor(id, params) });
    this._optionBox.AddWidgetBuilder("Combo", function (id, params) { return new OptionWidgetCombo(id, params) });

}

ToolBox.prototype.AddTool = function (tool) {
    this._tools.push(tool);
    this._BuildToolOptions(tool);
}


ToolBox.prototype._BuildToolOptions = function (tool) {
    /*iteram prin toate optiunile uneltei si cream elementele*/
    for (var c = 0; c < tool.Options.length; c++) {
        var option = this._optionBox.BuildOption(tool.Options[c].id, tool.Options[c].type, tool.Options[c].params);
        if (option != null) {
            option.Parent = tool;
            tool.Options[c].Widget = option;
        }

    }
}

ToolBox.prototype.Pack = function () {
    for (var t = 0; t < this._tools.length; t++) {
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
        if (tool.Options[o].Widget != null)
            this._optionsContainer.appendChild(tool.Options[o].Widget.GetElement());
    }

    $(this._optionsContainer).stop().animate({
        opacity: 1.0
    }, 200);

}


ToolBox.prototype._HideOptionBox = function () {
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


Tool.prototype.OptionChanged = function (option, value) {
    throw "Not implemented";
}

/*
---------------------------------------------------------------------------
----------------------Rectangle Tool---------------------------------------
---------------------------------------------------------------------------
*/

RectangleTool.prototype = Object.create(Tool.pro);
RectangleTool.prototype.constructor = RectangleTool;

function RectangleTool() {
    this._bgColor = "#FFF";
    this._fgColor = "#000";
    this._value = "Rectangle";

    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_rectangle.png";
    /*optiunile*/
    this.Options = [
        { id: "fgColor", type: "Color", params: { color: this._fgColor} },
        { id: "bgColor", type: "Color", params: { color: this._bgColor} },
        { id: "type", type: "Combo", params: { list: ["Rectangle", "Circle"]} }
    ];
}


RectangleTool.prototype.OptionChanged = function (option, value) {
    if (option == "fgColor") {
        this._fgcolor = value.color;
    } else if (option == "bgColor") {
        this._bgColor = value.color;
    } else if (option == "type") {
        this._type = value.value;
    }

}


/*
---------------------------------------------------------------------------
---------------------------Text Tool---------------------------------------
---------------------------------------------------------------------------
*/

TextTool.prototype = Object.create(Tool.prototype);
TextTool.prototype.constructor = TextTool;

function TextTool() {
    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_text.png";
    /*optiunile*/
    this.Options = [
        { id: "color", type: "Color", params: { color: "#FFF"} }
    ];
}
         
                