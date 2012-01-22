using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cow.WhiteBoard
{
    [Serializable]
    public class ChangeDataWidget
    {
        public int LayerId { get; set; }
        public int Id { get; set; }
        public String Name { get; set; }
        public String Type { get; set; }
        public int Order { get; set; }
        public String Data { get; set; }
    }
}