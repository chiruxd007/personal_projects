#ifndef FILTERS_H
#define FILTERS_H

#include "image.h"

void invert(Image& img);
void grayscale(Image& img);
void adjustBrightness(Image& img, int amount);
void flipHorizontal(Image& img);
void blur(Image& img);

#endif