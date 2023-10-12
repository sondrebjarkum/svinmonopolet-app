types i tsconfig: https://stackoverflow.com/questions/42105984/cannot-find-name-console-what-could-be-the-reason-for-this

# flow:

## Første gang det kjører/restart

1. kjør vanlig flyt
2. force sched-task update and sync beverages -> Hent all drikke -> oppdater db -> begynn med unntappd og stock samtidig?

## Daglig oppdatering

1. sched-task update and sync beverages -> kjører ferdig og emiter event
2. event update store stock og event untappd kjører

## notes

- trenger kanksje ikke shced task update stores? For når jeg henter store stock vil potensielt nye butikker dukke opp?
- starte med å oppdatere alle butikker i Oslo
