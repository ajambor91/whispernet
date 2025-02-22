package net.whisper.security.services;

import net.whisper.security.helpers.PGPHelper;
import net.whisper.security.models.RedisUser;
import org.bouncycastle.openpgp.*;
import org.bouncycastle.openpgp.operator.jcajce.JcaKeyFingerprintCalculator;
import org.bouncycastle.openpgp.operator.jcajce.JcaPGPContentVerifierBuilderProvider;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.NoSuchElementException;

@Component
public class PGPVerifierService {


    public boolean validSignatureByMessage(String signedMessage, String originalMsg, RedisUser redisUser) throws IOException, PGPException {
        String[] parts = signedMessage.split("-----BEGIN PGP SIGNATURE-----");
        PGPPublicKey publicKey = PGPHelper.getKey(redisUser.getPublicKey());
        String signatureArmored = "-----BEGIN PGP SIGNATURE-----" + parts[1];
        InputStream signatureStream = PGPUtil.getDecoderStream(new ByteArrayInputStream(signatureArmored.getBytes(StandardCharsets.UTF_8)));
        PGPObjectFactory pgpObjectFactory = new PGPObjectFactory(signatureStream, new JcaKeyFingerprintCalculator());
        return this.validSig(pgpObjectFactory, publicKey, originalMsg);
    }

    public boolean validSignatureByFile(byte[] signedMessage, String message, RedisUser redisUser) throws PGPException, IOException, NoSuchElementException {

        InputStream signedInputStream = PGPUtil.getDecoderStream(new ByteArrayInputStream(signedMessage));
        PGPObjectFactory pgpFact = new PGPObjectFactory(signedInputStream, null);
        PGPPublicKey publicKey = PGPHelper.getKey(redisUser.getPublicKey());
        return this.validSig(pgpFact, publicKey, message);

    }

    private boolean validSig(PGPObjectFactory pgpObjectFactory, PGPPublicKey publicKey, String originalMsg) throws PGPException, IOException {
        Object obj;
        while ((obj = pgpObjectFactory.nextObject()) != null) {
            if (obj instanceof PGPSignatureList signatureList) {
                PGPSignature signature = signatureList.get(0);
                signature.init(new JcaPGPContentVerifierBuilderProvider().setProvider("BC"), publicKey);
                signature.update(originalMsg.getBytes(StandardCharsets.UTF_8));
                return signature.verify();
            }
        }
        throw new NoSuchElementException("Cannot find any signed message");
    }
}
