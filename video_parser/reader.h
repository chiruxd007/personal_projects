#ifndef READER_H
#define READER_H

#include <fstream>
#include <string>
#include <cstdint>

struct BoxHeader {
    uint64_t size;
    std::string type;
    uint64_t headerSize;
    uint64_t startOffset;
};

inline uint8_t readU8(std::ifstream& in) {
    char b;
    in.read(&b, 1);
    return static_cast<uint8_t>(b);
}

inline uint16_t readU16BE(std::ifstream& in) {
    uint16_t v = 0;
    v |= static_cast<uint16_t>(readU8(in)) << 8;
    v |= static_cast<uint16_t>(readU8(in));
    return v;
}

inline uint32_t readU32BE(std::ifstream& in) {
    uint32_t v = 0;
    v |= static_cast<uint32_t>(readU8(in)) << 24;
    v |= static_cast<uint32_t>(readU8(in)) << 16;
    v |= static_cast<uint32_t>(readU8(in)) << 8;
    v |= static_cast<uint32_t>(readU8(in));
    return v;
}

inline uint64_t readU64BE(std::ifstream& in) {
    uint64_t hi = readU32BE(in);
    uint64_t lo = readU32BE(in);
    return (hi << 32) | lo;
}

inline std::string readType(std::ifstream& in) {
    char t[4];
    in.read(t, 4);
    return std::string(t, 4);
}

inline void skipBytes(std::ifstream& in, uint64_t n) {
    in.seekg(n, std::ios::cur);
}

inline uint64_t tellPos(std::ifstream& in) {
    return static_cast<uint64_t>(in.tellg());
}

inline void seekPos(std::ifstream& in, uint64_t pos) {
    in.seekg(static_cast<std::streamoff>(pos), std::ios::beg);
}

inline uint64_t fileSize(std::ifstream& in) {
    auto cur = in.tellg();
    in.seekg(0, std::ios::end);
    uint64_t sz = static_cast<uint64_t>(in.tellg());
    in.seekg(cur);
    return sz;
}

inline BoxHeader readBoxHeader(std::ifstream& in) {
    BoxHeader h{};
    h.startOffset = tellPos(in);

    uint32_t size32 = readU32BE(in);
    h.type = readType(in);
    h.headerSize = 8;

    if (size32 == 1) {
        h.size = readU64BE(in);
        h.headerSize = 16;
    } else if (size32 == 0) {
        h.size = 0;
    } else {
        h.size = size32;
    }

    return h;
}

#endif