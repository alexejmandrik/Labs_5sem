#include <windows.h>
#include <stdio.h>
#include <iostream>

int main(void) {
    setlocale(LC_ALL, "rus");
    STARTUPINFO si[3];
    PROCESS_INFORMATION pi[3];

    const char* appPath = "C:\\Users\\User-457527FC\\OS3\\Lab-03x\\x64\\Debug\\Lab-03x.exe";
    const char* cmdLine2 = "C:\\Users\\User-457527FC\\OS3\\Lab-03x\\x64\\Debug\\Lab-03x.exe 10";

    ZeroMemory(&si, sizeof(si));
    ZeroMemory(&pi, sizeof(pi));
    for (int i = 0; i < 3; i++)
        si[i].cb = sizeof(STARTUPINFO);

    printf("Создание процессов...\n");

    if (!CreateProcessA(
        appPath,   
        NULL,      
        NULL, NULL, FALSE, 0, NULL, NULL, &si[0], &pi[0]))
        printf("Ошибка при создании первого процесса: %lu\n", GetLastError());

    if (!CreateProcessA(
        NULL,
        (LPSTR)cmdLine2,
        NULL, NULL, FALSE, 0, NULL, NULL, &si[1], &pi[1]))
        printf("Ошибка при создании второго процесса: %lu\n", GetLastError());

    SetEnvironmentVariableA("ITER_NUM", "20");  
    if (!CreateProcessA(
        appPath,
        NULL,        
        NULL, NULL, FALSE, 0, NULL, NULL,
        &si[2], &pi[2]))
        printf("Ошибка при создании третьего процесса: %lu\n", GetLastError());

    printf("Все процессы запущены. Ожидание завершения...\n");

    HANDLE handles[3];
    int count = 0;
    for (int i = 0; i < 3; i++)
        if (pi[i].hProcess)
            handles[count++] = pi[i].hProcess;  

    if (count > 0)
        WaitForMultipleObjects(count, handles, TRUE, INFINITE);

    printf("Все процессы завершены.\n");

    for (int i = 0; i < 3; i++) {
        CloseHandle(pi[i].hProcess);
        CloseHandle(pi[i].hThread);
    }

    return 0;
}
