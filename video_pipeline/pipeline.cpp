#include "pipeline.h"
#include <iostream>
#include <chrono>
#include <thread>

VideoPipeline::VideoPipeline(int numFrames, int width, int height)
    : totalFrames(numFrames),
      frameWidth(width),
      frameHeight(height),
      readingDone(false),
      processingDone(false) {}

VideoPipeline::~VideoPipeline() {
    join();
}

void VideoPipeline::start() {
    readerThread = std::thread(&VideoPipeline::reader, this);
    processorThread = std::thread(&VideoPipeline::processor, this);
    writerThread = std::thread(&VideoPipeline::writer, this);
}

void VideoPipeline::join() {
    if (readerThread.joinable()) readerThread.join();
    if (processorThread.joinable()) processorThread.join();
    if (writerThread.joinable()) writerThread.join();
}

void VideoPipeline::reader() {
    for (int i = 0; i < totalFrames; i++) {
        Frame frame(i, frameWidth, frameHeight);

        for (int p = 0; p < frameWidth * frameHeight; p++) {
            frame.pixels[p] = static_cast<unsigned char>((i * 10 + p) % 256);
        }

        std::cout << "[Reader] Generated frame " << frame.id << "\n";
        rawQueue.push(frame);

        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    readingDone = true;
    rawQueue.push(Frame(-1, 0, 0)); // sentinel
}

void VideoPipeline::processor() {
    while (true) {
        Frame frame = rawQueue.pop();

        if (frame.id == -1) {
            break;
        }

        for (auto& pixel : frame.pixels) {
            pixel = 255 - pixel; // invert grayscale
        }

        std::cout << "[Processor] Processed frame " << frame.id << "\n";
        processedQueue.push(frame);

        std::this_thread::sleep_for(std::chrono::milliseconds(150));
    }

    processingDone = true;
    processedQueue.push(Frame(-1, 0, 0)); // sentinel
}

void VideoPipeline::writer() {
    while (true) {
        Frame frame = processedQueue.pop();

        if (frame.id == -1) {
            break;
        }

        std::cout << "[Writer] Output frame " << frame.id
                << " first pixel=" << static_cast<int>(frame.pixels[0]) << "\n";

        std::this_thread::sleep_for(std::chrono::milliseconds(80));
    }
}