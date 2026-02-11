document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const actuallyNoBtn = document.getElementById('actuallyNoBtn');
    const envelopeBtn = document.getElementById('envelopeBtn');
    const backBtn = document.getElementById('backBtn');

    const page1 = document.getElementById('page1');
    const pageVirtualDates = document.getElementById('pageVirtualDates');
    const pageEnvelope = document.getElementById('pageEnvelope');
    const pageLetter = document.getElementById('pageLetter');
    const pageSoundtrack = document.getElementById('pageSoundtrack');
    const pageFinal = document.getElementById('pageFinal');
    const page2 = document.getElementById('page2');
    const page3 = document.getElementById('page3');

    let currentPage = -1; // Start with no scroll page active
    // Updated scrollPages to include Letter and Soundtrack
    const scrollPages = [page3, pageVirtualDates, pageEnvelope, pageSoundtrack, pageFinal];

    // Scroll navigation for page 3 and beyond
    let isScrolling = false;

    window.addEventListener('wheel', (e) => {
        // Find the currently active page
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;

        // Skip scroll logic for landing page (page 1) and success page (page 2)
        // unless they are explicitly added to the scroll flow.
        if (activePage === page1 || activePage === page2) return;

        const isScrollable = activePage.classList.contains('scrollable');

        // 1. Allow internal scrolling first
        if (isScrollable) {
            // If scrolling down and NOT at bottom
            if (e.deltaY > 0 && activePage.scrollTop + activePage.clientHeight < activePage.scrollHeight - 10) {
                return; // Native scroll
            }
            // If scrolling up and NOT at top
            if (e.deltaY < 0 && activePage.scrollTop > 10) {
                return; // Native scroll
            }
        }

        // 2. Threshold check for page transitions
        if (Math.abs(e.deltaY) < 30) return;

        // 3. Prevent multiple quick scrolls
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        // 4. Handle Page Transitions
        if (e.deltaY > 0) {
            // SCROLL DOWN
            let nextPage = null;
            if (activePage === page3) nextPage = pageVirtualDates;
            else if (activePage === pageVirtualDates) nextPage = pageEnvelope;
            else if (activePage === pageEnvelope) nextPage = pageSoundtrack; // Skips letter
            else if (activePage === pageLetter) nextPage = pageSoundtrack;
            else if (activePage === pageSoundtrack) nextPage = pageFinal;

            if (nextPage) {
                e.preventDefault();
                isScrolling = true;
                // Keep currentPage index somewhat in sync for click handlers if needed
                currentPage = scrollPages.indexOf(nextPage);
                showPage(nextPage);
                setTimeout(() => { isScrolling = false; }, 1200);
            }
        } else if (e.deltaY < 0) {
            // SCROLL UP
            let prevPage = null;
            if (activePage === pageFinal) prevPage = pageSoundtrack;
            else if (activePage === pageSoundtrack) prevPage = pageLetter; // Usually go back to letter
            else if (activePage === pageLetter) prevPage = pageEnvelope;
            else if (activePage === pageEnvelope) prevPage = pageVirtualDates;
            else if (activePage === pageVirtualDates) prevPage = page3;

            if (prevPage) {
                e.preventDefault();
                isScrolling = true;
                currentPage = scrollPages.indexOf(prevPage);
                showPage(prevPage);
                setTimeout(() => { isScrolling = false; }, 1200);
            }
        }
    }, { passive: false });

    function showPage(pageToShow) {
        [page1, pageVirtualDates, pageEnvelope, pageLetter, pageSoundtrack, pageFinal, page2, page3].forEach(p => {
            p.classList.remove('active');
            p.classList.add('hidden');
        });
        pageToShow.classList.remove('hidden');
        pageToShow.classList.add('active');

        // Reset envelope state if showing the envelope page
        if (pageToShow === pageEnvelope) {
            const envelope = document.getElementById('envelopeBtn');
            if (envelope) {
                envelope.classList.remove('open');
            }
        }
    }

    // Click handlers for scroll arrows (backup navigation)
    const scrollDown2 = document.getElementById('scrollDown2');
    const scrollDown3 = document.getElementById('scrollDown3');
    const scrollDown4 = document.getElementById('scrollDown4');
    const scrollDownLetter = document.getElementById('scrollDownLetter');

    if (scrollDown3) {
        scrollDown3.addEventListener('click', () => {
            currentPage = 1; // Index of pageVirtualDates
            showPage(pageVirtualDates);
        });
    }

    if (scrollDown2) {
        scrollDown2.addEventListener('click', () => {
            currentPage = 2; // Index of pageEnvelope
            showPage(pageEnvelope);
        });
    }

    if (scrollDownLetter) {
        scrollDownLetter.addEventListener('click', () => {
            currentPage = 3; // Index of pageSoundtrack (since envelope is 2)
            showPage(pageSoundtrack);
        });
    }

    if (scrollDown4) {
        scrollDown4.addEventListener('click', () => {
            currentPage = 4; // Index of pageSoundtrack
            showPage(pageSoundtrack);
        });
    }

    const scrollDownSoundtrack = document.getElementById('scrollDownSoundtrack');
    if (scrollDownSoundtrack) {
        scrollDownSoundtrack.addEventListener('click', () => {
            currentPage = 4; // Index of pageFinal in scrollPages array
            showPage(pageFinal);
        });
    }

    // Page 1: "Yes" button click
    yesBtn.addEventListener('click', () => {
        currentPage = -1; // Disable scroll navigation
        showPage(page2);
        startFallingHearts();

        // Play background music
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.volume = 0.5; // Set volume to 50%
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
        }
    });

    // Falling Hearts Logic
    function startFallingHearts() {
        setInterval(createHeart, 300); // Add a new heart every 300ms
    }

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's'; // 2-5s fall duration
        heart.style.fontSize = Math.random() * 20 + 20 + 'px'; // Random size

        // Randomly assign color: Light Pink (#ffb6c1) or Dark Pink (#ff1493)
        const colors = ['#ffb6c1', '#ff1493'];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];

        document.body.appendChild(heart);

        // Remove heart after animation to prevent memory leak
        setTimeout(() => {
            heart.remove();
        }, 5000); // Matches max animation duration
    }

    // Page 1: "No" button movement logic
    const moveNoButton = () => {
        const container = document.querySelector('.container');
        if (!container) return;

        // Calculate max boundaries within the container
        const maxX = container.clientWidth - noBtn.offsetWidth - 40; // 40px padding buffer
        const maxY = container.clientHeight - noBtn.offsetHeight - 40;

        // Generate random position
        const x = Math.random() * maxX + 20; // +20 for left padding buffer
        const y = Math.random() * maxY + 20; // +20 for top padding buffer

        noBtn.style.position = 'absolute';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    };

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', moveNoButton);
    // Added touchstart preventive logic
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // Envelope click - opens letter
    if (envelopeBtn) {
        const envelope = document.getElementById('envelopeBtn');

        envelopeBtn.addEventListener('click', () => {
            if (envelope.classList.contains('open')) return; // Prevent double clicks

            envelope.classList.add('open');

            // Wait for animation to finish before showing the full letter page
            setTimeout(() => {
                currentPage = 3; // Index of pageLetter (not in scrollPages anymore but we can manually set it)
                // Note: currentPage index logic might need adjustment if logic implies index in scrollPages array.
                // Since we removed it from array, scroll logic won't work for it, which is fine.
                showPage(pageLetter);
            }, 1000);
        });
    }

    // Back button - returns to envelope page
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            currentPage = 2; // Index of pageEnvelope
            showPage(pageEnvelope);
        });
    }

    // Page 2: "Actually... No" button - moves 3 times then goes to page 3
    let actuallyNoMoveCount = 0;

    const moveActuallyNoButton = () => {
        actuallyNoMoveCount++;

        if (actuallyNoMoveCount < 3) {
            // Move the button around within the container
            const container = document.querySelector('.container');
            const maxX = container.clientWidth - actuallyNoBtn.offsetWidth - 20; // Padding buffer
            const maxY = container.clientHeight - actuallyNoBtn.offsetHeight - 20;

            const x = Math.random() * maxX + 10;
            const y = Math.random() * maxY + 10;

            actuallyNoBtn.style.position = 'absolute';
            actuallyNoBtn.style.left = `${x}px`;
            actuallyNoBtn.style.top = `${y}px`;
        } else {
            // After 3 moves, go to page 3
            currentPage = 0; // Index of page3 (which is actually page1 in array logic but likely page3 var)
            // Wait, looking at showPage(page3), page3 is index 0 in pages array?
            // Let's check showPage logic or just trust variable name page3. 
            // The Original code had currentPage = 0; showPage(page3);
            // I will keep it same but just ensure move logic is updated.

            showPage(page3);

            // Reset counter for next time
            actuallyNoMoveCount = 0;
            actuallyNoBtn.style.position = '';
            actuallyNoBtn.style.left = '';
            actuallyNoBtn.style.top = '';
        }
    };

    actuallyNoBtn.addEventListener('mouseover', moveActuallyNoButton);
    actuallyNoBtn.addEventListener('click', moveActuallyNoButton);
    actuallyNoBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveActuallyNoButton();
    });


});
