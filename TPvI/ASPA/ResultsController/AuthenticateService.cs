using BSTU.Results.Authenticate.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BSTU.Results.Authenticate
{
    public class AuthenticateService : IAuthenticateService
    {
        private readonly List<UserDto> _users = new()
        {
            new UserDto { Login = "reader", Password = "reader123", Role = "READER" },
            new UserDto { Login = "writer", Password = "writer123", Role = "WRITER" }
        };

        public bool SignIn(HttpContext httpContext, string login, string password)
        {
            var user = _users.FirstOrDefault(u => u.Login == login && u.Password == password);
            if (user == null) return false;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Login),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            httpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity)
            ).Wait();

            return true;
        }

        public void SignOut(HttpContext httpContext)
        {
            httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
        }
    }
}
