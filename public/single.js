// Fetch Draw.io URL from the server and set it to the iframe
function loadDrawio() {
    fetch('/drawio-url')
        .then(response => response.json())
        .then(data => {
            const iframe = document.getElementById('drawioFrame');
            iframe.src = data.url;
        })
        .catch(err => console.error('Error fetching Draw.io URL:', err));
}

window.onload = loadDrawio;
