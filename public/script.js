document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const tiktokUrlInput = document.getElementById('tiktok-url');
    const downloadBtn = document.getElementById('download-btn');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const resultElement = document.getElementById('result');
    
    // Elementos del resultado
    const videoPreview = document.getElementById('video-preview');
    const profilePic = document.getElementById('profile-pic');
    const videoAuthor = document.getElementById('video-author');
    const videoUsername = document.getElementById('video-username');
    const videoTitle = document.getElementById('video-title');
    const videoLikes = document.getElementById('video-likes');
    const videoComments = document.getElementById('video-comments');
    const videoShares = document.getElementById('video-shares');
    const videoViews = document.getElementById('video-views');
    const downloadVideoBtn = document.getElementById('download-video-btn');
    const downloadMusicBtn = document.getElementById('download-music-btn');
    
    // Validar URL de TikTok
    function isValidTikTokUrl(url) {
        const patterns = [
            /^https?:\/\/(www\.)?tiktok\.com\/@.+\/video\/\d+/,
            /^https?:\/\/vm\.tiktok\.com\/\w+/,
            /^https?:\/\/vt\.tiktok\.com\/\w+/
        ];
        return patterns.some(pattern => pattern.test(url));
    }
    
    // Formatear números (1k, 1M, etc.)
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    // Mostrar error
    function showError(message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
    
    // Descargar archivo
    function downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'tiktok-video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    // Procesar el video
    async function processVideo(url) {
        try {
            // Mostrar carga
            loadingElement.classList.remove('hidden');
            resultElement.classList.add('hidden');
            errorElement.classList.add('hidden');
            
            // Limpiar campos anteriores
            videoPreview.src = '';
            videoPreview.poster = '';
            videoPreview.classList.remove('loaded');
            
            // Llamar al backend en lugar de usar la API directamente
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });
            
            if (!response.ok) {
                throw new Error('Error al procesar el video');
            }
            
            const data = await response.json();
            
            // Mostrar resultados
            videoPreview.src = data.video;
            videoPreview.poster = data.cover;
            videoPreview.onloadeddata = () => {
                videoPreview.classList.add('loaded');
            };
            
            profilePic.src = data.profilePicture;
            videoAuthor.textContent = data.author;
            videoUsername.textContent = `@${data.username}`;
            videoTitle.textContent = data.title;
            videoLikes.textContent = formatNumber(data.like);
            videoComments.textContent = formatNumber(data.comment);
            videoShares.textContent = formatNumber(data.share);
            videoViews.textContent = formatNumber(data.views);
            
            // Configurar botones de descarga
            downloadVideoBtn.onclick = (e) => {
                e.preventDefault();
                downloadFile(data.video, `tiktok-${data.username}.mp4`);
            };
            
            downloadMusicBtn.onclick = (e) => {
                e.preventDefault();
                downloadFile(data.music, `tiktok-audio.mp3`);
            };
            
            // Mostrar resultado con animación
            loadingElement.classList.add('hidden');
            resultElement.classList.remove('hidden');
            resultElement.classList.add('fade-in');
            
        } catch (error) {
            console.error('Error al procesar el video:', error);
            loadingElement.classList.add('hidden');
            showError('Error al procesar el video. Asegúrate que el enlace es correcto y vuelve a intentarlo.');
        }
    }
    
    // Evento del botón de descarga
    downloadBtn.addEventListener('click', async () => {
        const url = tiktokUrlInput.value.trim();
        
        if (!url) {
            showError('Por favor ingresa un enlace de TikTok');
            return;
        }
        
        if (!isValidTikTokUrl(url)) {
            showError('El enlace no parece ser de TikTok. Usa un formato válido.');
            return;
        }
        
        await processVideo(url);
    });
    
    // Permitir usar Enter para enviar
    tiktokUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            downloadBtn.click();
        }
    });
});
