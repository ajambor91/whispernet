#include <iostream>
#include "Encryptor.h"
#include "Sanitizer.h"
#include "B64Enc.h"
#include <string>
#include <vector>
#include <nlohmann/json.hpp>
#include <exception>
using json = nlohmann::json;
//#include <emscripten/bind.h>


class Main {
	private:
		std::string decodedSecret;
		Sanitizer sanitizer;
		Encryptor encryptor;
	public:
		Main(std::string secretArg) : encryptor(secretArg) {
		}
		std::string encodeMessage(const std:: string& data) {
			json responseData;
			try {
				std::string sanitizedMessage = sanitizer.sanitize(data);
				auto result = encryptor.encrypt(sanitizedMessage);
				std::string encryptedMessage = result.first;
				std::string iv = result.second;
				std::cout << sanitizedMessage << std::endl << std::endl;
		
				std::cout << encryptedMessage << std::endl << std::endl;
				std::cout << iv << std::endl << std::endl;
				responseData = {
					{"sanitazedMsg", sanitizedMessage},
					{"iv", iv},
					{"encryptedMsg", encryptedMessage}
				};
			}
			catch (const std::exception& e) {
				std::cout << "Exception: " << e.what() << std::endl;
			}
			catch (...) {
				std::cout << "Unknown exception";
			}
			return responseData.dump();
		}

		void decodeMessage() {

		}
};

int main() {
	Main mainProgram("bkJQ7g1eA3WxzqrDcI9VldzWuBFZtkCNoeqyPXI8IcA=");
	mainProgram.encodeMessage("TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST");
}

//EMSCRIPTEN_BINDINGS(MainBinding) {
//	emscripten::class_<Main>("Main")
//		.constructor<>()
//		.function("encodeMessage", &Main::encodeMessage)
//		.function("decodeMessage", &Main::decodeMessage);
//}