#include <iostream>
#include <vector>
#include <cstdlib>
bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; ++i)
        if (n % i == 0) return false; return true;
}int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: Lab-03d-client <low> <high>\n";
        return 1;
    }
    int low = std::atoi(argv[1]);
    int high = std::atoi(argv[2]);
    if (low > high || low < 0) {
        std::cerr << "Invalid range.\n";
        return 1;
    }std::vector<int> primes;
    for (int i = low; i <= high; ++i)
        if (isPrime(i)) primes.push_back(i);
    for (int p : primes)
        std::cout << p << " ";
    std::cout << std::endl;
    return 0;
}
