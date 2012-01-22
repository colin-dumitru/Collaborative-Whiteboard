﻿//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Data.Objects;
using System.Data.Objects.DataClasses;
using System.Data.EntityClient;
using System.ComponentModel;
using System.Xml.Serialization;
using System.Runtime.Serialization;

[assembly: EdmSchemaAttribute()]

namespace Cow.Models
{
    #region Contexts
    
    /// <summary>
    /// No Metadata Documentation available.
    /// </summary>
    public partial class CowEntities : ObjectContext
    {
        #region Constructors
    
        /// <summary>
        /// Initializes a new CowEntities object using the connection string found in the 'CowEntities' section of the application configuration file.
        /// </summary>
        public CowEntities() : base("name=CowEntities", "CowEntities")
        {
            this.ContextOptions.LazyLoadingEnabled = true;
            OnContextCreated();
        }
    
        /// <summary>
        /// Initialize a new CowEntities object.
        /// </summary>
        public CowEntities(string connectionString) : base(connectionString, "CowEntities")
        {
            this.ContextOptions.LazyLoadingEnabled = true;
            OnContextCreated();
        }
    
        /// <summary>
        /// Initialize a new CowEntities object.
        /// </summary>
        public CowEntities(EntityConnection connection) : base(connection, "CowEntities")
        {
            this.ContextOptions.LazyLoadingEnabled = true;
            OnContextCreated();
        }
    
        #endregion
    
        #region Partial Methods
    
        partial void OnContextCreated();
    
        #endregion
    
        #region ObjectSet Properties
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        public ObjectSet<Board> Boards
        {
            get
            {
                if ((_Boards == null))
                {
                    _Boards = base.CreateObjectSet<Board>("Boards");
                }
                return _Boards;
            }
        }
        private ObjectSet<Board> _Boards;
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        public ObjectSet<Layer> Layers
        {
            get
            {
                if ((_Layers == null))
                {
                    _Layers = base.CreateObjectSet<Layer>("Layers");
                }
                return _Layers;
            }
        }
        private ObjectSet<Layer> _Layers;
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        public ObjectSet<Widget> Widgets
        {
            get
            {
                if ((_Widgets == null))
                {
                    _Widgets = base.CreateObjectSet<Widget>("Widgets");
                }
                return _Widgets;
            }
        }
        private ObjectSet<Widget> _Widgets;
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        public ObjectSet<UserRight> UserRights
        {
            get
            {
                if ((_UserRights == null))
                {
                    _UserRights = base.CreateObjectSet<UserRight>("UserRights");
                }
                return _UserRights;
            }
        }
        private ObjectSet<UserRight> _UserRights;

        #endregion
        #region AddTo Methods
    
        /// <summary>
        /// Deprecated Method for adding a new object to the Boards EntitySet. Consider using the .Add method of the associated ObjectSet&lt;T&gt; property instead.
        /// </summary>
        public void AddToBoards(Board board)
        {
            base.AddObject("Boards", board);
        }
    
        /// <summary>
        /// Deprecated Method for adding a new object to the Layers EntitySet. Consider using the .Add method of the associated ObjectSet&lt;T&gt; property instead.
        /// </summary>
        public void AddToLayers(Layer layer)
        {
            base.AddObject("Layers", layer);
        }
    
        /// <summary>
        /// Deprecated Method for adding a new object to the Widgets EntitySet. Consider using the .Add method of the associated ObjectSet&lt;T&gt; property instead.
        /// </summary>
        public void AddToWidgets(Widget widget)
        {
            base.AddObject("Widgets", widget);
        }
    
        /// <summary>
        /// Deprecated Method for adding a new object to the UserRights EntitySet. Consider using the .Add method of the associated ObjectSet&lt;T&gt; property instead.
        /// </summary>
        public void AddToUserRights(UserRight userRight)
        {
            base.AddObject("UserRights", userRight);
        }

        #endregion
    }
    

    #endregion
    
    #region Entities
    
    /// <summary>
    /// No Metadata Documentation available.
    /// </summary>
    [EdmEntityTypeAttribute(NamespaceName="Models", Name="Board")]
    [Serializable()]
    [DataContractAttribute(IsReference=true)]
    public partial class Board : EntityObject
    {
        #region Factory Method
    
        /// <summary>
        /// Create a new Board object.
        /// </summary>
        /// <param name="id">Initial value of the Id property.</param>
        /// <param name="owner">Initial value of the Owner property.</param>
        /// <param name="name">Initial value of the Name property.</param>
        public static Board CreateBoard(global::System.Int32 id, global::System.String owner, global::System.String name)
        {
            Board board = new Board();
            board.Id = id;
            board.Owner = owner;
            board.Name = name;
            return board;
        }

        #endregion
        #region Primitive Properties
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=true, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 Id
        {
            get
            {
                return _Id;
            }
            set
            {
                if (_Id != value)
                {
                    OnIdChanging(value);
                    ReportPropertyChanging("Id");
                    _Id = StructuralObject.SetValidValue(value);
                    ReportPropertyChanged("Id");
                    OnIdChanged();
                }
            }
        }
        private global::System.Int32 _Id;
        partial void OnIdChanging(global::System.Int32 value);
        partial void OnIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.String Owner
        {
            get
            {
                return _Owner;
            }
            set
            {
                OnOwnerChanging(value);
                ReportPropertyChanging("Owner");
                _Owner = StructuralObject.SetValidValue(value, false);
                ReportPropertyChanged("Owner");
                OnOwnerChanged();
            }
        }
        private global::System.String _Owner;
        partial void OnOwnerChanging(global::System.String value);
        partial void OnOwnerChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.String Name
        {
            get
            {
                return _Name;
            }
            set
            {
                OnNameChanging(value);
                ReportPropertyChanging("Name");
                _Name = StructuralObject.SetValidValue(value, false);
                ReportPropertyChanged("Name");
                OnNameChanged();
            }
        }
        private global::System.String _Name;
        partial void OnNameChanging(global::System.String value);
        partial void OnNameChanged();

        #endregion
    
    }
    
    /// <summary>
    /// No Metadata Documentation available.
    /// </summary>
    [EdmEntityTypeAttribute(NamespaceName="Models", Name="Layer")]
    [Serializable()]
    [DataContractAttribute(IsReference=true)]
    public partial class Layer : EntityObject
    {
        #region Factory Method
    
        /// <summary>
        /// Create a new Layer object.
        /// </summary>
        /// <param name="id">Initial value of the Id property.</param>
        /// <param name="boardId">Initial value of the BoardId property.</param>
        /// <param name="layerId">Initial value of the LayerId property.</param>
        /// <param name="order">Initial value of the Order property.</param>
        /// <param name="name">Initial value of the Name property.</param>
        public static Layer CreateLayer(global::System.Int32 id, global::System.Int32 boardId, global::System.Int32 layerId, global::System.Int32 order, global::System.String name)
        {
            Layer layer = new Layer();
            layer.Id = id;
            layer.BoardId = boardId;
            layer.LayerId = layerId;
            layer.Order = order;
            layer.Name = name;
            return layer;
        }

        #endregion
        #region Primitive Properties
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=true, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 Id
        {
            get
            {
                return _Id;
            }
            set
            {
                if (_Id != value)
                {
                    OnIdChanging(value);
                    ReportPropertyChanging("Id");
                    _Id = StructuralObject.SetValidValue(value);
                    ReportPropertyChanged("Id");
                    OnIdChanged();
                }
            }
        }
        private global::System.Int32 _Id;
        partial void OnIdChanging(global::System.Int32 value);
        partial void OnIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 BoardId
        {
            get
            {
                return _BoardId;
            }
            set
            {
                OnBoardIdChanging(value);
                ReportPropertyChanging("BoardId");
                _BoardId = StructuralObject.SetValidValue(value);
                ReportPropertyChanged("BoardId");
                OnBoardIdChanged();
            }
        }
        private global::System.Int32 _BoardId;
        partial void OnBoardIdChanging(global::System.Int32 value);
        partial void OnBoardIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 LayerId
        {
            get
            {
                return _LayerId;
            }
            set
            {
                OnLayerIdChanging(value);
                ReportPropertyChanging("LayerId");
                _LayerId = StructuralObject.SetValidValue(value);
                ReportPropertyChanged("LayerId");
                OnLayerIdChanged();
            }
        }
        private global::System.Int32 _LayerId;
        partial void OnLayerIdChanging(global::System.Int32 value);
        partial void OnLayerIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 Order
        {
            get
            {
                return _Order;
            }
            set
            {
                OnOrderChanging(value);
                ReportPropertyChanging("Order");
                _Order = StructuralObject.SetValidValue(value);
                ReportPropertyChanged("Order");
                OnOrderChanged();
            }
        }
        private global::System.Int32 _Order;
        partial void OnOrderChanging(global::System.Int32 value);
        partial void OnOrderChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.String Name
        {
            get
            {
                return _Name;
            }
            set
            {
                OnNameChanging(value);
                ReportPropertyChanging("Name");
                _Name = StructuralObject.SetValidValue(value, false);
                ReportPropertyChanged("Name");
                OnNameChanged();
            }
        }
        private global::System.String _Name;
        partial void OnNameChanging(global::System.String value);
        partial void OnNameChanged();

        #endregion
    
    }
    
    /// <summary>
    /// No Metadata Documentation available.
    /// </summary>
    [EdmEntityTypeAttribute(NamespaceName="Models", Name="UserRight")]
    [Serializable()]
    [DataContractAttribute(IsReference=true)]
    public partial class UserRight : EntityObject
    {
        #region Factory Method
    
        /// <summary>
        /// Create a new UserRight object.
        /// </summary>
        /// <param name="id">Initial value of the Id property.</param>
        /// <param name="boardId">Initial value of the BoardId property.</param>
        /// <param name="user">Initial value of the User property.</param>
        /// <param name="right">Initial value of the Right property.</param>
        public static UserRight CreateUserRight(global::System.Int32 id, global::System.Int32 boardId, global::System.String user, global::System.Int32 right)
        {
            UserRight userRight = new UserRight();
            userRight.Id = id;
            userRight.BoardId = boardId;
            userRight.User = user;
            userRight.Right = right;
            return userRight;
        }

        #endregion
        #region Primitive Properties
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=true, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 Id
        {
            get
            {
                return _Id;
            }
            set
            {
                if (_Id != value)
                {
                    OnIdChanging(value);
                    ReportPropertyChanging("Id");
                    _Id = StructuralObject.SetValidValue(value);
                    ReportPropertyChanged("Id");
                    OnIdChanged();
                }
            }
        }
        private global::System.Int32 _Id;
        partial void OnIdChanging(global::System.Int32 value);
        partial void OnIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 BoardId
        {
            get
            {
                return _BoardId;
            }
            set
            {
                OnBoardIdChanging(value);
                ReportPropertyChanging("BoardId");
                _BoardId = StructuralObject.SetValidValue(value);
                ReportPropertyChanged("BoardId");
                OnBoardIdChanged();
            }
        }
        private global::System.Int32 _BoardId;
        partial void OnBoardIdChanging(global::System.Int32 value);
        partial void OnBoardIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.String User
        {
            get
            {
                return _User;
            }
            set
            {
                OnUserChanging(value);
                ReportPropertyChanging("User");
                _User = StructuralObject.SetValidValue(value, false);
                ReportPropertyChanged("User");
                OnUserChanged();
            }
        }
        private global::System.String _User;
        partial void OnUserChanging(global::System.String value);
        partial void OnUserChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 Right
        {
            get
            {
                return _Right;
            }
            set
            {
                OnRightChanging(value);
                ReportPropertyChanging("Right");
                _Right = StructuralObject.SetValidValue(value);
                ReportPropertyChanged("Right");
                OnRightChanged();
            }
        }
        private global::System.Int32 _Right;
        partial void OnRightChanging(global::System.Int32 value);
        partial void OnRightChanged();

        #endregion
    
    }
    
    /// <summary>
    /// No Metadata Documentation available.
    /// </summary>
    [EdmEntityTypeAttribute(NamespaceName="Models", Name="Widget")]
    [Serializable()]
    [DataContractAttribute(IsReference=true)]
    public partial class Widget : EntityObject
    {
        #region Factory Method
    
        /// <summary>
        /// Create a new Widget object.
        /// </summary>
        /// <param name="id">Initial value of the Id property.</param>
        /// <param name="layerId">Initial value of the LayerId property.</param>
        /// <param name="data">Initial value of the Data property.</param>
        /// <param name="widgetId">Initial value of the WidgetId property.</param>
        /// <param name="type">Initial value of the Type property.</param>
        /// <param name="order">Initial value of the Order property.</param>
        /// <param name="name">Initial value of the Name property.</param>
        public static Widget CreateWidget(global::System.Int32 id, global::System.Int32 layerId, global::System.String data, global::System.Int32 widgetId, global::System.String type, global::System.Int32 order, global::System.String name)
        {
            Widget widget = new Widget();
            widget.Id = id;
            widget.LayerId = layerId;
            widget.Data = data;
            widget.WidgetId = widgetId;
            widget.Type = type;
            widget.Order = order;
            widget.Name = name;
            return widget;
        }

        #endregion
        #region Primitive Properties
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=true, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 Id
        {
            get
            {
                return _Id;
            }
            set
            {
                if (_Id != value)
                {
                    OnIdChanging(value);
                    ReportPropertyChanging("Id");
                    _Id = StructuralObject.SetValidValue(value);
                    ReportPropertyChanged("Id");
                    OnIdChanged();
                }
            }
        }
        private global::System.Int32 _Id;
        partial void OnIdChanging(global::System.Int32 value);
        partial void OnIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 LayerId
        {
            get
            {
                return _LayerId;
            }
            set
            {
                OnLayerIdChanging(value);
                ReportPropertyChanging("LayerId");
                _LayerId = StructuralObject.SetValidValue(value);
                ReportPropertyChanged("LayerId");
                OnLayerIdChanged();
            }
        }
        private global::System.Int32 _LayerId;
        partial void OnLayerIdChanging(global::System.Int32 value);
        partial void OnLayerIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.String Data
        {
            get
            {
                return _Data;
            }
            set
            {
                OnDataChanging(value);
                ReportPropertyChanging("Data");
                _Data = StructuralObject.SetValidValue(value, false);
                ReportPropertyChanged("Data");
                OnDataChanged();
            }
        }
        private global::System.String _Data;
        partial void OnDataChanging(global::System.String value);
        partial void OnDataChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 WidgetId
        {
            get
            {
                return _WidgetId;
            }
            set
            {
                OnWidgetIdChanging(value);
                ReportPropertyChanging("WidgetId");
                _WidgetId = StructuralObject.SetValidValue(value);
                ReportPropertyChanged("WidgetId");
                OnWidgetIdChanged();
            }
        }
        private global::System.Int32 _WidgetId;
        partial void OnWidgetIdChanging(global::System.Int32 value);
        partial void OnWidgetIdChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.String Type
        {
            get
            {
                return _Type;
            }
            set
            {
                OnTypeChanging(value);
                ReportPropertyChanging("Type");
                _Type = StructuralObject.SetValidValue(value, false);
                ReportPropertyChanged("Type");
                OnTypeChanged();
            }
        }
        private global::System.String _Type;
        partial void OnTypeChanging(global::System.String value);
        partial void OnTypeChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.Int32 Order
        {
            get
            {
                return _Order;
            }
            set
            {
                OnOrderChanging(value);
                ReportPropertyChanging("Order");
                _Order = StructuralObject.SetValidValue(value);
                ReportPropertyChanged("Order");
                OnOrderChanged();
            }
        }
        private global::System.Int32 _Order;
        partial void OnOrderChanging(global::System.Int32 value);
        partial void OnOrderChanged();
    
        /// <summary>
        /// No Metadata Documentation available.
        /// </summary>
        [EdmScalarPropertyAttribute(EntityKeyProperty=false, IsNullable=false)]
        [DataMemberAttribute()]
        public global::System.String Name
        {
            get
            {
                return _Name;
            }
            set
            {
                OnNameChanging(value);
                ReportPropertyChanging("Name");
                _Name = StructuralObject.SetValidValue(value, false);
                ReportPropertyChanged("Name");
                OnNameChanged();
            }
        }
        private global::System.String _Name;
        partial void OnNameChanging(global::System.String value);
        partial void OnNameChanged();

        #endregion
    
    }

    #endregion
    
}
