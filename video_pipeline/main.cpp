#include "pipeline.h"
#include <iostream>

int main() {
    VideoPipeline pipeline(10, 8, 8);

    std::cout << "Starting video pipeline...\n";
    pipeline.start();
    pipeline.join();
    std::cout << "Pipeline finished.\n";

    return 0;
}