#include <windows.h>
#include <tlhelp32.h>
#include <iostream>
#include <io.h>
#include <fcntl.h>
#include <iomanip>
using namespace std;

int main() {
    
    _setmode(_fileno(stdout), _O_U16TEXT);

    HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hSnapshot == INVALID_HANDLE_VALUE) return 1;

    PROCESSENTRY32 pe;
    pe.dwSize = sizeof(pe);

    if (!Process32First(hSnapshot, &pe)) return 1;

    wcout << left << setw(30) 
    << L"Имя процесса" << setw(20)
    << L"PID" << setw(20) 
    << L"PPID" << L"\n";

    do {

        wcout << left << setw(30) << pe.szExeFile
            << setw(20) << pe.th32ProcessID
            << setw(20) << pe.th32ParentProcessID << L"\n";

    } while (Process32Next(hSnapshot, &pe));
    CloseHandle(hSnapshot);

    return 0;
}
