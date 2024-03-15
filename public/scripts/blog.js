const $BtnCloseSession = document.querySelector('#session')

const expiredCookies = ({name='', path='/'}) => {
  const expiredDate = '05 Jan 2000  00:00:01 GMT'
  document.cookie = `${name}=;expires=${expiredDate};path=${path};`
}


$BtnCloseSession?.addEventListener('click', () => {
  expiredCookies({name:'jwt'})
})
