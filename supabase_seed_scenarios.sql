-- ============================================================
-- HISWA-RECRON Seed Data: 25 Scenarios + Options
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

-- S016
insert into scenarios (id, time_of_day, location, title, description, difficulty, correct_role_id, feedback_text, is_active) values
('S016', '10:30 - Ochtend', 'Receptie', 'Een gast is zijn portemonnee kwijt!', 'Een gast belt in paniek vanaf het strand — zijn portemonnee is verdwenen. Hij weet niet bij wie hij moet zijn.', 'easy', 'gastenservice', 'Top! De gastenservice medewerker vindt de portemonnee bij gevonden voorwerpen en de gast is dolgelukkig!', true),
('S017', '13:30 - Middag', 'Social Media Kantoor', 'Een viral TikTok is nodig voor het weekend!', 'De marketingafdeling merkt dat de jonge doelgroep afhaakt op social media. Er moet snel een nieuwe trend gestart worden.', 'medium', 'socialmedia', 'Perfect! De TikTok-tour gaat viral en het park wordt door Gen-Z ontdekt!', true),
('S018', '15:00 - Namiddag', 'Evenementenhal', 'De zomeravondmarkt moet in twee dagen opgezet worden!', 'Een grote zomeravondmarkt met 40 kramen, live muziek en foodtrucks moet overmorgen plaatsvinden. De voorbereidingen zijn nog niet gestart.', 'medium', 'evenementenplanner', 'Fantastisch! De evenementenplanner regelt alles op tijd — de zomeravondmarkt is een groot succes!', true),
('S019', '08:15 - Ochtend', 'Technisch Magazijn', 'De waterpomp van het park is uitgevallen!', 'De hoofdpomp die alle bungalows van water voorziet is plotseling gestopt. Gasten kunnen niet douchen en het is hoogseizoen.', 'medium', 'technischdienst', 'Uitstekend! De technisch dienst vindt een gebarsten afdichtring en de waterpomp draait weer op volle kracht!', true),
('S020', '11:00 - Ochtend', 'Jachthaven Brug', 'Een brugdefect blokkeert de doorvaart!', 'De ophaalbrug bij de jachthaven weigert open te gaan. Vijf boten liggen te wachten aan beide kanten en de schippers worden ongeduldig.', 'hard', 'havenmeester', 'Perfect! De havenmeester activeert het noodprotocol en regelt via de marifoon een alternatieve route — alle boten kunnen doorvaren!', true),
('S021', '14:00 - Middag', 'Zeilschool', 'Cursisten willen hun eerste solo-zeiltocht maken!', 'Een groep van 8 cursisten heeft net hun theorie gehaald en wil vanmiddag solo oefenen. De omstandigheden zijn ideaal maar de veiligheid moet 100% gegarandeerd zijn.', 'medium', 'zeilinstructeur', 'Geweldig! De zeilinstructeur geeft de briefing en alle cursisten maken een veilige, onvergetelijke solo-tocht!', true),
('S022', '16:45 - Namiddag', 'Park Management Kantoor', 'De jaarverslag moet naar de ledencommissie!', 'De ledencommissie van HISWA-RECRON komt morgen op bezoek. Het financiele jaarverslag en de bezettingscijfers moeten perfect gepresenteerd worden.', 'hard', 'parkmanager', 'Perfect! De parkmanager presenteert de cijfers met vertrouwen en de commissie is onder de indruk van de strategische plannen!', true),
('S023', '09:30 - Ochtend', 'Camping Receptie', 'Een camper is vastgelopen in de modder!', 'Na een nacht regen is het terrein drassig geworden. Een grote camper is vastgelopen op veld 12 en blokkeert de weg voor andere gasten.', 'medium', 'hovenier', 'Top! De hovenier trekt de camper los met de trekker — de weg is weer vrij en de camping draait verder!', true),
('S024', '12:30 - Middag', 'Restaurant Terras', 'Een recensent van een reismagazine dineert vanavond!', 'Een bekende restaurant-recensent heeft gereserveerd voor vanavond. Alles aan de service en het menu moet perfect zijn.', 'hard', 'kok', 'Uitstekend! De recensent is diep onder de indruk van het menu en schrijft een lovende recensie!', true),
('S025', '07:30 - Ochtend', 'Zwembad Entree', 'De chlooropslag is bijna leeg en het is weekend!', 'Het is zaterdagochtend en de chloorvoorraad voor het subtropisch zwembad is bijna op. De leverancier is gesloten in het weekend.', 'medium', 'zwembadtechnicus', 'Perfect! De zwembadtechnicus regelt een noodvoorraad en het zwembad blijft open — het weekend is gered!', true);

-- New scenario options (10 scenarios x 4 options each)
insert into scenario_options (scenario_id, role_id, label, is_correct, sort_order) values
-- S016
('S016', 'gastenservice', 'Gastenservice medewerker die de gast kalmeert en de gevonden voorwerpen checkt', true, 0),
('S016', 'bootmonteur', 'Bootmonteur die het strand afzoekt met een schroevendraaier', false, 1),
('S016', 'hovenier', 'Hovenier die de bloembedden omploegt voor de portemonnee', false, 2),
('S016', 'animator', 'Animator die een zoektocht voor kinderen organiseert', false, 3),
-- S017
('S017', 'socialmedia', 'Social Media Beheerder die een snelle behind-the-scenes tour video maakt voor TikTok', true, 0),
('S017', 'kok', 'Kok die een kookvideo opneemt in de keuken', false, 1),
('S017', 'receptionist', 'Receptionist die flyers print voor de ingang', false, 2),
('S017', 'zwembadtechnicus', 'Zwembadtechnicus die de waterstand meet', false, 3),
-- S018
('S018', 'evenementenplanner', 'Evenementenplanner die alle leveranciers belt en de logistiek opzet', true, 0),
('S018', 'hovenier', 'Hovenier die extra planten neerzet op het terrein', false, 1),
('S018', 'zeilinstructeur', 'Zeilinstructeur die een zeilwedstrijd voorstelt als vervanging', false, 2),
('S018', 'technischdienst', 'Technisch dienst die lampen vervangt in de toiletten', false, 3),
-- S019
('S019', 'technischdienst', 'Technisch Dienst medewerker die de pomp demonteert en het lek vindt', true, 0),
('S019', 'marketing', 'Marketing medewerker die een noodbericht plaatst op Facebook', false, 1),
('S019', 'kok', 'Kok die flessen water uitdeelt in het restaurant', false, 2),
('S019', 'gastenservice', 'Gastenservice die alle bungalows belt met een update', false, 3),
-- S020
('S020', 'havenmeester', 'Havenmeester die de noodprocedure start en de monteur van de brugbeheerder belt', true, 0),
('S020', 'hafenmeister', 'Hafenmeister die alternatieve ligplaatsen in de andere haven regelt', false, 1),
('S020', 'zeilinstructeur', 'Zeilinstructeur die de boten aanmeert aan de wal', false, 2),
('S020', 'receptionist', 'Receptionist die koffie brengt naar de wachtende schippers', false, 3),
-- S021
('S021', 'zeilinstructeur', 'Zeilinstructeur die de cursisten indeelt, de briefing geeft en de escort boot klaarmaakt', true, 0),
('S021', 'bootmonteur', 'Bootmonteur die extra brandstof bijvult in alle boten', false, 1),
('S021', 'animator', 'Animator die een strandpuzzeltocht organiseert als alternatief', false, 2),
('S021', 'hafenmeister', 'Hafenmeister die alle steigers afzet met lint', false, 3),
-- S022
('S022', 'parkmanager', 'Parkmanager die het jaarverslag presenteert met strategische aanbevelingen voor volgend seizoen', true, 0),
('S022', 'receptionist', 'Receptionist die een welkomstpakket klaarlegt voor de commissie', false, 1),
('S022', 'socialmedia', 'Social Media beheerder die een Instagram story maakt van de commissie', false, 2),
('S022', 'hovenier', 'Hovenier die de parkeerplaats versiert met bloemen', false, 3),
-- S023
('S023', 'hovenier', 'Hovenier die met de trekker en sleepkabel de camper lostrekt', true, 0),
('S023', 'receptionist', 'Receptionist die de gasten een gratis upgrade aanbiedt', false, 1),
('S023', 'kok', 'Kok die soep brengt naar de gestrande camper', false, 2),
('S023', 'animator', 'Animator die een spelletje organiseert bij de camper', false, 3),
-- S024
('S024', 'kok', 'Kok die een speciaal driegangenmenu maakt met lokale streekproducten', true, 0),
('S024', 'marketing', 'Marketing die een persbericht opstelt over het bezoek', false, 1),
('S024', 'hovenier', 'Hovenier die verse bloemen op tafel zet', false, 2),
('S024', 'gastenservice', 'Gastenservice die het tafellinnen verwisselt', false, 3),
-- S025
('S025', 'zwembadtechnicus', 'Zwembadtechnicus die de dosering aanpast en een noodvoorraad uit het naastgelegen park leent', true, 0),
('S025', 'receptionist', 'Receptionist die een rood lint spant voor het zwembad', false, 1),
('S025', 'camping_manager', 'Parkmanager die het zwembad sluit tot maandag', false, 2),
('S025', 'animator', 'Animator die waterspelletjes in het meer organiseert', false, 3);
