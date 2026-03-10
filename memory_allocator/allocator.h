#ifndef ALLOCATOR_H
#define ALLOCATOR_H

#include <cstddef>

class MemoryAllocator {
public:
    MemoryAllocator();
    void* myMalloc(std::size_t size);
    void myFree(void* ptr);
    void* myCalloc(std::size_t num, std::size_t size);
    void* myRealloc(void* ptr, std::size_t newSize);

    void printHeap() const;
    void printStats() const;

private:
    static const std::size_t HEAP_SIZE = 1024 * 1024; // 1 MB

    struct BlockHeader {
        std::size_t size;
        bool free;
        BlockHeader* next;
        BlockHeader* prev;
    };

    alignas(std::max_align_t) char heap[HEAP_SIZE];
    BlockHeader* head;

    std::size_t alignSize(std::size_t size) const;
    void splitBlock(BlockHeader* block, std::size_t size);
    void coalesce(BlockHeader* block);
    BlockHeader* findFreeBlock(std::size_t size);
    bool isValidPtr(void* ptr) const;
};

#endif