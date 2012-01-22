using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cow.WhiteBoard {
    [Serializable]
    public class Change {
        public const String obj_widget = "widget";
        public const String obj_layer = "layer";

        public const String op_add = "add";
        public const String op_change = "change";
        public const String op_remove = "remove";

        /*id-ul widgetului carei ii se aplica operatia*/
        public int Id { get; set; }
        /*lipul de obiect afectat*/
        public String Obj { get; set; } 
        /*modificarea produsa*/
        public String Operation { get; set; }
        /*prorpeitatile modificate - serializat ca obiect Json*/
        public String ChangeString { get; set; }

    }
}