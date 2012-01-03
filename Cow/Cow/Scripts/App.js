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

    /*toolboxul*/
    this._toolBox = null;
}


App.prototype.Initialize = function () {
    /*toolboxul*/
    this._toolBox = new ToolBox(this._toolContainer, this._optionsContainer);

    /*adaugam tooluril initile*/
    this._toolBox.AddTool(new RectangleTool());
    this._toolBox.AddTool(new TextTool());

    /*afisam elementele din toolbox*/
    this._ResetToolBox();


}


App.prototype._ResetToolBox = function () {
    while (this._toolContainer.childNodes.length > 0)
        this._toolContainer.removeChild(this._toolContainer.firstChild);


    /*afisam toolurile in containerul specificat*/
    this._toolBox.Pack();
}
                
                
