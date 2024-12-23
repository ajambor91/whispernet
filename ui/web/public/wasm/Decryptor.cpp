#include "Decryptor.h"

Decryptor::Decryptor(const std::string& secretArg) : 
	decodedSecret(b64e.decodeB64(secretArg)), 
	IV_SIZE(16),
	SECRET_SIZE(32)
{}
void Decryptor::setIV(const std::string& iv) {
	decodedIV = b64e.decodeB64(iv);
}

std::string Decryptor::decryptMessage(const std::string& message) {
		if (decodedIV.size() != IV_SIZE) {
			throw std::runtime_error("Decoded IV is invalid");
		}
		if (decodedSecret.size() != SECRET_SIZE) {
			throw std::runtime_error("Decoded secret is invalid");
		}

		std::vector<unsigned char> decodedMessage = b64e.decodeB64(message);
	
		if (decodedMessage.size() <= 0) {
			throw std::runtime_error("B64 decoded data is empty");
		}

		struct AES_ctx ctx;
		AES_init_ctx_iv(&ctx, decodedSecret.data(), decodedIV.data());
		AES_CBC_decrypt_buffer(&ctx, decodedMessage.data(), decodedMessage.size());
		removePadding(decodedMessage);
		return std::string(decodedMessage.begin(), decodedMessage.end());
}

void Decryptor::removePadding(std::vector<unsigned char>& data) {
	if (data.empty()) {
		throw std::invalid_argument("Data is empty, cannot remove padding");
	}

	uint8_t paddingSize = data.back();
	if (paddingSize > 16 || paddingSize == 0) {
		throw std::runtime_error("Invalid padding detected");
	}

	data.erase(data.end() - paddingSize, data.end());
}