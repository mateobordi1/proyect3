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
  document.querySelector('#email-individual').innerHTML= '';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-individual').innerHTML= '';
  

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {

    const emailsView = document.querySelector('#emails-view');

    // Iterar sobre los emails y construir el HTML para mostrarlos
    emails.forEach(email => {
      const emailDiv = document.createElement('div');
      emailDiv.classList.add('mail');
      const emailID = parseInt(`${email.id}`);
      emailDiv.innerHTML = `
        <p>sender: ${email.sender}</p>
        <p>subject: ${email.subject}</p>
        <p>timestamp: ${email.timestamp}</p>
        <hr>
      `;
      // manejamos el color de fondo dependiendo de si fue leido o no
      emailDiv.className = email.read ? "read" : "unread" ;

      //agregamos un detector de cuando se haga click en el div
      emailDiv.addEventListener("click", function(){
        email_individual(`${email.id}`);
      })

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

function email_individual(email_id){

  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  const emailIndividual = document.querySelector('#email-individual');


  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email)

      //ocultamos el contenido de los otros divs
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    
    //ponemos los datos del email dentro del div email-individual
    const emailDivIndividual = document.createElement('div');
    emailDivIndividual.classList.add('mailIndividual');
    emailDivIndividual.innerHTML = `
      <p> Sender : ${email.sender} </p>
      <p> Recipents : ${email.recipients}</p>
      <p> Subject: ${email.subject}</p>
      <p> Timestamp: ${email.timestamp}</p>
      <p> Body : ${email.body} </p>
      <p> read : ${email.read} </p>
      `
    emailIndividual.innerHTML = '';
    emailIndividual.appendChild( emailDivIndividual);
  });

}