#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>

int main(int argc, char* argv[]) {
    setlocale(LC_ALL, "rus");
    int iterations = 0;

    if (argc > 1) {
        iterations = atoi(argv[1]);
    }
    else {
        char* envVar = NULL;
        size_t len = 0;
        if (_dupenv_s(&envVar, &len, "ITER_NUM") == 0 && envVar != NULL) {
            iterations = atoi(envVar);
            free(envVar); 
        }
    }

    if (iterations <= 0) {
        fprintf(stderr, "Ошибка: не задано количество итераций.\n");
        ExitProcess(1);
    }

    printf("Количество итераций: %d\n", iterations);

    DWORD pid = GetCurrentProcessId();

    for (int i = 0; i < iterations; i++) {
        printf("Итерация %d. PID: %lu\n", i + 1, (unsigned long)pid);
        Sleep(500);
    }

    return 0;
}
