document.addEventListener('DOMContentLoaded', () => {

    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-active');
        });
    }

    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('is-active');
            
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('is-active');
                }
            });

            if (!isActive) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    });
   
    const loginModal = document.getElementById('login-modal');
    const schedulingModal = document.getElementById('scheduling-modal');
    
    const loginTriggers = document.querySelectorAll('.login-trigger');
    const scheduleTriggers = document.querySelectorAll('.schedule-trigger');
    
    const newCloseButtons = document.querySelectorAll('.modal .close-button'); 
    const newModals = document.querySelectorAll('.modal'); 

    const openNewModal = (modal) => {
        if (modal) {
            modal.classList.add('is-open');
            document.body.style.overflow = "hidden"; 
            document.body.classList.add('modal-is-open'); 
        }
    };
    const closeNewModal = (modal) => {
        if (modal && modal.classList.contains('is-open')) { 
            modal.classList.remove('is-open');
             if (!document.querySelector('.modal.is-open')) {
                 document.body.style.overflow = "initial"; 
                 document.body.classList.remove('modal-is-open');
             }
        }
    };

    loginTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => openNewModal(loginModal));
    });
    scheduleTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => openNewModal(schedulingModal));
    });
    
    newCloseButtons.forEach(button => {
        button.addEventListener('click', () => closeNewModal(button.closest('.modal')));
    });

    document.addEventListener('keydown', evt => { 
        evt = evt || window.event;
        if (evt.key === "Escape" || evt.keyCode === 27) {
            closeNewModal(loginModal);
            closeNewModal(schedulingModal);
        }
    });

    newModals.forEach(modal => {
         modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeNewModal(modal);
            }
        });
    });

    // --- LÓGICA CARROSSEL NA PÁGINA ---
    const carouselWrapper = document.querySelector('.onpage-carousel-wrapper');
    const track = document.querySelector('.onpage-carousel-track');
    const items = document.querySelectorAll('.onpage-carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (track && items.length > 0) {
        const itemsCount = items.length;
        const scrollAmount = 3; 
        const visibleItemsDesktop = 5; // Quantos são visíveis no desktop
        let itemWidth = items[0].offsetWidth; // Largura inicial do item
        let currentIndex = 0;
        let autoScrollInterval;
        const autoScrollDelay = 5000; // 5 segundos

        // Clonar itens para loop infinito
        function cloneItems() {
             // Clona os últimos `visibleItemsDesktop` para o início
             for (let i = 0; i < visibleItemsDesktop; i++) {
                const clone = items[itemsCount - 1 - i].cloneNode(true);
                track.insertBefore(clone, items[0]);
            }
            // Clona os primeiros `visibleItemsDesktop` para o fim
            for (let i = 0; i < visibleItemsDesktop; i++) {
                const clone = items[i].cloneNode(true);
                track.appendChild(clone);
            }
        }

        function updateItemWidth() {
            // Recalcula a largura do item (importante para responsividade)
             const firstItem = track.querySelector('.onpage-carousel-item'); // Pega um item real
             if(firstItem) {
                const style = window.getComputedStyle(firstItem);
                const marginRight = parseFloat(style.marginRight) || 0;
                const marginLeft = parseFloat(style.marginLeft) || 0;
                // Considera padding/border se box-sizing for content-box, mas border-box é mais comum
                itemWidth = firstItem.getBoundingClientRect().width + marginRight + marginLeft;
             }
        }

        function goToIndex(index, smooth = true) {
            if (!track || isNaN(itemWidth) || itemWidth <= 0) return;

            if (!smooth) {
                track.style.transition = 'none';
            } else {
                track.style.transition = 'transform 0.5s ease-in-out';
            }
            // A posição inicial real agora considera os clones no início
            const initialOffset = visibleItemsDesktop * itemWidth; 
            track.style.transform = `translateX(-${index * itemWidth + initialOffset}px)`;
            currentIndex = index;
        }

        function handleTransitionEnd() {
            // Verifica se chegamos aos clones do final
            if (currentIndex >= itemsCount) {
                track.style.transition = 'none';
                currentIndex = currentIndex % itemsCount; // Volta ao item original equivalente
                const initialOffset = visibleItemsDesktop * itemWidth;
                track.style.transform = `translateX(-${currentIndex * itemWidth + initialOffset}px)`;
            }
             // Verifica se chegamos aos clones do início (scroll para trás)
            if (currentIndex < 0) {
                 track.style.transition = 'none';
                 currentIndex = (currentIndex % itemsCount + itemsCount) % itemsCount; // Volta ao item original equivalente no final
                 const initialOffset = visibleItemsDesktop * itemWidth;
                 track.style.transform = `translateX(-${currentIndex * itemWidth + initialOffset}px)`;
            }
        }

        function startAutoScroll() {
            stopAutoScroll(); // Garante que não haja múltiplos intervalos
            autoScrollInterval = setInterval(() => {
                moveToNextSlide();
            }, autoScrollDelay);
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }
        
        function moveToNextSlide() {
            if (currentIndex >= itemsCount) return; // Evita disparo múltiplo durante o ajuste
            goToIndex(currentIndex + scrollAmount);
        }
        
        function moveToPrevSlide() {
            if (currentIndex < 0) return; // Evita disparo múltiplo durante o ajuste
             goToIndex(currentIndex - scrollAmount);
        }

        // --- Inicialização ---
        cloneItems();
        updateItemWidth(); 
        // Define a posição inicial correta (mostrando os itens originais)
        goToIndex(0, false); 
        startAutoScroll();

        // Event Listeners
        if (nextBtn) {
             nextBtn.addEventListener('click', () => {
                moveToNextSlide();
                stopAutoScroll(); // Para auto-scroll ao clicar
                startAutoScroll(); // Reinicia após clique
             });
        }
       if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                moveToPrevSlide();
                stopAutoScroll();
                startAutoScroll();
            });
       }

       if (track) {
            track.addEventListener('transitionend', handleTransitionEnd);

            // Pausa no hover
            carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
            carouselWrapper.addEventListener('mouseleave', startAutoScroll);
       }
       
       // Recalcular largura no resize
        window.addEventListener('resize', () => {
            stopAutoScroll(); // Para evitar saltos durante o resize
            updateItemWidth();
            goToIndex(currentIndex, false); // Reposiciona sem animação
            startAutoScroll(); // Reinicia
        });
    }

});