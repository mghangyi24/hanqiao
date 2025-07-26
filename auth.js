document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value.trim();
    let errorElem = document.getElementById('error');

    errorElem.innerText = ''; // Clear previous errors

    if (!username || !password) {
        errorElem.innerText = 'Please enter username and password.';
        return;
    }

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

        let data;
        try {
            data = JSON.parse(text);
        } catch (jsonErr) {
            throw new Error("Invalid response format (not JSON)");
        }

        if (data.status === 'success') {
            window.location.href = data.is_admin ? 'admin.html' : 'main.html';
        } else {
            errorElem.innerText = data.message;
        }
    } catch (err) {
        console.error('Fetch error:', err);
        errorElem.innerText = "Server error: " + err.message;
    }
});
