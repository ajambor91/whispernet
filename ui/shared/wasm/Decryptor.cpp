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
		if (decodedIV.size() == IV_SIZE) {
			throw std::runtime_error("Decoded IV is invalid");
		}
		if (decodedSecret.size() == SECRET_SIZE) {
			throw std::runtime_error("Decoded secret is invalid");
		}

		std::vector<unsigned char> decodedMessage = b64e.decodeB64(message);
		EVP_CIPHER_CTX_Guard guard;
		if (EVP_DecryptInit_ex(guard.get(), EVP_aes_256_cbc(), nullptr, decodedSecret.data(), decodedIV.data()) != 1) {
			throw std::runtime_error("Failed to initialize AES-256 decryption.");
		}

		std::vector<unsigned char> plaintext(message.size() + EVP_MAX_BLOCK_LENGTH);
		int len = 0;
		int plaintextLen = 0;

		if (EVP_DecryptUpdate(guard.get(), plaintext.data(), &len, decodedMessage.data(), decodedMessage.size()) != 1) {
			throw std::runtime_error("Failed to decrypt ciphertext.");
		}
		plaintextLen += len;

		if (EVP_DecryptFinal_ex(guard.get(), plaintext.data() + plaintextLen, &len) != 1) {
			throw std::runtime_error("Failed to finalize decryption. Invalid ciphertext or padding.");

		}
		plaintextLen += len;
		plaintext.resize(plaintextLen);
		return std::string(plaintext.begin(), plaintext.end());
}

