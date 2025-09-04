        let currentTime = new Date();
        let showComparison = false;
        let isDarkMode = false;

        const modeToggle = document.getElementById('modeToggle');
        const birthDateInput = document.getElementById('birthDate');
        const secondBirthDateInput = document.getElementById('secondBirthDate');
        const compareToggle = document.getElementById('compareToggle');
        const comparisonSection = document.getElementById('comparisonSection');
        const resultsSection = document.getElementById('resultsSection');
        const ageComparisonCard = document.getElementById('ageComparisonCard');
        const compareText = document.getElementById('compareText');

        setInterval(() => {
            currentTime = new Date();
            updateAgeDisplay();
        }, 1000);

        modeToggle.addEventListener('click', toggleDarkMode);
        birthDateInput.addEventListener('change', handleBirthDateChange);
        secondBirthDateInput.addEventListener('change', handleSecondBirthDateChange);
        compareToggle.addEventListener('click', toggleComparison);

        function toggleDarkMode() {
            isDarkMode = !isDarkMode;
            document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
            modeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        }

        function toggleComparison() {
            showComparison = !showComparison;
            comparisonSection.classList.toggle('hidden', !showComparison);
            compareText.textContent = showComparison ? 'Hide Age Comparison' : 'Show Age Comparison';
            
            if (!showComparison) {
                ageComparisonCard.classList.add('hidden');
            } else {
                if (secondBirthDateInput.value) {
                    updateAgeComparison();
                } else {
                    showToast("👀 You forgot the other birthday! We need both for a fair fight😁", "info");
                }
            }
        }

        function handleBirthDateChange() {
            const birthDate = new Date(birthDateInput.value);
            
            if (birthDate > currentTime) {
                showToast("Whoa! Future birthdate detected. Time traveler?", "error");
                birthDateInput.value = "";
                resultsSection.classList.add('hidden');
                compareToggle.disabled = true;
                return;
            }

            if (birthDateInput.value) {
                compareToggle.disabled = false;
                resultsSection.classList.remove('hidden');
                resultsSection.classList.add('fade-in');
                updateAllDisplays();
            } else {
                compareToggle.disabled = true;
                resultsSection.classList.add('hidden');
            }
        }

        function handleSecondBirthDateChange() {
            const secondDate = new Date(secondBirthDateInput.value);

            if (secondDate > currentTime) {
                showToast("Comparison birth date cannot be in the future! bro...", "error");
                secondBirthDateInput.value = "";
                ageComparisonCard.classList.add('hidden');
                return;
            }

            if (showComparison && secondBirthDateInput.value) {
                updateAgeComparison();
            }
        }

        function updateAllDisplays() {
            updateAgeDisplay();
            updateZodiacInfo();
            updateBirthdayCountdown();
            updateFunFacts();
            updateMilestoneCountdown();
        }

        function updateAgeDisplay() {
            if (!birthDateInput.value) return;
            
            const birthDate = new Date(birthDateInput.value);
            const age = calculateAge(birthDate, currentTime);
            
            const ageDisplay = document.getElementById('ageDisplay');
            ageDisplay.innerHTML = `
                <div class="age-stat">
                    <div class="age-number">${age.years}</div>
                    <div class="age-label">Years</div>
                </div>
                <div class="age-stat">
                    <div class="age-number">${age.months}</div>
                    <div class="age-label">Months</div>
                </div>
                <div class="age-stat">
                    <div class="age-number">${age.days}</div>
                    <div class="age-label">Days</div>
                </div>
                <div class="age-stat">
                    <div class="age-number color-blue">${age.totalDays.toLocaleString()}</div>
                    <div class="age-label">Total Days</div>
                </div>
                <div class="age-stat">
                    <div class="age-number color-green">${age.totalHours.toLocaleString()}</div>
                    <div class="age-label">Total Hours</div>
                </div>
                <div class="age-stat">
                    <div class="age-number color-red">${age.totalMinutes.toLocaleString()}</div>
                    <div class="age-label">Total Minutes</div>
                </div>
                <div class="age-stat">
                    <div class="age-number color-yellow">${age.totalSeconds.toLocaleString()}</div>
                    <div class="age-label">Total Seconds</div>
                </div>
                <div class="age-stat">
                <div class="age-number color-green">
                    🧠
                </div>
                <div class="age-label" style="margin-bottom: 0.75rem;">
                    Life Progress (80 yrs)
                </div>
                <div style="width: 100%; background: rgba(0,0,0,0.1); border-radius: 6px; overflow: hidden;">
                    <div style="
                        height: 10px;
                        background: linear-gradient(to right, #10b981, #facc15);
                        width: ${Math.min(100, ((age.totalDays / (80 * 365)) * 100).toFixed(2))}%;
                        transition: width 0.4s ease;">
                    </div>
                </div>
                <div style="font-size: 0.75rem; opacity: 0.65; margin-top: 0.4rem;">
                    ${((age.totalDays / (80 * 365)) * 100).toFixed(1)}% of average life lived
                </div>
            </div>
            `;
        }

        function updateZodiacInfo() {
            const birthDate = new Date(birthDateInput.value);
            const zodiac = getZodiacSign(birthDate);
            const birthDay = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
            
            const zodiacInfo = document.getElementById('zodiacInfo');
            zodiacInfo.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">${zodiac.symbol}</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #9333ea; margin-bottom: 0.5rem;">${zodiac.name}</div>
                    <div style="opacity: 0.8; margin-bottom: 1.5rem;">${zodiac.description}</div>
                    <div style="font-size: 1rem; opacity: 0.7;">Born on a ${birthDay}</div>
                </div>
            `;
        }

        function updateBirthdayCountdown() {
            const birthDate = new Date(birthDateInput.value);
            const nextBirthday = getNextBirthday(birthDate);
            const daysUntil = Math.ceil((nextBirthday - currentTime) / (1000 * 60 * 60 * 24));
            const nextBirthdayDay = nextBirthday.toLocaleDateString('en-US', { weekday: 'long' });
            const nextBirthdayDate = nextBirthday.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const birthdayCountdown = document.getElementById('birthdayCountdown');
            
            if (daysUntil === 0) {
                birthdayCountdown.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                        <div style="font-size: 2rem; font-weight: 700; color: #9333ea; margin-bottom: 0.5rem;">TODAY!</div>
                        <div style="opacity: 0.8; margin-bottom: 1rem;">Happy Birthday!</div>
                        <div style="font-size: 1rem; opacity: 0.7;">${nextBirthdayDate}</div>
                    </div>
                `;
            } else {
                birthdayCountdown.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎂</div>
                        <div style="font-size: 2rem; font-weight: 700; color: #9333ea; margin-bottom: 0.5rem;">${daysUntil}</div>
                        <div style="opacity: 0.8; margin-bottom: 1rem;">🎁 Your cake countdown starts now! (Start hinting for gifts...)</div>
                        <div style="font-size: 1rem; opacity: 0.7;">Falls on ${nextBirthdayDay}</div>
                        <div style="font-size: 1rem; opacity: 0.7;">${nextBirthdayDate}</div>
                    </div>
                `;
            }
        }

        function updateFunFacts() {
            const birthDate = new Date(birthDateInput.value);
            const facts = calculateFunFacts(birthDate);
            
            const funFacts = document.getElementById('funFacts');
            funFacts.innerHTML = `
                <div class="fun-fact">
                    <div class="fact-icon">🏆</div>
                    <div class="fact-number color-yellow">${facts.leapYears}</div>
                    <div class="fact-label">Leap years lived through</div>
                </div>
                <div class="fun-fact">
                    <div class="fact-icon">❤️</div>
                    <div class="fact-number color-red">${(facts.heartbeats / 1000000).toFixed(1)}M</div>
                    <div class="fact-label">Estimated heartbeats</div>
                </div>
                <div class="fun-fact">
                    <div class="fact-icon">🫁</div>
                    <div class="fact-number color-blue">${(facts.breaths / 1000000).toFixed(1)}M</div>
                    <div class="fact-label">Estimated breaths taken</div>
                </div>
                <div class="fun-fact">
                    <div class="fact-icon">😴</div>
                    <div class="fact-number color-purple">${Math.floor(facts.sleepHours / 8760).toLocaleString()}</div>
                    <div class="fact-label">Years spent sleeping</div>
                </div>
                <div class="fun-fact">
                    <div class="fact-icon">🍽️</div>
                    <div class="fact-number color-green">${facts.meals.toLocaleString()}</div>
                    <div class="fact-label">Estimated meals eaten</div>
                </div>
            `;
        }

        function updateMilestoneCountdown() {
            const birthDate = new Date(birthDateInput.value);
            if (!birthDateInput.value) return;

            const milestoneDays = [10000, 15000, 20000];
            const now = new Date();
            const daysLived = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
            const el = document.getElementById("milestoneCountdown");
            el.innerHTML = "";

            const nextMilestone = milestoneDays.find(d => d > daysLived);

            if (nextMilestone) {
                const milestoneDate = new Date(birthDate.getTime() + nextMilestone * 24 * 60 * 60 * 1000);
                const daysUntilMilestone = Math.ceil((milestoneDate - now) / (1000 * 60 * 60 * 24));

                el.innerHTML = `
                    🎯 Your next big milestone is <strong>${nextMilestone.toLocaleString()}</strong> days!
                    <br>⏳ Only <strong>${daysUntilMilestone}</strong> days to go.
                    <br>📅 Mark your calendar: <strong>${milestoneDate.toDateString()}</strong>
                    <br>🥂 Start planning the party... or nap. You’ve earned it!
                `;
            } else if (daysLived >= 10000) {
                const futureMilestone = daysLived + (5000 - (daysLived % 5000));
                const milestoneDate = new Date(birthDate.getTime() + futureMilestone * 24 * 60 * 60 * 1000);
                const daysUntilMilestone = Math.ceil((milestoneDate - now) / (1000 * 60 * 60 * 24));
                const ageYears = Math.floor(daysLived / 365);

                let funnyNote = "";

                if (ageYears < 25) {
                    funnyNote = "That’s like unlocking Gen-Z prestige mode 🎮";
                } else if (ageYears < 40) {
                    funnyNote = "Midlife unlocked! Time to buy a motorcycle? 🏍️";
                } else if (ageYears < 60) {
                    funnyNote = "You’re aging like fine wine 🍷... or like forgotten leftovers 🧀";
                } else {
                    funnyNote = "Legends say you’ve seen the invention of Wi-Fi... and dinosaurs 🦖📡";
                }

                el.innerHTML = `
                    🥳 You've already passed <strong>${daysLived.toLocaleString()}</strong> days!
                    <br>Next level up at <strong>${futureMilestone.toLocaleString()}</strong> days!
                    <br><em>${funnyNote}</em>
                    <br>⏳ Just <strong>${daysUntilMilestone}</strong> days to go!
                    <br>📅 Save the date: <strong>${milestoneDate.toDateString()}</strong> (cake and existential questions optional).
                `;
            } else {
                el.innerHTML = `
                    🐣 You're just getting started with <strong>${daysLived.toLocaleString()}</strong> days!
                    <br>🚀 First big milestone at <strong>10,000</strong> days!
                    <br>⏳ Only <strong>${10000 - daysLived}</strong> days to go!
                    <br>📅 Estimated milestone: <strong>${new Date(birthDate.getTime() + 10000 * 24 * 60 * 60 * 1000).toDateString()}</strong>
                `;
            }
        }

        function updateAgeComparison() {
            if (!showComparison || !secondBirthDateInput.value) return;
            
            const birthDate1 = new Date(birthDateInput.value);
            const birthDate2 = new Date(secondBirthDateInput.value);
            const diff = calculateAgeDifference(birthDate1, birthDate2);
            
            ageComparisonCard.classList.remove('hidden');
            const ageComparison = document.getElementById('ageComparison');
            ageComparison.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; font-weight: 700; color: #9333ea; margin-bottom: 1rem;">
                        ${Math.abs(diff.years)} years, ${Math.abs(diff.months)} months, ${Math.abs(diff.days)} days
                    </div>
                    <div style="opacity: 0.8;">
                        ${diff.isOlder ? 'You are older 🏆' : 'You are younger 🤦‍♂️'}
                    </div>
                </div>
            `;
        }

        function calculateAge(birthDate, currentDate) {
            const diffMs = currentDate - birthDate;
            const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
            const totalMinutes = Math.floor(diffMs / (1000 * 60));
            const totalSeconds = Math.floor(diffMs / 1000);
            
            let years = currentDate.getFullYear() - birthDate.getFullYear();
            let months = currentDate.getMonth() - birthDate.getMonth();
            let days = currentDate.getDate() - birthDate.getDate();
            
            if (days < 0) {
                months--;
                days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            }
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            return { years, months, days, totalDays, totalHours, totalMinutes, totalSeconds };
        }

        function calculateAgeDifference(date1, date2) {
            const age1 = calculateAge(date1, currentTime);
            const age2 = calculateAge(date2, currentTime);
            
            const isOlder = date1 < date2;
            const olderDate = isOlder ? date1 : date2;
            const youngerDate = isOlder ? date2 : date1;
            
            const diff = calculateAge(olderDate, youngerDate);
            
            return { ...diff, isOlder };
        }

        function getZodiacSign(date) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            
            const signs = [
                { name: 'Aquarius', symbol: '♒', start: [1, 20], end: [2, 18], description: 'Independent, original, and progressive' },
                { name: 'Pisces', symbol: '♓', start: [2, 19], end: [3, 20], description: 'Intuitive, artistic, and compassionate' },
                { name: 'Aries', symbol: '♈', start: [3, 21], end: [4, 19], description: 'Energetic, pioneering, and confident' },
                { name: 'Taurus', symbol: '♉', start: [4, 20], end: [5, 20], description: 'Reliable, practical, and determined' },
                { name: 'Gemini', symbol: '♊', start: [5, 21], end: [6, 20], description: 'Adaptable, curious, and communicative' },
                { name: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22], description: 'Nurturing, emotional, and intuitive' },
                { name: 'Leo', symbol: '♌', start: [7, 23], end: [8, 22], description: 'Creative, generous, and confident' },
                { name: 'Virgo', symbol: '♍', start: [8, 23], end: [9, 22], description: 'Analytical, practical, and helpful' },
                { name: 'Libra', symbol: '♎', start: [9, 23], end: [10, 22], description: 'Diplomatic, balanced, and harmonious' },
                { name: 'Scorpio', symbol: '♏', start: [10, 23], end: [11, 21], description: 'Intense, passionate, and mysterious' },
                { name: 'Sagittarius', symbol: '♐', start: [11, 22], end: [12, 21], description: 'Adventurous, optimistic, and philosophical' },
                { name: 'Capricorn', symbol: '♑', start: [12, 22], end: [1, 19], description: 'Ambitious, disciplined, and practical' }
            ];
            
            for (const sign of signs) {
                if (sign.name === 'Capricorn') {
                    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
                        return sign;
                    }
                } else {
                    const [startMonth, startDay] = sign.start;
                    const [endMonth, endDay] = sign.end;
                    if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
                        return sign;
                    }
                }
            }
            
            return { name: "Unknown", symbol: "❓", description: "No zodiac match found" };
        }

        function getNextBirthday(birthDate) {
            const today = new Date();
            const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            
            if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }
            
            return nextBirthday;
        }

        function calculateFunFacts(birthDate) {
            const now = new Date();
            const ageInDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
            const ageInHours = Math.floor((now - birthDate) / (1000 * 60 * 60));
            
            const birthYear = birthDate.getFullYear();
            const currentYear = now.getFullYear();
            let leapYears = 0;
            
            for (let year = birthYear; year <= currentYear; year++) {
                if (((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) &&
                    (year < now.getFullYear() || (year === now.getFullYear() && now >= new Date(year, 1, 29)))) {
                    leapYears++;
                }
            }
            
            return {
                leapYears,
                heartbeats: Math.floor(ageInDays * 100000),
                breaths: Math.floor(ageInDays * 20000),
                sleepHours: Math.floor(ageInHours * 0.33),
                meals: Math.floor(ageInDays * 3)
            };
        }

        function showToast(message, type = 'info') {
            const container = document.getElementById('toastContainer');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;

            container.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
        }

        window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loadingSpinner').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('loadingSpinner').style.display = 'none';
            }, 500);
        }, 3000);
    });
