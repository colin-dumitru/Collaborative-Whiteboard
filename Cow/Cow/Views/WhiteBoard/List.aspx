<%@ Import Namespace="Cow.ModelViews" %>

<%@ Page Title="List White Boards" Language="C#" MasterPageFile="~/Views/Shared/Site.Master"
    Inherits="System.Web.Mvc.ViewPage<ListBoardModelView>" %>

<asp:Content ID="TitleContent" ContentPlaceHolderID="TitleContent" runat="server">
    List White Boards
</asp:Content>

<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="content">
        <h2>
            Your White Boards
        </h2>
        
        <div class="add_board">
        <%using (Html.BeginForm("Create", "WhiteBoard", FormMethod.Post)) { %>
        <%:Html.TextBox("Name") %>
        <button type="submit">Add Board</button>
        <%} %>
        </div>
        <ul class="board_list">
            <% foreach (var board in ViewData.Model.Boards) { %>
            <li>
                <%:board.Name %>
                <div class="board_buttons">
                <%:Html.ActionLink("Delete", "Delete", "WhiteBoard", new RouteValueDictionary() { {"id" , board.Id}}, null)%>
                <%:Html.ActionLink("Duplicate", "Duplicate", "WhiteBoard", new RouteValueDictionary() { { "id", board.Id } }, null)%>
                <%:Html.ActionLink("Go", "Open", "WhiteBoard", new RouteValueDictionary() { {"id" , board.Id}}, null)%>
                </div>
            </li>
            <%   } %>
        </ul>
    </div>
</asp:Content>
