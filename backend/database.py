import sqlite3
import os
import shutil

LOCAL_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "darktrace.db")

def get_db_path():
    if os.environ.get("VERCEL"):
        return "/tmp/darktrace.db"
    return LOCAL_DB_PATH

DB_PATH = get_db_path()

def _init_db_file(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()


    cursor.executescript('''
    CREATE TABLE IF NOT EXISTS actors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        primary_handle TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        confidence INTEGER NOT NULL,
        last_seen TEXT NOT NULL,
        first_observed TEXT NOT NULL,
        threat_level TEXT NOT NULL,
        summary TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS handles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id TEXT NOT NULL,
        handle TEXT NOT NULL,
        platform TEXT NOT NULL,
        first_seen TEXT NOT NULL,
        last_seen TEXT NOT NULL,
        FOREIGN KEY(actor_id) REFERENCES actors(id)
    );

    CREATE TABLE IF NOT EXISTS pgp_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id TEXT NOT NULL,
        fingerprint TEXT NOT NULL,
        key_id TEXT NOT NULL,
        algorithm TEXT NOT NULL,
        email_alias TEXT NOT NULL,
        first_seen TEXT NOT NULL,
        FOREIGN KEY(actor_id) REFERENCES actors(id)
    );

    CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id TEXT NOT NULL,
        currency TEXT NOT NULL,
        address TEXT NOT NULL,
        cluster_label TEXT NOT NULL,
        tx_count INTEGER NOT NULL,
        total_received TEXT NOT NULL,
        first_seen TEXT NOT NULL,
        FOREIGN KEY(actor_id) REFERENCES actors(id)
    );

    CREATE TABLE IF NOT EXISTS platforms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        url_synthetic TEXT NOT NULL,
        status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS personas (
        id TEXT PRIMARY KEY,
        actor_id TEXT NOT NULL,
        persona_code TEXT NOT NULL,
        handle TEXT NOT NULL,
        platform TEXT NOT NULL,
        corpus_text TEXT NOT NULL,
        active_hours TEXT NOT NULL, -- JSON array of active 24h distribution
        avg_msg_len INTEGER NOT NULL,
        vocabulary_tags TEXT NOT NULL, -- comma separated
        FOREIGN KEY(actor_id) REFERENCES actors(id)
    );

    CREATE TABLE IF NOT EXISTS infrastructure_indicators (
        id TEXT PRIMARY KEY,
        actor_id TEXT NOT NULL,
        onion_address TEXT NOT NULL,
        server_status_exposed INTEGER NOT NULL, -- 1 or 0
        ssl_cert_hash TEXT NOT NULL,
        banner_text TEXT NOT NULL,
        descriptor_anomaly INTEGER NOT NULL, -- 1 or 0
        infrastructure_fingerprint TEXT NOT NULL,
        candidate_clearnet_domain TEXT NOT NULL,
        candidate_ip TEXT NOT NULL,
        correlation_score INTEGER NOT NULL,
        notes TEXT NOT NULL,
        FOREIGN KEY(actor_id) REFERENCES actors(id)
    );

    CREATE TABLE IF NOT EXISTS relationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT NOT NULL,
        source_type TEXT NOT NULL,
        source_label TEXT NOT NULL,
        target_id TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_label TEXT NOT NULL,
        relation_type TEXT NOT NULL,
        confidence INTEGER NOT NULL,
        details TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS timeline_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id TEXT NOT NULL,
        event_date TEXT NOT NULL,
        title TEXT NOT NULL,
        event_type TEXT NOT NULL,
        source_name TEXT NOT NULL,
        evidence TEXT NOT NULL,
        confidence INTEGER NOT NULL,
        FOREIGN KEY(actor_id) REFERENCES actors(id)
    );

    CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        source_type TEXT NOT NULL,
        reliability TEXT NOT NULL,
        last_scan TEXT NOT NULL,
        next_scan TEXT NOT NULL,
        records_count INTEGER NOT NULL,
        status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        source_name TEXT NOT NULL,
        indicator TEXT NOT NULL,
        category TEXT NOT NULL,
        confidence INTEGER NOT NULL,
        timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS monitoring_stats (
        id INTEGER PRIMARY KEY,
        is_active INTEGER NOT NULL,
        sources_monitored INTEGER NOT NULL,
        collection_interval_mins INTEGER NOT NULL,
        last_run TEXT NOT NULL,
        next_run TEXT NOT NULL,
        new_footprints INTEGER NOT NULL,
        new_actors INTEGER NOT NULL,
        new_relationships INTEGER NOT NULL,
        new_persona_candidates INTEGER NOT NULL,
        infrastructure_changes INTEGER NOT NULL
    );
    ''')

    conn.commit()
    conn.close()

def ensure_db():
    current_db = get_db_path()
    if not os.path.exists(current_db):
        if os.path.exists(LOCAL_DB_PATH) and current_db != LOCAL_DB_PATH:
            try:
                shutil.copyfile(LOCAL_DB_PATH, current_db)
                return
            except Exception as e:
                print(f"Failed to copy DB to {current_db}: {e}")
        # Initialize tables
        _init_db_file(current_db)
        # Attempt to seed
        try:
            from seed_data import seed_database
            seed_database()
        except Exception as e:
            print(f"Failed to seed DB: {e}")

def init_db():
    _init_db_file(get_db_path())

def get_db():
    ensure_db()
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn

if __name__ == "__main__":
    init_db()
    print("Database schema initialized.")

