#include "stdafx.h"
#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <string>
#include <thread>
#pragma comment(lib, "ws2_32.lib")

#define RECONNECT_DELAY_MS 3000

using namespace std;

char* get_message(int msg)
{
    switch (msg)
    {
    case 1: return (char*)"Echo";
    case 2: return (char*)"Time";
    case 3: return (char*)"Random";
    case 4: return (char*)"close";
    default: return (char*)"close";
    }
}

void cleanup(SOCKET& socket)
{
    if (socket != INVALID_SOCKET) {
        closesocket(socket);
        socket = INVALID_SOCKET;
    }
}

void connectToServer(SOCKET& cC, addrinfo* result)
{
    bool isConnected = false;
    while (!isConnected) {
        for (addrinfo* ptr = result; ptr != NULL; ptr = ptr->ai_next) {
            cC = socket(ptr->ai_family, ptr->ai_socktype, ptr->ai_protocol);
            if (cC == INVALID_SOCKET) {
                cerr << "Socket creation failed: " << WSAGetLastError() << endl;
                continue;
            }

            if (connect(cC, ptr->ai_addr, (int)ptr->ai_addrlen) == SOCKET_ERROR) {
                cerr << "Connection failed: " << WSAGetLastError() << endl;
                cleanup(cC);
                continue;
            }

            cout << "Successfully connected to server." << endl;
            isConnected = true;
            break;
        }

        if (!isConnected) {
            cerr << "Retrying connection in " << RECONNECT_DELAY_MS / 1000 << " seconds..." << endl;
            std::this_thread::sleep_for(std::chrono::milliseconds(RECONNECT_DELAY_MS));
        }
    }
}

int _tmain(int argc, char* argv[])
{
    char* error = (char*)"close";
    SOCKET cC = INVALID_SOCKET;
    WSADATA wsaData;
    setlocale(0, "rus");

    string serverAddress;
    const string PORT = "3000";

    cout << "Please, enter server address: ";
    getline(cin, serverAddress);

    try
    {
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0)
            throw string("Startup failed: ") + to_string(WSAGetLastError());

        addrinfo hints = { 0 }, * result = NULL;

        hints.ai_family = AF_INET;
        hints.ai_socktype = SOCK_STREAM;


        int iResult = getaddrinfo(
            (PCSTR)serverAddress.c_str(),
            (PCSTR)PORT.c_str(),
            &hints,
            &result
        );
        if (iResult != 0)
            throw string("getaddrinfo failed: ") + to_string(iResult);

        connectToServer(cC, result);
        freeaddrinfo(result);

        while (true)
        {
            char message[50] = { 0 };
            int libuf = 0, lobuf = 0;

            cout << "Choose:\n";
            cout << "1 - Echo\n2 - Time\n3 - Random\n4 - close socket\n";

            int service;
            cin >> service;

            string outMessage(get_message(service));

            if ((lobuf = send(cC, outMessage.c_str(), outMessage.length() + 1, 0)) == SOCKET_ERROR)
                throw string("send failed: ") + to_string(WSAGetLastError());

            cout << "Sent: " << outMessage << endl;

            if ((libuf = recv(cC, message, sizeof(message), 0)) == SOCKET_ERROR)
                throw string("recv failed: ") + to_string(WSAGetLastError());

            if (service < 1 || service > 4)
            {
                error = (char*)"ErrorInQuery";
                break;
            }

            if (service == 4)
                break;

            if (strcmp(message, "TimeOUT") == 0)
            {
                cout << "Time out" << endl;
                return -1;
            }


           
                if (service == 1) 
                {
                    cout << "Starting Echo service (1000 to 0)..." << endl;

                    for (int j = 1000; j >= 0; --j)
                    {
                        std::this_thread::sleep_for(std::chrono::seconds(1));
                        outMessage = to_string(j);

                        if ((lobuf = send(cC, outMessage.c_str(), outMessage.length() + 1, 0)) == SOCKET_ERROR)
                            throw string("send failed: ") + to_string(WSAGetLastError());

                        cout << "Sent: " << outMessage << endl;

                        memset(message, 0, sizeof(message));

                        if ((libuf = recv(cC, message, sizeof(message) - 1, 0)) <= 0) {
                            cout << "Connection lost" << endl;
                            break;
                        }

                        if (strcmp(message, "TimeOUT") == 0 || strstr(message, "TimeOUT") != NULL)
                        {
                            cout << "Server: Service stopped by 3-minute timeout" << endl;
                            cleanup(cC);
                            WSACleanup();
                            system("pause");
                            return 0;
                        }

                        cout << "Received: ";
                        for (int k = 0; k < libuf && message[k] != '\0'; k++) {
                            cout << message[k];
                        }
                        cout << endl;
                    }
                }
            else if (service == 2 || service == 3)
            {
                cout << "Received: " << string(message, libuf) << endl;
            }
        }

        cleanup(cC);
        WSACleanup();
    }
    catch (const string& errorMsgText)
    {
        cerr << errorMsgText << endl;
        cleanup(cC);
        WSACleanup();
    }

    cout << error << endl;
    system("pause");
    return 0;
}
