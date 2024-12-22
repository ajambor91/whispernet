#include "Encryptor.h"


Encryptor::Encryptor(std::string secretArg) :
	IV_SIZE(16),
	SECRET_SIZE(32),
	decodedSecret(b64e.decodeB64(secretArg)){}


std::pair<std::string, std::string> Encryptor::encrypt(const std::string& data) {
	EVP_CIPHER_CTX_Guard evpGuard;
	std::vector<unsigned char> iv = generateRandomIV();
	if (decodedSecret.size() != SECRET_SIZE) {
		throw std::runtime_error("Invalid AES key size");
	}
	if (iv.size() != IV_SIZE) {
		throw std::runtime_error("Invalid IV size");
	}

	if (EVP_EncryptInit_ex(evpGuard.get(), EVP_aes_256_cbc(), nullptr, decodedSecret.data(), iv.data()) != 1) {
		throw std::runtime_error("Cannot initialize AES");
	}
	std::vector<unsigned char> ciphertext(data.size() + EVP_MAX_BLOCK_LENGTH);
	int len = 0;
	int ciphertextLen = 0;
	if (EVP_EncryptUpdate(evpGuard.get(), ciphertext.data(), &len, reinterpret_cast<const unsigned char*>(data.data()), data.size())  != 1){
		throw std::runtime_error("EVP_EncryptUpdate failed");
	}
	ciphertextLen += len;
	if (EVP_EncryptFinal_ex(evpGuard.get(), ciphertext.data() + len, &len) != 1) {
		throw std::runtime_error("EVP_EncryptFinal_ex failed");
	}
	ciphertextLen += len;
	ciphertext.resize(ciphertextLen);
	return { b64e.encodeB64(ciphertext) , b64e.encodeB64(iv)};
}

std::vector<unsigned char> Encryptor::generateRandomIV() {
	std::vector<unsigned char> iv;
	iv.resize(IV_SIZE);
	if (!RAND_bytes(iv.data(), IV_SIZE)) {
		throw std::runtime_error("Cannot generate IV");
	}
	return iv;

}
