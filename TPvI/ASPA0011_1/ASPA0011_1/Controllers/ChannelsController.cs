using ASPA0011_1.Models;
using ASPA0011_1.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Reflection;
using System.Text.Json;

namespace ASPA0011_1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChannelsController : ControllerBase
    {
        private readonly ChannelService _service;
        private readonly ILogger<ChannelsController> _logger;
        private readonly IConfiguration _config;

        public ChannelsController(ChannelService service, ILogger<ChannelsController> logger, IConfiguration config)
        {
            _service = service;
            _logger = logger;
            _config = config;
        }

        [HttpGet]
        [HttpGet]
        public IActionResult GetAll()
        {
            _logger.LogTrace("Вызван метод GetAll()");
            var channels = _service.GetChannels();
            _logger.LogTrace("GetAll() возвращает {Count} каналов", channels.Count());
            return Ok(channels);
        }


        [HttpGet("{id:guid}")]
        public IActionResult Get(Guid id)
        {
            var channel = _service.GetChannel(id);
            return channel == null ? NotFound() : Ok(channel);
        }

        [HttpPost]
        public IActionResult Create([FromBody] JsonElement body)
        {
            string name = body.TryGetProperty("name", out var nameProp)
                ? nameProp.GetString() ?? "Channel"
                : "Channel";

            string state = body.TryGetProperty("state", out var stateProp)
                ? stateProp.GetString()?.ToUpper() ?? "ACTIVE"
                : "ACTIVE";

            var ch = _service.CreateChannel(name);
            ch.State = state;

            if (state == "CLOSED")
            {
                _logger.LogInformation("Создан канал {Name} в состоянии CLOSED", name);
                return NoContent();
            }

            _logger.LogInformation("Создан канал {Name} в состоянии ACTIVE", name);
            return CreatedAtAction(nameof(Get), new { id = ch.Id }, ch);
        }

        [HttpPut]
        public IActionResult Update([FromBody] JsonElement body)
        {
            if (!body.TryGetProperty("command", out var commandProp))
                return BadRequest(new { error = "Поле 'command' обязательно" });

            string command = commandProp.GetString()?.ToLower() ?? "";
            string reason = body.TryGetProperty("reason", out var reasonProp)
                ? reasonProp.GetString() ?? ""
                : "";

            bool hasId = body.TryGetProperty("id", out var idProp);
            Guid id = Guid.Empty;
            if (hasId)
            {
                if (!Guid.TryParse(idProp.GetString(), out id))
                    return BadRequest(new { error = "Некорректный формат GUID" });
            }

            switch (command)
            {
                case "close":
                    if (hasId)
                    {
                        if (_service.CloseChannel(id, reason))
                        {
                            _logger.LogInformation("Канал {Id} остановлен. Причина: {Reason}", id, reason);
                            return Ok(_service.GetChannel(id));
                        }
                        _logger.LogError("Канал {Id} не найден для закрытия", id);
                        return NotFound();
                    }
                    else
                    {
                        _service.CloseAllChannels(reason);
                        _logger.LogInformation("Все каналы остановлены. Причина: {Reason}", reason);
                        return Ok(_service.GetChannels());
                    }

                case "open":
                    if (hasId)
                    {
                        if (_service.OpenChannel(id))
                        {
                            _logger.LogInformation("Канал {Id} возобновлён", id);
                            return Ok(_service.GetChannel(id));
                        }
                        _logger.LogError("Канал {Id} не найден для возобновления", id);
                        return NotFound();
                    }
                    else
                    {
                        _service.OpenAllChannels();
                        _logger.LogInformation("Все каналы возобновлены");
                        return Ok(_service.GetChannels());
                    }

                default:
                    _logger.LogError("Неизвестная команда PUT: {Command}", command);
                    return BadRequest(new { error = "Неверная команда. Используйте 'open' или 'close'." });
            }
        }



        [HttpDelete]
        [HttpDelete]
        public IActionResult Delete([FromBody] JsonElement body)
        {
            if (!body.TryGetProperty("command", out var commandProp))
                return BadRequest(new { error = "Поле 'command' обязательно" });

            string command = commandProp.GetString()?.ToLower() ?? "";

            if (command != "del")
            {
                _logger.LogError("Неверная команда DELETE: {Command}", command);
                return BadRequest(new { error = "Поддерживается только команда 'del'" });
            }

            string? state = null;
            if (body.TryGetProperty("state", out var stateProp))
                state = stateProp.GetString()?.ToUpper();

            int deletedCount = 0;

            if (state == null)
            {
                deletedCount = _service.DeleteAllChannels();
                _logger.LogInformation("Удалены все каналы ({Count})", deletedCount);
            }
            else
            {
                deletedCount = _service.DeleteByState(state);
                _logger.LogInformation("Удалены каналы со состоянием {State} ({Count})", state, deletedCount);
            }

            if (deletedCount == 0)
            {
                _logger.LogWarning("Каналы для удаления не найдены (state={State})", state);
                return NotFound(new { message = "Каналы для удаления не найдены" });
            }

            return Ok(_service.GetChannels());
        }

        [HttpPost("/api/queue")]
        public async Task<IActionResult> ProcessQueue([FromBody] JsonElement body)
        {
            if (!body.TryGetProperty("command", out var cmdProp))
                return BadRequest(new { error = "Поле 'command' обязательно" });

            if (!body.TryGetProperty("id", out var idProp))
                return BadRequest(new { error = "Поле 'id' обязательно" });

            string command = cmdProp.GetString()?.ToLower() ?? "";
            if (!Guid.TryParse(idProp.GetString(), out Guid id))
                return BadRequest(new { error = "Некорректный формат GUID" });

            try
            {
                switch (command)
                {
                    case "enqueue":
                        if (!body.TryGetProperty("data", out var dataProp))
                            return BadRequest(new { id, error = "Поле 'data' обязательно для enqueue" });

                        string data = dataProp.GetString() ?? "";

                        await _service.EnqueueAsync(id, data, _config.GetValue<int>("WaitEnqueue", 5));

                        _logger.LogDebug("Enqueue в канал {Id}: {Data}", id, data);
                        return Ok(new { id, data });

                    case "dequeue":
                        var msg = await _service.DequeueAsync(id);
                        if (msg == null)
                        {
                            _logger.LogWarning("Очередь канала {Id} пуста (dequeue)", id);
                            return NotFound(new { id, error = "Очередь пуста" });
                        }

                        _logger.LogDebug("Dequeue из канала {Id}: {Msg}", id, msg);
                        return Ok(new { id, data = msg });

                    case "peek":
                        var peekMsg = _service.Peek(id);
                        if (peekMsg == null)
                        {
                            _logger.LogWarning("Очередь канала {Id} пуста (peek)", id);
                            return NotFound(new { id, error = "Очередь пуста" });
                        }

                        _logger.LogDebug("Peek из канала {Id}: {Msg}", id, peekMsg);
                        return Ok(new { id, data = peekMsg });

                    default:
                        _logger.LogError("Неизвестная команда POST /api/queue: {Command}", command);
                        return BadRequest(new { id, error = "Неверная команда. Используйте enqueue, dequeue или peek." });
                }
            }
            catch (KeyNotFoundException)
            {
                _logger.LogError("Канал {Id} не найден для команды {Command}", id, command);
                return NotFound(new { id, error = "Канал не найден" });
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Истекло ожидание WaitEnqueue для канала {Id}", id);
                return StatusCode(408, new { id, error = "Истекло ожидание при enqueue" });
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex,
                    "Критическая ошибка при обработке команды {Command} для канала {Id}",
                    command, id);

                return StatusCode(500, new
                {
                    id,
                    error = "Критическая ошибка сервера",
                    details = ex.Message
                });
            }

        }


    }
}