#ifndef ENCRYPTOR_H
#define ENCRYPTOR_H
#include "B64Enc.h"
#include <openssl/aes.h>
#include <openssl/evp.h>
#include <openssl/bio.h>
#include <openssl/buffer.h>
#include <string>
#include <vector>
#include <openssl/rand.h>
#include <stdexcept>
#include <iostream>
#include "EVP_CIPHER_CTX_Guard.h"
class Encryptor {
private: 
	const B64Enc b64e;
	const int IV_SIZE;
	const int SECRET_SIZE;
	const std::vector<unsigned char> decodedSecret;
	std::vector<unsigned char> generateRandomIV();
public:
	Encryptor(std::string secretArg);
	std::pair<std::string, std::string>  encrypt(const std::string& data);
};
#endif // !ENCRYPTOR_H



