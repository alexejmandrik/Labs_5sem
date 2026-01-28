using BSTU.Results.Collection;
using BSTU.Results.Collection.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BSTU.Results.Authenticate;
using BSTU.Results.Authenticate.Models;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace ASPA0010_1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultsController : ControllerBase
    {
        private readonly IResultsService _service;

        public ResultsController(IResultsService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "READER,WRITER")]
        public ActionResult<IEnumerable<ResultItem>> GetAll()
        {
            var items = _service.GetAll();
            if (!items.Any()) return NoContent();
            return Ok(items);
        }

        [HttpGet("{id:int}")]
        [Authorize(Roles = "READER,WRITER")]
        public ActionResult<ResultItem> Get(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        [Authorize(Roles = "WRITER")]
        public ActionResult<ResultItem> Create([FromBody] ResultCreateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Value))
                return BadRequest();

            var created = _service.Add(dto.Value);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "WRITER")]
        public ActionResult<ResultItem> Update(int id, [FromBody] ResultCreateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Value))
                return BadRequest();

            var updated = _service.Update(id, dto.Value);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "WRITER")]
        public IActionResult Delete(int id)
        {
            var deleted = _service.Delete(id);
            if (!deleted) return NotFound();
            return Ok();
        }

        [HttpPost("SignIn")]
        public IActionResult SignIn([FromBody] UserLoginDto dto, [FromServices] IAuthenticateService auth)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Login) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest();

            bool result = auth.SignIn(HttpContext, dto.Login, dto.Password);
            if (!result) return NotFound();

            return Ok(new { Message = "Вход выполнен", User = dto.Login });
        }

        [HttpGet("SignOut")]
        public IActionResult SignOut([FromServices] IAuthenticateService auth)
        {
            var token = GenerateJWTToken();
            return Ok(new { Message = "Выход выполнен", Token = token });
        }
        private string GenerateJWTToken()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 128)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

    }

    public class ResultCreateDto
    {
        public string Value { get; set; } = string.Empty;
    }
}
