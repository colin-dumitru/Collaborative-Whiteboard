using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Principal;
using Cow.Models;
using System.Web.Script.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Timers;


namespace Cow.WhiteBoard {
    public class BoardManager{
        private Dictionary<String, ActiveUser> _connectedUsers = new Dictionary<string, ActiveUser>();

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
        /*timerul ce va apela salvarea*/
        Timer _timer = new Timer(10000);

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------ 
        public BoardManager() {
            this._timer.Elapsed += new ElapsedEventHandler(TimerElapsed);
            this._timer.Start();
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        void TimerElapsed(object sender, ElapsedEventArgs e) {
            this.Save();
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void SaveBoard(ActiveBoard board) {
            /*salvam bd si il stergem din activeboards*/
            this._em.SaveChanges();
            this._activeBoards.Remove(board.BoardEntity.Id);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ActiveBoard GetBoard(int id) {
            /*daca board-ul este deja incarcat il intoarcem direct */
            if (this._activeBoards.ContainsKey(id)) {
                return this._activeBoards[id];
            }

            /* incarcam board-ul din bd*/
            return _LoadBoard(id);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        private ActiveBoard _LoadBoard(int id) {
            ActiveBoard newBoard = new ActiveBoard();

            var res = (from d in this._em.Boards
                       where d.Id == id
                       select d).ToList();

            if (res.Count() < 1)
                return null;

            Board b = res[0];
            /* ii salvam entitatea*/
            newBoard.BoardEntity = b;

            /* adaugam layers din bd */
            var res1 = (from d in this._em.Layers
                        where d.BoardId == b.Id
                        select d).ToList();

            newBoard.LayerStack = new List<ActiveLayer>(res1.Count);

            foreach (Layer l in res1) {
                ActiveLayer newLayer = new ActiveLayer();
                newLayer.LayerEntity = l;
                newLayer.Id = l.LayerId;
                newLayer.Name = l.Name;
                newBoard.Layers.Add(l.LayerId, newLayer);
                if (l.Order > newBoard.LayerStack.Count)
                    newBoard.LayerStack.Add(newLayer);
                else
                    newBoard.LayerStack.Insert(l.Order, newLayer);
            }

            /* adaugam widgeturile pentru fiecare layer*/
            foreach (KeyValuePair<int, ActiveLayer> activeLayerPair in newBoard.Layers) {
                var res2 = (from d in this._em.Widgets
                            where d.LayerId == activeLayerPair.Key
                            select d).ToList();

                activeLayerPair.Value.WidgetsStack = new List<ActiveWidget>(res2.Count);

                foreach (Widget w in res2) {
                    ActiveWidget newWidget = new ActiveWidget();
                    newWidget.WidgetEntity = w;
                    newWidget.WidgetId = w.WidgetId;
                    newWidget.Type = w.Type;
                    newWidget.Data = w.Data;
                    newWidget.Name = w.Name;

                    activeLayerPair.Value.Widgets.Add(newWidget.WidgetId, newWidget);
                    if (w.Order > activeLayerPair.Value.WidgetsStack.Count)
                        activeLayerPair.Value.WidgetsStack.Add(newWidget);
                    else
                        activeLayerPair.Value.WidgetsStack.Insert(w.Order, newWidget);
                }
            }

            /* adaugam userii care au drepturi asupra boardului*/
            var res3 = (from d in this._em.UserRights
                        where d.BoardId == id
                        select d).ToList();

            foreach (UserRight ur in res3) {
                ActiveUser u = new ActiveUser();
                u.Username = ur.User;
                newBoard.UsersTable.Add(u.Username, u);
            }


            /* adaugam noul board incarcat in lista activa*/
            this._activeBoards.Add(b.Id, newBoard);
            return newBoard;
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void PushChange(int boardId, Change change, IPrincipal user) {
            /*punem la ceialti utilizatori modificarea produsa*/
            if (!this._activeBoards.ContainsKey(boardId))
                throw new Exception("Board id not found in ActiveBoards");

            ActiveBoard board = null;

            try {
                board = this.GetBoard(boardId);
            } catch (KeyNotFoundException ex) {
                return;
            }
            if (!board.UsersTable.ContainsKey(user.Identity.Name))
                throw new Exception("Username not found in board's userlist");

            switch (change.Operation) {
                case "add":
                    if (change.Obj == "layer") {
                        this._AddLayer(board, change);
                    } else if (change.Obj == "widget") {
                        this._AddWidget(board, change);
                    } else if (change.Obj == "user") {
                        this._AddUser(board, change);
                    }
                    break;
                case "remove": /*il stergem din entities si din dictionar*/
                    if (change.Obj == "layer") {
                        ActiveLayer layer = board.Layers[change.Id];

                        /*scoatem widgets entities pt acest layer si le stergem din _em*/
                        foreach (ActiveWidget w in layer.WidgetsStack) {
                            this._em.DeleteObject(w.WidgetEntity);
                        }

                        /*stergem si acest layer din board din _em*/
                        this._em.DeleteObject(layer.LayerEntity);

                        /*stergem layerul din activelayers pt acest board*/
                        lock (board.Layers) {
                            board.Layers.Remove(change.Id);
                        }
                        lock (board.LayerStack) {
                            board.LayerStack.Remove(layer);
                        }
                    } else if (change.Obj == "widget") {
                        /*get the layer id*/
                        var jss = new JavaScriptSerializer();
                        ChangeDataWidget cd = jss.Deserialize<ChangeDataWidget>(change.ChangeString);

                        /*delete from entities*/
                        Widget entity = board.Layers[cd.LayerId].GetWidget(cd.Id).WidgetEntity;
                        this._em.Widgets.DeleteObject(entity);
                        /*delete the widget from the layer of that board*/
                        board.Layers[cd.LayerId].RemoveWidget(cd.Id);
                    } else if (change.Obj == "user") {
                        /*get the layer id*/
                        var jss = new JavaScriptSerializer();
                        ChangeDataUser cd = jss.Deserialize<ChangeDataUser>(change.ChangeString);
                        
                        ActiveUser auser = board.UsersTable[cd.Name];
                        /*delete from entities*/
                        this._em.DeleteObject(auser.Entity);
                        /*delete the widget from the layer of that board*/
                        lock (board.Users) {
                            board.Users.Remove(auser);
                        }
                        lock (board.UsersTable) {
                            board.UsersTable.Remove(auser.Username);
                        }
                    }

                    break;
                case "change":
                    if (change.Obj == "layer")
                        this._ChangeLayer(board, change);
                    else if (change.Obj == "widget")
                        this._ChangeWidget(board, change);
                    /*pentru user nu avem ce modifica*/
                    break;
            }
            foreach (KeyValuePair<string, ActiveUser> uPair in board.UsersTable) {
                if (uPair.Value.Username != user.Identity.Name) {
                    uPair.Value.Changes.Add(change);
                }
            }
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        private void _AddLayer(ActiveBoard b, Change change) {
            ActiveLayer newActiveLayer = new ActiveLayer();
            var jss = new JavaScriptSerializer();
            ChangeDataLayer cd = jss.Deserialize<ChangeDataLayer>(change.ChangeString);
            newActiveLayer.Id = cd.Id;
            newActiveLayer.Name = cd.Name;

            /*creem si o entitate in bd*/
            Layer newLayer = new Layer();
            newActiveLayer.LayerEntity = newLayer;
            newLayer.LayerId = cd.Id;
            newLayer.Order = cd.Order;
            newLayer.BoardId = b.BoardEntity.Id;
            newLayer.Name = cd.Name;

            /*inseram in stackul de layere din board*/
            lock (b.Layers) {
                b.Layers.Add(cd.Id, newActiveLayer);
            }
            lock (b.LayerStack) {
                b.LayerStack.Insert(cd.Order, newActiveLayer);
            }

            this._em.AddToLayers(newLayer);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        private void _AddWidget(ActiveBoard b, Change change) {
            ActiveWidget newActiveWidget = new ActiveWidget();
            var jss = new JavaScriptSerializer();

            ChangeDataWidget cd = jss.Deserialize<ChangeDataWidget>(change.ChangeString);
            newActiveWidget.WidgetId = cd.Id;
            newActiveWidget.Name = cd.Name;
            newActiveWidget.Type = cd.Type;
            newActiveWidget.Data = cd.Data;

            /*creem si o entitate in bd*/
            Widget newWidget = new Widget();
            newActiveWidget.WidgetEntity = newWidget;
            newWidget.WidgetId = cd.Id;
            newWidget.Order = cd.Order;
            newWidget.LayerId = cd.LayerId;
            newWidget.Name = cd.Name;
            newWidget.Data = cd.Data;

            /*inseram in listele de widgeturi din layer*/
            try {
                lock (b.Layers[cd.LayerId].Widgets) {
                    b.Layers[cd.LayerId].Widgets.Add(cd.Id, newActiveWidget);
                }
                lock (b.Layers[cd.LayerId].WidgetsStack) {
                    b.Layers[cd.LayerId].WidgetsStack.Insert(cd.Order, newActiveWidget);
                }
            } catch (KeyNotFoundException) {
            }

            this._em.AddToWidgets(newWidget);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        private void _AddUser(ActiveBoard b, Change change) {
            ActiveUser user = new ActiveUser();
            /*deserializam obiectul primit*/
            var jss = new JavaScriptSerializer();
            ChangeDataUser cd = jss.Deserialize<ChangeDataUser>(change.ChangeString);

            this.AddUser(b.BoardEntity.Id, cd.Name);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        private void _ChangeLayer(ActiveBoard b, Change change) {
            /*verificam ce s-a schimbat */
            var jss = new JavaScriptSerializer();
            ChangeDataLayer cd = jss.Deserialize<ChangeDataLayer>(change.ChangeString);

            /*cautam activelayer-ul corespunzator*/
            if (!b.Layers.ContainsKey(cd.Id))
                throw new Exception("Changed layer id not found");

            ActiveLayer l = b.Layers[cd.Id];

            /*modificam campurile*/
            l.Name = cd.Name;
            l.LayerEntity.Name = cd.Name;

            /*  daca e schimbat orderul, trebuie refacut stack-ul */
            if (cd.Order != l.LayerEntity.Order) {
                l.LayerEntity.Order = cd.Order;
                /*il stergem din pozitia existenta*/
                b.LayerStack.Remove(l);
                /*il reinseram*/
                b.LayerStack.Insert(cd.Order, l);
            }
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        private void _ChangeWidget(ActiveBoard b, Change change) {
            /*verificam ce s-a schimbat */
            var jss = new JavaScriptSerializer();
            ChangeDataWidget cd = null;
            try {
                cd = jss.Deserialize<ChangeDataWidget>(change.ChangeString);
            } catch {
                return;
            }

            /*cautam activelayer-ul parinte*/
            if (!b.Layers.ContainsKey(cd.LayerId))
                throw new Exception("Parent layer id for changed widget not found");

            ActiveLayer l = b.Layers[cd.LayerId];
            ActiveWidget w = null;

            /*cautam activewidget-ul corespunzator*/
            if (!l.Widgets.ContainsKey(cd.Id))
                throw new Exception("Changed widget id not found");
            try {
                w = l.Widgets[cd.Id];
            } catch (KeyNotFoundException){
                return;
            }


            /*modificam campurile*/
            w.Name = (w.WidgetEntity.Name = cd.Name);
            w.Type = (w.WidgetEntity.Type = cd.Type);
            w.Data = (w.WidgetEntity.Data = cd.Data);

            /*  daca e schimbat orderul, trebuie refacut stack-ul */
            if (cd.Order != w.WidgetEntity.Order) {
                w.WidgetEntity.Order = cd.Order;
                /*il stergem din pozitia existenta*/
                l.WidgetsStack.Remove(w);
                /*il reinseram*/
                l.WidgetsStack.Insert(cd.Order, w);
            }
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public List<Change> GetChanges(int boardId, IPrincipal user) {
            /*iei modificarile din lista utilizatorlui, si o intorci*/
            /*resetezi lista de modificari*/
            ActiveBoard board = this.GetBoard(boardId);
            if (board == null)
                return new List<Change>();

            if (!board.UsersTable.ContainsKey(user.Identity.Name)) {
                return new List<Change>();
            }

            ActiveUser u = board.UsersTable[user.Identity.Name];
            List<Change> ret = new List<Change>();
            lock (u.Changes) {
                foreach (Change ch in u.Changes)
                    ret.Add(ch);
            }
            u.Changes.Clear();

            return ret;
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void AddUser(int boardId, String userName) {
            ActiveBoard board = this.GetBoard(boardId);

            /*cream un nou user*/
            ActiveUser user = new ActiveUser() {
                Changes = new List<Change>(),
                Right = ActiveUser.Rights.Write,
                Username = userName
            };

            /*cream si o noua entitate*/
            UserRight entity = new UserRight() {
                BoardId = boardId,
                Right = 1,
                User = userName
            };

            user.Entity = entity;

            /*adaugam in bd*/
            lock (this._em.UserRights) {
                this._em.UserRights.AddObject(user.Entity);
            }
            /*adaugam si in active board*/
            board.UsersTable.Add(user.Username, user);

        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void RemoveUser(int boardId, String user) {

        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------

        public void Save() {
            /*refacem campul order pentru widgeturi si layere */
            foreach (ActiveBoard b in this._activeBoards.Values) {
                for (int i = 0; i < b.LayerStack.Count(); i++) {
                    ActiveLayer layer = b.LayerStack[i];
                    layer.LayerEntity.Order = i;
                    for (int j = 0; j < layer.WidgetsStack.Count(); j++) {
                        ActiveWidget widget = layer.WidgetsStack[j];
                        widget.WidgetEntity.Order = j;
                    }
                    
                }
            }

            /*salvam baza de date*/
            try {
                this._em.SaveChanges();
            } catch (Exception ex) {
            }
            
        }
    }
}