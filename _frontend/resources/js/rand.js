$("#randing").on('submit', (e) => {
    e.preventDefault();
    let file = document.getElementById('csv').files[0];

    fetch('http://localhost:3000/api/rand', {
        method: 'get',
    });
});