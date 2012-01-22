using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClipperLib;

namespace Cow.PolygonClipper
{
    public class PolygonClipper
    {
        public enum OpType
        {
            Intersection, Union, Difference, Xor
        }

        public Polygon Clip(Polygon p1,Polygon p2,OpType operation)
        {
            List<IntPoint> pol1 = null;
            List<IntPoint> pol2 = null;
            List<List<IntPoint>> res = null;

            foreach (Point point in p1.Points)
            {
                pol1.Add(new IntPoint(point.X, point.Y));
            }
            foreach (Point point in p2.Points)
            {
                pol2.Add(new IntPoint(point.X, point.Y));
            }

            Clipper clipper = new Clipper();
            clipper.AddPolygon(pol1, PolyType.ptSubject);
            clipper.AddPolygon(pol2, PolyType.ptSubject);
            
            switch (operation)
            {
                case OpType.Difference : 
                    clipper.Execute(ClipType.ctDifference,res);
                    break;
                case OpType.Intersection : 
                    clipper.Execute(ClipType.ctIntersection,res);
                    break;
                case OpType.Union : 
                    clipper.Execute(ClipType.ctUnion,res);
                    break;
                case OpType.Xor : 
                    clipper.Execute(ClipType.ctXor,res);
                    break;
            }
            if(res.Count()<1)
                return null;
            Polygon ret=new Polygon();
            for(int i=0;i<res[0].Count();i++){
                ret.Points[i].X=res[0][i].X;
            }
            return ret;
        }
    }
}