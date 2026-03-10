#include "filters.h"

static unsigned char clampToByte(int value) {
    if (value < 0) return 0;
    if (value > 255) return 255;
    return static_cast<unsigned char>(value);
}

void invert(Image& img) {
    for (int y = 0; y < img.getHeight(); y++) {
        for (int x = 0; x < img.getWidth(); x++) {
            Pixel& p = img.at(x, y);
            p.r = 255 - p.r;
            p.g = 255 - p.g;
            p.b = 255 - p.b;
        }
    }
}

void grayscale(Image& img) {
    for (int y = 0; y < img.getHeight(); y++) {
        for (int x = 0; x < img.getWidth(); x++) {
            Pixel& p = img.at(x, y);
            unsigned char gray = static_cast<unsigned char>((p.r + p.g + p.b) / 3);
            p.r = gray;
            p.g = gray;
            p.b = gray;
        }
    }
}

void adjustBrightness(Image& img, int amount) {
    for (int y = 0; y < img.getHeight(); y++) {
        for (int x = 0; x < img.getWidth(); x++) {
            Pixel& p = img.at(x, y);
            p.r = clampToByte((int)p.r + amount);
            p.g = clampToByte((int)p.g + amount);
            p.b = clampToByte((int)p.b + amount);
        }
    }
}

void flipHorizontal(Image& img) {
    int w = img.getWidth();
    int h = img.getHeight();

    for (int y = 0; y < h; y++) {
        for (int x = 0; x < w / 2; x++) {
            Pixel temp = img.at(x, y);
            img.at(x, y) = img.at(w - 1 - x, y);
            img.at(w - 1 - x, y) = temp;
        }
    }
}

void blur(Image& img) {
    Image copy = img;

    int w = img.getWidth();
    int h = img.getHeight();

    for (int y = 1; y < h - 1; y++) {
        for (int x = 1; x < w - 1; x++) {
            int sumR = 0, sumG = 0, sumB = 0;

            for (int dy = -1; dy <= 1; dy++) {
                for (int dx = -1; dx <= 1; dx++) {
                    const Pixel& p = copy.at(x + dx, y + dy);
                    sumR += p.r;
                    sumG += p.g;
                    sumB += p.b;
                }
            }

            Pixel& out = img.at(x, y);
            out.r = static_cast<unsigned char>(sumR / 9);
            out.g = static_cast<unsigned char>(sumG / 9);
            out.b = static_cast<unsigned char>(sumB / 9);
        }
    }
}