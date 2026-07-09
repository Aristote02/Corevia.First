using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Corevia.First.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSupabaseAuthId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SupabaseAuthId",
                schema: "public",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_SupabaseAuthId",
                schema: "public",
                table: "users",
                column: "SupabaseAuthId",
                unique: true,
                filter: "\"SupabaseAuthId\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_users_SupabaseAuthId",
                schema: "public",
                table: "users");

            migrationBuilder.DropColumn(
                name: "SupabaseAuthId",
                schema: "public",
                table: "users");
        }
    }
}
