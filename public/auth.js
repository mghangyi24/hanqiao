document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value.trim();

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        let res = await fetch('login.php', {
            method: 'POST',
            body: formData
        });

        let text = await res.text();
        console.log('Raw response:', text);

        let data = JSON.parse(text);

        if (data.status === 'success') {
            window.location.href = data.is_admin ? 'admin.html' : 'main.html';
        } else {
            document.getElementById('error').innerText = data.message;
        }
    } catch (err) {
        console.error('Fetch error:', err);
        document.getElementById('error').innerText = "Server error: " + err.message;
    }
});
