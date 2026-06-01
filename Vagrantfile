# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.boot_timeout = 600

  # ── VM1 — Nó de Controle Ansible ─────────────────────────────────────────────
  config.vm.define "vm1" do |vm1|
    vm1.vm.box = "ubuntu/focal64"
    vm1.vm.hostname = "vm1"

    vm1.vm.network "private_network", ip: "192.168.56.10"

    vm1.vm.synced_folder ".", "/vagrant_data"

    vm1.vm.provider "virtualbox" do |vb|
      vb.name   = "livraria-vm1"
      vb.memory = 1024
    end

    vm1.vm.provision "shell", inline: <<-SHELL
      apt-get update -y
      apt-get install -y software-properties-common
      add-apt-repository --yes --update ppa:ansible/ansible
      apt-get install -y ansible

      # Gerar chave SSH para comunicação com VM2
      sudo -u vagrant ssh-keygen -t ed25519 -f /home/vagrant/.ssh/ansible_id -N "" -q

      # Salvar chave pública na pasta compartilhada para que VM2 possa lê-la
      cp /home/vagrant/.ssh/ansible_id.pub /vagrant_data/ansible/ansible_id.pub

      # Copiar arquivos Ansible para o home do vagrant
      cp -r /vagrant_data/ansible /home/vagrant/ansible
      chown -R vagrant:vagrant /home/vagrant/ansible
    SHELL
  end

  # ── VM2 — Nó Gerenciado ───────────────────────────────────────────────────────
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
      # Autorizar a chave pública gerada pelo nó de controle (VM1)
      cat /vagrant_data/ansible/ansible_id.pub >> /home/vagrant/.ssh/authorized_keys
      chmod 600 /home/vagrant/.ssh/authorized_keys
    SHELL
  end

end
