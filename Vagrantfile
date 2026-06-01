# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.boot_timeout = 600

  # ── VM1 ──────────────────────────────────────────────────────────────────────
  config.vm.define "vm1" do |vm1|
    vm1.vm.box = "ubuntu/focal64"
    vm1.vm.hostname = "vm1"

    vm1.vm.network "private_network", ip: "192.168.56.10"

    vm1.vm.provider "virtualbox" do |vb|
      vb.name   = "livraria-vm1"
      vb.memory = 1024
    end
  end

  # ── VM2 ──────────────────────────────────────────────────────────────────────
  config.vm.define "vm2" do |vm2|
    vm2.vm.box = "ubuntu/focal64"
    vm2.vm.hostname = "vm2"

    vm2.vm.network "private_network", ip: "192.168.56.11"

    vm2.vm.synced_folder ".", "/vagrant_data"

    vm2.vm.provider "virtualbox" do |vb|
      vb.name   = "livraria-vm2"
      vb.memory = 1024
    end

    vm2.vm.provision "shell", inline: <<-SHELL
      apt-get update -y

      # Node.js 20 LTS
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs

      # Dependências nativas para sqlite3
      apt-get install -y build-essential python3

      # Instala as dependências do projeto compiladas para Linux
      cd /vagrant_data
      rm -rf node_modules
      npm install --omit=dev

      # Cria serviço systemd para a aplicação
      tee /etc/systemd/system/livraria-api.service > /dev/null << SERVICE_UNIT
[Unit]
Description=Livraria API
After=network.target

[Service]
WorkingDirectory=/vagrant_data
ExecStart=/usr/bin/node index.js
Restart=always
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE_UNIT

      systemctl daemon-reload
      systemctl enable livraria-api
      systemctl start livraria-api
    SHELL
  end

end
