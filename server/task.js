let params = new URLSearchParams(window.location.search);
let id = params.get('id');
let task = document.getElementById('task');

let button = document.getElementById('button'); 


document.getElementById('idElement').textContent += ' ' + id;

let hasFetched = false;

if (!hasFetched) {
    fetch(`http://localhost:3000/data/?id=${id}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('task').textContent = data.task;


        if (data.done) {
            document.getElementById('message').textContent = 'The task is done.';
        } else {
            document.getElementById('message').textContent = 'The task is not done.';
        }
        hasFetched = true; // Set the flag to true after the fetch request
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

button.addEventListener("click", function(event) {
    event.preventDefault();


    fetch(`http://localhost:3000/data/?id=${id}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('task').textContent = data.task;

        console.log(data);
        if (data.done) {
            document.getElementById('message').textContent = 'The task is done.';
        } else {
            document.getElementById('message').textContent = 'The task is not done.';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});