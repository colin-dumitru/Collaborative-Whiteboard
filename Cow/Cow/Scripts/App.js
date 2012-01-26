/*
---------------------------------------------------------------------------
------------------------------Users----------------------------------------
---------------------------------------------------------------------------
*/
var User = function () {
}

User.prototype.Name = null;
User.prototype.Element = null;


/*
---------------------------------------------------------------------------
----------------------Client Application-----------------------------------
---------------------------------------------------------------------------
*/
var App = function (canvas, toolContainer, optionsContainer, layerContainer, widgetContainer,
                    userContainer, inputContainer) {
    if (canvas == null) throw "Canvas cannot be null";
    if (toolContainer == null) throw "Tool contnainer cannot be null";
    if (optionsContainer == null) throw "Options contnainer cannot be null";
    if (widgetContainer == null) throw "Widget container cannot be null";
    if (layerContainer == null) throw "Layer container cannot be null";
    if (userContainer == null) throw "User container cannot be null";

    this._canvas = canvas;
    this._toolContainer = toolContainer;
    this._layerContainer = layerContainer;
    this._widgetContainer = widgetContainer;
    this._userContainer = userContainer;
    this._optionsContainer = optionsContainer;
    this._inputContainer = inputContainer;
}

App.prototype._canvas = null;
App.prototype._toolContainer = null;
App.prototype._layerContainer = null;
App.prototype._widgetContainer = null;
App.prototype._userContainer = null;
App.prototype._optionsContainer = null;
App.prototype._inputContainer = null;

App.prototype._toolBox = null;
App.prototype._whiteBoard = null;
App.prototype._factory = null;

/*lista de utilizatori ce au drepturi asupra tablei*/
App.prototype._users = null;

/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.Initialize = function () {
    var that = this;

    /*lista goala de utilizatori*/
    this._users = [];

    /*factory-ul*/
    this._factory = new Factory()
    this._factory.AddBuilder("polygon", function (op) { return new PolygonWidget(op); });
    this._factory.AddBuilder("circle", function (op) { return new CircleWidget(op); });
    this._factory.AddBuilder("image", function (op) { return new ImageWidget(op); });
    this._factory.AddBuilder("text", function (op) { return new TextWidget(op, that._inputContainer, that._canvas); });
    this._factory.AddBuilder("brush", function (op) { return new BrushWidget(op); });

    /*toolboxul*/
    this._toolBox = new ToolBox(this._toolContainer, this._optionsContainer);
    /*tabla propriuzisa*/
    this._whiteBoard = new WhiteBoard(this._toolBox, this._canvas);

    $(this._whiteBoard).bind("layerAdd", function (e) { that._LayerAdded(e.layer); });
    $(this._whiteBoard).bind("layerRemove", function (e) { that._LayerRemoved(e.layer);  });
    $(this._whiteBoard).bind("layerSelected", function (e) { that._LayerSelected(e.layer); });
    $(this._whiteBoard).bind("widgetSelected", function (e) { that._WidgetSelected(e.widget); });

    /*adaugam tooluril initile*/
    this._toolBox.AddTool(new SelectTool(this._toolBox, this._whiteBoard, this._factory));
    this._toolBox.AddTool(new RectangleTool(this._toolBox, this._whiteBoard, this._factory));
    this._toolBox.AddTool(new PolygonTool(this._toolBox, this._whiteBoard, this._factory));
    this._toolBox.AddTool(new TextTool(this._toolBox, this._whiteBoard, this._factory));
    this._toolBox.AddTool(new ImageTool(this._toolBox, this._whiteBoard, this._factory));
    this._toolBox.AddTool(new BrushTool(this._toolBox, this._whiteBoard, this._factory));

    /*afisam elementele din toolbox*/
    this._ResetToolBox();

    /*incarcam labla din bd*/
    this.Load();

    /*cerem serverului periodic schimbarile produse*/
    window.setInterval(function () { that.GetChanges(); }, 300);
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.GetChanges = function () {
    /*intrebam serverul de schimbarile produse asupra tablei*/
    var that = this;

    $.ajax({
        url: "/WhiteBoard/Get/",
        dataType: "json",
        type: "post",
        data: { id: document.BoardId },
        success: function (data) {
            for (var c in data) {
                if (data[c].Obj == "widget") {
                    that._GetWidgetChange(data[c]);
                } else if (data[c].Obj == "layer") {
                    that._GetLayerChange(data[c]);
                } else if (data[c].Obj == "user") {
                    that._GetUserChange(data[c]);
                }
            }

        }
    });
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._GetWidgetChange = function (obj) {
    var change = JSON.parse(obj.ChangeString);

    if (obj.Operation == "add") {
        /*cream un widget nou*/
        var widget = this._factory.BuildWidget(change.Type, null, change.Id);
        widget.Deserialize(JSON.parse(change.Data));
        this._whiteBoard.GetLayer(change.LayerId).PushWidget(widget);
    } if (obj.Operation == "change") {
        /*cream un widget nou*/
        var widget = this._whiteBoard.GetLayer(change.LayerId).GetWidget(change.Id);
        widget.Deserialize(JSON.parse(change.Data));
        widget.Invalidate();

        /*modificam ordinea in care apare layer-ul*/
        widget.Parent.SwitchWidgets(widget.Order, change.Order);
        if (widget.Element.previousSibling == null) return;
        var sibling = widget.Element.previousSibling;
        /*schimbam si elementele din fereastra*/
        this._widgetContainer.removeChild(widget.Element);
        this._widgetContainer.insertBefore(widget.Element, sibling);
    } else if (obj.Operation == "remove") {
        this._whiteBoard.GetLayer(change.LayerId).RemoveWidget(change.Id);
        this._whiteBoard.GetLayer(change.LayerId).Invalidate();
    }
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._GetLayerChange = function (obj) {
    var change = JSON.parse(obj.ChangeString);

    if (obj.Operation == "add") {
        /*cream un widget nou*/
        var layer = this._factory.BuildLayer(change.Name, change.Id);
        layer.Order = change.Order;
        this._whiteBoard.PushLayer(layer);
    } if (obj.Operation == "change") {
        /*modificam numele*/
        var layer = this._whiteBoard.GetLayer(change.Id);
        layer.Name = change.Name;
        layer.Element.innerText = change.Name;

        /*modificam ordinea in care apare layer-ul*/
        this._whiteBoard.SwitchLayers(layer.Order, change.Order);
        if (layer.Element.previousSibling == null) return;
        var sibling = layer.Element.previousSibling;
        /*schimbam si elementele din fereastra*/
        this._layerContainer.removeChild(layer.Element);
        this._layerContainer.insertBefore(layer.Element, sibling);
    } else if (obj.Operation == "remove") {
        this._whiteBoard.RemoveLayer(change.Id);
    }
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._GetUserChange = function (obj) {
    var change = JSON.parse(obj.ChangeString);

    if (obj.Operation == "add") {
        /*cream un widget nou*/
        var user = new User();
        user.Name = change.Name;
        this.AddUser(user);
    } if (obj.Operation == "change") {
    } else if (obj.Operation == "remove") {
        for (var u in this._users) {
            if (this._users[u].Name == change.Name) {
                this.RemoveUser(this._users[u]);
                break;
            }
        }
    }
} 
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.Load = function () {
    var that = this;

    $.ajax({
        url: "/WhiteBoard/Load/",
        dataType: "json",
        type: "post",
        data: { id: document.BoardId },
        success: function (data) {
            that._LoadLayers(data);
            that._LoadUsers(data);
        }
    });
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._LoadLayers = function (obj) {
    for (var i in obj.LayerStack) {
        var layer = obj.LayerStack[i];

        var nlayer = this._factory.BuildLayer(layer.Name, layer.Id);
        nlayer.Id = layer.Id;

        /*adaugam layer-ul in whiteboard*/
        this._whiteBoard.PushLayer(nlayer);

        /*deserializam si widget-urile*/
        for (var w in layer.WidgetsStack) {
            var widget = layer.WidgetsStack[w];

            /*cream un nou widget*/
            var nwidget = this._factory.BuildWidget(widget.Type, null, widget.WidgetId);
            nwidget.Deserialize(JSON.parse(widget.Data));

            /*il adaugam in whiteboard*/
            nlayer.PushWidget(nwidget);
        }

        this._whiteBoard.SetActiveLayer(nlayer);
    }

    /*adaugam layer-ul selectat*/
    this._LayerSelected(this._whiteBoard.ActiveLayer);

}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._LoadUsers = function (obj) {
    for (var u in obj.Users) {
        var user = new User();
        user.Name = obj.Users[u].Username;
        /*adaugam userul in lista noastra*/
        this.AddUser(user);
    }
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.AddUser = function (user) {
    var that = this;
    var _user = user;

    this._users.push(user);

    /*ii cream elementul*/
    user.Element = document.createElement("li");
    user.Element.className = "user";
    user.Element.User = user;

    /*textul*/
    var text = document.createElement("div");
    text.innerText = user.Name;

    /*butonul de stergere*/
    var button = document.createElement("button");
    button.innerText = "X";
    button.className = "button";
    button.style.position = "absolute";
    button.style.right = "0px";
    button.style.marginTop = "-20px";

    user.Element.appendChild(text);
    user.Element.appendChild(button);

    /*cand dam click pe butonul de stergere*/
    $(button).click(function (e) {
        that.RemoveUser(_user);
        that._UserSync(_user, "remove");
    });


    $("#userContainer").append(user.Element);
}
/*
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.RemoveUser = function (user) {
    if (user == null)
        return;

    /*stergem utilizatorul din lista noastra*/
    for (var u in this._users) {
        if (this._users[u] == user) {
            this._users.splice(u, 1);
            break;
        }
    }

    /*scoatem si elementul*/
    this._userContainer.removeChild(user.Element);
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/

App.prototype._ResetToolBox = function () {
    while (this._toolContainer.childNodes.length > 0)
        this._toolContainer.removeChild(this._toolContainer.firstChild);

    /*afisam toolurile in containerul specificat*/
    this._toolBox.Pack();
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.AddEmptyLayer = function () {
    var layer = this._factory.BuildLayer("Untitled");
    this._whiteBoard.PushLayer(layer);
    this._whiteBoard.SetActiveLayer(layer);
    /*spune-m si serverului ca a fost adaugat*/
    layer.Sync("add");
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._LayerAdded = function (layer) {
    var that = this;

    /*ascultam evenimentele sale*/
    $(layer).bind("widgetAdd", function (e) { that._WidgetAdded(e.target, e.widget); });
    $(layer).bind("widgetRemove", function (e) { that._WidgetRemoved(e.target, e.widget); });
    $(layer).bind("sync", function (e) { that._LayerSync(e.target, e.operation); });

    var element = document.createElement("li");

    /*setam clasa si valoarea elementului*/
    element.className = "layer";
    element.contentEditable = "true";
    element.innerText = layer;
    element.layer = layer;

    layer.Element = element;
    layer.WidgetFactory = this._factory;

    this._layerContainer.appendChild(element);

    /*adaugam si toate widgeturile sale in fereastra*/
    this._SetWidgetList(layer);

    $(element).click(function () {
        that._whiteBoard.SetActiveLayer(this.layer);
    });

    $(element).focusout(function () {
        if (layer.Name != element.innerText) {
            layer.Name = element.innerText;
            layer.Sync();
        }
    });
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._LayerSelected = function (layer) {
    /*deselectam restul layer-urilor*/
    $(this._layerContainer).find("li").each(function () {
        this.className = "layer";
    });

    /*selectam layer-ul*/
    this._SetWidgetList(layer);
    layer.Element.className = "layer_selected";
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._WidgetSelected = function (widget) {
    if (widget == null)
        return;

    /*deselectam restul layer-urilor*/
    $(this._widgetContainer).find("li").each(function () {
        this.className = "layer";
    });

    /*selectam layer-ul*/
    if (widget.Element != null)
        widget.Element.className = "layer_selected";
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._SetWidgetList = function (layer) {
    var that = this;

    /*stergem toate widgeturile existe*/
    while (this._widgetContainer.hasChildNodes())
        this._widgetContainer.removeChild(this._widgetContainer.firstChild);

    if (layer == null) return;

    layer.EachWidget(function (widget, index) {
        that._widgetContainer.appendChild(widget.Element);
    });
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._WidgetAdded = function (layer, widget) {

    var element = document.createElement("li");
    var that = this;

    /*setam clasa si valoarea elementului*/
    element.className = "layer";
    element.contentEditable = "true";
    element.innerText = widget.Name;
    element.widget = widget;
    widget.Element = element;

    $(widget).bind("sync", function (e) { that._WidgetSync(e.target, e.operation); });

    $(element).click(function () {
        /*deselectam restul layer-urilor*/
        $(that._widgetContainer).find("li").each(function () {
            this.className = "layer";
        });

        that._whiteBoard.SetActiveWidget(this.widget);
        this.className = "layer_selected";
    });

    $(element).focusout(function () {
        widget.Name = widget.Element.innerText;
        widget.Sync();
    });

    /*afisam widgetul nou doar daca se afla in layer-ul activ*/
    if (layer == this._whiteBoard.ActiveLayer)
        this._widgetContainer.appendChild(element);
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.RemoveSelectedLayer = function () {
    var that = this;

    /*iteram prin toate elementele si verificam care sunt selectate*/
    $(this._layerContainer).find("li").each(function () {
        if (this.className == "layer_selected") {
            that._whiteBoard.RemoveLayer(this.layer.Id);
            /*spune-m si serverului ca a fost sters layer-ul*/
            this.layer.Sync("remove");
        }
    });
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.RemoveSelectedWidget = function () {
    if (this._whiteBoard.ActiveWidget == null)
        return;

    var parent = this._whiteBoard.ActiveWidget.Parent;

    /*spune-m serverului sa scoata widgetul*/
    this._whiteBoard.ActiveWidget.Sync("remove");
    /*il scoatem din lista de la noi*/
    parent.RemoveWidget(this._whiteBoard.ActiveWidget.Id);
    parent.Invalidate();
    //this._whiteBoard.SetActiveWidget(null);
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._LayerRemoved = function (layer) {
    /*scoatem elementul sau*/
    this._layerContainer.removeChild(layer.Element);
    this._whiteBoard.SetActiveLayer(null);
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._WidgetRemoved = function (layer, widget) {
    this._widgetContainer.removeChild(widget.Element);
    /*daca era widgetul selectat curent - scoatem selectia*/
    if (this._whiteBoard.ActiveWidget == widget)
        this._whiteBoard.SetActiveWidget(null);
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.MoveSelectedLayerUp = function () {
    if (this._whiteBoard.ActiveLayer == null)
        return;

    /*schimbam cu layer-ul precedent*/
    this._whiteBoard.SwitchLayers(this._whiteBoard.ActiveLayer.Order, this._whiteBoard.ActiveLayer.Order - 1);

    if (this._whiteBoard.ActiveLayer.Element.previousSibling == null)
        return;
    var sibling = this._whiteBoard.ActiveLayer.Element.previousSibling;

    /*schimbam si elementele din fereastra*/
    this._layerContainer.removeChild(this._whiteBoard.ActiveLayer.Element);
    this._layerContainer.insertBefore(this._whiteBoard.ActiveLayer.Element, sibling);
    /*sincronizam cu serverul*/
    this._whiteBoard.ActiveLayer.Sync();
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.MoveSelectedLayerDown = function () {
    if (this._whiteBoard.ActiveLayer == null)
        return;

    /*schimbam cu layer-ul precedent*/
    this._whiteBoard.SwitchLayers(this._whiteBoard.ActiveLayer.Order, this._whiteBoard.ActiveLayer.Order + 1);

    if (this._whiteBoard.ActiveLayer.Element.nextSibling == null)
        return;
    var sibling = this._whiteBoard.ActiveLayer.Element.nextSibling.nextSibling;

    /*schimbam si elementele din fereastra*/
    this._layerContainer.removeChild(this._whiteBoard.ActiveLayer.Element);
    this._layerContainer.insertBefore(this._whiteBoard.ActiveLayer.Element, sibling);
    /*sincronizam cu serverul*/
    this._whiteBoard.ActiveLayer.Sync();
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.MoveSelectedWidgetUp = function () {
    if (this._whiteBoard.ActiveWidget == null)
        return;

    /*schimbam cu layer-ul precedent*/
    this._whiteBoard.ActiveWidget.Parent.SwitchWidgets(this._whiteBoard.ActiveWidget.Order,
                                                     this._whiteBoard.ActiveWidget.Order - 1);

    if (this._whiteBoard.ActiveWidget.Element.previousSibling == null)
        return;
    var sibling = this._whiteBoard.ActiveWidget.Element.previousSibling;

    /*schimbam si elementele din fereastra*/
    this._widgetContainer.removeChild(this._whiteBoard.ActiveWidget.Element);
    this._widgetContainer.insertBefore(this._whiteBoard.ActiveWidget.Element, sibling);
    /*sincronizam cu serverul*/
    this._whiteBoard.ActiveWidget.Sync();
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.MoveSelectedWidgetDown = function () {
    if (this._whiteBoard.ActiveWidget == null)
        return;

    /*schimbam cu layer-ul precedent*/
    this._whiteBoard.ActiveWidget.Parent.SwitchWidgets(this._whiteBoard.ActiveWidget.Order,
                                                     this._whiteBoard.ActiveWidget.Order + 1);

    if (this._whiteBoard.ActiveWidget.Element.nextSibling == null)
        return;
    var sibling = this._whiteBoard.ActiveWidget.Element.nextSibling.nextSibling;

    /*schimbam si elementele din fereastra*/
    this._widgetContainer.removeChild(this._whiteBoard.ActiveWidget.Element);
    this._widgetContainer.insertBefore(this._whiteBoard.ActiveWidget.Element, sibling);
    /*sincronizam cu serverul*/
    this._whiteBoard.ActiveWidget.Sync();

}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype.Bool = function(op) {
    /*luam cele 2 widget-uri careia aplicam operatia*/
    var source = this._whiteBoard.ActiveWidget;
    if(source == null || !source.AllowBool) return;

    var clip = this._whiteBoard.ActiveWidget.Parent._widgets[source.Order + 1];
    if(clip == null || !clip.AllowBool) return;

    /*cream cele 2 polygoane*/
    var pols = []; var polc = [];

    source.GetBounds().Each(function(point) {
        pols.push({X: point.X + source.GetBounds().Position.X, Y: point.Y + source.GetBounds().Position.Y});
    });

    clip.GetBounds().Each(function(point) {
        polc.push({X: point.X + clip.GetBounds().Position.X, Y: point.Y + clip.GetBounds().Position.Y});
    });

    var obj = {
        Source: {Points: pols}, 
        Clip: {Points: polc}, 
        Operation: op
    };

    var that = this;

    /*trimitem cererea catre server*/
    $.ajax({
        url: "/WhiteBoard/Bool",
        data: JSON.stringify(obj),
        contentType: 'application/json',
        dataType: "json",
        type: "post",
        success: function(data) {
            var layer = source.Parent;

            /*stergem cele 2 widget-uri*/
            layer.RemoveWidget(source.Id);
            layer.RemoveWidget(clip.Id);
            source.Sync("remove"); clip.Sync("remove");

            /*cream poligoane noi pentru fiecare rezultat, pastrand parametrii primului poligon*/
            for (var po in data) {
                var widget = that._factory.BuildWidget("polygon");
                widget.BgColor = source.BgColor;                
                widget.FgColor = source.FgColor;
                widget.LineWidth = source.LineWidth;
                widget.Polygon = new Polygon();
                widget.Polygon.Position = source.Polygon.Position;

                for (var p in data[po].Points) {
                    widget.Polygon._points.push({X : data[po].Points[p].X - source.Polygon.Position.X,
                                                 Y : data[po].Points[p].Y - source.Polygon.Position.Y});                                                                         
                }  
                
                widget.Order = source.Order;  

                /*adaugam noul widget creat*/
                layer.InsertWidget(widget);
                widget.Sync("add");
            }
        }
    });
} 
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._UserSync = function (user, op) {
    /*cream obiectul ce il trimitem la server*/
    var obj = {
        BoardId: document.BoardId,
        Id: document.BoardId,
        Obj: "user",
        Operation: op,
        ChangeString: JSON.stringify(
            {
                Name : user.Name
            }
        )
    };

    /*trimitem cererea catre server*/
    $.ajax({
        url: "/WhiteBoard/Push",
        data: JSON.stringify(obj),
        contentType: 'application/json',
        type: "post"
    });
} 

/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._WidgetSync = function (widget, op) {
    /*cream obiectul ce il trimitem la server*/
    var obj = {
        BoardId: document.BoardId,
        Id: widget.Id,
        Obj: "widget",
        Operation: op,
        ChangeString: JSON.stringify(
            {
                LayerId: widget.Parent.Id,
                Id: widget.Id,
                Type: widget.Type,
                Name: widget.Name != null ? widget.Name : "Undefined",
                Data: JSON.stringify(widget.Serialize()),
                Order: widget.Order
            }
        )
    };

    /*trimitem cererea catre server*/
    $.ajax({
        url: "/WhiteBoard/Push",
        data: JSON.stringify(obj),
        contentType: 'application/json',
        type : "post"
    });
}
/*
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
*/
App.prototype._LayerSync = function (layer, op) {
    /*cream obiectul ce il trimitem la server*/
    var obj = {
        BoardId: document.BoardId,
        Id: layer.Id,
        Obj: "layer",
        Operation: op,
        ChangeString: JSON.stringify(
            {
                Id: layer.Id,
                Order: layer.Order,
                Name: layer.Name != null ? layer.Name : "Undefined"
            }
        )
    };

    /*trimitem cererea catre server*/
    $.ajax({
        url: "/WhiteBoard/Push",
        data: JSON.stringify(obj),
        contentType: 'application/json',
        type: "post"
    });
}                 
                
