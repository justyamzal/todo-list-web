export function setupProfile() {
    const profileName = localStorage.getItem('profileName');
    const profileImage = localStorage.getItem('profileImage');

    if (profileName) document.getElementById('profile-name').textContent = profileName;
    if (profileImage) document.getElementById('profile-image').src = profileImage;
}

export function askForProfileInfo() {
    const name = prompt('Masukkan nama profil:');
    if (name) {
        localStorage.setItem('profileName', name);
        document.getElementById('profile-name').textContent = name;
    }

    const image = prompt('Masukkan URL foto profil:');
    if (image) {
        localStorage.setItem('profileImage', image);
        document.getElementById('profile-image').src = image;
    }
}
