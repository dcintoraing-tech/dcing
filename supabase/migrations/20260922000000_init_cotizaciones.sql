-- DCing — solicitudes de cotización y cotizaciones generadas.
--
-- Modelo de acceso: ninguna parte del navegador habla con Postgres. Todo pasa
-- por el servidor de Next.js con la service_role key, que ignora RLS. Por eso
-- las tablas tienen RLS habilitado y CERO políticas: para anon y authenticated
-- eso significa negar todo, que es exactamente lo que queremos.

create table if not exists public.solicitudes (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  nombre         text not null check (char_length(nombre) between 2 and 120),
  celular        text not null check (char_length(celular) between 8 and 20),
  correo         text not null check (position('@' in correo) > 1),
  empresa        text check (char_length(empresa) <= 120),

  servicio       text not null,
  servicio_otro  text check (char_length(servicio_otro) <= 160),
  descripcion    text not null check (char_length(descripcion) between 20 and 4000),

  estado         text not null default 'nueva'
                 check (estado in ('nueva','generando','borrador','aprobada','enviada','descartada')),
  error_ia       text,

  ip             text,
  user_agent     text
);

create table if not exists public.cotizaciones (
  id               uuid primary key default gen_random_uuid(),
  solicitud_id     uuid not null references public.solicitudes(id) on delete cascade,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  version          integer not null default 1 check (version > 0),
  token            text not null unique,

  titulo           text not null,
  servicio         text not null,
  resumen          text not null,
  alcance          text[] not null default '{}',
  conceptos        jsonb  not null default '[]'::jsonb,

  -- Congelado al momento de generar: la cotización no debe cambiar si mañana
  -- cambian las tarifas.
  precio_min       numeric(12,2) not null check (precio_min >= 0),
  precio_max       numeric(12,2) not null check (precio_max >= precio_min),
  moneda           text not null default 'MXN',

  tiempo_estimado  text not null,
  condiciones      text[] not null default '{}',
  notas            text not null default '',
  preguntas        text[] not null default '{}',
  confianza        text not null default 'media' check (confianza in ('alta','media','baja')),

  estado           text not null default 'borrador'
                   check (estado in ('borrador','aprobada','enviada')),
  enviada_at       timestamptz,
  modelo           text,

  unique (solicitud_id, version)
);

create index if not exists cotizaciones_solicitud_idx on public.cotizaciones (solicitud_id);
create index if not exists cotizaciones_token_idx     on public.cotizaciones (token);
create index if not exists solicitudes_created_idx    on public.solicitudes (created_at desc);
create index if not exists solicitudes_estado_idx     on public.solicitudes (estado);
-- Soporta el límite por IP en la última hora.
create index if not exists solicitudes_ip_created_idx on public.solicitudes (ip, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists solicitudes_touch on public.solicitudes;
create trigger solicitudes_touch before update on public.solicitudes
  for each row execute function public.touch_updated_at();

drop trigger if exists cotizaciones_touch on public.cotizaciones;
create trigger cotizaciones_touch before update on public.cotizaciones
  for each row execute function public.touch_updated_at();

alter table public.solicitudes  enable row level security;
alter table public.cotizaciones enable row level security;
