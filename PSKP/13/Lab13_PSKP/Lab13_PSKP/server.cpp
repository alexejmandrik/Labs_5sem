#include <winsock2.h>
#include <iostream>
#pragma comment(lib, "ws2_32.lib")


int main() {
	setlocale(LC_ALL, "Rus");
	WSADATA wsa;
	WSAStartup(MAKEWORD(2, 2), &wsa);


	SOCKET server = socket(AF_INET, SOCK_STREAM, 0);


	sockaddr_in addr;
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr = INADDR_ANY;
	addr.sin_port = htons(4000);


	bind(server, (sockaddr*)&addr, sizeof(addr));
	listen(server, 1);


	std::cout << "TCP C++ сервер запущен на порту 4000..." << std::endl;


	SOCKET client;
	sockaddr_in clientAddr;
	int clientSize = sizeof(clientAddr);
	client = accept(server, (sockaddr*)&clientAddr, &clientSize);


	char buffer[1024];
	int bytes;


	while ((bytes = recv(client, buffer, sizeof(buffer), 0)) > 0) {
		buffer[bytes] = '\0';
		std::cout << "Получено: " << buffer << std::endl;


		std::string response = "ECHO: ";
		response += buffer;


		send(client, response.c_str(), response.size(), 0);
	}


	closesocket(client);
	closesocket(server);
	WSACleanup();
}