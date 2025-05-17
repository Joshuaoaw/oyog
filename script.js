// Scroll to top button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollTop").style.display = "block";
    } else {
        document.getElementById("scrollTop").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// New Game Modal
const newGameBtn = document.querySelector('.newgame');
const gameModal = document.getElementById('gameModal');
const overlay = document.getElementById('overlay');

if (newGameBtn && gameModal && overlay) {
    newGameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        gameModal.classList.add('show');
        overlay.classList.add('show');
    });

    overlay.addEventListener('click', () => {
        gameModal.classList.remove('show');
        overlay.classList.remove('show');
    });
}

// Burger Menu
const burger = document.getElementById('burgerMenu');
const mobileNav = document.getElementById('mobileNav');

if (burger && mobileNav) {
    burger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-navigation a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });
}

// Season Filter
const seasonSelect = document.getElementById('seasonSelect');
const allRows = document.querySelectorAll('.standings-table tbody tr');

if (seasonSelect) {
    seasonSelect.addEventListener('change', () => {
        const selected = seasonSelect.value;
        allRows.forEach(row => {
            row.style.display = (row.dataset.season === selected) ? '' : 'none';
        });
    });

    // Trigger default on load
    seasonSelect.dispatchEvent(new Event('change'));
}

// Player Stats Popup Modal
const statCards = document.querySelectorAll('.stat-card');
const playerModal = document.getElementById('playerModal');
const closeModalBtn = document.getElementById('closeModal');

const modalName = document.getElementById('modalName');
const modalStat = document.getElementById('modalStat');
const modalSport = document.getElementById('modalSport');
const modalImage = document.getElementById('modalImage');

if (playerModal && closeModalBtn) {
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            modalName.textContent = card.dataset.name;
            modalStat.textContent = card.dataset.value;
            modalSport.textContent = card.dataset.sport;
            modalImage.src = card.dataset.image;

            playerModal.style.display = 'block';
        });
    });

    closeModalBtn.addEventListener('click', () => {
        playerModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === playerModal) {
            playerModal.style.display = 'none';
        }
    });
}
// sa team pop up
document.addEventListener('DOMContentLoaded', function () {
    const teamCards = document.querySelectorAll('.team-card');
    const teamSportModal = document.getElementById('teamSportModal');
    const participantsModal = document.getElementById('participantsModal');
    const overlay = document.getElementById('overlay');
    const selectedTeamNameEl = document.getElementById('selectedTeamName');
    const selectedSportNameEl = document.getElementById('selectedSportName');
    const participantsList = document.getElementById('participantsList');

    let selectedTeam = '';

    // player ari
    const teamParticipants = {
        COE: {
            Basketball: ['Joshua Gwapo.', 'Joshua', 'Joshua.'],
            Volleyball: ['Joshua.', 'Joshua.'],
        },
        CME: {
            Soccer: ['Joshua..', 'Joshua.'],
            Baseball: ['Joshua.', 'Joshua.'],
        },
        CEAS: {
            Tennis: ['Joshua.', 'Joshua.'],
        },
        COT: {
            Badminton: ['Joshua.', 'Joshua.'],
            'Sepak Takraw': ['Joshua.', 'Leo G.']
        }
    };

    teamCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedTeam = card.querySelector('.team-name').textContent;
            selectedTeamNameEl.textContent = selectedTeam;
            teamSportModal.classList.add('show');
            overlay.classList.add('show');
        });
    });

    document.querySelectorAll('#teamSportsGrid .sport-card').forEach(sportCard => {
        sportCard.addEventListener('click', () => {
            const sport = sportCard.dataset.sport;
            selectedSportNameEl.textContent = sport;
            participantsList.innerHTML = '';

            const players = (teamParticipants[selectedTeam] && teamParticipants[selectedTeam][sport]) || ['No participants found.'];
            players.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                participantsList.appendChild(li);
            });

            teamSportModal.classList.remove('show');
            participantsModal.classList.add('show');
        });
    });

    overlay.addEventListener('click', () => {
        teamSportModal.classList.remove('show');
        participantsModal.classList.remove('show');
        overlay.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === teamSportModal || e.target === participantsModal) {
            teamSportModal.classList.remove('show');
            participantsModal.classList.remove('show');
            overlay.classList.remove('show');
        }
    });
});
