using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusManagmentSystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdateScheduleWithFirstAndLastDeparture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DepartureTime",
                table: "Schedules",
                newName: "LastDepartureTime");

            migrationBuilder.AddColumn<DateTime>(
                name: "FirstDepartureTime",
                table: "Schedules",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstDepartureTime",
                table: "Schedules");

            migrationBuilder.RenameColumn(
                name: "LastDepartureTime",
                table: "Schedules",
                newName: "DepartureTime");
        }
    }
}
