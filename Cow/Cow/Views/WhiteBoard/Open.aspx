<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="HeaderContent" ContentPlaceHolderID="HeaderContent" runat="server">
    <link href="../../Content/WhiteBoard.css" rel="stylesheet" type="text/css" />
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
	Open
</asp:Content>


<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="boardcontainer">
        <table>
            <tr>
                <td class="toolcontainer"></td>
                <td class="canvascontainer">
                    <canvas class="canvas" width="800" height="600">
                    </canvas>
                </td>
                <td class="layercontainer"></td>
            </tr>
        </table>
    </div>
    

</asp:Content>
