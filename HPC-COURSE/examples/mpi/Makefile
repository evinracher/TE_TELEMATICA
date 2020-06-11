CXX=mpiicpc
CXXFLAGS=-c -qopenmp -qopt-report=5 -xMIC-AVX512
LDFLAGS=-qopenmp

OBJECTS=main.o ../common/definition.o

app: $(OBJECTS)
	$(CXX) $(LDFLAGS) -o app $(OBJECTS)

all:	app

queue:	all
	echo 'cd $$PBS_O_WORKDIR ; mpirun -machinefile $$PBS_NODEFILE ./app' | qsub -l nodes=4:flat -N process_mpi

clean:
	rm *.o app process_mpi.*
