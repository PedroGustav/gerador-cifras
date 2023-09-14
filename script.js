// const fs = require('fs');
// import jsPDF from 'jspdf';

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
    // [D]Te amo, Deus, tua gr[G]aça nunca f[D]alha

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
function transporCifra(cifraOriginal, semitons) {
  const acordes = cifraOriginal.split(/(\[.*?\])/); // Divide a cifra em acordes e texto
  const acordeRegex = /^\[([A-G][#b]?[mM]?)([4-9]|10|11|12|13)?\]$/; // Regex para identificar acordes

  const acordesTranspostos = acordes.map((element) => {
      const acorde = element.match(acordeRegex); // Verifica se é um acorde
      if (acorde) {
      //   console.log(element);
      const notaOriginal = acorde[1]; // Extrai a nota do acorde
      const notaTransposta = transporNota(notaOriginal, semitons); // Transpõe a nota
      console.log("antes: ", notaOriginal, "agora: ", notaTransposta);
      return `[${notaTransposta}]`; // Reconstroi o acorde transposto
    } else {
      return element; // Mantém o texto inalterado
    }
  });

  return acordesTranspostos.join(''); // Junta os elementos transpostos
}
  
function transporNota(nota, semitons) {
  let restoDaNota;
  if(nota.length > 0){
      restoDaNota = nota.substring(1);
  }
  const notas = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const indiceOriginal = notas.indexOf(nota[0]);
  console.log('')
  const indiceTransposto = (indiceOriginal + semitons) % 12;
  return `${notas[indiceTransposto]}${restoDaNota}`;
}


const submitButton = document.getElementById('submit-cifra');
const LoadingCifra = document.getElementById('loading-cifra');
const savePdfButton = document.getElementById('baixar-cifra-pdf');
const titleValue = document.getElementsByClassName('cifra-title')[0];
const authorValue = document.getElementsByClassName('cifra-author')[0];
const tomValue = document.getElementsByClassName('cifra-tom')[0];
const contentValue = document.getElementsByClassName('cifra_input')[0];

const CifraTitle = document.getElementById('title');
const CifraAuthor = document.getElementById('author');
const CifraTom = document.getElementById('tom');


const cifraChordpro = `[C]Esta é [Am]a [F]letra da [C]música,
[Dm]Com [G7]alguns [C]acordes [F]simples.

[C]Vamos [Am]tocar [F]juntos [Dm]agora,
[Em]Com [Am]a [G7]melodia [C]suave.
`;



const cifraFormatada = formatarCifrasChordPro(cifraChordpro);
const linhas = cifraFormatada.split('\n');

linhas.forEach((linha, index) => {
  if(index % 2 === 0){
    document.getElementById('container-cifra').innerHTML += `<pre class="linha-cifra">${linha}</pre>`;
  }else{
    document.getElementById('container-cifra').innerHTML += `<pre class="linha-letra">${linha}</pre>`
  }
  
})

submitButton.addEventListener('click', function(){
  LoadingCifra.style.display = 'flex';
  LoadingCifra.style.animation = "fadeIn 10s ease-in-out";
  

  setTimeout(() => {
    LoadingCifra.style.animation = "";
    LoadingCifra.style.display = 'none';    
}, 4000)
  setTimeout(() => {
    CifraTitle.innerText = titleValue.value;
    CifraAuthor.innerText = authorValue.value;
    CifraTom.innerText = tomValue.value;
    document.getElementById('row-actions-cifra').style.display = 'flex';
    document.getElementById('container-cifra').innerHTML = '';
    console.log(contentValue.value);
    const cifraFormatada = formatarCifrasChordPro(contentValue.value);
    const linhas = cifraFormatada.split('\n');
    linhas.forEach((linha, index) => {
      if(index % 2 === 0){
      document.getElementById('container-cifra').innerHTML += `<p class="linha-cifra" style="color: #25AC8C !important;">${linha}</p>`;
    }else{
      document.getElementById('container-cifra').innerHTML += `<p class="linha-letra">${linha}</p>`
    }
  })
  
}, 1000)



})

  
savePdfButton.addEventListener('click', function(){
  document.getElementById('row-actions-cifra').innerHTML = '';
  LoadingCifra.innerHTML = "";
  const divPraPdf = document.getElementsByClassName('right-side')[0];
  var opt = {
    margin:       0.1,
    filename:     `${titleValue.value}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf(divPraPdf, opt);
  setInterval(() => {
    document.getElementById('row-actions-cifra').innerHTML = `<button class="actions-cifra" id="baixar-cifra-pdf">
              <img src="./assets/icons/file-arrow-down.svg" alt="" srcset="">
              Baixar em PDF
          </button>
          <button class="actions-cifra" id="copiar">
              <img src="./assets/icons/copy.svg" alt="" srcset="">
  
              Copiar
          </button>`
  }, 1000);
})

const cifraTransposta = transporCifra(cifraFormatada, 15);
// Salva o resultado em um arquivo de texto
// fs.writeFileSync('cifras_formatadas.txt', cifraTransposta, 'utf-8');

