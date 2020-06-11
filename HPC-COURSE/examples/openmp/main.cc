#include <omp.h>
#include <cstdio>
int main()
{
    // This code is executed by 1 thread
    const int nt = omp_get_max_threads();
    printf("OpenMP with %d threads\n", nt);
#pragma omp parallel
    { // This code is executed in parallel
        // by multiple threads
        printf("Hello World from thread %d\n",
               omp_get_thread_num());
    }
}