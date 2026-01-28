using BSTU.Results.Collection.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BSTU.Results.Collection
{
    public class FileResultsService : IResultsService
    {
        private readonly string _filePath;
        private readonly object _lock = new();

        public FileResultsService()
        {
            _filePath = Path.Combine(AppContext.BaseDirectory, "results.json");

            if (!File.Exists(_filePath))
            {
                File.WriteAllText(_filePath, "[]");
            }
        }

        private List<ResultItem> ReadFromFile()
        {
            lock (_lock)
            {
                var json = File.ReadAllText(_filePath);
                return JsonSerializer.Deserialize<List<ResultItem>>(json) ?? new List<ResultItem>();
            }
        }

        private void WriteToFile(List<ResultItem> items)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_filePath, json);
            }
        }

        public IEnumerable<ResultItem> GetAll()
        {
            return ReadFromFile();
        }

        public ResultItem? GetById(int id)
        {
            return ReadFromFile().FirstOrDefault(x => x.Id == id);
        }

        public ResultItem Add(string value)
        {
            var items = ReadFromFile();
            int newId = items.Any() ? items.Max(x => x.Id) + 1 : 1;

            var newItem = new ResultItem { Id = newId, Value = value };
            items.Add(newItem);
            WriteToFile(items);
            return newItem;
        }

        public ResultItem? Update(int id, string newValue)
        {
            var items = ReadFromFile();
            var existing = items.FirstOrDefault(x => x.Id == id);
            if (existing == null) return null;

            existing.Value = newValue;
            WriteToFile(items);
            return existing;
        }

        public bool Delete(int id)
        {
            var items = ReadFromFile();
            var existing = items.FirstOrDefault(x => x.Id == id);
            if (existing == null) return false;

            items.Remove(existing);
            WriteToFile(items);
            return true;
        }
    }
}
