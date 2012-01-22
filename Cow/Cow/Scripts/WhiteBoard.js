
/*
---------------------------------------------------------------------------
--------------------------------Widgets------------------------------------
---------------------------------------------------------------------------
*/
var Widget = function (options) {
    this.EInvalidate = jQuery.Event("invalidate");
}
Widget.prototype.Id = 0;
Widget.prototype.Name = "Untitled";
Widget.prototype.EInvalidate = null;

Widget.prototype.Draw = function (context) {
    throw "Not implemented yet";
}

Widget.prototype.GetBounds = function () {
    throw "Not implemented yet";
}

Widget.prototype.Includes = function (point) {
    throw "Not implemeneted yet";
}

Widget.prototype.Invalidate = function () {
    $(this).trigger(this.EInvalidate);
}

Widget.prototype.UpdateBounds = function () {
} 


/*
---------------------------------------------------------------------------
-------------------------------Polygon Widget------------------------------
---------------------------------------------------------------------------
*/
var PolygonWidget = function (options) {
    Widget.call(this, options);

    this.Polygon = new Polygon();
}

PolygonWidget.prototype = Object.create(Widget.prototype);
PolygonWidget.prototype.constructor = PolygonWidget;

PolygonWidget.prototype.Polygon = null;
PolygonWidget.prototype.BgColor = "#555";
PolygonWidget.prototype.FgColor = "#AAA";
PolygonWidget.prototype.LineWidth = 2;

PolygonWidget.prototype.Draw = function (context) {
    context.beginPath();
    var first = true;
    var that = this;

    this.Polygon.Each(function (point) {
        if (first) {
            context.moveTo(that.Polygon.Position.X + point.X, that.Polygon.Position.Y + point.Y);
            first = false;
        } else {
            context.lineTo(that.Polygon.Position.X + point.X, that.Polygon.Position.Y + point.Y);
        }
    });

    context.closePath();
    context.fillStyle = this.BgColor;
    context.fill();
    context.strokeStyle = this.FgColor;
    context.lineWidth = this.LineWidth;
    context.stroke();
}

PolygonWidget.prototype.UpdateBounds = function () {
    
}

PolygonWidget.prototype.GetBounds = function () {
    return this.Polygon;
}

PolygonWidget.prototype.Includes = function (point) {
    return this.Polygon.Includes(point);
} 


/*
---------------------------------------------------------------------------
------------------------------Widget Factory-------------------------------
---------------------------------------------------------------------------
*/
var WidgetFactory = function (seed) {
    if (seed != null)
        this._seed = seed;
    else
        this._seed = 0;

    this._builders = {};
}

WidgetFactory.prototype._builders = null;
WidgetFactory.prototype._seed = 0;

WidgetFactory.prototype._GetUniqueId = function () {
    return (++this._seed);
}                         

WidgetFactory.prototype.AddBuilder = function (name, delegate) {
    this._builders[name] = delegate;
}

WidgetFactory.prototype.RemoveBuilder = function (name) {
    delete this._builders[name];
}

WidgetFactory.prototype.Build = function (name, options) {
    var ret = null;

    try {
        ret = this._builders[name](options);
    } catch (e) {
        ret = null;
    }

    ret.Id = this._GetUniqueId();
    return ret;
}

/*
---------------------------------------------------------------------------
------------------------------Layer----------------------------------------
---------------------------------------------------------------------------
*/

function Layer() {
    this._widgets = new Array();
    this._widgetTable = {};
    this.Name = "untitled";

    /*declaram evenimentele*/
    this.EWidgetAdd = jQuery.Event("widgetAdd");
    this.EWidgetRemove = jQuery.Event("widgetRemove");
    this.EInvalidate = jQuery.Event("invalidate");
}

Layer.prototype._widgets = null;
Layer.prototype._widgetTable = null;
Layer.prototype.Name = null; ;
Layer.prototype.Element = null;

Layer.prototype.EWidgetAdd = null;
Layer.prototype.EWidgetRemove = null;
Layer.prototype.EInvalidate = null;


Layer.prototype.PushWidget = function (widget) {
    var that = this;

    this._widgets.push(widget);
    this._widgetTable[widget.Id] = widget;

    $(widget).bind("invalidate", function (e) { that.InvalidateWidget(e.target); });

    /*setam informatiile evenimentelor*/
    this.EWidgetAdd.widget = widget;

    $(this).trigger(this.EWidgetAdd);
    $(this).trigger(this.EInvalidate);
}

Layer.prototype.InvalidateWidget = function (widget) {
    this.EInvalidate.widget = widget;
    $(this).trigger(this.EInvalidate);
}

Layer.prototype.RemoveWidget = function (widgetId) {
    try {
        var widget = this._widgetTable[widgetId];

        if (widget == null)
            throw "widget not found + " + widgetId;

        delete this._widgetTable[widgetId];
        for (var i = 0; i < this._widgets.length; i++) {
            if (this._widgets[i] == widget) {
                this._widgets.splice(i, 1);
                return;
            }
        }

        /*setam informatiile evenimentelor*/
        this.EWidgetRemove.widget = widget;

        $(this).trigger(this.EWidgetRemove);
        $(this).trigger(this.EInvalidate);
    } catch (e) {
        console.log(e.toString());
    }
}

Layer.prototype.SwitchWidget = function (from, to) {
    if (from < 0 || from >= this._widgets.length || to < 0 || to >= this._widgets.length)
        return;

    var aux = this._widgets[from];
    this._widgets[from] = this._widgets[to];
    this._widgets[to] = aux;
}

Layer.prototype.GetWidgetPosition = function (widgetId) {
    for (var i = 0; i < this._widgets.length; i++) {
        if (this._widgets[i].Id == widgetId)
            return i;
    }

    return -1;
}

Layer.prototype.EachWidget = function (fct) {
    for (var w in this._widgets) {
        fct(this._widgets[w], w);
    }
} 

Layer.prototype.Draw = function (context) {
    for (var w in this._widgets) {
        this._widgets[w].Draw(context);
    }
}       

Layer.prototype.toString = function () {
    return this.Name;
} 
/*
---------------------------------------------------------------------------
------------------------------Layers Factory-------------------------------
---------------------------------------------------------------------------
*/
var LayerFactory = function (seed) {
    if (seed != null)
        this._seed = seed;
    else
        this._seed = 0;
}

LayerFactory.prototype._seed = 0;

LayerFactory.prototype._GetUniqueId = function () {
    return (++this._seed);
}

LayerFactory.prototype.Build = function (name) {
    var ret = new Layer();
    ret.Id = this._GetUniqueId();
    ret.Name = name;

    return ret;
}

/*
---------------------------------------------------------------------------
----------------------Transform Widget-------------------------------------
---------------------------------------------------------------------------
*/

var TransformWidget = function () {
}

/*widgetul afectat*/
TransformWidget.prototype._widget = null;
/*unghiul al rotatiei curente*/
TransformWidget.prototype._currentAngle = Math.PI / 4;
/*transformarea curenta - este activata cand se incepe drag-ul si resetata cand se ridica mousul*/
/*daca transformarea este peste 10 inseamna ca se misca un punct*/
TransformWidget.prototype._currentTransform = -1;

TransformWidget.prototype.UpdateWidget = function (widget) {
    this._widget = widget;
}

TransformWidget.prototype.MouseDown = function (x, y) {
    if (this._widget == null)
        return;
}

TransformWidget.prototype.MouseUp = function (x, y) {
    if (this._widget == null)
        return;

    this._currentTransform = -1;
    this._currentAngle = Math.PI / 4;
    this._widget.Invalidate();
}

TransformWidget.prototype.Drag = function (fromX, fromY, toX, toY) {
    if (this._widget == null)
        return;

    if (this._currentTransform == -1)
        this._DetectTransform(fromX, fromY);

    var that = this; var ignore = false;

    /*intai verificam daca se misca vre-un punct din poligon*/
    if (this._currentTransform >= 10) {
        that._widget.GetBounds()._points[this._currentTransform - 10].X += (toX - fromX);
        that._widget.GetBounds()._points[this._currentTransform - 10].Y += (toY - fromY);
        that._widget.UpdateBounds();

        /*verificam daca rotim polygonul*/
    } else if (this._currentTransform == 2) {
        var pivotX = that._widget.GetBounds().Position.X + that._widget.GetBounds().PivotX;
        var pivotY = that._widget.GetBounds().Position.Y + that._widget.GetBounds().PivotY;

        var angle = Math.atan2(pivotY - toY, pivotX - toX) - Math.atan2(pivotY - fromY, pivotX - fromX);

        var x = pivotX + (that._widget.GetBounds().Position.X - pivotX) * Math.cos(angle) -
                (that._widget.GetBounds().Position.Y - pivotY) * Math.sin(angle) -
                that._widget.GetBounds().Position.X;
        var y = pivotY + (that._widget.GetBounds().Position.X - pivotX) * Math.sin(angle) +
                (that._widget.GetBounds().Position.Y - pivotY) * Math.cos(angle) -
                that._widget.GetBounds().Position.Y;

        this._currentAngle += angle;
        /*rotim punctele din poligon*/
        that._widget.GetBounds().Rotate(angle);
        /*rotim si centrul poligonului*/
        that._widget.GetBounds().PivotX -= x;
        that._widget.GetBounds().PivotY -= y;
        that._widget.GetBounds().Translate({ X: -x, Y: -y });
        that._widget.GetBounds().Position.X += x;
        that._widget.GetBounds().Position.Y += y;
        

        that._widget.UpdateBounds();

        /*verificam daca miscam pivotul*/
    } else if (this._currentTransform == 3) {

        that._widget.GetBounds().PivotX = toX - that._widget.GetBounds().Position.X;
        that._widget.GetBounds().PivotY = toY - that._widget.GetBounds().Position.Y;
        that._widget.UpdateBounds();

        /*verificam daca intersectam centrul poligonului*/
    } else if (this._currentTransform == 4) {

        that._widget.GetBounds().Position.X += toX - fromX;
        that._widget.GetBounds().Position.Y += toY - fromY;
        that._widget.UpdateBounds();
    }

    this._widget.Invalidate();
}

TransformWidget.prototype._DetectTransform = function (x, y) {
    var that = this;
    var rotateX = that._widget.GetBounds().Position.X + that._widget.GetBounds().PivotX + 100 * Math.cos(this._currentAngle);
    var rotateY = that._widget.GetBounds().Position.Y + that._widget.GetBounds().PivotY + 100 * Math.sin(this._currentAngle);

    /*intai verificam daca se misca vre-un punct din poligon*/
    this._widget.GetBounds().Each(function (point, index) {
        if (((x - (point.X + that._widget.GetBounds().Position.X)) * (x - (point.X + that._widget.GetBounds().Position.X))
            + (y - (point.Y + that._widget.GetBounds().Position.Y)) * (y - (point.Y + that._widget.GetBounds().Position.Y))) < 100) {
            that._currentTransform = 10 + parseInt(index);
        }
    });

    /*verificam daca rotim polygonul*/
    if (this._currentTransform == -1 && ((x - rotateX) * (x - rotateX) + (y - rotateY) * (y - rotateY)) < 100) {
        that._currentTransform = 2;
    }

    /*verificam daca miscam pivotul*/
    if (this._currentTransform == -1 &&
            ((x - (that._widget.GetBounds().PivotX + that._widget.GetBounds().Position.X)) *
            (x - (that._widget.GetBounds().PivotX + that._widget.GetBounds().Position.X))
            + (y - (that._widget.GetBounds().PivotY + that._widget.GetBounds().Position.Y)) *
            (y - (that._widget.GetBounds().PivotY + that._widget.GetBounds().Position.Y)))
            < 100) {
        that._currentTransform = 3;
    }

    /*verificam daca intersectam centrul poligonului*/
    if (this._currentTransform == -1 &&
            ((x - that._widget.GetBounds().Position.X) * (x - that._widget.GetBounds().Position.X)
            + (y - that._widget.GetBounds().Position.Y) * (y - that._widget.GetBounds().Position.Y)) < 400) {               
        that._currentTransform = 4;
    }

    this._widget.Invalidate();
} 

TransformWidget.prototype.Draw = function (context) {
    if (this._widget == null)
        return;

    var that = this;
    var pivotX =  that._widget.GetBounds().Position.X + that._widget.GetBounds().PivotX;
    var pivotY =  that._widget.GetBounds().Position.Y + that._widget.GetBounds().PivotY;

    /*desenam centrul poligonului*/
    context.fillStyle = "#AAD";
    context.beginPath();
    context.arc(that._widget.GetBounds().Position.X,
                that._widget.GetBounds().Position.Y, 20, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    /*desenam pivotul*/
    context.lineWidth = 3;
    context.strokeStyle = "#555";
    context.beginPath();
    context.moveTo(pivotX, pivotY);
    context.lineTo(pivotX + 100 * Math.cos(this._currentAngle), pivotY + 100 * Math.sin(this._currentAngle));
    context.closePath();
    context.stroke();

    context.fillStyle = "#DAA";
    context.beginPath();
    context.arc(pivotX, pivotY, 10, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    context.fillStyle = "#DDA";
    context.beginPath();
    context.arc(pivotX + 100 * Math.cos(this._currentAngle), pivotY + 100 * Math.sin(this._currentAngle), 10, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    /*desenam cerculetele*/
    context.fillStyle = "#ADA";

    this._widget.GetBounds().Each(function (point) {
        context.beginPath();
        context.arc(that._widget.GetBounds().Position.X + point.X,
                     that._widget.GetBounds().Position.Y + point.Y, 10, 0, 2 * Math.PI);
        context.closePath();

        context.fill();
    });
} 
                                     

/*
---------------------------------------------------------------------------
----------------------White Board------------------------------------------
---------------------------------------------------------------------------
*/

var WhiteBoard = function (toolbox, canvas) {
    if (toolbox == null)
        throw "Toolbox cannot be null";
    if (canvas == null)
        throw "Canvas cannot be null";

    this._canvas = canvas;
    this._context = canvas.getContext("2d");
    this._toolBox = toolbox;

    var that = this;

    /*setam evenimentele pentru mouse*/
    $(canvas).mousedown(function (e) {
        that.MouseDown(e.offsetX, e.offsetY);
    });
    $(canvas).mouseup(function (e) {
        that.MouseUp(e.offsetX, e.offsetY);
    });
    $(canvas).mousemove(function (e) {
        that.MouseMove(e.offsetX, e.offsetY);
    });

    /*cream containerele pentru layers*/
    this._layers = new Array();
    this._layersTable = {};

    /*widgetul ce transforma un alt widget*/
    this.TransformWidget = new TransformWidget();
    /*initial mouse-ul nu este apasat*/
    this._mouseDown = false;
    /*daca ignoram click-ul (daca a fost preluat de drag)*/
    this._ignoreMouseUp = false;

    /*cream evenimentele*/
    this.ELayerAdd = jQuery.Event("layerAdd");
    this.ELayerRemove = jQuery.Event("layerRemove");
}

WhiteBoard.prototype._layers = null; ;
WhiteBoard.prototype._layersTable = null;
WhiteBoard.prototype._toolBox = null;
WhiteBoard.prototype._canvas = null;
WhiteBoard.prototype._context = null;

WhiteBoard.prototype.TransformWidget = null;
WhiteBoard.prototype._mouseDown = false;
WhiteBoard.prototype._ignoreMouseUp = false;
WhiteBoard.prototype._startX = 0;
WhiteBoard.prototype._startY = 0;

WhiteBoard.prototype.ActiveLayer = null;
WhiteBoard.prototype.ActiveWidget = null;

WhiteBoard.prototype.ELayerAdd = null;
WhiteBoard.prototype.ELayerRemove = null;

/*adauga un nou start*/
WhiteBoard.prototype.PushLayer = function (layer) {
    var that = this;

    this._layers.push(layer);
    this._layersTable[layer.Id] = layer;
    $(layer).bind("invalidate", function (e) { that.InvalidateLayer(e.target); });

    /*trimitem evenimentul mai dparte*/
    this.ELayerAdd.layer = layer;  
    $(this).trigger(this.ELayerAdd);
}

/*apelata cand un start trebuie redesenat*/
WhiteBoard.prototype.InvalidateLayer = function (layer) {
    this.Draw();
}

/*scoate un strat*/
WhiteBoard.prototype.RemoveLayer = function (layerId) {
    try {
        var layer = this._layersTable[layerId];

        delete this._layersTable[layerId];
        for (var i = 0; i < this._layers.length; i++) {
            if (this._layers[i] == layer) {
                this._layers.splice(i, 1);
                return;
            }
        }

        /*trimitem evenimentul mai dparte*/
        this.ELayerRemove.layer = layer;

        $(this).trigger(this.ELayerRemove);
    } catch (e) {
        console.log(e.toString());
    }
}

WhiteBoard.prototype.SwitchLayers = function (from, to) {
    if (from < 0 || from >= this._layers.length || to < 0 || to >= this._layers.length)
        return;

    var aux = this._layers[from];
    this._layers[from] = this._layers[to];
    this._layers[to] = aux;

    /*doar redesenam, nu si invalidam*/
    this.Draw();
}

WhiteBoard.prototype.SetActiveWidget = function (widget) {
    this.ActiveWidget = widget;

    if (widget != null)
        this.TransformWidget.UpdateWidget(widget);
    else
        this.TransformWidget.UpdateWidget(null);

    this.Draw();
} 

WhiteBoard.prototype.GetLayerPosition = function (layerId) {
    for (var i = 0; i < this._layers.length; i++) {
        if (this._layers[i].Id == layerId)
            return i;
    }

    return -1;
}

WhiteBoard.prototype.MouseUp = function (x, y) {
    if (this._toolBox._currentTool != null) {
        this._toolBox._currentTool.MouseUp(x, y);
    }

    this._mouseDown = false;
}

WhiteBoard.prototype.MouseDown = function (x, y) {
    if (this._toolBox._currentTool != null) {
        this._toolBox._currentTool.MouseDown(x, y);
    }

    this._ignoreMouseUp = false;
    /*sa spunem ca a inceput drag-ul*/
    this._mouseDown = true;

    /*resetam pozitia de inceput al drag-ului, daca v-a exista*/
    this._startX = x;
    this._startY = y;
}

WhiteBoard.prototype.MouseMove = function (x, y) {
    this._ignoreMouseUp = true;
    if (this._mouseDown) {
        this._toolBox._currentTool.Drag(this._startX, this._startY, x, y);

        this._startX = x;
        this._startY = y;
    }
}

WhiteBoard.prototype.Draw = function () {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    for (var l in this._layers) {
        this._layers[l].Draw(this._context);
    }

    this.TransformWidget.Draw(this._context);    
}       
