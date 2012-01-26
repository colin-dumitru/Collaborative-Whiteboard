using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Cow.Models;
using System.Web.Script.Serialization;

namespace Cow.WhiteBoard {
    public class ActiveUser {
        public enum Rights {
            Read = 0x01,
            Write = 0x02
        }

        /*username-ul utilizatorlui*/
        public String Username { get; set; }
        /*lista de modificari produse de la ultima cerere*/
        [ScriptIgnore]
        public List<Change> Changes { get; internal set; }
        /*daca poate modifica tabla*/
        public Rights Right { get; set; }
        /*entitatea*/
        [ScriptIgnore]
        public UserRight Entity { get; set; }


        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ActiveUser() {
            this.Changes = new List<Change>();
        }
				
    }
}