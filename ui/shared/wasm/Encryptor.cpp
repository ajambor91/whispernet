#include "Encryptor.h"


Encryptor::Encryptor(const std::string& secretArg) :
	IV_SIZE(16),
	SECRET_SIZE(32),
	decodedSecret(b64e.decodeB64(secretArg)){}


std::pair<std::string, std::string> Encryptor::encrypt(const std::string& data) {
	std::vector<unsigned char> iv = ivGen.generateRandomIV();
	std::vector<uint8_t> convertedData(data.begin(), data.end());
	addPadding(convertedData);
	struct AES_ctx ctx;
	AES_init_ctx_iv(&ctx, decodedSecret.data(), iv.data());
	AES_CBC_encrypt_buffer(&ctx, convertedData.data(), convertedData.size());

	return { b64e.encodeB64(convertedData) , b64e.encodeB64(iv)};
}

void Encryptor::addPadding(std::vector<unsigned char>& data) {
	size_t blockSize = 16;
	size_t paddingSize = blockSize - (data.size() % blockSize);
	data.insert(data.end(), paddingSize, static_cast<uint8_t>(paddingSize));
}