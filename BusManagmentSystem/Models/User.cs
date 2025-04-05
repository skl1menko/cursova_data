using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
    public class User
    {
        public int UserId { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string Role { get; set; }

        // Зовнішній ключ до водія
        public int? DriverId { get; set; }

        [ForeignKey("DriverId")]
        public Driver? Driver { get; set; }
    }

