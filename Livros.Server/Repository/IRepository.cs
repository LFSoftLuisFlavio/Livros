using Livros.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Livros.Server.Repository
{
    public interface IRepository
    {
        //GERAL
        void Add<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        IQueryable<T> Where<T>(Expression<Func<T, bool>> predicate)where T : class;
        bool Any<T>(Expression<Func<T, bool>> predicate) where T : class;
        Task<T> GetByIdAsync<T>(int id) where T : class;
        Task<(bool Success, string ErrorMessage)> SaveChangesAsync();
        Task<Livro[]> GetAllLivrosAsync();
        Task<Livro> GetLivrosByIdWhithFKAsync(int id);
        Task<List<Viewrelatoriolivrosdoautor>> GetLivrosDoAutorAsync();
    }
}
