using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BSTU.Results.Authenticate
{
    public interface IAuthenticateService
    {
        bool SignIn(HttpContext httpContext, string login, string password);
        void SignOut(HttpContext httpContext);
    }
}
