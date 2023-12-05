//"use strict" 
//O objetivo "use strict"é indicar que o código deve ser executado em "modo estrito".
//Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
//A diretiva "use strict" só é reconhecida no início de um script ou função.

const EPSILON = 0.0001
const decimals = 4
var TWO_PI = 2 * Math.PI;
var QUARTER_PI = Math.PI / 4;
const NUMBER_BIG = Math.pow(10, 7);

//interface i_orientation {
var colinear = 0, clockwise = 1, counterclockwise = 2;
var names_orientation = ["colinear", "clockwise", "counterclockwise"];

//const π = Math.PI;


//The ArrayBuffer is a data type that is used to represent a generic, fixed-length binary data buffer.
//this.buffer_P = new ArrayBuffer(rows)(cols);
//The DataView is a low-level interface that provides a getter/setter API to read and write arbitrary data to the buffer.
//this.PATH = new Int16Array(buffer_P);
//M = new int[rows][cols];
//H = new int[rows][cols];

//readTextFile("file.txt");
//readTextFile("file:///C:/your/path/to/file.txt");
//file://C:/Users/ehcval/Documents/JavaScript/file.txt
/*
fetch("file.txt")
  .then((res) => res.text())
  .then((text) => {
    // do something with "text"
  })
  .catch((e) => console.error(e));
*/

//por valor em vez de referência com Array.map 
function createMatrix(rows, cols, n) {
    return Array(rows).fill(null).map(() => Array(cols).fill(n));//por valor em vez de referência com Array.map 
}

function get_column(arr, n) {
    return arr.map(x => x[n]);
}
//odd even par impar
function to_odd(n) {    
    return 2*Math.round(n/2);
}

function degrees(rad) {
    return (rad * 180.0) / Math.PI;
}

function radians(deg) {
    return (deg / 180.0) * Math.PI;
}

const areEqual = (one, other, epsilon = EPSILON) => Math.abs(one - other) < epsilon;

function swap(a, b) {
    //b = [a, a = b][0];
    [a, b] = [b, a];
    return [a, b]
}

function fmod(a, b) {
    //result = (int) Math .floor (a / b);
    //return a - result * b;
    return Number((a - (Math.floor(a / b) * b)));
}


//Function vetoriais
function array_set(a, b) {
    a[0] = b[0];
    a[1] = b[1];
}

function linearize(m, c) {
    return m.map((e, i) => m[i][1] * c + m[i][0]);
}

function array_equal(a, b) {
    if (a[0] == b[0] && a[1] == b[1])
        return true;
    else return false;
}

function subtration(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}

function addition(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}
//const f_rotate_matrix = (x => [[cos(x),-sin(x)], [sin(x), cos(x)]]);
function rotate_point(p, angle) {
    // rotate point
    let xnew = p[0] * Math.cos(angle) - p[1] * Math.sin(angle);
    let ynew = p[0] * Math.sin(angle) + p[1] * Math.cos(angle);
    return [roundTo(xnew, 4), roundTo(ynew, 4)];
}

function dxy_ahead(p, a) {
    return [Math.round(p[0] * Math.cos(a)), Math.round(p[1] * Math.sin(a))]
}

function p_ahead(p, a) {
    return [p[0] + Math.round(Math.cos(a)), p[1] + Math.round(Math.sin(a))];
}



function distance_straight(a, b) {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
}

function distance_Manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// 0 ... +2*PI
function constrain_pattern_transfer(a) {
    a = fmod(a, 2 * Math.PI);
    if (a < 0)
        a += 2 * Math.PI;
    return a;
}

//Arrenda para zero quando a diferença é muito pequena
function diff_angle(a, b) {
    let dif = fmod(b - a + Math.PI, TWO_PI);
    if (dif < 0)
        dif += TWO_PI;

    if (areEqual(dif, Math.PI))
        return 0;
    else
        return dif - Math.PI;
}

/*
area = (y2 - y1)*(x3 - x2) - (y3 - y2)*(x2 - x1)
http://www.geeksforgeeks.org/orientation-3-ordered-points/
To find orientation of ordered triplet (p, q, r).
The function returns following values
0 --> p, q and r are colinear; 1 --> Clockwise; 2 --> Counterclockwise
 */

function orientation_giro(p, q, r) {
    let area = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (area == 0)
        return colinear;
    return (area > 0) ? clockwise : counterclockwise;
}

function orientation_giro2(q, r) {
    let area = q[1] * (r[0] - q[0]) - q[0] * (r[1] - q[1]);
    if (area == 0)
        return colinear;
    return (area > 0) ? clockwise : counterclockwise;
}

function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);

    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(digits);
    if (negative) {
        n = (n * -1).toFixed(digits);
    }
    return parseFloat(n);
}
//Retorna um número aleatório entre os valores especificados. O valor retornado não é menor que (e possivelmente igual) min e é menor que (e não igual) max.
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
//Retorna um número inteiro aleatório entre os valores especificados. O valor não é inferior a min (ou o próximo número inteiro maior que min se min não for um número inteiro) e é menor que (mas não igual a) max.
//Nota: Pode ser tentador usar Math.round() para fazer isso, mas isso faria com que seus números aleatórios seguissem uma distribuição não uniforme, o que pode não ser aceitável para suas necessidades.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

//Retorna um número inteiro aleatório entre dois valores, inclusive
//Embora a função getRandomInt() acima seja inclusiva no mínimo, é exclusiva no máximo. E se você precisar que os resultados sejam inclusivos tanto no mínimo quanto no máximo? A função getRandomIntInclusive() abaixo faz isso.

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


//Declarações de funções em JavaScript são hoisted (içados) à definição da função. Você pode usar uma função antes de tê-la declarado:

function matprint(mat) {
    let shape = [mat.length, mat[0].length];
    function col(mat, i) {
        return mat.map(row => row[i]);
    }
    let colMaxes = [];
    for (let i = 0; i < shape[1]; i++) {
        colMaxes.push(Math.max.apply(null, col(mat, i).map(n => n.toString().length)));
    }

    mat.forEach(row => {
        console.log.apply(null, row.map((val, j) => {
            return new Array(colMaxes[j] - val.toString().length + 1).join(" ") + val.toString() + "  ";
        }));
    });
}
/*
https://stackoverflow.com/questions/7486085/copy-array-by-value

Matriz de valores literais (tipo1)
As técnicas [ ...myArray ], myArray.splice(0), myArray.slice()e podem ser usadas para copiar em profundidade matrizes apenas com valores literais (booleano, número e string); myArray.concat()onde slice()tem o melhor desempenho no Chrome e spread ...tem o melhor desempenho no Firefox.

Matriz de valores literais (tipo1) e estruturas literais (tipo2)
A JSON.parse(JSON.stringify(myArray))técnica pode ser usada para copiar profundamente valores literais (booleano, número, string) e estruturas literais (matriz, objeto), mas não protótipos de objetos.

Todas as matrizes (tipo1, tipo2, tipo3)

As técnicas Lo-dash cloneDeep(myArray) ou jQuery extend(true, [], myArray) podem ser usadas para copiar profundamente todos os tipos de array. Onde a cloneDeep()técnica Lodash tem maior desempenho.
E para aqueles que evitam bibliotecas de terceiros, a função personalizada abaixo copiará profundamente todos os tipos de array, com desempenho inferior cloneDeep()e superior a extend(true).
*/
function copy(aObject) {
    // Prevent undefined objects
    // if (!aObject) return aObject;

    let bObject = Array.isArray(aObject) ? [] : {};

    let value;
    for (const key in aObject) {

        // Prevent self-references to parent object
        // if (Object.is(aObject[key], aObject)) continue;

        value = aObject[key];

        bObject[key] = (typeof value === "object") ? copy(value) : value;
    }

    return bObject;
}

// https://masteringjs.io/tutorials/fundamentals/enum
function createEnum(values) {
    const enumObject = {};
    for (const val of values) {
        enumObject[val] = val;
    }
    return Object.freeze(enumObject);
}


// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                console.log(allText);
            }
        }
    }
    rawFile.send(null);
}

function previewFile() {
    const content = document.querySelector(".content");
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            // this will then display a text file
            content.innerText = reader.result;
        },
        false,
    );

    if (file) {
        reader.readAsText(file);
    }
}

function in_interval(value, min, max) {
    //condition ? exprIfTrue : exprIfFalse
    return (value >= min && value < max) ? true : false;


}

function tablexy(m, title) {
    //Transforma a matiz para  coordenadas cartesianas    
    let mxy = m.slice();
    mxy.reverse();
    console.log(title);
    console.table(mxy);

}

function deleteFile() {
    var myObject;
    myObject = new ActiveXObject("Scripting.FileSystemObject");
    myObject.DeleteFile("C:\\Users\ehcval\Downloads\SVG_04_10_23.svg");
}

function toUnicode(theString) {
    var unicodeString = '';
    for (var i=0; i < theString.length; i++) {
      var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
      while (theUnicode.length < 4) {
        theUnicode = '0' + theUnicode;
      }
      theUnicode = '\\u' + theUnicode;
      unicodeString += theUnicode;
    }
    return unicodeString;
  }
  
  function substitution(theString) {
  var regex = /(\d)\s+(?=\d)/g;  
  var subst = `$1`;
      
    var str = `The store is 5 6 7 8`;
    
    // The substituted value will be contained in the result variable
    const result = str.replace(regex, subst);

    console.log('Substitution result: ', result);
  }
