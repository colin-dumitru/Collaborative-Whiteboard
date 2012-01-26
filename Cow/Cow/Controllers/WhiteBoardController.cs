using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Cow.ModelViews;
using Cow.Data;
using System.IO;
using Cow.WhiteBoard;
using Cow.Models;
using ClipperLib;

namespace Cow.Controllers {
    public class WhiteBoardController : Controller {
        private BoardEntityManager _em = null;

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------				
        public WhiteBoardController() {
            this._em = new BoardEntityManager();
        }

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------				
        [Authorize]
        public ActionResult List() {
            /*cream mv*/
            ListBoardModelView mv = new ListBoardModelView() {
                Boards = this._em.GetBoards(this.User)
            };

            return View("List", mv);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize]
        [HttpPost]
        public ActionResult Create(CreateBoardModelView mv) {
            /*cream tabla in baza de date*/
            Board b = this._em.CreateBoard(this.User, mv.Name);
            ActiveBoard ab = BoardManager.Instance.GetBoard(b.Id);

            /*adaugam userul in board*/
            BoardManager.Instance.AddUser(b.Id, this.User.Identity.Name);

            return this.List();
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize]
        [HttpPost]
        public ActionResult Load(int id) {
            /*incarcam tabla*/
            ActiveBoard board = BoardManager.Instance.GetBoard(id);
            return Json(board);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize]
        public ActionResult Delete(int id) {
            this._em.DeleteBoard(this.User, id);
            return this.List();
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize]
        public ActionResult Open(int id) {
            Board board = this._em.GetBoard(id);

            /*incarcam si tabla*/
            BoardManager.Instance.GetBoard(id);

            if (board != null)
                return View(new BoardModelView { Id = board.Id, Name = board.Name });
            else
                return View("Index", "Home");
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize]
        [HttpPost]
        public ActionResult Get(int id) {
            return Json(BoardManager.Instance.GetChanges(id, this.User));
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize]
        [HttpPost]
        public ActionResult Push(Change change) {
            BoardManager.Instance.PushChange(change.BoardId, change, this.User);

            return Json(change);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize]
        [HttpPost]
        public ActionResult Reserve(ReserveModelView mv) {
            Board board = this._em.GetBoard(mv.Id);

            ReserveResponseModelView response = new ReserveResponseModelView();

            if (board != null) {

                response.Ids = new List<int>();
                for (int i = 0; i < mv.Count; i++)
                    response.Ids.Add(i + board.Seed);
                board.Seed += mv.Count;
                this._em.SaveChanges();
            }

            return Json(response);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize]
        [HttpPost]
        public ActionResult Bool(BoolModelView mv) {
            /*verificam tipul operatiei*/
            Cow.PolygonClipper.PolygonClipper.OpType op = PolygonClipper.PolygonClipper.OpType.Union;

            if (mv.Operation == "union")
                op = PolygonClipper.PolygonClipper.OpType.Union;
            if (mv.Operation == "difference")
                op = PolygonClipper.PolygonClipper.OpType.Difference;
            if (mv.Operation == "intersect")
                op = PolygonClipper.PolygonClipper.OpType.Intersection;

            return Json(new PolygonClipper.PolygonClipper().Clip(mv.Source, mv.Clip, op));
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        protected override void Dispose(bool disposing) {
            base.Dispose(disposing);
        }

    }
}
