let scoreA = 0;
let scoreB = 0;

let playerScores = {
  player1: 0,
  player2: 0,
  player3: 0,
  player4: 0
};

let pendingPoints = null;
let pendingTeam = null;

document.addEventListener('DOMContentLoaded', () => {
  setupButtons();
  setupPlayers();
  updateScoreDisplay();
});

function updateScoreDisplay() {
  document.getElementById("scoreA").textContent = scoreA;
  document.getElementById("scoreB").textContent = scoreB;
}

function setupButtons() {
  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const team = this.dataset.team;
      const options = this.nextElementSibling;

      document.querySelectorAll('.point-options').forEach(opt => {
        if (opt !== options) opt.classList.add('hidden');
      });

      options.classList.toggle('hidden');
    });
  });

  ['add1'].forEach(className => {
    document.querySelectorAll(`.${className}`).forEach(btn => {
      btn.addEventListener('click', function () {
        const team = this.dataset.team;
        const points = parseInt(this.textContent);
        enablePlayerSelection(team, points);
        this.closest('.point-options').classList.add('hidden');
      });
    });
  });

  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const team = this.dataset.team;
      if (team === 'A') scoreA = Math.max(0, scoreA - 1);
      else scoreB = Math.max(0, scoreB - 1);
      updateScoreDisplay();
    });
  });

  // Period buttons (add +1 and reset game)
  document.querySelector('.add-game').addEventListener('click', () => {
    let currentPeriod = parseInt(document.querySelector('.periodnum').textContent);
    document.querySelector('.periodnum').textContent = currentPeriod + 1;
  });

  document.querySelector('.reset-game').addEventListener('click', () => {
    document.querySelector('.periodnum').textContent = 1; // Reset to 1
  });

  // Score buttons (+1 and reset for team scores)
  document.querySelector('.add-score1').addEventListener('click', () => {
    let teamA = document.querySelector('.team-score1 div');
    teamA.textContent = `${parseInt(teamA.textContent) + 1}`;
  });

  document.querySelector('.reset-score1').addEventListener('click', () => {
    let teamA = document.querySelector('.team-score1 div');
    teamA.textContent = '0';
  });

  document.querySelector('.add-score2').addEventListener('click', () => {
    let teamB = document.querySelector('.team-score2 div');
    teamB.textContent = `${parseInt(teamB.textContent) + 1}`;
  });

  document.querySelector('.reset-score2').addEventListener('click', () => {
    let teamB = document.querySelector('.team-score2 div');
    teamB.textContent = '0';
  });
}

function enablePlayerSelection(team, points) {
  pendingPoints = points;
  pendingTeam = team;

  const selector = team === 'A' ? '.left-player' : '.right-player';
  document.querySelectorAll(selector).forEach(player => {
    player.classList.add('selectable');
    player.addEventListener('click', handlePlayerSelect);
  });
}

function handlePlayerSelect(e) {
  const card = e.currentTarget;
  const playerId = card.dataset.player;
  const span = card.querySelector('.player-score span');

  playerScores[playerId] = (playerScores[playerId] || 0) + pendingPoints;
  span.textContent = playerScores[playerId];

  if (pendingTeam === 'A') scoreA += pendingPoints;
  else scoreB += pendingPoints;

  updateScoreDisplay();

  document.querySelectorAll('.selectable').forEach(player => {
    player.classList.remove('selectable');
    player.removeEventListener('click', handlePlayerSelect);
  });

  pendingPoints = null;
  pendingTeam = null;
}

function setupPlayers() {
  document.querySelectorAll('.player-card').forEach(card => {
    const id = card.dataset.player;
    const span = card.querySelector('.player-score span');
    span.textContent = playerScores[id];
  });
}
