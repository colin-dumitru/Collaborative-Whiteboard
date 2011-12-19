using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cow.WhiteBoard {
    public class User {
        public enum Rights {
            Read = 0x01,
            Write = 0x02
        }

        /*username-ul utilizatorlui*/
        public String Username { get; set; }
        /*lista de modificari produse de la ultima cerere*/
        public List<Change> Changes { get; internal set; }
        /*daca poate modifica tabla*/
        public Rights Right { get; set; }        


        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public User() {
            this.Changes = new List<Change>();
        }
				
    }
}