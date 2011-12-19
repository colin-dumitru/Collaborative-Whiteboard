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

        <%using (Html.BeginForm("Create", "WhiteBoard", FormMethod.Post)) { %>
        <%:Html.TextBox("Name") %>
            <input type="submit" value="Add Board" />
        <%} %>
        <ul>
            <% foreach (var board in ViewData.Model.Boards) { %>
            <li>
                <%:board.Name %>
                <%:Html.ActionLink("Delete", "Delete", "WhiteBoard", new RouteValueDictionary() { {"id" , board.Id}}, null)%>
                <%:Html.ActionLink(">>", "Open", "WhiteBoard", new RouteValueDictionary() { {"id" , board.Id}}, null)%>
            </li>
            <%   } %>
        </ul>
    </div>
</asp:Content>
