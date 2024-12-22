#include "B64Enc.h"


const std::vector<unsigned char> B64Enc::decodeB64(const std::string& data) const {
	BIO* bio = nullptr;
	BIO* b64 = nullptr;
	try {
		bio = BIO_new_mem_buf(data.data(), data.size());
		if (!bio) {
			throw std::runtime_error("Cannot create BIO for input data");
		}
		b64 = BIO_new(BIO_f_base64());
		if (!b64) {
			BIO_free_all(bio);
			throw std::runtime_error("Cannot create BIO for Base64");
		}
		bio = BIO_push(b64, bio);
		BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL);
		std::vector<unsigned char> decoded(data.size(), '\0');
		int decodedLen = BIO_read(bio, &decoded[0], data.size());
		if (decodedLen < 0) {
			BIO_free_all(bio);
			throw std::runtime_error("Error B64 encoding");
		}
		decoded.resize(decodedLen);

		return decoded;
	}
	catch (...) {
		BIO_free_all(bio);
		throw;
	}
}	

const std::string B64Enc::encodeB64(const std::vector<unsigned char>& data) const {
	BIO* bio = nullptr;
	BIO* b64 = nullptr;
	try {
		bio = BIO_new(BIO_s_mem());
		if (!bio) {
			throw std::runtime_error("Cannot create BIO memory buffer");
		}

		b64 = BIO_new(BIO_f_base64());
		if (!b64) {
			BIO_free_all(bio);
			throw std::runtime_error("Cannot create BIO for Base64");
		}

		bio = BIO_push(b64, bio);
		if (!bio) {
			throw std::runtime_error("Failed to push Base64 BIO");
		}
		BIO_set_flags(b64, BIO_FLAGS_BASE64_NO_NL);
		BIO_write(bio, data.data(), data.size());
		BIO_flush(bio);
		BUF_MEM* buffer_ptr;
		BIO_get_mem_ptr(bio, &buffer_ptr);
		std::string encoded(buffer_ptr->data, buffer_ptr->length);

		return encoded;
	}
	catch (...) {
		if (bio) {
			BIO_free_all(bio);

		}
		throw;
	}
}