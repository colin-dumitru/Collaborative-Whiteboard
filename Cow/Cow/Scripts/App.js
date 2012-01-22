/*
    ---------------------------------------------------------------------------
    ----------------------Client Application-----------------------------------
    ---------------------------------------------------------------------------
*/
var App = function (canvas, toolContainer, optionsContainer, layerContainer, widgetContainer, userContainer) {
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
}

App.prototype._canvas = null;
App.prototype._toolContainer = null;
App.prototype._layerContainer = null;
App.prototype._widgetContainer = null;
App.prototype._userContainer = null;
App.prototype._optionsContainer = null;

App.prototype._toolBox = null;
App.prototype._whiteBoard = null;
App.prototype._widgetFactory = null;
App.prototype._layerFactory = null;


App.prototype.Initialize = function () {
    var that = this;

    /*factory-ul de widgeturi*/
    this._widgetFactory = new WidgetFactory()

    /*tipurile de widgeturi ce pot fi facute*/
    this._widgetFactory

    /*factory-ul de layer-uri*/
    this._layerFactory = new LayerFactory();
    /*toolboxul*/
    this._toolBox = new ToolBox(this._toolContainer, this._optionsContainer);
    /*tabla propriuzisa*/
    this._whiteBoard = new WhiteBoard(this._toolBox, this._canvas);

    $(this._whiteBoard).bind("layerAdd", function (e) { that._LayerAdded(e.layer); });
    $(this._whiteBoard).bind("layerRemove", function (e) { that._LayerRemove(e.layer); });

    /*adaugam tooluril initile*/
    this._toolBox.AddTool(new SelectTool(this._toolBox, this._whiteBoard));
    this._toolBox.AddTool(new RectangleTool(this._toolBox, this._whiteBoard));
    this._toolBox.AddTool(new TextTool(this._toolBox, this._whiteBoard));

    /*afisam elementele din toolbox*/
    this._ResetToolBox();
}


App.prototype._ResetToolBox = function () {
    while (this._toolContainer.childNodes.length > 0)
        this._toolContainer.removeChild(this._toolContainer.firstChild);

    /*afisam toolurile in containerul specificat*/
    this._toolBox.Pack();
}

App.prototype.AddEmptyLayer = function () {
    var layer = this._layerFactory.Build("Untitled"); 
    this._whiteBoard.PushLayer(layer);
    this._whiteBoard.ActiveLayer = layer;
}

App.prototype._LayerAdded = function (layer) {
    var that = this;

    $(layer).bind("widgetAdd", function (e) { that._WidgetAdded(e.target, e.widget);  });
    $(layer).bind("widgetRemove", function (e) { that._WidgetRemove( e.target, e.widget); });

    var element = document.createElement("li");

    /*setam clasa si valoarea elementului*/
    element.className = "layer";
    element.contentEditable = "true";
    element.innerText = layer;
    element.layer = layer;
    layer.element = element;

    this._layerContainer.appendChild(element);

    /*adaugam si toate widgeturile sale in fereastra*/
    this._SetWidgetList(layer);

    $(element).click(function () {
        /*deselectam restul layer-urilor*/
        $(that._layerContainer).find("li").each(function () {
            this.className = "layer";
        });

        that._whiteBoard.ActiveLayer = this.layer;
        that._SetWidgetList(this.layer);
        this.className = "layer_selected";
    });

    $(element).focusout(function () {
        layer.Name = element.innerText;
    });
}

App.prototype._SetWidgetList = function (layer) {
    var that = this;

    /*stergem toate widgeturile existe*/
    while (this._widgetContainer.hasChildNodes())
        this._widgetContainer.removeChild(this._widgetContainer.firstChild);

    if (layer == null) return;

    layer.EachWidget(function (widget, index) {
        that._widgetContainer.appendChild(widget.element);
    });
}

App.prototype._WidgetAdded = function (layer, widget) {

    var element = document.createElement("li");

    /*setam clasa si valoarea elementului*/
    element.className = "layer";
    element.contentEditable = "true";
    element.innerText = layer;
    element.widget = widget;
    widget.element = element;

    $(element).click(function () {
        /*deselectam restul layer-urilor*/
        $(that._widgetContainer).find("li").each(function () {
            this.className = "layer";
        });

        that._whiteBoard.SetActiveWidget(this.widget);
        this.className = "layer_selected";
    });

    $(element).focusout(function () {
        widget.Name = element.innerText;
    });

    /*afisam widgetul nou doar daca se afla in layer-ul activ*/
    if (layer == this._whiteBoard.ActiveLayer)
        this._widgetContainer.appendChild(element);
} 

App.prototype.RemoveSelectedLayer = function () {
    var toRemove = [];
    var that = this;

    /*iteram prin toate elementele si verificam care sunt selectate*/
    $(this._layerContainer).find("li").each(function () {
        if (this.className == "layer_selected") {
            toRemove.push(this);
            that._whiteBoard.RemoveLayer(this.layer.Id);
        }
    });

    for (var i = 0; i < toRemove.length; i++) {
        this._layerContainer.removeChild(toRemove[i]);
    }
}

App.prototype._LayerRemoved = function (layer) {
    var that = this;

    layer.OnWidgetAdd = null;
    layer.OnWidgetRemove = null;

    this._whiteBoard.ActiveLayer = null;
}

App.prototype._WidgetRemoved = function (layer, widget) {
} 

App.prototype.MoveSelectedLayerUp = function () {
    var that = this;

    /*iteram prin toate elementele si verificam care sunt selectate*/
    $(this._layerContainer).find("li").each(function () {
        if (this.className == "layer_selected") {
            var previous =  this.previousSibling;

            that._layerContainer.removeChild(this);
            that._layerContainer.insertBefore(this, previous);

            var pos = that._whiteBoard.GetLayerPosition(this.layer.Id);
            that._whiteBoard.SwitchLayers(pos, pos + 1);
        }
    });
}

App.prototype.MoveSelectedLayerDown = function () {
    var that = this;

    /*iteram prin toate elementele si verificam care sunt selectate*/
    $(this._layerContainer).find("li").each(function () {
        if (this.className == "layer_selected") {
            var next = null;
            if (this.nextSibling != null)
                next = this.nextSibling.nextSibling;

            that._layerContainer.removeChild(this);
            that._layerContainer.insertBefore(this, next);

            var pos = that._whiteBoard.GetLayerPosition(this.layer.Id);
            that._whiteBoard.SwitchLayers(pos, pos - 1);
        }
    });
} 
                
                
