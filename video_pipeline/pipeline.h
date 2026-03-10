#ifndef PIPELINE_H
#define PIPELINE_H

#include "frame.h"
#include "safe_queue.h"
#include <thread>
#include <atomic>

class VideoPipeline {
public:
    VideoPipeline(int numFrames, int width, int height);
    ~VideoPipeline();

    void start();
    void join();

private:
    void reader();
    void processor();
    void writer();

    int totalFrames;
    int frameWidth;
    int frameHeight;

    SafeQueue<Frame> rawQueue;
    SafeQueue<Frame> processedQueue;

    std::thread readerThread;
    std::thread processorThread;
    std::thread writerThread;

    std::atomic<bool> readingDone;
    std::atomic<bool> processingDone;
};

#endif