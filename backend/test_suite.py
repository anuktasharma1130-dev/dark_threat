import urllib.request
import json
import sys

base = 'http://127.0.0.1:8000'
fe_base = 'http://127.0.0.1:5173'

def run_tests():
    passed = 0
    total = 0

    def check(name, test_func):
        nonlocal passed, total
        total += 1
        try:
            test_func()
            print(f"[PASS] {name}")
            passed += 1
        except Exception as e:
            print(f"[FAIL] {name}: {e}")

    # 1. Dashboard
    def t1():
        req = urllib.request.urlopen(f"{base}/api/dashboard")
        data = json.loads(req.read().decode())
        assert data['kpis']['threat_actors'] == 127
        assert len(data['categories']) >= 6
        assert len(data['recent_intelligence']) >= 8
    check("1. Dashboard KPIs & Feed", t1)

    # 2. Actors Filter
    def t2():
        req = urllib.request.urlopen(f"{base}/api/actors?category=Data+Theft")
        data = json.loads(req.read().decode())
        assert len(data) >= 2
        assert data[0]['category'] == 'Data Theft'
    check("2. Actors Filter by Category", t2)

    # 3. Actor Dossier
    def t3():
        req = urllib.request.urlopen(f"{base}/api/actors/actor-001")
        data = json.loads(req.read().decode())
        assert data['actor']['name'] == 'ShadowX'
        assert len(data['identity_indicators']['handles']) >= 3
        assert len(data['identity_indicators']['pgp_keys']) >= 2
        assert len(data['identity_indicators']['wallets']) >= 2
        assert data['confidence_breakdown']['overall_score'] >= 80
    check("3. Actor Intelligence Dossier (/actors/actor-001)", t3)

    # 4. Infrastructure Analyzer
    def t4():
        payload = json.dumps({'onion_address': 'hs-demo-7f3a.onion'}).encode()
        req = urllib.request.Request(f"{base}/api/infrastructure/analyze", data=payload, headers={'Content-Type': 'application/json'})
        data = json.loads(urllib.request.urlopen(req).read().decode())
        assert data['correlation_confidence'] == 84
        assert data['candidate_clearnet_domain'] == 'demo-infrastructure.example'
        assert len(data['analysis_checks']) == 5
    check("4. Infrastructure Correlation Analysis", t4)

    # 5. AI Persona Analysis
    def t5():
        payload = json.dumps({'persona_a_id': 'persona-001', 'persona_b_id': 'persona-002'}).encode()
        req = urllib.request.Request(f"{base}/api/persona/analyze", data=payload, headers={'Content-Type': 'application/json'})
        data = json.loads(urllib.request.urlopen(req).read().decode())
        assert data['metrics']['stylometric_similarity'] == 91.0
        assert data['metrics']['vocabulary_similarity'] == 88.0
        assert data['metrics']['sentence_similarity'] == 86.0
        assert data['metrics']['behavioural_similarity'] == 84.0
        assert data['metrics']['posting_time_similarity'] == 79.0
        assert data['metrics']['overall_confidence'] == 89.0
        assert 'Rebranded' in data['verdict']
    check("5. AI Persona Stylometry & Rebranding", t5)

    # 6. Autonomous Collection Cycle
    def t6():
        req = urllib.request.Request(f"{base}/api/collection/run", data=b"", headers={'Content-Type': 'application/json'})
        data = json.loads(urllib.request.urlopen(req).read().decode())
        assert data['status'] == 'SUCCESS'
        assert data['stats']['new_footprints'] >= 37
    check("6. Autonomous Collection Cycle Simulation", t6)

    # 7. Categorized Search
    def t7():
        req = urllib.request.urlopen(f"{base}/api/search?q=ShadowX")
        data = json.loads(req.read().decode())
        assert data['total_results'] >= 1
        assert len(data['results']['actors']) >= 1
    check("7. Categorized Global Search", t7)

    # 8. CSV Export
    def t8():
        req = urllib.request.urlopen(f"{base}/api/export/actors/csv")
        content = req.read().decode()
        assert 'Actor ID' in content
        assert 'ShadowX' in content
    check("8. Threat Actor CSV Export", t8)

    # 9. JSON Export
    def t9():
        req = urllib.request.urlopen(f"{base}/api/export/actors/json")
        data = json.loads(req.read().decode())
        assert data['problem_statement'] == 'SIH 2026 PS 26151'
        assert len(data['threat_actors']) >= 10
    check("9. Structured Intelligence JSON Export", t9)

    # 10. Report Generation
    def t10():
        payload = json.dumps({'actor_id': 'actor-001'}).encode()
        req = urllib.request.Request(f"{base}/api/reports/generate", data=payload, headers={'Content-Type': 'application/json'})
        data = json.loads(urllib.request.urlopen(req).read().decode())
        assert 'DT-REP-' in data['report_id']
        assert 'ShadowX' in data['title']
        assert 'limitations_and_disclaimer' in data
    check("10. Full Intelligence Report Generation", t10)

    # 11. Frontend Server HTML
    def t11():
        req = urllib.request.urlopen(f"{fe_base}/")
        content = req.read().decode()
        assert 'DARKTRACE' in content
        assert 'root' in content
    check("11. Frontend React Dev Server Serving Index", t11)

    print(f"\n==========================================")
    print(f"Results: {passed}/{total} tests passed successfully!")
    print(f"==========================================")

if __name__ == '__main__':
    run_tests()
