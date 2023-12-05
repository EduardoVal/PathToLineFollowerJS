
/* Board.js  
 * MIT Licensed
 * 2023 - Eduardo Val 
 */

var MAXROWS = 19;
var MAXCOLS = 9;

class Board {


    constructor(c, r, raio) {
        this.c = c;
        this.r = r;
        this.grade = 40;
        this.font_size = 18;
        this.W = this.grade * 9;
        this.H = this.grade * 19;
        
        this.mapa = new Mapa(r, c);

        this.svg_circuit = new SVG_Circuit(this.c, this.r, raio, 2 * MARGEM_GRID_MM, 2 * MARGEM_GRID_MM);// largura x comprimento

        this.grid = document.getElementById("grid").getContext("2d");
        this.eixos = document.getElementById("eixos").getContext("2d");
        this.path = document.getElementById("path").getContext("2d");

        const canvas = document.getElementById('grid');

        canvas.addEventListener("click", (evt) => {//mousedown                           

            this.mapa.update(this.to_coord(evt.offsetX, evt.offsetY));

            let btn_export_svg = document.getElementById("btn_export_svg");
            let btn_export_pdf = document.getElementById("btn_export_pdf");

            if (this.mapa.path_close) {
                btn_export_svg.disabled = false;
                btn_export_pdf.disabled = false;
            } else {
                btn_export_svg.disabled = true;
                btn_export_pdf.disabled = true;
            }
            


            if (this.mapa.flag_redraw) {
                this.draw_path();
            }


        });

        this.config();
    }

    resize(c, r, raio, margem_largura, margem_altura) {
        this.c = c;
        this.r = r;
        this.mapa = new Mapa(r, c);
        this.svg_circuit = new SVG_Circuit(this.c, this.r, raio, margem_largura, margem_altura);// W x H largura x comprimento        
        this.clear_path();
        this.draw_path();


    }


    config() {

        let canvas = document.getElementById("eixos");

        canvas = document.getElementById("grid");

        canvas = document.getElementById("path");
        /* Usando números negativos você pode fazer o espelhamento de eixos (por exemplo, usando translate(0,canvas.height); scale(1,-1);
        você terá o conhecido sistema de coordenadas cartesianas, com a origem no canto inferior esquerdo).*/
        this.draw_grid();
        this.draw_eixos();
        this.draw_path();
    }


    draw_grid() {
        this.coordenadas_cartesianas_grid();
        this.grid.beginPath();
        this.grid.lineWidth = 1;
        this.grid.strokeStyle = "black";
        //Linhas verticais
        for (let i = 0; i < MAXCOLS + 1; i++) {
            this.grid.moveTo(this.grade * i, 0);
            this.grid.lineTo(this.grade * i, this.H);
        }
        //Linhas horizontais
        for (let i = 0; i < MAXROWS + 1; i++) {
            this.grid.moveTo(0, this.grade * i);
            this.grid.lineTo(this.W, this.grade * i);
        }
        this.grid.stroke();
    }

    draw_eixos() {
        this.eixos.font = this.font_size + "px Helvetica";
        

        let nzero = 1
        this.eixos.fillStyle = 'black';

        var x = this.grade + this.grade / 2 - 6;
        
        var letras = "ABCDEFGHIJKLMNOPQRSTUVXYWZ"

        for (let i = nzero; i < MAXCOLS + nzero; i++) {
            this.eixos.fillText(letras[i], x, this.H + 5 / 3 * this.grade);
            x += this.grade;
        }

        var y = this.H + this.grade / 2 + 6;

        for (let i = nzero; i < MAXROWS + nzero; i++) {
            this.eixos.fillText(i.toString(), this.grade / 2 - 6, y);
            y -= this.grade;
        }
    }

    coordenadas_cartesianas_path() {
        this.path.save();
        this.path.translate(0.5, this.H + 0.5);
        this.path.scale(1, -1);

    }

    coordenadas_cartesianas_grid() {
        /*
        Para larguras de traços pares, você pode usar números inteiros para coordenadas; 
        para larguras de traços ímpares,você deseja usar 0,5 para obter linhas nítidas 
        que preencham os pixels corretamente.*/
        this.grid.save();
        this.grid.translate(0.5, this.H + 0.5);
        this.grid.scale(1, -1);
    }

    clear_path() {
        let canvas = document.getElementById("path");
        this.path.clearRect(0, 0, canvas.width, canvas.height);
        canvas.setAttribute("width", this.W + 1)
        canvas.setAttribute("height", this.H + 1)
        this.coordenadas_cartesianas_path();
    }



    draw_path() {
        this.clear_path();
        this.white_points();
        this.path.fillStyle = "#E1E2E7";
        this.path.fillRect(this.c * this.grade, 0, MAXCOLS * this.grade, MAXROWS * this.grade);
        this.path.fillRect(0, this.r * this.grade, this.c * this.grade, MAXROWS * this.grade);


        this.path.strokeStyle = 'black';
        this.path.lineWidth = this.grade / 5;

        this.path.lineJoin = 'round';// line join styles are "bevel", "round", and "miter". 


        var n = 1;

        let now = this.mapa.path_init;


        // SVG data --------------------------------------------------------
        this.svg_circuit.path = [];
        this.svg_circuit.raios = [];
        this.svg_circuit.heading = [];




        while (n <= this.mapa.step) {

            this.moveTo(now);
            let next = this.mapa.neighbor(now, n);

            // SVG data --------------------------------------------------------
            this.svg_circuit.path.push(now);
            this.svg_circuit.heading.push(this.mapa.get_Heading(now));

            if (distance_Manhattan(now, next) == 1) {
                this.lineTo(next);
                this.svg_circuit.raios.push(0);//svg


            }
            else {
                this.curva(now, next, this.mapa.get_Heading(now));
                this.svg_circuit.raios.push(1);//svg
                //this.path.stroke();
            }
            now = next;
            n++;
            this.path.stroke();
        }


        this.mapa.flag_redraw = false;
        let ln = this.mapa.neighbors(this.mapa.pose);

        var color_pose;





        if (this.mapa.path_close) {
            color_pose = "green";
            this.svg_circuit.path.push(this.mapa.path_init);//path close
            this.svg_circuit.heading.push(0);
            this.svg_circuit.raios.push(1);
            this.svg_circuit.create_path();
        } else if (ln.length == 0)
            color_pose = "red";
        else color_pose = "blue";

        this.gray_pointsXY(ln);

        this.point(this.mapa.path_init, "gray");
        this.point(this.mapa.pose, color_pose);

    }

    curva(p1, p2, a) {
        let center = this.find_center(p1, p2, a);

        let aux = subtration(p1, center);
        let startAngle = constrain_pattern_transfer(Math.atan2(aux[1], aux[0]));
        aux = subtration(p2, center);
        let endAngle = constrain_pattern_transfer(Math.atan2(aux[1], aux[0]));
        if (orientation_giro(center, p1, p2) == counterclockwise)
            [startAngle, endAngle] = [endAngle, startAngle];

        //antiHorario boolean opcional. Se verdadeiro, desenha o arco no sentido anti-horário entre os ângulos inicial e final. O padrão é falso (sentido horário).
        this.arc(center, startAngle, endAngle, true);

    }// end curva


    find_center(p0, p1, a) {
        // translate p0 back to origin
        let p3 = subtration(p1, p0);
        let control_ahead = dxy_ahead(p3, a);
        let sinal = 1;
        if (orientation_giro([0, 0], control_ahead, p3) == 1)
            sinal = -1;
        let control_center = rotate_point(control_ahead, sinal * Math.PI / 2);
        let center = [control_center[0] + p0[0], control_center[1] + p0[1]]; //Ponto de partida + ponto afrente invertido(rotate 90 graus) 
        return center;
    }

    to_coord(x, y) {
        return [Math.floor(x / this.grade), MAXROWS - Math.floor(y / this.grade) - 1];
    }

    to_xy(c, r) {
        let x = + c * this.grade + this.grade / 2;
        let y = r * this.grade + this.grade / 2;
        return [x, y];
    }


    point(p, color) {
        let xy = this.to_xy(p[0], p[1]);
        this.path.font = 1.5 * this.grade + "px Georgia";
        this.path.fillStyle = color;
        this.path.textAlign = "center";
        this.path.textBaseline = "middle";//top";

        this.path.stroke();
        this.path.fillText("•", xy[0], xy[1]);

    }

    white_points() {

        for (var j = 0; j < this.c; j++) {
            for (var i = 0; i < this.r; i++) {
                this.point([j, i], "white");
            }
        }

    }

    gray_pointsXY(arr) {
        if (this.mapa.path_close)
            return;
        for (var i = 0; i < arr.length; i++)
            this.point(arr[i], "#81B7ED");
    }

    moveTo(p) {

        let xy = this.to_xy(p[0], p[1]);
        this.path.moveTo(xy[0], xy[1]);
    }

    lineTo(p) {
        let xy = this.to_xy(p[0], p[1]);
        this.path.lineTo(xy[0], xy[1]);
    }

    arc(p, startAngle, endAngle, direction) {
        let xy = this.to_xy(p[0], p[1]);
        this.path.beginPath();
        this.path.arc(xy[0], xy[1], this.grade, startAngle, endAngle, direction);
        //Create an arc between two tangents and fill it:ctx.arcTo(150, 20, 150, 70, 50);
    }







}