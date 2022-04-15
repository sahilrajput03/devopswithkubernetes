My pixabay api (https://pixabay.com/api/docs/) key in secrets and keepass safe.

Its base 64 encoded version can be obtained by:

```bash
echo -n $PIXABAY_TOKEN | base64 
# note: I imported secrets file which has api keys in them in my .bashrc file.
```

FYI: You can check 64 base decoded text via browser as well, i.e., `btoa()` for encryption and `atob()` for decryption. I.e., atob('MY_BASE64_ENCODED') should give the original api key in browser console.

```bash
#### ENCRYPTION
age-keygen -o key.txt
# now using public key from above file or stdout simply:
sops -e -a age15vf84g080au93lmww53zvklvvh8g5l9kfng56mqvlzn9zm7vjatqpe7hwe secret.yaml > secret.enc.yaml
# FYI: -a is an alias for --age and -e is alias for --encrypt (FROM `sops -h`)
# FYI: -a value can be used from environment variable as well via i.e.,
# export SOPS_AGE_RECIPIENTS=pubKey1[,pubKey2][,pubKey3]
# Refer my `multiple-public-keys-encryption-for-teams` in `others` folder for more info.
#
# FYI: You can pass one or more public keys via `--age` option while encrypting, which are separated by commans.


#### DECRYPTION
# Later when any developer pulls from github he need to have the key.txt file to be
# able to regenerate secret.yaml file again, by:
export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
export SOPS_AGE_KEY=myPrivateKeyText 
# NOTE: You must use only one of above environment variable to set access to private key for sops.
sops -d secret.enc.yaml > secret.yaml
```

Sops Docs: encryption: https://github.com/mozilla/sops#22encrypting-using-age

**FYI: From docs the age file should be better be places at conventional path so its picked automatically when decrypting.**
Src: https://github.com/mozilla/sops#encrypting-using-age

When decrypting a file with the corresponding identity, sops will look for a text file name keys.txt located in a sops subdirectory of your user configuration directory. On Linux, this would be $XDG_CONFIG_HOME/sops/age/keys.txt.

**Kubernetes decryption of secret files and apply on the fly:**

```bash
# Decrypt and kubectl apply -f on the fly??
sops -d secret.enc.yaml | kubectl apply -f -
```
