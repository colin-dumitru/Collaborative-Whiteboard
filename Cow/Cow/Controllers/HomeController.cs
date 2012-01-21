using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Cow.Controllers {
    [HandleError]
    public class HomeController : Controller {

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
			
	    [Authorize]
        public ActionResult Index() {  
            return View();

        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
    }
}
