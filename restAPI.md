#  Rest API

## **/**  
 - **GET:** reindirizza alla pagina a */signin*
- POST:  
- PUT:
- DELETE: 
-
## **/signin**  
 - **GET:** mostra la pagina di login
- **POST:** se l'utente è registrato, effettua il login
- PUT:
- DELETE: 

 ## **/signup**  
 - **GET:** mostra la pagina di registrazione
- **POST:** se non è già presetnte, registra un nuovo utente 
- PUT:
- DELETE: 


## **/signupG**  
 - **GET:** mostra la pagina di registrazione con la form precompilata con gli account google
- POST: 
- PUT:
- DELETE: 

## **/users/home**  
 - **GET:** se l'utente è loggato mostra la home, in caso contrario reindirizza a */signin*
- POST: 
- PUT:
- DELETE: 

## **/users/profilo**  
 - **GET:** se l'utente è loggato mostra la pagina del profilo dell'utente, in caso contrario reindirizza a */signin*
- POST: 
- PUT:
- DELETE: 

## **/users/messaggi**  
 - **GET:** se l'utente è loggato mostra la pagina per la chat, in caso contrario reindirizza a */signin*
- POST: 
- PUT:
- DELETE: 

## **/users/logout**  
 - **GET:** cancella la *session* e reindirizza a */sigin*
- POST: 
- PUT:
- DELETE: 

## **/add_city**  
 - GET: 
- **POST**: se non già presente, aggiunge la città all'utente
- PUT:
- DELETE: 

## **/remove_city**  
 - GET: 
- **POST**: se presente, rimuove la città dall'utente
- PUT:
- DELETE: 

## **/showUsersCities**  
 - **GET**: popola la lista delle città selezionare per ogni utente 
- POST: 
- PUT:
- DELETE: 

## **/getListaUtenti**  
 - **GET**: popola la barra di ricerca utenti
- POST: 
- PUT:
- DELETE: 

## **/invioRichiesta**  
 - GET:
- **POST**: se non esiste già, crea una richiesta di amicizia tra 2 utenti che non sono anocra amici 
- PUT:
- DELETE: 

## **/getRichieste**  
 - **GET**: caricamento lista delle richieste
- POST: 
- PUT:
- DELETE: 

## **/getAmici**  
 - **GET**: caricamento degli amici
- POST: 
- PUT:
- DELETE: 

## **/accettaAmicizia**  
 - GET:
- POST: 
- **PUT**: trasforma una richiesta di amicizia in un'amicizia
- DELETE: 
