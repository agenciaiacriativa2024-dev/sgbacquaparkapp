Segue a descrição da aplicação de acessos de sócios e dependentes a um Parque Aquático, incluindo integração ao meio de pagamento asaas para cobranças de mensalidades.

Tela inicial:
>Logomarca;
>Formulário de login contendo Usuário e Senha;
>botão de entrar.


Tela inicial usuário 'CEO':
>Botão de 'Gerenciar Usuários';
>Botão de 'Gerenciar Passaportes';
>Botão de 'Gerenciar Planos';
>Botão ‘Sair’.

Tela de 'Gerenciar Usuários':
>Formulário de nome  Novo Usuário contendo campo de 'email do usuário' e um campo de escolha 'Tipo de Usuário' contendo 'CEO', 'Secretaria' e 'Portaria';
>Botão de Criar Usuário, quando clicado vai criar um usuário lá no 'Authentication' que vai receber um email automático para cadastramento de senha;
>Lista de Usuários existentes com um icone de lixeira caso queira excluir;
>Botão ‘Voltar’ flutuante na parte esquerda e inferior da tela.

Tela de 'Gerenciar Passaportes':
> Botão de 'Criar Novo Passaporte';
>Formulário para busca de passaportes existentes, primeiro campo sendo de escolha pelo que vai buscar o passaporte podendo ser por 'Número do Passaporte', por 'Nome do Responsável', por 'CPF' do responsável ou 'Nome do Titular do Passaporte'. Um botão de 'Buscar', quando clicar fazer a busca e um botão de 'limpar' para limpar a busca.
>Lista dos últimos 20 passaportes criados contendo 'Número do Passaporte', 'Nome do responsável' e um botão na lateral para 'editar'; Quando clicar vai para a ‘Tela de Editar Passaporte’.
>Botão ‘Voltar’ flutuante na parte esquerda e inferior da tela.

Tela de ‘Editar Passaporte’:
>Um formulário contendo ‘Número do Passaporte’, 'Nome Completo', 'CPF', 'Data de Nascimento' que não pode ser alterados e os campos 'Email', 'telefone', 'endereço' e 'Plano" que podem ser alterados;
> Botão de ‘Adicionar Carteirinha’;
> Lista das carteirinhas deste passaporte já apresentáveis em cards e em carrossel. Contendo foto, QRcode, Nome completo, Data de nascimento, grau de parentesco e número do passaporte; Quando não tiver foto mostrar no lugar da foto a mensagem “Se apresentar a secretaria com documento de identificação”; Cada carteirinha contendo um botão de Editar quando clicar vai para a ‘Tela de Editar Carteirinha’.

Tela de ‘Editar Carteirinha’:
>Formulário de nome ‘Editar Carteirinha’ contendo os campos ‘Grau de Parentesco’ sendo listado por [Titular, Esposo(a), Filho(a), Pai, Mãe, Sogro(a), Sobrinho(a), Irmão(ã), Tio(a), Neto(a) e Avô(ó)
], 'Nome Completo', 'CPF/CNH/ID ou CN', 'Data de Nascimento',
>Botão de ‘Tirar Foto Rosto’; Quando clicar abrir câmera para capturar foto e anexar. Captura em proporção 3x4 e usar recurso para compactar o tamanho do arquivo para no máximo 150kb
>Botão de ‘Tirar foto documento de identificação’. Quando clicar abrir câmera para capturar foto e anexar. Captura em proporção 3x4 e usar recurso para compactar o tamanho do arquivo para no máximo 400kb.
>Botão de ‘Salvar’; Quando clicar aparecer mensagem “carteirinha salva com sucesso” e voltar para a Tela  'Editar Passaporte';
>Botão ‘Voltar’ flutuante na parte esquerda e inferior da tela.

Tela Adicionar Carteirinha sendo usuário ‘Secretaria’ ou ‘CEO’:
>Formulário de nome ‘Carteirinha’ contendo os campos ‘Grau de Parentesco’ sendo listado por [Titular, Esposo(a), Filho(a), Pai, Mãe, Sogro(a), Sobrinho(a), Irmão(ã), Tio(a), Neto(a) e Avô(ó)
], 'Nome Completo', 'CPF/CNH/ID ou CN', 'Data de Nascimento',
>Botão de ‘Tirar Foto Rosto’; Quando clicar abrir câmera para capturar foto e anexar. Captura em proporção 3x4 e usar recurso para compactar o tamanho do arquivo para no máximo 150kb
>Botão de ‘Tirar foto documento de identificação’. Quando clicar abrir câmera para capturar foto e anexar. Captura em proporção 3x4 e usar recurso para compactar o tamanho do arquivo para no máximo 400kb.
>Botão de ‘Adicionar Carteirinha’ quando clicar gerar um QRcode definitivo para ela salvar os dados no banco de dados; Quando clicar aparecer mensagem “carteirinha adicionada com sucesso” e voltar para a Tela  'Editar Passaporte';
>Botão ‘Voltar’ flutuante na parte esquerda e inferior da tela.

Tela de 'Criar novo Passaporte':
>Formulário de nome 'Dados do Responsável Financeiro' contendo os campos 'Nome Completo', 'CPF', 'Data de Nascimento', 'Email (o mesmo do contrato)', 'telefone', 'endereço' e 'Plano", sendo o plano uma escolha listando os planos existentes criado pelo administrador;
>Botão 'Criar Passaporte', que quando clicado vai criar um usuário no Authentication com o email cadastrado recebendo um email automático para cadastrar a senha, vai criar no Firestore Database um 'users' 'SócioFamiliar' linkado com o usuário do Authentication e seu 'UID', vai criar um banco de dados para salvar todo o formulário e o principal que vai pegar o CPF cadastrado e vai fazer uma busca no asaas com a Api salvando o 'ID do cliente assas' sendo um exemplo 'cus_000132516261'. Aparecendo a mensagem de "cadastro foi realizado com sucesso. Favor entrar no email para cadastrar a senha do usuário" com o botão de 'OK' para voltar a tela de 'Criar Novo Passaporte';
>Botão ‘Voltar’ flutuante na parte esquerda e inferior da tela.


Tela de ‘Gerenciar Planos’:
>Formulário de nome ‘Novo Plano’ contendo o campo de ‘Nome do Plano’, ‘Valor Mensal’, ‘Descrição do Plano’. Botão de ‘Salvar Plano’ quando clicado salva o Plano, aparece a mensagem “Plano Salvo com sucesso”, dá um ‘refresh’ e continua na página;
>  Lista de todos os planos existentes contendo ‘Nome do Plano’, ‘Valor Mensal’, ‘Descrição do Plano’, um botão de ‘editar’ e um botão de ‘excluir’, sendo que se clicar em editar abre uma tela para editar o plano e salvar, e se clicar em ‘excluir’ abrir um alerta com a mensagem ‘tem certeza que vai excluir o Plano? Botão ‘sim’ e ‘cancelar’;
>Botão ‘Voltar’ flutuante na parte esquerda e inferior da tela.


Tela inicial usuário 'Secretaria':
Botão de 'Gerenciar Passaportes' clicando vai para a ‘Tela de Gerenciar Passaportes’ e seguir a mesma lógica quando usuário ‘CEO’;
>Botão ‘Sair’.

Tela inicial usuário 'Portaria':
>Abre um leitor de QRcode para ler as carteirinhas;
>quando ler o QRcode irá aparecer os dados da carteirinha, sendo ‘Foto’, ‘Nome’, ‘data de nascimento’, ‘grau de parentesco’ e situação financeira. 
> Aparecerá um botão de ‘liberar acesso’ e um de ‘encaminhar a secretaria’ e o porteiro clica em um de acordo com a situação financeira. Clicando em ‘liberar acesso’ conta como um acesso e clicando em ‘encaminhar a secretaria’ conta este evento. Voltando para a tela de inicial de leitura de QRcode.
>Botão ‘Sair’.


Tela inicial usuário 'SócioFamiliar':
>um card contendo 'Número do Passaporte', 'Nome do Responsável' e ‘Plano;
> Botão de ‘Situação Financeira’. Este botão deverá iniciar com fundo transparente, texto preto “Situação Financeira”  e uma animação de ‘buscando’ do lado enquanto tiver buscando as mensalidades no asaas via Api com os dados do ‘ID do cliente asaas’ salvo na hora da criação do passaporte. Quando finalizar a busca o botão ficará verde com o texto branco “Situação Financeira” e um icone de ‘ok’ branco do lado quando não tiver nenhuma mensalidade vencida, Ficará amarelo com o texto vermelho “Situação Financeira” e um icone de ‘atenção’ vermelho do lado quando tiver uma mensalidade vencida e ficará vermelho com o texto branco “Situação Financeira” com icone branco de ‘bloqueado’ do lado. Quando clicar vai para a situação financeira nesta mesma página abaixo das carteirinhas.
> Botão de ‘Adicionar Carteirinha’;
> Lista das carteirinhas deste passaporte já apresentáveis em cards e em carrossel. Contendo foto, QRcode, Nome completo, Data de nascimento, grau de parentesco e número do passaporte; Quando não tiver foto mostrar no lugar da foto a mensagem “Se apresentar a secretaria com documento de identificação;
>Situação Financeira contendo separadamente e nesta ordem, ‘mensalidades vencidas’, ‘mensalidades a pagar’ e ‘mensalidades pagas’. Mensalidades essas a serem puxadas do asaas via Api com os dados do ‘ID do cliente asaas’ salvo na hora da criação do passaporte.   
>Botão ‘Sair’.


Tela Adicionar Carteirinha sendo usuário ‘SócioFamiliar’:
>Formulário de nome ‘Carteirinha’ contendo os campos ‘Grau de Parentesco’ sendo listado por [Titular, Esposo(a), Filho(a), Pai, Mãe, Sogro(a), Sobrinho(a), Irmão(ã), Tio(a), Neto(a) e Avô(ó)
], 'Nome Completo', 'CPF/CNH/ID ou CN', 'Data de Nascimento',
>Botão de ‘Adicionar Carteirinha’ quando clicar gerar um QRcode definitivo para ela salvar os dados no banco de dados; Aparecer mensagem “carteirinha adicionada com sucesso” e voltar para a Tela inicial usuário 'SócioFamiliar';
>Botão ‘Voltar’ flutuante na parte esquerda e inferior da tela.
