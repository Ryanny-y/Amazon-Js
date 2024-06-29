const xhr = new XMLHttpRequest;
xhr.open('GET', 'https://supersimplebackend.dev/');

xhr.addEventListener('load', () => {
  console.log(xhr.response);
})
xhr.send();