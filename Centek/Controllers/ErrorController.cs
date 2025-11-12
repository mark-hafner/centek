using Microsoft.AspNetCore.Mvc;

namespace Centek.Controllers
{
    public class ErrorController : Controller
    {
        [Route("Error/{statusCode}")]
        public IActionResult HttpStatusCodeHandler(int statusCode)
        {
            switch (statusCode)
            {
                case 404:
                    Response.StatusCode = 404;
                    return View("NotFound");
                case 403:
                    Response.StatusCode = 403;
                    return View("Forbidden");
                default:
                    Response.StatusCode = statusCode;
                    return View("GenericError", statusCode);
            }
        }

        [Route("Error/500")]
        public IActionResult ServerError()
        {
            Response.StatusCode = 500;
            return View("ServerError");
        }
    }
}
