#include "mp4_parser.h"
#include "reader.h"

#include <iostream>

using namespace std;

bool isContainerBox(const string& type) {
    return type == "moov" || type == "trak" || type == "mdia" ||
           type == "minf" || type == "stbl" || type == "edts" ||
           type == "dinf" || type == "udta";
}

static void parseFtyp(ifstream& in, uint64_t payloadSize, ParsedMovie& movie) {
    uint64_t start = tellPos(in);

    if (payloadSize < 8) {
        seekPos(in, start + payloadSize);
        return;
    }

    movie.majorBrand = readType(in);
    movie.minorVersion = readU32BE(in);

    seekPos(in, start + payloadSize);
}

static void parseMvhd(ifstream& in, uint64_t payloadSize, ParsedMovie& movie) {
    uint64_t start = tellPos(in);

    uint8_t version = readU8(in);
    skipBytes(in, 3);

    if (version == 1) {
        skipBytes(in, 8);
        skipBytes(in, 8);
        movie.movieTimescale = readU32BE(in);
        movie.movieDuration = readU64BE(in);
    } else {
        skipBytes(in, 4);
        skipBytes(in, 4);
        movie.movieTimescale = readU32BE(in);
        movie.movieDuration = readU32BE(in);
    }

    seekPos(in, start + payloadSize);
}

static void parseTkhd(ifstream& in, uint64_t payloadSize, TrackInfo& track) {
    uint64_t start = tellPos(in);

    uint8_t version = readU8(in);
    skipBytes(in, 3);

    if (version == 1) {
        skipBytes(in, 8);
        skipBytes(in, 8);
        track.trackId = readU32BE(in);
        skipBytes(in, 4);
        skipBytes(in, 8);
    } else {
        skipBytes(in, 4);
        skipBytes(in, 4);
        track.trackId = readU32BE(in);
        skipBytes(in, 4);
        skipBytes(in, 4);
    }

    skipBytes(in, 8);
    skipBytes(in, 2);
    skipBytes(in, 2);
    skipBytes(in, 2);
    skipBytes(in, 2);
    skipBytes(in, 36);

    track.width = readU32BE(in) >> 16;
    track.height = readU32BE(in) >> 16;

    seekPos(in, start + payloadSize);
}

static void parseMdhd(ifstream& in, uint64_t payloadSize, TrackInfo& track) {
    uint64_t start = tellPos(in);

    uint8_t version = readU8(in);
    skipBytes(in, 3);

    if (version == 1) {
        skipBytes(in, 8);
        skipBytes(in, 8);
        track.timescale = readU32BE(in);
        track.duration = readU64BE(in);
    } else {
        skipBytes(in, 4);
        skipBytes(in, 4);
        track.timescale = readU32BE(in);
        track.duration = readU32BE(in);
    }

    seekPos(in, start + payloadSize);
}

static void parseHdlr(ifstream& in, uint64_t payloadSize, TrackInfo& track) {
    uint64_t start = tellPos(in);

    skipBytes(in, 4);
    skipBytes(in, 4);
    track.handlerType = readType(in);

    seekPos(in, start + payloadSize);
}

static void parseStsd(ifstream& in, uint64_t payloadSize, TrackInfo& track) {
    uint64_t start = tellPos(in);

    skipBytes(in, 4);
    uint32_t entryCount = readU32BE(in);

    if (entryCount > 0 && tellPos(in) + 8 <= start + payloadSize) {
        uint32_t entrySize = readU32BE(in);
        string sampleEntryType = readType(in);
        track.codec = sampleEntryType;

        if (entrySize >= 8) {
            skipBytes(in, entrySize - 8);
        }
    }

    seekPos(in, start + payloadSize);
}

static void parseStsz(ifstream& in, uint64_t payloadSize, TrackInfo& track) {
    uint64_t start = tellPos(in);

    skipBytes(in, 4);
    uint32_t sampleSize = readU32BE(in);
    uint32_t sampleCount = readU32BE(in);
    track.sampleCount = sampleCount;

    if (sampleSize == 0) {
        track.sampleSizes.reserve(sampleCount);
        for (uint32_t i = 0; i < sampleCount; i++) {
            track.sampleSizes.push_back(readU32BE(in));
        }
    } else {
        track.sampleSizes.assign(sampleCount, sampleSize);
    }

    seekPos(in, start + payloadSize);
}

static void parseBoxes(ifstream& in, uint64_t end, ParsedMovie& movie, TrackInfo* currentTrack = nullptr) {
    while (tellPos(in) + 8 <= end) {
        uint64_t boxStart = tellPos(in);
        BoxHeader h = readBoxHeader(in);

        uint64_t actualSize = h.size;
        if (actualSize == 0) {
            actualSize = end - boxStart;
        }

        if (actualSize < h.headerSize || boxStart + actualSize > end) {
            break;
        }

        uint64_t payloadEnd = boxStart + actualSize;
        uint64_t payloadSize = actualSize - h.headerSize;

        if (h.type == "ftyp") {
            parseFtyp(in, payloadSize, movie);
        } else if (h.type == "mvhd") {
            parseMvhd(in, payloadSize, movie);
        } else if (h.type == "trak") {
            movie.tracks.push_back(TrackInfo{});
            TrackInfo* t = &movie.tracks.back();
            parseBoxes(in, payloadEnd, movie, t);
        } else if (h.type == "tkhd" && currentTrack) {
            parseTkhd(in, payloadSize, *currentTrack);
        } else if (h.type == "mdhd" && currentTrack) {
            parseMdhd(in, payloadSize, *currentTrack);
        } else if (h.type == "hdlr" && currentTrack) {
            parseHdlr(in, payloadSize, *currentTrack);
        } else if (h.type == "stsd" && currentTrack) {
            parseStsd(in, payloadSize, *currentTrack);
        } else if (h.type == "stsz" && currentTrack) {
            parseStsz(in, payloadSize, *currentTrack);
        } else if (isContainerBox(h.type)) {
            parseBoxes(in, payloadEnd, movie, currentTrack);
        }

        seekPos(in, payloadEnd);
    }
}

void parseFile(ifstream& in, ParsedMovie& movie) {
    uint64_t end = fileSize(in);
    parseBoxes(in, end, movie);
}