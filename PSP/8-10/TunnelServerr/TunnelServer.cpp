#include "stdafx.h"         
#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <thread>

#include "Errors.h"

#pragma comment(lib, "ws2_32.lib")

#define TUNNEL_PORT 3000
#define REAL_SERVER_PORT 2000
#define REAL_SERVER_IP "127.0.0.1"
#define BUF_SIZE 1024

using namespace std;

void relay(SOCKET from, SOCKET to, const char* direction)
{
    char buf[BUF_SIZE];
    int len;

    while ((len = recv(from, buf, BUF_SIZE, 0)) > 0)
    {
        cout << "[TUNNEL] " << direction
            << " | bytes: " << len
            << " | data: " << string(buf, len) << endl;

        send(to, buf, len, 0);
    }
}

void handleClient(SOCKET clientSocket)
{
    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (serverSocket == INVALID_SOCKET)
    {
        closesocket(clientSocket);
        return;
    }

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(REAL_SERVER_PORT);
    inet_pton(AF_INET, REAL_SERVER_IP, &serverAddr.sin_addr);

    if (connect(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR)
    {
        closesocket(clientSocket);
        closesocket(serverSocket);
        return;
    }

    std::thread t1(relay, clientSocket, serverSocket, "Client → Server");
    std::thread t2(relay, serverSocket, clientSocket, "Server → Client");

    t1.join();
    t2.join();

    shutdown(clientSocket, SD_BOTH);
    shutdown(serverSocket, SD_BOTH);

    closesocket(clientSocket);
    closesocket(serverSocket);
}

int main()
{
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0)
    {
        cout << "WSAStartup failed" << endl;
        return 1;
    }

    SOCKET listenSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (listenSocket == INVALID_SOCKET)
    {
        cout << "Socket creation failed" << endl;
        WSACleanup();
        return 1;
    }

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(TUNNEL_PORT);
    addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(listenSocket, (sockaddr*)&addr, sizeof(addr)) == SOCKET_ERROR)
    {
        cout << "Bind failed" << endl;
        closesocket(listenSocket);
        WSACleanup();
        return 1;
    }

    if (listen(listenSocket, SOMAXCONN) == SOCKET_ERROR)
    {
        cout << "Listen failed" << endl;
        closesocket(listenSocket);
        WSACleanup();
        return 1;
    }

    cout << "Tunnel server started on port " << TUNNEL_PORT << endl;

    while (true)
    {
        SOCKET clientSocket = accept(listenSocket, NULL, NULL);
        if (clientSocket != INVALID_SOCKET)
        {
            thread(handleClient, clientSocket).detach();
        }
    }

    closesocket(listenSocket);
    WSACleanup();
    return 0;
}
