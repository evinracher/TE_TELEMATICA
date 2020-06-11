#include <bits/stdc++.h>
#include <omp.h>
// 4 000 000 000
#define N 4000000000
#define LOWER_LIMIT 0
#define UPPER_LIMIT 10
typedef double double_type;
typedef unsigned long n_type;

using namespace std;

#pragma omp declare simd
double f(const double x);

void print_result(double_type a, double_type b, n_type n, double_type result);