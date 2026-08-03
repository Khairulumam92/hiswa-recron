-- ============================================================
-- HISWA-RECRON Seed Data: 15 Scenarios + Options
-- Copy-paste into Supabase SQL Editor & Run
-- ============================================================

-- Clean existing seed data (safe to re-run)
delete from scenario_options where scenario_id like 'S%';
delete from scenarios where id like 'S%';

insert into scenarios (id, time_of_day, location, title, description, difficulty, correct_role_id, feedback_text, is_active) values
('S001', '09:15 - Ochtend', 'Jachthaven Steiger B', 'Motorpech bij vertrek van een zeiljacht!', 'Een familie wil net uitvaren voor het weekend, maar de motor van hun huurjacht slaat steeds af en start niet meer. De gasten worden ongeduldig.', 'easy', 'bootmonteur', 'Super! De maritiem technicus vervangt het vuilfilter en de motor draait weer perfect!', true),
('S002', '11:30 - Ochtend', 'Frontoffice Receptie', 'Een internationale stroom gasten arriveert tegelijk!', 'Er arriveert een bus met 40 gasten uit Duitsland en Engeland. Er is verwarring over de sleutelafgifte en reserveringscodes.', 'easy', 'receptionist', 'Klasse! Binnen 5 minuten is iedereen gastvrij ingecheckt met hun sleutelkaart!', true),
('S003', '14:00 - Middag', 'Strand & Recreatiemeer', 'Jongeren vervelen zich op het strand!', 'Een groep jongeren hangt wat rond bij het meer en vraagt of er vanmiddag nog iets vets te doen is op het water of het strand.', 'medium', 'animator', 'Geweldig! Het SUP-toernooi is een gigantisch succes en iedereen doet enthousiast mee!', true),
('S004', '15:30 - Namiddag', 'Jachthaven Invarend Schip', 'Onverwachte zware windstoot bij het afmeren!', 'Een groot kajuitjacht komt binnen met windkracht 6. De schipper heeft moeite om schadevrij in de box te sturen.', 'medium', 'hafenmeister', 'Top! De havenmeester pakt het landvast professioneel aan en het jacht ligt veilig vast.', true),
('S005', '16:45 - Namiddag', 'Marketing & Content Office', 'Het zonnige weekend komt eraan maar er zijn nog 5 lodges vrij!', 'Er wordt fantastisch zomers weer voorspeld voor het komende weekend. De bezetting kan naar 100% als er nu actie wordt ondernomen.', 'medium', 'marketing', 'Binnen 2 uur zijn alle 5 de vrije lodges volgeboekt dankzij de actie-video!', true),
('S006', '18:00 - Avond', 'Park Management Kantoor', 'Seizoensafsluiting en verduurzamingsplan presenteren!', 'Er is een strategisch overleg met investeerders en de gemeente over zonnepanelen op de chalets en uitbreiding van de elektrische vaarvloot.', 'hard', 'camping_manager', 'Uitstekend! De gemeente en investeerders stemmen enthousiast in met het uitbreidingsplan!', true),
('S007', '11:30 - Ochtend', 'Camping Receptie', 'Gasten weten niet waar hun bungalow is!', 'Een groot gezin arriveert bij de receptie. Ze hebben een reservering maar weten niet waar bungalow 47 is en de route op het park is onduidelijk.', 'easy', 'receptionist', 'Precies! De receptionist checkt ze in en wijst de weg — het gezin loopt blij naar hun bungalow!', true),
('S008', '14:00 - Middag', 'Subtropisch Zwembad', 'Het zwembad heeft een pH-probleem!', 'De waterteststicker in het zwembad toont een abnormale pH-waarde. Het water ruikt naar chloor en gasten klagen over rode ogen.', 'medium', 'zwembadtechnicus', 'Goed zo! De zwembadtechnicus past de waterchemie aan — het zwembad is binnen een uur weer perfect!', true),
('S009', '16:30 - Middag', 'Parkrestaurant', 'Het restaurant is overbezet vanavond!', 'Een groep van 30 mensen heeft spontaan gereserveerd voor vanavond. De keuken heeft extra handen nodig voor de voedselbereiding.', 'easy', 'kok', 'Lekker! De kok zorgt voor een perfecte maaltijd — gasten zijn super tevreden!', true),
('S010', '09:00 - Ochtend', 'Kinderclub', 'Kinderen verveeld op een regenachtige dag!', 'Het regent buiten en de kinderclub zit vol met verveelde kinderen van 6-12 jaar. Ze hebben activiteiten nodig.', 'easy', 'animator', 'Geweldig! De animator organiseert een toffe knutselworkshop — kinderen zijn dolblij!', true),
('S011', '13:00 - Middag', 'Camping Terreinen', 'De bloembedden zien er verwaarloosd uit!', 'Een groep gasten klaagt bij de receptie dat de entree van het camping er slonzig uitziet. De bloemen zijn verdord en het gras is te hoog.', 'easy', 'hovenier', 'Prachtig! De hovenier plant nieuwe bloemen — de ingang ziet er weer top uit!', true),
('S012', '15:30 - Middag', 'Jachthaven Kantoor', 'Een zeilboot heeft beschadigde apparatuur!', 'Een huurzeilboot is teruggekomen met een beschadigd roer. De volgende huurder vertrekt over twee uur.', 'medium', 'bootmonteur', 'Super! De bootmonteur repareert het roer op tijd — de volgende huurder kan vertrekken!', true),
('S013', '10:00 - Ochtend', 'Marketing Kantoor', 'De zomercampagne moet live!', 'De zomerboekingen lopen achter bij vorig jaar. Het management vraagt om een aantrekkelijke social media campagne voor het weekend.', 'medium', 'marketing', 'Top! De marketing medewerker lanceert een toffe campagne — boekingen stijgen direct!', true),
('S014', '17:00 - Middag', 'Haven Steiger A', 'Drukte bij de aanmeerplaatsen!', 'Vijf boten willen tegelijkertijd aanmeren maar er is maar ruimte voor drie. De situatie wordt chaotisch op de steiger.', 'hard', 'hafenmeister', 'Uitstekend! De havenmeester regelt alles efficiënt — alle boten liggen veilig aangemeerd!', true),
('S015', '08:30 - Ochtend', 'Parkmanagement', 'Drie medewerkers zijn ziek gemeld!', 'Deze ochtend zijn er drie medewerkers uitgevallen door ziekte. De dag staat vol met activiteiten en het is hoogseizoen.', 'hard', 'camping_manager', 'Perfect! De parkmanager regelt snel vervanging — het park draait gewoon op volle toeren!', true)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  difficulty = excluded.difficulty,
  correct_role_id = excluded.correct_role_id,
  feedback_text = excluded.feedback_text,
  is_active = excluded.is_active;

-- ============================================================
-- Seed Data: 56 Scenario Options (4 per scenario, S008 & S011 & S013 have 3)
-- ============================================================

insert into scenario_options (scenario_id, role_id, label, is_correct, sort_order) values
-- S001
('S001', 'bootmonteur', 'Jacht & Maritiem Technicus inschakelen met de gereedschapskist', true, 0),
('S001', 'marketing', 'Een TikTok maken over de prachtige haven', false, 1),
('S001', 'animator', 'De familie uitnodigen voor de kinderdisco', false, 2),
('S001', 'receptionist', 'Nieuwe sleutels geven voor een chalet op het land', false, 3),
-- S002
('S002', 'receptionist', 'Frontoffice & Gastvrijheid Coordinator die snel en vriendelijk in het Duits/Engels de incheck stroomlijnt', true, 0),
('S002', 'bootmonteur', 'De motorolie van de reddingsboot controleren', false, 1),
('S002', 'hafenmeister', 'Iedereen naar een ligplaats aan de steiger sturen', false, 2),
('S002', 'animator', 'Direct starten met een speurtocht', false, 3),
-- S003
('S003', 'animator', 'Outdoor Entertainment Coach die direct een SUP-Rally en Beachvolley toernooi opzet', true, 0),
('S003', 'bootmonteur', 'Sleutels en schroevendraaiers uitdelen', false, 1),
('S003', 'receptionist', 'Vragen of ze stil willen zijn in de lobby', false, 2),
('S003', 'hafenmeister', 'Hun zwemkleding controleren op maritieme regels', false, 3),
-- S004
('S004', 'hafenmeister', 'Havenmeester die via marifoon en op de steiger de lijnen opvangt en de box toewijst', true, 0),
('S004', 'marketing', 'Een Instagram-story maken van de zware wind', false, 1),
('S004', 'animator', 'Een microfoon pakken en een liedje zingen', false, 2),
('S004', 'camping_manager', 'Een jaarplan schrijven voor volgend jaar', false, 3),
-- S005
('S005', 'marketing', 'Recreatie Marketeer die een actie-campagne en toffe sfeervideo lanceert op TikTok & Insta', true, 0),
('S005', 'bootmonteur', 'Nieuwe schroeven bestellen voor de motorboot', false, 1),
('S005', 'hafenmeister', 'De steigers nogmaals schoonspuiten', false, 2),
('S005', 'receptionist', 'Wachten tot er iemand toevallig langsloopt', false, 3),
-- S006
('S006', 'camping_manager', 'Park Manager die de toekomstvisie en duurzaamheidsprojecten overtuigend presenteert', true, 0),
('S006', 'animator', 'Bingokaarten uitdelen aan de investeerders', false, 1),
('S006', 'bootmonteur', 'Koffie halen en de bootaccu laten zien', false, 2),
('S006', 'receptionist', 'Sleutelhangers weggeven als souvenir', false, 3),
-- S007
('S007', 'receptionist', 'Receptionist met de plattegrond', true, 0),
('S007', 'hovenier', 'Hovenier die het gras maait', false, 1),
('S007', 'kok', 'Kok uit het restaurant', false, 2),
('S007', 'animator', 'Animator van het kinderprogramma', false, 3),
-- S008
('S008', 'zwembadtechnicus', 'Zwembadtechnicus met meetapparatuur', true, 0),
('S008', 'receptionist', 'Receptionist om gasten te informeren', false, 1),
('S008', 'camping_manager', 'Parkmanager om te beslissen', false, 2),
-- S009
('S009', 'kok', 'Kok om extra maaltijden te bereiden', true, 0),
('S009', 'marketing', 'Marketing medewerker voor promotie', false, 1),
('S009', 'zeilinstructeur', 'Zeilinstructeur van de haven', false, 2),
('S009', 'hovenier', 'Hovenier om het terras te versieren', false, 3),
-- S010
('S010', 'animator', 'Animator met spelletjes en activiteiten', true, 0),
('S010', 'bootmonteur', 'Bootmonteur met technisch gereedschap', false, 1),
('S010', 'camping_manager', 'Parkmanager voor overleg', false, 2),
('S010', 'hafenmeister', 'Havenmeester van de marina', false, 3),
-- S011
('S011', 'hovenier', 'Hovenier met snoeischaar en gieter', true, 0),
('S011', 'marketing', 'Marketing voor betere foto''s op Instagram', false, 1),
('S011', 'kok', 'Kok om een ontbijt aan te bieden', false, 2),
-- S012
('S012', 'bootmonteur', 'Bootmonteur met reparatiegereedschap', true, 0),
('S012', 'hafenmeister', 'Havenmeester voor noodprocedures', false, 1),
('S012', 'zeilinstructeur', 'Zeilinstructeur om de schade te beoordelen', false, 2),
('S012', 'receptionist', 'Receptionist om de klant te bellen', false, 3),
-- S013
('S013', 'marketing', 'Marketing medewerker met campagne-ideeën', true, 0),
('S013', 'camping_manager', 'Parkmanager om aanbiedingen te maken', false, 1),
('S013', 'receptionist', 'Receptionist die klanten belt', false, 2),
-- S014
('S014', 'hafenmeister', 'Havenmeester om de aanmeerplaatsen te regelen', true, 0),
('S014', 'zeilinstructeur', 'Zeilinstructeur om te helpen manoeuvreren', false, 1),
('S014', 'bootmonteur', 'Bootmonteur om touwen vast te maken', false, 2),
('S014', 'receptionist', 'Receptionist om reserveringen te checken', false, 3),
-- S015
('S015', 'camping_manager', 'Parkmanager om de bezetting te regelen', true, 0),
('S015', 'animator', 'Animator om extra taken op te pakken', false, 1),
('S015', 'receptionist', 'Receptionist om collega''s te bellen', false, 2),
('S015', 'marketing', 'Marketing voor een oproep op social media', false, 3);
