#ifndef EVP_CYPHER_CTX_GUARD_H
#define EVP_CYPHER_CTX_GUARD_H
#include <stdexcept>
#include <openssl/evp.h>
class EVP_CIPHER_CTX_Guard {
private:
	EVP_CIPHER_CTX* ctx;
	void cleanup();
	void initialize();
public:
	EVP_CIPHER_CTX_Guard();
	~EVP_CIPHER_CTX_Guard();
	EVP_CIPHER_CTX* get();
};

#endif // !EVP_CYPHER_CTX_GUARD_H