#include <iostream>
#include "Encryptor.h"
#include "Decryptor.h"
#include "Sanitizer.h"
#include "B64Enc.h"
#include <string>
#include <vector>
#include <nlohmann/json.hpp>
#include <exception>
using json = nlohmann::json;
#include <emscripten/bind.h>


class Main {
	private:
		std::string decodedSecret;
		Sanitizer sanitizer;
		Encryptor encryptor;
		Decryptor decryptor;
	public:
		Main(std::string secretArg) : encryptor(secretArg), decryptor(secretArg) {
		}
		std::string encodeMessage(const std:: string& data) {
			json responseData;
			try {
				std::string sanitizedMessage = sanitizer.sanitize(data);
				auto result = encryptor.encrypt(sanitizedMessage);
				std::string encryptedMessage = result.first;
				std::string iv = result.second;
		
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

		std::string decodeMessage(const std::string& b64Message, const std::string& IVKey) {
			json responseData;
			try {
				decryptor.setIV(IVKey);
				std::string decryptedMessage = decryptor.decryptMessage(b64Message);
				responseData = {
					{"decryptedMessage", decryptedMessage}
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
};

EMSCRIPTEN_BINDINGS(MainBinding) {
	emscripten::class_<Main>("Main")
		.constructor<std::string>()
		.function("encodeMessage", &Main::encodeMessage)
		.function("decodeMessage", &Main::decodeMessage);
}

