
   <input type="submit" value="message" id="message">

hello

<script>
	alert("hello toi");
</script>


<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js"></script>
<script>
	var socket = io.connect('http://localhost:8080');

button = document.getElementById("message");
button.addEventListener("click", myfunction)

function myfunction(){
		data = "hello a tous";
		socket.emit('newmessage', data);
	}
</script>