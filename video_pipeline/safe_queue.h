#ifndef SAFE_QUEUE_H
#define SAFE_QUEUE_H

#include <queue>
#include <mutex>
#include <condition_variable>

template <typename T>
class SafeQueue {
public:
    void push(const T& item) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            q.push(item);
        }
        cv.notify_one();
    }

    T pop() {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this] { return !q.empty(); });

        T item = q.front();
        q.pop();
        return item;
    }

    bool empty() {
        std::lock_guard<std::mutex> lock(mtx);
        return q.empty();
    }

private:
    std::queue<T> q;
    std::mutex mtx;
    std::condition_variable cv;
};

#endif