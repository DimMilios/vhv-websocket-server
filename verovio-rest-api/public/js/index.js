let createDocumentForm = document.querySelector('#new-document');

// createDocumentForm.addEventListener('submit', async event => {
//   event.preventDefault();

//   let title = event.target.querySelector('input[name="document-title"]');
//   let createdDoc = await fetch('http://localhost:3001/api/documents', {
//     method: 'POST',
//     credentials: 'include',
//     body: JSON.stringify({
//       title: title.value,
//     }),
//     headers: { 'Content-Type': 'application/json' },
//   });

//   // let json = await createdDoc.json();
//   let text = await createdDoc.text();
//   console.log(text);

// });
// document.addEventListener('click', event => {
//   if (event.target.closest('tr.document-item')) return;
//   $('.collapse.edit-collapse').collapse('hide');
// })

// window.addEventListener('DOMContentLoaded', () => {
let documentList = document.querySelector('#document-list');
// Select a document from the list of documents on the dashboard
documentList?.addEventListener('click', event => {
  let target = event.target;
  let currentElem;
  if (target.nodeName === 'TD') {
    currentElem = target.parentElement;
  } else if (target.nodeName === 'TR') {
    currentElem = target;
  } else {
    return;
  }

  if (currentElem) {
    let docId = Number(currentElem.dataset.docId);
    let doctitle = currentElem.querySelector('input[name="title"]')?.value;

    console.log({ docId, doctitle });
    if (doctitle) {
      window.location.href = `http://localhost:3001/client?docId=${docId}&roomname=${doctitle}`;
    }
  }
});

let deleteButtons = document.querySelectorAll('.document-delete');
deleteButtons.forEach(btn => {
  btn.addEventListener('click', async event => {
    let currentElem = event.target.closest('tr');

    if (currentElem) {
      let docId = Number(currentElem.dataset.docId);
      let response = await fetch(
        `http://localhost:3001/api/documents/${docId}`,
        {
          method: 'DELETE',
        }
      );

      console.log(response);

      if (response.status === 200) {
        window.location.reload();
      }
    }
  });
});

let inviteCollabForm = document.querySelector('#invite-collaborator');
inviteCollabForm?.addEventListener('submit', async event => {
  event.preventDefault();

  let documentId = Number(event.target.dataset.sharedDocumentId);
  let email = new FormData(event.target).get('email');
  let response = await fetch(
    `http://localhost:3001/api/users/invite/${email}`,
    {
      method: 'POST',
      body: JSON.stringify({ documentId }),
      headers: { 'Content-Type': 'application/json' },
    }
  );

  $('#invite-collaborator-modal').modal('hide');
  
  if (response.ok) {
    let data = await response.json();
    
    navigator.clipboard
    .writeText(data.inviteURL)
    .then(() => {
      console.log(data.inviteURL, 'written to clipboard');
      let notification = document.createElement('div');
      document.body.firstElementChild.appendChild(notification);
      notification.outerHTML = createAlert('Success!', 'Invitation URL has been copied to your clipboard.');
    })
    .catch(err => console.log(err));
  } else {
    let notification = document.createElement('div');
    document.body.firstElementChild.appendChild(notification);
    notification.outerHTML = createAlert('Error!', 'Could not create invitation URL.', 'danger');
  }
  inviteCollabForm.reset();
});

function createAlert(strong = '', message = '', type = "success") {
  return `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    <strong>${strong}</strong> ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`
}

let shareButtons = document.querySelectorAll('.document-share');
shareButtons.forEach(btn => {
  btn.addEventListener('click', event => {
    let currentElem = event.target.closest('tr');
    if (currentElem) {
      inviteCollabForm.dataset.sharedDocumentId = currentElem.dataset.docId;
    }
  });
});

let docUpdateForms = document.querySelectorAll('.edit-doc-form');
docUpdateForms.forEach(form => {
  form.addEventListener('submit', async event => {
    let but = event.target.querySelector('input');
    but.type = but.type === 'search' ? 'text' : 'search';

    event.preventDefault();
    let docId = event.target.id.match(/(\d+)/)[0];

    let response = await fetch(`http://localhost:3001/api/documents/${docId}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        title: new FormData(event.target).get('title'),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // window.location.href = 'http://localhost:3001/dashboard';
      window.location.reload();
    }
  });
});
// });