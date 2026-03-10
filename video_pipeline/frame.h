#ifndef FRAME_H
#define FRAME_H

#include <vector>

struct Frame {
    int id;
    int width;
    int height;
    std::vector<unsigned char> pixels;

    Frame() : id(0), width(0), height(0) {}

    Frame(int frameId, int w, int h)
        : id(frameId), width(w), height(h), pixels(w * h, 0) {}
};

#endif