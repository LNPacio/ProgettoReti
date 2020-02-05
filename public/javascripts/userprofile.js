$(document).ready(function(){
	$("#show_city").click(function(){
		var request = $.get("/showUsersCities", function(data, status){});
		
		request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else{
			for(var nome of msg)
			$('#list_city').append('<option value='+nome.città+'>'+nome.città+'</option>');
			$('#list_city').attr("disabled", false);
			$("#show_city").attr("disabled", true);
		}
        });
	});
});
