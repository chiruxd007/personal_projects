#ifndef IMAGE_H
#define IMAGE_H

#include <string>
#include <vector>

struct Pixel {
    unsigned char r;
    unsigned char g;
    unsigned char b;
};

class Image {
public:
    Image();
    Image(int w, int h);

    bool load(const std::string& filename);
    bool savePNG(const std::string& filename) const;

    int getWidth() const;
    int getHeight() const;

    Pixel& at(int x, int y);
    const Pixel& at(int x, int y) const;

private:
    int width;
    int height;
    std::vector<Pixel> pixels;
};

#endif