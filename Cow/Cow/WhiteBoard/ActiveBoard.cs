using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.ObjectModel;
using Cow.Models;

namespace Cow.WhiteBoard {
    public class ActiveBoard {
        /*lista de layer-uri grupate pe id-ul lor*/
        public Dictionary<int, ActiveLayer> Layers = new Dictionary<int, ActiveLayer>();
        /*lista de layere grupate dupa ordinea in care vor fi desenate*/
        public List<ActiveLayer> LayerStack = new List<ActiveLayer>();
        /* entitatea din bd*/
        public Board BoardEntity { get; set; }

        /*lista de utilizatori ce au drepturi asupra tablei*/
        public Dictionary<string,User> Users = new Dictionary<string,User>();

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ActiveBoard() {
            
        }
        
				
    }
}