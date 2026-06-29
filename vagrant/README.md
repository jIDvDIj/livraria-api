# Monitoramento com Netdata

Este ambiente Vagrant provisiona duas VMs Ubuntu e configura o **Netdata** na VM2 para monitoramento em tempo real, com alertas de CPU enviados por e-mail.

## Pré-requisitos

- [VirtualBox](https://www.virtualbox.org/)
- [Vagrant](https://www.vagrantup.com/)

## Subindo o ambiente

```bash
cd vagrant
vagrant up
```

A VM1 atuará como controlador Ansible e aplicará automaticamente o playbook `data/configurar-monitoramento.yml` na VM2.

## Visualizando os dados coletados

### Dashboard web do Netdata

Após o provisionamento, acesse o dashboard em:

```
http://localhost:19999
```

O Netdata exibe métricas em tempo real de:

- **CPU** — utilização por núcleo e modo (user, system, iowait etc.)
- **Memória** — RAM, swap e cache
- **Disco** — I/O de leitura e escrita
- **Rede** — tráfego por interface
- **Processos** — processos em execução, forks, threads

### Acessando diretamente na VM2

```bash
vagrant ssh vm2
curl http://localhost:19999/api/v1/info
```

## Testando o alerta de CPU

O alerta é disparado quando a CPU ultrapassa **80%** de utilização por pelo menos 3 segundos.

### 1. Conecte-se à VM2

```bash
vagrant ssh vm2
```

### 2. Estresse a CPU com stress-ng

```bash
# Estressar todos os núcleos por 60 segundos
stress-ng --cpu 0 --timeout 60s

# Ou estressar especificando a porcentagem de uso
stress-ng --cpu 1 --cpu-load 90 --timeout 60s
```

### 3. Monitore os alertas

Observe o dashboard em `http://localhost:19999` — o indicador de CPU ficará vermelho assim que ultrapassar o limite configurado.

Para verificar os alertas ativos via linha de comando:

```bash
curl -s http://localhost:19999/api/v1/alarms?active | python3 -m json.tool
```

## Estrutura dos arquivos

```
vagrant/
├── Vagrantfile                        # Definição das VMs e provisionamento
├── README.md                          # Este arquivo
└── data/
    ├── configurar-monitoramento.yml   # Playbook Ansible para instalar e configurar o Netdata
    ├── inventory.ini                  # Inventário Ansible com IP da VM2
    └── ansible.cfg                    # Configurações do Ansible (chave SSH, usuário)
```

## Encerrando o ambiente

```bash
vagrant halt    # Suspende as VMs
vagrant destroy # Remove as VMs completamente
```
