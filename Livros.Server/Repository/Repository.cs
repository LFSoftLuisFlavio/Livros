using Livros.Server.Models;
using Livros.Server.Repository;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Livros.Server.Repository
{
    public class Repository : IRepository
    {
        private readonly ApplicationDBContext _context;

        public Repository(ApplicationDBContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Adiciona uma entidade ao contexto
        public void Add<T>(T entity) where T : class
        {
            _context.Set<T>().Add(entity);
        }

        // Atualiza uma entidade existente
        public void Update<T>(T entity) where T : class
        {
            _context.Set<T>().Update(entity);
        }

        // Remove uma entidade do contexto
        public void Delete<T>(T entity) where T : class
        {
            _context.Set<T>().Remove(entity);
        }

        // Retorna todas as entidades que correspondem ao predicado
        public IQueryable<T> Where<T>(Expression<Func<T, bool>> predicate) where T : class
        {
            return _context.Set<T>().Where(predicate);
        }
        public bool Any<T>(Expression<Func<T, bool>> predicate) where T : class
        {
            return _context.Set<T>().Any(predicate);
        }

        // Retorna uma entidade pelo ID
        public async Task<T> GetByIdAsync<T>(int id) where T : class
        {
            return await _context.Set<T>().FindAsync(id);
        }

        // Salva as mudanças de forma assíncrona e trata possíveis exceções
        public async Task<(bool Success, string ErrorMessage)> SaveChangesAsync()
        {
            try
            {
                var changes = await _context.SaveChangesAsync();
                return (changes > 0, string.Empty);
            }
            catch (DbUpdateException dbEx)
            {
                // Trata exceções relacionadas a atualizações no banco de dados
                var errorMessage = dbEx.InnerException?.Message ?? dbEx.Message;
                return (false, errorMessage);
            }
            catch (Exception ex)
            {
                // Trata outras exceções
                return (false, ex.Message);
            }
        }
        public async Task<Livro[]> GetAllLivrosAsync()
        {
            IQueryable<Livro> query = _context.Livros;


            query = query.Include(au => au.AutorCodAus).Include(assun=>assun.AssuntoCodAs);


            query = query.Where(x=>x.Ativo).AsNoTracking().OrderBy(c => c.Titulo);

            return await query.ToArrayAsync();
        }
        public async Task<Livro> GetLivrosByIdWhithFKAsync(int id)
        {
            return _context.Livros.Include(x => x.AutorCodAus).Include(x => x.AssuntoCodAs).FirstOrDefault(x=>x.Codl==id);
        }

        public async Task<List<Viewrelatoriolivrosdoautor>> GetLivrosDoAutorAsync()
        {
            return await _context.viewrelatoriolivrosdoautor.ToListAsync();
        }
    }
}