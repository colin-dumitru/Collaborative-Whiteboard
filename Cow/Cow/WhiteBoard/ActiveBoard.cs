using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.ObjectModel;
using Cow.Models;
using System.Web.Script.Serialization;

namespace Cow.WhiteBoard {
    [Serializable]
    public class ActiveBoard {
        /*lista de layer-uri grupate pe id-ul lor*/
        [ScriptIgnore]
        public Dictionary<int, ActiveLayer> Layers = new Dictionary<int, ActiveLayer>();
        /*lista de layere grupate dupa ordinea in care vor fi desenate*/
        public List<ActiveLayer> LayerStack = new List<ActiveLayer>();
        /* entitatea din bd*/
        [ScriptIgnore]
        public Board BoardEntity { get; set;}
        /*owner-ul*/
        public String Owner { get; set; }

        /*lista de utilizatori ce au drepturi asupra tablei*/
        [ScriptIgnore]
        public Dictionary<string,ActiveUser> UsersTable = new Dictionary<string,ActiveUser>();
        public List<ActiveUser> Users { get { return this.UsersTable.Values.ToList(); } }

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ActiveBoard() {
            
        }
        
				
    }
}