let INCH = 25.4;
let DPI = 96;
/*
In PDF versions earlier than PDF 1.6, the size of the default user space
    unit is fixed at 1 ⁄ 72 inch. In Acrobat viewers earlier than version 4.0, the
    minimum allowed page size is 72 by 72 units in default user space (1 by 1
    inch); the maximum is 3240 by 3240 units (45 by 45 inches). In Acrobat
    versions 5.0 and later, the minimum allowed page size is 3 by 3 units (ap-
    proximately 0.04 by 0.04 inch); the maximum is 14,400 by 14,400 units
    (200 by 200 inches).


    Beginning with PDF 1.6, the size of the default user space unit may be set
    with the UserUnit entry of the page dictionary. Acrobat 7.0 supports a
    maximum UserUnit value of 75,000, which gives a maximum page dimen-
    sion of 15,000,000 inches (14,400 * 75,000 * 1 ⁄ 72). The minimum
    UserUnit value is 1.0 (the default).
    */
let DPI_MM = DPI / INCH;
let PISTA = 19 * DPI_MM;
let MARGEM_GRID_MM = 50;
/* 20 * sqr(2) = 28,28 mm  Sensor Polulo distancia de 30 mm (tá no limite)
   18 * sqr(2) = 25,46 mm

*/
let FONTSIZE = 212;
let MARGEM_SEGURANCA = 2 * DPI_MM;// 2 * 2mm = 4 mm 
let MARGEM_GRID = MARGEM_GRID_MM * DPI_MM;// 100 mm 

let svgNS = "http://www.w3.org/2000/svg";

class SVG_Circuit {

    constructor(c, r, raio, margem_largura, margem_altura) { // largura x comprimento
        this.svg = document.getElementById('canvas_svg');
        this.font_size = 0;
        this.c = c;
        this.r = r;
        this.raio = raio;
        this.grade = to_odd(this.raio * DPI_MM);
        this.ajuste_largura = (margem_largura - 2 * MARGEM_GRID_MM) * DPI_MM;
        this.ajuste_altura = (margem_altura - 2 * MARGEM_GRID_MM) * DPI_MM;

        this.YZERO = Math.round(MARGEM_SEGURANCA + MARGEM_GRID + this.ajuste_altura / 2 + this.r * this.grade);
        this.XZERO = Math.round(MARGEM_SEGURANCA + MARGEM_GRID + this.ajuste_largura / 2);
        this.font_size = Math.round(26 * DPI_MM);//Tamanho constante

        
        $("#canvas_svg").empty();//This deletes all child elements of the svg while leaving its other attributes like width and height intact.


        this.config();
        let stroke = "#808080";
        let stroke_width = "2px";
        let fill = 'none';
        addRect(this.svg, Math.round(MARGEM_SEGURANCA), Math.round(MARGEM_SEGURANCA), this.W - Math.round(2 * MARGEM_SEGURANCA), this.H - Math.round(2 * MARGEM_SEGURANCA), stroke, 2, 'none');//Borda Minima
        //Grid conferencia
        //addRect(this.svg, MARGEM + this.grade / 2, MARGEM + this.grade / 2, this.c * this.grade, this.r * this.grade, stroke, 2, 'none');
        this.path = [];
        this.heading = [];
        this.raios = [];
    }


    config() {


        this.W = Math.round(this.c * this.raio * DPI_MM + 2 * MARGEM_GRID + 2 * MARGEM_SEGURANCA + this.ajuste_largura);
        this.H = Math.round(this.r * this.raio * DPI_MM + 2 * MARGEM_GRID + 2 * MARGEM_SEGURANCA + this.ajuste_altura);


        this.svg.setAttributeNS(null, 'width', this.W);
        this.svg.setAttributeNS(null, 'height', this.H);
        this.draw_grid();
        this.logo();
        


    }

    create_path() {
        let qc = 0, qr = 0;
        let svg = document.getElementById('canvas_svg');
        //d3.select(svg).selectAll("path").remove();
        // $("#canvas-svg").empty();//This deletes all child elements of the svg while leaving its other attributes like width and height intact.

        let fS = [];
        let nodes = this.path.length;

        for (var i = 0; i < this.path.length - 1; i++) {

            let a = [this.path[i][0] + 0.5, this.path[i][1] + 0.5];
            let b = [this.path[i + 1][0] + 0.5, this.path[i + 1][1] + 0.5];
            let ahead = p_ahead(a, this.heading[i]);
            fS.push((orientation_giro(a, ahead, b) == 2) ? 0 : 1);
        }

        let k = 0;
        let s = this.xy([this.path[0][0] + 0.5, this.path[0][1] + 0.5]);
        //addPoint(this.svg, s[0], s[1]);
        do {
            let e = this.xy([this.path[k + 1][0] + 0.5, this.path[k + 1][1] + 0.5]);
            let r = (this.raios[k] == 0) ? NUMBER_BIG : this.grade;
            if (r == this.grade)
                qr++;
            else
                qc++;
            circle_arc(this.svg, s[0], s[1], r, e[0], e[1], 0, fS[k], PISTA);
            s = copy(e);
            k++;
        } while (k < nodes - 1);

        this.pista(qc, qr);



    }

    logo() {
        var p = [this.font_size, 0.75 * this.font_size];
        
        //addRect(this.svg, p[0] - this.font_size, 50, 13 * this.font_size, this.font_size, "#000000", 2, 'none');//Borda Minima
        add_text(this.svg, "Rbphi Development - www.rbphi.dev", p, 'Courier', Math.round(0.6 * this.font_size));
       
    }

    pista(qr, qc) {
        var p = [this.font_size, 1.25*this.font_size];
        //addRect(this.svg, p[0] - this.font_size, 40, 12 * this.font_size, 130, "#000000", 2, 'none');//Borda Minima
        //addRect(this.svg, p[0]-this.font_size, 50, 8*this.font_size, this.font_size, "#000000", 2, 'none');//Borda Minima
        p = [p[0], p[1]];
        let d = (this.raio * qr + qc*Math.PI*this.raio/2)/1000;        
        add_text(this.svg, "Grade: " + this.raio + " mm. Pista com " + qr + " retas e " + qc + " curvas." + " Comprimento total da linha: " + parseFloat(d).toFixed(2) + " m", p, 'Courier', (0.3 * this.font_size));
        

        //p = [p[0], 130];
        

        //add_text(this.svg, "Comprimento total da linha: " + parseFloat(d).toFixed(2) + " m", p, 'Courier', (0.3 * this.font_size));        
        //p = [p[0], 160];
        p = [this.font_size, 1.6*this.font_size];
        add_text(this.svg, "Medidas sujeitas a variações de impressão", p, 'Courier', (0.21 * this.font_size));

        // use Courier font by default
        //const doc = new PDFDocument({font: 'Courier'});
        
    }


    draw_grid() {
        let stroke = "#808080";
        let stroke_width = "2px";
        let fill = 'none';
        //lines_horizontais

        for (let i = 0; i < this.r + 1; i++) {
            let p1 = this.xy([0, i]);
            let p2 = this.xy([this.c, i]);
            add_line(this.svg, p1, p2, stroke, stroke_width);
            //addPoint(this.svg, p1); //addPoint(this.svg, p2);
        }

        //Posição dos x textos é constante

        for (let i = 0; i < this.r; i++) {
            let p = this.xy([0, i + 0.4]);
            p[0] = this.XZERO - 1.6 * this.font_size;
            //add_text(this.svg, (i + 1).toString(), p, 'Helvetica', this.font_size);
            add_text(this.svg, (i + 1).toString(), p, 'Courier', this.font_size);
        }



        //lines_verticais();
        for (let i = 0; i < this.c + 1; i++) {
            let p1 = this.xy([i, 0]);
            let p2 = this.xy([i, this.r]);
            add_line(this.svg, p1, p2, stroke, stroke_width);
        }

        //y textos é constante
        var letras = "ABCDEFGHIJKLMNOPQRSTUVXYWZ"

        for (let i = 0; i < this.c; i++) {
            let p = this.xy([0.4 + i, 0]);
            p[1] = this.YZERO + 1.5 * this.font_size;
            add_text(this.svg, letras[i], p, 'Courier', this.font_size);
        }
    }

    xy(p) {
        let x = this.XZERO + p[0] * this.grade;
        let y = this.YZERO - p[1] * this.grade;
        return [x, y];
    }

}//end  SVG_Circuit 

function circle_arc(svg, sX, sY, rx, eX, eY, fA, fS, sw) {
    //http://xahlee.info/js/svg_circle_arc.html
    let ry = rx;
    let phi = 90;
    let path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M " + sX + " " + sY + " A " + [rx, ry, phi, fA, fS, eX, eY].join(" "));
    path.setAttribute('fill', 'turquoise');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', sw); //20 mm
    path.setAttribute("stroke-linecap", 'round');
    svg.appendChild(path);
}


function add_text(svg, content, p, fontfamily, fontsize) {
    var e = document.createElementNS(svgNS, 'text');
    var txt = document.createTextNode(content);
    e.setAttribute('x', p[0]);
    e.setAttribute('y', p[1]);
    e.appendChild(txt);
    e.setAttributeNS(null, 'font-size', fontsize);
    e.setAttributeNS(null, 'font-family', fontfamily);
    //e.setAttribute('fill', 'turquoise');
    e.setAttributeNS(null, 'fill', 'black');
    e.setAttribute(null,'font-weight', 'lighter')>
    //e.setAttributeNS(null, 'font-style', 'italic');  
    svg.appendChild(e);
    
    

}

function addPoint(svg, p) {
    var e = document.createElementNS(svgNS, 'text');
    var txt = document.createTextNode("•");
    e.setAttribute('x', p[0] - FONTSIZE / 5);
    e.setAttribute('y', p[1] + FONTSIZE / 3);
    e.appendChild(txt);
    e.setAttributeNS(null, 'font-size', FONTSIZE);
    e.setAttributeNS(null, 'font-family', 'Segan');
    e.setAttributeNS(null, 'fill', 'black');
    svg.appendChild(e);
    //this.path.textAlign = "center";
    //this.path.textBaseline = "middle";//top";
}

function add_line(svg, p1, p2, stroke, stroke_width) {
    var e = document.createElementNS(svgNS, 'line');
    e.setAttributeNS(null, 'x1', p1[0]);
    e.setAttributeNS(null, 'y1', p1[1]);
    e.setAttributeNS(null, 'x2', p2[0]);
    e.setAttributeNS(null, 'y2', p2[1]);
    e.setAttributeNS(null, "stroke", stroke);
    e.setAttributeNS(null, "stroke-width", stroke_width);
    e.setAttributeNS(null, "stroke-linecap", 'round');
    svg.appendChild(e);
}

function addRect(svg, x, y, w, h, stroke, stroke_width, fill) {
    var e = document.createElementNS(svgNS, 'rect');
    e.setAttributeNS(null, 'x', x);
    e.setAttributeNS(null, 'y', y);
    e.setAttributeNS(null, 'width', w);
    e.setAttributeNS(null, 'height', h);
    e.setAttributeNS(null, "stroke", 'black');
    e.setAttributeNS(null, "stroke", stroke);
    e.setAttributeNS(null, "stroke-width", stroke_width);
    e.setAttributeNS(null, 'fill', fill);
    svg.appendChild(e);
}

