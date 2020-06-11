CXX=icpc
CXXFLAGS=-c -qopenmp -qopt-report=5 -xMIC-AVX512
LDFLAGS=-qopenmp

OBJECTS=main.o

app: $(OBJECTS)
	$(CXX) $(LDFLAGS) -o app $(OBJECTS)

all:	app

run:	all
	./app

queue:	all
	echo 'cd $$PBS_O_WORKDIR ; ./app' | qsub -l nodes=1:flat -N numintegr

clean:
	rm -f *.optrpt *.o app *~ numintegr.*
