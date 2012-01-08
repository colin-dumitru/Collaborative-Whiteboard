using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cow.WhiteBoard {
    public class BoardManager {
        private Dictionary<String, User> _connectedUsers = new Dictionary<string, User>();

        /*instanta unica a clasei*/
        private static BoardManager _instance = null;
        /*instata publica a clasei*/
        public static BoardManager Instance {
            get {
                if (_instance == null)
                    _instance = new BoardManager();

                return _instance;
            }
        }   
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------ 
        public BoardManager() {

        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        ~BoardManager() {
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
				
    }
}