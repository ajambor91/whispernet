#include <iostream>
#include "Encryptor.h"
#include "Sanitizer.h"
#include <emscripten/bind.h>

using namespace std;


class Main {
	private:
		Encryptor encryptor;
		Sanitizer sanitizer;
	public:
		Main() {}
		std::string encodeMessage(const std:: string& data) {
			std::string sanitizedMessage = sanitizer.sanitize(data);
			std::string encodedData = encryptor.encrypt(sanitizedMessage);
			std::cout << encodedData;
			return sanitizedMessage;
		}

		void decodeMessage() {

		}
};

//int main() {
//	Main mainProgram;
//	mainProgram.encodeMessage();
//}

EMSCRIPTEN_BINDINGS(MainBinding) {
	emscripten::class_<Main>("Main")
		.constructor<>()
		.function("encodeMessage", &Main::encodeMessage)
		.function("decodeMessage", &Main::decodeMessage);
}