-- ============================================================
-- HISWA-RECRON Supabase Migration
-- Table: roles, scenarios, scenario_options, aggregate_stats
-- ============================================================

-- 1. Roles table
create table if not exists roles (
  id text primary key,
  title text not null,
  category text not null default '',
  icon text default 'Briefcase',
  badge_color text default 'navy',
  short_description text not null default '',
  full_description text default '',
  key_skills text[] default '{}',
  career_path text default '',
  salary_range text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Scenarios table
create table if not exists scenarios (
  id text primary key,
  time_of_day text not null,
  location text not null,
  title text not null,
  description text not null default '',
  difficulty text default 'easy' check (difficulty in ('easy', 'medium', 'hard')),
  correct_role_id text references roles(id) on delete set null,
  feedback_text text default '',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Scenario options table
create table if not exists scenario_options (
  id uuid default gen_random_uuid() primary key,
  scenario_id text references scenarios(id) on delete cascade not null,
  role_id text references roles(id) on delete set null,
  label text not null,
  is_correct boolean default false,
  sort_order int default 0
);

-- 4. Aggregate stats table (anonymous counters)
create table if not exists aggregate_stats (
  id uuid default gen_random_uuid() primary key,
  event_type text not null,
  event_data jsonb default '{}',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_scenario_options_scenario_id on scenario_options(scenario_id);
create index if not exists idx_scenario_options_role_id on scenario_options(role_id);
create index if not exists idx_aggregate_stats_event_type on aggregate_stats(event_type);
create index if not exists idx_aggregate_stats_created_at on aggregate_stats(created_at);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table roles enable row level security;
alter table scenarios enable row level security;
alter table scenario_options enable row level security;
alter table aggregate_stats enable row level security;

create policy "Public read roles" on roles for select using (true);
create policy "Authenticated full access roles" on roles for all to authenticated using (true) with check (true);

create policy "Public read active scenarios" on scenarios for select using (is_active = true);
create policy "Authenticated full access scenarios" on scenarios for all to authenticated using (true) with check (true);

create policy "Public read scenario options" on scenario_options for select using (true);
create policy "Authenticated full access scenario options" on scenario_options for all to authenticated using (true) with check (true);

create policy "Anon insert aggregate stats" on aggregate_stats for insert with check (true);
create policy "Authenticated read aggregate stats" on aggregate_stats for select to authenticated using (true);

-- ============================================================
-- Seed: 16 Roles (synced with src/content/roles/*.json)
-- ============================================================

insert into roles (id, title, category, icon, badge_color, short_description, full_description, key_skills, career_path, salary_range) values
('receptionist', 'Frontoffice & Gastvrijheid Coordinator', 'Gastvrijheid & Service', 'Users', 'cyan', 'Jij bent het visitekaartje van het vakantiepark of het watersportcentrum.', 'Als Frontoffice Coordinator ben jij de spin in het web. Je verwelkomt gasten, lost direct vragen of problemen op, spreekt meerdere talen en zorgt dat iedereen zich direct thuis voelt.', '{"Mensenkennis","Stressbestendig","Communicatie","Talenkennis"}', 'MBO Niveau 3/4 Gastheer/Gastvrouw -> Receptie Chef -> Park Manager', '€ 2.200 - € 3.200 / maand'),
('bootmonteur', 'Jacht & Maritiem Technicus', 'Techniek & Jachtbouw', 'Wrench', 'amber', 'Jij houdt motoren, zeiljachten en elektrische boten in topconditie.', 'Als Maritiem Technicus ben je gek op sleutelen en innovatie. Je onderhoudt inboard motoren, installeert de nieuwste navigatie-elektronica en bereidt jachten voor op het vaarseizoen.', '{"Motoronderhoud","Elektrotechniek","Problem Solving","Sleutelen"}', 'MBO Niveau 3/4 Eerste E-Technicus Onboard -> Chef Werkplaats -> Marina Eigenaar', '€ 2.400 - € 3.800 / maand'),
('marketing', 'Recreatie & Content Marketeer', 'Media & Commercie', 'Camera', 'purple', 'Jij bedenkt toffe TikToks, campagnes en promoties voor het park of watersportbedrijf.', 'Als Content Marketeer breng je het vakantiegevoel tot leven. Je maakt visuals van zonsondergangen op het water, beheert social media en zorgt dat alle chalets en huurboten volgeboekt zijn.', '{"Social Media","Video Editing","Creativiteit","Copywriting"}', 'VMBO/MBO Marketing & Communication -> Content Creator -> Brand Specialist', '€ 2.300 - € 3.400 / maand'),
('animator', 'Belevings & Outdoor Entertainment Coach', 'Sport & Entertainment', 'Sparkles', 'emerald', 'Jij maakt de vakantie onvergetelijk voor jong en oud met sport, spel en shows.', 'Als Outdoor Entertainment Coach organiseer je suppen, kampvuren, schatzoeken en avondshows. Je hebt eindeloos veel energie en weet van elk moment een feest te maken.', '{"Presenteren","Sport & Spel","Enthousiasme","Leiderschap"}', 'MBO Sport & Bewegen / CIOS -> Hoofd Animatie -> Event Manager', '€ 2.100 - € 3.000 / maand'),
('hafenmeister', 'Havenmeester & Logistiek Coordinator', 'Nautisch & Logistiek', 'Anchor', 'blue', 'Jij regelt de ligplaatsen, de veiligheid op het water en het aanmeren van jachten.', 'Als Havenmeester ben je de baas van de jachthaven. Je wijst schepen hun ligplaats toe, houdt de steigers veilig, assisteert bij stormweer en zorgt voor milieuvriendelijk waterbeheer.', '{"Nautisch inzicht","Daadkracht","Klantvriendelijk","Veiligheid"}', 'MBO Binnenvaart / Maritiem -> Eerste Havenmeester -> Jachthaven Manager', '€ 2.400 - € 3.600 / maand'),
('camping_manager', 'Park & Recreatie Manager', 'Management & Strategie', 'Briefcase', 'rose', 'Jij stuurt het hele team aan en zorgt dat het recreatiebedrijf groeit en bloeit.', 'Als Park Manager zorg je dat alle afdelingen (techniek, horeca, receptie, groenvoorziening) als een geoliede machine samenwerken. Je bent verantwoordelijk voor de gasttevredenheid en duurzaamheid.', '{"Leiderschap","Financieel inzicht","Overzicht","Ondernemerschap"}', 'MBO 4 / HBO Recreatie & Tourism Management -> Assistent Manager -> Park Directeur', '€ 3.000 - € 5.000 / maand'),
('zwembadtechnicus', 'Zwembad & Waterkwaliteit Technicus', 'Facilitair & Techniek', 'Wrench', 'cyan', 'Jij zorgt dat het zwembad en de waterglijbanen 100% veilig en schoon zijn.', 'Als Zwembadtechnicus beheer je de geavanceerde filter- en pompsystemen van het subtropisch zwemparadijs en het zwemmeer. Je test dagelijks de pH-waarden en lost storingen op aan glijbanen.', '{"Waterchemie","Pomptechniek","Veiligheid","Storingen Oplossen"}', 'MBO Niveau 3/4 Installatietechniek -> Chef Technische Dienst', '€ 2.350 - € 3.400 / maand'),
('hovenier', 'Tuinman & Groenbeheerder', 'Buitenruimte & Natuur', 'Compass', 'emerald', 'Jij houdt het park prachtig groen, duurzaam en bloeiend.', 'Als Groenbeheerder ben je verantwoordelijk voor de uitstraling van het park. Je plant inheemse bomen, onderhoudt de kampeervelden, legt natuurspeeltuinen aan en bevordert de biodiversiteit.', '{"Plantkennis","Machinebediening","Natuurbeheer","Fysiek Actief"}', 'VMBO Groen -> MBO Niveau 3/4 Hovenier -> Hoofd Groenbeheer', '€ 2.200 - € 3.100 / maand'),
('zeilinstructeur', 'Zeil & Watersport Instructeur', 'Marina & Watersport', 'Anchor', 'blue', 'Jij leert jong en oud veilig zeilen, windsurfen en suppen.', 'Als Zeilinstructeur geef je gepassioneerd les op het water. Je weet precies hoe je wind en golven moet lezen, leert cursisten de juiste knopen en zorgt voor een onvergetelijke vaarervaring.', '{"CWI Diplomas","Leiderschap","Waterveiligheid","Geduld"}', 'MBO Sport & Bewegen / CIOS -> Eerste Zeilinstructeur -> Zeilschool Manager', '€ 2.150 - € 3.100 / maand'),
('kok', 'Horeca Chef & Kook Specialist', 'Food & Beverage', 'Briefcase', 'orange', 'Jij kookt heerlijke streekgerechten voor honderden hongerige parkgasten.', 'Als Park Kok bereid je heerlijke maaltijden in het strandpaviljoen of restaurant. Van verse vissoep en streekproducten tot zonnige terrassnacks.', '{"Kooktechniek","HACCP Veiligheid","Stressbestendig","Creativiteit"}', 'VMBO Horeca -> MBO Niveau 3/4 Zelfstandig Werkend Kok -> Chef-Kok', '€ 2.300 - € 3.500 / maand'),
('gastenservice', 'Gastenservice Medewerker', 'Frontoffice & Gastencontact', 'Users', 'blue', 'Jij zorgt ervoor dat elke gast zich thuis voelt en alle vragen beantwoord worden.', 'Als Gastenservice medewerker help je gasten met al hun vragen en wensen tijdens hun verblijf. Van klachten oplossen tot activiteiten aanbevelen — jij bent het gezicht van het park.', '{"Communicatie","Empathie","Probleemoplossend","Meertalig"}', 'MBO Niveau 2-3 Toerisme & Recreatie -> Teamleider Gastenservice', '€ 2.100 - € 2.900 / maand'),
('socialmedia', 'Social Media Beheerder', 'Marketing & Sales', 'Camera', 'purple', 'Jij laat de wereld zien hoe geweldig ons park is via social media.', 'Als social media beheerder maak je aantrekkelijke content voor Instagram, TikTok en Facebook. Je fotografeert activiteiten, schrijft posts en reageert op comments van gasten.', '{"Creativiteit","Fotografie","Copywriting","Analytics"}', 'MBO Niveau 4 Media & Communicatie -> Marketing Specialist', '€ 2.200 - € 3.200 / maand'),
('evenementenplanner', 'Evenementenplanner', 'Marketing & Sales', 'Sparkles', 'amber', 'Jij organiseert onvergetelijke evenementen die gasten keer op keer laten terugkomen.', 'Van zomerfeesten tot watersportcompetities — jij plant en coordineert alle evenementen. Je werkt samen met externe leveranciers, animatieteams en de keuken.', '{"Planning","Coordinatie","Creatief denken","Budgetbeheer"}', 'MBO Niveau 4 Event Management -> Senior Evenementenmanager', '€ 2.400 - € 3.600 / maand'),
('technischdienst', 'Technisch Dienst Medewerker', 'Facilitair & Techniek', 'Wrench', 'orange', 'Jij houdt alle gebouwen, apparatuur en infrastructuur in perfecte staat.', 'Als technisch dienst medewerker repareer je kapotte apparatuur, fix je lekken, vervang je lampen en zorg je dat alles veilig en functioneel blijft.', '{"Technisch inzicht","Probleemoplossend","Handvaardigheid","Veiligheid"}', 'MBO Niveau 3 Installatietechniek -> Chef Technische Dienst', '€ 2.300 - € 3.200 / maand'),
('havenmeester', 'Havenmeester', 'Marina & Watersport', 'Anchor', 'blue', 'Jij regelt alle in- en uitvaarten en zorgt voor orde en veiligheid in de jachthaven.', 'Als havenmeester ben jij de baas van de jachthaven. Je wijst aanlegplaatsen toe, controleert veiligheidsprotocollen en bent het eerste aanspreekpunt voor bootgebruikers.', '{"Maritieme kennis","Communicatie","Veiligheid","Organisatie"}', 'MBO Niveau 3/4 Maritieme Techniek -> Havenbeheerder', '€ 2.500 - € 3.800 / maand'),
('parkmanager', 'Parkmanager', 'Management & Administratie', 'Briefcase', 'navy', 'Jij bent verantwoordelijk voor de totale bedrijfsvoering van het recreatiepark.', 'Als parkmanager stuur je alle afdelingen aan, bewaakt je de kwaliteit, regelt personeelszaken en zorgt dat het park winstgevend en gastvrij blijft in alle seizoenen.', '{"Leiderschap","Strategisch denken","Budgetbeheer","Klanttevredenheid"}', 'HBO Toerisme & Recreatiemanagement -> Directeur Recreatiebedrijf', '€ 3.500 - € 5.500 / maand')
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  icon = excluded.icon,
  badge_color = excluded.badge_color,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  key_skills = excluded.key_skills,
  career_path = excluded.career_path,
  salary_range = excluded.salary_range;
