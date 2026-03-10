#include "allocator.h"
#include <iostream>
#include <cstring>

int main() {
    MemoryAllocator allocator;

    std::cout << "=== Initial State ===\n";
    allocator.printHeap();
    allocator.printStats();

    std::cout << "\n=== Allocate 100 bytes ===\n";
    void* p1 = allocator.myMalloc(100);
    allocator.printHeap();
    allocator.printStats();

    std::cout << "\n=== Allocate 200 bytes ===\n";
    void* p2 = allocator.myMalloc(200);
    allocator.printHeap();
    allocator.printStats();

    std::cout << "\n=== Free first block ===\n";
    allocator.myFree(p1);
    allocator.printHeap();
    allocator.printStats();

    std::cout << "\n=== Allocate 50 bytes (should reuse free block) ===\n";
    void* p3 = allocator.myMalloc(50);
    allocator.printHeap();
    allocator.printStats();

    std::cout << "\n=== Calloc 10 ints ===\n";
    int* arr = static_cast<int*>(allocator.myCalloc(10, sizeof(int)));
    bool allZero = true;
    for (int i = 0; i < 10; i++) {
        if (arr[i] != 0) {
            allZero = false;
            break;
        }
    }
    std::cout << "Calloc zero initialized: " << (allZero ? "Yes" : "No") << '\n';
    allocator.printHeap();
    allocator.printStats();

    std::cout << "\n=== Realloc block to 300 bytes ===\n";
    char* text = static_cast<char*>(allocator.myMalloc(20));
    std::strcpy(text, "Hello Allocator");
    text = static_cast<char*>(allocator.myRealloc(text, 300));
    std::cout << "Realloc preserved data: " << text << '\n';
    allocator.printHeap();
    allocator.printStats();

    std::cout << "\n=== Free everything ===\n";
    allocator.myFree(p2);
    allocator.myFree(p3);
    allocator.myFree(arr);
    allocator.myFree(text);
    allocator.printHeap();
    allocator.printStats();

    return 0;
}