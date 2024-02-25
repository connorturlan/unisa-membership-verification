export const sha256 = async (s) => {
  // same as: py -c "from hashlib import sha256; print(sha256(bytes('', 'utf8')).hexdigest())"
  const msgBuffer = new TextEncoder().encode(s.toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
