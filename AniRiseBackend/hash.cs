using System;
using BCrypt.Net;

class MyHash
{
    static void Main()
    {
        string password = "9LLx32_1#";
        string hash = BCrypt.Net.BCrypt.HashPassword(password);
        Console.WriteLine(hash);
    }
}