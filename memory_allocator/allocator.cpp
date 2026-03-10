#include "allocator.h"
#include <iostream>
#include <cstring>

MemoryAllocator::MemoryAllocator() {
    head = reinterpret_cast<BlockHeader*>(heap);
    head->size = HEAP_SIZE - sizeof(BlockHeader);
    head->free = true;
    head->next = nullptr;
    head->prev = nullptr;
}

std::size_t MemoryAllocator::alignSize(std::size_t size) const {
    const std::size_t alignment = alignof(std::max_align_t);
    return (size + alignment - 1) & ~(alignment - 1);
}

MemoryAllocator::BlockHeader* MemoryAllocator::findFreeBlock(std::size_t size) {
    BlockHeader* current = head;
    while (current) {
        if (current->free && current->size >= size) {
            return current;
        }
        current = current->next;
    }
    return nullptr;
}

void MemoryAllocator::splitBlock(BlockHeader* block, std::size_t size) {
    std::size_t remaining = block->size - size;

    if (remaining <= sizeof(BlockHeader) + 8) {
        return;
    }

    char* newBlockAddr = reinterpret_cast<char*>(block) + sizeof(BlockHeader) + size;
    BlockHeader* newBlock = reinterpret_cast<BlockHeader*>(newBlockAddr);

    newBlock->size = remaining - sizeof(BlockHeader);
    newBlock->free = true;
    newBlock->next = block->next;
    newBlock->prev = block;

    if (block->next) {
        block->next->prev = newBlock;
    }

    block->size = size;
    block->next = newBlock;
}

void* MemoryAllocator::myMalloc(std::size_t size) {
    if (size == 0) {
        return nullptr;
    }

    size = alignSize(size);

    BlockHeader* block = findFreeBlock(size);
    if (!block) {
        return nullptr;
    }

    splitBlock(block, size);
    block->free = false;

    return reinterpret_cast<char*>(block) + sizeof(BlockHeader);
}

bool MemoryAllocator::isValidPtr(void* ptr) const {
    if (ptr == nullptr) {
        return false;
    }

    const char* cptr = reinterpret_cast<const char*>(ptr);
    const char* heapStart = heap;
    const char* heapEnd = heap + HEAP_SIZE;

    return cptr >= heapStart + static_cast<std::ptrdiff_t>(sizeof(BlockHeader)) && cptr < heapEnd;
}

void MemoryAllocator::coalesce(BlockHeader* block) {
    if (block->next && block->next->free) {
        BlockHeader* next = block->next;
        block->size += sizeof(BlockHeader) + next->size;
        block->next = next->next;
        if (block->next) {
            block->next->prev = block;
        }
    }

    if (block->prev && block->prev->free) {
        BlockHeader* prev = block->prev;
        prev->size += sizeof(BlockHeader) + block->size;
        prev->next = block->next;
        if (block->next) {
            block->next->prev = prev;
        }
    }
}

void MemoryAllocator::myFree(void* ptr) {
    if (!isValidPtr(ptr)) {
        return;
    }

    BlockHeader* block = reinterpret_cast<BlockHeader*>(
        reinterpret_cast<char*>(ptr) - sizeof(BlockHeader)
    );

    block->free = true;
    coalesce(block);
}

void* MemoryAllocator::myCalloc(std::size_t num, std::size_t size) {
    if (num == 0 || size == 0) {
        return nullptr;
    }

    if (num > static_cast<std::size_t>(-1) / size) {
        return nullptr;
    }

    std::size_t total = num * size;
    void* ptr = myMalloc(total);

    if (ptr) {
        std::memset(ptr, 0, total);
    }

    return ptr;
}

void* MemoryAllocator::myRealloc(void* ptr, std::size_t newSize) {
    if (ptr == nullptr) {
        return myMalloc(newSize);
    }

    if (newSize == 0) {
        myFree(ptr);
        return nullptr;
    }

    if (!isValidPtr(ptr)) {
        return nullptr;
    }

    newSize = alignSize(newSize);

    BlockHeader* oldBlock = reinterpret_cast<BlockHeader*>(
        reinterpret_cast<char*>(ptr) - sizeof(BlockHeader)
    );

    if (oldBlock->size >= newSize) {
        splitBlock(oldBlock, newSize);
        return ptr;
    }

    if (oldBlock->next && oldBlock->next->free &&
        oldBlock->size + sizeof(BlockHeader) + oldBlock->next->size >= newSize) {
        BlockHeader* next = oldBlock->next;
        oldBlock->size += sizeof(BlockHeader) + next->size;
        oldBlock->next = next->next;
        if (oldBlock->next) {
            oldBlock->next->prev = oldBlock;
        }
        splitBlock(oldBlock, newSize);
        return ptr;
    }

    void* newPtr = myMalloc(newSize);
    if (!newPtr) {
        return nullptr;
    }

    std::memcpy(newPtr, ptr, oldBlock->size);
    myFree(ptr);
    return newPtr;
}

void MemoryAllocator::printHeap() const {
    const BlockHeader* current = head;
    int index = 0;

    std::cout << "\nHeap Layout:\n";
    while (current) {
        std::cout << "Block " << index++
                  << " | Addr: " << current
                  << " | Size: " << current->size
                  << " | Free: " << (current->free ? "Yes" : "No")
                  << '\n';
        current = current->next;
    }
}

void MemoryAllocator::printStats() const {
    const BlockHeader* current = head;
    std::size_t freeBytes = 0;
    std::size_t usedBytes = 0;
    std::size_t freeBlocks = 0;
    std::size_t usedBlocks = 0;

    while (current) {
        if (current->free) {
            freeBytes += current->size;
            freeBlocks++;
        } else {
            usedBytes += current->size;
            usedBlocks++;
        }
        current = current->next;
    }

    std::cout << "\nAllocator Stats:\n";
    std::cout << "Used blocks: " << usedBlocks << '\n';
    std::cout << "Free blocks: " << freeBlocks << '\n';
    std::cout << "Used bytes : " << usedBytes << '\n';
    std::cout << "Free bytes : " << freeBytes << '\n';
}