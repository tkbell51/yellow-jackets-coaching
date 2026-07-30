insert into programs (id, name, short_name) values ('11111111-1111-1111-1111-111111111111', 'Yellow Jackets Coaching', 'Jackets');
insert into age_groups (id, program_id, name, minimum_plays) values
  ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111111', '8U', 4),
  ('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111111', '10U', 0);

insert into app_settings (program_id, key, value) values
  ('11111111-1111-1111-1111-111111111111', 'competition_reasons', '["Period Win","Drill Win","Duck Duck Tackle Relay","Football Baseball","Tackle Wheel Gladiator","Practice Champion","Other"]'),
  ('11111111-1111-1111-1111-111111111111', 'mvp_seed_note', '{"message":"Create auth users separately, then connect profiles/program_members by auth user id."}');
