**Make sure have created AWS credential**
```bash
terraform init

#Create key to ssh
ssh-keygen -t ed25519 # name it as z-key

terraform apply -auto-approve
```