import io
import csv
import json
import time
import os
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from database import get_db
from services.persona_service import analyze_personas
from services.infrastructure_service import analyze_infrastructure_indicators
from services.confidence_service import calculate_attribution_confidence

app = FastAPI(
    title="DARKTRACE API",
    description="Dark Web Threat Intelligence & Actor Attribution Platform API (SIH 2026 PS 26151)",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRONTEND_DIST = os.path.join(ROOT_DIR, "public")
if not os.path.exists(FRONTEND_DIST):
    FRONTEND_DIST = os.path.join(ROOT_DIR, "dist")
if not os.path.exists(FRONTEND_DIST):
    FRONTEND_DIST = os.path.join(ROOT_DIR, "frontend", "dist")

INDEX_FILE = os.path.join(FRONTEND_DIST, "index.html")
ASSETS_DIR = os.path.join(FRONTEND_DIST, "assets")

if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")


@app.get("/")
def serve_root():
    if os.path.exists(INDEX_FILE):
        return FileResponse(INDEX_FILE)
    return {"message": "DARKTRACE API running", "status": "online"}

from fastapi import Request

@app.get("/api")
@app.get("/api/")
@app.get("/api/index.py")
@app.get("/api/health")
def api_status(request: Request):
    matched = request.headers.get("x-matched-path") or request.headers.get("x-vercel-matched-path")
    return {
        "message": "DARKTRACE API running",
        "status": "online",
        "path": request.scope.get("path"),
        "matched": matched,
        "query": str(request.query_params)
    }


# ----------------- PYDANTIC MODELS ----------------- #

class PersonaAnalysisRequest(BaseModel):
    persona_a_id: str
    persona_b_id: str
    custom_text_a: Optional[str] = None
    custom_text_b: Optional[str] = None

class InfrastructureAnalysisRequest(BaseModel):
    indicator_id: Optional[str] = None
    onion_address: Optional[str] = "hs-demo-7f3a.onion"
    server_status_exposed: Optional[int] = 1
    ssl_cert_hash: Optional[str] = "SHA256:8f9a2b4c7d6e5a1b3c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5a4b3c2d1e0f9a8b7c"
    banner_text: Optional[str] = "Apache/2.4.52 (Ubuntu) mod_ssl/2.4.52 OpenSSL/3.0.2"
    descriptor_anomaly: Optional[int] = 1
    infrastructure_fingerprint: Optional[str] = "FP-NGINX-UBUNTU-2204-TLS13"
    candidate_clearnet_domain: Optional[str] = "demo-infrastructure.example"
    candidate_ip: Optional[str] = "198.51.100.42 (SIMULATED RFC 5737 TEST-NET)"

class ReportGenerateRequest(BaseModel):
    report_type: str = "actor_intelligence"  # actor_intelligence, infrastructure, persona_linkage, executive_summary
    actor_id: Optional[str] = "actor-001"
    include_timeline: bool = True
    include_infrastructure: bool = True
    include_graph: bool = True

# ----------------- ENDPOINTS ----------------- #

@app.get("/api/dashboard")
def get_dashboard():
    conn = get_db()
    cursor = conn.cursor()

    # Dynamic counts from DB
    actors_count = cursor.execute("SELECT COUNT(*) FROM actors").fetchone()[0]
    sources_count = cursor.execute("SELECT COUNT(*) FROM sources").fetchone()[0]
    personas_count = cursor.execute("SELECT COUNT(*) FROM personas").fetchone()[0]
    infra_count = cursor.execute("SELECT COUNT(*) FROM infrastructure_indicators").fetchone()[0]

    # Category breakdown
    categories_raw = cursor.execute(
        "SELECT category, COUNT(*) as count FROM actors GROUP BY category"
    ).fetchall()
    categories = [{"name": row["category"], "count": row["count"]} for row in categories_raw]

    # Recent intelligence observations
    recent_obs = cursor.execute(
        "SELECT * FROM observations ORDER BY id DESC LIMIT 8"
    ).fetchall()
    recent_intelligence = [dict(row) for row in recent_obs]

    # Monitoring stats
    stats_row = cursor.execute("SELECT * FROM monitoring_stats WHERE id = 1").fetchone()
    monitoring_stats = dict(stats_row) if stats_row else {
        "is_active": 1, "sources_monitored": 24, "collection_interval_mins": 15,
        "last_run": "18:42", "next_run": "18:57", "new_footprints": 37,
        "new_actors": 2, "new_relationships": 12, "new_persona_candidates": 4,
        "infrastructure_changes": 7
    }

    # Simulated 30-day activity trend for Recharts
    activity_timeline = [
        {"date": "Day -30", "footprints": 45, "correlations": 8, "alerts": 2},
        {"date": "Day -25", "footprints": 62, "correlations": 14, "alerts": 4},
        {"date": "Day -20", "footprints": 89, "correlations": 19, "alerts": 5},
        {"date": "Day -15", "footprints": 110, "correlations": 24, "alerts": 7},
        {"date": "Day -10", "footprints": 95, "correlations": 21, "alerts": 3},
        {"date": "Day -5", "footprints": 140, "correlations": 32, "alerts": 9},
        {"date": "Today", "footprints": 168, "correlations": 38, "alerts": 11}
    ]

    conn.close()

    return {
        "kpis": {
            "threat_actors": 127,  # Synthetic enterprise index metric
            "threat_actors_db": actors_count,
            "active_investigations": 18,
            "linked_personas": 43,
            "infrastructure_indicators": 286,
            "high_confidence_attributions": 21,
            "sources_monitored": 24
        },
        "activity_timeline": activity_timeline,
        "categories": categories,
        "recent_intelligence": recent_intelligence,
        "monitoring": monitoring_stats
    }

@app.get("/api/actors")
def get_actors(
    category: Optional[str] = None,
    status: Optional[str] = None,
    min_confidence: Optional[int] = None,
    search: Optional[str] = None
):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM actors WHERE 1=1"
    params = []

    if category and category != "All":
        query += " AND category = ?"
        params.append(category)

    if status and status != "All":
        query += " AND status = ?"
        params.append(status)

    if min_confidence:
        query += " AND confidence >= ?"
        params.append(min_confidence)

    if search:
        query += " AND (name LIKE ? OR primary_handle LIKE ? OR summary LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard])

    query += " ORDER BY confidence DESC"

    actors_raw = cursor.execute(query, params).fetchall()
    actors = []

    for row in actors_raw:
        actor_id = row["id"]
        # Aggregated counts
        handles = [h["handle"] for h in cursor.execute("SELECT handle FROM handles WHERE actor_id = ?", (actor_id,)).fetchall()]
        pgp_count = cursor.execute("SELECT COUNT(*) FROM pgp_keys WHERE actor_id = ?", (actor_id,)).fetchone()[0]
        wallet_count = cursor.execute("SELECT COUNT(*) FROM wallets WHERE actor_id = ?", (actor_id,)).fetchone()[0]
        persona_count = cursor.execute("SELECT COUNT(*) FROM personas WHERE actor_id = ?", (actor_id,)).fetchone()[0]
        sources = [p["platform"] for p in cursor.execute("SELECT DISTINCT platform FROM handles WHERE actor_id = ?", (actor_id,)).fetchall()]

        actor_dict = dict(row)
        actor_dict["handles"] = handles
        actor_dict["pgp_count"] = pgp_count
        actor_dict["wallet_count"] = wallet_count
        actor_dict["persona_count"] = persona_count
        actor_dict["sources"] = sources
        actors.append(actor_dict)

    conn.close()
    return actors

@app.get("/api/actors/{actor_id}")
def get_actor_detail(actor_id: str):
    conn = get_db()
    cursor = conn.cursor()

    actor_row = cursor.execute("SELECT * FROM actors WHERE id = ?", (actor_id,)).fetchone()
    if not actor_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Threat actor not found")

    actor = dict(actor_row)

    # 1. Identity Indicators
    handles = [dict(r) for r in cursor.execute("SELECT * FROM handles WHERE actor_id = ?", (actor_id,)).fetchall()]
    pgp_keys = [dict(r) for r in cursor.execute("SELECT * FROM pgp_keys WHERE actor_id = ?", (actor_id,)).fetchall()]
    wallets = [dict(r) for r in cursor.execute("SELECT * FROM wallets WHERE actor_id = ?", (actor_id,)).fetchall()]

    # 2. Marketplaces & Forums
    marketplaces = []
    forums = []
    for h in handles:
        plat_name = h["platform"]
        plat_row = cursor.execute("SELECT * FROM platforms WHERE name = ?", (plat_name,)).fetchone()
        if plat_row:
            item = dict(plat_row)
            item["observed_handle"] = h["handle"]
            if item["type"] == "Marketplace":
                marketplaces.append(item)
            else:
                forums.append(item)

    # 3. Linked Personas
    personas = [dict(r) for r in cursor.execute("SELECT * FROM personas WHERE actor_id = ?", (actor_id,)).fetchall()]
    linked_personas = []
    for p in personas:
        # Compute baseline similarity percentage
        linked_personas.append({
            "id": p["id"],
            "code": p["persona_code"],
            "handle": p["handle"],
            "platform": p["platform"],
            "similarity": 91 if "42" in p["persona_code"] else (76 if "19" in p["persona_code"] else 85),
            "status": "Correlated",
            "vocabulary_tags": p["vocabulary_tags"].split(",")
        })

    # If actor has only 1 persona in DB, provide realistic secondary linked candidate for demonstration
    if len(linked_personas) == 1:
        linked_personas.append({
            "id": "pers-sim-alt",
            "code": "PERS-ALT-09",
            "handle": f"{actor['primary_handle']}_alt",
            "platform": "DarkBazaar Demo",
            "similarity": 74,
            "status": "Candidate",
            "vocabulary_tags": ["escrow", "direct", "pgp"]
        })

    # 4. Infrastructure Indicators
    infra_raw = cursor.execute("SELECT * FROM infrastructure_indicators WHERE actor_id = ?", (actor_id,)).fetchall()
    infrastructure = [dict(r) for r in infra_raw]
    if not infrastructure:
        # Default synthetic indicator
        infrastructure = [{
            "id": f"infra-{actor_id}",
            "onion_address": f"{actor['primary_handle'].lower()}-vault-demo.onion",
            "server_status_exposed": 1,
            "ssl_cert_hash": "SHA256:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
            "banner_text": "Apache/2.4.52 (Ubuntu) mod_ssl/2.4.52",
            "descriptor_anomaly": 1,
            "infrastructure_fingerprint": "FP-NGINX-UBUNTU-2204-TLS13",
            "candidate_clearnet_domain": f"{actor['primary_handle'].lower()}-ops.example",
            "candidate_ip": "198.51.100.99 (SIMULATED RFC 5737 TEST-NET)",
            "correlation_score": 82,
            "notes": "Server-status directive leaking internal domain routing."
        }]

    # 5. Source Evidence
    source_evidence = []
    seen_sources = set()
    for h in handles:
        src_name = h["platform"]
        if src_name not in seen_sources:
            seen_sources.add(src_name)
            src_row = cursor.execute("SELECT * FROM sources WHERE name = ?", (src_name,)).fetchone()
            source_evidence.append({
                "source": src_name,
                "type": src_row["source_type"] if src_row else "Darknet Platform",
                "reliability": src_row["reliability"] if src_row else "HIGH",
                "observation_date": h["first_seen"],
                "last_scan": src_row["last_scan"] if src_row else "2026-09-23 18:42",
                "evidence_type": "Cryptographic Key & Vendor Activity Records"
            })

    # Add hidden service intelligence feed
    source_evidence.append({
        "source": "Tor Intelligence Feed Demo",
        "type": "Hidden Service",
        "reliability": "MEDIUM",
        "observation_date": actor["first_observed"],
        "last_scan": "2026-09-23 18:42",
        "evidence_type": "Server Status Directive & TLS Serial Fingerprint"
    })

    # 6. Attribution Confidence Calculation
    # Customize sub-scores based on actor confidence
    base_conf = float(actor["confidence"])
    conf_breakdown = calculate_attribution_confidence(
        identity_score=min(98.0, base_conf + 4),
        infrastructure_score=min(95.0, base_conf - 3),
        stylometric_score=min(96.0, base_conf + 2),
        behaviour_score=min(92.0, base_conf - 5),
        historical_continuity_score=min(90.0, base_conf - 8),
        cross_platform_score=min(94.0, base_conf - 2)
    )

    conn.close()

    return {
        "actor": actor,
        "identity_indicators": {
            "handles": handles,
            "pgp_keys": pgp_keys,
            "wallets": wallets
        },
        "marketplaces": marketplaces,
        "forums": forums,
        "linked_personas": linked_personas,
        "infrastructure": infrastructure,
        "source_evidence": source_evidence,
        "confidence_breakdown": conf_breakdown
    }

@app.get("/api/actors/{actor_id}/relationships")
def get_actor_relationships(actor_id: str):
    conn = get_db()
    cursor = conn.cursor()

    actor_row = cursor.execute("SELECT * FROM actors WHERE id = ?", (actor_id,)).fetchone()
    if not actor_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Actor not found")

    actor_name = actor_row["name"]

    # Gather relationships where actor is source or target
    rel_rows = cursor.execute("""
        SELECT * FROM relationships
        WHERE source_id = ? OR target_id = ?
        OR source_label = ? OR target_label = ?
    """, (actor_id, actor_id, actor_name, actor_name)).fetchall()

    nodes = []
    edges = []
    node_ids = set()

    # Add central actor node
    nodes.append({
        "id": actor_id,
        "label": actor_name,
        "type": "actor",
        "category": actor_row["category"],
        "confidence": actor_row["confidence"]
    })
    node_ids.add(actor_id)

    for r in rel_rows:
        s_id = r["source_id"]
        t_id = r["target_id"]

        if s_id not in node_ids:
            nodes.append({
                "id": s_id,
                "label": r["source_label"],
                "type": r["source_type"]
            })
            node_ids.add(s_id)

        if t_id not in node_ids:
            nodes.append({
                "id": t_id,
                "label": r["target_label"],
                "type": r["target_type"]
            })
            node_ids.add(t_id)

        edges.append({
            "id": f"edge-{r['id']}",
            "source": s_id,
            "target": t_id,
            "label": r["relation_type"],
            "confidence": r["confidence"],
            "details": r["details"]
        })

    conn.close()
    return {"nodes": nodes, "edges": edges}

@app.get("/api/actors/{actor_id}/timeline")
def get_actor_timeline(actor_id: str):
    conn = get_db()
    cursor = conn.cursor()

    events_raw = cursor.execute(
        "SELECT * FROM timeline_events WHERE actor_id = ? ORDER BY event_date ASC",
        (actor_id,)
    ).fetchall()

    events = [dict(r) for r in events_raw]
    conn.close()
    return events

@app.get("/api/infrastructure")
def get_infrastructure():
    conn = get_db()
    cursor = conn.cursor()

    rows = cursor.execute("""
        SELECT i.*, a.name as actor_name
        FROM infrastructure_indicators i
        LEFT JOIN actors a ON i.actor_id = a.id
    """).fetchall()

    infra_list = [dict(r) for r in rows]
    conn.close()
    return infra_list

@app.post("/api/infrastructure/analyze")
def analyze_infrastructure(req: InfrastructureAnalysisRequest):
    # Runs the simulated correlation engine
    res = analyze_infrastructure_indicators(req.dict())
    return res

@app.get("/api/personas")
def get_personas():
    conn = get_db()
    cursor = conn.cursor()

    rows = cursor.execute("""
        SELECT p.*, a.name as actor_name
        FROM personas p
        LEFT JOIN actors a ON p.actor_id = a.id
    """).fetchall()

    personas = []
    for r in rows:
        item = dict(r)
        item["active_hours"] = json.loads(item["active_hours"]) if isinstance(item["active_hours"], str) else item["active_hours"]
        item["vocabulary_tags"] = [t.strip() for t in item["vocabulary_tags"].split(",") if t.strip()]
        personas.append(item)

    conn.close()
    return personas

@app.post("/api/persona/analyze")
def run_persona_analysis(req: PersonaAnalysisRequest):
    conn = get_db()
    cursor = conn.cursor()

    row_a = cursor.execute("SELECT * FROM personas WHERE id = ?", (req.persona_a_id,)).fetchone()
    row_b = cursor.execute("SELECT * FROM personas WHERE id = ?", (req.persona_b_id,)).fetchone()

    conn.close()

    if not row_a or not row_b:
        raise HTTPException(status_code=404, detail="One or both persona entities not found")

    dict_a = dict(row_a)
    dict_b = dict(row_b)

    if req.custom_text_a:
        dict_a["corpus_text"] = req.custom_text_a
    if req.custom_text_b:
        dict_b["corpus_text"] = req.custom_text_b

    result = analyze_personas(dict_a, dict_b)
    return result

@app.get("/api/relationships")
def get_all_relationships(
    filter_type: Optional[str] = None,
    actor_id: Optional[str] = None
):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM relationships WHERE 1=1"
    params = []

    if actor_id:
        query += " AND (source_id = ? OR target_id = ?)"
        params.extend([actor_id, actor_id])

    rel_rows = cursor.execute(query, params).fetchall()

    nodes = []
    edges = []
    node_ids = set()

    for r in rel_rows:
        s_id = r["source_id"]
        t_id = r["target_id"]
        s_type = r["source_type"]
        t_type = r["target_type"]

        if filter_type and filter_type != "ALL":
            if s_type != filter_type and t_type != filter_type:
                continue

        if s_id not in node_ids:
            nodes.append({
                "id": s_id,
                "label": r["source_label"],
                "type": s_type
            })
            node_ids.add(s_id)

        if t_id not in node_ids:
            nodes.append({
                "id": t_id,
                "label": r["target_label"],
                "type": t_type
            })
            node_ids.add(t_id)

        edges.append({
            "id": f"edge-{r['id']}",
            "source": s_id,
            "target": t_id,
            "label": r["relation_type"],
            "confidence": r["confidence"],
            "details": r["details"]
        })

    conn.close()
    return {"nodes": nodes, "edges": edges}

@app.get("/api/timeline")
def get_timeline(
    actor_id: Optional[str] = None,
    event_type: Optional[str] = None,
    source: Optional[str] = None
):
    conn = get_db()
    cursor = conn.cursor()

    query = """
        SELECT t.*, a.name as actor_name
        FROM timeline_events t
        LEFT JOIN actors a ON t.actor_id = a.id
        WHERE 1=1
    """
    params = []

    if actor_id and actor_id != "ALL":
        query += " AND t.actor_id = ?"
        params.append(actor_id)

    if event_type and event_type != "ALL":
        query += " AND t.event_type = ?"
        params.append(event_type)

    if source and source != "ALL":
        query += " AND t.source_name = ?"
        params.append(source)

    query += " ORDER BY t.event_date DESC"

    rows = cursor.execute(query, params).fetchall()
    events = [dict(r) for r in rows]

    conn.close()
    return events

@app.get("/api/sources")
def get_sources(source_type: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM sources WHERE 1=1"
    params = []
    if source_type and source_type != "ALL":
        query += " AND source_type = ?"
        params.append(source_type)

    rows = cursor.execute(query, params).fetchall()
    sources = [dict(r) for r in rows]
    conn.close()
    return sources

@app.post("/api/collection/run")
def run_collection_cycle():
    """
    Simulates autonomous monitoring footprint collection cycle.
    Updates statistics, records simulated observation, and updates timestamps.
    """
    conn = get_db()
    cursor = conn.cursor()

    now_str = datetime.now().strftime("%H:%M")
    next_min = (datetime.now().minute + 15) % 60
    next_hour = (datetime.now().hour + ((datetime.now().minute + 15) // 60)) % 24
    next_str = f"{next_hour:02d}:{next_min:02d}"

    # Update monitoring stats with new incremental cycle metrics
    cursor.execute("""
        UPDATE monitoring_stats SET
            last_run = ?,
            next_run = ?,
            new_footprints = new_footprints + 14,
            new_relationships = new_relationships + 3,
            new_persona_candidates = new_persona_candidates + 1,
            infrastructure_changes = infrastructure_changes + 2
        WHERE id = 1
    """, (now_str, next_str))

    # Insert a new observation into recent intelligence feed
    cursor.execute("""
        INSERT INTO observations (actor_id, actor_name, source_name, indicator, category, confidence, timestamp)
        VALUES ('actor-001', 'ShadowX', 'Market Alpha', 'Fresh encrypted listing detected in escrow queue', 'Data Theft', 92, 'Just now')
    """)

    conn.commit()

    stats = dict(cursor.execute("SELECT * FROM monitoring_stats WHERE id = 1").fetchone())
    conn.close()

    return {
        "status": "SUCCESS",
        "message": f"Autonomous collection cycle completed at {now_str}. 14 new synthetic footprints ingested.",
        "stats": stats
    }

@app.get("/api/search")
def global_search(q: str = Query(..., min_length=1)):
    """
    Global categorized search across actors, handles, wallets, PGP, infrastructure, and personas.
    """
    conn = get_db()
    cursor = conn.cursor()
    query = f"%{q.lower()}%"

    results = {
        "actors": [],
        "handles": [],
        "wallets": [],
        "pgp_keys": [],
        "infrastructure": [],
        "personas": []
    }

    # 1. Actors
    actor_matches = cursor.execute("""
        SELECT id, name, category, confidence, status
        FROM actors
        WHERE LOWER(name) LIKE ? OR LOWER(primary_handle) LIKE ?
    """, (query, query)).fetchall()
    results["actors"] = [dict(r) for r in actor_matches]

    # 2. Handles
    handle_matches = cursor.execute("""
        SELECT h.handle, h.platform, a.id as actor_id, a.name as actor_name
        FROM handles h
        JOIN actors a ON h.actor_id = a.id
        WHERE LOWER(h.handle) LIKE ?
    """, (query,)).fetchall()
    results["handles"] = [dict(r) for r in handle_matches]

    # 3. Wallets
    wallet_matches = cursor.execute("""
        SELECT w.address, w.currency, w.cluster_label, a.id as actor_id, a.name as actor_name
        FROM wallets w
        JOIN actors a ON w.actor_id = a.id
        WHERE LOWER(w.address) LIKE ? OR LOWER(w.cluster_label) LIKE ?
    """, (query, query)).fetchall()
    results["wallets"] = [dict(r) for r in wallet_matches]

    # 4. PGP
    pgp_matches = cursor.execute("""
        SELECT p.fingerprint, p.key_id, p.email_alias, a.id as actor_id, a.name as actor_name
        FROM pgp_keys p
        JOIN actors a ON p.actor_id = a.id
        WHERE LOWER(p.fingerprint) LIKE ? OR LOWER(p.key_id) LIKE ? OR LOWER(p.email_alias) LIKE ?
    """, (query, query, query)).fetchall()
    results["pgp_keys"] = [dict(r) for r in pgp_matches]

    # 5. Infrastructure
    infra_matches = cursor.execute("""
        SELECT i.onion_address, i.candidate_clearnet_domain, i.candidate_ip, i.correlation_score, a.id as actor_id, a.name as actor_name
        FROM infrastructure_indicators i
        JOIN actors a ON i.actor_id = a.id
        WHERE LOWER(i.onion_address) LIKE ? OR LOWER(i.candidate_clearnet_domain) LIKE ?
    """, (query, query)).fetchall()
    results["infrastructure"] = [dict(r) for r in infra_matches]

    # 6. Personas
    persona_matches = cursor.execute("""
        SELECT p.id, p.persona_code, p.handle, p.platform, a.id as actor_id, a.name as actor_name
        FROM personas p
        JOIN actors a ON p.actor_id = a.id
        WHERE LOWER(p.handle) LIKE ? OR LOWER(p.persona_code) LIKE ?
    """, (query, query)).fetchall()
    results["personas"] = [dict(r) for r in persona_matches]

    conn.close()

    total_count = sum(len(v) for v in results.values())
    return {
        "query": q,
        "total_results": total_count,
        "results": results
    }

@app.get("/api/export/actors/csv")
def export_actors_csv():
    conn = get_db()
    cursor = conn.cursor()

    rows = cursor.execute("SELECT * FROM actors ORDER BY confidence DESC").fetchall()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Actor ID", "Name", "Primary Handle", "Threat Category",
        "Threat Level", "Confidence (%)", "Status", "First Observed", "Last Seen", "Summary"
    ])

    for r in rows:
        writer.writerow([
            r["id"], r["name"], r["primary_handle"], r["category"],
            r["threat_level"], r["confidence"], r["status"],
            r["first_observed"], r["last_seen"], r["summary"]
        ])

    conn.close()
    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=darktrace_threat_actors.csv"}
    )

@app.get("/api/export/actors/json")
def export_actors_json():
    conn = get_db()
    cursor = conn.cursor()

    actors_raw = cursor.execute("SELECT * FROM actors ORDER BY confidence DESC").fetchall()
    export_data = []

    for a in actors_raw:
        actor_id = a["id"]
        handles = [dict(h) for h in cursor.execute("SELECT handle, platform, first_seen, last_seen FROM handles WHERE actor_id = ?", (actor_id,)).fetchall()]
        pgp = [dict(p) for p in cursor.execute("SELECT fingerprint, key_id, algorithm, email_alias FROM pgp_keys WHERE actor_id = ?", (actor_id,)).fetchall()]
        wallets = [dict(w) for w in cursor.execute("SELECT currency, address, cluster_label, tx_count, total_received FROM wallets WHERE actor_id = ?", (actor_id,)).fetchall()]
        infra = [dict(i) for i in cursor.execute("SELECT onion_address, candidate_clearnet_domain, correlation_score FROM infrastructure_indicators WHERE actor_id = ?", (actor_id,)).fetchall()]

        item = dict(a)
        item["handles"] = handles
        item["pgp_keys"] = pgp
        item["wallets"] = wallets
        item["infrastructure"] = infra
        export_data.append(item)

    conn.close()
    return Response(
        content=json.dumps({
            "platform": "DARKTRACE Threat Intelligence & Actor Attribution Platform",
            "problem_statement": "SIH 2026 PS 26151",
            "classification": "SYNTHETIC DEMONSTRATION INTELLIGENCE",
            "exported_at": datetime.now().isoformat(),
            "actors_count": len(export_data),
            "threat_actors": export_data
        }, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=darktrace_intelligence_export.json"}
    )

@app.post("/api/reports/generate")
def generate_report(req: ReportGenerateRequest):
    conn = get_db()
    cursor = conn.cursor()

    actor_row = cursor.execute("SELECT * FROM actors WHERE id = ?", (req.actor_id,)).fetchone()
    if not actor_row:
        actor_row = cursor.execute("SELECT * FROM actors LIMIT 1").fetchone()

    actor = dict(actor_row)
    actor_id = actor["id"]

    handles = [dict(r) for r in cursor.execute("SELECT * FROM handles WHERE actor_id = ?", (actor_id,)).fetchall()]
    pgp = [dict(r) for r in cursor.execute("SELECT * FROM pgp_keys WHERE actor_id = ?", (actor_id,)).fetchall()]
    wallets = [dict(r) for r in cursor.execute("SELECT * FROM wallets WHERE actor_id = ?", (actor_id,)).fetchall()]
    infra = [dict(r) for r in cursor.execute("SELECT * FROM infrastructure_indicators WHERE actor_id = ?", (actor_id,)).fetchall()]
    timeline = [dict(r) for r in cursor.execute("SELECT * FROM timeline_events WHERE actor_id = ? ORDER BY event_date ASC", (actor_id,)).fetchall()]
    personas = [dict(r) for r in cursor.execute("SELECT * FROM personas WHERE actor_id = ?", (actor_id,)).fetchall()]

    confidence = calculate_attribution_confidence(
        identity_score=min(98.0, actor["confidence"] + 4),
        infrastructure_score=min(95.0, actor["confidence"] - 3),
        stylometric_score=min(96.0, actor["confidence"] + 2),
        behaviour_score=min(92.0, actor["confidence"] - 5),
        historical_continuity_score=min(90.0, actor["confidence"] - 8),
        cross_platform_score=min(94.0, actor["confidence"] - 2)
    )

    conn.close()

    report_id = f"DT-REP-{datetime.now().strftime('%Y%m%d')}-{actor_id.upper()}"

    return {
        "report_id": report_id,
        "report_type": req.report_type,
        "title": f"Actor Attribution Dossier: {actor['name']} ({actor['category']})",
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "classification": "CONFIDENTIAL // LAW ENFORCEMENT DEMO ONLY",
        "subject": {
            "name": actor["name"],
            "primary_handle": actor["primary_handle"],
            "category": actor["category"],
            "threat_level": actor["threat_level"],
            "status": actor["status"],
            "attribution_confidence": actor["confidence"],
            "first_observed": actor["first_observed"],
            "last_seen": actor["last_seen"]
        },
        "executive_summary": actor["summary"] + " Deanonymization indicators establish high-confidence linkage between darknet forum presence, hidden service hosting configurations, and clearnet proxy infrastructure.",
        "identity_indicators": {
            "handles": handles,
            "pgp_keys": pgp,
            "wallets": wallets
        },
        "infrastructure_findings": infra,
        "persona_linkages": [
            {
                "persona_code": p.get("persona_code"),
                "handle": p.get("handle"),
                "platform": p.get("platform"),
                "similarity_score": 91 if "42" in p.get("persona_code", "") else 76,
                "stylometric_notes": "TF-IDF n-gram correlation confirms migrated vendor account."
            } for p in personas
        ],
        "behaviour_profile": {
            "typical_active_hours": "14:00 - 02:00 UTC (European/Moscow diurnal peak)",
            "posting_frequency": "12-18 posts/week across vendor and escrow threads",
            "message_cadence": "Average 135 tokens; formal PGP escrow protocol adherence",
            "common_keywords": ["sql dump", "enterprise", "escrow", "jabber otr", "xmr", "bulk discount"]
        },
        "timeline": timeline,
        "attribution_confidence": confidence,
        "limitations_and_disclaimer": "This report is generated for Smart India Hackathon (SIH 2026) screening evaluation under PS 26151. All indicators, hidden services (.onion), wallet addresses, and clearnet references (*.example) are 100% synthetic demonstration data."
    }

# Automatically clone all /api routes to their non-/api equivalents
for route in list(app.routes):
    if hasattr(route, "path") and route.path.startswith("/api/"):
        alt_path = route.path[4:]
        if not any(r.path == alt_path for r in app.routes):
            app.add_api_route(
                alt_path,
                route.endpoint,
                methods=list(route.methods or ["GET"]),
                response_model=getattr(route, "response_model", None),
                include_in_schema=False
            )

@app.get("/{catchall:path}")
def serve_spa(catchall: str):
    file_path = os.path.join(FRONTEND_DIST, catchall)
    if catchall and os.path.isfile(file_path):
        return FileResponse(file_path)
    if os.path.exists(INDEX_FILE):
        return FileResponse(INDEX_FILE)
    raise HTTPException(status_code=404, detail="Not Found")

