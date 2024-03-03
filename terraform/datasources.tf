data "aws_ami" "server_ami" {
  most_recent = true
  owners      = ["099720109477"] #get the owner id from the AWS IAMs console

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"] #get the value from the AWS AMI detail tab
  }
}