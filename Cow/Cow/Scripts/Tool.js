/*
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
----------------------Widget Input-----------------------------------------
---------------------------------------------------------------------------
*/
OptionWidgetInput.prototype = Object.create(OptionWidget.prototype);
OptionWidgetInput.prototype.constructor = OptionWidgetInput;

OptionWidgetInput.prototype.Value = 0;  

function OptionWidgetInput(id, params) {
    this._element = null;
    this._params = params;
    this._id = id;
    this.Value = params.value;

}

OptionWidgetInput.prototype.GetElement = function () {
    if (this._element == null)
        this._element = this._CreateElement();

    return this._element;
}

OptionWidgetInput.prototype._CreateElement = function () {
    var that = this;

    var element = document.createElement("input");
    element.className = "input";
    element.style.width = "100px";
    element.value = this.Value;

    element.onchange = function (e) {
        that._UpdateComboValue(element.value);
    }

    return (this._element = element);
}


OptionWidgetInput.prototype._UpdateComboValue = function (value) {
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
    this._optionBox.AddWidgetBuilder("Input", function (id, params) { return new OptionWidgetInput(id, params) });

}

/*lista de unelte*/
ToolBox.prototype._tools = [];
ToolBox.prototype._toolsTable = {};

/*unealta curenta*/
ToolBox.prototype._currentTool = null;

ToolBox.prototype.AddTool = function (tool) {
    this._tools.push(tool);
    this._toolsTable[tool.Id] = tool;
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

ToolBox.prototype.ChangeToolSelection = function (name) {
    try {
        this._ChangeToolSelection(this._toolsTable[name]);
    } catch (e) {
        console.log(e.toString());
    }
}


ToolBox.prototype._ChangeToolSelection = function (tool) {
    if (tool == null)
        throw "Tool cannot be null";

    /*resetam starea eleentului selectat anterios*/
    if (this._currentTool != null) {
        this._currentTool.Element.style.backgroundColor = "";
        this._currentTool.Finish();
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


var Tool = function (toolbox, whiteBoard, factory) {
    this.ToolBox = toolbox;
    this.WhiteBoard = whiteBoard;
    this.WidgetFactory = factory;
}

/*id-ul unic*/
Tool.prototype.Id = "no id";
/*iconita 50x50 ce va fi afisata in toolbox*/
Tool.prototype.Icon = null;
/*elementul dom asociat*/
Tool.prototype.Element = null;

/*lista de optiuni*/
Tool.prototype.Options = [];

/*toolox-ul parinte*/
Tool.prototype.ToolBox = null;
/*white-board-ul afectat*/
Tool.prototype.WhiteBoard = null;
/*ce folosim sa cream widgeturi*/
Tool.prototype.WidgetFactory = null;


Tool.prototype.OptionChanged = function (option, value) {}
Tool.prototype.MouseDown = function (x, y) {}
Tool.prototype.MouseUp = function (x, y) {}
Tool.prototype.Finish = function() {} 
Tool.prototype.Drag = function (fromX, fromY, toX, toY) {} 

/*
---------------------------------------------------------------------------
----------------------Rectangle Tool---------------------------------------
---------------------------------------------------------------------------
*/

RectangleTool.prototype = Object.create(Tool.prototype);
RectangleTool.prototype.constructor = RectangleTool;

RectangleTool.prototype.DefaultWidth = 100;
RectangleTool.prototype.DefaultHeight = 50;

RectangleTool.prototype._bgColor = null;
RectangleTool.prototype._fgColor = null;
RectangleTool.prototype._type = null;
RectangleTool.prototype._lineWidth = null;

function RectangleTool(toolbox, whiteBoard, factory) {
    Tool.call(this, toolbox, whiteBoard, factory);    

    this.Id = "rectangle";

    this._bgColor = "#FFF";
    this._fgColor = "#000";
    this._value = "Rectangle";
    this._lineWidth = 1;

    /*tipul default*/
    this._type = "Rectangle";

    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_rectangle.png";
    /*optiunile*/
    this.Options = [
        { id: "fgColor", type: "Color", params: { color: this._fgColor} },
        { id: "bgColor", type: "Color", params: { color: this._bgColor} },
        { id: "type", type: "Combo", params: { list: ["Rectangle", "Triangle", "Circle"]} },
        { id: "lineWidth", type: "Input", params: { value : "1"}}
    ];
}


RectangleTool.prototype.OptionChanged = function (option, value) {
    if (option == "fgColor") {
        this._fgColor = value.color;
    } else if (option == "bgColor") {
        this._bgColor = value.color;
    } else if (option == "type") {
        this._type = value.value; 
    }   else if (option == "lineWidth") {
        this._lineWidth = parseInt(value.value); 
    }
}

RectangleTool.prototype.MouseUp = function (x, y) {
    if (this.WhiteBoard == null || this.WhiteBoard.ActiveLayer == null)
        return;

    var base = null;

    if(this._type == "Rectangle" || this._type == "Triangle" )
        base = this.WidgetFactory.BuildWidget("polygon");
    else if(this._type == "Circle")
        base = this.WidgetFactory.BuildWidget("circle");

    var widget = Create( base, {
        Polygon: Create(new Polygon(), {
            _points: [ ],
            PivotX: 0,
            PivotY: 0,
            Position: Create(new Point(), {X : x, Y : y}),
        }),
        BgColor: this._bgColor,
        FgColor: this._fgColor,
        LineWidth: this._lineWidth,
        Name: "Polygon"
    });

    if(this._type == "Rectangle") {
        widget.Polygon._points = [
                { X: - (this.DefaultWidth / 2), Y: - (this.DefaultHeight / 2) },
                { X:   (this.DefaultWidth / 2), Y: - (this.DefaultHeight / 2) },
                { X:   (this.DefaultWidth / 2), Y:   (this.DefaultHeight / 2) },
                { X: - (this.DefaultWidth / 2), Y:   (this.DefaultHeight / 2) }
        ];
        widget.Name = "Rectangle";
    } else if (this._type == "Triangle") {
        widget.Polygon._points = [
                { X: - (this.DefaultWidth / 2), Y:   (this.DefaultHeight / 2) },
                { X:   (this.DefaultWidth / 2), Y:   (this.DefaultHeight / 2) },
                { X:                         0, Y: - (this.DefaultHeight / 2)}
        ];
        widget.Name = "Triangle"; 
    } else if(this._type == "Circle") {
        widget.Polygon._points = [
                { X: + this.DefaultWidth, Y: 0},
        ];
        widget.Name = "Circle"; 
    }

    widget.UpdateBounds();

    /*adaugam widget-ul in layer-ul activ*/
    this.WhiteBoard.ActiveLayer.PushWidget(widget);
    /*schimbam selectia*/
    this.WhiteBoard.SetActiveWidget(widget);
    /*sincronizam cu servverul*/
    widget.Sync("add");
} 


/*
---------------------------------------------------------------------------
---------------------------Text Tool---------------------------------------
---------------------------------------------------------------------------
*/

var TextTool = function (toolbox, whiteBoard, factory) {
    Tool.call(this, toolbox, whiteBoard, factory);

    this.Id = "text";

    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_text.png";
    /*optiunile*/
    this.Options = [
        { id: "color", type: "Color", params: { color: "#000"} },
        { id: "size", type: "Input", params: { value: 10} },
        { id: "font", type: "Combo", params: { list: ["Arial", "Sans-serif"]} }
    ];
}

TextTool.prototype = Object.create(Tool.prototype);
TextTool.prototype.constructor = TextTool;

TextTool.prototype._color = "#555";
TextTool.prototype._size = 10;
TextTool.prototype._font = "Arial";

TextTool.prototype.MouseDown = function (x, y) {
} 

TextTool.prototype.OptionChanged = function (option, value) {
    if (option == "color") {
        this._color = value.color;
    } else if (option == "size") {
        this._size = parseInt(value.value);
    } else if (option == "font") {
        this._font = option;        
    }
}

TextTool.prototype.MouseUp = function (x, y) {
    if (this.WhiteBoard == null || this.WhiteBoard.ActiveLayer == null)
        return;

    var widget = Create(this.WidgetFactory.BuildWidget("text"), {
      Polygon: Create(new Polygon(), {
            _points: [],
            PivotX: 0,
            PivotY: 0,
            Position: Create(new Point(), {X : x, Y : y}),
        }),
        Color: this._color,
        Font : this._font,
        Size : this._size,
        Name : "Text"        
    });

    widget.UpdateBounds();

    /*adaugam widget-ul in layer-ul activ*/
    this.WhiteBoard.ActiveLayer.PushWidget(widget);
    /*sincronizam cu servverul*/
    widget.Sync("add");

    /*schimbam selectia*/
    this.WhiteBoard.SetActiveWidget(widget);
} 
/*
---------------------------------------------------------------------------
--------------------------Image Tool---------------------------------------
---------------------------------------------------------------------------
*/

var ImageTool = function (toolbox, whiteBoard, factory) {
    Tool.call(this, toolbox, whiteBoard, factory);

    this.Id = "image";
    this._url = "http://farm1.staticflickr.com/191/507570615_4706f53ff4.jpg";

    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_image.png";
    /*optiunile*/
    this.Options = [
        { id: "url", type: "Input", params: { value: this._url} }
    ];
}

ImageTool.prototype = Object.create(Tool.prototype);
ImageTool.prototype.constructor = ImageTool;

ImageTool.prototype._url = null;

ImageTool.prototype.MouseDown = function (x, y) {
} 

ImageTool.prototype.OptionChanged = function (option, value) {
    if (option == "url") {
        this._url = value.value;
    } 
}

ImageTool.prototype.MouseUp = function (x, y) {
    if (this.WhiteBoard == null || this.WhiteBoard.ActiveLayer == null || this._url == null)
        return;

    var widget = Create(this.WidgetFactory.BuildWidget("image"), {
        /*poligonul se va seta automat cand se incarca imaginea*/
        Polygon: Create(new Polygon(), {
            Position : {X : x, Y : y}
        }),
        Url: this._url,
        Name: "Image"      
    });

    widget.UpdateBounds();

    /*adaugam widget-ul in layer-ul activ*/
    this.WhiteBoard.ActiveLayer.PushWidget(widget);
    /*sincronizam cu servverul*/
    widget.Sync("add");

    /*schimbam selectia*/
    this.WhiteBoard.SetActiveWidget(widget);
} 
/*
---------------------------------------------------------------------------
--------------------------Brush Tool---------------------------------------
---------------------------------------------------------------------------
*/

var BrushTool = function (toolbox, whiteBoard, factory) {
    Tool.call(this, toolbox, whiteBoard, factory);

    this.Id = "brush";

    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_brush.png";
    /*optiunile*/
    this.Options = [
        { id: "width", type: "Input", params: { value: this._width} },
        { id: "color", type: "Color", params: { color: this._color} }
    ];
}

BrushTool.prototype = Object.create(Tool.prototype);
BrushTool.prototype.constructor = BrushTool;

BrushTool.prototype._width = 10;
BrushTool.prototype._color = "#000";
/*liniile ce vor fi folosite sa se recreeze brush-ul*/
BrushTool.prototype._lines = null;
BrushTool.prototype._lastX = 0;
BrushTool.prototype._lastY = 0;
/*centrul*/
BrushTool.prototype._originX = 0;
BrushTool.prototype._originY = 0;
/*coordonatele maxime si minime*/
BrushTool.prototype._minX = 0;
BrushTool.prototype._minY = 0;
BrushTool.prototype._maxX = 0;
BrushTool.prototype._maxY = 0;

BrushTool.prototype.MouseDown = function (x, y) {

    /*stergem lista de linii*/
    this._lines = [ {X : 0, Y : 0}];    
    /*puncrtul de origine*/
    this._originX = x;
    this._originY = y;
    /*sa recream liniile*/
    this._lastX = x;
    this._lastY = y;
    /*coordonatele maxime si minime*/
    this._minX = 0;
    this._minY = 0;
    this._minX = 0;
    this._minY = 0;
} 

BrushTool.prototype.OptionChanged = function (option, value) {
    if (option == "width") {
        this._width = parseInt(value.value);
    } else if(option == "color") {
        this._color = value.color;
    }
}

BrushTool.prototype.MouseUp = function (x, y) {
    if (this.WhiteBoard == null || this.WhiteBoard.ActiveLayer == null)
        return;

    var widget = Create(this.WidgetFactory.BuildWidget("brush"), {
        /*poligonul se va seta automat cand se incarca imaginea*/
        Polygon: Create(new Polygon(), {
            Position : {X : this._originX, Y : this._originY}
        }),
        Name: "Brush",
        Color: this._color ,
        Lines: this._lines ,
        Width: this._width ,
        MaxX: this._maxX,
        MaxY: this._maxY,
        MinX: this._minX,
        MinY: this._minY
    });

    widget.UpdateBounds();

    /*adaugam widget-ul in layer-ul activ*/
    this.WhiteBoard.ActiveLayer.PushWidget(widget);
    /*sincronizam cu servverul*/
    widget.Sync("add");

    /*schimbam selectia*/
    this.WhiteBoard.SetActiveWidget(widget);
}


BrushTool.prototype.Drag = function(x, y) {
    this._lines.push( {X : x - this._originX, Y : y -this._originY});    

    /*desenam si in cavas-ul principal*/
    this.WhiteBoard._context.lineCap = "round";
    this.WhiteBoard._context.lineJoin = "round";
    this.WhiteBoard._context.strokeStyle = this._color;
    this.WhiteBoard._context.lineWidth = this._width;
    this.WhiteBoard._context.beginPath();
    this.WhiteBoard._context.moveTo(this._lastX, this._lastY);
    this.WhiteBoard._context.lineTo(x, y);
    this.WhiteBoard._context.stroke();
    this.WhiteBoard._context.closePath();

    /*verificam coordonatele maixmale*/
    if(this._maxX < (x - this._originX)) this._maxX = (x - this._originX);
    if(this._maxY < (y - this._originY)) this._maxY = (y - this._originY);
    if(this._minX > (x - this._originX)) this._minX = (x - this._originX);
    if(this._minY > (y - this._originY)) this._minY = (y - this._originY);
    
    this._lastX = x;
    this._lastY = y;
}  
/*
---------------------------------------------------------------------------
------------------------Polygon Tool---------------------------------------
---------------------------------------------------------------------------
*/
 
PolygonTool.prototype = Object.create(Tool.prototype);
PolygonTool.prototype.constructor = PolygonTool;

PolygonTool.prototype.DefaultWidth = 100;
PolygonTool.prototype.DefaultHeight = 50;

PolygonTool.prototype._bgColor = null;
PolygonTool.prototype._fgColor = null;
PolygonTool.prototype._lineWidth = null;
/*widgetul curent in care adaugam punctele*/
PolygonTool.prototype._widget = null;

function PolygonTool(toolbox, whiteBoard, factory) {
    Tool.call(this, toolbox, whiteBoard, factory);    

    this.Id = "polygon";

    this._bgColor = "#FFF";
    this._fgColor = "#000";
    this._lineWidth = 1;

    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_polygon.png";
    /*optiunile*/
    this.Options = [
        { id: "fgColor", type: "Color", params: { color: this._fgColor} },
        { id: "bgColor", type: "Color", params: { color: this._bgColor} },
        { id: "lineWidth", type: "Input", params: { value : "1"}}
    ];
}


PolygonTool.prototype.OptionChanged = function (option, value) {
    if (option == "fgColor") {
        this._fgColor = value.color;
    } else if (option == "bgColor") {
        this._bgColor = value.color;
    } else if (option == "lineWidth") {
        this._lineWidth = parseInt(value.value); 
    }
}

PolygonTool.prototype.MouseUp = function (x, y) {
    if (this.WhiteBoard == null || this.WhiteBoard.ActiveLayer == null)
        return;

    if(this._widget == null) {
        var widget = Create(this.WidgetFactory.BuildWidget("polygon"), {
            Polygon: Create(new Polygon(), {
                _points: [],
                PivotX: 0,
                PivotY: 0,
                Position: Create(new Point(), {X : x, Y : y}),
            }),
            BgColor: this._bgColor,
            FgColor: this._fgColor,
            LineWidth: this._lineWidth,
            Name: "Polygon"
        });

        widget.UpdateBounds();

        /*adaugam widget-ul in layer-ul activ*/
        this.WhiteBoard.ActiveLayer.PushWidget(widget);
        /*schimbam selectia*/
        this.WhiteBoard.SetActiveWidget(widget);
        /*sincronizam cu servverul*/
        widget.Sync("add");

        this._widget = widget;
    }

    /*adaugam punctul curent in widget*/       
    this._widget.Polygon._points.push({X : x - this._widget.Polygon.Position.X, 
                                        Y : y - this._widget.Polygon.Position.Y});
    this._widget.Invalidate();
    this._widget.Sync();
} 

PolygonTool.prototype.Finish = function() {
    if (this.WhiteBoard == null || this.WhiteBoard.ActiveLayer == null)
        return;

    /*schimbam la toolul de selectie*/
    this._widget = null;
} 
/*
---------------------------------------------------------------------------
---------------------------Select Tool-------------------------------------
---------------------------------------------------------------------------
*/

var SelectTool = function (toolbox, whiteBoard, factory) {
    Tool.call(this, toolbox, whiteBoard, factory);

    this.Id = "select";

    /*setam imaginea ce va fi afisata in toolbox*/
    (this.Icon = new Image()).src = "/Images/icon_select.png";
    /*optiunile*/
    this.Options = [        
    ];
}

SelectTool.prototype = Object.create(Tool.prototype);
SelectTool.prototype.constructor = SelectTool;

SelectTool.prototype.Drag = function (fromX, fromY, toX, toY) {
    this.WhiteBoard.TransformWidget.Drag(fromX, fromY, toX, toY);
}

SelectTool.prototype.MouseDown = function (x, y) {
    var that = this;

    if(this.WhiteBoard.TransformWidget.MouseDown(x, y))
        return;

    /*cautam widgetul ce se intersecteaza cu punctul*/
    if(this.WhiteBoard.ActiveLayer == null)
        return;

    this.WhiteBoard.ActiveLayer.EachWidget(function(widget) {
        if(widget.Includes ({X : x, Y : y})) {
            /*schimbam selectia*/
            that.WhiteBoard.SetActiveWidget(widget);
        }
    });

} 

SelectTool.prototype.MouseUp = function(x, y){
    this.WhiteBoard.TransformWidget.MouseUp(x, y);   
}

SelectTool.prototype.KeyUp = function(e) {
    this.WhiteBoard.TransformWidget.KeyUp(e);
} 
SelectTool.prototype.KeyDown = function(e) {
    this.WhiteBoard.TransformWidget.KeyDown(e);
}                 