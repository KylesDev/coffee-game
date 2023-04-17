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
            document.getElementById("container").style.opacity = 1;
            document.getElementById("main").style.opacity = 0;
            document.getElementById("paga").style.opacity = 1;
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

