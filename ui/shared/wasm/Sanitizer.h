#ifndef SANITIZER_H
#define SANITIZER_H
#include <string>

class Sanitizer {
private:
	std::string allowedChars;
public:
	Sanitizer();
	std::string sanitize(const std::string& data);
};
#endif //!SANITIZER_H