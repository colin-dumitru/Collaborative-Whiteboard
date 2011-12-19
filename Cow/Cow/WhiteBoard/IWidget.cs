using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cow.WhiteBoard {
    public interface IWidget {
        int Type { get; }
        int Id { get; set; }
    }
}