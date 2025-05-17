let scoreA = 0;
let scoreB = 0;
let playerScores = {
  player1: 0,
  player2: 0,
  player3: 0,
  player4: 0,
  player5: 0,
  player6: 0,
  player7: 0,
  player8: 0,
  player9: 0,
  player10: 0,
  player11: 0,
  player12: 0,
  player13: 0,
  player14: 0,
  player15: 0,
  player16: 0,
  player17: 0,
  player18: 0,
  player19: 0,
  player20: 0,
  player21: 0,
  player22: 0
};
let timerInterval;
let timerRunning = false;
let minutes = 12;
let seconds = 00;
let totalSeconds = minutes * 60 + seconds;
let pendingPoints = null;
let pendingTeam = null;

document.addEventListener('DOMContentLoaded', function() {
  setupScoreButtons();
  setupTimerControls();
  setupPlayerCards();
  setupCardButtons();
  updateTimerDisplay();
  document.getElementById("scoreA").textContent = scoreA;
  document.getElementById("scoreB").textContent = scoreB;
});

function updateScore(team, points) {
  if (team === "A") {
    scoreA = Math.max(0, scoreA + points);
    document.getElementById("scoreA").textContent = scoreA;
  } else {
    scoreB = Math.max(0, scoreB + points);
    document.getElementById("scoreB").textContent = scoreB;
  }
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
  document.querySelectorAll('.add2').forEach(btn => {
    btn.addEventListener('click', function() {
      const team = this.getAttribute('data-team');
      enablePlayerSelection(team, 2);
      this.parentElement.classList.add('hidden');
    });
  });

  document.querySelectorAll('.add3').forEach(btn => {
    btn.addEventListener('click', function() {
      const team = this.getAttribute('data-team');
      enablePlayerSelection(team, 3);
      this.parentElement.classList.add('hidden');
    });
  });

  
}

function enablePlayerSelection(team, points) {
  pendingPoints = points;
  pendingTeam = team;
  const players = document.querySelectorAll(team === "A" ? ".left-player" : ".right-player");
  players.forEach(player => {
    player.classList.add("selectable");
    player.addEventListener("click", handlePlayerSelect);
  });
}

function handlePlayerSelect(e) {
  const playerCard = e.currentTarget;
  const playerId = playerCard.getAttribute('data-player');
  const scoreSpan = playerCard.querySelector(".player-score span");

  // Calculate new score but never below 0
  const newScore = Math.max(0, (playerScores[playerId] || 0) + pendingPoints);
  playerScores[playerId] = newScore;

  scoreSpan.textContent = newScore;
  updateScore(pendingTeam, pendingPoints);

  // Hide all point options popups
  document.querySelectorAll('.point-options').forEach(opt => opt.classList.add('hidden'));

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
    <input type="number" id="minutes" min="0" max="99" value="${minutes}" placeholder="Min">
    <span>:</span>
    <input type="number" id="seconds" min="0" max="59" value="${seconds}" placeholder="Sec">
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
    totalSeconds = mins * 60 + secs;
    updateTimerDisplay();
  });
  document.getElementById('play-pause').addEventListener('click', function() {
    if (timerRunning) {
      pauseTimer();
      this.textContent = '▶️ Play';
    } else {
      startTimer();
      this.textContent = '⏸️ Pause';
    }
  });
  document.getElementById('reset').addEventListener('click', function() {
    resetTimer();
    document.getElementById('play-pause').textContent = '▶️ Play';
  });
}

function startTimer() {
  if (timerRunning) return;
  if (totalSeconds <= 0) resetTimer();
  timerRunning = true;
  timerInterval = setInterval(() => {
    totalSeconds--;
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      document.getElementById('play-pause').textContent = '▶️ Play';
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  pauseTimer();
  totalSeconds = minutes * 60 + seconds;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  document.querySelector('.clock').textContent =
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

document.addEventListener('click', e => {
  if (!e.target.closest('.plus-wrapper')) {
    document.querySelectorAll('.point-options').forEach(opt => opt.classList.add('hidden'));
  }
});


document.querySelectorAll('.minus-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const minusPopup = this.parentElement.querySelector('.point-options.minus-options');
    const plusPopup = this.parentElement.querySelector('.point-options.plus-options');
    if (plusPopup && !plusPopup.classList.contains('hidden')) plusPopup.classList.add('hidden');
    if (minusPopup) minusPopup.classList.toggle('hidden');
  });
});
document.querySelectorAll('.minus1').forEach(btn => {
  btn.addEventListener('click', function() {
    const team = this.getAttribute('data-team');
    enablePlayerSelection(team, -1);
    this.parentElement.classList.add('hidden');
  });
});
document.querySelectorAll('.minus2').forEach(btn => {
  btn.addEventListener('click', function() {
    const team = this.getAttribute('data-team');
    enablePlayerSelection(team, -2);
    this.parentElement.classList.add('hidden');
  });
});
document.querySelectorAll('.minus3').forEach(btn => {
  btn.addEventListener('click', function() {
    const team = this.getAttribute('data-team');
    enablePlayerSelection(team, -3);
    this.parentElement.classList.add('hidden');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Handle +foul
  document.querySelectorAll(".addfoul").forEach(button => {
    button.addEventListener("click", () => {
      const team = button.getAttribute("data-team");
      const container = getTeamContainer(team);
      const foulCount = container.querySelector(".foul-count");
      if (foulCount) {
        foulCount.textContent = parseInt(foulCount.textContent) + 1;
      }
    });
  });

  // Handle -full timeout
  document.querySelectorAll(".minus-full-timeout").forEach(button => {
    button.addEventListener("click", () => {
      const team = button.getAttribute("data-team");
      const container = getTeamContainer(team);
      const fullTimeoutCount = container.querySelector(".fulltimeout-count");
      if (fullTimeoutCount) {
        let current = parseInt(fullTimeoutCount.textContent);
        if (current > 0) {
          fullTimeoutCount.textContent = current - 1;
        }
      }
    });
  });
  document.querySelectorAll(".minus-half-timeout").forEach(button => {
    button.addEventListener("click", () => {
      const team = button.getAttribute("data-team");
      const container = getTeamContainer(team);
      const halfTimeoutCount = container.querySelector(".halftimeout-count");
      if (halfTimeoutCount) {
        let current = parseInt(halfTimeoutCount.textContent);
        if (current > 0) {
          halfTimeoutCount.textContent = current - 1;
        }
      }
    });
  });

  function getTeamContainer(team) {
    const teamHeaders = document.querySelectorAll(".team");
    for (let teamBox of teamHeaders) {
      if (teamBox.querySelector("h2")?.textContent.includes(`Team ${team}`)) {
        return teamBox;
      }
    }
    return null;
  }
});
