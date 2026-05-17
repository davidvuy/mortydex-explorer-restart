# MortyDex Explorer

MortyDex Explorer is een kleine webapp voor Web Advanced.  
Het idee is gewoon om Rick and Morty characters op te halen en die op een leuke, duidelijke manier te tonen.

## Waarom deze API

Ik heb Rick and Morty gekozen omdat er veel characters in zitten en omdat die data goed past bij deze opdracht.
Je hebt namen, status, species, gender, locaties en episodes, dus daar kan je makkelijk op zoeken, filteren en sorteren.

## Wat zit er nu al in

- basis layout
- zoekveld
- filters
- sortering
- knop om filters terug te wissen
- view knoppen
- characters uit de Rick and Morty API
- eerste 3 pagina's worden geladen, dus ongeveer 60 characters
- tabel met naam, status, species, gender, origin, location en episodes
- eerste versie van favorieten met localStorage
- favorieten blijven bewaard na refresh
- favorieten worden ook in een kleine lijst getoond
- favorieten kunnen uit die lijst verwijderd worden
- gekozen thema wordt bewaard
- laatste zoekterm, filters, sortering en view worden bewaard
- Character class om de data wat netter te maken
- getters voor origin, location, episodes en korte info

## Installatie

```bash
npm install
npm run dev
```
