#ifndef IV_GENERATOR_H
#define IV_GENERATOR_H
#include <random>
#include <vector>
#include <iomanip>
#include <stdexcept>
class IVGenerator {

public:
	const std::vector<unsigned char> generateRandomIV() const;
};

#endif // !IV_GENERATOR_H