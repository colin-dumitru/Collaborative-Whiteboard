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
        public ObjectSet<BoardEntity> BoardEntities
        {
            get
            {
                if ((_BoardEntities == null))
                {
                    _BoardEntities = base.CreateObjectSet<BoardEntity>("BoardEntities");
                }
                return _BoardEntities;
            }
        }
        private ObjectSet<BoardEntity> _BoardEntities;

        #endregion
        #region AddTo Methods
    
        /// <summary>
        /// Deprecated Method for adding a new object to the BoardEntities EntitySet. Consider using the .Add method of the associated ObjectSet&lt;T&gt; property instead.
        /// </summary>
        public void AddToBoardEntities(BoardEntity boardEntity)
        {
            base.AddObject("BoardEntities", boardEntity);
        }

        #endregion
    }
    

    #endregion
    
    #region Entities
    
    /// <summary>
    /// No Metadata Documentation available.
    /// </summary>
    [EdmEntityTypeAttribute(NamespaceName="Models", Name="BoardEntity")]
    [Serializable()]
    [DataContractAttribute(IsReference=true)]
    public partial class BoardEntity : EntityObject
    {
        #region Factory Method
    
        /// <summary>
        /// Create a new BoardEntity object.
        /// </summary>
        /// <param name="id">Initial value of the Id property.</param>
        /// <param name="owner">Initial value of the Owner property.</param>
        /// <param name="name">Initial value of the Name property.</param>
        public static BoardEntity CreateBoardEntity(global::System.Int32 id, global::System.String owner, global::System.String name)
        {
            BoardEntity boardEntity = new BoardEntity();
            boardEntity.Id = id;
            boardEntity.Owner = owner;
            boardEntity.Name = name;
            return boardEntity;
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

    #endregion
    
}