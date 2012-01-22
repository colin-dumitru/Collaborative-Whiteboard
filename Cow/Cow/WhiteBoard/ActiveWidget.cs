using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Cow.Models;

namespace Cow.WhiteBoard {
    public class ActiveWidget {
        public string Type { get; set; }
        public int WidgetId { get; set; }
        public String Data { get; set; }
        public String Name { get; set; }

        /* entitatea din bd corespunzatoare*/
        public Widget WidgetEntity { get; set; } 
    }
}