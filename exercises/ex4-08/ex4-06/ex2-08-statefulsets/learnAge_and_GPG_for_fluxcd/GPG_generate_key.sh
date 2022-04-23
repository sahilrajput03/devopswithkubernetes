#!/bin/bash
# Generate a GPG/OpenPGP key with no passphrase (%no-protection):
# ===============================================================
# src: https://fluxcd.io/docs/guides/mozilla-sops/#generate-a-gpg-key

#gnu docs: https://www.gnupg.org/

# LEARN: YOU MAY HAVE BELOW TWO VARIABLES IN YOUR BASHRC AS WELL.
export KEY_NAME="cluster0.yourdomain.com"
export KEY_COMMENT="flux secrets"

gpg --batch --full-generate-key <<EOF
%no-protection
Key-Type: 1
Key-Length: 4096
Subkey-Type: 1
Subkey-Length: 4096
Expire-Date: 0
Name-Comment: ${KEY_COMMENT}
Name-Real: ${KEY_NAME}
EOF

# Q. What is `key fingerprint`? 
# SRC: https://en.wikipedia.org/wiki/Public_key_fingerprint
# In public-key cryptography, a public key fingerprint is a short sequence of bytes used to identify a longer public key. Fingerprints are created by applying a cryptographic hash function to a public key. Since fingerprints are shorter than the keys they refer to, they can be used to simplify certain key management tasks. In Microsoft software, "thumbprint" is used instead of "fingerprint."

# It configuration creates an rsa4096 key that does not expire. For a full list of options to consider for your environment, see: https://www.gnupg.org/documentation/manuals/gnupg/Unattended-GPG-key-generation.html

############### Output from above execution:
# gpg: key 7e4a4745955bafee marked as ultimately trusted
# gpg: revocation certificate stored as '/home/array/.gnupg/openpgp-revocs.d/8D9042DBB6AF001AA3A146AD7E4A4745955BAFEE.rev'


############### Observations from above output:
## There are total of three elements, private key, public key and key fingerprint.
## FYI: The file saved above ie., `NAME.rev` here `NAME` is the full `key fingerprint` itself.
## FYI(extra): the keytext in first row (above output) is actually the later half of the `key fingerprint`.
## FYI: You can get the full fingerprint inside the NAME.rev's file as well(although NAME is full key fingerprint as well).


############### Getting `GPG key fingerprint`
# gpg --list-secret-keys "${KEY_NAME}"
# You can match (if there are many) your key fingerprint by looking at the later part of the `key fingerprint` which we got at the time of creating it (refer: FYI(extra)).
### and looking for second row of the `sec` column.
# LEARN: YOU MAY STORE KEY_FP TO YOUR BASHRC FILE
# export KEY_FP=8D9042DBB6AF001AA3A146AD7E4A4745955BAFEE
# ^^ key fingerprint

############### Getting private key
# Setting `key fingerprint` as environment variable: 
# export KEY_FP=KEY_FINGERPRINT_HERE
# gpg --export-secret-keys --armor "${KEY_FP}"

############### Creating secret named `sops-gpg` from our private key via piping:
# gpg --export-secret-keys --armor "${KEY_FP}" | kubectl create secret generic sops-gpg --namespace=flux-system --from-file=sops.asc=/dev/stdin
# FYI: From `kc create secret --help` we know that in above command: ``generic: Create a secret from a local file, directory, or literal value``.

#IF required you can delete above secret with:
# kubectl delete secret generic sops-gpg --namespace=flux-system

############### Now you can check if secret is added or even edit though:
# kc edit secrets -n flux-system sops-gpg

# kc get secrets -n flux-system sops-gpg
# Output:
# NAME       TYPE     DATA   AGE
# sops-gpg   Opaque   1

#FYI: We use this `sops-gpg` secret @ `.spec.description.secretRef.name` in our  `secrets-kustomization.yml` file.



############### Deleting a key from local pc (will delete both public_key and private_key).
# gpg --delete-secret-keys "${KEY_FP}"
# It is recommended to store this private keys in your password managers though.


############### Export public key to git repo so people can encrypt any files for future:
gpg --export --armor "${KEY_FP}" > .sops.pub.asc

############### Team members can impport above public key to their gpg to encrpty new files in future:
# gpg --import ./clusters/cluster0/.sops.pub.asc
### The public key is sufficient for creating brand new files. The secret key is required for decrypting and editing existing files because SOPS computes a MAC on all values. When using solely the public key to add or remove a field, the whole file should be deleted and recreated.
