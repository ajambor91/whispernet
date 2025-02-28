package net.whisper.security.helpers;

import org.bouncycastle.bcpg.ArmoredInputStream;
import org.bouncycastle.openpgp.*;
import org.bouncycastle.openpgp.jcajce.JcaPGPPublicKeyRingCollection;
import org.bouncycastle.openpgp.operator.jcajce.JcaKeyFingerprintCalculator;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

public class PGPHelper {
    public static boolean checkKey(String key) throws PGPException, IOException, NoSuchElementException {
        PGPPublicKey publicKey = PGPHelper.getKey(key);
        return publicKey.isEncryptionKey() && publicKey.isMasterKey();
    }

    public static PGPPublicKey getKey(String key) throws PGPException, IOException, NoSuchElementException {
        String cleanKey = PGPHelper.cleanKey(key);
        InputStream decoderStream = new ByteArrayInputStream(cleanKey.getBytes(StandardCharsets.UTF_8));
        return PGPHelper.checkData(decoderStream);
    }

    public static String convertToHex(String armoredASCII) throws IOException, PGPException {

        ByteArrayInputStream keyStream = new ByteArrayInputStream(armoredASCII.getBytes());
        ArmoredInputStream armoredInputStream = new ArmoredInputStream(keyStream);
        PGPPublicKeyRingCollection keyRings = new PGPPublicKeyRingCollection(armoredInputStream, new JcaKeyFingerprintCalculator());
        Iterator<PGPPublicKeyRing> keyRingIterator = keyRings.getKeyRings();
        StringBuilder hexString = new StringBuilder();
        if (!keyRingIterator.hasNext()) {
            throw new NoSuchElementException("No PGP Key found");
        }
        while (keyRingIterator.hasNext()) {
            PGPPublicKeyRing keyRing = keyRingIterator.next();
            Iterator<PGPPublicKey> keyIterator = keyRing.getPublicKeys();
            while (keyIterator.hasNext()) {
                PGPPublicKey key = keyIterator.next();
                byte[] keyBytes = key.getEncoded();
                for (byte b : keyBytes) {
                    hexString.append(String.format("%02X ", b));
                }
            }
        }
        return hexString.toString();
    }

    private static String cleanKey(String keyString) {
        keyString = keyString.replaceAll("-+\\s*[a-zA-Z ]+\\s*-+", "");
        keyString = keyString.replaceAll("(?m)^Comment:.*\\n?", "");
        keyString = keyString.replaceAll("\\\\r\\\\n", "\n");
        keyString = keyString.replaceAll("\\\\n", "\n");
        keyString = keyString.replaceAll("\\\\r", "\n");
        keyString = keyString.replaceAll("\\r\\n", "\n");
        keyString = keyString.replaceAll("\\r", "\n");
        keyString = keyString.replaceAll("\\\\t", "\t");
        keyString = keyString.lines()
                .map(String::stripTrailing)
                .collect(Collectors.joining("\n"));
        keyString = keyString.trim();

        return keyString;
    }

    private static PGPPublicKey checkData(InputStream stream) throws PGPException, IOException, NoSuchElementException {
        InputStream armorIn = PGPUtil.getDecoderStream(stream);
        JcaPGPPublicKeyRingCollection pgpPublicKeyRings = new JcaPGPPublicKeyRingCollection(armorIn);
        armorIn.close();
        Iterator<PGPPublicKeyRing> rIt = pgpPublicKeyRings.getKeyRings();
        while (rIt.hasNext()) {
            PGPPublicKeyRing kRing = rIt.next();
            Iterator<PGPPublicKey> kIt = kRing.getPublicKeys();
            while (kIt.hasNext()) {
                PGPPublicKey k = kIt.next();

                if (k.isEncryptionKey()) {
                    return k;
                }
            }
        }
        throw new NoSuchElementException("Key not found");
    }
}
