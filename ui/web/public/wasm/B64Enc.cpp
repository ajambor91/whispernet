#include "B64Enc.h"


B64Enc::B64Enc() : BASE64_CHARS(
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	"abcdefghijklmnopqrstuvwxyz"
	"0123456789+/") {}


const std::vector<unsigned char> B64Enc::decodeB64(const std::string& data) const {
	if (data.size() == 0) {
		throw std::runtime_error("Data is empty");
	}
	size_t inLen = data.size();
	size_t i = 0;
	size_t j = 0;
	int in_ = 0;
	unsigned char charArray4[4], charArray3[3];
	std::vector<unsigned char> decoded;

	while (inLen-- && (data[in_] != '=') && (isalnum(data[in_]) || data[in_] == '+' || data[in_] == '/')) {
		charArray4[i++] = data[in_];
		in_++;
		if (i == 4) {
			for (i = 0; i < 4; i++) {
				charArray4[i] = BASE64_CHARS.find(charArray4[i]);
			}

			charArray3[0] = (charArray4[0] << 2) + ((charArray4[1] & 0x30) >> 4);
			charArray3[1] = ((charArray4[1] & 0xf) << 4) + ((charArray4[2] & 0x3c) >> 2);
			charArray3[2] = ((charArray4[2] & 0x3) << 6) + charArray4[3];

			for (i = 0; i < 3; i++) {
				decoded.push_back(charArray3[i]);
			}
			i = 0;
		}
	}

	if (i > 0) {
		for (size_t j = i; j < 4; j++) {
			charArray4[j] = 0;
		}

		for (size_t j = 0; j < 4; j++) {
			charArray4[j] = BASE64_CHARS.find(charArray4[j]);
		}

		charArray3[0] = (charArray4[0] << 2) + ((charArray4[1] & 0x30) >> 4);
		charArray3[1] = ((charArray4[1] & 0xf) << 4) + ((charArray4[2] & 0x3c) >> 2);
		charArray3[2] = ((charArray4[2] & 0x3) << 6) + charArray4[3];

		for (size_t j = 0; j < i - 1; j++) {
			decoded.push_back(charArray3[j]);
		}
	}
	return decoded;

}	

const std::string B64Enc::encodeB64(std::vector<unsigned char> data) const {
	if (data.size() == 0) {
		throw std::runtime_error("Data is empty");
	}
	std::string encoded;
	size_t i= 0;
	unsigned char charArray3[3];
	unsigned char charArray4[4];

	for (unsigned char c : data) {
		charArray3[i++] = c;
		if (i == 3) {
			charArray4[0] = (charArray3[0] & 0xfc) >> 2;
			charArray4[1] = ((charArray3[0] & 0x03) << 4) + ((charArray3[1] & 0xf0) >> 4);
			charArray4[2] = ((charArray3[1] & 0x0f) << 2) + ((charArray3[2] & 0xc0) >> 6);
			charArray4[3] = charArray3[2] & 0x3f;

			for (i = 0; i < 4; i++) {
				encoded.push_back(BASE64_CHARS[charArray4[i]]);
			}
			i = 0;
		}
	}

	if (i > 0) {
		for (size_t j = i; j < 3; j++) {
			charArray3[j] = '\0';
		}

		charArray4[0] = (charArray3[0] & 0xfc) >> 2;
		charArray4[1] = ((charArray3[0] & 0x03) << 4) + ((charArray3[1] & 0xf0) >> 4);
		charArray4[2] = ((charArray3[1] & 0x0f) << 2) + ((charArray3[2] & 0xc0) >> 6);
		charArray4[3] = charArray3[2] & 0x3f;

		for (size_t j = 0; j < i + 1; j++) {
			encoded.push_back(BASE64_CHARS[charArray4[j]]);
		}

		while (i++ < 3) {
			encoded.push_back('=');
		}
	}

	return encoded;
}