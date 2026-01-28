using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace ASPA0011_1.Logging
{
    public class FileLogger : ILogger
    {
        private readonly string _filePath;
        private readonly string _name;
        private readonly object _lock = new();

        public FileLogger(string name, string filePath)
        {
            _name = name;
            _filePath = filePath;
        }

        public IDisposable? BeginScope<TState>(TState state) => null;

        public bool IsEnabled(LogLevel logLevel) => logLevel != LogLevel.None;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel))
                return;

            var logRecord = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} [{logLevel}] {_name}: {formatter(state, exception)}";

            if (exception != null)
                logRecord += Environment.NewLine + $"Exception: {exception}";

            lock (_lock)
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
                File.AppendAllText(_filePath, logRecord + Environment.NewLine);
            }
        }
    }
}
