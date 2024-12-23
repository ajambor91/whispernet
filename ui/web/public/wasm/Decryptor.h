#ifndef DECRYPTOR_H
#define DECRYPTOR_H
#include <vector>
#include <string>
#include <stdexcept>
#include "aes.hpp"
#include "B64Enc.h"
class Decryptor {
private:
	const B64Enc b64e;
	const int IV_SIZE;
	const int SECRET_SIZE;
	const std::vector<unsigned char> decodedSecret;
	std::vector<unsigned char> decodedIV;
	void removePadding(std::vector<unsigned char>& data);

public:
	Decryptor(const std::string& secretArg);
	void setIV(const std::string& iv);
	std::string decryptMessage(const std::string& message);
};

#endif // !DECRYPTOR_H