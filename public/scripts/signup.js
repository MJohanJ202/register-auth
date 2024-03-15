const $form = document.querySelector('#signup-form')
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify( data )
}

$form?.addEventListener('submit', async (event) => {
  event.preventDefault()
  // Get the values from the form elements on the page:
  const formData = new FormData(event.target)
  const data = Object.fromEntries(formData)
  
  const res = await fetch('http://localhost:5000/api/signup', options)
  if(!res.ok) return null
  const json = await  res.json()
  if(!json.redirect) return null
  window.location.href= json.redirect
})
