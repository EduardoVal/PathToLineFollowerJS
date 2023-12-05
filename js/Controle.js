let BANNER_SIZE = [[1000, 2000], [800, 1600], [800, 1200], [500, 900]];
let BOARD_BANNER = [[9, 19], [7, 15], [7, 11], [4, 8]];
let BANNER_PIXELS = [[11858, 23669], [9496, 18945], [9496, 14220], [5953, 10677]];
/*504 x 904 mm | 5953 x 10677 píxeis
804 x 1604 mm | 9496 x 18945 píxeis
2 - 1004 x 2004 mm | 11858 x 23669 píxeis
1 1004 x 3004 mm | 11858 x 35480 píxeis
804 x 1204 mm | 9496 x 14220 píxeis

504 x 1204 mm | 5953 x 14220 píxeis
*/

let GRADE = 100;

function loadScript(path) {
  const scriptTag = document.createElement("script");
  scriptTag.src = path;
  document.body.appendChild(scriptTag);
}
loadScript("js/Mapa.js");
loadScript("js/Board.js");
loadScript("js/SVG_Circuit.js");
loadScript("js/Util.js");

//loadScript("js/lib/activex-js-helpers/activex-js-helpers.js");

loadScript("js/lib/ConvertPdf.js");
loadScript("js/lib/svg-export.js");;
loadScript("js/lib/svg.path.js");


let board;

function main() {
  var c = document.querySelector('#colunas').valueAsNumber; //selected by id
  var r = document.querySelector('#linhas').valueAsNumber; //selected by id 
  var tick = document.querySelector('#tick').valueAsNumber; //selected by id  
  var grade = 100 + 50 * tick / 100;

  board = new Board(c, r, grade);

}


function resize() {

  var r = document.querySelector('#linhas').valueAsNumber; //selected by id  
  var c = document.querySelector('#colunas').valueAsNumber; //selected by id

  var margem_altura = document.querySelector('#margem_altura').valueAsNumber; //selected by id  
  var margem_largura = document.querySelector('#margem_largura').valueAsNumber; //selected by id
  var tick = document.querySelector('#tick').valueAsNumber; //selected by id  
  var grade = 100 + 50 * tick / 100;


  board.resize(c, r, grade, margem_largura, margem_altura);//cls canvas


}


