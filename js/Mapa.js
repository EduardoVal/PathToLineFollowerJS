
//Mapa em função da matrix de caminho
class Mapa {
  //Matrix linhas x colunas
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.path_close = false;
    this.path_init = [1, 0];//x,y
    this.step = 0;
    this.heading = 0;
    this.pose = copy(this.path_init);
    this.tam = rows * cols;
    this.necessary_clear = false;
    this.PATH = createMatrix(rows, cols, -1)
    this.HEADING = createMatrix(rows, cols, -1);
    this.PATH[this.path_init[1]][this.path_init[0]] = 0 //r = y, c = x
    this.HEADING[this.path_init[1]][this.path_init[0]] = 0
    this.list_neighbors = [];

    this.path_svg = [];
    this.angles_svg = [];
    this.raios_svg = [];
    this.flag_redraw = false;
  }



  //Chamado por Board
  update(target) {
    // Se for para apagar o último step --> unset()
    
    
    if (this.in_board(target)) {
      if (this.path_close) {
        this.unset(target);
        return;
      }
    }
    
    if (array_equal(target, this.pose))
      this.unset(target);
    else
      this.set(target);

  }

  unset(target) {
    
    if (this.path_close && array_equal(target, this.path_init)) {
      //console.log("path_close")
      this.path_close = false;
    } else if (!array_equal(target, this.pose) || this.step == 0)
      return;


    this.flag_redraw = true;

    //Localiza a posição antecessora
    let previous = this.neighbor(this.pose, this.step - 1);
    let previous_heading = this.get_Heading(previous);
    

    if (distance_Manhattan(this.pose, previous) > 1) {
      let previous_ahead = p_ahead(previous, previous_heading);
      let value = this.get_Path(previous_ahead) - this.tam - this.index_p(previous)
      //Localiza a ahead da posição antecessora       
      this.set_Path(previous_ahead, value);
    }

    if (!array_equal(this.pose, this.path_init)) {
      this.set_Path(this.pose, -1);
      this.set_Heading(this.pose, -1);
    }
    else {
      this.set_Path(this.pose, 0);
      this.set_Heading(this.pose, 0);
    }

    this.pose = copy(previous);
    this.step--;
  
  }

  set(target) {
    let ln = this.neighbors(this.pose);
    if (this.search_point(ln, target)) {

      //Close PATH 
      if (this.get_Path(target) == 0) {
        this.path_close = true;
      }

      let h = this.get_Heading(this.pose);
      this.step++;
      //sets a priori
      this.set_Path(target, this.step)//marca o destino
      this.set_Heading(target, h);

      //Marca a celula de passagem quando é curva
      if (distance_Manhattan(this.pose, target) > 1) {
        let ahead = p_ahead(this.pose, h);
        let value = this.get_Path(ahead) + this.tam + this.index_p(this.pose);
        this.set_Path(ahead, value);
        //set a posteriori        
        this.set_Heading(target, this.giro_to_target(target));
      }
      //pose atual
      this.pose = copy(target);
      this.flag_redraw = true;
    
    }
  }


  //holonomic_constraint(alpha, angle_of_arrival, neighbor_angle) {
  holonomic_constraint(neighbor) {
    // giro do robot necessário maximo 2*alpha(45) = 90 graus
    // Quando encontra um celula ocupada o angulo final dever ser igual ao da celula ocupada 

    let h = this.get_Heading(this.pose);
    let hc = false;
    let w = subtration(neighbor, this.pose);
    let alpha = diff_angle(h, Math.atan2(w[1], w[0]));
    let angle_of_arrival = constrain_pattern_transfer(h + 2 * alpha);

    let neighbor_angle = this.get_Heading(neighbor);
    if (Math.abs(alpha) <= QUARTER_PI + EPSILON) {

      if (neighbor_angle != -1 && !areEqual(angle_of_arrival, neighbor_angle))
        hc = true;
    } else {
      hc = true;
    }

    return hc;
  }



  neighbors(p) {

    let arr = [];
    let h = this.get_Heading[this.pose];

    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (!(i == 0 && j == 0)) {
          let neighbor = [p[0] + i, p[1] + j];
          if (this.in_board(neighbor) && this.get_Path(neighbor) < 1) {
            if (!this.holonomic_constraint(neighbor)) {

              arr.push(neighbor);
            }
          }
        }
      }
    }

    return (arr);

  }

  neighbor(p, n) {
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        let neighbor = [p[0] + i, p[1] + j];
        if (!(i == 0 && j == 0) && this.in_board(neighbor)) {
          if (this.get_Path(neighbor) == n) {
            return neighbor;
          }
        }
      }
    }
    return [-1, -1];
  }


  giro_to_target(target) {
    let h = this.get_Heading(this.pose);
    let w = subtration(target, this.pose);
    let alpha = diff_angle(h, Math.atan2(w[1], w[0]));
    return constrain_pattern_transfer(h + 2 * alpha);
  }

  search_point(m, p) {
    let arr = linearize(m, this.cols);
    if (arr.includes(this.index_p(p)))
      return true;
    else return false;
  }

  in_board(p) {
    if (in_interval(p[0], 0, this.cols) && in_interval(p[1], 0, this.rows))
      return true;
    else
      return false;
  }

  index_p(p) {
    return this.cols * p[1] + p[0];
  }

  index(r, c) {
    return r * this.cols + c;
  }


  index_inverse(n) {
    // row = Integer division 
    // col = Remainder of the division of I by LineLength
    return [Math.floor(n / this.cols), n % this.cols];
  }

  get_Path(p) {
    return this.PATH[p[1]][p[0]];
  }

  get_Heading(p) {
    return this.HEADING[p[1]][p[0]];
  }

  set_Path(p, value) {
    this.PATH[p[1]][p[0]] = value;
  }

  set_Heading(p, value) {
    this.HEADING[p[1]][p[0]] = value;
  }

  print_path() {
    //Transforma a matiz para  coordenadas cartesianas    
    let PATHXY = this.PATH.slice();
    let HEADINGXY = this.HEADING.slice();
    PATHXY.reverse();
    HEADINGXY.reverse();
    console.log("PATHXY"); console.table(PATHXY);
    console.log("HEADINGXY"); console.table(HEADINGXY);
  }

}//end class Mapa