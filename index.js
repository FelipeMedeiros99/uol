//------------ variáveis --------// 
const repositorio = 'https://mock-api.driven.com.br/api/v4/uol/participants'
const statusOnline = "https://mock-api.driven.com.br/api/v4/uol/status"
const mensagensServidor = "https://mock-api.driven.com.br/api/v4/uol/messages"
let nomeUsuario = ""
let main = document.querySelector('main')
incioUsuario = true
let texto = ""
let hora = ""

//------------ funçoes ----------//
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
}

function plotaMensagem(tipo, usuarioQueEnviou, usuarioQueRecebe="", mensagem, hora=hora){
    // console.log(tipo, usuarioQueEnviou, usuarioQueRecebe, mensagem, hora)
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
    
    // gerando todas as mensagens e plotando na tela
    let dadosGerais = dado.data
    dadosGerais.forEach(function(informacoes){plotaMensagem(
        tipo=informacoes.type,
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
    nomeUsuario = prompt('Insira seu nome: ')
    // enviando para o axios e entrando na sala
    let promessaEnvio = axios.post(repositorio, {name: nomeUsuario})
    promessaEnvio.then(entrarNaSala)
    promessaEnvio.catch(mostraErro)

    // ficando online
    setInterval(manterOnline, 3000)
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
    console.log(texto)
    hora = Date().substring(16, 24);
    let dadosDoEnvio = {
        from: nomeUsuario, 
        to: 'Todos',
        text: texto,
        type: 'message',
        time: hora
    }

    // limpando a tela

    let promessaEnvio = axios.post(mensagensServidor, dadosDoEnvio)
    promessaEnvio.then(adicionaMensagemTodos)
    promessaEnvio.catch(mostraErro)
}

function adicionaMensagemTodos(dado){
    plotaMensagem(tipo='message', usuarioQueEnviou=nomeUsuario, usuarioQueRecebe="Todos", mensagem=texto, hora=hora)
}


// ------------ código ----------//
// setInterval(criaTelaDeMensagens, 3000)


criaTelaDeMensagens()

