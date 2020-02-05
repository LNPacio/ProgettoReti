$(document).ready(function(){
	$("#show_city").click(function(){
		var request = $.get("/showUsersCities", function(data, status){});
		
		request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else alert(msg);
        });
	});
});
