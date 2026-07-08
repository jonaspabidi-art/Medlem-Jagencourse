# Handoff: Åtgärdsplan för JAgencourse (kurs + plattform)

Detta dokument är en komplett arbetslista, framtagen efter en genomgång av tre repon.
Den är skriven för att kunna lämnas över till en AI-agent (eller utvecklare) som utför
punkterna en i taget. Arbeta i prioritetsordning. Fråga ägaren när en punkt kräver
innehåll bara han kan ge (markerat med **[KRÄVER ÄGARENS INPUT]**).

## Repon som berörs

| Repo | Roll |
|---|---|
| `jonaspabidi-art/Medlem-Jagencourse` | Medlemssida (Next.js + Supabase): kursinnehåll, video, progress |
| `jonaspabidi-art/JAgencourse` | Publik landningssida (statisk HTML + Supabase-formulär) |
| `jonaspabidi-art/Visionpalace` | Riktigt kundprojekt — används som kursexempel |

Nuläge i korthet: medlemssidan är tekniskt gedigen (ansökningsgodkännande, signerade
video-URL:er, RLS, progress). Kursen har 7 moduler / 57 lektioner i seed-datan
(`supabase/migrations/0002_seed_content.sql`) men bara titlar — inga videor,
inga lektionsbeskrivningar, inga resurser. Landningssidan säljer men saknar juridik
och har platshållare kvar.

---

## PRIO 1 — Kursinnehåll (Medlem-Jagencourse)

### 1.1 Nya lektioner i Modul 1 ("Grunden: Bemästra Claude Code")

Modul 1 har idag 8 lektioner och hoppar över det som skiljer nybörjare från de som
levererar. Lägg till följande lektioner (justera `sort_order` så flödet blir logiskt —
förslag på placering nedan):

| Ny lektion | Placeras efter | Innehåll |
|---|---|---|
| Vad kostar det? (Claude-abonnemang, Netlify, domän) | lektion 2 (Installation) | Månadskostnad för hela verktygskedjan; döda osäkerheten tidigt |
| CLAUDE.md & projektminne | lektion 4 (Arbetsflödet) | Ge Claude regler & kontext per projekt — största "aha" för nya användare |
| Planera först, bygg sedan | CLAUDE.md-lektionen | Be om plan → granska → godkänn → små steg. Vaga jättesvep = dåliga resultat |
| Skärmdumpar & visuell iteration | Planera-lektionen | Klistra in skärmdump på det som ser fel ut; "du behöver inte kunna CSS" |
| Kontexthantering & nya sessioner | Skärmdumps-lektionen | Ny session per uppgift; varför långa röriga sessioner ger sämre svar |
| Hemligheter & säkerhet (.env, API-nycklar) | lektion 6 (Git & GitHub) | Aldrig committa lösenord/nycklar; eleverna deployar KUNDERS sajter — obligatoriskt |

### 1.2 Nya lektioner i Modul 2 ("Bygg hemsidor åt företag")

| Ny lektion | Placeras efter | Innehåll |
|---|---|---|
| Kundbriefen — vad du frågar innan du bygger | lektion 1 | Frågemall: mål, målgrupp, sidor, material, deadline. Hälften av hantverket |
| Juridik på kundsajter (GDPR, cookies, integritetspolicy) | lektion 8 (Domän & publicering) | Kontaktformulär = persondata; vad varje kundsajt måste ha |

### 1.3 Lektionsbeskrivningar för ALLA lektioner

`lessons.description` finns i schemat och renderas i `app/lektion/[id]/page.tsx`
(rad 67–71) men seed-datan har inga beskrivningar. Skriv 2–3 meningar per lektion
enligt mönstret: *"I den här lektionen [vad]. Efteråt [vad eleven gör/kan]."*
Svenska, du-tilltal, konkret.

### 1.4 Migrationsteknik — VIKTIGT

Kontrollera först om `0002_seed_content.sql` redan körts i produktions-Supabase
(fråga ägaren). Om JA: skapa `0003_content_updates.sql` med `insert` för nya
lektioner + `update` för beskrivningar — redigera INTE 0002. Om NEJ: uppdatera
0002 direkt. Nya lektioner behöver `video_path`-platshållare i samma mönster
(`modul-1/lektion-X.mp4`).

### 1.5 Uppgifter/milstolpar per modul

Kursens löfte är inkomst → kursen måste driva handling, inte bara tittande.
Lägg en avslutande "Din uppgift"-lektion (eller beskrivningsblock) per modul:

- Modul 1: publicera din egen sajt live på Netlify
- Modul 2: bygg och publicera en demosajt åt ett riktigt lokalt företag
- Modul 3: bygg en automation som skickar mejl från ett formulär
- Modul 4: ta fram logga + 5 inlägg för ett fejk- eller riktigt företag
- Modul 5: optimera din modul 2-sajt och registrera Google Business-profil
- Modul 6: skicka 10 första kontakter med demosajten som dörröppnare
- Modul 7: skicka din första offert med månadsarvode inkluderat

---

## PRIO 2 — Plattformsfunktioner (Medlem-Jagencourse)

### 2.1 Resurser/nedladdningar per lektion

Datamodellen saknar helt stöd för bilagor. Bygg:

- Ny tabell `lesson_resources` (id, lesson_id FK, title, storage_path eller url, type, sort_order)
- RLS: `select` för authenticated; skrivning endast via service role (samma mönster som lessons)
- Privat bucket `lesson-resources` + signerad-URL-endpoint (kopiera mönstret från `app/api/lessons/[id]/video-url/route.ts`)
- Rendera resurslista under videon i `app/lektion/[id]/page.tsx`
- Admin-uppladdning (kopiera mönstret från `AdminVideoUpload.tsx` + `upload-url`-endpointen)

Resurser att producera (**[KRÄVER ÄGARENS INPUT]** för slutligt innehåll, men utkast kan genereras):
prompt-bibliotek, kundbrief-mall, offertmall, enkel avtalsmall, outreach-manus
(mejl/DM/telefon), leveranschecklista.

### 2.2 Community-länk

Landningssidan lovar "Tillgång till community för byggare" — inget finns.
Lägg en community-sektion/knapp på dashboarden (`app/page.tsx`) med Discord-invite.
**[KRÄVER ÄGARENS INPUT]**: Discord-server och invite-länk.

### 2.3 Kundlistverktyget

Landningssidan lovar "verktyget som ger dig färdiga kundlistor"
(repo: `Website-prospect-scraper`). Bestäm distributionsform med ägaren
(hostad tjänst / repo-access / nedladdning) och lägg åtkomst på dashboarden +
koppla till Modul 6 lektion 2. **[KRÄVER ÄGARENS INPUT]**

### 2.4 Videolängder

`duration_sec` är tom i seed. När videor laddas upp: läs längden vid uppladdning
(admin-flödet) och spara, så eleverna ser lektionslängd.

---

## PRIO 3 — Landningssidan (JAgencourse, `index.html`)

### 3.1 Juridik (måste finnas före lansering)

- `integritetspolicy.html` — GDPR: vilka uppgifter (namn, e-post, telefon), ändamål, lagringstid, rättigheter, kontakt
- `kopvillkor.html` — pris, vad som ingår, 14 dagars ångerrätt (distansavtalslagen), undantag vid påbörjad digital leverans om kunden samtyckt
- Länka båda i footern + under ansökningsformuläret
- Fixa död "Kontakt"-länk (footer) → `mailto:` **[KRÄVER ÄGARENS INPUT: e-postadress]**
- Footer: lägg till kontaktuppgifter/organisationsinfo

### 3.2 "Om mig"-sektionen

Platshållare kvar ("Ditt namn här", "X+ kunder"). `profilbild.png` finns i repot men
används inte. **[KRÄVER ÄGARENS INPUT]** — trovärdighetsfakta som finns:
byggde skobutik till 120k följare och 10–12 mkr omsättning, egna klädkollektioner
som sålde slut (100–110 tkr per drop), 75k följare på TikTok, bygger nu AI-tjänster
åt företag (hemsidor, automationer, kundportal-appen Vision Palace).

### 3.3 Inkomstpåståendet

"Upp till 50 000 kr extra i månaden" — riskabelt enligt marknadsföringslagen utan
underlag. Lägg synlig disclaimer nära hero (inte bara i FAQ), eller omformulera till
något ägaren kan styrka med egna/elevers siffror.

### 3.4 Visa kursplanen

Sidan är för vag för ett köp på 2 997 kr ("Exakt hur allt sätts ihop går vi igenom
inne i kursen"). Lägg en sektion som listar de 7 modulerna med antal lektioner —
konkretion säljer kurser, mystik säljer bara klick. Behåll hemligheten om *mekaniken*
(t.ex. kundlistverktyget) enligt not i seed-filen rad 90–92.

### 3.5 Teknisk finish

- `<meta name="description">`, Open Graph-taggar (og:title, og:description, og:image), favicon
- Videon: play-knappen är en attrapp — koppla riktig video när den är inspelad, eller ta bort "Spela introduktionen · 3 min" tills dess

---

## PRIO 4 — Visionpalace (kursmaterial-sanering)

README:n innehåller riktiga hemligheter i klartext (`JWT_SECRET=VisionPalace2024xK9mPqR7nLwZ3bN8`,
OneSignal App ID, Supabase-URL:er). Innan repot visas för elever:

1. Rotera JWT_SECRET och ev. exponerade nycklar i produktionen **[KRÄVER ÄGARENS ÅTGÄRD]**
2. Byt alla riktiga värden i README till platshållare (`<din nyckel>`-stil)
3. Bonus: använd misstaget som undervisningsexempel i säkerhetslektionen (1.1)

---

## Lanseringsstrategi (kontext för prioriteringen)

Spela INTE in alla 57+ videor före lansering. Kortaste vägen till elevens första
krona är **Modul 1 → Modul 2 → Modul 6** (lär verktyget → bygg tjänsten → sälj den),
ca 27–30 lektioner. Lansera när de tre är klara, släpp resten löpande — "nytt
innehåll varje vecka" är ett säljargument och minskar ångerrättsrisken eftersom
värdet levereras över tid. Flaggskeppsinnehåll att spela in därefter: ett
genomgående case "följ med när jag bygger åt en riktig kund — från brief till
faktura" med Vision Palace som exempel.
