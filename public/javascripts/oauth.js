function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        //console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        //console.log('Full Name: ' + profile.getName());
        //console.log('Given Name: ' + profile.getGivenName());
        //console.log('Family Name: ' + profile.getFamilyName());
        //console.log("Image URL: " + profile.getImageUrl());
        //console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
        
        var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://hidden-fjord-76821.herokuapp.com/tokensignin');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
		console.log('Signed in as: ' + xhr.responseText);
		window.location.replace('https://hidden-fjord-76821.herokuapp.com' + xhr.responseText);
		googleUser.disconnect();
		};
		xhr.send('idtoken=' + id_token+'&fullname=' +profile.getName()+'&email=' +profile.getEmail()+'&givenname='+profile.getGivenName());
        
      }
      
$(document).ready(function(){
	var url = window.location.href.split("?")[1];
	//alert(url);
	if(url == 'usernotfound'){
		alert("Utente non registrato!");
	}
	if(url == 'errpassword'){
		alert("Password errata!");
	}
});
