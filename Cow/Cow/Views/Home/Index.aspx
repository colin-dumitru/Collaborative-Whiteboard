<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="TitleContent" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="content">
        <p>
            Welcome blah blah blah
        </p>
        <p>
            Visit your
            <%:Html.ActionLink("WhiteBoard Page", "List", "WhiteBoard") %>
        </p>
    </div>
</asp:Content>
