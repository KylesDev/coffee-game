var numeroSegreto = Math.floor(Math.random() * 10000);
var estremoMinimo = 0;
var estremoMassimo = 9999;
var players = [];
var selectedPlayers = [];
var currentPlayerIndex = 0;
var leaderboard = [];

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
            incrementWinCount(selectedPlayers[currentPlayerIndex]);
            saveHighScore(estremoMinimo, estremoMassimo);
            displayLeaderboard();
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
            currentPlayerIndex = (currentPlayerIndex + 1) % selectedPlayers.length;
            displayCurrentPlayer();
        }
    }
}

function displayCurrentPlayer() {
    var currentPlayer = selectedPlayers[currentPlayerIndex];
    document.getElementById("current-player").innerText = "Current Player: " + currentPlayer.name;
}

function incrementWinCount(player) {
    player.wins = (player.wins || 0) + 1;
    savePlayers();
}

function saveHighScore(min, max) {
    var score = {
        player: selectedPlayers[currentPlayerIndex].name,
        interval: max - min
    };
    leaderboard.push(score);
    leaderboard.sort((a, b) => a.interval - b.interval);
    leaderboard = leaderboard.slice(0, 20);
    saveLeaderboard();
}

function displayLeaderboard() {
    var leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = "<h2>Leaderboard</h2>";
    leaderboard.forEach((score, index) => {
        var scoreDiv = document.createElement("div");
        scoreDiv.innerText = (index + 1) + ". " + score.player + ": " + score.interval;
        leaderboardDiv.appendChild(scoreDiv);
    });
    leaderboardDiv.style.display = "block";
}

function savePlayers() {
    document.cookie = "players=" + JSON.stringify(players) + "; path=/";
}

function saveLeaderboard() {
    document.cookie = "leaderboard=" + JSON.stringify(leaderboard) + "; path=/";
}

function loadPlayers() {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        if (cookie[0] === "players") {
            players = JSON.parse(cookie[1]);
        }
    }
}

function loadLeaderboard() {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        if (cookie[0] === "leaderboard") {
            leaderboard = JSON.parse(cookie[1]);
        }
    }
}

function managePlayers() {
    // Placeholder for player management functionality
}

function startGame() {
    if (selectedPlayers.length >= 2) {
        document.getElementById("player-selection").style.display = "none";
        document.getElementById("main").style.display = "block";
        displayCurrentPlayer();
    }
}

function selectPlayer(player) {
    var index = selectedPlayers.indexOf(player);
    if (index === -1) {
        selectedPlayers.push(player);
    } else {
        selectedPlayers.splice(index, 1);
    }
    updatePlayerButtons();
    updateStartButton();
}

function updatePlayerButtons() {
    var playerButtonsDiv = document.getElementById("player-buttons");
    playerButtonsDiv.innerHTML = "";
    players.forEach(player => {
        var button = document.createElement("button");
        button.innerText = player.name;
        button.className = "btn btn-outline-dark";
        if (selectedPlayers.includes(player)) {
            button.classList.add("btn-primary");
        }
        button.onclick = function() {
            selectPlayer(player);
        };
        playerButtonsDiv.appendChild(button);
    });
}

function updateStartButton() {
    var startButton = document.getElementById("start-button");
    if (selectedPlayers.length >= 2) {
        startButton.disabled = false;
        startButton.classList.remove("btn-secondary");
        startButton.classList.add("btn-success");
    } else {
        startButton.disabled = true;
        startButton.classList.remove("btn-success");
        startButton.classList.add("btn-secondary");
    }
}

document.getElementById("numero").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        guess();
    }
});

function gimmick(el) {
    var exists = document.getElementById('gimmick');
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
    canvas.id = 'gimmick';

    var coin = new Image();
    coin.src = 'assets/coin.png';
    coin.onload = function() {
        element.appendChild(canvas);
        focused = true;
        drawloop();
    };
    var coins = [];

    function drawloop() {
        if (focused) {
            requestAnimationFrame(drawloop);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < .3) {
            coins.push({
                x: Math.random() * canvas.width | 0,
                y: -50,
                dy: 3,
                s: 0.5 + Math.random(),
                state: Math.random() * 10 | 0
            });
        }
        var i = coins.length;
        while (i--) {
            var x = coins[i].x;
            var y = coins[i].y;
            var s = coins[i].s;
            var state = coins[i].state;
            coins[i].state = (state > 9) ? 0 : state + 0.1;
            coins[i].dy += 0.3;
            coins[i].y += coins[i].dy;

            ctx.drawImage(coin, 44 * Math.floor(state), 0, 44, 40, x, y, 44 * s, 40 * s);

            if (y > canvas.height) {
                coins.splice(i, 1);
            }
        }
    }
}

window.onload = function() {
    loadPlayers();
    loadLeaderboard();
    updatePlayerButtons();
    updateStartButton();
};
