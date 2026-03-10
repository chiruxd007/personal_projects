#include "mp4_parser.h"

#include <iostream>
#include <fstream>
#include <iomanip>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Usage: " << argv[0] << " <file.mp4>\n";
        return 1;
    }

    ifstream in(argv[1], ios::binary);
    if (!in) {
        cerr << "Could not open file.\n";
        return 1;
    }

    ParsedMovie movie;
    parseFile(in, movie);

    cout << "Major brand: " << movie.majorBrand << "\n";
    cout << "Minor version: " << movie.minorVersion << "\n";
    cout << "Movie timescale: " << movie.movieTimescale << "\n";
    cout << "Movie duration: " << movie.movieDuration << "\n";

    if (movie.movieTimescale != 0) {
        double seconds = static_cast<double>(movie.movieDuration) / movie.movieTimescale;
        cout << fixed << setprecision(3)
             << "Movie duration (sec): " << seconds << "\n";
    }

    cout << "\nTrack count: " << movie.tracks.size() << "\n\n";

    for (size_t i = 0; i < movie.tracks.size(); i++) {
        const auto& t = movie.tracks[i];

        cout << "Track " << i + 1 << "\n";
        cout << "  ID: " << t.trackId << "\n";
        cout << "  Handler: " << t.handlerType << "\n";
        cout << "  Codec: " << t.codec << "\n";
        cout << "  Width: " << t.width << "\n";
        cout << "  Height: " << t.height << "\n";
        cout << "  Timescale: " << t.timescale << "\n";
        cout << "  Duration: " << t.duration << "\n";

        if (t.timescale != 0) {
            cout << fixed << setprecision(3)
                << "  Duration (sec): " << static_cast<double>(t.duration) / t.timescale << "\n";
        }

        cout << "  Sample count: " << t.sampleCount << "\n";

        if (!t.sampleSizes.empty()) {
            cout << "  First 5 sample sizes: ";
            for (size_t k = 0; k < t.sampleSizes.size() && k < 5; k++) {
                if (k) cout << ", ";
                cout << t.sampleSizes[k];
            }
            cout << "\n";
        }

        cout << "\n";
    }

    return 0;
}