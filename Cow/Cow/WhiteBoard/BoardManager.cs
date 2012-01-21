using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Principal;
using Cow.Models;

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

        /*baza de date*/
        CowEntities _em = new CowEntities();
        /*lista de table incarcate din baza d date*/
        Dictionary<int, ActiveBoard> _activeBoards = new Dictionary<int, ActiveBoard>();

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------ 
        public BoardManager() {

        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        ~BoardManager() {
             /*salvezi board-urile incarcate inapoi in baza de date*/
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ActiveBoard GetBoard(int id) {
            /*daca baord-ul este deja incarcat, il intorci
             daca nu - il incarci baza de date*/

            var res = (from d in this._em.Boards
                       where d.Id == id
                       select d).ToList();

            return null;
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        private ActiveBoard _LoadBoard(int id) {
            ActiveBoard ret = new ActiveBoard();

            /*incarci un Board din baza de date cu id-ul specificat*/

            /*apoi incarci Layer-urile ce apartin Board-ului incarcat*/
            /*idem si pentru UserRight*/

            /*pentru fiecare Layer incarcat, creezi o instanta de ActiveLayer si bagi in Board*/
            /*pentru fiecare layer faci o selectie dupa Widgets-urile ce apartin layer-ului, creezi
             o instanta ActiveWidget si il inserezi in layer-ul corespunzator*/

            return ret;
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void PushChange(int boardId, Change change, IPrincipal user) {
            /*pui la ceialti utilizatori modificarea produsa*/
            /*user.Identity.Name; - username-ul la user*/
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public List<Change> GetChanges(int boardId, IPrincipal user) {
            /*iei modificarile din lista utilizatorlui, si o intorci*/
            /*resetezi lista de modificari*/

            return null;
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
				
    }
}