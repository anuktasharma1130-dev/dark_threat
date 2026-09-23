import sqlite3
import json
import os
from database import DB_PATH, init_db

def seed_database():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear existing demo data
    tables = [
        "actors", "handles", "pgp_keys", "wallets", "platforms",
        "personas", "infrastructure_indicators", "relationships",
        "timeline_events", "sources", "observations", "monitoring_stats"
    ]
    for table in tables:
        cursor.execute(f"DELETE FROM {table}")

    # 1. THREAT ACTORS (12 Actors)
    actors_data = [
        (
            "actor-001", "ShadowX", "ShadowX", "Data Theft", "Active", 87,
            "2026-09-23", "2025-02-14", "CRITICAL",
            "Prolific broker of high-tier enterprise database exfiltrations and corporate credentials. Frequently operates across Russian and English darknet forums under shifting alias variations."
        ),
        (
            "actor-002", "NightWolf", "NightWolf", "Credential Trading", "Active", 82,
            "2026-09-21", "2024-11-03", "HIGH",
            "Specializes in combo-list aggregation, OAuth session cookie harvesting, and privileged VPN gateway access brokering."
        ),
        (
            "actor-003", "CipherGhost", "CipherGhost", "Malware", "Under Review", 74,
            "2026-09-18", "2025-04-19", "HIGH",
            "Developer of polymorphic loaders and anti-EDR crypter kits. Operates private Telegram bot-shops and escrowed darknet escrow threads."
        ),
        (
            "actor-004", "DarkFalcon", "DarkFalcon", "Hacking Services", "Active", 89,
            "2026-09-22", "2024-08-11", "CRITICAL",
            "Contract penetration testing and targeted corporate intrusion operator. Links discovered to initial access broker syndicates."
        ),
        (
            "actor-005", "NullSpecter", "NullSpecter", "Financial Crime", "Active", 79,
            "2026-09-20", "2025-06-30", "HIGH",
            "Focuses on carding dumps, automated bank wire redirection tools, and non-KYC crypto mixer laundering nodes."
        ),
        (
            "actor-006", "RedVector", "RedVector", "Data Theft", "Dormant", 68,
            "2026-07-15", "2024-03-22", "MEDIUM",
            "Healthcare and educational sector leak publisher. Activity dropped significantly following European law enforcement domain seizures."
        ),
        (
            "actor-007", "GhostMarket", "GhostMarket", "Fraud", "Active", 85,
            "2026-09-22", "2025-01-10", "HIGH",
            "Vendor syndicate coordinating forged identity documentation, passport scans, and synthetic identity accounts."
        ),
        (
            "actor-008", "SilentRoot", "SilentRoot", "Hacking Services", "Active", 91,
            "2026-09-23", "2024-01-15", "CRITICAL",
            "Zero-day and N-day exploit vendor targeting enterprise firewall management interfaces and remote desktop services."
        ),
        (
            "actor-009", "ZeroEntropy", "ZeroEntropy", "Malware", "Active", 83,
            "2026-09-19", "2025-07-08", "HIGH",
            "Ransomware-as-a-Service (RaaS) affiliate orchestrator providing customized negotiation portals and automated file-decryption testers."
        ),
        (
            "actor-010", "ChronoPhantom", "ChronoPhantom", "Financial Crime", "Under Review", 63,
            "2026-08-30", "2025-09-12", "MEDIUM",
            "Specialist in decentralized exchange flash-loan exploits and automated arbitrage drainer contracts."
        ),
        (
            "actor-011", "ApexBreach", "ApexBreach", "Data Theft", "Active", 88,
            "2026-09-21", "2024-09-05", "CRITICAL",
            "High-profile extortion group responsible for publicly leaking telecommunications and government agency records."
        ),
        (
            "actor-012", "CobaltWraith", "CobaltWraith", "Malware", "Dormant", 71,
            "2026-06-12", "2023-12-01", "HIGH",
            "Custom command-and-control framework creator targeting critical infrastructure; exhibits signs of state-sponsored tactical reuse."
        )
    ]
    cursor.executemany("INSERT INTO actors VALUES (?,?,?,?,?,?,?,?,?,?)", actors_data)

    # 2. HANDLES (32 Handles)
    handles_data = [
        # ShadowX
        ("actor-001", "ShadowX", "Market Alpha", "2025-02-14", "2026-01-20"),
        ("actor-001", "XShadow", "Market Beta", "2025-08-04", "2026-04-11"),
        ("actor-001", "shx_market", "HydraBay Demo", "2026-03-12", "2026-09-23"),
        ("actor-001", "XShadow_New", "Forum Nexus", "2026-03-01", "2026-09-23"),
        # NightWolf
        ("actor-002", "NightWolf", "Forum Nexus", "2024-11-03", "2026-09-21"),
        ("actor-002", "LycanSec", "Forum Zero", "2025-05-19", "2026-09-14"),
        ("actor-002", "WolfOps", "DarkBazaar Demo", "2026-01-10", "2026-08-28"),
        # CipherGhost
        ("actor-003", "CipherGhost", "DeepSec Forum", "2025-04-19", "2026-09-18"),
        ("actor-003", "PhantomByte", "Forum Zero", "2025-09-11", "2026-07-22"),
        ("actor-003", "GhostCrypt", "Market Beta", "2026-02-05", "2026-09-18"),
        # DarkFalcon
        ("actor-004", "DarkFalcon", "Forum Nexus", "2024-08-11", "2026-09-22"),
        ("actor-004", "FalconSec_99", "HydraBay Demo", "2025-02-15", "2026-05-30"),
        ("actor-004", "ViperStrike", "Market Alpha", "2026-01-14", "2026-09-22"),
        # NullSpecter
        ("actor-005", "NullSpecter", "DarkBazaar Demo", "2025-06-30", "2026-09-20"),
        ("actor-005", "SpecterWire", "Forum Zero", "2025-10-02", "2026-09-15"),
        ("actor-005", "NullVault", "TorEscrow Alpha", "2026-04-18", "2026-09-20"),
        # RedVector
        ("actor-006", "RedVector", "Market Alpha", "2024-03-22", "2026-07-15"),
        ("actor-006", "VectorLeaks", "DeepSec Forum", "2025-01-12", "2026-06-01"),
        # GhostMarket
        ("actor-007", "GhostMarket", "Market Beta", "2025-01-10", "2026-09-22"),
        ("actor-007", "GhostIdent", "Forum Nexus", "2025-08-20", "2026-09-19"),
        ("actor-007", "ShadowPass", "DarkBazaar Demo", "2026-03-05", "2026-09-22"),
        # SilentRoot
        ("actor-008", "SilentRoot", "DeepSec Forum", "2024-01-15", "2026-09-23"),
        ("actor-008", "RootBroker", "Forum Nexus", "2024-11-20", "2026-09-20"),
        ("actor-008", "ZeroExploit", "Market Alpha", "2025-06-18", "2026-09-23"),
        # ZeroEntropy
        ("actor-009", "ZeroEntropy", "Forum Zero", "2025-07-08", "2026-09-19"),
        ("actor-009", "EntropyLocker", "Market Beta", "2025-11-14", "2026-09-10"),
        # ChronoPhantom
        ("actor-010", "ChronoPhantom", "Forum Nexus", "2025-09-12", "2026-08-30"),
        ("actor-010", "ChronoDrain", "DarkBazaar Demo", "2026-02-28", "2026-08-30"),
        # ApexBreach
        ("actor-011", "ApexBreach", "Market Alpha", "2024-09-05", "2026-09-21"),
        ("actor-011", "ApexDumps", "Forum Nexus", "2025-03-19", "2026-09-21"),
        # CobaltWraith
        ("actor-012", "CobaltWraith", "DeepSec Forum", "2023-12-01", "2026-06-12"),
        ("actor-012", "WraithC2", "TorEscrow Alpha", "2024-05-10", "2026-05-18")
    ]
    cursor.executemany("INSERT INTO handles (actor_id, handle, platform, first_seen, last_seen) VALUES (?,?,?,?,?)", handles_data)

    # 3. PGP KEYS (16 PGP keys)
    pgp_data = [
        ("actor-001", "8A:F3:44:91:EE:12:09:A3:8C:F2:71:00:88:52:19:EF", "0x8AF34491", "RSA-4096", "shx-escrow@secmail.sim", "2025-02-16"),
        ("actor-001", "91:BC:07:34:F1:8A:29:CC:33:10:98:AA:74:61:D4:5B", "0x91BC0734", "Ed25519", "xshadow-key@tormail.sim", "2026-03-05"),
        ("actor-002", "44:11:AB:65:C2:E0:39:18:BB:77:21:40:99:38:12:30", "0x4411AB65", "RSA-4096", "nightwolf@protonpriv.sim", "2024-11-05"),
        ("actor-002", "19:08:FA:87:66:32:01:8D:DE:90:54:12:67:38:BB:C1", "0x1908FA87", "RSA-4096", "lycan-vault@secmail.sim", "2025-05-22"),
        ("actor-003", "BB:49:10:93:78:E2:45:90:61:32:09:51:78:A4:CC:89", "0xBB491093", "Ed25519", "cipherghost@cryptmail.sim", "2025-04-20"),
        ("actor-004", "F7:21:00:83:99:A1:74:23:45:67:89:BC:11:09:88:23", "0xF7210083", "RSA-4096", "darkfalcon@escrowpriv.sim", "2024-08-15"),
        ("actor-004", "78:33:41:90:AA:56:88:12:CC:01:92:83:45:67:99:FF", "0x78334190", "Ed25519", "viperstrike@torbox.sim", "2026-01-18"),
        ("actor-005", "12:90:DE:45:67:89:BC:23:AA:54:19:00:81:72:63:54", "0x1290DE45", "RSA-4096", "nullspecter@privmail.sim", "2025-07-02"),
        ("actor-006", "38:91:AA:BC:77:88:23:90:11:23:88:99:55:66:77:88", "0x3891AABC", "RSA-2048", "redvector@secmail.sim", "2024-03-25"),
        ("actor-007", "A1:B2:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90", "0xA1B2C3D4", "RSA-4096", "ghostmarket@idsec.sim", "2025-01-15"),
        ("actor-007", "E4:F5:12:34:56:78:90:AB:CD:EF:11:22:33:44:55:66", "0xE4F51234", "Ed25519", "ghostident@tormail.sim", "2025-08-25"),
        ("actor-008", "99:88:77:66:55:44:33:22:11:00:AA:BB:CC:DD:EE:FF", "0x99887766", "RSA-4096", "silentroot@zeroday.sim", "2024-01-20"),
        ("actor-009", "55:66:77:88:99:00:11:22:33:44:AA:BB:CC:DD:EE:11", "0x55667788", "RSA-4096", "entropy@raasportal.sim", "2025-07-10"),
        ("actor-010", "11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00", "0x11223344", "Ed25519", "chronodev@web3priv.sim", "2025-09-15"),
        ("actor-011", "22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11", "0x22334455", "RSA-4096", "apexbreach@leaksdesk.sim", "2024-09-10"),
        ("actor-012", "33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22", "0x33445566", "RSA-4096", "wraith@c2hub.sim", "2023-12-05")
    ]
    cursor.executemany("INSERT INTO pgp_keys (actor_id, fingerprint, key_id, algorithm, email_alias, first_seen) VALUES (?,?,?,?,?,?)", pgp_data)

    # 4. WALLETS (22 Wallets)
    wallets_data = [
        # ShadowX
        ("actor-001", "BTC", "bc1q-demo-shx-882190-cluster-alpha", "Deposit Cluster A", 48, "14.28 BTC", "2025-02-18"),
        ("actor-001", "XMR", "888t-demo-xmr-shx-priv-escrow-4901", "Stealth Escrow Pool", 192, "420.50 XMR", "2025-08-10"),
        ("actor-001", "USDT-TRC20", "TX-DEMO-SHX-99881100223344-PAY", "Instant Escrow Node", 63, "182,500 USDT", "2026-03-15"),
        # NightWolf
        ("actor-002", "BTC", "bc1q-demo-wolf-551920-broker-pool", "Combo-Sales Aggregator", 84, "9.45 BTC", "2024-11-10"),
        ("actor-002", "XMR", "888t-demo-xmr-wolf-ops-2201991", "Mixer Output Buffer", 110, "295.10 XMR", "2025-06-01"),
        # CipherGhost
        ("actor-003", "BTC", "bc1q-demo-ghost-crypter-subs-001", "Crypter License Vault", 125, "18.90 BTC", "2025-04-22"),
        ("actor-003", "XMR", "888t-demo-xmr-cipher-lic-7741", "Unlinked Subscription Wallet", 340, "880.00 XMR", "2025-09-15"),
        # DarkFalcon
        ("actor-004", "BTC", "bc1q-demo-falcon-contract-escrow", "Access Broker Bounty", 31, "28.50 BTC", "2024-08-20"),
        ("actor-004", "USDT-TRC20", "TX-DEMO-FALCON-77665544332211", "Corporate Ransom Deposit", 12, "640,000 USDT", "2026-01-20"),
        # NullSpecter
        ("actor-005", "BTC", "bc1q-demo-specter-wire-drain-pool", "Wire Redirect Hub", 76, "34.12 BTC", "2025-07-15"),
        ("actor-005", "XMR", "888t-demo-xmr-null-wash-881923", "Mixer Peel Chain Node", 512, "1,450.00 XMR", "2025-10-10"),
        # RedVector
        ("actor-006", "BTC", "bc1q-demo-vector-leak-bounty-91", "Archive Bounty Wallet", 19, "4.20 BTC", "2024-04-01"),
        # GhostMarket
        ("actor-007", "BTC", "bc1q-demo-ghostid-escrow-vendor", "Identity Package Sales", 210, "16.85 BTC", "2025-01-22"),
        ("actor-007", "USDT-TRC20", "TX-DEMO-GHOSTID-33445566778899", "Fast Settlement Gateway", 94, "98,200 USDT", "2025-09-01"),
        # SilentRoot
        ("actor-008", "BTC", "bc1q-demo-silent-zeroday-broker", "Exploit Purchase Vault", 15, "55.00 BTC", "2024-02-01"),
        ("actor-008", "XMR", "888t-demo-xmr-root-bounty-0012", "Exploit Disclosure Bounty", 45, "620.00 XMR", "2025-07-01"),
        # ZeroEntropy
        ("actor-009", "BTC", "bc1q-demo-entropy-raas-affiliate", "Ransom Extortion Wallet", 42, "38.70 BTC", "2025-07-20"),
        ("actor-009", "XMR", "888t-demo-xmr-entropy-mixer-44", "Affiliate Split Pool", 188, "730.00 XMR", "2025-11-20"),
        # ChronoPhantom
        ("actor-010", "BTC", "bc1q-demo-chrono-arb-drainer-01", "DEX Drain Liquidity", 28, "12.40 BTC", "2025-09-20"),
        # ApexBreach
        ("actor-011", "BTC", "bc1q-demo-apex-leak-multisig-99", "Extortion Multisig Escrow", 39, "44.60 BTC", "2024-09-18"),
        ("actor-011", "USDT-TRC20", "TX-DEMO-APEX-88990011223344", "Victim Direct Settlement", 18, "850,000 USDT", "2025-04-10"),
        # CobaltWraith
        ("actor-012", "BTC", "bc1q-demo-wraith-c2-infra-pay", "Infrastructure Hosting Pool", 56, "8.10 BTC", "2023-12-15")
    ]
    cursor.executemany("INSERT INTO wallets (actor_id, currency, address, cluster_label, tx_count, total_received, first_seen) VALUES (?,?,?,?,?,?,?)", wallets_data)

    # 5. PLATFORMS (Marketplaces & Forums - 10 platforms)
    platforms_data = [
        ("plat-001", "Market Alpha", "Marketplace", "http://alpha-mkt-demo-7f3a.onion", "ACTIVE"),
        ("plat-002", "Market Beta", "Marketplace", "http://beta-bazaar-demo-8c11.onion", "ACTIVE"),
        ("plat-003", "HydraBay Demo", "Marketplace", "http://hydrabay-demo-3e99.onion", "ACTIVE"),
        ("plat-004", "DarkBazaar Demo", "Marketplace", "http://darkbazaar-sim-55aa.onion", "SEIZED"),
        ("plat-005", "Forum Nexus", "Forum", "http://nexus-forum-demo-1a2b.onion", "ACTIVE"),
        ("plat-006", "Forum Zero", "Forum", "http://zero-community-demo-99cc.onion", "ACTIVE"),
        ("plat-007", "DeepSec Forum", "Forum", "http://deepsec-intel-demo-44df.onion", "ACTIVE"),
        ("plat-008", "TorEscrow Alpha", "Escrow Service", "http://torescrow-demo-22bb.onion", "ACTIVE"),
        ("plat-009", "TorLeak Hub Demo", "Data Leak Portal", "http://torleak-press-demo-77ee.onion", "ACTIVE"),
        ("plat-010", "ZeroDay Exchange Demo", "Exploit Market", "http://0day-exchange-demo-11ff.onion", "ACTIVE")
    ]
    cursor.executemany("INSERT INTO platforms VALUES (?,?,?,?,?)", platforms_data)

    # 6. PERSONAS (With synthetic corpus text for TF-IDF stylometric analysis & diurnal hours)
    # Notice: Persona-042 (XShadow_New) matches Persona-001 (ShadowX) in phrasing, Russian/English slang, encryption mentions, and diurnal peak hours (18-02 UTC).
    # Persona-019 (shx_market) also exhibits strong similarity to ShadowX.
    # Unrelated personas like NightWolf (Persona-002) and NullSpecter (Persona-005) have completely different vocabulary and active hours!
    personas_data = [
        (
            "persona-001", "actor-001", "PERS-SHX-01", "ShadowX", "Market Alpha",
            "Offering fresh enterprise SQL exfiltration dumps. Verified records only. No test samples without PGP signed request. Escrow accepted through Market Alpha admin. Bulk discounts available for reputable partners. Contact via Jabber OTR or session key only. Strictly BTC/XMR settlements. Respect seller integrity.",
            json.dumps([2, 1, 0, 0, 0, 1, 3, 5, 8, 12, 18, 24, 30, 35, 42, 48, 55, 62, 70, 75, 68, 50, 25, 10]),
            135,
            "sql dump, enterprise, escrow, jabber, otr, pgp signed, bulk discount, xmr settlement"
        ),
        (
            "persona-002", "actor-001", "PERS-SHX-42", "XShadow_New", "Forum Nexus",
            "New vendor thread for verified corporate SQL database exfiltrations. High quality records only. Serious inquiries require PGP signed authentication. Escrow accepted via Forum Nexus trusted staff. Bulk discount terms apply for long-term partners. Hit me on Session ID or OTR Jabber. Only BTC and XMR accepted. Strictly professional business.",
            json.dumps([1, 0, 0, 0, 0, 0, 2, 4, 7, 14, 20, 26, 32, 38, 45, 52, 58, 65, 72, 78, 65, 48, 22, 8]),
            142,
            "sql database, corporate, escrow, pgp signed, session id, otr jabber, bulk discount, xmr"
        ),
        (
            "persona-003", "actor-001", "PERS-SHX-19", "shx_market", "HydraBay Demo",
            "Direct supplier of verified financial sector SQL dumps. Fresh breach packages. Escrow through HydraBay mandatory. Signed PGP verification required for proof of funds. No free samples. Jabber OTR available. Payment in XMR or clean BTC.",
            json.dumps([3, 1, 0, 0, 0, 0, 1, 6, 9, 15, 22, 28, 33, 40, 44, 50, 56, 60, 68, 70, 60, 42, 20, 8]),
            128,
            "financial, sql dumps, escrow, signed pgp, proof of funds, jabber otr, xmr, clean btc"
        ),
        (
            "persona-004", "actor-002", "PERS-WOLF-01", "NightWolf", "Forum Nexus",
            "Releasing new combo lists 500k fresh combo lines verified mail access. High hit-rate on crypto exchanges and gaming platforms. Auto-buy bot in Telegram. Replacement guarantee within 2 hours. Fast support. Cheap prices for resellers. Check my vouches thread on Nexus.",
            json.dumps([25, 30, 35, 40, 38, 30, 20, 15, 10, 8, 5, 4, 3, 2, 5, 8, 12, 15, 18, 20, 22, 24, 26, 28]),
            98,
            "combo lists, mail access, hit-rate, crypto exchanges, autobuy bot, replacement guarantee, vouches"
        ),
        (
            "persona-005", "actor-002", "PERS-WOLF-02", "LycanSec", "Forum Zero",
            "Fresh combo packs 250k email pass validated against cloud portals. High conversion on streaming and wallet endpoints. Automated shop available. Instant delivery upon 1 confirmation. Post in thread for vouch copies. Bulk packs available.",
            json.dumps([22, 28, 32, 38, 35, 28, 18, 12, 8, 6, 4, 3, 2, 2, 4, 7, 10, 14, 16, 19, 21, 23, 25, 26]),
            104,
            "combo packs, validated, cloud portals, automated shop, instant delivery, vouch copies, bulk"
        ),
        (
            "persona-006", "actor-003", "PERS-GHOST-01", "CipherGhost", "DeepSec Forum",
            "Selling private FUD crypter stub. Zero runtime detections against Defender, SentinelOne, and CrowdStrike. Polymorphic engine rebuilt every 48 hours. USG bypass included. Private builds only. 5 slots available. Contact via Tox. Escrow welcome.",
            json.dumps([5, 8, 12, 15, 18, 14, 10, 6, 4, 2, 1, 0, 2, 5, 8, 12, 16, 22, 28, 32, 25, 18, 12, 8]),
            156,
            "fud crypter, runtime detections, polymorphic engine, bypass, private builds, tox, escrow"
        ),
        (
            "persona-007", "actor-004", "PERS-FALCON-01", "DarkFalcon", "Forum Nexus",
            "Selling domain admin corporate access. Fortinet VPN initial entry credentials, valid persistence, and full Active Directory mapping document. Revenue $120M+. Starting bid 5 BTC. Escrow with official staff only.",
            json.dumps([10, 12, 8, 5, 2, 1, 0, 4, 8, 15, 20, 28, 35, 40, 45, 50, 48, 42, 35, 28, 20, 16, 14, 12]),
            148,
            "domain admin, corporate access, vpn initial entry, persistence, active directory, bid, escrow"
        ),
        (
            "persona-008", "actor-005", "PERS-SPECTER-01", "NullSpecter", "DarkBazaar Demo",
            "Wire redirection automated toolkit and fresh merchant payment gateway bypass scripts. Non-VBV balance checker integrated. High payout conversion. Step-by-step video setup included. Escrow accepted on DarkBazaar.",
            json.dumps([8, 10, 14, 18, 20, 16, 12, 8, 5, 3, 2, 1, 3, 6, 10, 15, 20, 24, 22, 18, 15, 12, 10, 8]),
            132,
            "wire redirection, gateway bypass, non-vbv, balance checker, payout conversion, video setup"
        ),
        (
            "persona-009", "actor-008", "PERS-ROOT-01", "SilentRoot", "DeepSec Forum",
            "Pre-auth RCE exploit chain targeting enterprise perimeter edge gateways. Reliable weaponized PoC with clean cleanup script. Verified on firmware 10.4+. Direct contract sale only via trusted mediator.",
            json.dumps([2, 1, 0, 0, 0, 0, 3, 8, 15, 22, 30, 38, 42, 45, 48, 52, 55, 50, 40, 30, 20, 10, 5, 3]),
            165,
            "pre-auth rce, edge gateways, weaponized poc, clean cleanup, firmware, mediator, contract"
        ),
        (
            "persona-010", "actor-011", "PERS-APEX-01", "ApexBreach", "Market Alpha",
            "Telecom operator infrastructure exfiltration batch. 12TB SQL tables, internal employee communications, and customer billing histories. Public leak countdown initiated. Contact extortion portal for settlement.",
            json.dumps([12, 15, 10, 6, 3, 1, 0, 2, 5, 10, 16, 22, 30, 38, 44, 48, 52, 46, 38, 30, 22, 18, 15, 14]),
            158,
            "telecom, exfiltration batch, sql tables, internal communications, leak countdown, settlement"
        )
    ]
    cursor.executemany("INSERT INTO personas VALUES (?,?,?,?,?,?,?,?,?)", personas_data)

    # 7. INFRASTRUCTURE INDICATORS (15 Simulated hidden services & clearnet links)
    infra_data = [
        (
            "infra-001", "actor-001", "hs-demo-7f3a.onion", 1,
            "SHA256:8f9a2b4c7d6e5a1b3c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5a4b3c2d1e0f9a8b7c",
            "Apache/2.4.52 (Ubuntu) mod_ssl/2.4.52 OpenSSL/3.0.2", 1,
            "FP-NGINX-UBUNTU-2204-TLS13", "demo-infrastructure.example",
            "198.51.100.42 (SIMULATED RFC 5737 TEST-NET)", 84,
            "Apache server-status page leaking upstream virtualhost name and clearnet reverse proxy binding."
        ),
        (
            "infra-002", "actor-001", "tor-vault-shx-09.onion", 1,
            "SHA256:77bc991a44e2310199ddaa8877112233445566778899aabbccddeeff00112233",
            "nginx/1.18.0 (Ubuntu)", 0,
            "FP-APACHE-DEBIAN-11-TLS12", "shx-storage-gateway.example",
            "198.51.100.89 (SIMULATED RFC 5737 TEST-NET)", 78,
            "SSL certificate SAN header leaked backup server domain registered in clearnet WHOIS records."
        ),
        (
            "infra-003", "actor-002", "nightwolf-portal-44.onion", 0,
            "SHA256:11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
            "LiteSpeed/5.4.12 Enterprise", 1,
            "FP-LITESPEED-CENTOS-TLS13", "wolf-auth-node.example",
            "203.0.113.15 (SIMULATED RFC 5737 TEST-NET)", 73,
            "Descriptor publication time sync matched server cron update cycle at 03:00 UTC."
        ),
        (
            "infra-004", "actor-003", "ghost-crypter-bot-91.onion", 1,
            "SHA256:44556677889900112233aabbccddeeff44556677889900112233aabbccddeeff",
            "Caddy/v2.6.4 Go-http-client/2.0", 1,
            "FP-CADDY-ALPINE-TLS13", "ghost-compiler-build.example",
            "198.51.100.199 (SIMULATED RFC 5737 TEST-NET)", 88,
            "Exposed /metrics Prometheus endpoint reveals host interface IP and TLS certificate serial."
        ),
        (
            "infra-005", "actor-004", "falcon-access-desk.onion", 1,
            "SHA256:99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa",
            "nginx/1.22.1 mod_security", 0,
            "FP-NGINX-SEC-DEBIAN-TLS13", "falcon-ops-staging.example",
            "203.0.113.88 (SIMULATED RFC 5737 TEST-NET)", 81,
            "Self-signed TLS serial matches clearnet VPN staging server scanned 14 days earlier."
        ),
        (
            "infra-006", "actor-005", "specter-wire-pay.onion", 0,
            "SHA256:33445566778899001122aabbccddeeff33445566778899001122aabbccddeeff",
            "OpenResty/1.21.4.1", 1,
            "FP-OPENRESTY-LUA-TLS13", "wire-clearing-node.example",
            "198.51.100.123 (SIMULATED RFC 5737 TEST-NET)", 69,
            "Anomalous descriptor descriptor-upload intervals correlated to Frankfurt datacenter latency."
        ),
        (
            "infra-007", "actor-008", "silent-exploit-vault.onion", 1,
            "SHA256:55667788990011223344aabbccddeeff55667788990011223344aabbccddeeff",
            "Apache/2.4.41 (Ubuntu)", 1,
            "FP-APACHE-UBUNTU-2004-TLS13", "root-poc-mirror.example",
            "203.0.113.204 (SIMULATED RFC 5737 TEST-NET)", 92,
            "Default Apache test banner combined with unpatched server-status endpoint exposes upstream reverse proxy."
        ),
        (
            "infra-008", "actor-011", "apex-leaks-press.onion", 1,
            "SHA256:77889900112233445566aabbccddeeff77889900112233445566aabbccddeeff",
            "nginx/1.20.2", 1,
            "FP-NGINX-RHEL-TLS13", "apex-press-distribution.example",
            "198.51.100.250 (SIMULATED RFC 5737 TEST-NET)", 86,
            "SSL certificate issuer matched wildcard domain certificate issued by Let's Encrypt for apex-press."
        )
    ]
    cursor.executemany("INSERT INTO infrastructure_indicators VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", infra_data)

    # 8. RELATIONSHIPS (Cross-marketplace graph links - 65+ links)
    # Types: "uses", "linked_to", "observed_on", "controls", "correlated_with", "similar_to", "trust_link"
    relationships_data = [
        # ShadowX cluster
        ("actor-001", "actor", "ShadowX", "handle-001", "handle", "ShadowX", "uses", 99, "Primary vendor handle on Market Alpha"),
        ("actor-001", "actor", "ShadowX", "handle-002", "handle", "XShadow", "uses", 95, "Secondary operational alias on Market Beta"),
        ("actor-001", "actor", "ShadowX", "handle-003", "handle", "shx_market", "uses", 92, "HydraBay vendor profile linked via PGP key"),
        ("actor-001", "actor", "ShadowX", "handle-004", "handle", "XShadow_New", "linked_to", 89, "Migrated persona identified via TF-IDF stylometry"),
        ("actor-001", "actor", "ShadowX", "pgp-001", "pgp_key", "0x8AF34491", "uses", 99, "Long-standing RSA-4096 signature key"),
        ("actor-001", "actor", "ShadowX", "pgp-002", "pgp_key", "0x91BC0734", "uses", 94, "Ed25519 key uploaded to Forum Nexus"),
        ("actor-001", "actor", "ShadowX", "wallet-001", "wallet", "BTC-DEMO-001", "controls", 96, "Primary escrow deposit wallet"),
        ("actor-001", "actor", "ShadowX", "wallet-002", "wallet", "XMR-DEMO-002", "controls", 91, "Stealth Monero payment cluster"),
        ("actor-001", "actor", "ShadowX", "plat-001", "marketplace", "Market Alpha", "observed_on", 98, "High vendor rating 4.9/5.0"),
        ("actor-001", "actor", "ShadowX", "plat-002", "marketplace", "Market Beta", "observed_on", 90, "Backup storefront profile"),
        ("actor-001", "actor", "ShadowX", "plat-005", "forum", "Forum Nexus", "observed_on", 92, "Active VIP member in VIP leaks section"),
        ("actor-001", "actor", "ShadowX", "persona-002", "persona", "PERS-SHX-42", "similar_to", 89, "89% stylometric and behavioral link confidence"),
        ("actor-001", "actor", "ShadowX", "infra-001", "infrastructure", "hs-demo-7f3a.onion", "controls", 84, "Server-status and certificate correlation"),
        ("infra-001", "infrastructure", "hs-demo-7f3a.onion", "clearnet-001", "clearnet", "demo-infrastructure.example", "correlated_with", 84, "Exposed status and SSL serial correlation"),
        ("actor-001", "actor", "ShadowX", "actor-004", "actor", "DarkFalcon", "trust_link", 78, "Shared escrow vouches and mutual database brokers"),

        # NightWolf cluster
        ("actor-002", "actor", "NightWolf", "handle-005", "handle", "NightWolf", "uses", 99, "Main handle on Forum Nexus"),
        ("actor-002", "actor", "NightWolf", "handle-006", "handle", "LycanSec", "linked_to", 88, "Correlated combo seller profile"),
        ("actor-002", "actor", "NightWolf", "pgp-003", "pgp_key", "0x4411AB65", "uses", 95, "Registered PGP key on Nexus"),
        ("actor-002", "actor", "NightWolf", "wallet-004", "wallet", "BTC-WOLF-001", "controls", 90, "Combo shop payout address"),
        ("actor-002", "actor", "NightWolf", "plat-005", "forum", "Forum Nexus", "observed_on", 96, "Moderator of combo trade room"),
        ("actor-002", "actor", "NightWolf", "plat-006", "forum", "Forum Zero", "observed_on", 85, "Cross-posted combo lists"),
        ("actor-002", "actor", "NightWolf", "infra-003", "infrastructure", "nightwolf-portal-44.onion", "controls", 73, "Descriptor publication schedule correlation"),

        # CipherGhost cluster
        ("actor-003", "actor", "CipherGhost", "handle-008", "handle", "CipherGhost", "uses", 99, "Primary malware author handle"),
        ("actor-003", "actor", "CipherGhost", "handle-009", "handle", "PhantomByte", "linked_to", 81, "Correlated crypter builder handle"),
        ("actor-003", "actor", "CipherGhost", "wallet-006", "wallet", "BTC-GHOST-CRYPTER", "controls", 94, "Subscription wallet cluster"),
        ("actor-003", "actor", "CipherGhost", "plat-007", "forum", "DeepSec Forum", "observed_on", 95, "Verified malware dev badge"),
        ("actor-003", "actor", "CipherGhost", "infra-004", "infrastructure", "ghost-crypter-bot-91.onion", "controls", 88, "Prometheus metrics leak correlation"),
        ("infra-004", "infrastructure", "ghost-crypter-bot-91.onion", "clearnet-004", "clearnet", "ghost-compiler-build.example", "correlated_with", 88, "Caddy server header and compile timing"),

        # DarkFalcon cluster
        ("actor-004", "actor", "DarkFalcon", "handle-011", "handle", "DarkFalcon", "uses", 99, "Known initial access broker handle"),
        ("actor-004", "actor", "DarkFalcon", "handle-013", "handle", "ViperStrike", "linked_to", 86, "Market Alpha corporate access seller"),
        ("actor-004", "actor", "DarkFalcon", "wallet-008", "wallet", "BTC-FALCON-ACCESS", "controls", 92, "High-value extortion payout address"),
        ("actor-004", "actor", "DarkFalcon", "plat-005", "forum", "Forum Nexus", "observed_on", 94, "Brokered 14 corporate networks"),
        ("actor-004", "actor", "DarkFalcon", "infra-005", "infrastructure", "falcon-access-desk.onion", "controls", 81, "Self-signed SSL thumbprint match"),

        # NullSpecter cluster
        ("actor-005", "actor", "NullSpecter", "handle-014", "handle", "NullSpecter", "uses", 99, "Wire diversion forum handle"),
        ("actor-005", "actor", "NullSpecter", "wallet-010", "wallet", "BTC-SPECTER-WIRE", "controls", 88, "Laundering aggregator address"),
        ("actor-005", "actor", "NullSpecter", "plat-004", "marketplace", "DarkBazaar Demo", "observed_on", 91, "Escrow transactions recorded"),

        # SilentRoot cluster
        ("actor-008", "actor", "SilentRoot", "handle-022", "handle", "SilentRoot", "uses", 99, "Exploit vendor handle"),
        ("actor-008", "actor", "SilentRoot", "pgp-012", "pgp_key", "0x99887766", "uses", 97, "Key used for zero-day PoC signatures"),
        ("actor-008", "actor", "SilentRoot", "wallet-015", "wallet", "BTC-ROOT-VAULT", "controls", 95, "55 BTC received for edge exploits"),
        ("actor-008", "actor", "SilentRoot", "infra-007", "infrastructure", "silent-exploit-vault.onion", "controls", 92, "Apache status leak to root-poc-mirror.example"),
        ("infra-007", "infrastructure", "silent-exploit-vault.onion", "clearnet-007", "clearnet", "root-poc-mirror.example", "correlated_with", 92, "Default banner and status leak"),

        # ApexBreach cluster
        ("actor-011", "actor", "ApexBreach", "handle-029", "handle", "ApexBreach", "uses", 99, "Ransom blog spokesperson"),
        ("actor-011", "actor", "ApexBreach", "wallet-019", "wallet", "BTC-APEX-LEAK", "controls", 96, "Multisig extortion address"),
        ("actor-011", "actor", "ApexBreach", "infra-008", "infrastructure", "apex-leaks-press.onion", "controls", 86, "Wildcard SSL certificate correlation"),

        # Cross-actor trust links
        ("actor-001", "actor", "ShadowX", "actor-011", "actor", "ApexBreach", "trust_link", 82, "Cross-posted joint enterprise leak archives"),
        ("actor-003", "actor", "CipherGhost", "actor-009", "actor", "ZeroEntropy", "trust_link", 84, "Provides crypter stubs for ZeroEntropy payloads"),
        ("actor-004", "actor", "DarkFalcon", "actor-008", "actor", "SilentRoot", "trust_link", 79, "Purchased pre-auth RCE exploits for network breach")
    ]
    cursor.executemany("""
        INSERT INTO relationships (
            source_id, source_type, source_label,
            target_id, target_type, target_label,
            relation_type, confidence, details
        ) VALUES (?,?,?,?,?,?,?,?,?)
    """, relationships_data)

    # 9. TIMELINE EVENTS (60+ events covering actor histories)
    timeline_data = [
        # ShadowX Timeline
        ("actor-001", "2025-02-14", "Actor First Observed on Market Alpha", "Marketplace", "Market Alpha", "Vendor account registered with handle 'ShadowX' offering telecom database archives.", 95),
        ("actor-001", "2025-02-16", "PGP Key 0x8AF34491 Published", "Identity", "Market Alpha", "Published RSA-4096 public key with email alias shx-escrow@secmail.sim.", 98),
        ("actor-001", "2025-05-20", "Major Healthcare Database Listed", "Data Exfiltration", "Market Alpha", "Posted 4.2M records alleged from regional hospital network for 3.5 BTC.", 92),
        ("actor-001", "2025-08-04", "Secondary Handle 'XShadow' Registered on Market Beta", "Identity", "Market Beta", "Identical PGP key uploaded to Market Beta vendor profile.", 96),
        ("actor-001", "2025-08-10", "XMR Stealth Escrow Wallet Observed", "Cryptocurrency", "Blockchain Monitor Demo", "Address 888t-demo-xmr-shx detected in escrow payouts.", 90),
        ("actor-001", "2026-01-20", "Market Alpha Account Marked Inactive", "Marketplace", "Market Alpha", "Storefront closed following market-wide law enforcement disruption rumors.", 88),
        ("actor-001", "2026-03-01", "New Handle 'XShadow_New' Emerges on Forum Nexus", "Identity", "Forum Nexus", "Account created offering enterprise SQL exfiltrations with identical conditions.", 94),
        ("actor-001", "2026-03-05", "Ed25519 PGP Key 0x91BC0734 Uploaded", "Identity", "Forum Nexus", "Uploaded new lightweight Ed25519 key alongside Session ID contact.", 91),
        ("actor-001", "2026-04-12", "AI Stylometric Similarity Detected (91%)", "AI Attribution", "Stylometric Engine Demo", "TF-IDF text analysis of Forum Nexus posts showed 91% concordance with ShadowX.", 91),
        ("actor-001", "2026-05-18", "Candidate Persona Migration Dossier Created", "Investigation", "DARKTRACE SOC", "Automated link rule flagged XShadow_New as migrated persona of ShadowX.", 89),
        ("actor-001", "2026-07-22", "Hidden Service hs-demo-7f3a.onion Correlated", "Infrastructure", "Tor Hidden Service Feed", "Server-status directive identified linking onion portal to demo-infrastructure.example.", 84),
        ("actor-001", "2026-09-23", "Attribution Dossier Elevated to High Confidence (87%)", "Attribution", "DARKTRACE SOC", "Multi-factor correlation validated across identity, stylometry, and infrastructure.", 87),

        # NightWolf Timeline
        ("actor-002", "2024-11-03", "First Observed on Forum Nexus", "Forum", "Forum Nexus", "Handle 'NightWolf' registered selling corporate email credentials.", 92),
        ("actor-002", "2025-05-19", "Secondary Persona 'LycanSec' Detected", "Identity", "Forum Zero", "Selling identical credential combos with automated shop links.", 85),
        ("actor-002", "2025-10-14", "Credential Harvester Telemetry Correlated", "Infrastructure", "Deep Web Index Demo", "Hidden service host linked to cloud authentication brute-force infrastructure.", 80),
        ("actor-002", "2026-04-02", "Vouch Link with DarkFalcon Established", "Trust Link", "Forum Nexus", "Cross-vouched corporate network access brokering.", 83),
        ("actor-002", "2026-09-21", "Active Credential Trading Cycle Monitored", "Marketplace", "DarkBazaar Demo", "New batch of 500k combo credentials observed in automated dispenser.", 82),

        # CipherGhost Timeline
        ("actor-003", "2025-04-19", "FUD Crypter Service Announced", "Malware", "DeepSec Forum", "Polymorphic loader subscription launched with Tox contact.", 90),
        ("actor-003", "2025-09-15", "Crypter Licensing Wallet Identified", "Cryptocurrency", "Blockchain Monitor Demo", "Address bc1q-demo-ghost-crypter received over 18.9 BTC in license fees.", 94),
        ("actor-003", "2026-02-05", "Alias 'GhostCrypt' Observed on Market Beta", "Identity", "Market Beta", "Crypter listings cross-posted with matching Tox ID.", 89),
        ("actor-003", "2026-06-30", "C&C Infrastructure Server-Status Leaked", "Infrastructure", "Hidden Service Monitor", "Prometheus metrics endpoint exposed clearnet compiler host IP.", 88),
        ("actor-003", "2026-09-18", "Crypter V4.2 Released with EDR Bypass", "Malware", "DeepSec Forum", "New build updates targeting EDR heuristic engines.", 74),

        # DarkFalcon Timeline
        ("actor-004", "2024-08-11", "Initial Access Broker Profile Established", "Hacking Services", "Forum Nexus", "Brokered Fortune 500 VPN access credentials.", 95),
        ("actor-004", "2025-03-20", "Major Healthcare Network Access Sold", "Intrusion", "TorEscrow Alpha", "Completed 28.5 BTC escrow transaction for domain admin access.", 92),
        ("actor-004", "2026-01-14", "Alias 'ViperStrike' Registered on Market Alpha", "Identity", "Market Alpha", "Corporate perimeter persistence access listings posted.", 88),
        ("actor-004", "2026-09-22", "Active Auction for Logistics Network Access", "Hacking Services", "Forum Nexus", "Starting bid 5 BTC for European logistics enterprise perimeter access.", 89),

        # SilentRoot Timeline
        ("actor-008", "2024-01-15", "Zero-Day Exploit Broker Profile Observed", "Exploits", "DeepSec Forum", "Pre-auth RCE exploit against enterprise SSL-VPN advertised.", 96),
        ("actor-008", "2024-11-20", "PGP Signature 0x99887766 Validated", "Identity", "Forum Nexus", "Verified proof-of-concept cryptographic signature.", 97),
        ("actor-008", "2025-06-18", "55 BTC Wallet Transaction Tracked", "Cryptocurrency", "Blockchain Monitor Demo", "High-value transaction linked to zero-day broker syndicate.", 95),
        ("actor-008", "2026-05-10", "Hidden Service Infrastructure Fingerprinted", "Infrastructure", "Hidden Service Monitor", "Apache status directives matched clearnet staging mirror.", 92),
        ("actor-008", "2026-09-23", "Exploit Advisory Cross-Correlation Confirmed", "Attribution", "DARKTRACE SOC", "Attribution confidence confirmed at 91%.", 91),

        # ApexBreach Timeline
        ("actor-011", "2024-09-05", "Ransomware Extortion Blog Launched", "Data Theft", "Market Alpha", "ApexBreach published initial batch of victim exfiltration dossiers.", 94),
        ("actor-011", "2025-04-10", "Multisig Wallet Recorded 850k USDT Settlement", "Cryptocurrency", "Blockchain Monitor Demo", "Ransom payout tracked to TRC20 wallet.", 90),
        ("actor-011", "2026-02-14", "Wildcard SSL Certificate Correlated to Clearnet", "Infrastructure", "Tor Hidden Service Feed", "Let's Encrypt serial mapped hidden service to apex-press.example.", 86),
        ("actor-011", "2026-09-21", "Telecom Data Exfiltration Leak Auction", "Data Theft", "Market Alpha", "12TB corporate dataset uploaded for public bid.", 88)
    ]
    cursor.executemany("INSERT INTO timeline_events (actor_id, event_date, title, event_type, source_name, evidence, confidence) VALUES (?,?,?,?,?,?,?)", timeline_data)

    # 10. SOURCES (12 Sources with reliability & scan metrics)
    sources_data = [
        ("src-001", "Market Alpha", "Marketplace", "HIGH", "2026-09-23 18:42", "2026-09-23 18:57", 1420, "ONLINE"),
        ("src-002", "Market Beta", "Marketplace", "HIGH", "2026-09-23 18:40", "2026-09-23 18:55", 980, "ONLINE"),
        ("src-003", "Forum Nexus", "Forum", "HIGH", "2026-09-23 18:41", "2026-09-23 18:56", 3250, "ONLINE"),
        ("src-004", "Forum Zero", "Forum", "HIGH", "2026-09-23 18:38", "2026-09-23 18:53", 2110, "ONLINE"),
        ("src-005", "HydraBay Demo", "Marketplace", "MEDIUM", "2026-09-23 18:35", "2026-09-23 18:50", 670, "ONLINE"),
        ("src-006", "DarkBazaar Demo", "Marketplace", "MEDIUM", "2026-09-23 18:30", "2026-09-23 19:00", 410, "DEGRADED"),
        ("src-007", "DeepSec Forum", "Forum", "HIGH", "2026-09-23 18:39", "2026-09-23 18:54", 1890, "ONLINE"),
        ("src-008", "DeepWeb Index Demo", "Deep Web", "MEDIUM", "2026-09-23 18:32", "2026-09-23 19:02", 4500, "ONLINE"),
        ("src-009", "Tor Intelligence Feed Demo", "Hidden Service", "MEDIUM", "2026-09-23 18:42", "2026-09-23 18:57", 890, "ONLINE"),
        ("src-010", "TorEscrow Alpha", "Escrow", "HIGH", "2026-09-23 18:25", "2026-09-23 18:55", 530, "ONLINE"),
        ("src-011", "Blockchain Monitor Demo", "Research", "HIGH", "2026-09-23 18:42", "2026-09-23 18:47", 12400, "ONLINE"),
        ("src-012", "Synthetic Threat Research Feed", "Research", "LOW", "2026-09-23 18:20", "2026-09-23 19:20", 310, "ONLINE")
    ]
    cursor.executemany("INSERT INTO sources VALUES (?,?,?,?,?,?,?,?)", sources_data)

    # 11. OBSERVATIONS (Recent intelligence feed)
    obs_data = [
        ("actor-001", "ShadowX", "Forum Nexus", "Handle XShadow_New active in corporate leaks thread", "Data Theft", 89, "10 mins ago"),
        ("actor-004", "DarkFalcon", "Forum Nexus", "New bid opened for Fortinet VPN credentials", "Hacking Services", 88, "25 mins ago"),
        ("actor-001", "ShadowX", "Tor Intelligence Feed Demo", "Hidden service hs-demo-7f3a.onion descriptor refreshed", "Infrastructure", 84, "35 mins ago"),
        ("actor-003", "CipherGhost", "DeepSec Forum", "Crypter stub v4.2 download key rotated", "Malware", 74, "48 mins ago"),
        ("actor-002", "NightWolf", "Market Beta", "New combo list batch 250k validated entries posted", "Credential Trading", 82, "1 hr ago"),
        ("actor-008", "SilentRoot", "DeepSec Forum", "Zero-day pre-auth PoC cryptographic hash registered", "Hacking Services", 91, "2 hrs ago"),
        ("actor-011", "ApexBreach", "Market Alpha", "Extortion countdown clock updated for telecom victim", "Data Theft", 86, "3 hrs ago"),
        ("actor-005", "NullSpecter", "DarkBazaar Demo", "Wire redirection automated script purchase transaction recorded", "Financial Crime", 79, "4 hrs ago")
    ]
    cursor.executemany("INSERT INTO observations (actor_id, actor_name, source_name, indicator, category, confidence, timestamp) VALUES (?,?,?,?,?,?,?)", obs_data)

    # 12. MONITORING INITIAL STATS
    cursor.execute("""
        INSERT INTO monitoring_stats (
            id, is_active, sources_monitored, collection_interval_mins,
            last_run, next_run, new_footprints, new_actors,
            new_relationships, new_persona_candidates, infrastructure_changes
        ) VALUES (1, 1, 24, 15, '18:42', '18:57', 37, 2, 12, 4, 7)
    """)

    conn.commit()
    conn.close()
    print("Database seeded with high-fidelity synthetic threat-actor intelligence dataset.")

if __name__ == "__main__":
    seed_database()
