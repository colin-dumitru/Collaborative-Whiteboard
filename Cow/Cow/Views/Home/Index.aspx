<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="TitleContent" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="content">
        <h2>
            Welcome, 
        </h2>
        <p>
             to the Collaborative White Board Application.
        </p>
        <p>
            To get started, please visit your
            <%:Html.ActionLink("WhiteBoard Page", "List", "WhiteBoard") %>
        </p>
    </div>
</asp:Content>
