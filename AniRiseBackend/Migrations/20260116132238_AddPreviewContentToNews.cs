using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AniRiseBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddPreviewContentToNews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PreviewContent",
                table: "News",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PreviewContent",
                table: "News");
        }
    }
}
