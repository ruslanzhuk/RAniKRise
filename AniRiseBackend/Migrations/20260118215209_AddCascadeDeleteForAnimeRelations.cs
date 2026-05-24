using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AniRiseBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDeleteForAnimeRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimeAuthor_Authors_AuthorId",
                table: "AnimeAuthor");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeCharacters_Characters_CharacterId",
                table: "AnimeCharacters");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeGenres_Genres_GenreId",
                table: "AnimeGenres");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeMedias_Medias_MediaId",
                table: "AnimeMedias");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeStudios_Studios_StudioId",
                table: "AnimeStudios");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeAuthor_Authors_AuthorId",
                table: "AnimeAuthor",
                column: "AuthorId",
                principalTable: "Authors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeCharacters_Characters_CharacterId",
                table: "AnimeCharacters",
                column: "CharacterId",
                principalTable: "Characters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeGenres_Genres_GenreId",
                table: "AnimeGenres",
                column: "GenreId",
                principalTable: "Genres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeMedias_Medias_MediaId",
                table: "AnimeMedias",
                column: "MediaId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeStudios_Studios_StudioId",
                table: "AnimeStudios",
                column: "StudioId",
                principalTable: "Studios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnimeAuthor_Authors_AuthorId",
                table: "AnimeAuthor");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeCharacters_Characters_CharacterId",
                table: "AnimeCharacters");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeGenres_Genres_GenreId",
                table: "AnimeGenres");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeMedias_Medias_MediaId",
                table: "AnimeMedias");

            migrationBuilder.DropForeignKey(
                name: "FK_AnimeStudios_Studios_StudioId",
                table: "AnimeStudios");

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeAuthor_Authors_AuthorId",
                table: "AnimeAuthor",
                column: "AuthorId",
                principalTable: "Authors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeCharacters_Characters_CharacterId",
                table: "AnimeCharacters",
                column: "CharacterId",
                principalTable: "Characters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeGenres_Genres_GenreId",
                table: "AnimeGenres",
                column: "GenreId",
                principalTable: "Genres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeMedias_Medias_MediaId",
                table: "AnimeMedias",
                column: "MediaId",
                principalTable: "Medias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnimeStudios_Studios_StudioId",
                table: "AnimeStudios",
                column: "StudioId",
                principalTable: "Studios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
