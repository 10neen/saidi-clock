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

function getInstantHijri(date) {
    try {
        return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    } catch (e) {
        return "تقويم هجري";
    }
}

function getInstantCoptic(date) {
    try {
        const formatter = new Intl.DateTimeFormat('ar-EG-u-ca-coptic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        let parts = formatter.formatToParts(date);
        let day = '', month = '', year = '';
        for (let p of parts) {
            if (p.type === 'day') day = p.value;
            if (p.type === 'month') month = p.value;
            if (p.type === 'year') year = p.value;
        }
        return `${day} ${month} ${year} قبطي`;
    } catch (e) {
        return "التقويم القبطي";
    }
}

async function syncEternalHijri() {
    try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        
        const response = await fetch(`https://api.aladhan.com/v1/gregorianToHijri?date=${dd}-${mm}-${yyyy}`);
        const data = await response.json();
        
        if (data && data.data && data.data.hijri) {
            const h = data.data.hijri;
            const preciseHijri = `${h.day} ${h.month.ar} ${h.year} هـ`;
            document.getElementById('hijriDateDisplay').innerText = `هجري: ${preciseHijri}`;
        }
    } catch (error) {}
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
    const initialHijri = getInstantHijri(now);
    const copticString = getInstantCoptic(now);
    
    document.getElementById('hijriDateDisplay').innerText = `هجري: ${initialHijri}`;
    document.getElementById('miladiDateDisplay').innerText = `ميلادي: ${miladiString}`;
    document.getElementById('copticDateDisplay').innerText = `قبطي: ${copticString}`;
}

createClockTicks();
updateClock();
syncEternalHijri();
setInterval(updateClock, 1000);
