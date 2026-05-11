Autor: Piotr Chrabąszcz

1.Opis:
aplikacja została napisana w Node.js i uruchamiana w kontenerze Docker

Funkcjonalność:
-logi startowe
-sprawdzanie pogody dla miast z listy(temperatura, odczuwalna, wilgotność, wiatr i opady). Przy wyborze miasta idzie request do API geocoding, pobierane są współrzędne i pogoda dla współrzędnych, co jest wyświetlane w przeglądarce

2.Dockerfile
-build wieloetapowy
-obraz bazowy node:20-alpine
-instalacja zależności
-healtcheck
-uruchamianie z minimalnymi uprawnieniami
-etykieta według standardu OCI

3.Pliki
-server.js - plik Node z serwerem używanym w kontenerze
-package.json - plik konfiguracyjny do node
-public/index.html - strona, którą ustawia serwer
-Dockerfile - tak jak opisane wcześniej
-plik .pdf - zrzuty ekranu potwierdzające wykonanie zadania


Polecenia: 
a. zbudowanie obrazu kontenera
docker build -f Dockerfile -t zadanie1:1.0 .
b. uruchmienie kontenera
docker run -p 3000:3000 zadanie1:1.0
c. logi
docker logs id_kontenera
uzyskanie id pod docker ps
d.sprawdzenie ilości warstw
docker history zadanie1:v1.0
i policzenie warstw z rozmiarem większym od 0

