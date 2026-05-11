Autor: Piotr Chrabąszcz
Część obowiązkowa:
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

Część nieobowiązkowa 3. (max. +80%) (rozszerzenie do poprzedniej części):
-11 luk w zabezpieczeniach na poziomie HIGH znalezionych w zabezpieczeniach, ale nie mają one znaczenia w tej aplikacji(opisane dokładniej w pliku pdf)
-aplikacja wykorzystuje rozszerzony frontend BuildKit(deklaracja na początku Dockerfile)
-w celu multiplatformowego budowania stworzyłem builder(polecenie: docker buildx create --use --name my_builder --driver docker-container)

-kod źródłowy nie jest już kopiowany z lokalnego dysku tylko z repozytorium github używając mount secret
-Access token został przekazany z pliku znajdującego się poza kontekstem(folderem) budowania
-Budowanie obrazu dla amd64 i arm64 oraz wysłanie cache(tryb max) bezpośrednio do Dockerhub zostało zrealizowane poleceniem:
docker buildx build --platform linux/amd64,linux/arm64 --secret id=github_token,src=C:\PAWCHO\token.txt -t chrabaszcz/zadanie1nob:v1.0 --cache-to=type=registry,ref=chrabaszcz/zadanie1nob:cache,mode=max --cache-from=type=registry,ref=chrabaszcz/zadanie1nob:cache --push .