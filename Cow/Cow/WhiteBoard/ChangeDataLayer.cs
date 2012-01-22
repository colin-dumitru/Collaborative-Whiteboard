using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cow.WhiteBoard
{
    [Serializable]
    public class ChangeDataLayer
    {
        public int Id { get; set; }
        public int Order { get; set; }
        public string Name { get; set; }
    }
}