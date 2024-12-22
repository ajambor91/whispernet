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
//#include <emscripten/bind.h>


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

int main() {
	Main mainProgram("bkJQ7g1eA3WxzqrDcI9VldzWuBFZtkCNoeqyPXI8IcA=");
	//mainProgram.encodeMessage("TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST");
	mainProgram.decodeMessage("lsIclo0l/T5OXSHapnYKZzvCWpYwaqWXgUHSt1toRCMjqgymPlyewvAU2wrSZabopR14FI+0kQ30wccP1eCxDFNsZX1G9/iN1zPs2gMmolNEpHzoZMK86d65wBmGTKWIWFxV4aJbhKmyyMBYLQI+0pIlxPi7pTL8EDMeADcTMR4Kd5NxkEo8Og6mBXbj1r2XEI2YMfWmwU1xt51DeXfFx6+EApx/TO9RfNMPdw677JGu3eyDIh6TIxhRo8eeVObhvugeQ6KvJGSdwSNCzdg/htEqXb/hLmsN8ZJBprDmTEXuNu9lfbPerzTAPuI1YO7R", "m6kUGEPZycNsnBviOxB5Zg==");

}

//EMSCRIPTEN_BINDINGS(MainBinding) {
//	emscripten::class_<Main>("Main")
//		.constructor<>()
//		.function("encodeMessage", &Main::encodeMessage)
//		.function("decodeMessage", &Main::decodeMessage);
//}

