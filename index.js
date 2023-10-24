//------------ variáveis --------// 
const repositorio = 'https://mock-api.driven.com.br/api/v4/uol/participants'
const statusOnline = "https://mock-api.driven.com.br/api/v4/uol/status"
const mensagensServidor = "https://mock-api.driven.com.br/api/v4/uol/messages"
let nomeUsuario = ""
let main = document.querySelector('main')


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
    let hora = Date().substring(16, 24);
    // plotaMensagem("status", nomeUsuario, "entrou na sala...")
    plotaMensagem(tipo="status", usuarioQueEnviou=nomeUsuario, usuarioQueRecebe="", mensagem="entrou na sala...", hora)
    scrolBaixo()
}

function plotaMensagem(tipo, usuarioQueEnviou, usuarioQueRecebe="", mensagem, hora=''){
    // console.log(tipo, usuarioQueEnviou, usuarioQueRecebe, mensagem, hora)
    // tipo: alerta de usuario entrando/saindo, 
    // mensagens gerais e mensagens privadas.
    if (tipo == 'status'){
        main.innerHTML += `
        <div class="${tipo} mensagem">
            <p>
                <span>(${hora})</span>  <strong>${usuarioQueEnviou}</strong> ${mensagem}
            </p>
        </div>`
    }

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
        hora=informacoes.time)} 
    )

    // adicionando o novo usuario na conversa
    novoUsuario()
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
    
}

function scrolBaixo(){
    let sessaoMensagens = document.querySelectorAll('.mensagem')
    // let listaHtmlDasMensagens = sessaoMensagens.map(function(elemento){return elemento.innerHTML})
    sessaoMensagens[sessaoMensagens.length - 1].scrollIntoView()
    
    
}

// ------------ código ----------//
criaTelaDeMensagens()
