
#include "IVGenerator.h"

const std::vector<unsigned char> IVGenerator::generateRandomIV() const {
	std::vector<unsigned char> iv;
	iv.resize(16);
	std::random_device rd;
	std::mt19937_64 gen(rd());
	std::uniform_int_distribution<uint64_t> dis(0, 255);
	for (size_t i = 0; i < 16; i++) {
		iv[i] = static_cast<uint8_t>(dis(gen));
	}
	return iv;
}