📦 Happy Thoughts API

Ett fullständigt REST API byggt med Express, MongoDB, Mongoose, JWT-auth och bcrypt.
Det används tillsammans med min Happy Thoughts-frontend.

🌍 Live API

Base URL:

https://js-project-api-j7vv.onrender.com

📘 Root documentation

API:et dokumenteras automatiskt via express-list-endpoints.

Besök:

GET /

⚙️ Tech Stack

Node.js + Express

MongoDB Atlas + Mongoose

JWT (jsonwebtoken) för autentisering

bcryptjs för lösenordshashning

CORS

Deploy: Render

🔐 Environment variables

Din .env (inte inkluderad i GitHub) ska innehålla:

MONGO_URL=din_atlas_connection_string
JWT_SECRET=din_hemliga_sträng
PORT=8080


En mall finns i .env.example.

🚀 Komma igång lokalt
git clone https://github.com/UlrikaRakkaBrant/js-project-api.git
cd js-project-api
npm install
npm run dev


Servern startar på:

http://localhost:8080

🌱 Seed-databas (valfritt)

Projektet innehåller ett seed.js script som fyller databasen med testdata.

npm run seed


Detta:

raderar gamla thoughts

lägger till nya från data.json

eller skapar default-data om data.json saknas

📚 Endpoints
AUTH ROUTES

Alla tokens returneras som:

{
  "userId": "....",
  "username": "....",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

🔸 POST /auth/signup

Skapa en ny användare.

Body:

{
  "username": "ulrika",
  "password": "secret123"
}


Möjliga svar:

201 Created

400 Bad Request – saknade fält / för kort lösenord

409 Conflict – username upptaget

🔸 POST /auth/login

Logga in och få token.

Body:

{
  "username": "ulrika",
  "password": "secret123"
}


Möjliga svar:

200 OK

401 Unauthorized – felaktiga inloggningsuppgifter

💭 Thoughts routes

OBS: alla routes som skapar, ändrar eller raderar kräver Authorization header:

Authorization: Bearer <token>

🔸 GET /thoughts

Lista alla thoughts.

Stödjer:

Query	Beskrivning
page	sidnummer
limit	antal per sida
sort=createdAt/hearts	sortering
order=asc/desc	stigande/fallande
q=<text>	text-sökning
minHearts=<num>	filtrera efter likes
newerThan=<ISO-date>	filtrera efter datum
tag=<tag1,tag2>	filtrera på taggar

Exempel:

GET /thoughts?page=1&limit=20&sort=createdAt&order=desc

🔸 GET /thoughts/:id

Hämta en enskild thought.

Svar:

200 OK

404 Not Found

🔸 POST /thoughts (auth required)

Skapa en ny thought kopplad till användaren.

{
  "message": "Hello from the API!",
  "author": "Ulrika",
  "tags": ["api", "week3"]
}


Svar:

201 Created

400 Bad Request – valideringsfel (t.ex. message < 5 tecken)

🔸 PATCH /thoughts/:id (auth + owner required)

Uppdatera en thought endast om du äger den.

{
  "message": "Updated message",
  "tags": ["edited"]
}


Svar:

200 OK

403 Forbidden – inte ägaren

404 Not Found

🔸 DELETE /thoughts/:id (auth + owner required)

Radera en thought du äger.

Svar:

204 No Content

403 Forbidden

404 Not Found

🔸 POST /thoughts/:id/like (auth required)

Likea en thought (ökar hearts med 1).

Svar:

200 OK

404 Not Found

🧪 Felkoder (sammanfattning)
Kod	Används när
400	Valideringsfel, ogiltig input
401	Felaktiga login-uppgifter / saknar token
403	Försök att ändra/radera någons annan thought
404	Thought eller route saknas
409	Username upptaget
500	Internt fel
🏁 Projektets krav (Checklista)

 Dokumentation på /

 GET /thoughts

 GET /thoughts/:id

 POST /thoughts (auth)

 PATCH /thoughts/:id (auth + owner)

 DELETE /thoughts/:id (auth + owner)

 POST /thoughts/:id/like

 Signup / Login

 JWT-auth

 Mongoose modeller med validering

 Lösenord hashas med bcrypt

 Error-handling

 API deployat på Render

 Frontend kan ansluta med både login och CRUD

🎉 Tack!

Det här API:et är byggt med fokus på tydlighet, validering, felhantering och bra struktur.
Det fungerar fullt ut tillsammans med min Happy Thoughts-frontend.
