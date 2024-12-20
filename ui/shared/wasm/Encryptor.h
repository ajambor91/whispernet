#ifndef ENCRYPTOR_H
#define ENCRYPTOR_H
#include <string>
class Encryptor {
public:
	Encryptor();
	std::string encrypt(const std::string& data);
};
#endif // !ENCRYPTOR_H
