-- BUCKETS
insert into storage.buckets (
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types
) values (
  'docs', 
  'docs', 
  false, 
  10485760, 
  '{image/jpeg, image/png, application/pdf}'
);

-- SERVICES
insert into services (
  name, 
  href, 
  price, 
  title, 
  description
) values (
  'stocks', 
  '/stocks', 
  14.99, 
  'Akcje', 
  'Usługa zarządzania akcjami umożliwia efektywne zarządzanie finansami, oferując narzędzia do monitorowania inwestycji, analizowania rynku i podejmowania świadomych decyzji inwestycyjnych. Dzięki niej użytkownicy mogą śledzić wartość swoich portfeli, otrzymywać powiadomienia o istotnych zmianach rynkowych oraz korzystać z raportów i analiz dostosowanych do ich indywidualnych potrzeb.'
);

-- USER
insert into auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new, 
  email_change,
  raw_app_meta_data, 
  raw_user_meta_data,
  created_at, 
  updated_at,
  phone_change, 
  phone_change_token,
  email_change_token_current, 
  email_change_confirm_status,
  reauthentication_token
) values (
  '00000000-0000-0000-0000-000000000000', 
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  'authenticated', 
  'authenticated', 
  'test@credivio.com',  
  extensions.crypt('maciek102', extensions.gen_salt('bf')), 
  timezone('utc'::text, now()),
  '', 
  '',
  '', 
  '',
  '{"provider": "email", "providers": ["email"]}', 
  '{
    "first_name": "Rory", 
    "last_name": "Zappa", 
    "currency": "PLN", 
    "language_code": "pl-PL"
  }',
  timezone('utc'::text, now()), 
  timezone('utc'::text, now()),
  '', 
  '',
  '', 
  0, 
  ''
);

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  '{
    "sub": "8d65ee5d-3897-4f61-b467-9bdc8df6f07f", 
    "first_name": "Rory", 
    "last_name": "Zappa", 
    "currency": "PLN", 
    "language_code": "pl-PL"
  }', 
  'email', 
  timezone('utc'::text, now()), 
  timezone('utc'::text, now()), 
  timezone('utc'::text, now())
);

-- EXPENSES
insert into expenses (title, amount, currency, user_id, label, recurring, from_telegram, issued_at)
select
  'expense' || floor(random() * 100000),
  round((random() * 1000)::numeric, 2),
  ( 
    case
      when random() < 0.5 then 'PLN'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end
  )::currency_type,
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  case
    when random() < 0.75 then (
      array[
        'Rachunki', 'Jedzenie', 'Rozrywka', 'Transport', 'Ubrania', 'Raty', 'Prezenty', 
        'Urlop', 'Restauracje', 'Rachunek telefoniczny', 'Rachunek za internet', 'Ubezpieczenie', 
        'Zwierzęta', 'Artykuły biurowe', 'Edukacja', 'Zdrowie', 'Kosmetyki', 'Dom', 'Mieszkanie', 
        'Remont', 'Utrzymanie domu', 'Podatki', 'Opłaty', 'Prezent urodzinowy', 'Prezent świąteczny', 
        'Sport', 'Hobby', 'Kultura', 'Elektronika', 'Sprzęt AGD', 'Meble', 'Inne'
      ]
    )[floor(random() * 32 + 1)]
    else null
  end,
  case
    when random() < 0.1 then true
    else false
  end,
  random() < 0.5,
  case
    when random() < 0.1 then now() - (random() * interval '30 day')
    else now() - (random() * interval '2 year')
  end
from generate_series(1, 500);

-- INCOMES
insert into incomes (title, amount, currency, user_id, recurring, from_telegram, issued_at)
select
  'income' || floor(random() * 100000),
  round((random() * 1000)::numeric, 2),
  ( 
    case
      when random() < 0.5 then 'PLN'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end
  )::currency_type,
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  case
    when random() < 0.1 then true
    else false
  end,
  random() < 0.5,
  case
    when random() < 0.1 then now() - (random() * interval '30 day')
    else now() - (random() * interval '2 year')
  end
from generate_series(1, 500);

-- RECURRING PAYMENTS
insert into recurring_payments (title, amount, currency, type, user_id, interval_amount, interval_unit, start_date)
select
  'recurring-payment' || floor(random() * 100000),
  round((random() * 900 + 100)::numeric, 2),
  ( 
    case
      when random() < 0.5 then 'PLN'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end
  )::currency_type,
  (array['income', 'expense'])[floor(random() * 1 + 1)]::operation_type,
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  floor(random() * 7 + 3),
  ( 
    case
      when random() < 0.5 then 'day'
      when random() < 0.8 then 'month'
      else 'year'
    end
  )::interval_unit_type,
  (now() - (random() * interval '3 day'))::date
from generate_series(1, 10);

-- GOALS
with inserted_goals as (
  insert into goals (title, price, currency, user_id, deadline, is_priority)
  select
    'goal' || floor(random() * 100000),
    round((random() * 9500 + 500)::numeric, 2),
    ( 
      case
        when random() < 0.5 then 'PLN'
        else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
      end
    )::currency_type,
    '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
    case
      when random() < 0.1 then null
      else (now() + (random() * interval '2 year'))::date
    end,
    true
  from generate_series(1, 20) returning id, price
) insert into goals_payments (goal_id, amount, date)
select 
  id, 
  round((random() * (price / 10))::numeric, 2), 
  (now() - ((gs + floor(random() * 3)) * interval '1 day'))::date
from inserted_goals
cross join generate_series(1, 10) as gs;