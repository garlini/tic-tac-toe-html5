function Velha(canvas, primeiro, cpuLevel) {
    
    primeiro = primeiro || 'x';
    cpuLevel = cpuLevel || 'easy;';
    
    var ctx = canvas.getContext('2d');
    
    var width = canvas.width;
    var height = canvas.height;
    
    var colSize = Math.floor(width / 3);
    var rowSize = Math.floor(height / 3);
    var minSize = Math.min(colSize, rowSize);
    
    var tabuleiro = new Tabuleiro(primeiro);
    
    this.draw = function () {
        drawLines();
        drawTab();
        var vencedor = tabuleiro.getResultado();
        if (vencedor === 'x' || vencedor === 'o') {
            drawVictoryLine(vencedor);
        }
    };
    
    this.processClick = function (x, y) {
        var row, col;
        
        if (tabuleiro.isGameOver()) {
            return false;
        }
        
        if (x < colSize) {
            col = 0;
        } else if (x < colSize*2) {
            col = 1;
        } else {
            col = 2;
        }
        
        if (y < rowSize) {
            row = 0;
        } else if (y < rowSize*2) {
            row = 1;
        } else {
            row = 2;
        }
        
        var pos = row * 3 + col;
        
        var aceitou = tabuleiro.nextMove(pos);
        
        if (aceitou) {
            this.draw();
                        
             if (!tabuleiro.isGameOver() && 'o' === tabuleiro.getProximo()) {
                aceitou = CPUMove();
                if (aceitou) {
                    this.draw();
                }
            }
        }
        
        return aceitou;
    };
    
    this.isGameOver = function () {
        return tabuleiro.isGameOver();
    };
    
    
    this.getResultado = function () {
        return tabuleiro.getResultado();
    };
    
    this.restart = function (primeiro) {
        
        primeiro = primeiro || 'x';
        
        tabuleiro = new Tabuleiro(primeiro);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,width,height);
        
        if ('o' === primeiro) {
            CPUMove();
        }
        
        this.draw();
    };
    
    var CPUMove = function () {
        var cpu;
        if ('hard' === cpuLevel) {
            cpu = new CPUHard(tabuleiro);
        } else {
            cpu = new CPUEasy(tabuleiro);
        }
        
        var pos = cpu.move();
        
        return tabuleiro.nextMoveOrThrow(pos);
    };
        
    var drawLines = function () {
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        
        ctx.beginPath();
        ctx.moveTo(colSize, 0);
        ctx.lineTo(colSize, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(colSize * 2, 0);
        ctx.lineTo(colSize * 2, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, rowSize);
        ctx.lineTo(width, rowSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, rowSize * 2);
        ctx.lineTo(width, rowSize * 2);
        ctx.stroke();
    };
    
    var drawTab = function () {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        var tabArray = tabuleiro.getTabArray();
        for (var i = 0; i < tabArray.length; i++) {
            if (tabArray[i]) {
                drawPos(i, tabArray[i]);
            }
        }
    };
    
    var drawPos = function (pos, char) {
        
        var row = Math.floor(pos / 3);
        var col = pos % 3;
        
        var padding = minSize - minSize * 0.75;
        
        if (char === 'o') {
            var centerX = (col * colSize) + (colSize / 2);
            var centerY = (row * rowSize) + (rowSize / 2);
            var radius = (minSize / 2) - padding;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.stroke();
            
        } else {
            var lineSize = minSize - (padding * 2);
            var hPadding = ((colSize - lineSize) / 2);
            var vPadding = ((rowSize - lineSize) / 2);
            
            ctx.beginPath();
            ctx.moveTo((colSize * col) + hPadding, (rowSize * row) + vPadding);
            ctx.lineTo((colSize * col) + lineSize + hPadding, (rowSize * row) + lineSize + vPadding);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo((colSize * col) + lineSize + hPadding, (rowSize * row) + vPadding);
            ctx.lineTo((colSize * col) + hPadding, (rowSize * row) + lineSize + vPadding);
            ctx.stroke();
            
        }
    };
    
    var drawVictoryLine = function (vencedor) {
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        
        var tab = tabuleiro.getTabArray();
                
        if (tab[0] === vencedor && tab[1] === vencedor && tab[2] === vencedor) {
            ctx.beginPath();
            var y = rowSize / 2;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        } else if (tab[3] === vencedor && tab[4] === vencedor && tab[5] === vencedor) {
            ctx.beginPath();
            var y = rowSize + rowSize / 2;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        } else if (tab[6] === vencedor && tab[7] === vencedor && tab[8] === vencedor) {
            ctx.beginPath();
            var y = rowSize * 2 + rowSize / 2;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        } else if (tab[0] === vencedor && tab[3] === vencedor && tab[6] === vencedor) {
            ctx.beginPath();
            var x = colSize / 2;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        } else if (tab[1] === vencedor && tab[4] === vencedor && tab[7] === vencedor) {
            ctx.beginPath();
            var x = colSize + colSize / 2;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        } else if (tab[2] === vencedor && tab[5] === vencedor && tab[8] === vencedor) {
            ctx.beginPath();
            var x = colSize * 2 + colSize / 2;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        } else if (tab[0] === vencedor && tab[4] === vencedor && tab[8] === vencedor) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, height);
            ctx.stroke();
        } else if (tab[2] === vencedor && tab[4] === vencedor && tab[6] === vencedor) {
            ctx.beginPath();
            ctx.moveTo(width, 0);
            ctx.lineTo(0, height);
            ctx.stroke();
        }
        
    };
    
    if ('o' === primeiro) {
        CPUMove();
    }
}
Velha.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
Velha.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
};

function Tabuleiro(primeiro) {
    
    primeiro = primeiro || 'x';
    
    var tab = new Array(9);
    var primeiro = primeiro;
    var proximo = primeiro;
    var resultado = null;
    var ultimaPos = null;
    
        
    this.isGameOver = function () {
        return resultado !== null;
    };
    
    this.getResultado = function () {
        return resultado;
    };
    
    this.getTabArray = function () {
        return tab;
    };
        
    this.getProximo = function () {
        return proximo;
    };
        
    this.nextMove = function (pos) {
        
        assertPos(pos);
        
        if (!tab[pos]) {
            tab[pos] = proximo;
            proximo = (proximo === 'x') ? 'o' : 'x';
            
            ultimaPos = pos;
                        
            checkGameOver();
                        
            return true;
        }
        return false;
    };
    
    this.nextMoveOrThrow = function (pos) {
        var moved = this.nextMove(pos);
        if (!moved) {
            throw new Error('Posicao invalida');
        }
        return moved;
    };
        
    this.isPosEmpty = function (pos) {
        
        assertPos(pos);
        
        return !tab[pos];
    };
    
    this.getAtPos = function (pos) {
        tab[pos];
    };
    
    this.getFreePos = function (rand) {
        var freePos = [];
        
        for (var i = 0; i < tab.length; i++) {
            if (!tab[i]) {
                freePos.push(i);
            }
        }
        
        if (true === rand) {
            return Velha.shuffle(freePos);
        }
        
        return freePos;
    };
            
    this.getUltimaPos = function () {
        return ultimaPos;
    };
    
    
    var assertPos = function(pos) {
        var ipos = parseInt(pos, 10);
        if (isNaN(ipos)) {
            throw new Error('Posicao "' + pos + '" é invalida.');
        }
        
        if (ipos < 0 || ipos > 8) {
            throw new Error('Posicao "' + pos + '" é invalida.');
        }
    };
    
    var checkGameOver = function () {
        if (checkVitoria('x')) {
            resultado = 'x';
        } else if (checkVitoria('o')) {
            resultado = 'o';
        } else if (checkEmpate()) {
            resultado = 'e';
        } 
    };
    
    var checkVitoria = function (char) {
        var tabuleiro = tab;
        
        return (tabuleiro[0] === char && tabuleiro[1] === char && tabuleiro[2] === char) ||
               (tabuleiro[3] === char && tabuleiro[4] === char && tabuleiro[5] === char) || 
               (tabuleiro[6] === char && tabuleiro[7] === char && tabuleiro[8] === char) || 
               (tabuleiro[0] === char && tabuleiro[3] === char && tabuleiro[6] === char) || 
               (tabuleiro[1] === char && tabuleiro[4] === char && tabuleiro[7] === char) || 
               (tabuleiro[2] === char && tabuleiro[5] === char && tabuleiro[8] === char) || 
               (tabuleiro[0] === char && tabuleiro[4] === char && tabuleiro[8] === char) || 
               (tabuleiro[2] === char && tabuleiro[4] === char && tabuleiro[6] === char);
    };
    
    var checkEmpate = function () {
        var tabuleiro = tab;
        
        for (var i = 0; i < tabuleiro.length; i++) {
            if (!tabuleiro[i]) {
                return false;
            }
        }
        return true;
    };
}

function CPUEasy(tabuleiro) {
        
    this.move = function () {
        var pos = -1;
        
        if (tabuleiro.isGameOver()) {
            return false;
        }
        
        //primeiro tenta o centro
        if (tabuleiro.isPosEmpty(4)) {
            return 4;
        }
        
        //tenta os cantos
        var cantos = Velha.shuffle([0, 2, 6, 8]);
        for (var i = 0; i < cantos.length; i++) {
            if (tabuleiro.isPosEmpty(cantos[i])) {
                return cantos[i];
            }
        }
        
        //tenta o resto
        var resto = Velha.shuffle([1, 3, 5, 7]);
        for (var i = 0; i < resto.length; i++) {
            if (tabuleiro.isPosEmpty(resto[i])) {
                return resto[i];
            }
        }
        
        return pos;
    };
}

/* Adaptado de: http://www3.ntu.edu.sg/home/ehchua/programming/java/javagame_tictactoe_ai.html */
function CPUHard(tabuleiro) {
    
    //converte a representacao interna do tabuleiro para a representacao esperada por este objeto
    var tabArray = tabuleiro.getTabArray();
    var row0 = [tabArray[0], tabArray[1], tabArray[2]];
    var row1 = [tabArray[3], tabArray[4], tabArray[5]];
    var row2 = [tabArray[6], tabArray[7], tabArray[8]];
    var cells = [row0, row1, row2];
    
    var mySeed = 'o';
    var oppSeed = 'x';
        
    this.move = function () {
        var pos = -1;
        
        var result = minimax(2, mySeed, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        
        var row = result[1];
        var col = result[2];
        if (row >= 0 && col >= 0) {
            //converte de volta para a representacao do tabuleiro (array 1 dimensao)
            pos = (row * 3) + col;
        }
        
        if (pos == -1) {
            console.error('CPUHard: não foi possivel calcular a posicao. Usando fallback.')
            var fallback = new CPUEasy(tabuleiro);
            return fallback.move();
        }
        
        return pos;
    };
    
    function minimax(depth, player, alpha, beta) {
                
        var nextMoves = generateMoves();
        
        // mySeed is maximizing; while oppSeed is minimizing
        var score;
        var bestRow = -1;
        var bestCol = -1;
        
        if (nextMoves.length == 0 || depth == 0) {
            // Gameover or depth reached, evaluate score
            score = evaluate();
            return [score, bestRow, bestCol];
        } else {
            for (var i = 0; i < nextMoves.length; i++) {
                var move = nextMoves[i];
                
                // try this move for the current "player"
                cells[move[0]][move[1]] = player;
                
                if (player == mySeed) {  // mySeed (computer) is maximizing player
                    score = minimax(depth - 1, oppSeed, alpha, beta)[0];
                    if (score > alpha) {
                       alpha = score;
                       bestRow = move[0];
                       bestCol = move[1];
                    }
                 } else {  // oppSeed is minimizing player
                    score = minimax(depth - 1, mySeed, alpha, beta)[0];
                    if (score < beta) {
                       beta = score;
                       bestRow = move[0];
                       bestCol = move[1];
                    }
                 }
                
                // undo move
                cells[move[0]][move[1]] = null;
                
                // cut-off
                if (alpha >= beta) {
                    break;
                }
            }
        }
                
        return [(player == mySeed) ? alpha : beta, bestRow, bestCol];
    };
    
    function generateMoves() {

        var nextMoves = [];

        for (var row = 0; row < 3; ++row) {
            for (var col = 0; col < 3; ++col) {
                if (!cells[row][col]) {
                    nextMoves.push([row, col]);
                }
            }
        }

        return nextMoves;
    };
    
    function evaluate() {
        var score = 0;
        // Evaluate score for each of the 8 lines (3 rows, 3 columns, 2 diagonals)
        score += evaluateLine(0, 0, 0, 1, 0, 2);  // row 0
        score += evaluateLine(1, 0, 1, 1, 1, 2);  // row 1
        score += evaluateLine(2, 0, 2, 1, 2, 2);  // row 2
        score += evaluateLine(0, 0, 1, 0, 2, 0);  // col 0
        score += evaluateLine(0, 1, 1, 1, 2, 1);  // col 1
        score += evaluateLine(0, 2, 1, 2, 2, 2);  // col 2
        score += evaluateLine(0, 0, 1, 1, 2, 2);  // diagonal
        score += evaluateLine(0, 2, 1, 1, 2, 0);  // alternate diagonal
        return score;
    }
    
    function evaluateLine(row1, col1, row2, col2, row3, col3) {

        var score = 0;

        // First cell
        if (cells[row1][col1] == mySeed) {
            score = 1;
        } else if (cells[row1][col1] == oppSeed) {
            score = -1;
        }

        // Second cell
        if (cells[row2][col2] == mySeed) {
            if (score == 1) {   // cell1 is mySeed
                score = 10;
            } else if (score == -1) {  // cell1 is oppSeed
                return 0;
            } else {  // cell1 is empty
                score = 1;
            }
        } else if (cells[row2][col2] == oppSeed) {
            if (score == -1) { // cell1 is oppSeed
                score = -10;
            } else if (score == 1) { // cell1 is mySeed
                return 0;
            } else {  // cell1 is empty
                score = -1;
            }
        }

        // Third cell
        if (cells[row3][col3] == mySeed) {
            if (score > 0) {  // cell1 and/or cell2 is mySeed
                score *= 10;
            } else if (score < 0) {  // cell1 and/or cell2 is oppSeed
                return 0;
            } else {  // cell1 and cell2 are empty
                score = 1;
            }
        } else if (cells[row3][col3] == oppSeed) {
            if (score < 0) {  // cell1 and/or cell2 is oppSeed
                score *= 10;
            } else if (score > 1) {  // cell1 and/or cell2 is mySeed
                return 0;
            } else {  // cell1 and cell2 are empty
                score = -1;
            }
        }

        return score;
    }
    ;
}