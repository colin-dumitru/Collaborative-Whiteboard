using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Cow.ModelViews;
using Cow.Data;
using System.IO;

namespace Cow.Controllers
{
    public class WhiteBoardController : Controller
    {
        private BoardEntityManager _em = null;

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------				
        public WhiteBoardController() {
            this._em = new BoardEntityManager();
        }

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------				
        [Authorize]
        public ActionResult List()
        {
            /*cream mv*/
            ListBoardModelView mv = new ListBoardModelView() {
                Boards = this._em.GetBoards(this.User)
            };
            
            return View("List", mv);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        [Authorize] [HttpPost]
        public ActionResult Create(CreateBoardModelView mv) {
            this._em.CreateBoard(this.User, mv.Name);
            return this.List();
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

    }
}
