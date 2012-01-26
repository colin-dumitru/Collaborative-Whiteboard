using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Cow.Models;
using System.Web.Script.Serialization;

namespace Cow.WhiteBoard {
    [Serializable]
    public class ActiveWidget {
        public string Type { get; set; }
        public int WidgetId { get; set; }
        public String Data { get; set; }
        public String Name { get; set; }

        /* entitatea din bd corespunzatoare*/
        [ScriptIgnore]
        public Widget WidgetEntity { get; set; } 
    }
}