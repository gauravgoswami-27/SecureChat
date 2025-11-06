const crypto = require("crypto");
const ALGO = "aes-256-gcm";

function encrypt(plainText, keyBuffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, keyBuffer, iv, { authTagLength: 16 });
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

function decrypt({ iv, authTag, ciphertext }, keyBuffer) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    keyBuffer,
    Buffer.from(iv, "base64"),
    { authTagLength: 16 }
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);
  return plain.toString("utf8");
}

module.exports = { encrypt, decrypt };
