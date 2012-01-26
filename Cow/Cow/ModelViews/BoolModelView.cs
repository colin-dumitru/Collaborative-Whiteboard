using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Cow.PolygonClipper;

namespace Cow.ModelViews {
    public class BoolModelView {
        public Polygon Source { get; set; }
        public Polygon Clip { get; set; }
        public String Operation { get; set; }
    }
}