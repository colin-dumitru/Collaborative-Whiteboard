
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, and Azure
-- --------------------------------------------------
-- Date Created: 01/22/2012 14:34:08
-- Generated from EDMX file: C:\Users\bkt\Desktop\CoW\Cow\Cow\Models\BoardModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [cow_db];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Boards]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Boards];
GO
IF OBJECT_ID(N'[dbo].[Layers]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Layers];
GO
IF OBJECT_ID(N'[dbo].[Widgets]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Widgets];
GO
IF OBJECT_ID(N'[dbo].[UserRights]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserRights];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Boards'
CREATE TABLE [dbo].[Boards] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Owner] nvarchar(max)  NOT NULL,
    [Name] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Layers'
CREATE TABLE [dbo].[Layers] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [BoardId] int  NOT NULL,
    [LayerId] int  NOT NULL,
    [Order] int  NOT NULL,
    [Name] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Widgets'
CREATE TABLE [dbo].[Widgets] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [LayerId] int  NOT NULL,
    [Data] nvarchar(max)  NOT NULL,
    [WidgetId] int  NOT NULL,
    [Type] nvarchar(max)  NOT NULL,
    [Order] int  NOT NULL,
    [Name] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'UserRights'
CREATE TABLE [dbo].[UserRights] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [BoardId] int  NOT NULL,
    [User] nvarchar(max)  NOT NULL,
    [Right] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Boards'
ALTER TABLE [dbo].[Boards]
ADD CONSTRAINT [PK_Boards]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Layers'
ALTER TABLE [dbo].[Layers]
ADD CONSTRAINT [PK_Layers]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Widgets'
ALTER TABLE [dbo].[Widgets]
ADD CONSTRAINT [PK_Widgets]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UserRights'
ALTER TABLE [dbo].[UserRights]
ADD CONSTRAINT [PK_UserRights]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------