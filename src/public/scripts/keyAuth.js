async function featchLogin(key) {
    
    try {
      const license = await fetch(`https://api.metalabs.io/v4/licenses/${key}`, {
        headers: {
          'Authorization': 'Bearer API_KEY'
        }
      }).then(res => res.json());
    } catch {
        if(401 === key.status_code){
            return true
        } 
        else{
            return key
        }
    }
  }

document.addEventListener('DOMContentLoaded', () => {
    const $activateButton = document.querySelector('.activateButton');
    $activateButton.addEventListener('click', () => {
        const $key = document.querySelector('.keyInput').value;   
        console.log('Activate Button Clicked');
        if($key != 0){
            featchLogin($key);
        }
    });
});
