using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cow.WhiteBoard {
    [Serializable]
    public class Change {
        public enum Type {
            Add, Change, Removed, Moved
        }

        public enum Object{
            Widget, Layer
        }

        /*id-ul widgetului carei ii se aplica operatia*/
        public int Id { get; set; }
        /*lipul de obiect afectat*/
        public Object Obj { get; set; } 
        /*modificarea produsa*/
        public Change Operation { get; set; }
        /*prorpeitatile modificate - serializat ca obiect Json*/
        public String ChangeString { get; set; }

    }
}