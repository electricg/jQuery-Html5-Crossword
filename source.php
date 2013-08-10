<?php
$solution = "
RECIPROCA#IMAM#REALTA
ABATE#VASSOIO#COMFORT
YALE#DENSITA#NOT#AGIO
BNL#LESTI#A#POREC#OPM
RO#MENTORE#CARPALE#LO
A#IAGO#RICCARDOTERZO#
DANNATI#ACANZI#ATEA#C
BRENTANO#ELOISA#OMNIA
UTS#ATENE#ANATRA#ITCS
RI#PROROGA#ILARCA#ETA
Y#LEI#TROPICI#ARIE#UT
#LITANIE#REO#PSORIASI
";

if ($_GET["check"] == 1) {
    $schema = trim($_GET["schema"]);
}
?>

<div>
<textarea id="create_crossword" name="create_crossword" rows="10" cols="50">
<?php echo $solution; ?>
</textarea>

<textarea id="create_hor" name="create_hor" rows="10" cols="50">
1 Valida per entrambe
9 Guida teologica islamica
12 Tutt'altro che fantasia
18 È a capo di un'abbazia
19 Si usa per le portate
21 Aiuta a rendere agevole
22 Una nota università americana
23 Varia al variare di un volume o un'area
24 Negazione inglese
25 Comodità, lusso
26 Banca Nazionale del Lavoro
27 Furbi, scaltri
28 Località Turistica della Croazia
30 Operations per minute
31 Ricerca Operativa
32 Saggio consigliere
34 Relativo alle ossa del polso
36 Nel Laos e nel Belgio
37 Fu rivale di Otello
38 Divenne Re d'Inghilterra il 6 Luglio 1483
41 Bruciano all'inferno
44 Varietà di piante rupestri
45 Persona non credence
47 Il Clements Maria delle "Fiabe del Reno"
49 Un nome femminile
51 Così è una opera che ne raccoglie una serie
53 Universal time system
54 Vi si svolsero le prime olimpiadi moderne
56 Un volatile lacustre
58 Istituti commerciali… in sigla
59 Repubblica Italiana
60 Posticipa una scadenza
62 Comandava un'unità da guerra macedone
64 Lotta per l'indipendenza basca
65 Si da a chi non si conosce
66 Delimitano l'inclinazione dell'asse terrestre
68 Sono musicate a teatro
70 Conclude l'azimut
71 Preghiere con invocazione ai santi
72 Colpevole
73 Una malattia cutanea
</textarea>

<textarea id="create_ver" name="create_ver" rows="10" cols="50">
1 Lo scrittore di fantascienza di "Ora Zero"
2 Un legno particolarmente pregiato
3 Un… center di operatori telefonici
4 Andate… in poesia
5 Pescara
6 Un punto all'orizzonte
7 Un Noto filosofo matematico
8 Antica regione dell'Asia
9 Segue Theta nell'alfabeto greco
10 La Farrow attrice
11 Aosta
12 Mossa in senso circolare
13 In mezzo al remo
14 Rende il caldo opprimente
15 Il simbolo di un'azienda
16 Un tipo di salto… olimpico
17 L'unità inscindibile della materia
20 Affermazione
21 È celeste il pianeta Terra
23 Espresso con chiarezza
24 Nemico dei confederati
27 Beneficiaria di una disposizione testamentaria
28 Non totali
29 Fu Papa dall'anno 79 all'anno 91
32 Il Thomas de "I Buddenbrock"
33 Precedeva "Bombo" in un film di Nanni Moretti
34 Così è detto il diritto ecclesiastico
35 Luoghi solitari ed appartati
37 Una Sastre dello spettacolo
39 Vasta insenatura marina per ormeggi
40 L'isola patria di Ugo Foscolo
42 Nel medioevo erano unite ai mestieri
43 Privi di vita, immobili
46 Famiglie nobiliari
48 Si accompagna alla gloria
50 Filippo III vi firmò un trattato nel 1435
52 Grave lesione cerebrale
55 Lo stesso che Io
57 Corrisponde a poco più di 4000 metri quadrati
60 La therapy con gli animali
61 La prima metà di aprile
63 Regione montuosa del Sahara
65 Cinquantuno romani
67 L'inizio di ieri
69 Esercito Italiano
</textarea>
</div>