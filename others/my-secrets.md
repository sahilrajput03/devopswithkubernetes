My pixabay api (https://pixabay.com/api/docs/) key: 26336180-44ffc61cd30fed4049870d836

Its base 64 encoded version is: MjYzMzYxODAtNDRmZmM2MWNkMzBmZWQ0MDQ5ODcwZDgzNg==

You can check 64 base decoded text via browser as well, i.e., `btoa()` for encryption and `atob()` for decryption. I.e., atob('MjYzMzYxODAtNDRmZmM2MWNkMzBmZWQ0MDQ5ODcwZDgzNg==') should give the original api key in browser console.

```bash
age-keygen -o key.txt
# now using public key from above file or stdout simply:
sops --encrypt --age age15vf84g080au93lmww53zvklvvh8g5l9kfng56mqvlzn9zm7vjatqpe7hwe secret.yaml > secret.enc.yaml
# FYI: --age has alias of -a and --encrypt has alias of -e (FROM `sops -h`)
# FYI: We can pass age value from environment variables as well i.e., `export SOPS_AGE_RECIPIENTS=pubKey1[,pubKey2][,pubKey3]...`. Refer my `multiple-public-keys-encryption-for-teams` in `others` folder for more info.

# Later when any developer pulls from github he need to have the key.txt file to be able to regenerate secret.yaml file again, by:
export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
sops --decrypt secret.enc.yaml > secret.yaml
# FYI: --decrypt has alias of -d
```

Docs: encryption: https://github.com/mozilla/sops#22encrypting-using-age

**FYI: From docs the age file should be better be places at conventional path so its picked automatically when decrypting.**
Src: https://github.com/mozilla/sops#encrypting-using-age

When decrypting a file with the corresponding identity, sops will look for a text file name keys.txt located in a sops subdirectory of your user configuration directory. On Linux, this would be $XDG_CONFIG_HOME/sops/age/keys.txt.

## Decrypt and apply on the fly

```bash
# Decrypt and kubectl apply -f on the fly??
sops -d secret.enc.yaml | kubectl apply -f -
```
