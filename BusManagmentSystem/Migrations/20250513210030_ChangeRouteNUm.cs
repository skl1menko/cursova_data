using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusManagmentSystem.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRouteNUm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stops_Routes_RouteNumber",
                table: "Stops");

            migrationBuilder.RenameColumn(
                name: "RouteNumber",
                table: "Stops",
                newName: "RouteId");

            migrationBuilder.RenameIndex(
                name: "IX_Stops_RouteNumber",
                table: "Stops",
                newName: "IX_Stops_RouteId");

            migrationBuilder.AlterColumn<int>(
                name: "RouteNumber",
                table: "Routes",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Stops_Routes_RouteId",
                table: "Stops",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "RouteId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stops_Routes_RouteId",
                table: "Stops");

            migrationBuilder.RenameColumn(
                name: "RouteId",
                table: "Stops",
                newName: "RouteNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Stops_RouteId",
                table: "Stops",
                newName: "IX_Stops_RouteNumber");

            migrationBuilder.AlterColumn<string>(
                name: "RouteNumber",
                table: "Routes",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Stops_Routes_RouteNumber",
                table: "Stops",
                column: "RouteNumber",
                principalTable: "Routes",
                principalColumn: "RouteId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
