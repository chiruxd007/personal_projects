# Multithreaded Thread Pool (C++)

This project implements a thread pool / task scheduler in modern C++.

## Features

- Thread pool
- Task queue
- Mutex synchronization
- Condition variables
- Worker threads

## Compile

```bash
g++ -std=c++17 main.cpp thread_pool.cpp -pthread -o thread_pool