const messageForm=document.querySelector('#message-form');
const messageInput=document.querySelector('#message-input');
const messages=document.querySelector('#messages');
const quickReplies=document.querySelectorAll('.quick-replies button');

function answerFor(message){
  const text=message.toLocaleLowerCase('pt-BR');
  if(/document|papel|identidade|cpf|comprovante/.test(text)) return 'A documentação depende do serviço e da instituição. Consulte os requisitos no canal oficial antes de se deslocar. Se me disser qual serviço procura e em qual instituição, posso orientar sua busca.';
  if(/agend|horário|horario|presencial|senha|marcar/.test(text)) return 'Para solicitar atendimento presencial, volte ao cadastro, escolha “Atendimento presencial agendado”, indique o serviço e informe a data e o período de preferência. A senha é apresentada após o envio da solicitação.';
  if(/online|virtual|remoto|chat/.test(text)) return 'Você já está no atendimento online da Adianta. Conte um pouco sobre o serviço público que procura para eu ajudar a encontrar a próxima etapa.';
  if(/inss|previd|benefício|beneficio/.test(text)) return 'Para assuntos do INSS, consulte os serviços e orientações no portal Meu INSS ou no site oficial do INSS. No cadastro Adianta, selecione INSS e descreva o serviço para organizar sua solicitação.';
  if(/defens|juríd|jurid|justiça|justica/.test(text)) return 'Para orientação jurídica, procure a Defensoria Pública da sua região e confira os canais e critérios oficiais. No cadastro Adianta, escolha Defensoria Pública e descreva o atendimento que precisa.';
  if(/serviço|servico|consult|opções|opcoes/.test(text)) return 'A Adianta apresenta exemplos de atendimento previdenciário do INSS e orientação jurídica da Defensoria Pública. Acesse “Serviços” no site para consultar os links e depois escolha a instituição no cadastro.';
  if(/olá|ola|oi|bom dia|boa tarde|boa noite/.test(text)) return 'Olá! Que bom falar com você. Você quer consultar um serviço, saber sobre documentos ou solicitar um agendamento?';
  if(/obrigad/.test(text)) return 'Por nada! Se precisar, posso ajudar com informações sobre serviços, documentos e agendamentos.';
  return 'Posso ajudar com consulta de serviços, documentação necessária e agendamentos. Diga qual instituição ou tipo de atendimento você procura.';
}

function addMessage(text,kind){
  const message=document.createElement('p');
  message.className=`message ${kind}-message`;
  message.textContent=text;
  messages.append(message);
  messages.scrollTop=messages.scrollHeight;
}

function sendMessage(text){
  const clean=text.trim();
  if(!clean)return;
  addMessage(clean,'visitor');
  messageInput.value='';
  window.setTimeout(()=>addMessage(answerFor(clean),'service'),350);
  messageInput.focus();
}

messageForm.addEventListener('submit',event=>{
  event.preventDefault();
  sendMessage(messageInput.value);
});
quickReplies.forEach(button=>button.addEventListener('click',()=>sendMessage(button.textContent)));
