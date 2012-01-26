using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClipperLib;

namespace Cow.PolygonClipper {
    public class PolygonClipper {
        public enum OpType {
            Intersection, Union, Difference, Xor
        }

        public List<Polygon> Clip(Polygon p1, Polygon p2, OpType operation) {
            List<IntPoint> pol1 = new List<IntPoint>();
            List<IntPoint> pol2 = new List<IntPoint>();
            List<List<IntPoint>> res = new List<List<IntPoint>>();

            foreach (Point point in p1.Points) {
                pol1.Add(new IntPoint(point.X, point.Y));
            }
            foreach (Point point in p2.Points) {
                pol2.Add(new IntPoint(point.X, point.Y));
            }

            Clipper clipper = new Clipper();
            clipper.AddPolygon(pol1, PolyType.ptSubject);
            clipper.AddPolygon(pol2, PolyType.ptClip);

            switch (operation) {
                case OpType.Difference:
                    clipper.Execute(ClipType.ctDifference, res);
                    break;
                case OpType.Intersection:
                    clipper.Execute(ClipType.ctIntersection, res);
                    break;
                case OpType.Union:
                    clipper.Execute(ClipType.ctUnion, res);
                    break;
                case OpType.Xor:
                    clipper.Execute(ClipType.ctXor, res);
                    break;
            }
            List<Polygon> ret = new List<Polygon>();

            foreach (var poly in res) {
                Polygon pol = new Polygon() { Points = new List<Point>() };

                foreach (var poi in poly) {
                    pol.Points.Add(new Point() { X = poi.X, Y = poi.Y });
                }

                ret.Add(pol);
            }
            return ret;
        }
    }
}