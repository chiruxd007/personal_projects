#include "thread_pool.h"
#include <iostream>
#include <chrono>

int main() {

    ThreadPool pool(4);

    for (int i = 0; i < 10; i++) {

        pool.enqueueTask([i] {

            std::cout << "Task " << i << " running on thread "
                      << std::this_thread::get_id() << std::endl;

            std::this_thread::sleep_for(std::chrono::milliseconds(500));

            std::cout << "Task " << i << " finished\n";
        });
    }

    std::cout << "Tasks submitted\n";

    return 0;
}