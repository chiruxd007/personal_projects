#ifndef MP4_PARSER_H
#define MP4_PARSER_H

#include <fstream>
#include <string>
#include <vector>
#include <cstdint>

struct TrackInfo {
    uint32_t trackId = 0;
    std::string handlerType;
    std::string codec;
    uint32_t width = 0;
    uint32_t height = 0;
    uint32_t timescale = 0;
    uint64_t duration = 0;

    uint32_t sampleCount = 0;
    std::vector<uint32_t> sampleSizes;
};

struct ParsedMovie {
    std::string majorBrand;
    uint32_t minorVersion = 0;
    uint32_t movieTimescale = 0;
    uint64_t movieDuration = 0;
    std::vector<TrackInfo> tracks;
};

bool isContainerBox(const std::string& type);
void parseFile(std::ifstream& in, ParsedMovie& movie);

#endif