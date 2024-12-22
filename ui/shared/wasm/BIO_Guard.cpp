#include "BIO_Guard.h"


BIO_Guard::BIO_Guard(const std::string& b64Data) {
	setup(b64Data);
}

BIO_Guard::~BIO_Guard() {
	cleanup();
}
void BIO_Guard::cleanup() {
	if (bio) {
		BIO_free_all(bio);
		bio = nullptr;
        b64 = nullptr;
	}
}

void BIO_Guard::setup(const std::string& b64Data) {
    bio = BIO_new_mem_buf(b64Data.data(), b64Data.size());
    if (!bio) {
        throw std::runtime_error("Failed to create memory buffer BIO");
    }
    b64 = BIO_new(BIO_f_base64());
    if (!b64) {
        BIO_free_all(bio);
        throw std::runtime_error("Failed to create Base64 BIO");
    }

    bio = BIO_push(b64, bio);
    if (!bio) {
        throw std::runtime_error("Failed to push Base64 BIO");
    }
    BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL);

}

BIO* BIO_Guard::get() {
    return bio;
}