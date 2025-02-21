document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    const clickSound = document.getElementById('click-sound');

    function playAudio(audio) {
        audio.play()
            .then(() => {
                // La reproducción se inició correctamente
            })
            .catch(error => {
                console.error("Error al reproducir audio:", error);
                if (error.name === 'NotAllowedError') {
                    console.log("La reproducción automática fue bloqueada. Esperando interacción del usuario.");
                }
            });
    }

    // Música de fondo
    playAudio(backgroundMusic); // Intenta reproducir al cargar la página

    document.body.addEventListener('click', () => {
        playAudio(backgroundMusic); // Intenta reproducir al hacer clic en el body
    });

    // Sonido de clic y "Ver más" con eventos delegados
    document.querySelector('.podcast-links').addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('ver-mas')) {
            const container = target.closest('.descripcion-container');
            const descripcionCorta = container.querySelector('.descripcion');
            const descripcionCompleta = container.querySelector('.descripcion-completa');

            if (descripcionCompleta.style.display === 'none' || !descripcionCompleta.style.display) {
                descripcionCorta.style.display = 'none';
                descripcionCompleta.style.display = 'block';
                descripcionCompleta.classList.add('mostrar');
                target.textContent = 'Ver menos';

                const card = target.closest('md-elevated-card');
                card.style.height = 'auto';
            } else {
                descripcionCorta.style.display = '-webkit-box';
                descripcionCompleta.style.display = 'none';
                descripcionCompleta.classList.remove('mostrar');
                target.textContent = 'Ver más';
            }

            playAudio(clickSound); // Sonido de clic al cambiar "Ver más"
        } else if (target.closest('.podcast-container')) {
            playAudio(clickSound); // Sonido de clic al hacer clic en la imagen

            const podcastItem = target.closest('.podcast-item');
            setTimeout(() => {
                podcastItem.classList.add('fade-out');
            }, 100); // Retraso de 100ms para la animación fadeOut
        }
    });

    // Sonido de clic para botones de redes sociales
    document.querySelector('.social-links').addEventListener('click', (event) => {
        if (event.target.closest('.social-button')) {
            playAudio(clickSound);
        }
    });
});

class PodcastApp {
    constructor() {
        // ... (código existente) ...
        this.setupCardAnimations();
    }

    setupCardAnimations() {
        const cards = document.querySelectorAll('.card');
        let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Verificar si el usuario prefiere movimiento reducido
        if (!isReducedMotion) {
            // Iniciar las animaciones con delays escalonados
            cards.forEach((card, index) => {
                const randomDelay = index * -(3 / cards.length);
                card.style.animationDelay = `${randomDelay}s`;
            });

            // Añadir efecto sutil de inclinación en hover
            cards.forEach(card => {
                const container = card.closest('.podcast-item');
                
                container.addEventListener('mouseenter', () => {
                    card.style.animationPlayState = 'paused';
                });

                container.addEventListener('mouseleave', () => {
                    card.style.animationPlayState = 'running';
                });

                // Efecto de inclinación suave
                container.addEventListener('mousemove', (e) => {
                    if (container.matches(':hover')) {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        
                        const tiltX = (y - centerY) / 50; // Reducido para un efecto más sutil
                        const tiltY = (centerX - x) / 50;

                        card.style.transform = `
                            translateY(${-8}px)
                            rotateX(${tiltX}deg)
                            rotateY(${tiltY}deg)
                        `;
                    }
                });

                // Resetear la transformación al salir
                container.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        }
    }
}
