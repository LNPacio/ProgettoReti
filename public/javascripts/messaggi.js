var socket;
var idChatGlobale;
var destinatarioGlobale;
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

 var listaUtenti = [];


function loadRequest(){
	var request = $.get("/getRichieste", function(data, status){});
	//alert("Richiesta richieste");
	
	request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else{
			if (msg.length > 0){
			$('#listadellerichieste').empty();
			for(var line of msg)
				$('#listadellerichieste').append('<tr><td name='+line.id+'>'+line.utente1+' <button class="bottoneaccetta" id='+line.id+' type="button" onClick="clickbutton(this.id)">Accetta</button>'+'</td></tr>');
			}
			else{
				$('#listadellerichieste').empty();
				$('#listadellerichieste').append('<tr><td>Nessuna richiesta</td></tr>');
			}
		}
	});
}


function loadAmici(){
	var request = $.get("/getAmici", function(data, status){});
	request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else{
			if (msg.length > 0){
			$('#listadegliamici').empty();
			var contatore = 0;
			for(var line of msg){
				$('#listadegliamici').append('<tr id="amico'+contatore+'" class="trAmici"><td name='+line.id+'><a id='+line.id+' name='+line.utente+' onClick="clickChat(this.id, this.name,'+contatore+')">'+line.utente+'</a></td></tr>');
				contatore++;
			}
			} 
		}
	});
}

function clickbutton(idChat){
	//var idChat = $(this).attr("id");
	var request = $.post("/accettaAmicizia", {idChat:idChat} ,function(data, status){});
	request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else{ 
			alert(msg);
			loadAmici();
			loadRequest();
		}
     });
     
}

function clickChat(idChat, valore, contatore){
	var splittato = "amico"+contatore;
	
	if(idChat != idChatGlobale){
	if(idChatGlobale != null){
		//alert("Disconnessione da: "+idChatGlobale);
		$(".trAmici").css({"background-color":""});
		socket.emit('disc', {dest:destinatarioGlobale, txt:"Disconnessine", idChat:idChatGlobale});
	}
	$("#"+splittato).css({"background-color":"grey"});
	$("#divChat").show();
	$("#chatBox").empty();
	destinatarioGlobale= valore;
	//alert(valore);
	idChatGlobale = idChat;
	socket = io.connect("https://hidden-fjord-76821.herokuapp.com/", {query: "idChat="+idChat});
	
	socket.on('message', function(message) {
			if(message.dest != destinatarioGlobale){
				text = message.mitt +":\n"+message.txt;
				insertChat("me", text, 0);
			}
		});
	}
	else alert("Questa chat è già aperta!");
}


//Chat
	var me = {};

var you = {};

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){
        
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';                    
    }else{
        control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"></div>' +                                
                  '</li>';
    }
    setTimeout(
        function(){                        
            $("#chatBox").append(control);

        }, time);
    
}

function resetChat(){
    $("#chatBox").empty();
}



$(document).ready(function(){
	$("#divChat").hide();
	loadRequest();
	loadAmici(); 
	
	var request = $.get("/getListaUtenti", function(data, status){});
	var destinatario;
		
		request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else{
			for(var utente of msg)
				listaUtenti.push(utente.name+' '+utente.surname+', '+utente.email);
		}
        });
        //alert("Lista utenti caricata");
        
	autocomplete(document.getElementById("myInput"), listaUtenti);
	

	

$("#ao").on("keyup", function(e){
    if (e.which == 13){
        var text = $("#ao").val();
        if (text !== ""){
			socket.emit('mess', {dest:destinatarioGlobale, txt:text, idChat:idChatGlobale});
            insertChat("notme", text);              
            $(this).val('');
        
        }
    }

});



$("#selezionaUtente").click(function(){
  var array = $("#myInput").val().split(", ");
  
	//$("#divChat").show();
  var destinat = array[1];
  if(destinat != ""){
	//alert(destinatario);
	//resetChat();
	var request = $.post("/invioRichiesta", {destinatario: destinat} ,function(data, status){});
	request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else alert(msg);
        });
		
		/*request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else{
			for(var utente of msg)
				alert("Richiesta inviata");
		}
		});*/
  }
  else{alert("Inserire utente");}
	
});

//-- Clear Chat
//resetChat();

//-- Print Messages
//insertChat("me", "Hello Tom...", 0);  

//-- NOTE: No use time on insertChat.

		
		
});




