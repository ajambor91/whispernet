TARGET = main

SOURCES = Main.cpp Encryptor.cpp Sanitizer.cpp

CXXFLAGS = -s MODULARIZE -s ENVIRONMENT=web --bind

CXX = emcc

$(TARGET): $(SOURCES)
	$(CXX) $(SOURCES) -o $(TARGET).js $(CXXFLAGS)
clean:
	rm -f $(TARGET).js $(TARGET).wasm
