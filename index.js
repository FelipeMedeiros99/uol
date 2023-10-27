//------------ variáveis --------// 
const repositorio = 'https://mock-api.driven.com.br/api/v4/uol/participants'
const statusOnline = "https://mock-api.driven.com.br/api/v4/uol/status"
const mensagensServidor = "https://mock-api.driven.com.br/api/v4/uol/messages"
let nomeUsuario = ""
let main = document.querySelector('main')
incioUsuario = true
let texto = ""
let hora = ""
let mensagens = ""
let pessoasOnlineNoMomento = [{name: ''}]
let pessoaSelecionada = 'Todos'
let tipo = "message"

//------------ funçoes ----------//
function adicionaNomeUsuario(){
    document.querySelector('.nomeUsuario').innerHTML=`<p>${nomeUsuario}</p>`
}

function mostraRetorno(dado){
    console.log('deu certo')
    console.log(dado)
}

function mostraErro(erro){
    console.log('deu erro')
    console.log(erro)
}

function entrarNaSala(dado){
    hora = Date().substring(16, 24);
    // plotando mensagens
    plotaMensagem(tipo="status", usuarioQueEnviou=nomeUsuario, usuarioQueRecebe="", mensagem="entrou na sala...", hora)
    scrollBaixo()
    tipo="message"
    adicionaNomeUsuario()
}

function plotaMensagem(tipo=tipo, usuarioQueEnviou, usuarioQueRecebe="", mensagem, hora=hora){
    // tipo: alerta de usuario entrando/saindo, 
    // mensagens gerais e mensagens privadas.
    if (tipo == 'status'){
        main.innerHTML += `
        <div class="${tipo} mensagem">
            <p>
                <span>(${hora})</span>  <strong>${usuarioQueEnviou}</strong>: ${mensagem}
            </p>
        </div>`
    }else if (tipo == "message"){
    main.innerHTML += 
    `<div class="${tipo} mensagem">
        <p>
            <span>(${hora})</span>  <strong>${usuarioQueEnviou}</strong> para <strong>${usuarioQueRecebe}</strong>: ${mensagem}
        </p>
    </div>`
    }else if(tipo== "private_message"){
        if (usuarioQueRecebe === nomeUsuario || usuarioQueEnviou === nomeUsuario){
            main.innerHTML += 
            `<div class="${tipo} mensagem">
                <p>
                    <span>(${hora})</span>  <strong>${usuarioQueEnviou}</strong> reservadamente para <strong>${usuarioQueRecebe}</strong>: ${mensagem}
                </p>
            </div>` 
        }
    }

    main.scrollTop = main.scrollHeight

}

function manterOnline(){
    axios.post(statusOnline, {name: nomeUsuario})
}

function criaTelaDeMensagens(){
    let promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promessa.then(recebeDadosMensagens)
    promessa.catch(mostraErro)
}

function recebeDadosMensagens(dado){
    mensagens = dado.data
    // gerando todas as mensagens e plotando na tela
    let dadosGerais = dado.data
    // limpando mensagens anteriores
    main.innerHTML = ""

    dadosGerais.forEach(function(informacoes){
        let tipo = informacoes.type
        plotaMensagem(
        tipo=tipo,
        usuarioQueEnviou=informacoes.from,
        usuarioQueRecebe=informacoes.to,
        mensagem=informacoes.text, 
        hora=informacoes.time)
        } 
    )
    
    if (incioUsuario){
        novoUsuario()
    }
}

function gerandoMensagensNaTela(dado){
}

function novoUsuario(){
    // pegando dados do usuário
    nomeUsuario = prompt('Insira seu nome')
    // enviando para o axios e entrando na sala
    let promessaEnvio = axios.post(repositorio, {name: nomeUsuario})
    promessaEnvio.then(entrarNaSala)
    promessaEnvio.catch(mostraErro)

    // ficando online
    setInterval(manterOnline, 1000)
    incioUsuario = false

}

function scrollBaixo(){
    // modo 1
    // let sessaoMensagens = document.querySelectorAll('.mensagem')
    // sessaoMensagens[sessaoMensagens.length - 1].scrollIntoView()
    main = document.querySelector('main')
    main.scrollTop = main.scrollHeight;
    
}

function enviarMensagem(){
    texto = document.querySelector('input').value
    hora = Date().substring(16, 24);
    let dadosDoEnvio = {
        from: nomeUsuario, 
        to: pessoaSelecionada,
        text: texto,
        type: tipo,
        time: hora
    }
    let promessaEnvio = axios.post(mensagensServidor, dadosDoEnvio)
    promessaEnvio.then(adicionaMensagemTodos)
    promessaEnvio.catch(mostraErro)
    document.querySelector('input').value = ''

}

function adicionaMensagemTodos(dado){
    plotaMensagem(tipo=tipo, usuarioQueEnviou=nomeUsuario, usuarioQueRecebe=pessoaSelecionada, mensagem=texto, hora=hora)
}

function abrirJanelaSecundaria(){
    document.querySelector(".janela2").classList.remove('oculto')
    document.querySelector('.sombra').classList.remove('oculto')
}

function pessoasOnline(){
    let promessa = axios.get(repositorio)
    promessa.then(adicionarNaPagina)
    promessa.catch(mostraErro)

}

function adicionarNaPagina(dado){
    let classePessoasOnlines = document.querySelector('.pessoasOnline');

    if (pessoasOnlineNoMomento.length !== dado.data.length){
        pessoasOnlineNoMomento = dado.data

        for(let i=0; i < pessoasOnlineNoMomento.length; i++){
            classePessoasOnlines.innerHTML = ``;
            (dado.data).forEach(function(dadoUsuario){
                if(dadoUsuario['name'] === nomeUsuario){
                }else{
                classePessoasOnlines.innerHTML += `
                <div class="caixaNomeIcon" onclick="selecionado(this)">
                    <ion-icon name="person-outline"></ion-icon>
                    <p>${dadoUsuario['name']}</p>
                    <ion-icon class="checkBox" name="checkmark-outline"></ion-icon>
                </div>`}})
        }

    }else{
    for(let i=0; i < pessoasOnlineNoMomento.length; i++){
        if (pessoasOnlineNoMomento[i]['name'] !== (dado.data)[i]['name']){
            pessoasOnlineNoMomento = dado.data;
            
            classePessoasOnlines.innerHTML = ``;
            (dado.data).forEach(function(dadoUsuario){
                if(dadoUsuario['name'] === nomeUsuario){
                }else{
                classePessoasOnlines.innerHTML += `
                <div class="caixaNomeIcon" onclick="selecionado(this)">
                    <ion-icon name="person-outline"></ion-icon>
                    <p>${dadoUsuario['name']}</p>
                    <ion-icon class="checkBox" name="checkmark-outline"></ion-icon>
                </div>`}})
            break
        }
    }}
    
}

function atualizarMensagens(){
    let promessa = axios.get(mensagensServidor)
    promessa.then(comparaMensagens)
    promessa.catch(mostraErro)
}

function comparaMensagens(dado){

    // se alguma mensagem nova for enviada, atualiza no main
    for (let i=0; i < (dado.data).length; i++){
        
        if (!(dado.data[i]['type'] === mensagens[i]['type'])){
            criaTelaDeMensagens()
            break
        }
    }    
}

function marcarPessoa(elemento){
    let checkMark = elemento.querySelector(".selecionado")
    checkMark.classList.toggle('oculto')
}

function selecionado(elemento){
    let elementosSelecionados = [...document.querySelectorAll('.selecionado')]
    elementosSelecionados.forEach(function(elementoDeElementos){
        elementoDeElementos.classList.toggle('selecionado')
    })

    elemento.querySelector('.checkBox').classList.add('selecionado')
    pessoaSelecionada = elemento.querySelector('p').innerText
    if (pessoaSelecionada==="Todos"){
        tipo="message"
    }else{
        tipo="private_message"
    }
}


function fecharJanelaSecundaria(){
    document.querySelector('.janela2').classList.add('oculto')
    document.querySelector('.sombra').classList.add('oculto')
}

function cliqueForaJanela2(){
    let janela2 = document.querySelector('.janela2')
    document.addEventListener('click', function(evento){
        if (!janela2.contains(evento.target)){
            fecharJanelaSecundaria()
        }
    })
}

// ------------ código ----------//
// setInterval(criaTelaDeMensagens, 3000)

criaTelaDeMensagens()

setInterval(atualizarMensagens, 1000)

setInterval(pessoasOnline, 1000)

cliqueForaJanela2()

document.addEventListener('keydown', function(acao){
    if (acao.key === "Enter"){
        enviarMensagem()
        
    }
})

