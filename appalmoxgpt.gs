function onSubmit(e) {
  // código para ler o QR code e obter a informação
  // código para adicionar os dados na planilha do Google Sheets
}

Dessa forma, quando o formulário for submetido, a função onSubmit será 
executada e realizará as ações necessárias para ler o QR code e adicionar 
os dados na planilha. É importante lembrar que, para utilizar o App Script, 
é necessário criar um projeto no Google Cloud Platform e habilitar a API do 
Google Sheets. Além disso, o código pode precisar de algumas adaptações para 
se integrar com o restante do seu sistema.


---------------------------------------------------------------------------------------------------------------------------------------------------

// Adicione esta função no seu código JavaScript existente

function scanQRCode() {
  // Seleciona a tag de vídeo do HTML
  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');

  // Seleciona o canvas do HTML
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', '300');
  canvas.setAttribute('height', '200');

  // Seleciona o contexto do canvas
  const context = canvas.getContext('2d');

  // Adiciona o vídeo ao contexto do canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Chama a função de decodificação do QR Code
  const qrCode = jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);

  // Se o QR Code for decodificado com sucesso, retorna o valor
  if (qrCode) {
    return qrCode.data;
  }

  // Caso contrário, retorna null
  return null;
}

// Adicione este código ao evento click do botão de captura do QR Code

const constraints = {
  video: {
    facingMode: {
      exact: "environment"
    }
  }
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      const intervalId = setInterval(() => {
        const result = scanQRCode();
        if (result) {
          clearInterval(intervalId);
          video.pause();
          video.srcObject = null;
          stream.getTracks()[0].stop();
          // Faz alguma ação com o resultado do QR Code
          console.log(result);
        }
      }, 100);
    };
  })
  .catch(error => {
    console.error(error);
  });
  
  
Para abrir a câmera do celular e coletar o código QR, você pode usar a API 
Web de Captura de Mídia (MediaDevices.getUserMedia) junto com a biblioteca JSQR.
Com isso, é possível acessar a câmera do dispositivo e realizar a leitura do QR Code.
  
Este código JavaScript irá abrir a câmera do dispositivo e realizar a leitura do QR 
Code quando o botão for clicado. O valor do QR Code será retornado para que possa ser 
usado em outras partes do código.

Observe que o código acima é apenas um exemplo e pode precisar ser adaptado de acordo 
com as necessidades específicas do seu projeto. Além disso, é importante lembrar que a 
API de captura de mídia pode não funcionar em alguns dispositivos ou navegadores, então 
é uma boa ideia testar o seu código em vários dispositivos e navegadores para garantir 
a compatibilidade.  

---------------------------------------------------------------------------------------------------------------------------------------

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Controle de Almoxarifado</title>
  </head>
  <body>
    <form id="almoxarifado-form">
      <label for="obra">Obra:</label>
      <select id="obra" name="obra">
        <option value="obra1">Obra 1</option>
        <option value="obra2">Obra 2</option>
        <option value="obra3">Obra 3</option>
      </select>
      <br>
      <label for="material">Material:</label>
      <input id="material" type="text" name="material" required>
      <br>
      <label for="quantidade">Quantidade:</label>
      <input id="quantidade" type="number" name="quantidade" required>
      <br>
      <input type="submit" value="Adicionar Material">
    </form>
    <script>
      // Código JavaScript aqui
    </script>
  </body>
</html>

------------------------------------------------------------------------------------------------------------------------------

//Função que é executada após o QR code ser lido
function onQRCodeScanned(qrCodeValue) {
  var material = getMaterial(qrCodeValue); //Função que retorna os dados do material a partir do código QR
  var obra = getObra(); //Função que retorna a obra selecionada pelo usuário
  var quantidade = getQuantidade(); //Função que retorna a quantidade selecionada pelo usuário
  var sheet = SpreadsheetApp.getActiveSheet(); //Pega a planilha ativa
  
  //Verifica se o material já foi inserido na planilha
  var row = findMaterial(material.nome, obra);
  
  if(row !== -1) {
    //Se o material já foi inserido na planilha, atualiza a quantidade
    var newRow = [obra, material.nome, material.descricao, quantidade, row[4] + quantidade];
    sheet.getRange(row[0], 1, 1, 5).setValues([newRow]);
  } else {
    //Se o material não foi inserido ainda, adiciona um novo registro
    var lastRow = sheet.getLastRow();
    var newRow = [obra, material.nome, material.descricao, quantidade, quantidade];
    sheet.getRange(lastRow + 1, 1, 1, 5).setValues([newRow]);
  }
}

//Função que busca o material na planilha
function findMaterial(materialName, obra) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][1] == materialName && data[i][0] == obra) {
      return [i + 1, data[i][1], data[i][2], data[i][3], data[i][4]];
    }
  }
  
  return -1;
}
