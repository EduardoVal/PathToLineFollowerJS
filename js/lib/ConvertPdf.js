//'use strict';

// Based on the methodology from here: http://ihaochi.com/2015/03/14/exporting-svg-to-pdf-in-javascript.html
// Libraries used:
// 		saveSvgAsPng - https://github.com/exupero/saveSvgAsPng
// 		jsPDF - https://github.com/MrRio/jsPDF
/*

Respondendo à sua pergunta, esta função retorna o objeto DOM com o ID especificado.
Por exemplo, se você tiver em seu HTML:
<div id="thisIsMyDivId">This is some content</div>
Você pode obter o elemento DIV usando:
var myDiv = $('thisIsMyDivId');
A ideia desta função é substituir a necessidade de usar document.getElementById para fazer isso.
E......repetindo o que todo mundo aqui já fez...Não é uma função JS nativa, ela é implementada em alguns Frameworks (Prototype e jQuery AFAIK).
*/

/*ConvertPdf.js:55 Uncaught TypeError: $ is not a function*/

(function(global, $) {
    function convertToPdf(svg, callback) {
      
      // Call svgAsDataUri from saveSvgAsPng.js
      window.svgAsDataUri(svg, {}, svgUri => {
        // Create an anonymous image in memory to set 
        // the png content to
        let $image = $('<img>'),
          image = $image[0];
  
        // Set the image's src to the svg png's URI
        image.src = svgUri;
        $image
          .on('load', () => {
            // Once the image is loaded, create a canvas and
            // invoke the jsPDF library
            let canvas = document.createElement('canvas'),
              ctx = canvas.getContext('2d'),
              doc = new jsPDF('portrait', 'pt'),
              imgWidth = image.width,
              imgHeight = image.height;
  
            // Set the canvas size to the size of the image
            canvas.width = imgWidth;
            canvas.height = imgHeight;
  
            // Draw the image to the canvas element
            ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
  
            // Add the image to the pdf
            let dataUrl = canvas.toDataURL('image/jpeg');
            doc.addImage(dataUrl, 'JPEG', 0, 0, imgWidth, imgHeight);
  
            callback(doc);
          });
      });
    }

$(() => {
  let $svg = $('#svg'), $save = $('#save-to-pdf'),  $filenameInput = $('#filename');
  $save.on('click', () => {
    // Convert it to PDF first
    pdflib.convertToPdf($svg[0], doc => {
      
      // Get the file name and download the pdf
      let filename = $filenameInput.val();
      pdflib.downloadPdf(filename, doc);
    });
  });
});


  function downloadPdf(fileName, pdfDoc) {
    
    // Dynamically create a link
    let $link = $('<a>'),
      link = $link[0],
      dataUriString = pdfDoc.output('dataurlstring');

    // On click of the link, set the HREF and download of it
    // so that it behaves as a link to a file
    $link.on('click', () => {
      link.href = dataUriString;
      link.download = fileName;
      $link.detach(); // Remove it from the DOM once the download starts
    });

    // Add it to the body and immediately click it
    $('body').append($link);
    $link[0].click();
  }

  // Export this mini-library to the global scope
  global.pdflib = global.pdflib || {};
  global.pdflib.convertToPdf = convertToPdf;
  global.pdflib.downloadPdf = downloadPdf;
})(window, window.jQuery);


function convertPdf() {
    console.log("function convertPdf()");
    //document.getElementById("demo").innerHTML = "Hello World";
    document.querySelector("#demo").innerHTML = "Hello World!";
    /*
    With jQuery you select (query) HTML elements and perform "actions" on them.
    Basic syntax is: $(selector).action()
    A $ sign to define/access jQuery
    A (selector) to "query (or find)" HTML elements
    A jQuery action() to be performed on the element(s)
    What is AJAX?
    AJAX = Asynchronous JavaScript and XML.
    */
    //$("p").hide();
    //$("#demo").innerHTML = "Hello World!";
    let svg = document.getElementById("svg");
    downloadPDF(svg, "pdfSVG"); 
}

function downloadPDF(svg, outFileName) {
    let doc = new PDFDocument({ compress: false });
    
   


    SVGtoPDF(doc, svg, 0, 0);
    let stream = doc.pipe(blobStream());
    stream.on('finish', () => {
        let blob = stream.toBlob('application/pdf');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = outFileName + ".pdf";
        link.click();
    });
    

    doc.end();
}