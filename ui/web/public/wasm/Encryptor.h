#ifndef ENCRYPTOR_H
#define ENCRYPTOR_H
#include "B64Enc.h"
#include "IVGenerator.h"
#include "aes.hpp"
#include <string>
#include <vector>
#include <stdexcept>
#include <iostream>
class Encryptor {
private: 
	const IVGenerator ivGen;
	const B64Enc b64e;
	const int IV_SIZE;
	const int SECRET_SIZE;
	const std::vector<unsigned char> decodedSecret;
	const std::vector<uint8_t> convertedSecret;
	void addPadding(std::vector<unsigned char>& data);
public:
	Encryptor(const std::string& secretArg);
	std::pair<std::string, std::string>  encrypt(const std::string& data);
};
#endif // !ENCRYPTOR_H



