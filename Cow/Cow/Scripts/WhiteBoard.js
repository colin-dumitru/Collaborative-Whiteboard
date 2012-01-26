
/*
---------------------------------------------------------------------------
--------------------------------Widgets------------------------------------
---------------------------------------------------------------------------
*/
var Widget = function (options) {
    this.EInvalidate = jQuery.Event("invalidate");
    this.ESync = jQuery.Event("sync");
}
Widget.prototype.Id = 0;
Widget.prototype.Name = "Untitled";
Widget.prototype.Parent = null;
Widget.prototype.Order = null;

Widget.prototype.EInvalidate = null;
Widget.prototype.ESync = null;

Widget.prototype.AllowTransform = true;
Widget.prototype.AllowRotate = true;
Widget.prototype.AllowBool = false;

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

Widget.prototype.Serialize = function () {
    throw "not implemented yet";
}

Widget.prototype.Deserialize = function (obj) {
    throw "not implemented yer";
} 

Widget.prototype.Sync = function (operation) {
    if (operation == null)
        this.ESync.operation = "change";
    else
        this.ESync.operation = operation;
    $(this).trigger(this.ESync);
}

Widget.prototype.KeyDown = function (e) {
} 


/*
---------------------------------------------------------------------------
-------------------------------Polygon Widget------------------------------
---------------------------------------------------------------------------
*/
var PolygonWidget = function (options) {
    Widget.call(this, options);

    /*cream un nou poligon gol*/
    this.Polygon = new Polygon();
    /*permitem operatiile boolene*/
    this.AllowBool = true;
}

PolygonWidget.prototype = Object.create(Widget.prototype);
PolygonWidget.prototype.constructor = PolygonWidget;

PolygonWidget.prototype.Polygon = null;
PolygonWidget.prototype.BgColor = "#555";
PolygonWidget.prototype.FgColor = "#AAA";
PolygonWidget.prototype.LineWidth = 2;
PolygonWidget.prototype.Type = null;

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

    context.lineCap = "round";
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

PolygonWidget.prototype.Serialize = function () {
    return ret = {
        Polygon : this.Polygon,
        BgColor : this.BgColor,
        FgColor : this.FgColor,
        LineWidth : this.LineWidth,
        Type : this.Type,
        Name: this.Name != null ? this.Name : "Undefined"
    }
}

PolygonWidget.prototype.Deserialize = function (obj) {
    this.BgColor = obj.BgColor;
    this.FgColor = obj.FgColor;
    this.LineWidth = obj.LineWidth;
    this.Polygon = Create(new Polygon(), obj.Polygon);
    this.Name = obj.Name;
}
/*
---------------------------------------------------------------------------
--------------------------------Circle Widget------------------------------
---------------------------------------------------------------------------
*/
var CircleWidget = function (options) {
    Widget.call(this, options);

    /*cream un nou poligon gol*/
    this.Polygon = new Polygon();
    /*permitem operatiile boolene*/
    this.AllowBool = false;
}

CircleWidget.prototype = Object.create(Widget.prototype);
CircleWidget.prototype.constructor = CircleWidget;

CircleWidget.prototype.Polygon = null;
CircleWidget.prototype.BgColor = "#555";
CircleWidget.prototype.FgColor = "#AAA";
CircleWidget.prototype.LineWidth = 2;
CircleWidget.prototype.Type = null;

CircleWidget.prototype.Draw = function (context) {
    context.beginPath();
    var first = true;
    var that = this;


    this.Polygon.Each(function (point) {
        if (first) {
            var radius = Math.sqrt(point.X * point.X +  point.Y * point.Y);
            context.arc(that.Polygon.Position.X, that.Polygon.Position.Y, radius, 0, Math.PI * 2, true);
            first = false;
        }
    });

    context.lineCap = "round";
    context.closePath();
    context.fillStyle = this.BgColor;
    context.fill();
    context.strokeStyle = this.FgColor;
    context.lineWidth = this.LineWidth;
    context.stroke();
}

CircleWidget.prototype.UpdateBounds = function () {
}

CircleWidget.prototype.GetBounds = function () {
    return this.Polygon;
}

CircleWidget.prototype.Includes = function (point) {
    var that = this; var ret = false;

    this.Polygon.Each(function (p) {
        var radius = Math.sqrt(p.X * p.X + p.Y * p.Y);

        ret = (((point.X - that.Polygon.Position.X) * (point.X - that.Polygon.Position.X) +
                (point.Y - that.Polygon.Position.Y) * (point.Y - that.Polygon.Position.Y)) < (radius * radius));
    });
    return ret;
}

CircleWidget.prototype.Serialize = function () {
    return ret = {
        Polygon: this.Polygon,
        BgColor: this.BgColor,
        FgColor: this.FgColor,
        LineWidth: this.LineWidth,
        Type: this.Type,
        Name: this.Name != null ? this.Name : "Undefined"
    }
}

CircleWidget.prototype.Deserialize = function (obj) {
    this.BgColor = obj.BgColor;
    this.FgColor = obj.FgColor;
    this.LineWidth = obj.LineWidth;
    this.Polygon = Create(new Polygon(), obj.Polygon);
    this.Name = obj.Name;
}
/*
---------------------------------------------------------------------------
----------------------------------Text Widget------------------------------
---------------------------------------------------------------------------
*/
var TextWidget = function (options, element, canvas) {
    Widget.call(this, options);
    this.Polygon = new Polygon();

    this.AllowTransform = false;
    this.AllowRotate = false;

    /*cream elementul de input*/
    this._element = element;
    this._canvas = canvas;
}

TextWidget.prototype = Object.create(Widget.prototype);
TextWidget.prototype.constructor = PolygonWidget;

TextWidget.prototype.Polygon = null;
TextWidget.prototype.Color = "#555";
TextWidget.prototype.Size = 10;
TextWidget.prototype.Font = "Arial";
TextWidget.prototype.Type = null;
TextWidget.prototype.Text = "Text";
TextWidget.prototype._width = -1;
TextWidget.prototype._height = -1;
TextWidget.prototype._element = null;
TextWidget.prototype._canvas = null;

TextWidget.prototype.Draw = function (context) {
    context.font = this.Size + "px " + this.Font.toLowerCase();

    /*ne calculam dimensiunile la prima desenare*/
    if (this._width == -1 || this._height == -1) {
        var res = context.measureText(this.Text);
        this._width = res.width;
        this._height = this.Size;
    }

    /*dsenam textul*/
    context.textBaseline = "top";
    context.fillStyle = this.Color;
    context.fillText(this.Text, this.Polygon.Position.X, this.Polygon.Position.Y);
}

TextWidget.prototype.UpdateBounds = function () {
}

TextWidget.prototype.GetBounds = function () {
    return this.Polygon;
}

TextWidget.prototype.Includes = function (point) {
    if (point.X >= this.Polygon.Position.X && point.X <= (this.Polygon.Position.X + this._width) &&
        point.Y >= this.Polygon.Position.Y && point.Y <= (this.Polygon.Position.Y + this._height))
        return true;

    return false;
}

TextWidget.prototype.Serialize = function () {
    return ret = {
        Text : this.Text,
        Type : this.Type,
        Color: this.Color,
        Polygon: this.Polygon,
        Size: this.Size,
        Font: this.Font,
        Name: this.Name != null ? this.Name : "Undefined"
    }
}

TextWidget.prototype.Deserialize = function (obj) {
    this.Text = obj.Text;
    this.Type = obj.Type;
    this.Color = obj.Color;
    this.Polygon = Create(new Polygon(), obj.Polygon);
    this.Size = obj.Size;
    this.Font = obj.Font;
}

TextWidget.prototype.KeyUp = function (e) {
}

TextWidget.prototype.KeyDown = function (e) {
    if (e == 13) {
        this._ShowElement(this.Polygon.Position.X, this.Polygon.Position.Y);
    }
}

TextWidget.prototype._ShowElement = function (x, y) {
    var that = this;

    /*setam textul intial*/
    $(this._element).find("#text").val(this.Text);
    this._element.style.left = (this._canvas.offsetLeft + x).toString() + "px";
    this._element.style.top = (this._canvas.offsetTop + y).toString() + "px";

    $(this._element).show("slow");

    $(this._element).find("#done").click(function () {
        that._HideElement();
    });
}

TextWidget.prototype._HideElement = function (x, y) {
    this.Text = $(this._element).find("#text").val();
    this.Invalidate();
    this.Sync();
    $(this._element).hide("slow");
}


/*
---------------------------------------------------------------------------
----------------------------------Image Widget------------------------------
---------------------------------------------------------------------------
*/
var ImageWidget = function (options) {
    Widget.call(this, options);
    this.Polygon = new Polygon();

    this.AllowTransform = true;
    this.AllowRotate = false;
}

ImageWidget.prototype = Object.create(Widget.prototype);
ImageWidget.prototype.constructor = ImageWidget;

ImageWidget.prototype.Polygon = null;
ImageWidget.prototype.Url = null;
ImageWidget.prototype._width = -1;
ImageWidget.prototype._height = -1;
ImageWidget.prototype._image = null;

ImageWidget.prototype.Draw = function (context) {
    /*ne calculam dimensiunile la prima desenare*/
    if (this._width == -1 || this._height == -1) {
        this.UpdateBounds();
    }

    /*dsenam textul*/
    context.drawImage(this._image, this.Polygon.Position.X, this.Polygon.Position.Y, this._width, this._height);
}

ImageWidget.prototype.UpdateBounds = function () {
    if (this.Polygon == null)
        return;

    var that = this;

    this.Polygon.Each(function (point) {
        /*ar trebui sa fie un singur punct ce dicteaza dimensiunile imaginii*/
        that._width = point.X;
        that._height = point.Y;
    });

    /*cream imaginea cu poligonul specificat*/
    if (this._image == null) {
        this._image = new Image();
        this._image.onload = function () {
            if (that.Polygon._points.length == 0) {
                /*facem update la bounds*/
                that.Polygon._points = [{ X: that._image.width, Y: that._image.height}];
                that.UpdateBounds();
            }

            that.Invalidate();
        }
        this._image.src = this.Url;
    }
}

ImageWidget.prototype.GetBounds = function () {
    return this.Polygon;
}

ImageWidget.prototype.Includes = function (point) {
    if (point.X >= this.Polygon.Position.X && point.X <= (this.Polygon.Position.X + this._width) &&
        point.Y >= this.Polygon.Position.Y && point.Y <= (this.Polygon.Position.Y + this._height))
        return true;

    return false;
}

ImageWidget.prototype.Serialize = function () {
    return ret = {
        Url: this.Url,
        Polygon: this.Polygon,
        Name: this.Name != null ? this.Name : "Undefined"
    }
}

ImageWidget.prototype.Deserialize = function (obj) {
    this.Url = obj.Url;
    this.Polygon = Create(new Polygon(), obj.Polygon);
    this.Name = obj.Name;
}

ImageWidget.prototype.KeyUp = function (e) {

}

ImageWidget.prototype.KeyDown = function (e) {
}
/*
---------------------------------------------------------------------------
-----------------------------PixelData Widget------------------------------
---------------------------------------------------------------------------
*/
var BrushWidget = function (options) {
    Widget.call(this, options);
    this.Polygon = new Polygon();

    this.AllowTransform = false;
    this.AllowRotate = false;
}

BrushWidget.prototype = Object.create(Widget.prototype);
BrushWidget.prototype.constructor = BrushWidget;

BrushWidget.prototype.Polygon = null;
/*liniile ce sunt folosite sa recream brush-ul*/
BrushWidget.prototype.Lines = null;
/*imaginea cache*/
BrushWidget.prototype.Image = null;
/*bounds-ul*/
BrushWidget.prototype.MinX = 0;
BrushWidget.prototype.MinY = 0;
BrushWidget.prototype.MaxX = 0;
BrushWidget.prototype.MaxY = 0;

BrushWidget.prototype.Draw = function (context) {
    /*cream imaginea daca nu exista*/
    if (this.Image == null)
        this.UpdateBounds();
    /*desenam textul*/
    context.drawImage(this.Image, this.Polygon.Position.X - Math.abs(this.MinX) - this.Width,
                     this.Polygon.Position.Y - Math.abs(this.MinY) - this.Width);
}

BrushWidget.prototype.UpdateBounds = function () {
    if (this.Image == null) {
        var that = this;

        /*cream un canvas temporar in care desenam pixelii*/
        var canvas = document.createElement("canvas");
        canvas.width = this.MaxX - this.MinX + 2 * this.Width;
        canvas.height = this.MaxY - this.MinY + 2 * this.Width;

        var context = canvas.getContext("2d");
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = this.Width;
        context.strokeStyle = this.Color;

        /*desenam liniile*/
        context.moveTo(this.Lines[0].X + Math.abs(this.MinX) + this.Width,
             this.Lines[0].Y + Math.abs(this.MinY) + this.Width);

        context.fillStyle = "#000";
        context.beginPath();
        for (var l in this.Lines) {
            context.lineTo(this.Lines[l].X + Math.abs(this.MinX) + this.Width,
                this.Lines[l].Y + Math.abs(this.MinY) + this.Width);
        }
        context.stroke();

        this.Image = new Image();
        this.Image.src = canvas.toDataURL("image/png");
        this.Image.onload = function () {
            that.Invalidate();
        }
    }
}

BrushWidget.prototype.GetBounds = function () {
    return this.Polygon;
}

BrushWidget.prototype.Includes = function (point) {
    if (point.X >= (this.Polygon.Position.X + this.MinX - this.Width) &&
        point.X <= (this.Polygon.Position.X + this.MaxX + 2 * this.Width) &&
        point.Y >= (this.Polygon.Position.Y + this.MinY - this.Width) && 
        point.Y <= (this.Polygon.Position.Y + this.MaxY + 2 * this.Width))
        return true;

    return false;
}

BrushWidget.prototype.Serialize = function () {
    return ret = {
        Polygon: this.Polygon,
        Name: this.Name != null ? this.Name : "Undefined",
        Lines : this.Lines,
        Color: this.Color,
        Width: this.Width,
        MinX: this.MinX,
        MinY: this.MinY,
        MaxX: this.MaxX,
        MaxY: this.MaxY
    }
}

BrushWidget.prototype.Deserialize = function (obj) {
    this.Polygon = Create(new Polygon(), obj.Polygon);
    this.Name = obj.Name;
    this.Lines = obj.Lines
    this.Color = obj.Color;
    this.Width = obj.Width;
    this.MinX = obj.MinX;
    this.MinY = obj.MinY;
    this.MaxX = obj.MaxX;
    this.MaxY = obj.MaxY;
}

BrushWidget.prototype.KeyUp = function (e) {

}

BrushWidget.prototype.KeyDown = function (e) {
} 



/*
---------------------------------------------------------------------------
------------------------------------ Factory-------------------------------
---------------------------------------------------------------------------
*/
var Factory = function () {
    this._builders = {};
    this._ids = new Array();
}

/*lista de builders ce creaza widget-uri*/
Factory.prototype._builders = null;
/*o lista de id-uri unice pe care le putem folosi*/
Factory.prototype._ids = null;

Factory.prototype._GetUniqueId = function () {
    /*verificam daca mai sunt id-uri in lista noastra*/
    if (this._ids.length <= 0) {
        var that = this;

        /*daca nu, trebuie sa facem o noua cerere la server*/
        $.ajax({
            url: "/WhiteBoard/Reserve",
            /*rezervam 1000 de id-uri unice*/
            data: { Count: 1000, Id : document.BoardId },
            dataType: "json",
            async: false,
            type: "post",
            success: function (data) {
                for (var id in data.Ids) {
                    that._ids.push(data.Ids[id]);
                }
            }
        });
    }

    return this._ids.pop();
}

Factory.prototype.AddBuilder = function (name, delegate) {
    this._builders[name] = delegate;
}

Factory.prototype.RemoveBuilder = function (name) {
    delete this._builders[name];
}

Factory.prototype.BuildWidget = function (name, options, id) {
    var ret = null;

    try {
        ret = this._builders[name](options);
    } catch (e) {
        ret = null;
    }

    ret.Type = name;
    if (id == null)
        ret.Id = this._GetUniqueId();
    else
        ret.Id = id;
    return ret;
}

Factory.prototype.BuildLayer = function (name, id) {
    var ret = new Layer();
    if (id == null)
        ret.Id = this._GetUniqueId();
    else
        ret.Id = id;
    if (name == null)
        ret.Name = "Untitled";
    else
        ret.Name = name;

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
    this.ESync = jQuery.Event("sync");
}

Layer.prototype._widgets = null;
Layer.prototype._widgetTable = null;
Layer.prototype.Name = null; ;
Layer.prototype.Element = null;
Layer.prototype.Order = null;
Layer.prototype.WidgetFactory = null;

Layer.prototype.EWidgetAdd = null;
Layer.prototype.EWidgetRemove = null;
Layer.prototype.EInvalidate = null;
Layer.prototype.ESync = null;

Layer.prototype.PushWidget = function (widget) {
    var that = this;

    this._widgets.push(widget);
    this._widgetTable[widget.Id] = widget;

    widget.Parent = this;
    widget.Order = this._widgets.length - 1;

    $(widget).bind("invalidate", function (e) { that.InvalidateWidget(e.target); });

    /*setam informatiile evenimentelor*/
    this.EWidgetAdd.widget = widget;

    $(this).trigger(this.EWidgetAdd);
    $(this).trigger(this.EInvalidate);
}

Layer.prototype.InsertWidget = function (widget) {
    var that = this;

    this._widgets.splice(widget.Order, 0, widget);
    /*facem update la order-ul celorlate widgeturi*/
    for (var i = widget.Order + 1; i < this._widgets.length; i++) {
        this._widgets[i].Oder = i;
    }

    this._widgetTable[widget.Id] = widget;

    widget.Parent = this;

    $(widget).bind("invalidate", function (e) { that.InvalidateWidget(e.target); });

    /*setam informatiile evenimentelor*/
    this.EWidgetAdd.widget = widget;

    $(this).trigger(this.EWidgetAdd);
    $(this).trigger(this.EInvalidate);
}

Layer.prototype.GetWidget = function (id) {
    return this._widgetTable[id];
}

Layer.prototype.Invalidate = function () {
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
            return;

        /*scoatem widgetul din table*/
        delete this._widgetTable[widgetId];
        var i = 0;
        /*si din lista ordonata*/
        for (; i < this._widgets.length; i++) {
            if (this._widgets[i] == widget) {
                this._widgets.splice(i, 1);
                break;
            }
        }
        /*facem update la order-ul celorlate widgeturi*/
        for (; i < this._widgets.length; i++) {
            this._widgets[i].Oder = i;
        }

        /*setam informatiile evenimentelor*/
        this.EWidgetRemove.widget = widget;

        /*anuntam observii ce s-a sters un wiget si ca trebuie trebuie sa ne redesenam*/
        $(this).trigger(this.EWidgetRemove);
        $(this).trigger(this.EInvalidate);
    } catch (e) {
        console.log(e.toString());
    } 
}

Layer.prototype.SwitchWidgets = function (from, to) {
    if (from < 0 || from >= this._widgets.length || to < 0 || to >= this._widgets.length)
        return;

    /*schimbam cele 2 widget-uri*/
    var aux = this._widgets[from];
    this._widgets[from] = this._widgets[to];
    this._widgets[to] = aux;

    this._widgets[to].Order = to;
    this._widgets[from].Order = from;
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
    for (var i = (this._widgets.length - 1); i >= 0 ; i--) {
        this._widgets[i].Draw(context);
    }
}       

Layer.prototype.toString = function () {
    return this.Name;
}

Layer.prototype.Sync = function (operation) {
    if (operation == null)
        this.ESync.operation = "change";
    else
        this.ESync.operation = operation;
    $(this).trigger(this.ESync);
}

Layer.prototype.Serialize = function () {
    /*informatiile generale*/
    var ret = {
        Name: this.Name,
        Widgets: new Array()
    };

    for (var w in this._widgets) {
        ret.Widgets.push(this._widgets[w].Serialize());
    }

    return ret;
}

Layer.prototype.Deserialize = function (obj) {
    this.Name = obj.Name;
    this._widgets = new Array();
    this._widgetTable = {};

    /*iteram prin toate widget-urile si le desrializam*/
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
    /*detectam ce fel transformare aplicam widget-ului*/
    this._DetectTransform(x, y);
    return (this._currentTransform != -1);

}

TransformWidget.prototype.MouseUp = function (x, y) {
    if (this._widget == null)
        return;

    this._currentTransform = -1;
    this._currentAngle = Math.PI / 4;
    this._widget.Invalidate();
    /*sincronizam cu serverul*/
    this._widget.Sync();
}

TransformWidget.prototype.KeyUp = function (e) {
    if (this._widget == null)
        return;

    this._widget.KeyUp(e);
}

TransformWidget.prototype.KeyDown = function (e) {
    if (this._widget == null)
        return;

    this._widget.KeyDown(e);
}

TransformWidget.prototype.Drag = function (fromX, fromY, toX, toY) {
    if (this._widget == null)
        return;

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

    if (this._widget.AllowTransform) {
        /*intai verificam daca se misca vre-un punct din poligon*/
        this._widget.GetBounds().Each(function (point, index) {
            if (((x - (point.X + that._widget.GetBounds().Position.X)) * (x - (point.X + that._widget.GetBounds().Position.X))
            + (y - (point.Y + that._widget.GetBounds().Position.Y)) * (y - (point.Y + that._widget.GetBounds().Position.Y))) < 100) {
                that._currentTransform = 10 + parseInt(index);
            }
        });
    }

    if (this._widget.AllowRotate) {

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

    context.globalAlpha = 0.7;

    var that = this;
    var pivotX = that._widget.GetBounds().Position.X + that._widget.GetBounds().PivotX;
    var pivotY = that._widget.GetBounds().Position.Y + that._widget.GetBounds().PivotY;

    /*desenam centrul poligonului*/
    context.fillStyle = "#AAD";
    context.beginPath();
    context.arc(that._widget.GetBounds().Position.X,
                that._widget.GetBounds().Position.Y, 20, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    if (this._widget.AllowRotate) {
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
    }

    if (this._widget.AllowTransform) {

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

    context.globalAlpha = 1;
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
    $(canvas).keydown(function (e) {
        that.KeyDown(e.keyCode);
    });
    $(canvas).keyup(function (e) {
        that.KeyUp(/*String.fromCharCode(e.keyCode)*/ e.keyCode);
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
    this.ELayerSelected = jQuery.Event("layerSelected");
    this.EWidgetSelected = jQuery.Event("widgetSelected");
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
WhiteBoard.prototype.ELayerSelected = null;
WhiteBoard.prototype.EWidgetSelected = null;


/*adauga un nou start*/
WhiteBoard.prototype.PushLayer = function (layer) {
    var that = this;

    /*il adaugam in listele noastre*/
    this._layers.push(layer);
    this._layersTable[layer.Id] = layer;
    layer.Order = this._layers.length - 1;

    /*setam evenimentul*/
    $(layer).bind("invalidate", function (e) { that.InvalidateLayer(e.target); });

    /*trimitem evenimentul mai dparte*/
    this.ELayerAdd.layer = layer;
    $(this).trigger(this.ELayerAdd);
}

WhiteBoard.prototype.GetLayer = function (id) {
    return this._layersTable[id];
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
                break;
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

    /*schimbam layer-urile intre ele*/
    var aux = this._layers[from];
    this._layers[from] = this._layers[to];
    this._layers[to] = aux;

    this._layers[from].Order = from;
    this._layers[to].Order = to;

    /*doar redesenam, nu si invalidam*/
    this.Draw();
}

WhiteBoard.prototype.SetActiveWidget = function (widget) {
    this.ActiveWidget = widget;

    if (widget != null)
        this.TransformWidget.UpdateWidget(widget);
    else
        this.TransformWidget.UpdateWidget(null);

    /*trimitem evenimentul ca s-a schimbat selectia*/
    this.EWidgetSelected.widget = widget;
    $(this).trigger(this.EWidgetSelected);

    this.Draw();
}

WhiteBoard.prototype.SetActiveLayer = function (layer) {
    this.ActiveLayer = layer;

    /*trimitem evenimentul*/
    this.ELayerSelected.layer = layer;
    $(this).trigger(this.ELayerSelected);
} 

WhiteBoard.prototype.GetLayerPosition = function (layerId) {
    for (var i = 0; i < this._layers.length; i++) {
        if (this._layers[i].Id == layerId)
            return i;
    }

    return -1;
}

WhiteBoard.prototype.MouseUp = function (x, y) {
    try {
        if (this._toolBox._currentTool != null) {
            this._toolBox._currentTool.MouseUp(x, y);
        }
    } catch (e) {
        console.log(e.toString());
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
        if(this._toolBox._currentTool != null)
            this._toolBox._currentTool.Drag(this._startX, this._startY, x, y);

        this._startX = x;
        this._startY = y;
    }
}

WhiteBoard.prototype.KeyDown = function (e) {
    if (this._toolBox._currentTool != null) {
        this._toolBox._currentTool.KeyDown(e);
    }
}

WhiteBoard.prototype.KeyUp = function (e) {
    if (this._toolBox._currentTool != null) {
        this._toolBox._currentTool.KeyUp(e);
    }
} 

WhiteBoard.prototype.Draw = function () {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    for (var l = this._layers.length - 1; l >=0; l--) {
        this._layers[l].Draw(this._context);
    }

    this.TransformWidget.Draw(this._context);    
}       
