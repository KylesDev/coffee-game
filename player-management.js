function savePlayer() {
    var playerName = document.getElementById("player-name").value;
    if (playerName) {
        var players = getPlayersFromCookies();
        players.push({ name: playerName });
        document.cookie = "players=" + JSON.stringify(players) + "; path=/";
        alert("Player saved!");
    } else {
        alert("Please enter a player name.");
    }
}

function getPlayersFromCookies() {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        if (cookie[0] === "players") {
            return JSON.parse(cookie[1]);
        }
    }
    return [];
}

function deletePlayer() {
    var playerName = document.getElementById("player-name").value;
    if (playerName) {
        var players = getPlayersFromCookies();
        var updatedPlayers = players.filter(player => player.name !== playerName);
        document.cookie = "players=" + JSON.stringify(updatedPlayers) + "; path=/";
        alert("Player deleted!");
    } else {
        alert("Please enter a player name.");
    }
}

function returnToMainPage() {
    window.location.href = "index.html";
}
