#ifndef B64_ENC_H
#define B64_ENC_H
#include <openssl/evp.h>
#include <openssl/bio.h>
#include <stdexcept>
#include <openssl/buffer.h>
#include <string>
#include <vector>
class B64Enc {
public:
	const std::vector<unsigned char> decodeB64(const std::string& data) const;
	const std::string encodeB64(const std::vector<unsigned char>& data) const;
};

#endif // !B64_ENC_H