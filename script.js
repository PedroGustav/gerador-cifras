// ===== Declarando Funções =====
// 1 - Função que tranforma do formatoChordPro para a formatação apropriada para leitura;
function formatarCifrasChordPro(entrada) {

  const cifraChordpro = entrada.replace(/ /g, "  ");
  const linhas = cifraChordpro.split('\n');
  const cifrasFormatadas = [];
  const letraFormatada = [];

  linhas.forEach((linha) => {
    if (linha.trim() === "") {
      cifrasFormatadas.push(""); // Linha em branco
      letraFormatada.push(" ");
      return;
    }

    let cifraEncontrada = false;
    let novaLinhaCifras = "";
    let novaLinhaLetra = "";

    let residuo = 0;
    
    for (let i = 0; i < linha.length; i++){

      if (linha[i] === "[") {
          cifraEncontrada = true;
          continue;
      }
      if (linha[i] === "]") {
        // novaLinhaLetra += " ";
        cifraEncontrada = false;
        continue;
      }
        
      if (cifraEncontrada) {
        novaLinhaCifras += linha[i];
        residuo += 1;
      }else {
        if(residuo == 0){
          novaLinhaCifras += " ";
        }else{
          residuo --;
        }
        novaLinhaLetra += linha[i];

      }
     
    }

    cifrasFormatadas.push(novaLinhaCifras);
    letraFormatada.push(novaLinhaLetra);
  });

//   const resultado = letraFormatada.map((letra, indice) => `${cifrasFormatadas[indice]}\n${letra}`);
  const resultado = letraFormatada.map((letra, indice) => `${cifrasFormatadas[indice]}\n${letra}`);
  return resultado.join("\n");
}


// 2- Função que recebe a cifra completa em ChordPro e retorna transposta na quantidade de semitons desejado.
function transporCifra(cifraOriginal, semitons) {
  const acordes = cifraOriginal.split(/(\[.*?\])/); // Divide a cifra em acordes e texto
  const acordeRegex = /^\[([A-G][#b]?[mM]?)([4-9]|10|11|12|13)?\]$/; // Regex para identificar acordes

  const acordesTranspostos = acordes.map((element) => {
      const acorde = element.match(acordeRegex); // Verifica se é um acorde
      if (acorde) {
      const notaOriginal = acorde[1]; // Extrai a nota do acorde
      const notaTransposta = transporNota(notaOriginal, semitons); // Transpõe a nota
      return `[${notaTransposta}]`; // Reconstroi o acorde transposto
    } else {
      return element; // Mantém o texto inalterado
    }
  });
  return acordesTranspostos.join(''); // Junta os elementos transpostos
}  

// 3 - Função para transpor cada um dos acordes.
function transporNota(nota, semitons) {
  const notas = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let notaOriginal;
  let restoDaNota;
  let notaTransposta;
  if(nota.length > 1){
    if(nota[1] === '#'){
      notaOriginal = nota.substring(0,2);
      restoDaNota = nota.substring(2);
    }else{
      notaOriginal = nota[0];
      restoDaNota = nota.substring(1);
    }
    let indiceOriginal = notas.indexOf(notaOriginal);
    let soma = indiceOriginal + semitons;
    if(soma < 0){
      soma += 12;
    }
    let indicieTransposto = soma % 12;
    notaTransposta = `${notas[indicieTransposto]}${restoDaNota && restoDaNota}`
  }else{
    notaOriginal = nota;
    let indiceOriginal = notas.indexOf(notaOriginal);
    let soma = indiceOriginal + semitons;
    if(soma < 0){
      soma += 12;
    }
    let indicieTransposto = soma % 12;
    notaTransposta = `${notas[indicieTransposto]}`;
  }

  return notaTransposta;
}

// 4 - Função que engloba todo o processo de inserir a cifra formatada na tela
function exibirCifraFormatada(){
  CifraTitle.innerText = title;
  CifraAuthor.innerText = author;
  CifraTom.innerText = tom;
  document.getElementById('row-actions-cifra').style.display = 'flex';
  document.getElementById('container-cifra').innerHTML = '';
  cifraFormatada = formatarCifrasChordPro(cifraChordpro);
  linhas = cifraFormatada.split('\n');
  linhas.forEach((linha, index) => {
    if(index % 2 === 0){
    document.getElementById('container-cifra').innerHTML += `<p class="linha-cifra" style="color: #25AC8C !important;">${linha}</p>`;
    }else{
      document.getElementById('container-cifra').innerHTML += `<p class="linha-letra">${linha}</p>`
    }
  })
};


// Criando uma instância do jsPDF
let doc = new jsPDF();
let pageHeight = 297;
// ========== Definindo as áreas da DOM que serão utilizadas ==========
// --> Botões
const createCifraForm = document.getElementById('generate-form');
const savePdfButton = document.getElementById('baixar-cifra-pdf');
const increaseTonality = document.getElementById('add-tom');
const decreaseTonality = document.getElementById('diminuir-tom');

// --> Área de Carregamento
const LoadingCifra = document.getElementById('loading-cifra');

// --> Inputs do Formulário
const titleValue = document.getElementsByClassName('cifra-title')[0];
const authorValue = document.getElementsByClassName('cifra-author')[0];
const tomValue = document.getElementsByClassName('cifra-tom')[0];
const contentValue = document.getElementsByClassName('cifra_input')[0];

// --> Área que é modificada a cada preenchimento do formulário
const CifraTitle = document.getElementById('title');
const CifraAuthor = document.getElementById('author');
const CifraTom = document.getElementById('tom');
const notas = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


let title = 'O título da sua cifra';
let author = 'Autor';
let tom = 'C';
let cifraChordpro = `[C]Esta é [Am]a [F]letra da [C]música,
[Dm]Com [G7]alguns [C]acordes [F]simples.

[C]Vamos [Am]tocar [F]juntos [Dm]agora,
[Em]Com [Am]a [G7]melodia [C]suave.
`;

let cifraFormatada = formatarCifrasChordPro(cifraChordpro);
let linhas = cifraFormatada.split('\n');

linhas.forEach((linha, index) => {
  if(index % 2 === 0){
    document.getElementById('container-cifra').innerHTML += `<pre class="linha-cifra">${linha}</pre>`;
  }else{
    document.getElementById('container-cifra').innerHTML += `<pre class="linha-letra">${linha}</pre>`
  }
  
})

createCifraForm.addEventListener('submit', function(e){
  e.preventDefault();
  if(!contentValue.value){
    alert('O campo da cifra não pode estar vazio!');
    return;
  }
  if(!titleValue.value){
    alert('O título da cifra não pode estar vazio!');
    return;
  }
  if(!authorValue.value){
    alert('O autor da cifra não pode estar vazio!');
    return;
  }
  if(!tomValue.value){
    alert('indique o tom da música!');
    return;

  }
  cifraChordpro = contentValue.value;
  title = titleValue.value;
  author = authorValue.value;
  tom = tomValue.value;
  // Inicia a animação de carregamento..
  LoadingCifra.style.display = 'flex';
  LoadingCifra.style.animation = "fadeIn 10s ease-in-out";
  
  // Após 4 segundos, ele remove a tela de carregamento
  setTimeout(() => {
    LoadingCifra.style.animation = "";
    LoadingCifra.style.display = 'none';    
  }, 4000)


  // Após 1 segundo ele insere os dados na tela.
  setTimeout(() => {
    exibirCifraFormatada();
  }, 1000); 

  
  
})

savePdfButton.addEventListener('click', function(){
  doc.setFont('Courier', 'Bold');
  doc.setFontSize(25);
  doc.text(title, 10, 10);
  doc.setFontSize(14);
  doc.setTextColor(37,172,140);
  doc.text(author, 10, 17);
  doc.setTextColor(0,0,0);
  doc.text(`Tom:`, 10, 30);
  doc.setTextColor(37,172,140);
  doc.text(tom, 25, 30);
  doc.setTextColor(0,0,0);
  doc.setFontSize(11);
  doc.setFont('Courier', 'normal');
  const cifraFormatadapdf = formatarCifrasChordPro(cifraChordpro);
  const linhaspdf = cifraFormatadapdf.split('\n');
  let espacamento = 50;
  linhaspdf.forEach((linha, index) => {
    if(index % 2 === 0){
      // Linha de Acordes da Cifra
      doc.setTextColor(37,172,140);
      doc.setFont('Courier', 'Bold');
      doc.text(linha, 10, espacamento);
    }else{
      // Linha de Letra da música da Cifra
      doc.setTextColor(0,0,0);
      doc.setFont('Courier', 'normal');
      doc.text(linha, 10, espacamento);
    }
    var textHeight = doc.getTextDimensions(linha).h;
    if(espacamento + textHeight + 5 > pageHeight){
      doc.addPage();
      espacamento = 20;
    }else{
      if(index % 2 === 0){
        espacamento +=5;
      }else{
        espacamento+=7;
      }
    }
  });
  var pdfBlob = doc.output('blob');
  var pdfUrl = URL.createObjectURL(pdfBlob);
  savePdfButton.href = pdfUrl;
  savePdfButton.download = `${titleValue.value}.pdf`
});

increaseTonality.addEventListener('click', function(){
  cifraChordpro = transporCifra(cifraChordpro, 1);
  
  let TomNovo = (notas.indexOf(tom) + 1) % 12;
  tom = notas[TomNovo];
  exibirCifraFormatada();
});

decreaseTonality.addEventListener('click', function(){
  cifraChordpro = transporCifra(cifraChordpro, -1);
  let soma = notas.indexOf(tom) + (-1);
    if(soma < 0){
      soma += 12;
    }
    let TomNovo = soma % 12;
    tom = notas[TomNovo];
  exibirCifraFormatada();
});

