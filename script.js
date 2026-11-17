function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function createClockTicks() {
    const container = document.getElementById('ticksContainer');
    container.innerHTML = '';

    for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div');
        tick.classList.add('tick');

        if (i % 15 === 0) {
            tick.classList.add('quarter-tick');
        } else if (i % 5 === 0) {
            tick.classList.add('hour-tick');
        } else {
            tick.classList.add('second-tick');
        }

        const angle = i * 6;
        tick.style.transform = `rotate(${angle}deg)`;
        container.appendChild(tick);
    }
}

async function fetchHijriDate() {
    try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        
        const response = await fetch(`https://api.aladhan.com/v1/gregorianToHijri?date=${dd}-${mm}-${yyyy}`);
        const data = await response.json();
        
        if (data && data.data && data.data.hijri) {
            const h = data.data.hijri;
            const hijriString = `هجري: ${h.day} ${h.month.ar} ${h.year} هـ`;
            document.getElementById('sheetHijriHeader').innerText = hijriString;
        }
    } catch (error) {
        document.getElementById('sheetHijriHeader').innerText = "هجري: متابعة حسابية نشطة";
    }
}

function updateClock() {
    const now = new Date();
    
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondDeg = (seconds / 60) * 360;
    const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
    const hourDeg = ((hours % 12 + minutes / 60) / 12) * 360;

    document.getElementById('secondHand').style.transform = `rotate(${secondDeg}deg)`;
    document.getElementById('minuteHand').style.transform = `rotate(${minuteDeg}deg)`;
    document.getElementById('hourHand').style.transform = `rotate(${hourDeg}deg)`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const miladiString = now.toLocaleDateString('ar-EG', options);
    document.getElementById('miladiDate').innerText = miladiString;

    document.getElementById('sheetDayName').innerText = now.toLocaleDateString('ar-EG', { weekday: 'long' });
    document.getElementById('sheetDayNumber').innerText = now.getDate();
    document.getElementById('sheetMonthYear').innerText = now.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
}

createClockTicks();
fetchHijriDate();
setInterval(updateClock, 1000);
updateClock();