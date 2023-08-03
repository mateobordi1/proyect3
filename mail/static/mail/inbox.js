document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
    // Print emails
    console.log(emails);

    const emailsView = document.querySelector('#emails-view');

    // Iterar sobre los emails y construir el HTML para mostrarlos
    emails.forEach(email => {
      const emailDiv = document.createElement('div');
      emailDiv.classList.add('mail');
      emailDiv.innerHTML = `
        <p>sender: ${email.sender}</p>
        <p>subject: ${email.subject}</p>
        <p>timestamp: ${email.timestamp}</p>
        <hr>
      `;

      // Agregar el emailDiv al final del contenido existente dentro de #emails-view
      emailsView.insertAdjacentElement('beforeend', emailDiv);
    });
    
  });
}

function send_email(event) {
  event.preventDefault(); // Evita que el formulario se envíe por defecto
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  window.location.reload();
}
