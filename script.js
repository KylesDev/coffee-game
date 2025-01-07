var numeroSegreto = Math.floor(Math.random() * 10000);
var estremoMinimo = 0;
var estremoMassimo = 9999;
var players = [];
var currentPlayerIndex = 0;

function isValid(numero) {
	if (numero < estremoMinimo || numero > estremoMassimo) {
		return false;
	}
	return true;
}

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
            gimmick('body');
            updateWins();
            updateLeaderboard();
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
            if (estremoMinimo + 2 === estremoMassimo) {
                displayUhOhMessage();
            }
            switchPlayer();
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

function savePlayerNames(names) {
    document.cookie = "playerNames=" + JSON.stringify(names) + "; path=/";
}

function getPlayerNames() {
    var name = "playerNames=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return [];
}

function updateWins() {
    var playerNames = getPlayerNames();
    var activePlayer = players[currentPlayerIndex];
    for (var i = 0; i < playerNames.length; i++) {
        if (playerNames[i].name === activePlayer) {
            playerNames[i].wins = (playerNames[i].wins || 0) + 1;
            break;
        }
    }
    savePlayerNames(playerNames);
}

function saveLeaderboard(leaderboard) {
    document.cookie = "leaderboard=" + JSON.stringify(leaderboard) + "; path=/";
}

function getLeaderboard() {
    var name = "leaderboard=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return [];
}

function updateLeaderboard() {
    var leaderboard = getLeaderboard();
    var activePlayer = players[currentPlayerIndex];
    var interval = estremoMassimo - estremoMinimo;
    leaderboard.push({ player: activePlayer, interval: interval });
    leaderboard.sort(function(a, b) { return b.interval - a.interval; });
    if (leaderboard.length > 20) {
        leaderboard.pop();
    }
    saveLeaderboard(leaderboard);
}

function displayUhOhMessage() {
    var uhOhMessage = document.createElement("div");
    uhOhMessage.id = "uh-oh-message";
    uhOhMessage.textContent = "UH OH...";
    uhOhMessage.style.position = "fixed";
    uhOhMessage.style.top = "50%";
    uhOhMessage.style.left = "50%";
    uhOhMessage.style.transform = "translate(-50%, -50%)";
    uhOhMessage.style.fontSize = "4rem";
    uhOhMessage.style.color = "red";
    uhOhMessage.style.zIndex = "1000";
    document.body.appendChild(uhOhMessage);

    setTimeout(function() {
        document.body.removeChild(uhOhMessage);
    }, 2000);
}

function displayPlayerButtons() {
    var playerNames = getPlayerNames();
    var playerButtonsContainer = document.getElementById("player-buttons");
    playerButtonsContainer.innerHTML = "";
    for (var i = 0; i < playerNames.length; i++) {
        var button = document.createElement("button");
        button.className = "btn btn-outline-dark m-2";
        button.textContent = playerNames[i].name;
        button.onclick = function() {
            this.classList.toggle("btn-outline-dark");
            this.classList.toggle("btn-primary");
            updateStartButtonState();
        };
        playerButtonsContainer.appendChild(button);
    }
}

function updateStartButtonState() {
    var selectedPlayers = document.querySelectorAll("#player-buttons .btn-primary");
    var startButton = document.getElementById("start-game");
    if (selectedPlayers.length >= 2) {
        startButton.classList.remove("btn-secondary");
        startButton.classList.add("btn-success");
        startButton.disabled = false;
    } else {
        startButton.classList.remove("btn-success");
        startButton.classList.add("btn-secondary");
        startButton.disabled = true;
    }
}

function startGame() {
    var selectedPlayers = document.querySelectorAll("#player-buttons .btn-primary");
    players = Array.from(selectedPlayers).map(button => button.textContent);
    document.getElementById("player-selection").style.display = "none";
    document.getElementById("main").style.display = "block";
    updateActivePlayerDisplay();
}

function switchPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateActivePlayerDisplay();
}

function updateActivePlayerDisplay() {
    var activePlayer = players[currentPlayerIndex];
    var activePlayerDisplay = document.getElementById("active-player");
    if (!activePlayerDisplay) {
        activePlayerDisplay = document.createElement("div");
        activePlayerDisplay.id = "active-player";
        activePlayerDisplay.className = "text-center mt-3";
        document.getElementById("main").insertBefore(activePlayerDisplay, document.getElementById("numero").parentNode);
    }
    activePlayerDisplay.textContent = "Current Player: " + activePlayer;
}

window.onload = function() {
    var playerNames = getPlayerNames();
    var dropdown = document.getElementById("player-names-dropdown");
    for (var i = 0; i < playerNames.length; i++) {
        var option = document.createElement("option");
        option.value = playerNames[i].name;
        option.textContent = playerNames[i].name + " - Wins: " + playerNames[i].wins;
        dropdown.appendChild(option);
    }
    displayPlayerButtons();
};
