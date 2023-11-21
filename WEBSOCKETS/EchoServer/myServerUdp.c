#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <arpa/inet.h>
#include <unistd.h>

#define PORT 2233
#define BUFFER_SIZE 1024

int main() {
    // Create a UDP socket
    int serverSocket;
    if ((serverSocket = socket(AF_INET, SOCK_DGRAM, 0)) == -1) {
        perror("Error creating socket");
        exit(EXIT_FAILURE);
    }

    // Configure server address
    struct sockaddr_in serverAddress;
    memset(&serverAddress, 0, sizeof(serverAddress));
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_port = htons(PORT);
    serverAddress.sin_addr.s_addr = INADDR_ANY;

    // Bind the socket to the address
    if (bind(serverSocket, (struct sockaddr*)&serverAddress, sizeof(serverAddress)) == -1) {
        perror("Error binding socket");
        exit(EXIT_FAILURE);
    }

    // Receive and process messages
    char buffer[BUFFER_SIZE];
    while (1) {
        ssize_t bytesRead = recvfrom(serverSocket, buffer, sizeof(buffer), 0, NULL, NULL);
        if (bytesRead == -1) {
            perror("Error receiving data");
            exit(EXIT_FAILURE);
        }

        // Null-terminate the received data to treat it as a string
        buffer[bytesRead] = '\0';

        // Print the received message
        printf("Received message: %s\n", buffer);
    }

    // Close the socket
    close(serverSocket);

    return 0;
}