# README

Commands use to generate secrets-repository and secrets-kustomization.yml files

Src:https://fluxcd.io/docs/guides/mozilla-sops/#configure-in-cluster-secrets-decryption

```bash
# FYI: Using --export flag makes it to print the source to stdout else they'll be applied to flux directly.
flux create source git my-secrets \
--url=https://github.com/my-org/my-secrets \
--branch=main --export > secrets-repository.yml
array@arch-os learnGPG$ ls
generateKeyGPG.sh  secrets-repository.yml

flux create kustomization my-secrets \
--source=my-secrets \
--path=./clusters/cluster0 \
--prune=true \
--interval=10m \
--decryption-provider=sops \
--decryption-secret=sops-gpg --export > secrets-kustomization.yml

# Configure the Git directory for encryption
# src: https://fluxcd.io/docs/guides/mozilla-sops/#configure-the-git-directory-for-encryption
cat <<EOF > ./clusters/cluster0/.sops.yaml
creation_rules:
  - path_regex: .*.yaml
    encrypted_regex: ^(data|stringData)$
    pgp: ${KEY_FP}
EOF
```
