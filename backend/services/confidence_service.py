def calculate_attribution_confidence(
    identity_score: float = 85.0,
    infrastructure_score: float = 80.0,
    stylometric_score: float = 88.0,
    behaviour_score: float = 78.0,
    historical_continuity_score: float = 75.0,
    cross_platform_score: float = 82.0
):
    """
    Weighted attribution confidence calculator with explainable sub-factor breakdown.
    Weights:
      - Identity correlation: 25%
      - Infrastructure correlation: 20%
      - Stylometric similarity: 20%
      - Behaviour similarity: 15%
      - Historical continuity: 10%
      - Cross-platform evidence: 10%
    """
    weights = {
        "identity_correlation": 0.25,
        "infrastructure_correlation": 0.20,
        "stylometric_similarity": 0.20,
        "behaviour_similarity": 0.15,
        "historical_continuity": 0.10,
        "cross_platform_evidence": 0.10
    }

    components = [
        {
            "factor": "Identity Correlation",
            "key": "identity_correlation",
            "score": round(identity_score, 1),
            "weight": 25,
            "description": "Corroborated cryptographic PGP keys, reuse of cryptographic wallet clusters, and shared registration metadata."
        },
        {
            "factor": "Infrastructure Correlation",
            "key": "infrastructure_correlation",
            "score": round(infrastructure_score, 1),
            "weight": 20,
            "description": "Overlapping SSL certificate serial numbers, exposed server status directives, and matching JA3/JA4 fingerprints."
        },
        {
            "factor": "Stylometric Similarity",
            "key": "stylometric_similarity",
            "score": round(stylometric_score, 1),
            "weight": 20,
            "description": "TF-IDF n-gram vector affinity, distinctive vocabulary phrasing, and syntax structure concordance."
        },
        {
            "factor": "Behavioural Similarity",
            "key": "behaviour_similarity",
            "score": round(behaviour_score, 1),
            "weight": 15,
            "description": "Synchronized 24-hour diurnal posting distributions, message brevity cadence, and category preferences."
        },
        {
            "factor": "Historical Continuity",
            "key": "historical_continuity",
            "score": round(historical_continuity_score, 1),
            "weight": 10,
            "description": "Temporal alignment between persona retirement on compromised markets and activation of rebranded handles."
        },
        {
            "factor": "Cross-Platform Evidence",
            "key": "cross_platform_evidence",
            "score": round(cross_platform_score, 1),
            "weight": 10,
            "description": "Correlated reputation vouching across multiple independent darknet forums and escrow marketplaces."
        }
    ]

    overall = (
        identity_score * weights["identity_correlation"] +
        infrastructure_score * weights["infrastructure_correlation"] +
        stylometric_score * weights["stylometric_similarity"] +
        behaviour_score * weights["behaviour_similarity"] +
        historical_continuity_score * weights["historical_continuity"] +
        cross_platform_score * weights["cross_platform_evidence"]
    )

    overall_rounded = round(overall, 1)

    if overall_rounded >= 80:
        confidence_level = "HIGH"
        color_class = "emerald"
    elif overall_rounded >= 60:
        confidence_level = "MEDIUM"
        color_class = "amber"
    else:
        confidence_level = "LOW"
        color_class = "rose"

    return {
        "title": "Prototype Attribution Confidence",
        "overall_score": overall_rounded,
        "confidence_level": confidence_level,
        "color_class": color_class,
        "components": components,
        "methodology": "Explainable multi-dimensional weighted attribution heuristic combining cryptographic proof, network telemetry, linguistic stylometry, and operational tempo."
    }
