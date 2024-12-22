#ifndef BIO_GUARD_H
#define BIO_GUARD_H
#include <openssl/bio.h>
#include <openssl/aes.h>
#include <openssl/evp.h>
#include <stdexcept>
class BIO_Guard {
private:
	BIO* bio;
	BIO* b64;
	void cleanup();
	void setup(const std::string& b64Data);
public:
	BIO_Guard(const std::string& b64Data);
	~BIO_Guard();
	BIO* get();
};
#endif // !BIO_GUARD_H