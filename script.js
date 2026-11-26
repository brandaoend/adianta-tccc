const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));

const search=document.querySelector('#service-search');
search.addEventListener('input',()=>{
  const query=search.value.trim().toLocaleLowerCase('pt-BR');
  document.querySelectorAll('.service-item').forEach(item=>{
    item.hidden=!`${item.dataset.search} ${item.innerText}`.toLocaleLowerCase('pt-BR').includes(query);
  });
});

const form=document.querySelector('#request-form');
const result=document.querySelector('#request-result');
const inPersonFields=[...document.querySelectorAll('.in-person-field')];
const storageKey='adianta-cadastro-v1';
function updateModeFields(){
  const inPerson=form.querySelector('input[name="mode"]:checked')?.value==='presencial';
  inPersonFields.forEach(field=>{
    field.hidden=!inPerson;
    const control=field.querySelector('input,select');
    control.required=inPerson;
  });
}
form.querySelectorAll('input[name="mode"]').forEach(input=>input.addEventListener('change',()=>{
  updateModeFields();
  saveForm();
}));
function saveForm(){
  const values={};
  new FormData(form).forEach((value,key)=>{values[key]=value;});
  values.reminders=form.elements.reminders.checked;
  localStorage.setItem(storageKey,JSON.stringify(values));
}
function restoreForm(){
  const saved=localStorage.getItem(storageKey);
  if(!saved)return;
  try{
    const values=JSON.parse(saved);
    Object.entries(values).forEach(([key,value])=>{
      const field=form.elements.namedItem(key);
      if(!field)return;
      if(field instanceof RadioNodeList){[...field].forEach(option=>option.checked=option.value===value);}
      else if(field.type==='checkbox')field.checked=Boolean(value);
      else field.value=value;
    });
    updateModeFields();
    if(values.lastResult){result.innerHTML=values.lastResult;result.hidden=false;}
  }catch{localStorage.removeItem(storageKey);}
}
form.addEventListener('input',saveForm);
form.addEventListener('change',saveForm);
restoreForm();
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  const isInPerson=data.get('mode')==='presencial';
  if(!isInPerson){
    saveForm();
    window.open('chat.html','_blank','noopener,noreferrer');
    result.innerHTML=`<h3>Chat aberto em uma nova aba</h3><p>Olá, ${escapeHtml(data.get('name'))}. Você já pode conversar com o assistente virtual da Adianta.</p><p><a href="chat.html" target="_blank" rel="noopener noreferrer">Abrir o chat novamente ↗</a></p>`;
    result.hidden=false;
    result.focus();
    return;
  }
  const code=String(Math.floor(100000+Math.random()*900000));
  const detail=`Senha demonstrativa: <span class="ticket-number">A-${code}</span><p>Preferência informada: ${escapeHtml(data.get('date'))} · ${escapeHtml(data.get('period'))}. A senha e o horário não são válidos para atendimento real.</p>`;
  result.innerHTML=`<h3>Solicitação presencial registrada</h3><p>Olá, ${escapeHtml(data.get('name'))}. Sua solicitação para ${escapeHtml(data.get('institution'))} foi registrada nesta demonstração.</p>${detail}${data.get('reminders')?'<p>Preferência por lembretes anotada nesta demonstração. Nenhuma notificação ou e-mail será enviado.</p>':''}`;
  result.hidden=false;
  const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');
  saved.lastResult=result.innerHTML;
  localStorage.setItem(storageKey,JSON.stringify(saved));
  result.focus();
});
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
