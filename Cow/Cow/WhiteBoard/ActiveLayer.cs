using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.ObjectModel;

namespace Cow.WhiteBoard {
    public class ActiveLayer {
        /*id-ul stratului*/
        public int Id { get; set; }
        /*numele stratului*/
        public String Name { get; set; }

        /*lista de widgeturi grupate pe id-ul lor*/
        private Dictionary<int, ActiveWidget> _widgets = new Dictionary<int, ActiveWidget>();
        /*lista de widgeturi grupate dupa ordinea in care vor fi desenate*/
        private List<ActiveWidget> _widgetsStack = new List<ActiveWidget>();

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ActiveWidget GetWidget(int id) {
            try{
                return this._widgets[id];
            }
            catch (KeyNotFoundException) {
                 return null;
            }
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void AddWidget(ActiveWidget widget) {
            this._widgets[widget.Id] = widget;
            /*adaugam in coada liste - */
            this._widgetsStack.Add(widget);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void RemoveWidget(ActiveWidget widget) {
            this._widgets.Remove(widget.Id);
            this._widgetsStack.Remove(widget); 
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void RemoveWidget(int id) {
            try {
                this._widgetsStack.Remove(this._widgets[id]);
                this._widgets.Remove(id);
            } catch (KeyNotFoundException) {
            }
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ReadOnlyCollection<ActiveWidget> GetWidgetList() {
            return this._widgetsStack.AsReadOnly();
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
				
    }
}