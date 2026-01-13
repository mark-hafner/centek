# NASLOV SEMINARSKE NALOGE: CENTEK

Člana ekipe:

63240105 Mark Hafner

63240368 Matic Žakelj

**CENTEK – aplikacija za pregled financ** <br>
<a href="http://206.189.2.204:8080/">Centek spletna stran</a>

OPIS APLIKACIJE

Namen aplikacije je sledenje denarnemu toku uporabnika, da ima ta enostaven pregled nad svojimi
financami.

Delovala bo kot spletna in mobilna aplikacija, ki bosta povezani preko skupnega backend-a.

## FUNKCIONALNOSTI

## 1. VNOS PRIHODKOV IN ODHODKOV

- Uporabnik vpisuje prihodke in odhodke ter pri vsakem navede, od kod je denar prišel in kje je bil
    porabljen
- Pri vsakem vnosu določi:
    - Ali je prihodek ali odhodek
    - Znesek transakcije
    - Ime in opis transakcije
    - Račun, na ketegem se ta transakcija izvede
    - Kategorijo pod katero ta spada (npr. hrana, prevoz, šport...)
    - Podkategorijo(npr. Špar, McDonalds, Avtobus ...)
- Pri kategorijah lahko izbira med nekaterimi standardnimi, lahko pa tudi doda svoje.
- Lahko določi tudi ponavljajoče transakcije.

## 2. PRIKAZ PODATKOV

- Aplikacija omogoča vizalni prikaz prihodkov in odhodkov s tabelo in grafi.
- Lahko filtrira po kategorijah, tipu transakcije(pihodek/odhodek), znesku, časovnem obdobju ...
- Ob vsakem novem vnosu podatkov se izvede izračun in posodobitev prikaza.

## 3. TEHNOLOGIJE

Spletna aplikacija je narejena z ASP.NET z MVC.
Mobilna aplikacija je narejena v EXPO React Native Framework-u.

## 4. KRATEK OPIS DELOVANJA

Uporabnik se registrira in naredi svoj prvi račun. Na voljo so mu 4 prej narejene glavne kategorije seveda pa lahko dodaja nove. Prav tako lahko dodaja pod kategorije, plačila in ponavljajoča plačila. Pregled nad plačili mu omogoča zavihek "Stats" v obliki tabele in zavihek "Overview" v obliki grafov, podatke lahko tudi filtrira. Vsa plačila, računi in kategorije so shranjeni v podatkovni bazi. Aplikacija deluje tako na operacijskem sistemu Android kot na iOS. Preko <a href="http://206.189.2.204:8080/swagger/index.html">spletne storitve (API)</a> se z avtorizacijo/avtentikacijo povezuje na bazo spletne strani. V aplikaciji uporabnik lahko briše in dodaja plačila, dodaja račune in kategorije. Prav tako ima pregled nad plačili s tabelo in grafom. Aplikacija omogoča prikaz podatkov in brisanje/dodajanje plačil tudi, ko telefon nima dostopa do baze, ko ponovno dobi povezavo, posodobljene podatke pošlje preko spletne storitve, da se osveži tudi baza.

## 5. OPIS NALOG

Zaradi želje po razumevanju in učenju izdelave spletne strani, spletne storitve in mobilne aplikacije, sva naloge veliko združevala, izboljševala in delala oba. V grobem je razdelitev dela zgledala nekako tako:
- Mark: Podatkovna baza, login, filtri na spletni strani in v aplikaciji, prikaz plačil na spletu in v aplikaciji
- Matic: Izgled spletne strani, strani za ustvarjanje plačil, računov in kategorij, ogrodje mobilne aplikacije 

## 6. PODATKOVNI MODEL
<img width="1559" height="1404" alt="schema-CentekDB" src="https://github.com/user-attachments/assets/bcf0f9ba-e6b9-4537-a07b-9681b2a5a84b" />

## 7. ZASLONSKE SLIKE GRAFIČNEGA VMESNIKA

<img width="2879" height="1721" alt="Zavihek Stats" src="https://github.com/user-attachments/assets/19951922-d62b-4128-8e5b-ee3bb67cb04e" />
<img width="2879" height="1629" alt="Zavihek Payments" src="https://github.com/user-attachments/assets/af018be6-2dda-45e0-9a8e-28aa73904a3a" />
<img width="2879" height="1627" alt="Zavihek Overview" src="https://github.com/user-attachments/assets/a9ea6015-2f3c-4e90-ace5-52449ca62da8" />
<img width="2556" height="1179" alt="Zavihek Stats mobile" src="https://github.com/user-attachments/assets/b1b31703-1111-40c5-a2a8-b89c7f9511e5" />
<img width="295" height="639" alt="createPayment" src="https://github.com/user-attachments/assets/ef51888a-bb2c-40b1-88e2-c6561e2fb2c7" />



