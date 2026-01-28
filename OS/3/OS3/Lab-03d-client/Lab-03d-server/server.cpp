#include <windows.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[])
{
    if (argc != 4)
        return 1;
    int procCount = atoi(argv[1]);
    int low = atoi(argv[2]);
    int high = atoi(argv[3]);

    PROCESS_INFORMATION* pInfo = (PROCESS_INFORMATION*)calloc(procCount, sizeof(PROCESS_INFORMATION));
    HANDLE* hReadPipes = (HANDLE*)calloc(procCount, sizeof(HANDLE));
    int step = (high - low + 1) / procCount;

    for (int i = 0; i < procCount; i++)
    {
        HANDLE hRead, hWrite;
        SECURITY_ATTRIBUTES sa = { sizeof(sa), NULL, TRUE };
        CreatePipe(&hRead, &hWrite, &sa, 0);
        hReadPipes[i] = hRead;
        int start = low + i * step;
        int end = (i == procCount - 1) ? high : start + step - 1;
        STARTUPINFOA si;
        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        si.hStdOutput = hWrite;
        si.hStdError = hWrite;
        si.dwFlags = STARTF_USESTDHANDLES;
        char cmd[128];
        sprintf_s(cmd, sizeof(cmd), "Lab-03d-client %d %d", start, end);
        ZeroMemory(&pInfo[i], sizeof(PROCESS_INFORMATION));
        CreateProcessA(NULL, cmd, NULL, NULL, TRUE, 0, NULL, NULL, &si, &pInfo[i]);
        CloseHandle(hWrite);
    }

    for (int i = 0; i < procCount; i++) {
        char buffer[512];
        DWORD bytesRead;
        printf("Client[%lu]: ", pInfo[i].dwProcessId);
        while (ReadFile(hReadPipes[i], buffer, sizeof(buffer) - 1, &bytesRead, NULL) && bytesRead > 0) {
            buffer[bytesRead] = '\0';
            printf("%s", buffer);
        }
        printf("\n");
        CloseHandle(hReadPipes[i]);
    }

    for (int i = 0; i < procCount; i++) {
        WaitForSingleObject(pInfo[i].hProcess, INFINITE);
        CloseHandle(pInfo[i].hProcess);
        CloseHandle(pInfo[i].hThread);
    }

    free(pInfo);
    free(hReadPipes);

    return 0;
}
