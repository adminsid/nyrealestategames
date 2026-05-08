const ROOM_LEN = 6;
const ROOM_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const GAMES = [
  {
    id: "price-pulse",
    title: "Price Pulse NYC",
    description: "Listing prices and tax trigger essentials.",
    questions: [
      {
        prompt: "At what purchase price does NY's mansion tax begin?",
        options: ["$500,000", "$1,000,000", "$2,000,000", "$5,000,000"],
        answerIndex: 1,
        explanation: "Mansion tax starts at $1M consideration.",
        source: {
          title: "NY Tax transfer tax guidance",
          url: "https://www.tax.ny.gov/pit/property/transfer-tax.htm",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Most NYC 1-3 family homes are in which property tax class?",
        options: ["Class 1", "Class 2", "Class 3", "Class 4"],
        answerIndex: 0,
        explanation: "NYC DOF classifies most one- to three-family homes as Class 1.",
        source: {
          title: "NYC Property Tax Classes",
          url: "https://www.nyc.gov/site/finance/property/property-tax-classes.page",
          verifiedAt: "2026-05-01"
        }
      }
    ]
  },
  {
    id: "neighborhood-navigator",
    title: "Neighborhood Navigator",
    description: "NYC neighborhood and borough knowledge.",
    questions: [
      {
        prompt: "DUMBO expands to:",
        options: [
          "District Under Manhattan Borough Offices",
          "Down Under the Manhattan Bridge Overpass",
          "Downtown Union Market Block Organization",
          "Developed Urban Mixed Business Overlay"
        ],
        answerIndex: 1,
        explanation: "DUMBO stands for Down Under the Manhattan Bridge Overpass.",
        source: {
          title: "DUMBO BID",
          url: "https://dumbo.nyc/about/",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Astoria is in which borough?",
        options: ["Manhattan", "Queens", "Brooklyn", "Bronx"],
        answerIndex: 1,
        explanation: "Astoria is a neighborhood in Queens.",
        source: {
          title: "NYC Planning community profiles",
          url: "https://communityprofiles.planning.nyc.gov/",
          verifiedAt: "2026-05-01"
        }
      }
    ]
  },
  {
    id: "history-hustle",
    title: "History Hustle",
    description: "Housing and development timeline challenge.",
    questions: [
      {
        prompt: "NYC's current zoning framework is based on the resolution adopted in:",
        options: ["1916", "1961", "1977", "1993"],
        answerIndex: 1,
        explanation: "The modern NYC Zoning Resolution was adopted in 1961.",
        source: {
          title: "NYC DCP zoning background",
          url: "https://www.nyc.gov/site/planning/zoning/background.page",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "NYC Landmarks Law was enacted in:",
        options: ["1948", "1965", "1978", "1986"],
        answerIndex: 1,
        explanation: "NYC Landmarks Law was enacted in 1965.",
        source: {
          title: "LPC about page",
          url: "https://www.nyc.gov/site/lpc/about/about-lpc.page",
          verifiedAt: "2026-05-01"
        }
      }
    ]
  },
  {
    id: "law-lightning",
    title: "Law Lightning",
    description: "Fast legal checks for NYC real estate pros.",
    questions: [
      {
        prompt: "NY residential security deposits are generally capped at:",
        options: ["Half-month", "One month", "Two months", "No cap"],
        answerIndex: 1,
        explanation: "HSTPA limits most residential deposits to one month.",
        source: {
          title: "NY AG tenant rights",
          url: "https://ag.ny.gov/publications/residential-tenants-rights-guide",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Warranty of habitability is codified in:",
        options: ["RPL §235-b", "RPL §220", "RPL §339", "RPL §443"],
        answerIndex: 0,
        explanation: "Warranty of habitability is in Real Property Law §235-b.",
        source: {
          title: "NYS Senate - RPL §235-b",
          url: "https://www.nysenate.gov/legislation/laws/RPP/235-B",
          verifiedAt: "2026-05-01"
        }
      }
    ]
  },
  {
    id: "listing-detective",
    title: "Listing Detective",
    description: "Due diligence records and listing compliance clues.",
    questions: [
      {
        prompt: "Which NYC dataset is commonly used to review complaint history?",
        options: ["311 Service Requests", "Taxi Trips", "School Attendance", "Parking Meters"],
        answerIndex: 0,
        explanation: "311 records are commonly used to review building complaint trends.",
        source: {
          title: "NYC Open Data 311",
          url: "https://data.cityofnewyork.us/Social-Services/311-Service-Requests/erm2-nwe9",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Certificates of Occupancy records are maintained by:",
        options: ["DOB", "DOHMH", "MTA", "DSNY"],
        answerIndex: 0,
        explanation: "DOB maintains certificates of occupancy records.",
        source: {
          title: "NYC DOB property records",
          url: "https://www.nyc.gov/site/buildings/property-or-business-owner/bis.page",
          verifiedAt: "2026-05-01"
        }
      }
    ]
  }
];

const gameCatalog = () =>
  GAMES.map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description,
    questionCount: g.questions.length
  }));

const gameById = (id) => GAMES.find((g) => g.id === id);

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });

function roomCode() {
  let value = "";
  for (let i = 0; i < ROOM_LEN; i += 1) value += ROOM_CHARS[Math.floor(Math.random() * ROOM_CHARS.length)];
  return value;
}

function cleanCode(v) {
  return (v || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, ROOM_LEN);
}

function questionForRound(room) {
  if (!room.roundActive || !room.selectedGameId) return null;
  const game = gameById(room.selectedGameId);
  const q = game?.questions[room.questionIndex];
  if (!q) return null;
  return {
    prompt: q.prompt,
    options: q.options,
    source: q.source,
    index: room.questionIndex,
    total: game.questions.length
  };
}

export class GameRoom {
  constructor(state) {
    this.state = state;
    this.clients = new Map();
    this.ready = this.load();
  }

  async load() {
    this.room = (await this.state.storage.get("room")) || {
      initialized: false,
      roomCode: null,
      hostToken: null,
      selectedGameId: null,
      questionIndex: 0,
      roundActive: false,
      answered: [],
      players: {}
    };
  }

  async save() {
    await this.state.storage.put("room", this.room);
  }

  snapshot(clientId) {
    const players = Object.values(this.room.players).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return {
      type: "room-state",
      roomCode: this.room.roomCode,
      selectedGameId: this.room.selectedGameId,
      games: gameCatalog(),
      hostConnected: [...this.clients.values()].some((c) => c.role === "host"),
      players: players.map((p) => ({ ...p, answeredCurrent: this.room.answered.includes(p.id) })),
      round: {
        active: this.room.roundActive,
        question: questionForRound(this.room),
        responsesCount: this.room.answered.length,
        totalPlayers: players.length
      },
      hostView: this.clients.get(clientId)?.role === "host"
    };
  }

  send(clientId, payload) {
    const client = this.clients.get(clientId);
    if (!client) return;
    try {
      client.ws.send(JSON.stringify(payload));
    } catch {
      this.clients.delete(clientId);
    }
  }

  broadcast() {
    for (const id of this.clients.keys()) this.send(id, this.snapshot(id));
  }

  async onHostMessage(id, msg) {
    if (msg.type === "host-select-game") {
      if (!gameById(msg.gameId)) return this.send(id, { type: "error", message: "Unknown game." });
      this.room.selectedGameId = msg.gameId;
      this.room.questionIndex = 0;
      this.room.roundActive = false;
      this.room.answered = [];
      for (const p of Object.values(this.room.players)) p.score = 0;
      await this.save();
      return this.broadcast();
    }

    if (msg.type === "host-start-game") {
      if (!this.room.selectedGameId) return this.send(id, { type: "error", message: "Select a game first." });
      this.room.questionIndex = 0;
      this.room.roundActive = true;
      this.room.answered = [];
      await this.save();
      return this.broadcast();
    }

    if (msg.type === "host-next-question") {
      const game = gameById(this.room.selectedGameId);
      if (!game) return this.send(id, { type: "error", message: "No game selected." });
      this.room.answered = [];
      if (this.room.questionIndex + 1 >= game.questions.length) this.room.roundActive = false;
      else this.room.questionIndex += 1;
      await this.save();
      return this.broadcast();
    }

    if (msg.type === "host-end-round") {
      this.room.roundActive = false;
      this.room.answered = [];
      await this.save();
      this.broadcast();
    }
  }

  async onPlayerMessage(id, msg) {
    if (msg.type !== "player-answer") return;
    if (!this.room.roundActive || !this.room.selectedGameId) return this.send(id, { type: "error", message: "No active question." });
    if (this.room.answered.includes(id)) return this.send(id, { type: "error", message: "Already answered." });

    const game = gameById(this.room.selectedGameId);
    const q = game?.questions[this.room.questionIndex];
    if (!q) return this.send(id, { type: "error", message: "Question unavailable." });

    const isCorrect = Number(msg.answerIndex) === q.answerIndex;
    this.room.answered.push(id);
    if (isCorrect && this.room.players[id]) this.room.players[id].score += 1;
    await this.save();

    this.send(id, {
      type: "answer-result",
      isCorrect,
      correctAnswer: q.options[q.answerIndex],
      explanation: q.explanation,
      source: q.source
    });
    this.broadcast();
  }

  async fetch(request) {
    await this.ready;
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/init") {
      const body = await request.json();
      this.room = {
        initialized: true,
        roomCode: body.roomCode,
        hostToken: body.hostToken,
        selectedGameId: null,
        questionIndex: 0,
        roundActive: false,
        answered: [],
        players: {}
      };
      await this.save();
      return json({ ok: true });
    }

    if (!this.room.initialized) return json({ error: "Room not found." }, 404);
    if (url.pathname === "/snapshot") return json(this.snapshot(null));

    if (url.pathname !== "/connect") return json({ error: "Not found." }, 404);
    if (request.headers.get("Upgrade") !== "websocket") return json({ error: "Expected websocket." }, 426);

    const role = url.searchParams.get("role") || "player";
    const token = url.searchParams.get("token") || "";
    const name = (url.searchParams.get("name") || "Player").trim().slice(0, 32) || "Player";
    if (role === "host" && token !== this.room.hostToken) return json({ error: "Invalid host token." }, 403);

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    server.accept();

    const id = crypto.randomUUID();
    this.clients.set(id, { ws: server, role, name });
    if (role === "player") {
      this.room.players[id] = { id, name, score: 0, connected: true };
      await this.save();
    }

    server.addEventListener("message", (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return this.send(id, { type: "error", message: "Invalid payload." });
      }
      if (role === "host") this.onHostMessage(id, msg);
      else this.onPlayerMessage(id, msg);
    });

    server.addEventListener("close", async () => {
      this.clients.delete(id);
      if (role === "player") {
        delete this.room.players[id];
        this.room.answered = this.room.answered.filter((x) => x !== id);
        await this.save();
      }
      this.broadcast();
    });

    this.send(id, { type: "welcome", role, roomCode: this.room.roomCode, games: gameCatalog() });
    this.broadcast();
    return new Response(null, { status: 101, webSocket: client });
  }
}

async function createRoom(env) {
  for (let i = 0; i < 10; i += 1) {
    const code = roomCode();
    const stub = env.GAME_ROOM.get(env.GAME_ROOM.idFromName(code));
    const check = await stub.fetch("https://room/snapshot");
    if (check.status === 404) {
      const hostToken = crypto.randomUUID();
      await stub.fetch("https://room/init", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomCode: code, hostToken })
      });
      return { roomCode: code, hostToken };
    }
  }
  throw new Error("Unable to create room.");
}

function appHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>NY Real Estate Games</title><style>
body{font-family:Inter,system-ui;margin:0;background:#f4f6fb;color:#16213e}main{max-width:1100px;margin:auto;padding:16px;display:grid;gap:12px}
.card{background:#fff;border:1px solid #d8deea;border-radius:12px;padding:14px}.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
button,input,select{padding:10px;border-radius:10px;border:1px solid #d8deea;font-size:16px}button{background:#2e52d0;color:#fff;border:0;cursor:pointer}
button.alt{background:#e9efff;color:#16213e;border:1px solid #d8deea}.hidden{display:none!important}.games{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}
table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #d8deea;padding:6px;text-align:left}.ok{color:#0a7c45}.bad{color:#b42318}
@media(max-width:640px){button,input,select{width:100%}}</style></head><body><main>
<section class="card"><h1>🏙️ NY Real Estate Games</h1><p>Host on desktop, join from phone via room code or QR.</p><div id="catalog" class="games"></div></section>
<section class="card"><div class="row"><button id="hostMode">I'm hosting</button><button id="playerMode" class="alt">I'm joining as player</button></div></section>
<section class="card" id="hostPanel"><h2>Host</h2><div class="row"><input id="hostName" value="Broker Host" maxlength="32"><button id="createRoom">Create room</button></div>
<div id="hostLive" class="hidden"><p><b>Room:</b> <span id="roomCode"></span></p><p><b>Join:</b> <a id="joinUrl" href="#"></a></p><img id="qr" alt="qr" width="210" height="210">
<div class="row"><select id="gameSelect"></select><button id="startBtn">Start</button><button id="nextBtn" class="alt">Next</button><button id="endBtn" class="alt">End</button></div><p id="hostProgress">Waiting to start.</p></div>
<h3>Players</h3><table><thead><tr><th>Name</th><th>Score</th><th>Status</th></tr></thead><tbody id="hostRows"></tbody></table></section>
<section class="card hidden" id="playerPanel"><h2>Player</h2><div class="row"><input id="playerName" placeholder="Your name" maxlength="32"><input id="playerCode" placeholder="Room code" maxlength="6"><button id="joinBtn">Join room</button></div>
<p id="joinStatus">Enter room code from host.</p><div id="qArea" class="hidden"><h3 id="qTitle"></h3><p id="qPrompt"></p><div id="answers" class="row"></div><p id="result"></p></div>
<h3>Scoreboard</h3><table><thead><tr><th>Name</th><th>Score</th><th>Answered</th></tr></thead><tbody id="playerRows"></tbody></table></section>
</main><script>
const S={host:{ws:null,room:null,token:null},player:{ws:null},games:[]};
const byId=(id)=>document.getElementById(id); const hostPanel=byId("hostPanel"),playerPanel=byId("playerPanel");
function clean(v){return (v||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6)}
function mode(m){hostPanel.classList.toggle("hidden",m!=="host");playerPanel.classList.toggle("hidden",m==="host")}
function rows(el,players,answered){el.innerHTML="";if(!players.length){el.innerHTML='<tr><td colspan="3">No players yet.</td></tr>';return;}
players.forEach(p=>{const tr=document.createElement("tr");tr.innerHTML='<td>'+p.name+'</td><td>'+p.score+'</td><td>'+(answered?(p.answeredCurrent?"✅":"—"):"Online")+'</td>';el.appendChild(tr);});}
function ws({role,room,name,token,onMessage,onOpen,onClose}){const u=new URL("/api/ws",location.origin);u.protocol=u.protocol==="https:"?"wss:":"ws:";u.searchParams.set("room",room);u.searchParams.set("role",role);u.searchParams.set("name",name||"Player");if(token)u.searchParams.set("token",token);
const s=new WebSocket(u.toString());s.onopen=()=>onOpen&&onOpen(s);s.onmessage=e=>{try{onMessage&&onMessage(JSON.parse(e.data),s)}catch{}};s.onclose=()=>onClose&&onClose();return s;}
function applyState(r){rows(byId("hostRows"),r.players,false);rows(byId("playerRows"),r.players,true);byId("startBtn").disabled=!r.selectedGameId;byId("nextBtn").disabled=!r.round.active;byId("endBtn").disabled=!r.round.active;
if(r.selectedGameId)byId("gameSelect").value=r.selectedGameId;const q=r.round.question;if(q){byId("hostProgress").textContent='Question '+(q.index+1)+'/'+q.total+' • Responses '+r.round.responsesCount+'/'+r.round.totalPlayers;}else byId("hostProgress").textContent="Waiting to start.";
const active=r.round.active&&q;byId("qArea").classList.toggle("hidden",!active); if(!active){byId("result").textContent="Waiting for host."; return;}
byId("qTitle").textContent='Question '+(q.index+1)+' of '+q.total;byId("qPrompt").textContent=q.prompt;const answers=byId("answers");answers.innerHTML="";byId("result").textContent="";
q.options.forEach((o,i)=>{const b=document.createElement("button");b.className="alt";b.textContent=o;b.onclick=()=>{if(S.player.ws)S.player.ws.send(JSON.stringify({type:"player-answer",answerIndex:i}));[...answers.querySelectorAll("button")].forEach(x=>x.disabled=true)};answers.appendChild(b);});}
async function loadCatalog(){const r=await fetch("/api/games");const p=await r.json();S.games=p.games||[];byId("catalog").innerHTML=S.games.map(g=>'<div class="card"><h3>'+g.title+'</h3><p>'+g.description+'</p><p>Questions: '+g.questionCount+'</p></div>').join("");
byId("gameSelect").innerHTML='<option value="">Select game</option>'+S.games.map(g=>'<option value="'+g.id+'">'+g.title+'</option>').join("");}
async function createRoom(){const r=await fetch("/api/create-room",{method:"POST"});const p=await r.json();if(!r.ok)return alert(p.error||"Failed creating room");
S.host.room=p.roomCode;S.host.token=p.hostToken;byId("hostLive").classList.remove("hidden");byId("roomCode").textContent=p.roomCode;byId("joinUrl").textContent=p.joinUrl;byId("joinUrl").href=p.joinUrl;
byId("qr").src='https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='+encodeURIComponent(p.joinUrl); if(S.host.ws)S.host.ws.close();
S.host.ws=ws({role:"host",room:p.roomCode,name:byId("hostName").value||"Host",token:p.hostToken,onMessage:(m)=>{if(m.type==="room-state")applyState(m);},onClose:()=>{byId("hostProgress").textContent="Host disconnected.";}});}
function joinRoom(){const room=clean(byId("playerCode").value),name=(byId("playerName").value||"").trim();if(room.length!==6)return byId("joinStatus").textContent="Enter valid 6-char code.";if(!name)return byId("joinStatus").textContent="Enter name.";
if(S.player.ws)S.player.ws.close();byId("joinStatus").textContent="Connecting...";S.player.ws=ws({role:"player",room,name,onOpen:()=>byId("joinStatus").textContent='Connected to '+room,onMessage:(m)=>{if(m.type==="room-state")applyState(m);
if(m.type==="answer-result"){byId("result").className=m.isCorrect?"ok":"bad";byId("result").innerHTML=(m.isCorrect?"✅ Correct! ":"❌ Not this time. ")+'Answer: <b>'+m.correctAnswer+'</b><br>'+m.explanation+'<br><a target="_blank" rel="noopener noreferrer" href="'+m.source.url+'">Source: '+m.source.title+'</a> (verified '+m.source.verifiedAt+')';}
if(m.type==="error")byId("joinStatus").textContent=m.message;},onClose:()=>byId("joinStatus").textContent="Disconnected"});}
byId("hostMode").onclick=()=>mode("host"); byId("playerMode").onclick=()=>mode("player"); byId("createRoom").onclick=createRoom; byId("joinBtn").onclick=joinRoom;
byId("gameSelect").onchange=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-select-game",gameId:byId("gameSelect").value}));
byId("startBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-start-game"})); byId("nextBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-next-question"})); byId("endBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-end-round"}));
const match=location.pathname.match(/^\\/join\\/([A-Za-z0-9]+)/); if(match){mode("player");byId("playerCode").value=clean(match[1]);}
mode("host");loadCatalog().catch(()=>alert("Failed loading games"));
</script></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && (url.pathname === "/" || url.pathname.startsWith("/join/"))) {
      return new Response(appHtml(), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    }

    if (request.method === "GET" && url.pathname === "/api/games") return json({ games: gameCatalog() });

    if (request.method === "POST" && url.pathname === "/api/create-room") {
      try {
        const created = await createRoom(env);
        return json({ ...created, joinUrl: `${url.origin}/join/${created.roomCode}` });
      } catch (error) {
        return json({ error: error.message }, 500);
      }
    }

    if (url.pathname === "/api/ws") {
      if (request.headers.get("Upgrade") !== "websocket") return json({ error: "Expected websocket upgrade." }, 426);
      const code = cleanCode(url.searchParams.get("room"));
      if (code.length !== ROOM_LEN) return json({ error: "Invalid room code." }, 400);
      const stub = env.GAME_ROOM.get(env.GAME_ROOM.idFromName(code));
      const connectUrl = new URL("https://room/connect");
      connectUrl.searchParams.set("role", url.searchParams.get("role") || "player");
      connectUrl.searchParams.set("name", url.searchParams.get("name") || "Player");
      connectUrl.searchParams.set("token", url.searchParams.get("token") || "");
      return stub.fetch(connectUrl.toString(), { headers: { Upgrade: "websocket" } });
    }

    if (url.pathname === "/health") return new Response("ok");
    return new Response("Not found", { status: 404 });
  }
};
