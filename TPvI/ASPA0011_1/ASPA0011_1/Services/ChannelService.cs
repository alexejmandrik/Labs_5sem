using ASPA0011_1.Models;
using System.Threading.Channels;

namespace ASPA0011_1.Services
{
    public class ChannelService
    {
        private readonly Dictionary<Guid, Channel<string>> _channels = new();
        private readonly Dictionary<Guid, ChannelModel> _channelInfo = new();
        private readonly ILogger<ChannelService> _logger;

        public ChannelService(ILogger<ChannelService> logger)
        {
            _logger = logger;
            _logger.LogInformation("ChannelService создан"); 
        }

        public IEnumerable<ChannelModel> GetChannels() => _channelInfo.Values;

        public ChannelModel? GetChannel(Guid id) =>
            _channelInfo.ContainsKey(id) ? _channelInfo[id] : null;

        public ChannelModel CreateChannel(string name)
        {
            var model = new ChannelModel { Name = name };
            _channels[model.Id] = Channel.CreateUnbounded<string>(new UnboundedChannelOptions
            {
                SingleReader = false,
                SingleWriter = false,
                AllowSynchronousContinuations = true
            });
            _channelInfo[model.Id] = model;

            _logger.LogInformation("Создан канал {Name} ({Id})", name, model.Id);
            return model;
        }

        public void CloseAllChannels(string reason)
        {
            foreach (var ch in _channelInfo.Values)
                ch.State = "CLOSED";

            _logger.LogInformation("Все каналы остановлены. Причина: {Reason}", reason);
        }

        public bool CloseChannel(Guid id, string reason)
        {
            if (_channelInfo.TryGetValue(id, out var ch))
            {
                ch.State = "CLOSED";
                _logger.LogWarning("Канал {Id} закрыт. Причина: {Reason}", id, reason);
                return true;
            }

            _logger.LogError("Канал {Id} не найден для закрытия", id);
            return false;
        }

        public void OpenAllChannels()
        {
            foreach (var ch in _channelInfo.Values)
                ch.State = "ACTIVE";

            _logger.LogInformation("Все каналы возобновлены");
        }

        public bool OpenChannel(Guid id)
        {
            if (_channelInfo.TryGetValue(id, out var ch))
            {
                ch.State = "ACTIVE";
                _logger.LogInformation("Канал {Id} возобновлён", id);
                return true;
            }

            _logger.LogError("Канал {Id} не найден для открытия", id);
            return false;
        }

        public int DeleteAllChannels()
        {
            int count = _channelInfo.Count;
            _channels.Clear();
            _channelInfo.Clear();

            _logger.LogInformation("Удалены все каналы ({Count})", count);
            return count;
        }

        public int DeleteByState(string state)
        {
            var toDelete = _channelInfo
                .Where(x => x.Value.State.Equals(state, StringComparison.OrdinalIgnoreCase))
                .Select(x => x.Key)
                .ToList();

            foreach (var id in toDelete)
            {
                _channels.Remove(id);
                _channelInfo.Remove(id);
            }

            _logger.LogInformation("Удалены каналы со состоянием {State} ({Count})", state, toDelete.Count);
            return toDelete.Count;
        }

        public async Task EnqueueAsync(Guid id, string message, int waitSeconds)
        {
            if (!_channels.ContainsKey(id))
            {
                _logger.LogError("Канал {Id} не найден для enqueue", id);
                throw new KeyNotFoundException();
            }

            var channelModel = _channelInfo[id];
            if (channelModel.State.Equals("CLOSED", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Попытка записи в закрытый канал {Id}", id);
                throw new InvalidOperationException("Канал закрыт и не принимает сообщения.");
            }

            var writer = _channels[id].Writer;
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(waitSeconds));

            try
            {
                await writer.WriteAsync(message, cts.Token);
                channelModel.MessageCount++;
                _logger.LogDebug("Enqueue в канал {Id}: {Message}", id, message);
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Истекло ожидание WaitEnqueue для канала {Id}", id);
                throw;
            }
        }


        public async Task<string?> DequeueAsync(Guid id)
        {
            if (!_channels.ContainsKey(id))
            {
                _logger.LogError("Канал {Id} не найден для dequeue", id);
                return null;
            }

            var reader = _channels[id].Reader;

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
            try
            {
                if (await reader.WaitToReadAsync(cts.Token))
                {
                    if (reader.TryRead(out var msg))
                    {
                        _channelInfo[id].MessageCount--;
                        _logger.LogDebug("Dequeue из канала {Id}: {Message}", id, msg);
                        return msg;
                    }
                }

                _logger.LogWarning("Очередь канала {Id} пуста при dequeue", id);
                return null;
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Таймаут ожидания при dequeue из канала {Id}", id);
                return null;
            }
            catch (ChannelClosedException)
            {
                _logger.LogWarning("Канал {Id} закрыт", id);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при dequeue из канала {Id}", id);
                return null;
            }
        }


        public string? Peek(Guid id)
        {
            if (!_channels.ContainsKey(id))
            {
                _logger.LogError("Канал {Id} не найден для операции Peek", id);
                throw new KeyNotFoundException();
            }

            var reader = _channels[id].Reader;
            if (reader.TryPeek(out var message))
            {
                _logger.LogDebug("Peek в канале {Id}: {Message}", id, message);
                return message;
            }

            _logger.LogWarning("Очередь канала {Id} пуста при Peek", id);
            return null;
        }
    }
}
