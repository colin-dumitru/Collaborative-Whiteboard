﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.ObjectModel;
using Cow.Models;

namespace Cow.WhiteBoard {
    public class ActiveLayer {
        /*id-ul stratului*/
        public int Id { get; set; }
        /*numele stratului*/
        public String Name { get; set; }
        /* entitatea din bd corespunzatoare*/
        public Layer LayerEntity { get; set; } 


        /*lista de widgeturi grupate pe id-ul lor*/
        public Dictionary<int, ActiveWidget> Widgets = new Dictionary<int, ActiveWidget>();
        /*lista de widgeturi grupate dupa ordinea in care vor fi desenate*/
        public List<ActiveWidget> WidgetsStack = new List<ActiveWidget>();

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public ActiveWidget GetWidget(int id) {
            try{
                return this.Widgets[id];
            }
            catch (KeyNotFoundException) {
                 return null;
            }
        }

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        /*public void AddWidget(ActiveWidget widget) {
            this.Widgets[widget.WidgetId] = widget;
            /*adaugam in coada liste - 
            this.WidgetsStack[widget.Order] = widget;
        }*/
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void RemoveWidget(ActiveWidget widget) {
            this.Widgets.Remove(widget.WidgetId);
            this.WidgetsStack.Remove(widget); 
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public void RemoveWidget(int id) {
            try {
                this.WidgetsStack.Remove(this.Widgets[id]);
                this.Widgets.Remove(id);
            } catch (KeyNotFoundException) {
            }
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
       /* public ReadOnlyCollection<ActiveWidget> GetWidgetList() {
            return this.WidgetsStack.AsReadOnly();
        }*/
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
				
    }
}