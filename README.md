# C++ Systems & Media Engineering Projects

This repository contains a collection of C++ projects focused on **systems programming, concurrency, memory management, and media processing**.

I created this GitHub account to host a clean portfolio of projects specifically related to **low-level C++ development and media software engineering**, as part of my application to **Blackmagic Design's Graduate Software Engineering Program**.

The goal of this repository is to demonstrate practical understanding of:

- memory management
- multithreading
- media file parsing
- image processing
- pipeline architectures
- performance-oriented C++ design

These projects were implemented from scratch without relying on heavy external frameworks to highlight core C++ and systems programming concepts.

---

# Projects

## 1. Video File Metadata & Frame Parser
Parses container metadata from video files and extracts structural information.

**Concepts demonstrated**
- binary file parsing
- container format structure
- byte-level data processing
- media file architecture

---

## 2. Custom Memory Allocator
A simplified implementation of a heap memory allocator supporting:

- `malloc`
- `free`
- `calloc`
- `realloc`

**Concepts demonstrated**
- free list allocator
- block splitting
- block coalescing
- heap layout management

---

## 3. Multithreaded Thread Pool
A thread pool implementation supporting concurrent task execution.

**Concepts demonstrated**

- worker threads
- mutex synchronization
- condition variables
- producer-consumer task queues

---

## 4. Video Frame Processing Pipeline
A multithreaded pipeline simulating a real-time video processing workflow.

Stages include:

- frame generation
- frame processing
- frame output

**Concepts demonstrated**

- pipeline architecture
- inter-thread communication
- task scheduling
- media processing workflow

---

## 5. Mini Image Editor
A lightweight image processing tool supporting several filters.

Features:

- invert
- grayscale
- brightness adjustment
- blur
- horizontal flip

Uses `stb_image` for image decoding and encoding.

**Concepts demonstrated**

- pixel-level manipulation
- image filtering
- graphics data structures

---

# Technologies Used

- C++
- STL
- Multithreading (`std::thread`)
- Mutex / condition variables
- Low-level memory management
- Image processing

---

# Motivation

These projects were built to strengthen my understanding of **performance-sensitive C++ systems**, particularly in areas relevant to **video, graphics, and media software development**.

---

# Author

Chirantan Kundu  
B.Sc. — University of Melbourne
