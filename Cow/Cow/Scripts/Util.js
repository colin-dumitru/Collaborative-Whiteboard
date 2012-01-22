var Util = new Object();

Util.ColorToHex = function (color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
};

/*
---------------------------------------------------------------------------
----------------------Point------------------------------------------------
---------------------------------------------------------------------------
*/
var Point = function () {
    this.X = 0;
    this.Y = 0;
}

Point.prototype.X = 0;
Point.prototype.Y = 0;

/*
---------------------------------------------------------------------------
----------------------Polygon----------------------------------------------
---------------------------------------------------------------------------
*/
var Polygon = function () {
    this._points = [];
    this._cachedPoints = [];
    this.Position = new Point();
}

Polygon.prototype.Position = null;
Polygon.prototype.PivotX = 0;
Polygon.prototype.PivotY = 0;

Polygon.prototype._points = null; ;

Polygon.prototype.Includes = function (point) {
    if (point.X == null || point.Y == null)
        return false;

    var i = 0; var j = 0; var c = false;

    for (i = 0, j = this._points.length - 1; i < this._points.length; j = i++) {
        if (((this._points[i].Y + this.Position.Y > point.Y) != (this._points[j].Y + this.Position.Y > point.Y)) &&
	        (point.X < (this._points[j].X - this._points[i].X) *
            (point.Y - (this._points[i].Y + this.Position.Y)) /
            (this._points[j].Y - this._points[i].Y) + (this._points[i].X + this.Position.X)))
            c = !c;
    }
    return c;
}

Polygon.prototype.AddPoint = function (point) {
    this._points.push(point);
}

Polygon.prototype.ClearPoints = function () {
    this._points = [];
    this._cachedPoints = [];
}

Polygon.prototype.Rotate = function (angle) {
    var x = 0;
    var y = 0;

    for (var p in this._points) {
        x = this.PivotX + (this._points[p].X - this.PivotX) * Math.cos(angle) - (this._points[p].Y - this.PivotY) * Math.sin(angle);
        y = this.PivotY + (this._points[p].X - this.PivotX) * Math.sin(angle) + (this._points[p].Y - this.PivotY) * Math.cos(angle);

        this._points[p].X = x;
        this._points[p].Y = y;
    }
}

Polygon.prototype.Translate = function (point) {
    for (var p in this._points) {
        this._points[p].X += point.X;
        this._points[p].Y += point.Y;
    }
}

Polygon.prototype.Each = function (fct) {
    for (var p in this._points) {
        fct(this._points[p], p);
    }
}

Polygon.prototype.Clone = function () {
    var ret = new Polygon();

    var that = this;

    this.Each(function (point) {
        ret.AddPoint(Create(new Point(), { X: point.X, Y: point.Y }));
    });

    ret.Angle = this.Angle;
    ret.PivotX = this.PivotX;
    ret.PivotY = this.PivotY;
    ret.Position.X = this.Position.X;
    ret.Position.Y = this.Position.Y;

    return ret;
} 
/*
---------------------------------------------------------------------------
----------------------Circle-----------------------------------------------
---------------------------------------------------------------------------
*/
var Circle = function () {
}

Circle.prototype.X = 0;
Circle.prototype.Y = 0;
Circle.prototype.Radius = 0;

Circle.prototype.Intersects = function (point) {
    if (point.X != null && point.Y != null)
        return false;
}

/*
---------------------------------------------------------------------------
----------------------Rectangle--------------------------------------------
---------------------------------------------------------------------------
*/
var Rectangle = function () {
}

Rectangle.prototype.X = 0;
Rectangle.prototype.Y = 0;
Rectangle.prototype.PivotX = 0;
Rectangle.prototype.PivotY = 0;

Rectangle.prototype.Width = 0;
Rectangle.prototype.Height = 0;
Rectangle.prototype.Angle = 0;

Rectangle.prototype.Intersects = function () {
}

/*
---------------------------------------------------------------------------
----------------------Create-----------------------------------------------
---------------------------------------------------------------------------
*/

function Create(object, properties) {
    for (p in properties)
        object[p] = properties[p];

    return object;
}