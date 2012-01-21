using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.ObjectModel;

namespace Cow.WhiteBoard {
    public class Board {
        /*lista de layer-uri grupate pe id-ul lor*/
        private Dictionary<int, IWidget> _layers = new Dictionary<int, IWidget>();
        /*lista de layere grupate dupa ordinea in care vor fi desenate*/
        private List<Layer> _layerStack = new List<Layer>();

        /*urmatorul id unic pentru layere*/
        private int _lastLayerId = 0;
        /*urmatorul id unic pentru widgeturi*/
        private int _lastWidgetId = 0;

        /*lista de utilizatori ce au drepturi asupra tablei*/
        private List<User> _users = new List<User>();

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public Board() {
            /*cream un layer gol*/
            Layer layer = new Layer() {
                Id = this.GenerateLayerId(), 
                Name = "Default"
            };
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public int GenerateWidgetId() {
            return (this._lastWidgetId++);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public int GenerateLayerId() {
            return (this._lastLayerId++);
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ReadOnlyCollection<Layer> GetLayerList() {
            return this._layerStack.AsReadOnly();
        }
				
    }
}