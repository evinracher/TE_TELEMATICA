#include "../common/definition.h"
#include <cmath>
#include <mpi.h>

double_type trapezoid(double_type x0, n_type start, n_type end, double_type h)
{
  double_type acum = 0.0;
#pragma omp parallel for reduction(+ \
                                   : acum)
  for (n_type i = start; i < end; ++i)
  {
    acum += f(x0 + h * i);
  }
  return acum;
}

int main(int argc, char **argv)
{
  double_type my_result, result, h;
  double_type a = LOWER_LIMIT; /* lower limit of integration */
  double_type b = UPPER_LIMIT; /* upper limit of integration */

  n_type n = N; /* number of steps */
  n_type u_num, l_num;

  int p, i;
  int myid, source, dest, tag;

  MPI_Status status;

  dest = 0;  /* define the process that computes the final result */
  tag = 123; /* set the tag to identify this particular job */

  /* Starts MPI processes ... */
  MPI_Init(&argc, &argv);               /* starts MPI */
  MPI_Comm_rank(MPI_COMM_WORLD, &myid); /* get current process id */
  MPI_Comm_size(MPI_COMM_WORLD, &p);    /* get number of processes */

  l_num = (n / p) * myid;
  u_num = (n / p) * myid + (n / p);
  h = (b - a) / n;
  if (l_num == 0)
  {
    l_num = 1;
  }
  
  const double t0 = omp_get_wtime();
  my_result = trapezoid(a, l_num, u_num, h);
  if (myid == 0)
  {
    result = my_result;
    for (i = 1; i < p; i++)
    {
      source = i; /* MPI process number range is [0,p-1] */
      MPI_Recv(&my_result, 1, MPI_DOUBLE, source, tag, MPI_COMM_WORLD, &status);
      result += my_result;
    }
    result = (h / 2) * (f(a) + 2 * result + f(b));
    const double t1 = omp_get_wtime();
    printf("Time(sec): %f\n", t1 - t0);
    print_result(a, b, n, result);
  }
  else
  {
    MPI_Send(&my_result, 1, MPI_DOUBLE, dest, tag, MPI_COMM_WORLD); // send my_result to intended dest.
  }

  MPI_Finalize(); /* let MPI finish up ... */
}
