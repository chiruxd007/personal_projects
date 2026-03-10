#include "image.h"
#include <iostream>

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

Image::Image() : width(0), height(0) {}

Image::Image(int w, int h) : width(w), height(h), pixels(w * h) {}

bool Image::load(const std::string& filename) {
    int channels = 0;

    // Force image to load as 3-channel RGB
    unsigned char* data = stbi_load(filename.c_str(), &width, &height, &channels, 3);

    if (!data) {
        std::cerr << "Failed to load image: " << filename << "\n";
        std::cerr << "stb_image error: " << stbi_failure_reason() << "\n";
        return false;
    }

    pixels.resize(width * height);

    for (int i = 0; i < width * height; i++) {
        pixels[i].r = data[i * 3 + 0];
        pixels[i].g = data[i * 3 + 1];
        pixels[i].b = data[i * 3 + 2];
    }

    stbi_image_free(data);
    return true;
}

bool Image::savePNG(const std::string& filename) const {
    if (width <= 0 || height <= 0 || pixels.empty()) {
        std::cerr << "No image data to save.\n";
        return false;
    }

    int success = stbi_write_png(
        filename.c_str(),
        width,
        height,
        3,
        pixels.data(),
        width * 3
    );

    if (!success) {
        std::cerr << "Failed to save PNG: " << filename << "\n";
        return false;
    }

    return true;
}

int Image::getWidth() const {
    return width;
}

int Image::getHeight() const {
    return height;
}

Pixel& Image::at(int x, int y) {
    return pixels[y * width + x];
}

const Pixel& Image::at(int x, int y) const {
    return pixels[y * width + x];
}