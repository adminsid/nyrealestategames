const ROOM_LEN = 6;
const ROOM_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROUND_DURATION_MS = 15000;

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
        roundEndsAt: null,
        roundDurationMs: ROUND_DURATION_MS,
        answered: [],
        players: {}
      };
  }

  async save() {
    await this.state.storage.put("room", this.room);
  }

  snapshot(clientId) {
    const players = Object.values(this.room.players).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    const msLeft = this.room.roundEndsAt ? Math.max(0, this.room.roundEndsAt - Date.now()) : 0;
    return {
      type: "room-state",
      roomCode: this.room.roomCode,
      selectedGameId: this.room.selectedGameId,
      games: gameCatalog(),
      hostConnected: [...this.clients.values()].some((c) => c.role === "host"),
      players: players.map((p) => ({ ...p, answeredCurrent: this.room.answered.includes(p.id) })),
      round: {
        active: this.room.roundActive,
        endsAt: this.room.roundEndsAt,
        durationMs: this.room.roundDurationMs || ROUND_DURATION_MS,
        msLeft,
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
      this.room.roundEndsAt = null;
      this.room.answered = [];
      for (const p of Object.values(this.room.players)) p.score = 0;
      await this.save();
      return this.broadcast();
    }

    if (msg.type === "host-start-game") {
      if (!this.room.selectedGameId) return this.send(id, { type: "error", message: "Select a game first." });
      this.room.questionIndex = 0;
      this.room.roundActive = true;
      this.room.roundDurationMs = ROUND_DURATION_MS;
      this.room.roundEndsAt = Date.now() + this.room.roundDurationMs;
      this.room.answered = [];
      await this.save();
      return this.broadcast();
    }

    if (msg.type === "host-next-question") {
      const game = gameById(this.room.selectedGameId);
      if (!game) return this.send(id, { type: "error", message: "No game selected." });
      this.room.answered = [];
      this.room.roundDurationMs = ROUND_DURATION_MS;
      this.room.roundEndsAt = Date.now() + this.room.roundDurationMs;
      if (this.room.questionIndex + 1 >= game.questions.length) {
        this.room.roundActive = false;
        this.room.roundEndsAt = null;
      } else this.room.questionIndex += 1;
      await this.save();
      return this.broadcast();
    }

    if (msg.type === "host-end-round") {
      this.room.roundActive = false;
      this.room.roundEndsAt = null;
      this.room.answered = [];
      await this.save();
      this.broadcast();
    }
  }

  async onPlayerMessage(id, msg) {
    if (msg.type !== "player-answer") return;
    if (!this.room.roundActive || !this.room.selectedGameId) return this.send(id, { type: "error", message: "No active question." });
    if (this.room.roundEndsAt && Date.now() >= this.room.roundEndsAt)
      return this.send(id, { type: "error", message: "Time is up for this question." });
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
        roundEndsAt: null,
        roundDurationMs: ROUND_DURATION_MS,
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
:root{--bg:#09111f;--card:#111d33;--cardAlt:#0f274a;--border:#2d4470;--text:#e8efff;--muted:#96aed9;--good:#4ef0a8;--bad:#ff8e8e;--accent:#5f90ff;--accent2:#74d3ff}
*{box-sizing:border-box}body{font-family:Inter,system-ui;margin:0;background:radial-gradient(circle at top,#173462 0,#09111f 55%,#050a14 100%);color:var(--text);min-height:100vh}
main{max-width:1100px;margin:auto;padding:16px;display:grid;gap:12px}.card{background:linear-gradient(145deg,var(--card),var(--cardAlt));border:1px solid var(--border);border-radius:16px;padding:14px;box-shadow:0 14px 34px rgba(0,0,0,.35);animation:cardIn .4s ease both}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}button,input,select{padding:10px;border-radius:10px;border:1px solid #3a5588;font-size:16px;color:var(--text);background:#142849}
button{background:linear-gradient(120deg,#4a78ff,#5f90ff);border:0;cursor:pointer;transform:translateY(0);transition:transform .15s ease,filter .15s ease}
button:hover{transform:translateY(-1px);filter:brightness(1.08)}button:disabled{opacity:.55;cursor:not-allowed;transform:none}
button.alt{background:#1f365f;color:#dce8ff;border:1px solid #4e6792}.hidden{display:none!important}.games{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}
table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #2a4068;padding:6px;text-align:left}.ok{color:var(--good)}.bad{color:var(--bad)}
.timer{font-weight:700;margin:8px 0 6px;color:#cbe0ff;transition:color .2s ease}.timer.urgent{color:#ffd37b;animation:pulse .8s ease infinite}.timer.expired{color:var(--bad)}
.progress{height:8px;background:#0b162c;border-radius:999px;overflow:hidden;border:1px solid #243b62}.progress > div{height:100%;width:100%;background:linear-gradient(90deg,#59b8ff,#7f8bff);transition:width .2s linear}
#qArea{position:relative;overflow:hidden}.qPrompt{font-size:1.08rem;line-height:1.4;margin-bottom:10px}.answers-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px}
.answer-btn{background:#1d355d;border:1px solid #5078b2}.answer-btn:hover{background:#274475}.answer-btn.selected{outline:2px solid #9bc9ff;box-shadow:0 0 0 4px rgba(123,167,255,.2)}
.feedback{min-height:72px;padding:10px;border-radius:12px;background:rgba(10,18,34,.45);border:1px solid #2f4b78;transition:transform .2s ease}
.feedback.ok{border-color:#3ab77c;background:rgba(39,108,75,.22);animation:pop .35s ease}.feedback.bad{border-color:#b95e5e;background:rgba(114,40,40,.22);animation:shake .25s ease}
.flare{position:absolute;inset:0;pointer-events:none;opacity:0}.flare.show.good{opacity:1;animation:goodFlare .7s ease}.flare.show.bad{opacity:1;animation:badFlare .55s ease}
.catalog-card{transition:transform .2s ease,border-color .2s ease}.catalog-card:hover{transform:translateY(-2px);border-color:#698bcc}
@keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
@keyframes pop{0%{transform:scale(.96)}100%{transform:scale(1)}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@keyframes goodFlare{0%{background:radial-gradient(circle at center,rgba(90,255,170,.38),rgba(0,0,0,0) 60%)}100%{background:radial-gradient(circle at center,rgba(90,255,170,0),rgba(0,0,0,0) 70%)}}
@keyframes badFlare{0%{background:radial-gradient(circle at center,rgba(255,106,106,.4),rgba(0,0,0,0) 60%)}100%{background:radial-gradient(circle at center,rgba(255,106,106,0),rgba(0,0,0,0) 70%)}}
@media(max-width:640px){button,input,select{width:100%}}
</style></head><body><main>
<section class="card"><h1>🏙️ NY Real Estate Games</h1><p>Host on desktop, join from phone via room code or QR.</p><div id="catalog" class="games"></div></section>
<section class="card"><div class="row"><button id="hostMode">I'm hosting</button><button id="playerMode" class="alt">I'm joining as player</button></div></section>
<section class="card" id="hostPanel"><h2>Host</h2><div class="row"><input id="hostName" value="Broker Host" maxlength="32"><button id="createRoom">Create room</button></div>
<div id="hostLive" class="hidden"><p><b>Room:</b> <span id="roomCode"></span></p><p><b>Join:</b> <a id="joinUrl" href="#"></a></p><img id="qr" alt="qr" width="210" height="210">
<div class="row"><select id="gameSelect"></select><button id="startBtn">Start</button><button id="nextBtn" class="alt">Next</button><button id="endBtn" class="alt">End</button></div>
<p id="hostTimer" class="timer">Timer: --</p><div class="progress"><div id="hostTimerBar"></div></div><p id="hostProgress">Waiting to start.</p></div>
<h3>Players</h3><table><thead><tr><th>Name</th><th>Score</th><th>Status</th></tr></thead><tbody id="hostRows"></tbody></table></section>
<section class="card hidden" id="playerPanel"><h2>Player</h2><div class="row"><input id="playerName" placeholder="Your name" maxlength="32"><input id="playerCode" placeholder="Room code" maxlength="6"><button id="joinBtn">Join room</button></div>
<p id="joinStatus">Enter room code from host.</p><div id="qArea" class="hidden"><div id="resultFlare" class="flare"></div><h3 id="qTitle"></h3><p id="qPrompt" class="qPrompt"></p>
<p id="playerTimer" class="timer">Timer: --</p><div class="progress"><div id="playerTimerBar"></div></div><div id="answers" class="answers-grid"></div><p id="result" class="feedback">Choose your answer before time runs out.</p></div>
<h3>Scoreboard</h3><table><thead><tr><th>Name</th><th>Score</th><th>Answered</th></tr></thead><tbody id="playerRows"></tbody></table></section>
</main><script>
const FLARE_ANIMATION_DURATION_MS=700;
const S={host:{ws:null,room:null,token:null},player:{ws:null,hasAnswered:false},games:[],lastQuestionKey:null,timerId:null,lastTickSecond:null,currentRound:null,timeUpHandled:false,audioCtx:null};
const byId=(id)=>document.getElementById(id);const hostPanel=byId("hostPanel"),playerPanel=byId("playerPanel");
function clean(v){return (v||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6)}
function mode(m){hostPanel.classList.toggle("hidden",m!=="host");playerPanel.classList.toggle("hidden",m==="host")}
function rows(el,players,answered){el.innerHTML="";if(!players.length){el.innerHTML='<tr><td colspan="3">No players yet.</td></tr>';return;}
players.forEach(p=>{const tr=document.createElement("tr");tr.innerHTML='<td>'+p.name+'</td><td>'+p.score+'</td><td>'+(answered?(p.answeredCurrent?"✅":"—"):"Online")+'</td>';el.appendChild(tr);});}
function ws({role,room,name,token,onMessage,onOpen,onClose}){const u=new URL("/api/ws",location.origin);u.protocol=u.protocol==="https:"?"wss:":"ws:";u.searchParams.set("room",room);u.searchParams.set("role",role);u.searchParams.set("name",name||"Player");if(token)u.searchParams.set("token",token);
const s=new WebSocket(u.toString());s.onopen=()=>onOpen&&onOpen(s);s.onmessage=e=>{try{onMessage&&onMessage(JSON.parse(e.data),s)}catch{}};s.onclose=()=>onClose&&onClose();return s;}
function getAudioCtx(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!S.audioCtx)S.audioCtx=new C();if(S.audioCtx.state==="suspended")S.audioCtx.resume();return S.audioCtx;}
function audioTone(freq,duration,volume){const ctx=getAudioCtx();if(!ctx)return;const osc=ctx.createOscillator();const gain=ctx.createGain();
osc.type="sine";osc.frequency.value=freq;gain.gain.value=volume;osc.connect(gain);gain.connect(ctx.destination);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start();osc.stop(ctx.currentTime+duration/1000);}
function playTick(){audioTone(710,80,0.012)}function playCorrect(){audioTone(840,140,0.03);setTimeout(()=>audioTone(1040,180,0.028),120)}
function playWrong(){audioTone(260,160,0.03);setTimeout(()=>audioTone(180,190,0.028),130)}function playTimeout(){audioTone(145,280,0.03)}
function showFlare(kind){const flare=byId("resultFlare");flare.className="flare";void flare.offsetWidth;flare.className="flare show "+kind;setTimeout(()=>{flare.className="flare";},FLARE_ANIMATION_DURATION_MS);}
function updateTimerUi(timerEl,barEl,round){const timer=byId(timerEl),bar=byId(barEl);const active=Boolean(round&&round.active&&round.question&&round.endsAt);const msLeft=active?Math.max(0,round.endsAt-Date.now()):0;
if(!active){timer.textContent="Timer: --";timer.className="timer";bar.style.width="100%";return msLeft;}
const seconds=Math.ceil(msLeft/1000);timer.textContent=msLeft>0?'Timer: '+seconds+'s':'Timer: 0s';timer.className='timer '+(msLeft<=0?'expired':seconds<=5?'urgent':'');
const duration=Math.max(round.durationMs||15000,1);bar.style.width=(Math.max(0,Math.min(1,msLeft/duration))*100).toFixed(2)+'%';return msLeft;}
function toggleAnswerButtons(disabled){byId("answers").querySelectorAll("button").forEach((b)=>{b.disabled=disabled;});}
function stopRoundTicker(){if(!S.timerId)return;clearInterval(S.timerId);S.timerId=null;S.lastTickSecond=null;}
function startRoundTicker(){if(S.timerId)return;S.lastTickSecond=null;S.timerId=setInterval(()=>{if(!S.currentRound)return;let msLeft=0;
if(!hostPanel.classList.contains("hidden"))msLeft=updateTimerUi("hostTimer","hostTimerBar",S.currentRound);
if(!playerPanel.classList.contains("hidden"))msLeft=updateTimerUi("playerTimer","playerTimerBar",S.currentRound)||msLeft;
if(!S.currentRound.active||!S.currentRound.question||!S.currentRound.endsAt)return;const remainingSeconds=Math.ceil(Math.max(0,msLeft)/1000);if(msLeft>0&&remainingSeconds<=5&&remainingSeconds!==S.lastTickSecond){S.lastTickSecond=remainingSeconds;playTick();}
if(msLeft<=0&&!S.player.hasAnswered&&!S.timeUpHandled){toggleAnswerButtons(true);byId("result").className="feedback bad";byId("result").textContent="⏰ Time is up for this question.";playTimeout();S.player.hasAnswered=true;S.timeUpHandled=true;}},200);}
function renderQuestion(q,round){const active=round.active&&q;byId("qArea").classList.toggle("hidden",!active);if(!active){byId("result").className="feedback";byId("result").textContent="Waiting for host.";return;}
byId("qTitle").textContent='Question '+(q.index+1)+' of '+q.total;byId("qPrompt").textContent=q.prompt;const answers=byId("answers");answers.innerHTML="";
q.options.forEach((o,i)=>{const b=document.createElement("button");b.className="answer-btn";b.textContent=o;b.onclick=()=>{if(S.player.ws)S.player.ws.send(JSON.stringify({type:"player-answer",answerIndex:i}));
S.player.hasAnswered=true;b.classList.add("selected");toggleAnswerButtons(true);};answers.appendChild(b);});
toggleAnswerButtons(S.player.hasAnswered||round.msLeft<=0);}
function applyState(r){S.currentRound=r.round;rows(byId("hostRows"),r.players,false);rows(byId("playerRows"),r.players,true);byId("startBtn").disabled=!r.selectedGameId;byId("nextBtn").disabled=!r.round.active;byId("endBtn").disabled=!r.round.active;
if(r.selectedGameId)byId("gameSelect").value=r.selectedGameId;const q=r.round.question;const questionKey=q?String(q.index)+"-"+String(r.round.endsAt):"none";
if(S.lastQuestionKey!==questionKey){S.lastQuestionKey=questionKey;S.player.hasAnswered=false;S.timeUpHandled=false;byId("result").className="feedback";byId("result").textContent="Choose your answer before time runs out.";}
if(q){const remainingSeconds=Math.ceil(Math.max(0,r.round.msLeft||0)/1000);byId("hostProgress").textContent='Question '+(q.index+1)+'/'+q.total+' • Responses '+r.round.responsesCount+'/'+r.round.totalPlayers+' • '+remainingSeconds+'s left';}
else byId("hostProgress").textContent="Waiting to start.";renderQuestion(q,r.round);updateTimerUi("hostTimer","hostTimerBar",r.round);updateTimerUi("playerTimer","playerTimerBar",r.round);
if(r.round.active&&q&&r.round.endsAt)startRoundTicker();else stopRoundTicker();}
async function loadCatalog(){const r=await fetch("/api/games");const p=await r.json();S.games=p.games||[];byId("catalog").innerHTML=S.games.map(g=>'<div class="card catalog-card"><h3>'+g.title+'</h3><p>'+g.description+'</p><p>Questions: '+g.questionCount+'</p></div>').join("");
byId("gameSelect").innerHTML='<option value="">Select game</option>'+S.games.map(g=>'<option value="'+g.id+'">'+g.title+'</option>').join("");}
async function createRoom(){const r=await fetch("/api/create-room",{method:"POST"});const p=await r.json();if(!r.ok)return alert(p.error||"Failed creating room");
S.host.room=p.roomCode;S.host.token=p.hostToken;byId("hostLive").classList.remove("hidden");byId("roomCode").textContent=p.roomCode;byId("joinUrl").textContent=p.joinUrl;byId("joinUrl").href=p.joinUrl;
byId("qr").src='https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='+encodeURIComponent(p.joinUrl);if(S.host.ws)S.host.ws.close();
S.host.ws=ws({role:"host",room:p.roomCode,name:byId("hostName").value||"Host",token:p.hostToken,onMessage:(m)=>{if(m.type==="room-state")applyState(m);},onClose:()=>{byId("hostProgress").textContent="Host disconnected.";}});}
function joinRoom(){const room=clean(byId("playerCode").value),name=(byId("playerName").value||"").trim();if(room.length!==6)return byId("joinStatus").textContent="Enter valid 6-char code.";if(!name)return byId("joinStatus").textContent="Enter name.";
if(S.player.ws)S.player.ws.close();byId("joinStatus").textContent="Connecting...";S.player.ws=ws({role:"player",room,name,onOpen:()=>byId("joinStatus").textContent='Connected to '+room,onMessage:(m)=>{if(m.type==="room-state")applyState(m);
if(m.type==="answer-result"){byId("result").className=m.isCorrect?"feedback ok":"feedback bad";byId("result").innerHTML=(m.isCorrect?"✅ Correct! ":"❌ Not this time. ")+'Answer: <b>'+m.correctAnswer+'</b><br>'+m.explanation+'<br><a target="_blank" rel="noopener noreferrer" href="'+m.source.url+'">Source: '+m.source.title+'</a> (verified '+m.source.verifiedAt+')';
if(m.isCorrect){playCorrect();showFlare("good");}else{playWrong();showFlare("bad");}}
if(m.type==="error")byId("joinStatus").textContent=m.message;},onClose:()=>byId("joinStatus").textContent="Disconnected"});}
byId("hostMode").onclick=()=>mode("host");byId("playerMode").onclick=()=>mode("player");byId("createRoom").onclick=createRoom;byId("joinBtn").onclick=joinRoom;
byId("gameSelect").onchange=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-select-game",gameId:byId("gameSelect").value}));
byId("startBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-start-game"}));byId("nextBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-next-question"}));byId("endBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-end-round"}));
const match=location.pathname.match(/^\\/join\\/([A-Za-z0-9]+)/);if(match){mode("player");byId("playerCode").value=clean(match[1]);}
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
