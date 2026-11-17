-- Tour virtual: 5 paradas da orientação (seção 5.1), texto provisório, sem fotos ainda.
begin;
alter table public.tour_paradas add column exemplo boolean not null default false;
alter table public.tour_marcadores add column ordem int not null default 0;

-- Áudio de narração também pode ser enviado pelo painel
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav'],
    file_size_limit = 10485760
where id = 'midias';

insert into public.tour_paradas (ordem, titulo, texto, exemplo) values
(1, 'Conheça o laboratório', 'Boas-vindas ao Laboratório Sensorial da UniCatólica. Aqui, uma horta vira sala de aula para quatro cursos: Psicologia, Biomedicina, Farmácia e Engenharia de Software. Cada planta pode ser conhecida, sentida e estudada.', true),
(2, 'Horta e cultivo', 'Os canteiros reúnem ervas aromáticas, plantas de chá e espécies medicinais tradicionais. Repare no solo, na luz e na água que cada uma pede: cuidar da horta também é aprender sobre sustentabilidade.', true),
(3, 'Experiências sensoriais', 'Feche os olhos e use outros sentidos. Aromas, texturas, cores e formas despertam lembranças e emoções diferentes em cada pessoa. Não existe sensação certa.', true),
(4, 'A planta e a ciência', 'O que dá cheiro e sabor a uma planta são substâncias produzidas por ela. A Biomedicina e a Farmácia estudam essas substâncias, separando o que é uso popular, hipótese, evidência e uso reconhecido.', true),
(5, 'Descubra e participe', 'Chegou ao fim do percurso. Teste o que você descobriu no quiz, conheça os projetos dos estudantes e venha visitar a horta pessoalmente.', true);

insert into public.tour_marcadores (parada_id, x, y, rotulo, canteiro_id, ordem)
select p.id, v.x, v.y, v.rotulo, v.canteiro, v.ordem
from public.tour_paradas p
join (values (25, 55, 'Canteiro 1: aromáticas de sol', 'c1', 0), (50, 55, 'Canteiro 2: ervas de cozinha e chá', 'c2', 1), (75, 55, 'Canteiro 3: medicinais tradicionais', 'c3', 2))
  as v(x, y, rotulo, canteiro, ordem) on true
where p.ordem = 2;

insert into public.tour_marcadores (parada_id, x, y, rotulo, planta, ordem)
select p.id, v.x, v.y, v.rotulo, v.planta, v.ordem
from public.tour_paradas p
join (values (3, 35, 50, 'Hortelã', 'hortela', 0), (3, 65, 45, 'Lavanda', 'lavanda', 1), (4, 35, 50, 'Camomila', 'camomila', 0), (4, 65, 50, 'Babosa', 'babosa', 1))
  as v(parada, x, y, rotulo, planta, ordem) on v.parada = p.ordem;

commit;
