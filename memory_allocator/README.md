# Custom Memory Allocator in C++

This project implements a custom heap allocator from scratch in C++.

## Features

- Custom `malloc`
- Custom `free`
- Custom `calloc`
- Custom `realloc`
- Free list
- Block splitting
- Block coalescing
- Heap statistics

## Files

- `allocator.h` - allocator interface
- `allocator.cpp` - allocator implementation
- `main.cpp` - test program

## Compile

```bash
g++ -std=c++17 main.cpp allocator.cpp -o allocator_demo