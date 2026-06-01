# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.boot_timeout = 600

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

      sudo -u vagrant ssh-keygen -t ed25519 -f /home/vagrant/.ssh/ansible_id -N "" -q

      # chave pública na pasta compartilhada para que VM2 leia durante o provisionamento
      cp /home/vagrant/.ssh/ansible_id.pub /vagrant_data/ansible/ansible_id.pub

      cp -r /vagrant_data/ansible /home/vagrant/ansible
      chown -R vagrant:vagrant /home/vagrant/ansible
    SHELL
  end

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
      cat /vagrant_data/ansible/ansible_id.pub >> /home/vagrant/.ssh/authorized_keys
      chmod 600 /home/vagrant/.ssh/authorized_keys
    SHELL
  end

end
