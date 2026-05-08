const ROOM_LEN = 6;
const ROOM_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROUND_DURATION_MS = 15000;

const GAMES = [
  {
    id: "quiz-market-masters",
    category: "Quizzes",
    title: "Market Masters Quiz",
    description: "Fast NYC real-estate trivia rounds.",
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
      },
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
      }
    ]
  },
  {
    id: "puzzle-deal-decoder",
    category: "Puzzles",
    title: "Deal Decoder Puzzle",
    description: "Solve scenario clues to close the right deal.",
    questions: [
      {
        prompt: "A condo has strict pet rules and board approval. Which due-diligence doc matters most first?",
        options: ["Alteration agreement", "House rules", "Tax bill", "Parking permit"],
        answerIndex: 1,
        explanation: "House rules reveal key pet and occupancy restrictions before offer strategy.",
        source: {
          title: "NYC condo board package overview",
          url: "https://www.nyc.gov/site/hpd/services-and-information/homebuyers.page",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "You spot frequent leak complaints in 311 data for a building. What is the best next puzzle piece?",
        options: ["Ignore and market anyway", "Pull DOB violations and permits", "Only ask seller agent", "Lower photo quality"],
        answerIndex: 1,
        explanation: "DOB violations/permits help verify whether underlying issues were resolved.",
        source: {
          title: "NYC Open Data 311",
          url: "https://data.cityofnewyork.us/Social-Services/311-Service-Requests/erm2-nwe9",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "A co-op buyer has 20% down but low post-close liquidity. Which board metric is likely the blocker?",
        options: ["Debt-to-income and liquidity requirement", "Favorite paint color", "Borough preference", "Open-house timing"],
        answerIndex: 0,
        explanation: "Many co-op boards evaluate debt-to-income and post-closing liquidity thresholds.",
        source: {
          title: "NYS fair housing and co-op process guidance",
          url: "https://dos.ny.gov/system/files/documents/2022/08/real-estate-license-law.pdf",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "The listing says 'legal 2-family'. Which record is the strongest verification clue?",
        options: ["Social media post", "Certificate of Occupancy", "StreetEasy comments", "Broker postcard"],
        answerIndex: 1,
        explanation: "Certificate of Occupancy is a primary record for legal use/occupancy status.",
        source: {
          title: "NYC DOB property records",
          url: "https://www.nyc.gov/site/buildings/property-or-business-owner/bis.page",
          verifiedAt: "2026-05-01"
        }
      }
    ]
  },
  {
    id: "memory-open-house",
    category: "Memory",
    title: "Open House Memory Match",
    description: "Remember key facts from quick-fire buyer scenarios.",
    questions: [
      {
        prompt: "A tenant paid one month security deposit last week. Under HSTPA, what is the usual cap?",
        options: ["Half month", "One month", "Two months", "No cap"],
        answerIndex: 1,
        explanation: "HSTPA generally limits residential security deposits to one month.",
        source: {
          title: "NY AG tenant rights",
          url: "https://ag.ny.gov/publications/residential-tenants-rights-guide",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Which law section codifies warranty of habitability in NY?",
        options: ["RPL §235-b", "RPL §220", "RPL §339", "RPL §443"],
        answerIndex: 0,
        explanation: "Warranty of habitability is in Real Property Law §235-b.",
        source: {
          title: "NYS Senate - RPL §235-b",
          url: "https://www.nysenate.gov/legislation/laws/RPP/235-B",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "DUMBO stands for:",
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
    id: "realtor-skills-sprint",
    category: "Realtor Skills",
    title: "Realtor Skills Sprint",
    description: "Test practical brokerage judgment and compliance instincts.",
    questions: [
      {
        prompt: "A buyer asks for agency disclosure timing in NY. When should it be provided?",
        options: ["At first substantive contact", "At closing only", "After inspection", "Only if requested"],
        answerIndex: 0,
        explanation: "NY agency disclosure is expected at first substantive contact in most situations.",
        source: {
          title: "NYS DOS agency disclosure form",
          url: "https://dos.ny.gov/system/files/documents/2022/08/1736-f.pdf",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Best immediate response to a fair-housing steering request from a client?",
        options: ["Comply quietly", "Refuse and provide objective criteria-based options", "Ignore message", "Send to another agent"],
        answerIndex: 1,
        explanation: "Agents should avoid steering and offer objective, lawful search criteria guidance.",
        source: {
          title: "HUD Fair Housing guidance",
          url: "https://www.hud.gov/fairhousing",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Which NYC source is most useful for checking flood risk context during buyer counseling?",
        options: ["FEMA flood maps", "Restaurant grades", "Subway map only", "Tax lot photo"],
        answerIndex: 0,
        explanation: "FEMA flood maps are core references for flood-zone risk context.",
        source: {
          title: "FEMA Flood Map Service Center",
          url: "https://msc.fema.gov/portal/home",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "If a listing has accepted offer status, what communication style keeps backup buyers engaged best?",
        options: ["No updates", "Transparent status updates with permission-based follow-up", "Promise guaranteed acceptance", "Share private seller details"],
        answerIndex: 1,
        explanation: "Clear, compliant status communication can preserve backup-buyer interest.",
        source: {
          title: "NAR Code of Ethics resources",
          url: "https://www.nar.realtor/about-nar/governing-documents/the-code-of-ethics",
          verifiedAt: "2026-05-01"
        }
      }
    ]
  },
  {
    id: "team-building-broker-boost",
    category: "Team Building",
    title: "Broker Boost Team Round",
    description: "Collaborative decision-making scenarios for office teams.",
    questions: [
      {
        prompt: "Your team has three hot leads at once. Best first team action?",
        options: ["Everyone calls same lead", "Assign clear ownership and shared notes", "Wait until tomorrow", "Only text all leads"],
        answerIndex: 1,
        explanation: "Clear lead ownership and shared CRM notes prevent duplicate outreach.",
        source: {
          title: "NAR team efficiency resources",
          url: "https://www.nar.realtor/research-and-statistics",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "A showing is double-booked by mistake. Best team-building response?",
        options: ["Blame the newest agent", "Quick huddle, apologize, and reassign coverage", "Cancel both", "Ignore conflict"],
        answerIndex: 1,
        explanation: "Rapid coordination and professional communication protects client trust.",
        source: {
          title: "NAR professionalism resources",
          url: "https://www.nar.realtor/code-of-ethics-and-arbitration-manual",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "For weekly market prep, what team practice improves consistency most?",
        options: ["No agenda", "Shared checklist and role rotation", "Random volunteer updates", "Only manager speaks"],
        answerIndex: 1,
        explanation: "Shared checklists and rotating ownership improve repeatability and buy-in.",
        source: {
          title: "Project management collaboration best practices",
          url: "https://www.pmi.org/learning/library",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Two agents disagree on offer strategy. Team lead should prioritize:",
        options: ["Fastest talker wins", "Data-backed options and respectful decision protocol", "Coin toss", "Ignore disagreement"],
        answerIndex: 1,
        explanation: "A clear, respectful decision framework keeps team alignment high.",
        source: {
          title: "NAR communication and leadership resources",
          url: "https://www.nar.realtor/brokerage-management",
          verifiedAt: "2026-05-01"
        }
      }
    ]
  },
  {
    id: "virtual-escape-listing-lock",
    category: "Virtual Escape Room",
    title: "Virtual Escape: Listing Lock",
    description: "Crack each clue to unlock the final closing code.",
    questions: [
      {
        prompt: "Clue 1: To unlock the file room, identify the office that stores NYC Certificates of Occupancy.",
        options: ["DOB", "DOHMH", "MTA", "DSNY"],
        answerIndex: 0,
        explanation: "DOB maintains certificates of occupancy records.",
        source: {
          title: "NYC DOB property records",
          url: "https://www.nyc.gov/site/buildings/property-or-business-owner/bis.page",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Clue 2: The vault opens if you choose the dataset most used to review complaint patterns.",
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
        prompt: "Clue 3: The final keypad asks which borough includes Astoria.",
        options: ["Manhattan", "Queens", "Brooklyn", "Bronx"],
        answerIndex: 1,
        explanation: "Astoria is a neighborhood in Queens.",
        source: {
          title: "NYC Planning community profiles",
          url: "https://communityprofiles.planning.nyc.gov/",
          verifiedAt: "2026-05-01"
        }
      },
      {
        prompt: "Final clue: Enter the year the modern NYC Zoning Resolution was adopted.",
        options: ["1916", "1961", "1977", "1993"],
        answerIndex: 1,
        explanation: "The modern NYC Zoning Resolution was adopted in 1961.",
        source: {
          title: "NYC DCP zoning background",
          url: "https://www.nyc.gov/site/planning/zoning/background.page",
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
    category: g.category,
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

function matchSummary(room, sortedPlayers) {
  const game = gameById(room.selectedGameId);
  const lastQuestionIndex = game ? game.questions.length - 1 : -1;
  const complete = Boolean(room.gameStarted && !room.roundActive && game && room.questionIndex === lastQuestionIndex);
  if (!complete) return { started: Boolean(room.gameStarted), complete: false, winner: null };
  if (!sortedPlayers.length) return { started: true, complete: true, winner: null };
  const topScore = sortedPlayers[0].score;
  const leaders = sortedPlayers.filter((p) => p.score === topScore);
  return {
    started: true,
    complete: true,
    winner: {
      score: topScore,
      tie: leaders.length > 1,
      playerIds: leaders.map((p) => p.id),
      names: leaders.map((p) => p.name)
    }
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
        gameStarted: false,
        players: {}
      };
  }

  async save() {
    await this.state.storage.put("room", this.room);
  }

  snapshot(clientId) {
    const players = Object.values(this.room.players).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    const msLeft = this.room.roundEndsAt ? Math.max(0, this.room.roundEndsAt - Date.now()) : 0;
    const currentGame = gameById(this.room.selectedGameId);
    return {
      type: "room-state",
      roomCode: this.room.roomCode,
      selectedGameId: this.room.selectedGameId,
      games: gameCatalog(),
      currentGame: currentGame
        ? {
            id: currentGame.id,
            title: currentGame.title,
            category: currentGame.category,
            questionCount: currentGame.questions.length
          }
        : null,
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
      match: matchSummary(this.room, players),
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
      this.room.gameStarted = false;
      for (const p of Object.values(this.room.players)) p.score = 0;
      await this.save();
      return this.broadcast();
    }

    if (msg.type === "host-start-game") {
      if (!this.room.selectedGameId) return this.send(id, { type: "error", message: "Select a game first." });
      this.room.questionIndex = 0;
      this.room.roundActive = true;
      this.room.gameStarted = true;
      this.room.roundDurationMs = ROUND_DURATION_MS;
      this.room.roundEndsAt = Date.now() + this.room.roundDurationMs;
      this.room.answered = [];
      for (const p of Object.values(this.room.players)) p.score = 0;
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
        gameStarted: false,
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
:root{--bg:#1a1230;--bg2:#271946;--card:#22153d;--card2:#2d1c52;--border:#7f55d8;--text:#f7f1ff;--muted:#d3c2ff;--good:#6cffbf;--bad:#ff9cae;--accent:#a43dff;--accent2:#6f2bff;--pill:#3a2263}
*{box-sizing:border-box}body{font-family:Inter,system-ui;margin:0;background:radial-gradient(circle at 20% 10%,#5a2fbf 0,#2a1b4d 48%,#1a1230 100%);color:var(--text);min-height:100vh}
main{max-width:1120px;margin:auto;padding:18px;display:grid;gap:14px}.card{background:linear-gradient(160deg,var(--card),var(--card2));border:1px solid var(--border);border-radius:20px;padding:16px;box-shadow:0 18px 44px rgba(12,2,28,.55)}
.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}button,input,select{padding:11px 12px;border-radius:12px;border:1px solid #9668f7;font-size:15px;color:var(--text);background:#2a1b4a}
button{background:linear-gradient(135deg,var(--accent),var(--accent2));border:0;font-weight:600;cursor:pointer;transition:transform .15s ease,filter .15s ease}button:hover{transform:translateY(-1px);filter:brightness(1.08)}button:disabled{opacity:.55;cursor:not-allowed;transform:none}
button.alt{background:#3a2461;color:#f2eaff;border:1px solid #af92f9}.hidden{display:none!important}.games{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.pill{display:inline-block;background:var(--pill);color:#f2e7ff;border:1px solid #9c78f2;border-radius:999px;padding:2px 9px;font-size:12px;font-weight:700;letter-spacing:.03em}
table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #6a47be;padding:7px;text-align:left}.winner-row td{background:rgba(177,130,255,.18)}
.timer{font-weight:700;margin:8px 0 6px;color:#f8e5ff;transition:color .2s ease}.timer.urgent{color:#ffe08f;animation:pulse .8s ease infinite}.timer.expired{color:var(--bad)}
.progress{height:8px;background:#180e2f;border-radius:999px;overflow:hidden;border:1px solid #5b3d9f}.progress > div{height:100%;width:100%;background:linear-gradient(90deg,#dd53ff,#8f4dff);transition:width .2s linear}
#qArea{position:relative;overflow:hidden}.qPrompt{font-size:1.08rem;line-height:1.4;margin-bottom:10px}.answers-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px}
.answer-btn{background:#4b2b7f;border:1px solid #aa83ff}.answer-btn:hover{background:#5a3498}.answer-btn.selected{outline:2px solid #f0cbff;box-shadow:0 0 0 4px rgba(194,115,255,.25)}
.feedback{min-height:72px;padding:10px;border-radius:14px;background:rgba(20,10,42,.45);border:1px solid #8d64da;transition:transform .2s ease}
.feedback.ok{border-color:#54d39b;background:rgba(33,108,78,.26);animation:pop .35s ease}.feedback.bad{border-color:#d67688;background:rgba(121,45,62,.27);animation:shake .25s ease}
.flare{position:absolute;inset:0;pointer-events:none;opacity:0}.flare.show.good{opacity:1;animation:goodFlare .7s ease}.flare.show.bad{opacity:1;animation:badFlare .55s ease}
.catalog-card{transition:transform .2s ease,border-color .2s ease}.catalog-card:hover{transform:translateY(-2px);border-color:#c09fff}
.winner-banner{margin:8px 0 10px;padding:11px;border-radius:13px;background:rgba(153,101,246,.2);border:1px solid #b591ff;color:#f8ecff;font-weight:600}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}@keyframes pop{0%{transform:scale(.96)}100%{transform:scale(1)}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@keyframes goodFlare{0%{background:radial-gradient(circle at center,rgba(120,255,195,.35),rgba(0,0,0,0) 60%)}100%{background:radial-gradient(circle at center,rgba(120,255,195,0),rgba(0,0,0,0) 70%)}}
@keyframes badFlare{0%{background:radial-gradient(circle at center,rgba(255,126,154,.35),rgba(0,0,0,0) 60%)}100%{background:radial-gradient(circle at center,rgba(255,126,154,0),rgba(0,0,0,0) 70%)}}
@media(max-width:640px){button,input,select{width:100%}}
</style></head><body><main>
<section class="card"><h1>🏙️ NY Real Estate Games</h1><p>Host on desktop, players join on phone for quick purple-themed gameplay rounds.</p><div id="catalog" class="games"></div></section>
<section class="card"><div class="row"><button id="hostMode">I'm hosting</button><button id="playerMode" class="alt">I'm joining as player</button></div></section>
<section class="card" id="hostPanel"><h2>Host</h2><div class="row"><input id="hostName" value="Broker Host" maxlength="32"><button id="createRoom">Create room</button></div>
<div id="hostLive" class="hidden"><p><b>Room:</b> <span id="roomCode"></span></p><p><b>Join:</b> <a id="joinUrl" href="#"></a></p><img id="qr" alt="qr" width="210" height="210">
<div class="row"><select id="gameSelect"></select><button id="startBtn">Start</button><button id="nextBtn" class="alt">Next</button><button id="endBtn" class="alt">End</button></div>
<p id="hostTimer" class="timer">Timer: --</p><div class="progress"><div id="hostTimerBar"></div></div><p id="hostProgress">Waiting to start.</p><p id="hostWinner" class="winner-banner">🏁 Winner appears when the match ends.</p></div>
<h3>Total Scoreboard</h3><table><thead><tr><th>Name</th><th>Score</th><th>Status</th></tr></thead><tbody id="hostRows"></tbody></table></section>
<section class="card hidden" id="playerPanel"><h2>Player</h2><div class="row"><input id="playerName" placeholder="Your name" maxlength="32"><input id="playerCode" placeholder="Room code" maxlength="6"><button id="joinBtn">Join room</button></div>
<p id="joinStatus">Enter room code from host.</p><div id="qArea" class="hidden"><div id="resultFlare" class="flare"></div><h3 id="qTitle"></h3><p id="qPrompt" class="qPrompt"></p>
<p id="playerTimer" class="timer">Timer: --</p><div class="progress"><div id="playerTimerBar"></div></div><div id="answers" class="answers-grid"></div><p id="result" class="feedback">Choose your answer before time runs out.</p></div>
<p id="playerWinner" class="winner-banner">🏁 Winner appears when the match ends.</p><h3>Total Scoreboard</h3><table><thead><tr><th>Name</th><th>Score</th><th>Answered</th></tr></thead><tbody id="playerRows"></tbody></table></section>
</main><script>
const FLARE_ANIMATION_DURATION_MS=700;
const S={host:{ws:null,room:null,token:null},player:{ws:null,hasAnswered:false},games:[],lastQuestionKey:null,timerId:null,lastTickSecond:null,currentRound:null,timeUpHandled:false,audioCtx:null,currentMatch:null};
const byId=(id)=>document.getElementById(id);const hostPanel=byId("hostPanel"),playerPanel=byId("playerPanel");
function clean(v){return (v||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6)}
function mode(m){hostPanel.classList.toggle("hidden",m!=="host");playerPanel.classList.toggle("hidden",m==="host")}
function rows(el,players,answered,winnerIds){el.innerHTML="";if(!players.length){el.innerHTML='<tr><td colspan="3">No players yet.</td></tr>';return;}
players.forEach(p=>{const tr=document.createElement("tr");if((winnerIds||[]).includes(p.id))tr.className="winner-row";tr.innerHTML='<td>'+(((winnerIds||[]).includes(p.id)?'🏆 ':'')+p.name)+'</td><td>'+p.score+'</td><td>'+(answered?(p.answeredCurrent?"✅":"—"):"Online")+'</td>';el.appendChild(tr);});}
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
function renderQuestion(q,round,match){const active=round.active&&q;byId("qArea").classList.toggle("hidden",!active);if(!active){byId("result").className="feedback";byId("result").textContent=match&&match.complete?"Match complete. Winner posted in scoreboard.":"Waiting for host.";return;}
byId("qTitle").textContent='Question '+(q.index+1)+' of '+q.total;byId("qPrompt").textContent=q.prompt;const answers=byId("answers");answers.innerHTML="";
q.options.forEach((o,i)=>{const b=document.createElement("button");b.className="answer-btn";b.textContent=o;b.onclick=()=>{if(S.player.ws)S.player.ws.send(JSON.stringify({type:"player-answer",answerIndex:i}));
S.player.hasAnswered=true;b.classList.add("selected");toggleAnswerButtons(true);};answers.appendChild(b);});
toggleAnswerButtons(S.player.hasAnswered||round.msLeft<=0);}
function winnerText(match){if(!match||!match.complete||!match.winner)return"🏁 Winner appears when the match ends.";return match.winner.tie?'🤝 Tie winner: '+match.winner.names.join(', ')+' • '+match.winner.score+' pts':'🏆 Winner: '+match.winner.names[0]+' • '+match.winner.score+' pts';}
function applyState(r){S.currentRound=r.round;S.currentMatch=r.match||null;const winnerIds=r.match&&r.match.winner?r.match.winner.playerIds:[];
rows(byId("hostRows"),r.players,false,winnerIds);rows(byId("playerRows"),r.players,true,winnerIds);byId("startBtn").disabled=!r.selectedGameId;byId("nextBtn").disabled=!r.round.active;byId("endBtn").disabled=!r.round.active;
byId("hostWinner").textContent=winnerText(r.match);byId("playerWinner").textContent=winnerText(r.match);
if(r.selectedGameId)byId("gameSelect").value=r.selectedGameId;const q=r.round.question;const questionKey=q?String(q.index)+"-"+String(r.round.endsAt):"none";
if(S.lastQuestionKey!==questionKey){S.lastQuestionKey=questionKey;S.player.hasAnswered=false;S.timeUpHandled=false;byId("result").className="feedback";byId("result").textContent="Choose your answer before time runs out.";}
if(q){const remainingSeconds=Math.ceil(Math.max(0,r.round.msLeft||0)/1000);const gameLabel=r.currentGame?('['+r.currentGame.category+'] '+r.currentGame.title+' • '):'';byId("hostProgress").textContent=gameLabel+'Question '+(q.index+1)+'/'+q.total+' • Responses '+r.round.responsesCount+'/'+r.round.totalPlayers+' • '+remainingSeconds+'s left';}
else if(r.match&&r.match.complete)byId("hostProgress").textContent="Match complete. Total scoreboard winner is highlighted.";
else byId("hostProgress").textContent="Waiting to start.";
renderQuestion(q,r.round,r.match);updateTimerUi("hostTimer","hostTimerBar",r.round);updateTimerUi("playerTimer","playerTimerBar",r.round);
if(r.round.active&&q&&r.round.endsAt)startRoundTicker();else stopRoundTicker();}
function groupedGames(games){const grouped={};games.forEach(g=>{if(!grouped[g.category])grouped[g.category]=[];grouped[g.category].push(g);});return grouped;}
async function loadCatalog(){const r=await fetch("/api/games");const p=await r.json();S.games=p.games||[];const grouped=groupedGames(S.games);const categories=Object.keys(grouped);
byId("catalog").innerHTML=S.games.map(g=>'<div class="card catalog-card"><span class="pill">'+g.category+'</span><h3>'+g.title+'</h3><p>'+g.description+'</p><p>Questions: '+g.questionCount+'</p></div>').join("");
byId("gameSelect").innerHTML='<option value="">Select game</option>'+categories.map(cat=>'<optgroup label="'+cat+'">'+grouped[cat].map(g=>'<option value="'+g.id+'">'+g.title+' ('+g.questionCount+')</option>').join("")+'</optgroup>').join("");}
async function createRoom(){const r=await fetch("/api/create-room",{method:"POST"});const p=await r.json();if(!r.ok)return alert(p.error||"Failed creating room");
S.host.room=p.roomCode;S.host.token=p.hostToken;byId("hostLive").classList.remove("hidden");byId("roomCode").textContent=p.roomCode;byId("joinUrl").textContent=p.joinUrl;byId("joinUrl").href=p.joinUrl;
byId("qr").src='https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='+encodeURIComponent(p.joinUrl);if(S.host.ws)S.host.ws.close();
S.host.ws=ws({role:"host",room:p.roomCode,name:byId("hostName").value||"Host",token:p.hostToken,onMessage:(m)=>{if(m.type==="room-state")applyState(m);},onClose:()=>{byId("hostProgress").textContent="Host disconnected.";}});}
function joinRoom(){const room=clean(byId("playerCode").value),name=(byId("playerName").value||"").trim();if(room.length!==6)return byId("joinStatus").textContent="Enter valid 6-char code.";if(!name)return byId("joinStatus").textContent="Enter name.";
if(S.player.ws)S.player.ws.close();byId("joinStatus").textContent="Connecting...";S.player.ws=ws({role:"player",room,name,onOpen:()=>byId("joinStatus").textContent='Connected to '+room,onMessage:(m)=>{if(m.type==="room-state")applyState(m);
if(m.type==="answer-result"){byId("result").className=m.isCorrect?"feedback ok":"feedback bad";byId("result").innerHTML=(m.isCorrect?"✅ Correct! ":"❌ Not this time. ")+"Answer: <b>"+m.correctAnswer+"</b><br>"+m.explanation+"<br><a target="_blank" rel="noopener noreferrer" href=""+m.source.url+'">Source: '+m.source.title+'</a> (verified '+m.source.verifiedAt+')';
if(m.isCorrect){playCorrect();showFlare("good");}else{playWrong();showFlare("bad");}}
if(m.type==="error")byId("joinStatus").textContent=m.message;},onClose:()=>byId("joinStatus").textContent="Disconnected"});}
byId("hostMode").onclick=()=>mode("host");byId("playerMode").onclick=()=>mode("player");byId("createRoom").onclick=createRoom;byId("joinBtn").onclick=joinRoom;
byId("gameSelect").onchange=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-select-game",gameId:byId("gameSelect").value}));
byId("startBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-start-game"}));byId("nextBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-next-question"}));byId("endBtn").onclick=()=>S.host.ws&&S.host.ws.send(JSON.stringify({type:"host-end-round"}));
const pathMatch=location.pathname.match(/^\/join\/([A-Za-z0-9]+)/);if(pathMatch){mode("player");byId("playerCode").value=clean(pathMatch[1]);}
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
