resource "aws_security_group" "example" {
  name        = "example-security-group"
  description = "Example security group"

    ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" #allow all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "mtc_auth" {
  key_name   = "mtc-key"
  public_key = file("./z-key.pub")
}

resource "aws_instance" "dev_node" {
  ami                    = data.aws_ami.server_ami.id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.mtc_auth.id
  vpc_security_group_ids = [aws_security_group.example.id]

  user_data = file("userdata.tpl")

  tags = {
    Name = "dev_node"
  }

  root_block_device {
    volume_size = 10
  }
}
