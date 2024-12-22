#include "EVP_CIPHER_CTX_Guard.h"


void EVP_CIPHER_CTX_Guard::initialize() {
	ctx = EVP_CIPHER_CTX_new();

	if (!ctx) {
		throw std::runtime_error("Cannot create cipher cts");
	}
}

void EVP_CIPHER_CTX_Guard::cleanup() {
	if (ctx) {
		EVP_CIPHER_CTX_free(ctx);
		ctx = nullptr;
	}
}

EVP_CIPHER_CTX_Guard::EVP_CIPHER_CTX_Guard() {
	initialize();
}

EVP_CIPHER_CTX_Guard::~EVP_CIPHER_CTX_Guard() {
	cleanup();
}

EVP_CIPHER_CTX* EVP_CIPHER_CTX_Guard::get() {
	return ctx;
}