#include "Sanitizer.h"

Sanitizer::Sanitizer() : 
	allowedChars(
        "0123456789"
        "abcdefghijklmnopqrstuvwxyz"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "àáâãäåāăąæçćčĉďđèéêëēĕėęěĝğġģĥħ"
        "ìíîïīĭįıĵķĺļľłńņňŉŋòóôõöøōŏőœ"
        "ŕŗřśŝşšţťŧùúûüūŭůűųŵýÿŷźżžß"
        "ÀÁÂÃÄÅĀĂĄÆÇĆČĈĎĐÈÉÊËĒĔĖĘĚĜĞĠĢĤĦ"
        "ÌÍÎÏĪĬĮİĴĶĹĻĽŁŃŅŇŊÒÓÔÕÖØŌŎŐŒ"
        "ŔŖŘŚŜŞŠŢŤŦÙÚÛÜŪŬŮŰŲŴÝŸŶŹŻŽ"
        " .,!?"
    )
{}

std::string Sanitizer::sanitize(const std::string& data) {
    std::string result;
    for (char c : data) {
        if (allowedChars.find(c) != std::string::npos) {
            result += c;
        }
    }
	return result;
}