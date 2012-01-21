using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.ObjectModel;

namespace Cow.WhiteBoard {
    public class ActiveBoard {
        /*lista de layer-uri grupate pe id-ul lor*/
        private Dictionary<int, ActiveLayer> _layers = new Dictionary<int, ActiveLayer>();
        /*lista de layere grupate dupa ordinea in care vor fi desenate*/
        private List<ActiveLayer> _layerStack = new List<ActiveLayer>();

        /*lista de utilizatori ce au drepturi asupra tablei*/
        private List<User> _users = new List<User>();

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ActiveBoard() {
            
        }
        
				
    }
}