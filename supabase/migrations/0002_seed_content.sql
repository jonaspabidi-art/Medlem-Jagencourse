-- Seed-data: 7 moduler, ~57 lektioner. video_path är platshållare tills riktiga
-- videor laddas upp till 'lesson-videos'-bucketen med matchande sökvägar.
-- Kör efter 0001_init.sql.

insert into modules (title, description, sort_order) values
  ('Grunden: Bemästra Claude Code', 'Från noll till att bygga på riktigt.', 1),
  ('Tjänst: Bygg hemsidor åt företag', 'Bygg och leverera sajter lokala företag betalar för.', 2),
  ('Tjänst: Automatiseringar', 'Automatisera det företag idag gör manuellt.', 3),
  ('Tjänst: Grafiskt content', 'Logga, social media och grafisk profil med AI.', 4),
  ('Tjänst: SEO för företag', 'Gör kundens sajt synlig på Google.', 5),
  ('Hitta & landa kunder', 'Din affär: kundlistor, pitch och avslut.', 6),
  ('Återkommande intäkter & skala', 'Från engångsprojekt till månadsarvode.', 7);

insert into lessons (module_id, title, video_path, sort_order)
select m.id, l.title, l.video_path, l.sort_order
from (values
  -- Modul 1 — Grunden: Bemästra Claude Code
  ('Grunden: Bemästra Claude Code', 'Vad Claude Code är och vad du kan tjäna pengar på', 'modul-1/lektion-1.mp4', 1),
  ('Grunden: Bemästra Claude Code', 'Installation & setup (terminal, konto, VS Code-tillägg)', 'modul-1/lektion-2.mp4', 2),
  ('Grunden: Bemästra Claude Code', 'Ditt första projekt — från prompt till färdig fil', 'modul-1/lektion-3.mp4', 3),
  ('Grunden: Bemästra Claude Code', 'Arbetsflödet: prompta, granska, iterera', 'modul-1/lektion-4.mp4', 4),
  ('Grunden: Bemästra Claude Code', 'Förstå filer & mappar (vad Claude faktiskt gör)', 'modul-1/lektion-5.mp4', 5),
  ('Grunden: Bemästra Claude Code', 'Git & GitHub — spara och versionera', 'modul-1/lektion-6.mp4', 6),
  ('Grunden: Bemästra Claude Code', 'Publicera live med Netlify', 'modul-1/lektion-7.mp4', 7),
  ('Grunden: Bemästra Claude Code', 'Felsökning & vanliga nybörjarmisstag', 'modul-1/lektion-8.mp4', 8),

  -- Modul 2 — Tjänst: Bygg hemsidor åt företag
  ('Tjänst: Bygg hemsidor åt företag', 'Vilka sidor lokala företag betalar för', 'modul-2/lektion-1.mp4', 1),
  ('Tjänst: Bygg hemsidor åt företag', 'Ta fram en design snabbt (mall)', 'modul-2/lektion-2.mp4', 2),
  ('Tjänst: Bygg hemsidor åt företag', 'Bygg en företagssida från grunden', 'modul-2/lektion-3.mp4', 3),
  ('Tjänst: Bygg hemsidor åt företag', 'Säljande text för kundens bransch', 'modul-2/lektion-4.mp4', 4),
  ('Tjänst: Bygg hemsidor åt företag', 'Bilder & logga', 'modul-2/lektion-5.mp4', 5),
  ('Tjänst: Bygg hemsidor åt företag', 'Kontaktformulär & bokning', 'modul-2/lektion-6.mp4', 6),
  ('Tjänst: Bygg hemsidor åt företag', 'Mobilanpassning', 'modul-2/lektion-7.mp4', 7),
  ('Tjänst: Bygg hemsidor åt företag', 'Domän & publicering på kundens domän', 'modul-2/lektion-8.mp4', 8),
  ('Tjänst: Bygg hemsidor åt företag', 'Din återanvändbara mall för varje ny kund', 'modul-2/lektion-9.mp4', 9),
  ('Tjänst: Bygg hemsidor åt företag', 'Leverans & överlämning', 'modul-2/lektion-10.mp4', 10),

  -- Modul 3 — Tjänst: Automatiseringar
  ('Tjänst: Automatiseringar', 'Vad automatiseringar är värda för ett företag', 'modul-3/lektion-1.mp4', 1),
  ('Tjänst: Automatiseringar', 'Vanligaste automationerna (mejl, bokning, offert, uppföljning)', 'modul-3/lektion-2.mp4', 2),
  ('Tjänst: Automatiseringar', 'Verktygen (Make/Zapier/n8n + Claude)', 'modul-3/lektion-3.mp4', 3),
  ('Tjänst: Automatiseringar', 'Bygg din första automation', 'modul-3/lektion-4.mp4', 4),
  ('Tjänst: Automatiseringar', 'Formulär → mejl/CRM', 'modul-3/lektion-5.mp4', 5),
  ('Tjänst: Automatiseringar', 'AI-chatbot/kundsvar åt kund', 'modul-3/lektion-6.mp4', 6),
  ('Tjänst: Automatiseringar', 'Paketera automation som tjänst', 'modul-3/lektion-7.mp4', 7),
  ('Tjänst: Automatiseringar', 'Testa & lämna över', 'modul-3/lektion-8.mp4', 8),

  -- Modul 4 — Tjänst: Grafiskt content
  ('Tjänst: Grafiskt content', 'Vad företag behöver (logga, inlägg, annonser)', 'modul-4/lektion-1.mp4', 1),
  ('Tjänst: Grafiskt content', 'AI-bildverktygen — översikt', 'modul-4/lektion-2.mp4', 2),
  ('Tjänst: Grafiskt content', 'Skapa en logotyp', 'modul-4/lektion-3.mp4', 3),
  ('Tjänst: Grafiskt content', 'Social media-content i serie', 'modul-4/lektion-4.mp4', 4),
  ('Tjänst: Grafiskt content', 'Enhetlig grafisk profil', 'modul-4/lektion-5.mp4', 5),
  ('Tjänst: Grafiskt content', 'Snabbt content-flöde (batch)', 'modul-4/lektion-6.mp4', 6),
  ('Tjänst: Grafiskt content', 'Leverera filer proffsigt', 'modul-4/lektion-7.mp4', 7),

  -- Modul 5 — Tjänst: SEO för företag
  ('Tjänst: SEO för företag', 'Vad SEO är och varför lokala företag betalar', 'modul-5/lektion-1.mp4', 1),
  ('Tjänst: SEO för företag', 'Sökordsanalys med AI', 'modul-5/lektion-2.mp4', 2),
  ('Tjänst: SEO för företag', 'On-page SEO på sidan du byggt', 'modul-5/lektion-3.mp4', 3),
  ('Tjänst: SEO för företag', 'Google Business-profil', 'modul-5/lektion-4.mp4', 4),
  ('Tjänst: SEO för företag', 'Lokalt SEO (synas i sin stad)', 'modul-5/lektion-5.mp4', 5),
  ('Tjänst: SEO för företag', 'Bloggartiklar/innehåll med Claude', 'modul-5/lektion-6.mp4', 6),
  ('Tjänst: SEO för företag', 'Mät resultat & visa kunden värdet', 'modul-5/lektion-7.mp4', 7),
  ('Tjänst: SEO för företag', 'SEO som månadstjänst', 'modul-5/lektion-8.mp4', 8),

  -- Modul 6 — Hitta & landa kunder
  ('Hitta & landa kunder', 'Din affär: vem är kunden, vad säljer du', 'modul-6/lektion-1.mp4', 1),
  ('Hitta & landa kunder', 'Kundlistor — hitta bolag att kontakta', 'modul-6/lektion-2.mp4', 2),
  ('Hitta & landa kunder', 'Bygg din lista (lokalt eller hela landet)', 'modul-6/lektion-3.mp4', 3),
  ('Hitta & landa kunder', 'Hitta rätt beslutsfattare', 'modul-6/lektion-4.mp4', 4),
  ('Hitta & landa kunder', 'Första kontakten (mejl/DM/samtal som får svar)', 'modul-6/lektion-5.mp4', 5),
  ('Hitta & landa kunder', 'Pitchen: sälj resultat, inte kod', 'modul-6/lektion-6.mp4', 6),
  ('Hitta & landa kunder', 'Hantera invändningar', 'modul-6/lektion-7.mp4', 7),
  ('Hitta & landa kunder', 'Prissättning & offert', 'modul-6/lektion-8.mp4', 8),
  ('Hitta & landa kunder', 'Stäng affären', 'modul-6/lektion-9.mp4', 9),

  -- Modul 7 — Återkommande intäkter & skala
  ('Återkommande intäkter & skala', 'Från engångsprojekt till månadsarvode', 'modul-7/lektion-1.mp4', 1),
  ('Återkommande intäkter & skala', 'Paketera underhåll + SEO + content som abonnemang', 'modul-7/lektion-2.mp4', 2),
  ('Återkommande intäkter & skala', 'Prissätt återkommande tjänster', 'modul-7/lektion-3.mp4', 3),
  ('Återkommande intäkter & skala', 'Leverera effektivt (mallar & system)', 'modul-7/lektion-4.mp4', 4),
  ('Återkommande intäkter & skala', 'Fakturering & det praktiska (privatperson → bolag)', 'modul-7/lektion-5.mp4', 5),
  ('Återkommande intäkter & skala', 'Skala: fler kunder utan mer tid', 'modul-7/lektion-6.mp4', 6),
  ('Återkommande intäkter & skala', 'Nästa steg: bygg din egen byrå', 'modul-7/lektion-7.mp4', 7)
) as l(module_title, title, video_path, sort_order)
join modules m on m.title = l.module_title;

-- Not: "Kundlistor — hitta bolag att kontakta" (Modul 6, lektion 2) är där du
-- lär ut ditt kundjaktsverktyg. Håll landningssidans copy till utfallet
-- ("färdiga kundlistor"), inte mekaniken — se avsnitt 14 i handoff-planen.
