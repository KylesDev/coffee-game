// seleziona un numero segreto tra 0 e 9999
var numeroSegreto = Math.floor(Math.random() * 10000);

// definisci le variabili per gli estremi dell'intervallo
var estremoMinimo = 0;
var estremoMassimo = 9999;

// funzione per verificare se il numero inserito Ã¨ valido
function isValid(numero) {
	if (numero < estremoMinimo || numero > estremoMassimo) {
		return false;
	}
	return true;
}

// funzione per restringere l'intervallo
function restringiIntervallo(numero) {
  if (numero < numeroSegreto) {
    estremoMinimo = Math.max(estremoMinimo, numero);
  } else {
    estremoMassimo = Math.min(estremoMassimo, numero);
  }

  var minStr = estremoMinimo.toString();
  var maxStr = estremoMassimo.toString();

  if (minStr.length === maxStr.length) {
    var cifreForzate = "";
    for (var i = 0; i < minStr.length; i++) {
      if (minStr.charAt(i) === maxStr.charAt(i)) {
        cifreForzate += minStr.charAt(i);
      } else {
        break;
      }
    }
    var input = document.getElementById("numero");
    input.value = cifreForzate + minStr.substring(cifreForzate.length);
  }
}



// funzione per gestire il tentativo di indovinare il numero
function guess() {
    var input = document.getElementById("numero");
    var numero = input.value;
    if (!isValid(numero)) {
        alert("Inserisci un numero valido tra " + estremoMinimo + " e " + estremoMassimo + ".");
    } else {
        restringiIntervallo(numero);
        if (numero == numeroSegreto) {
            document.getElementById("numero").value = "";
            document.querySelectorAll(".estremo").forEach(e => e.style.backgroundColor = "green");
            document.getElementById("main").style.opacity = 0;
            document.getElementById("paga").style.opacity = 1;
            gimmick('body')
        } else {
            input.value = "";
            document.getElementById("estremo-minimo").innerHTML = estremoMinimo;
            document.getElementById("estremo-massimo").innerHTML = estremoMassimo;
            var intervallo = estremoMassimo - estremoMinimo;
            if (intervallo <= 20) {
                document.querySelectorAll(".estremo").forEach(e => {
                    e.style.backgroundColor = "red";
                    e.style.color = "black";
                });
                document.getElementById("sudoreGif").style.opacity = 1;
            } else if (intervallo <= 80) {
                document.querySelectorAll(".estremo").forEach(e => {
                    e.style.backgroundColor = "orange";
                    e.style.color = "black";
                });
            } else {
                document.querySelectorAll(".estremo").forEach(e => e.style.backgroundColor = "green");
            }
        }
    }
}


document.getElementById("numero").addEventListener("keydown", function(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		guess();
	}
});


function gimmick(el) {
  var exists = document.getElementById('gimmick')
  if (exists) {
      exists.parentNode.removeChild(exists);
      return false;
  }

  var element = document.querySelector(el);
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      focused = false;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.id = 'gimmick'

  var coin = new Image();
  coin.src = 'assets/coin.png'
  // 440 wide, 40 high, 10 states
  coin.onload = function () {
      element.appendChild(canvas)
      focused = true;
      drawloop();
  }
  var coins = []

  function drawloop() {
      if (focused) {
          requestAnimationFrame(drawloop);
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < .3) {
          coins.push({
              x: Math.random() * canvas.width | 0,
              y: -50,
              dy: 3,
              s: 0.5 + Math.random(),
              state: Math.random() * 10 | 0
          })
      }
      var i = coins.length
      while (i--) {
          var x = coins[i].x
          var y = coins[i].y
          var s = coins[i].s
          var state = coins[i].state
          coins[i].state = (state > 9) ? 0 : state + 0.1
          coins[i].dy += 0.3
          coins[i].y += coins[i].dy

          ctx.drawImage(coin, 44 * Math.floor(state), 0, 44, 40, x, y, 44 * s, 40 * s)

          if (y > canvas.height) {
              coins.splice(i, 1);
          }
      }
  }

}

