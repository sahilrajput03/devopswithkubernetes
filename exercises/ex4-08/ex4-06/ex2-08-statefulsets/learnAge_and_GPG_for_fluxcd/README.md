# Readme

Below files in a folder will describe which public keys should be used to encrypt file for matching regex. Works very good!

FYI: Putting an invalid public key (say `age: abc`) also throws error i.e., invalid public key error.

Why even bother to use below file?

Because it helps to distribut public keys seamlessly, i.e., people no longer need supply a public key exclusively to `sops` binary while encrypting files so its of much convenience to use while using sops cli to encrypt exiting files(`sops -e -i file.yaml` i.e., inplcae encryption) or while creating new files (`sops myFile.yaml`).

Fyi: To edit a encrypted file you must be having private key configured with you sops cli (i.e., have $SOPS_AGE_KEY_FILE environment variables configured).

```yml
# File: .sops.yaml
# This file is only used at the time of encrypting exiting files(`sops -e -i file.yaml` i.e., inplcae encryption) or while creating new encryptd files (`sops myFile.yaml`).
#FYI: Since I have this .sops.yaml file, while creating (sops myNewFile.yaml), encrypting existing or decrypting existing file with ***matching regex*** below public keys would be used.
#FYI: We can see the public keys which were used to encrypt any file by directly reading that file.

# creation rules are evaluated sequentially, the first match wins
creation_rules:
        - path_regex: \.prod\.yaml$
          ###  Here comes my age public key, i.e, recepeint i.e., the value I have in my SOPS_AGE_RECIPIENTS.
          # age: age1g6g3ych2qzwzqgn3kj4hzpwwhhsqw47jmycy9vhf5j8d8jq483usdl2qgl

        - path_regex: \.dev\.yaml$
          age: another_age_public_key_here
          # We can multiple public keys as well:
          ## pgp: pgp_fingerprint_2
          ## kms: key_from_aws
          ## gcp_kms: key_from_gcp
          ## azure: key_from_azure
          # SRC: https://github.com/mozilla/sops#211using-sopsyaml-conf-to-select-kmspgp-for-new-files
          # We can use multiple public keys like below to encrypt our secret files, yikes!
          # Q. Why use multiple public keys to encrypt data?
          # Answer: Bcoz it helps us to recover data in time of loss of one of wprivate key we used to encrypt the data.
```
