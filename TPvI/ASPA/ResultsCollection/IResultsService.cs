using BSTU.Results.Collection.Models;
using System.Collections.Generic;

namespace BSTU.Results.Collection
{
    public interface IResultsService
    {
        IEnumerable<ResultItem> GetAll();
        ResultItem? GetById(int id);
        ResultItem Add(string value);
        ResultItem? Update(int id, string newValue);
        bool Delete(int id);
    }
}
