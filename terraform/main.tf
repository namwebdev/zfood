resource "aws_security_group" "sc_group" {
  name        = var.app_security_group_name
  description = "Example security group"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
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
  vpc_security_group_ids = [aws_security_group.sc_group.id]

  user_data = file("userdata.tpl")



  root_block_device {
    volume_size = 10
  }

  #PLEASE PAY ATTENTION TO THE FOLLOWING LINE
  #make sure have nginx.conf file in the same directory. ( Example file: nginx.conf.example)
  #if not, remove all "connection" and "provisioner" block below.
  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("${path.module}/z-key")
    host        = self.public_ip
  }

  provisioner "file" {
    source      = "${path.module}/nginx.conf"
    destination = "/tmp/nginx.conf"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt install nginx -y",
      "sudo systemctl start nginx",
      "sudo systemctl enable nginx",
      "sudo cp /tmp/nginx.conf /etc/nginx/sites-enabled/app.conf",
      "sudo nginx -t && sudo systemctl reload nginx"
    ]
  }
  #

  tags = {
    Name = "dev_node"
  }
}
