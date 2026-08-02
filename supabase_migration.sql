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

-- Public/anonymous: read-only for roles, read-active for scenarios
create policy "Public read roles" on roles for select using (true);
create policy "Authenticated full access roles" on roles for all to authenticated using (true) with check (true);

create policy "Public read active scenarios" on scenarios for select using (is_active = true);
create policy "Authenticated full access scenarios" on scenarios for all to authenticated using (true) with check (true);

create policy "Public read scenario options" on scenario_options for select using (true);
create policy "Authenticated full access scenario options" on scenario_options for all to authenticated using (true) with check (true);

-- Anonymous insert for game analytics, authenticated read for admin dashboard
create policy "Anon insert aggregate stats" on aggregate_stats for insert with check (true);
create policy "Authenticated read aggregate stats" on aggregate_stats for select to authenticated using (true);

-- ============================================================
-- Seed Data: Existing roles from src/content/roles/
-- ============================================================

insert into roles (id, title, category, icon, badge_color, short_description, full_description, key_skills, career_path, salary_range) values
('receptionist', 'Receptionist', 'Frontoffice & Gastencontact', 'Users', 'navy', 'Jij bent het eerste gezicht dat gasten zien — en zorgt dat ze zich meteen welkom voelen.', 'Als receptionist ben jij het hart van het park. Je checkt gasten in, beantwoordt vragen, lost kleine problemen op en zorgt dat iedereen weet waar ze moeten zijn. Geen dag is hetzelfde.', '{"Communicatie","Probleemoplossend","Geduldig","Organisatie"}', 'vmbo → mbo Toerisme & Recreatie niveau 2-3', '€ 2.000 - € 2.800'),
('bootmonteur', 'Bootmonteur', 'Marina & Watersport', 'Wrench', 'navy', 'Jij zorgt dat boten en jachten altijd vaarklaar zijn — van kleine reparatie tot groot onderhoud.', 'Als bootmonteur werk je in de haven of jachtservice. Je repareert motoren, vervangt onderdelen en zorgt dat alles veilig is. Elk seizoen brengt nieuwe uitdagingen: van winterklaar maken tot zomerpiek.', '{"Technisch inzicht","Precisie","Probleemoplossend","Handvaardigheid"}', 'vmbo Techniek → mbo Maritieme Techniek niveau 3-4', '€ 2.500 - € 3.800'),
('marketing', 'Marketing Medewerker', 'Marketing & Sales', 'Megaphone', 'orange', 'Jij laat de wereld zien hoe leuk recreatie is — van social media tot campagnes.', 'Als marketing medewerker bedenk je campagnes, beheert sociale media en zorgt dat de camping of marina vol zit. Je combineert creativiteit met data.', '{"Creativiteit","Schrijfvaardigheid","Data-analyse","Social media"}', 'vmbo → mbo Marketing & Communicatie niveau 3-4', '€ 2.400 - € 3.500'),
('animator', 'Animator', 'Recreatie & Animatie', 'Celebration', 'orange', 'Jij maakt van elke vakantiedag een feest — van sport tot show.', 'Als animator organiseer je activiteiten voor gasten: sporttoernooien, kinderclub, avondshows. Je bent de energie van het park.', '{"Creativiteit","Energie","Presenteren","Flexibiliteit"}', 'vmbo → mbo Sport & Recreatie niveau 2-3', '€ 1.800 - € 2.600'),
('hafenmeister', 'Hafenmeister', 'Marina & Watersport', 'Anchor', 'navy', 'Jij bent de havenmeester — regelt aanlegplaatsen, begeleidt boten en houdt de haven veilig.', 'Als hafenmeister ben je verantwoordelijk voor de dagelijkse operatie van de haven. Je wijst ligplaatsen toe, controleert boten en helpt schippers.', '{"Communicatie","Organisatie","Waterkennis","Gastvrijheid"}', 'vmbo → mbo Maritiem Officier niveau 3-4', '€ 2.200 - € 3.200'),
('camping_manager', 'Camping Manager', 'Management & Administratie', 'Business', 'blue', 'Jij runt het hele park — van personeel tot gasttevredenheid.', 'Als camping manager ben je eindverantwoordelijk voor de dagelijkse operatie. Je stuurt teams aan, beheert budgetten en zorgt voor tevreden gasten.', '{"Leiderschap","Strategisch","Communicatie","Financieel"}', 'mbo Toerisme → HBO Hotel Management', '€ 3.500 - € 5.500'),
('zwembadtechnicus', 'Zwembadtechnicus', 'Facilitair & Techniek', 'Pool', 'cyan', 'Jij zorgt dat het zwembad veilig en schoon is — waterkwaliteit tot installaties.', 'Als zwembadtechnicus controleer je waterkwaliteit, onderhoud je filters en pompen en zorg je dat de zwembadinstallatie voldoet aan alle veiligheidsnormen.', '{"Technisch inzicht","Precisie","Veiligheidsbewust","Zelfstandig"}', 'vmbo Techniek → mbo Watermanagement of Installatietechniek', '€ 2.400 - € 3.400'),
('hovenier', 'Hovenier / Tuinman', 'Buitenruimte & Groen', 'Park', 'green', 'Jij houdt het park groen en bloeiend — van gazons tot bloemperken.', 'Als hovenier zorg je voor al het groen op het park. Je maait, snoeit, plant en ontwerpt. Jouw werk bepaalt hoe gasten het park beleven.', '{"Groenkennis","Fysiek sterk","Creatief","Zelfstandig"}', 'vmbo Groen → mbo Hovenier niveau 2-3', '€ 2.100 - € 2.900'),
('zeilinstructeur', 'Zeilinstructeur', 'Marina & Watersport', 'Sailing', 'navy', 'Jij leert mensen zeilen — van beginner tot gevorderde.', 'Als zeilinstructeur geef je les aan groepen en individuen. Je werkt op het water, kent de veiligheidsregels en maakt van elke les een avontuur.', '{"Didactisch","Waterkennis","Geduldig","Enthousiast"}', 'vmbo → CWO Zeilinstructeur opleiding → mbo Sport', '€ 2.000 - € 3.000'),
('kok', 'Kok', 'Food & Beverage', 'Restaurant', 'orange', 'Jij bereidt maaltijden voor honderden gasten — van ontbijt tot diner.', 'Als kok in de recreatiebranche kook je voor grote groepen. Seizoensgebonden, elke dag anders. Van snackbar tot restaurantkeuken.', '{"Kookvaardigheid","Stressbestendig","Creatief","Teamspeler"}', 'vmbo → mbo Kok niveau 2-3', '€ 2.100 - € 3.200'),
('gastenservice', 'Gastenservice Medewerker', 'Frontoffice & Gastencontact', 'Support_Agent', 'navy', 'Jij helpt gasten met al hun vragen — van klacht tot compliment.', 'Als gastenservice medewerker ben je het aanspreekpunt voor alles. Je lost problemen op, geeft informatie en zorgt dat gasten met een glimlach vertrekken.', '{"Communicatie","Empathie","Probleemoplossend","Multitasking"}', 'vmbo → mbo Dienstverlening niveau 2-3', '€ 1.900 - € 2.700'),
('socialmedia', 'Social Media Beheerder', 'Marketing & Sales', 'Share', 'orange', 'Jij deelt het recreatie-avontuur online — foto''s, video''s, verhalen.', 'Als social media beheerder maak je content die gasten inspireert. Je filmt, fotografeert en schrijft. Jij bent de online stem van het park.', '{"Creativiteit","Fotografie/Video","Schrijfvaardigheid","Trendbewust"}', 'vmbo → mbo Mediavormgeving of Marketing niveau 3-4', '€ 2.200 - € 3.300'),
('evenementenplanner', 'Evenementenplanner', 'Recreatie & Animatie', 'Event', 'orange', 'Jij organiseert evenementen — van kinderfeest tot groot festival.', 'Als evenementenplanner bedenk en organiseer je evenementen op het park. Van logistiek tot entertainment — jij maakt het onvergetelijk.', '{"Organisatie","Creativiteit","Stressbestendig","Netwerken"}', 'vmbo → mbo Event Management niveau 3-4', '€ 2.400 - € 3.600'),
('technischdienst', 'Technisch Dienst Medewerker', 'Facilitair & Techniek', 'Build', 'blue', 'Jij repareert en onderhoudt alles op het park — van elektra tot sanitair.', 'Als technisch dienst medewerker ben je onmisbaar. Geen dag is hetzelfde: een lekkende kraan, een kapotte lamp, een airco die niet werkt. Jij lost het op.', '{"Technisch inzicht","Breed inzetbaar","Probleemoplossend","Praktisch"}', 'vmbo Techniek → mbo Installatietechniek of Elektrotechniek', '€ 2.500 - € 3.500'),
('havenmeester', 'Havenmeester', 'Marina & Watersport', 'Directions_Boat', 'navy', 'Jij beheert de haven — planning, veiligheid en gastvrijheid.', 'Als havenmeester coördineer je alle havenactiviteiten. Van reserveringen tot noodhulp — jij bent de baas op de steiger.', '{"Communicatie","Organisatie","Besluitvaardig","Kalm onder druk"}', 'vmbo → mbo Maritiem Officier → KVH Havenmeester', '€ 2.800 - € 4.000'),
('parkmanager', 'Parkmanager', 'Management & Administratie', 'Business_Center', 'blue', 'Jij bent verantwoordelijk voor de totale bedrijfsvoering van het recreatiepark.', 'Als parkmanager stuur je alle afdelingen aan — van receptie tot technische dienst. Jij zorgt dat het park rendabel, veilig en gastvrij is.', '{"Leiderschap","Strategisch denken","Budgetbeheer","Klanttevredenheid"}', 'HBO Toerisme & Recreatiemanagement → Directeur Recreatiebedrijf', '€ 3.500 - € 5.500')
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  key_skills = excluded.key_skills,
  career_path = excluded.career_path,
  salary_range = excluded.salary_range;
