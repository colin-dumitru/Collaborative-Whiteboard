﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Cow.Models;
using System.Security.Principal;
using System.Web.Mvc;

namespace Cow.Data {
    public class BoardEntityManager : IDisposable{
        private CowEntities _em = null;

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public BoardEntityManager() {
            /*ne conectam la baza de date*/
            this._em = new CowEntities();
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        ~BoardEntityManager() {
            this.Dispose();
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public BoardEntity CreateBoard(IPrincipal user, String name) {
            if (!user.Identity.IsAuthenticated)
                return null;

            /*cream o tabla goala*/
            BoardEntity tmp = new BoardEntity();
            tmp.Name = name;
            tmp.Owner = user.Identity.Name;

            /*o adaugam in abza noastra de date*/
            this._em.AddToBoardEntities(tmp);
            /*salvam schimbarile*/
            this._em.SaveChanges();

            return tmp;
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public Boolean DeleteBoard(IPrincipal user, int boardId) {
            if (!user.Identity.IsAuthenticated)
                return false;

            /*verificam daca tabla exista*/
            var boards = (from b in this._em.BoardEntities
                          where b.Id == boardId
                          select b).ToList() ;

            if (boards.Count <= 0)
                return false;

            BoardEntity board = boards[0];

            /*verificam daca a fost creat de userul dat*/
            if (board.Owner.Trim() != user.Identity.Name.Trim())
                return false;

            /*daca totul este ok, stergem tabal*/
            this._em.BoardEntities.DeleteObject(board);
            /*salvam modificarile*/
            this._em.SaveChanges();

            return true;
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public BoardEntity GetBoard( int boardId) {
            /*verificam daca tabla exista*/
            var boards = (from b in this._em.BoardEntities
                          where b.Id == boardId
                          select b).ToList();

            if (boards.Count <= 0)
                return null;

            return boards[0];

        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        public List<BoardEntity> GetBoards(IPrincipal user) {
             if (!user.Identity.IsAuthenticated)
                return new List<BoardEntity>();

             return (from b in this._em.BoardEntities
                        where b.Owner.Trim() == user.Identity.Name.Trim()
                        select b).ToList();
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------


        public void Dispose() {
            /*salvam modificarile in bd*/
            this._em.SaveChanges();
        }
    }
}