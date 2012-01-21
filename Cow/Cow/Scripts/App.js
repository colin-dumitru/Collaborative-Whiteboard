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
    this._widgetFactory = new WidgetFactory();
    /*factory-ul de layer-uri*/
    this._layerFactory = new LayerFactory();
    /*toolboxul*/
    this._toolBox = new ToolBox(this._toolContainer, this._optionsContainer);
    /*tabla propriuzisa*/
    this._whiteBoard = new WhiteBoard(this._toolBox, this._canvas);

    this._whiteBoard.OnLayerAdd = function (layer) { that._LayerAdded.call(that, layer); }
    this._whiteBoard.OnLayerRemove = function (layer) { that.OnLayerRemove.call(that, layer); }

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

    layer.OnWidgetAdd = function (widget) { that._WidgetAdded(widget); }
    layer.OnWidgetRemove = function (widget) { that._WidgetRemoved(widget); }

    var element = document.createElement("li");

    /*setam clasa si valoarea elementului*/
    element.className = "layer";
    element.contentEditable = "true";
    element.innerText = layer;
    element.layer = layer;

    this._layerContainer.appendChild(element);

    $(element).click(function () {
        /*deselectam restul layer-urilor*/
        $(that._layerContainer).find("li").each(function () {
            this.className = "layer";
        });

        that._whiteBoard.ActiveLayer = this.layer;
        this.className = "layer_selected";
    });

    $(element).focusout(function () {
        layer.Name = element.innerText;
    });
}

App.prototype._WidgetAdded = function (widget) {
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

App.prototype._WidgetRemoved = function (widget) {
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
                
                
