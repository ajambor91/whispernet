#include "B64Enc.h"
#include <openssl/buffer.h>
#include <stdexcept>
#include <iostream>
B64Enc::B64Enc() {}


const std::vector<unsigned char> B64Enc::decodeB64(const std::string& data) const {
	BIO* bio = BIO_new_mem_buf(data.data(), data.size());
	if (!bio) throw std::runtime_error("Nie uda³o siê stworzyæ BIO dla danych wejœciowych");

	BIO* b64 = BIO_new(BIO_f_base64());
	if (!b64) throw std::runtime_error("Nie uda³o siê stworzyæ BIO Base64");

	bio = BIO_push(b64, bio);
	BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL);
	std::vector<unsigned char> decoded(data.size(), '\0');
	int decodedLen = BIO_read(bio, &decoded[0], data.size());
	if (decodedLen < 0) {
		BIO_free_all(bio);
		throw std::runtime_error("B³¹d dekodowania Base64");
	}
	decoded.resize(decodedLen);
	cleanup(bio);
	return decoded;

}	

const std::string B64Enc::encodeB64(std::vector<unsigned char> data) const {
	BIO* bio = BIO_new(BIO_s_mem());
	BIO* b64 = BIO_new(BIO_f_base64());
	bio = BIO_push(b64, bio);
	BIO_set_flags(b64, BIO_FLAGS_BASE64_NO_NL);
	BIO_write(bio, data.data(), data.size());
	BIO_flush(bio);
	BUF_MEM* buffer_ptr;
	BIO_get_mem_ptr(bio, &buffer_ptr);
	std::string encoded(buffer_ptr->data, buffer_ptr->length);
	cleanup(bio);
	return encoded;


}

const void B64Enc::cleanup(BIO* bio) const {
	if (bio) {
		BIO_free_all(bio);
		bio = nullptr;
	}
}