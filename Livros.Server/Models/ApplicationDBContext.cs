using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Livros.Server.Models;

public partial class ApplicationDBContext : DbContext
{
    public ApplicationDBContext()
    {
    }

    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Assunto> Assuntos { get; set; }

    public virtual DbSet<Autor> Autors { get; set; }

    public virtual DbSet<Livro> Livros { get; set; }

    public virtual DbSet<TipoVendum> TipoVenda { get; set; }

    public virtual DbSet<VendaLivro> VendaLivros { get; set; }

    public virtual DbSet<Vendum> Venda { get; set; }

    public DbSet<Viewrelatoriolivrosdoautor> viewrelatoriolivrosdoautor { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=db_livros;uid=root;password=1234", Microsoft.EntityFrameworkCore.ServerVersion.Parse("5.7.18-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8_general_ci")
            .HasCharSet("utf8");

        modelBuilder.Entity<Assunto>(entity =>
        {
            entity.HasKey(e => e.CodAs).HasName("PRIMARY");

            entity.ToTable("assunto");

            entity.Property(e => e.CodAs).HasColumnType("int(11)");
            entity.Property(e => e.Descricao).HasMaxLength(20);
        });

        modelBuilder.Entity<Autor>(entity =>
        {
            entity.HasKey(e => e.CodAu).HasName("PRIMARY");

            entity.ToTable("autor");

            entity.Property(e => e.CodAu).HasColumnType("int(11)");
            entity.Property(e => e.Nome).HasMaxLength(40);
        });

        modelBuilder.Entity<Livro>(entity =>
        {
            entity.HasKey(e => e.Codl).HasName("PRIMARY");

            entity.ToTable("livro");

            entity.Property(e => e.Codl).HasColumnType("int(11)");
            entity.Property(e => e.AnoPublicacao).HasMaxLength(4);
            entity.Property(e => e.Editora).HasMaxLength(40);
            entity.Property(e => e.EstoqueInicial).HasColumnType("int(11)");
            entity.Property(e => e.Titulo).HasMaxLength(40);
            entity.Property(e => e.ValorUnitario).HasPrecision(11, 2);

            entity.HasMany(d => d.AssuntoCodAs).WithMany(p => p.LivroCodls)
                .UsingEntity<Dictionary<string, object>>(
                    "LivroAssunto",
                    r => r.HasOne<Assunto>().WithMany()
                        .HasForeignKey("AssuntoCodAs")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Livro_Assunto_FKIndex2"),
                    l => l.HasOne<Livro>().WithMany()
                        .HasForeignKey("LivroCodl")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Livro_Assunto_FKIndex1"),
                    j =>
                    {
                        j.HasKey("LivroCodl", "AssuntoCodAs")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("livro_assunto");
                        j.HasIndex(new[] { "AssuntoCodAs" }, "Livro_Assunto_FKIndex2_idx");
                        j.IndexerProperty<int>("LivroCodl")
                            .HasColumnType("int(11)")
                            .HasColumnName("Livro_Codl");
                        j.IndexerProperty<int>("AssuntoCodAs")
                            .HasColumnType("int(11)")
                            .HasColumnName("Assunto_CodAs");
                    });

            entity.HasMany(d => d.AutorCodAus).WithMany(p => p.LivroCodls)
                .UsingEntity<Dictionary<string, object>>(
                    "LivroAutor",
                    r => r.HasOne<Autor>().WithMany()
                        .HasForeignKey("AutorCodAu")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Livro_Autor_FKIndex2"),
                    l => l.HasOne<Livro>().WithMany()
                        .HasForeignKey("LivroCodl")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Livro_Autor_FKIndex1"),
                    j =>
                    {
                        j.HasKey("LivroCodl", "AutorCodAu")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("livro_autor");
                        j.HasIndex(new[] { "AutorCodAu" }, "Livro_Autor_FKIndex2_idx");
                        j.IndexerProperty<int>("LivroCodl")
                            .HasColumnType("int(11)")
                            .HasColumnName("Livro_Codl");
                        j.IndexerProperty<int>("AutorCodAu")
                            .HasColumnType("int(11)")
                            .HasColumnName("Autor_CodAu");
                    });
        });

        modelBuilder.Entity<TipoVendum>(entity =>
        {
            entity.HasKey(e => e.CodTv).HasName("PRIMARY");

            entity.ToTable("tipo_venda");

            entity.Property(e => e.CodTv).HasColumnType("int(11)");
            entity.Property(e => e.Descricao).HasMaxLength(20);
            entity.Property(e => e.PorcentagemDesconto).HasPrecision(5, 2);
        });

        modelBuilder.Entity<VendaLivro>(entity =>
        {
            entity.HasKey(e => e.CodVl).HasName("PRIMARY");

            entity.ToTable("venda_livro");

            entity.HasIndex(e => e.LivroCodl, "Venda_Livro_FKIndex1_idx");

            entity.HasIndex(e => e.VendaCodV, "Venda_Livro_FKIndex2_idx");

            entity.Property(e => e.CodVl).HasColumnType("int(11)");
            entity.Property(e => e.LivroCodl)
                .HasColumnType("int(11)")
                .HasColumnName("Livro_Codl");
            entity.Property(e => e.Quantidade).HasColumnType("int(11)");
            entity.Property(e => e.ValorDesconto).HasPrecision(11, 2);
            entity.Property(e => e.ValorTotal).HasPrecision(15, 2);
            entity.Property(e => e.ValorUnitario).HasPrecision(11, 2);
            entity.Property(e => e.VendaCodV)
                .HasColumnType("int(11)")
                .HasColumnName("Venda_CodV");

            entity.HasOne(d => d.LivroCodlNavigation).WithMany(p => p.VendaLivros)
                .HasForeignKey(d => d.LivroCodl)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Venda_Livro_FKIndex1");

            entity.HasOne(d => d.VendaCodVNavigation).WithMany(p => p.VendaLivros)
                .HasForeignKey(d => d.VendaCodV)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Venda_Livro_FKIndex2");
        });

        modelBuilder.Entity<Vendum>(entity =>
        {
            entity.HasKey(e => e.CodV).HasName("PRIMARY");

            entity.ToTable("venda");

            entity.HasIndex(e => e.TipoVendaCodTv, "venda_FKIndex1_idx");

            entity.Property(e => e.CodV).HasColumnType("int(11)");
            entity.Property(e => e.Cliente).HasMaxLength(50);
            entity.Property(e => e.ConsumidorFinal).HasColumnName("consumidorFinal");
            entity.Property(e => e.DataVenda).HasColumnType("datetime");
            entity.Property(e => e.TipoVendaCodTv)
                .HasColumnType("int(11)")
                .HasColumnName("Tipo_Venda_CodTv");

            entity.HasOne(d => d.TipoVendaCodTvNavigation).WithMany(p => p.Venda)
                .HasForeignKey(d => d.TipoVendaCodTv)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("venda_FKIndex1");
        });

        modelBuilder.Entity<Viewrelatoriolivrosdoautor>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("viewrelatoriolivrosdoautor");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
