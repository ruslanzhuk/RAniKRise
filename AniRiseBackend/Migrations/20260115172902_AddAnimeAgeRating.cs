using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AniRiseBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddAnimeAgeRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AgeRating",
                table: "Animes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgeRating",
                table: "Animes");
        }
    }
}
