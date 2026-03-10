#include "image.h"
#include "filters.h"
#include <iostream>

int main() {
    Image img;

    if (!img.load("input.jpg")) {
        return 1;
    }

    std::cout << "Loaded image: " << img.getWidth()
              << " x " << img.getHeight() << "\n";

    Image temp = img;
    invert(temp);
    temp.savePNG("output_invert.png");

    temp = img;
    grayscale(temp);
    temp.savePNG("output_gray.png");

    temp = img;
    adjustBrightness(temp, 40);
    temp.savePNG("output_bright.png");

    temp = img;
    flipHorizontal(temp);
    temp.savePNG("output_flip.png");

    temp = img;
    blur(temp);
    temp.savePNG("output_blur.png");

    std::cout << "Saved filtered images.\n";
    return 0;
}