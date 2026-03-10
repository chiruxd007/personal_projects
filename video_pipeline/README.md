# Real-Time Video Frame Processing Pipeline (C++)

This project simulates a simple real-time video pipeline in C++.

## Pipeline Stages

1. Reader thread generates frames
2. Processor thread applies a grayscale inversion filter
3. Writer thread outputs processed frames

## Features

- multithreaded pipeline
- producer/consumer queues
- condition variables
- frame data flow simulation

## Compile

```bash
g++ -std=c++17 main.cpp pipeline.cpp -pthread -o video_pipeline