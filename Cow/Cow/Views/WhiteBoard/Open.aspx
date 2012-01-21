<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="HeaderContent" ContentPlaceHolderID="HeaderContent" runat="server">
    <link href="../../Content/WhiteBoard.css" rel="stylesheet" type="text/css" />
        
    <!-- A 7-ea librarie pe care o incerc -->
    <link href="../../Content/color_select.css" rel="stylesheet" type="text/css" />
    <script src="../../Scripts/color_select.js" type="text/javascript"></script>
    
    <script src="../../Scripts/Util.js" type="text/javascript"></script>
    <script type="text/javascript" src="../../Scripts/jquery-1.4.1.js"></script>
    <script type="text/javascript" src="../../Scripts/WhiteBoard.js"></script>
    <script type="text/javascript" src="../../Scripts/Tool.js"></script>
    <script type="text/javascript" src="../../Scripts/App.js"></script>
    <script type="text/javascript">
        window.onload = Intialize;

        function PageFormat() {
            var userContainer = document.getElementById("userContainer");
            userContainer.style.width = (document.width - 200) + "px";



        }

        function Intialize() {
            /*formatarea initiala a paginii*/
            PageFormat();

            var canvas = document.getElementById("mainCanvas");
            var toolContainer = document.getElementById("toolContainer");
            var optionsContainer = document.getElementById("optionsContainer");
            var layerContainer = document.getElementById("layerContainer");
            var widgetContainer = document.getElementById("widgetContainer");

            /*cream o noua aplicatie*/
            var app = new App(canvas, toolContainer, optionsContainer, layerContainer, widgetContainer, userContainer);
            
            app.Initialize();
        }
    </script>
</asp:Content>
<asp:Content ID="TitleContent" ContentPlaceHolderID="TitleContent" runat="server">
    Open
</asp:Content>
<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="boardcontainer">
        <table>
            <tr>
                <td class="toolcontainer">
                    <div id="optionsContainer" class="optionContainer"></div>
                    <div id="toolContainer"></div>                     
                </td>
                <td class="canvascontainer">
                    <canvas id="mainCanvas" class="canvas" width="800" height="600">
                    </canvas>
                </td>
                <td class="layercontainer">
                    <table>
                        <tr>
                            <td class="layers">
                                <ul id="layerContainer">
                                    <li>test</li>
                                </ul>
                                <table class="layerbuttons" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td id="add_layer_button">
                                        </td>
                                        <td id="remove_layer_button">
                                        </td>
                                        <td id="merge_layer_button">
                                        </td>
                                        <td id="clone_layer_button">
                                        </td>
                                        <td id="up_layer_button">
                                        </td>
                                        <td id="down_layer_button">
                                        </td>
                                    </tr>
                                </table>
                                <hr />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div id="widgetContainer" class="widgets"></div>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
        <div id="userContainer" class="userContainer">
        </div>
       
    </div>
</asp:Content>
