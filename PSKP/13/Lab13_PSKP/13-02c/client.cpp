#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <winsock2.h>
#include <iostream>
#pragma comment(lib, "ws2_32.lib")


int main() {
	setlocale(LC_ALL, "Rus");
	WSADATA wsa;
	WSAStartup(MAKEWORD(2, 2), &wsa);


	SOCKET client = socket(AF_INET, SOCK_STREAM, 0);


	sockaddr_in addr;
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr = inet_addr("127.0.0.1");
	addr.sin_port = htons(4000);


	connect(client, (sockaddr*)&addr, sizeof(addr));
	std::cout << "Подключено к серверу" << std::endl;


	std::string msg = "Hello server";
	send(client, msg.c_str(), msg.size(), 0);


	char buffer[1024];
	int bytes = recv(client, buffer, sizeof(buffer), 0);
	buffer[bytes] = '\0';


	std::cout << "Ответ: " << buffer << std::endl;


	closesocket(client);
	WSACleanup();
}