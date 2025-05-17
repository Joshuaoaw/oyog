// Badminton scoring variables
let currentSet = 1;
let scoreA = 0;
let scoreB = 0;
let setsA = 0;
let setsB = 0;
let setScores = {
  set1: { A: 0, B: 0 },
  set2: { A: 0, B: 0 },
  set3: { A: 0, B: 0 }
};

let playerScores = {
  player1: 0,
  player2: 0,
  player6: 0,
  player7: 0
};

let timerInterval;
let timerRunning = false;
let minutes = 0;
let seconds = 0;
let totalSeconds = minutes * 60 + seconds;

let selectedPlayer = null;
let pendingPoints = null;
let pendingTeam = null;

let courtSwitched = false;

// New: Track which side is team A or B
let teamSideMap = {
  left: "A",
  right: "B"
};

document.addEventListener('DOMContentLoaded', function() {
  setupScoreButtons();
  setupTimerControls();
  setupPlayerCards();
  updateTimerDisplay();

  document.getElementById("scoreA").textContent = scoreA;
  document.getElementById("scoreB").textContent = scoreB;

  updateSetIndicator();
  setupChangeCourt();
});

function setupChangeCourt() {
  const changeCourt = document.querySelector('.change-court-container');
  changeCourt.addEventListener('click', function() {
    const leftTeam = document.querySelector('.left-team');
    const rightTeam = document.querySelector('.right-team');

    leftTeam.classList.add('switching');
    rightTeam.classList.add('switching');

    setTimeout(() => {
      const parent = leftTeam.parentNode;
      const leftPlaceholder = document.createElement('div');
      const rightPlaceholder = document.createElement('div');

      parent.replaceChild(leftPlaceholder, leftTeam);
      parent.replaceChild(rightPlaceholder, rightTeam);
      parent.replaceChild(rightTeam, leftPlaceholder);
      parent.replaceChild(leftTeam, rightPlaceholder);

      leftTeam.classList.remove('switching');
      rightTeam.classList.remove('switching');

      courtSwitched = !courtSwitched;
      swapTeamScores();
    }, 300);
  });
}

function swapTeamScores() {
  // Swap logical team sides
  [teamSideMap.left, teamSideMap.right] = [teamSideMap.right, teamSideMap.left];

  // Swap actual score data
  [setsA, setsB] = [setsB, setsA];
  document.querySelector('.series-score-counter .team-score1').textContent = setsA;
  document.querySelector('.series-score-counter .team-score2').textContent = setsB;

  // Swap set scores in the UI
  for (let i = 1; i <= 3; i++) {
    // Get the set score elements for both teams
    const teamASetElement = document.querySelector(`.team:nth-child(1) .set${i} .score-value`);
    const teamBSetElement = document.querySelector(`.team:nth-child(3) .set${i} .score-value`);
    
    if (teamASetElement && teamBSetElement) {
      // Swap the visual scores displayed
      const tempScore = teamASetElement.textContent;
      teamASetElement.textContent = teamBSetElement.textContent;
      teamBSetElement.textContent = tempScore;
      
      // Also swap the data in the setScores object
      const setKey = `set${i}`;
      [setScores[setKey].A, setScores[setKey].B] = [setScores[setKey].B, setScores[setKey].A];
    }
  }

  // Swap current set scores
  [scoreA, scoreB] = [scoreB, scoreA];
  document.getElementById("scoreA").textContent = scoreA;
  document.getElementById("scoreB").textContent = scoreB;
  
  // Swap active set highlighting
  const team1Sets = document.querySelectorAll('.team:nth-child(1) .set-indicator .set');
  const team2Sets = document.querySelectorAll('.team:nth-child(3) .set-indicator .set');
  
  team1Sets.forEach((set, index) => {
    if (set && team2Sets[index]) {
      // Swap active-set class between teams
      const team1Active = set.classList.contains('active-set');
      const team2Active = team2Sets[index].classList.contains('active-set');
      
      if (team1Active) {
        set.classList.remove('active-set');
        team2Sets[index].classList.add('active-set');
      } else if (team2Active) {
        team2Sets[index].classList.remove('active-set');
        set.classList.add('active-set');
      }
    }
  });
}

function getLogicalTeam(displayTeam) {
  return teamSideMap[displayTeam === "A" ? "left" : "right"];
}

function updateScore(displayTeam, points) {
  const logicalTeam = getLogicalTeam(displayTeam);

  if (logicalTeam === "A") {
    scoreA = Math.max(0, scoreA + points);
    document.getElementById("scoreA").textContent = scoreA;
  } else {
    scoreB = Math.max(0, scoreB + points);
    document.getElementById("scoreB").textContent = scoreB;
  }

  checkSetCompletion();
}

function checkSetCompletion() {
  const regularWin = (scoreA >= 21 && scoreA - scoreB >= 2) || 
                     (scoreB >= 21 && scoreB - scoreA >= 2);
  const extendedWin = (scoreA === 30) || (scoreB === 30);

  if (regularWin || extendedWin) {
    const winner = scoreA > scoreB ? "A" : "B";
    setScores[`set${currentSet}`].A = scoreA;
    setScores[`set${currentSet}`].B = scoreB;

    document.querySelector(`.team:nth-child(1) .foul-tol-counter .tol-count`).textContent = setScores[`set${currentSet}`].A;
    document.querySelector(`.team:nth-child(3) .foul-tol-counter .tol-count`).textContent = setScores[`set${currentSet}`].B;

    if (winner === "A") {
      setsA++;
      document.querySelector('.series-score-counter .team-score1').textContent = setsA;
    } else {
      setsB++;
      document.querySelector('.series-score-counter .team-score2').textContent = setsB;
    }

    if ((setsA < 2 && setsB < 2) && currentSet < 3) {
      currentSet++;
      scoreA = 0;
      scoreB = 0;
      document.getElementById("scoreA").textContent = scoreA;
      document.getElementById("scoreB").textContent = scoreB;
      updateSetIndicator();
      alert(`Set ${currentSet-1} complete! ${winner === "A" ? "Team A" : "Team B"} wins the set. Starting Set ${currentSet}.`);

      if (currentSet === 2 || currentSet === 3) {
        const changeCourt = confirm("Change court sides?");
        if (changeCourt) {
          document.querySelector('.change-court-container').click();
        }
      }
    } else {
      const matchWinner = setsA > setsB ? "A" : "B";
      alert(`Match complete! ${matchWinner === "A" ? "Team A" : "Team B"} wins the match!`);
    }
  }
}

function updateSetIndicator() {
  document.querySelector('.periodnum').textContent = currentSet;
  document.querySelectorAll('.set1, .set2, .set3').forEach(el => {
    el.classList.remove('active-set');
  });
  document.querySelectorAll(`.set${currentSet}`).forEach(el => {
    el.classList.add('active-set');
  });
}

function setupScoreButtons() {
  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const team = this.getAttribute('data-team');
      const pointOptions = this.parentElement.querySelector('.point-options');
      document.querySelectorAll('.point-options').forEach(opt => {
        if (opt !== pointOptions) {
          opt.classList.add('hidden');
        }
      });
      pointOptions.classList.toggle('hidden');
    });
  });

  document.querySelectorAll('.add1').forEach(btn => {
    btn.addEventListener('click', function() {
      const team = this.getAttribute('data-team');
      enablePlayerSelection(team, 1);
      this.parentElement.classList.add('hidden');
    });
  });

  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const team = this.getAttribute('data-team');
      const logicalTeam = getLogicalTeam(team);
      if ((logicalTeam === "A" && scoreA > 0) || (logicalTeam === "B" && scoreB > 0)) {
        updateScore(team, -1);
        const playerTeam = logicalTeam === "A" ? [1, 2] : [6, 7];
        let highestScorePlayer = null;
        let highestScore = -1;
        playerTeam.forEach(playerNum => {
          const playerId = `player${playerNum}`;
          if (playerScores[playerId] > highestScore) {
            highestScore = playerScores[playerId];
            highestScorePlayer = playerId;
          }
        });
        if (highestScorePlayer && playerScores[highestScorePlayer] > 0) {
          playerScores[highestScorePlayer]--;
          document.querySelector(`[data-player="${highestScorePlayer}"] .player-score span`).textContent = 
            playerScores[highestScorePlayer];
        }
      }
    });
  });
}

function enablePlayerSelection(team, points) {
  pendingPoints = points;
  pendingTeam = team;
  const players = document.querySelectorAll(
    team === "A" ? ".left-player" : ".right-player"
  );
  players.forEach(player => {
    player.classList.add("selectable");
    player.addEventListener("click", handlePlayerSelect);
  });
}

function handlePlayerSelect(e) {
  const playerCard = e.currentTarget;
  const playerId = playerCard.getAttribute('data-player');
  const scoreSpan = playerCard.querySelector(".player-score span");
  playerScores[playerId] = (playerScores[playerId] || 0) + pendingPoints;
  scoreSpan.textContent = playerScores[playerId];
  updateScore(pendingTeam, pendingPoints);
  document.querySelectorAll(".selectable").forEach(player => {
    player.classList.remove("selectable");
    player.removeEventListener("click", handlePlayerSelect);
  });
  pendingPoints = null;
  pendingTeam = null;
}

function setupPlayerCards() {
  document.querySelectorAll('.player-card').forEach(card => {
    const playerId = card.getAttribute('data-player');
    const scoreSpan = card.querySelector('.player-score span');
    scoreSpan.textContent = playerScores[playerId];
  });
}

function setupTimerControls() {
  const controlsDiv = document.querySelector('.controls');
  const timeInput = document.createElement('div');
  timeInput.className = 'time-input';
  timeInput.innerHTML = `
    <input type="number" id="minutes" min="0" max="99" placeholder="00">:
    <input type="number" id="seconds" min="0" max="59" placeholder="00">
    <button id="set-time">Set</button>
  `;

  const timerButtons = document.createElement('div');
  timerButtons.className = 'timer-buttons';
  timerButtons.innerHTML = `
    <button id="play-pause">▶️ Play</button>
    <button id="reset">↺ Reset</button>
  `;

  controlsDiv.appendChild(timeInput);
  controlsDiv.appendChild(timerButtons);

  document.getElementById('set-time').addEventListener('click', function() {
    const mins = parseInt(document.getElementById('minutes').value) || 0;
    const secs = parseInt(document.getElementById('seconds').value) || 0;
    minutes = mins;
    seconds = secs;
    totalSeconds = minutes * 60 + seconds;
    updateTimerDisplay();
  });

  document.getElementById('play-pause').addEventListener('click', function() {
    if (!timerRunning) {
      startTimer();
      this.textContent = '⏸ Pause';
    } else {
      stopTimer();
      this.textContent = '▶️ Play';
    }
  });

  document.getElementById('reset').addEventListener('click', function() {
    stopTimer();
    minutes = 0;
    seconds = 0;
    totalSeconds = 0;
    updateTimerDisplay();
    document.getElementById('play-pause').textContent = '▶️ Play';
  });
}

function updateTimerDisplay() {
  const clock = document.querySelector('.clock');
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  clock.textContent = `${mins}:${secs}`;
}

function startTimer() {
  timerRunning = true;
  timerInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateTimerDisplay();
    } else {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
}

// Add some CSS for the active set and transitions
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .active-set {
      font-weight: bold;
      color: #ff9900;
    }
    
    .team-players {
      transition: transform 0.3s ease;
    }
    
    .switching {
      transform: translateX(50%);
      opacity: 0.5;
    }
    
    .selectable {
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
      transform: scale(1.05);
      transition: all 0.3s ease;
    }
    
    .change-court-container {
      cursor: pointer;
      padding: 8px;
      background-color: #2a2a2a;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    
    .change-court-container:hover {
      background-color: #444;
    }
  </style>
`);