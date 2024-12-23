#ifndef B64_ENC_H
#define B64_ENC_H
#include <stdexcept>
#include <string>
#include <vector>
class B64Enc {
private:
	const std::string BASE64_CHARS;
public:
	B64Enc();
	const std::vector<unsigned char> decodeB64(const std::string& data) const;
	const std::string encodeB64(std::vector<unsigned char> data) const;
};

#endif // !B64_ENC_H