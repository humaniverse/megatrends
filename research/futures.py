"""Shape the existing research records for the loom and swatch-book readers."""

import json
from pathlib import Path

from interpretation import ASSUMPTION_SOURCES, NEXT, OTHERS, PRIORITIES


HERE = Path(__file__).resolve().parent

# Short prompts and theme assignments are navigation added by the textile edition.
WATCH_CONTEXT = {
    "machine-agency": ("autonomous-infrastructure", "technology", "Who can pause an action, understand how it happened and put things right?"),
    "synthetic-reality": ("synthetic-reality", "information", "What would count as evidence if seeing and hearing an event were only the beginning of verification?"),
    "geoeconomic-confrontation": ("geoeconomic-confrontation", "trade", "Which apparently ordinary dependency could give someone a veto?"),
    "climate-reorganisation": ("climate-reorganisation", "climate", "Which decisions could make a place difficult to live in before the next extreme event?"),
    "demographic-bifurcation": ("demographic-bifurcation", "population", "Whose shortage is being solved, and where does the work of care land?"),
    "network-power": ("network-power", "networks", "Who could disconnect this service, and who could reconnect it?"),
}

# The archive describes in detail what happens if assumptions loosen. Pair each
# with a conditional continuation of that same premise for the comparison view.
ASSUMPTION_CONTEXT = {
    "reintegration": ("fragmentation", "Rival blocs duplicate supply chains and restrict access to critical goods. A buyer needs several suppliers and permission to reach them."),
    "hybrid": ("automation", "Organisations delegate more decisions as performance improves and prices fall. Staff spend more time handling exceptions."),
    "transition": ("green-transition", "Cheaper clean technologies and supportive policy reinforce one another across regions. Planners expect each round of deployment to be easier to finance."),
    "longevity": ("ageing", "Extra years of life bring more years needing support. A smaller paid workforce must find time and money to provide it."),
    "cities": ("urbanisation", "Jobs and services keep drawing people into the largest centres. Investment gravitates towards metropolitan transport, housing and hospitals."),
    "collectivism": ("individualisation", "Housing, work and consumption are organised around individual choice. Institutions assume people can navigate services by themselves."),
    "democracy": ("democratic-decline", "As trust weakens, decisions move further from public scrutiny. People who feel unheard have fewer reasons to take part."),
    "offline": ("digitalisation", "Digital channels become the default for banking, benefits and appointments. Service providers design around a connected user."),
    "sovereignty": ("concentrated-networks", "Large networks attract more users and suppliers. Leaving can mean abandoning contacts, records or access to markets."),
    "redistribution": ("inequality", "Gains accrue to owners of scarce assets and infrastructure. A more productive economy can still leave essentials beyond reach."),
    "prevention": ("chronic-disease", "Longer lives bring more people living with several conditions. Services organise around repeat treatment and ongoing support."),
    "abundance": ("scarcity", "Growing demand runs up against limits in energy, land, materials and water. Planning centres on rationing and substitution."),
}

SCENARIO_IDS = {
    "age-of-abundance": "abundance",
    "return-of-the-human": "human",
    "demographic-inversion": "demographic",
}

CANDIDATE_QUESTIONS = {
    "discovery": "What changes if finding a promising material takes less time than independently testing it?",
    "physical": "Which digital services can a place sustain when power, water, land and grid capacity are also needed for homes and industry?",
    "orbit": "How might everyday services change when their communications, navigation or observations depend on decisions made about orbital infrastructure?",
    "contract": "How might societies share income, care and security when paid employment and family structures change?",
}


def sources(pairs):
    return [{"label": label, "url": url} for label, url in pairs]


def get_futures():
    stress = json.loads((HERE / "scenarios.json").read_text(encoding="utf-8"))
    watch = []
    for item in PRIORITIES:
        entry_id, theme, question = WATCH_CONTEXT[item["id"]]
        watch.append({
            "id": entry_id,
            "originalId": item["id"],
            "title": item["name"],
            "category": item["category"],
            "theme": theme,
            "image": item["image"],
            "subtitle": item["subtitle"],
            "baseline": item["old"],
            "premise": item["now"],
            "implication": item["stakes"],
            "signal": item["watch"],
            "sources": sources(item["sources"]),
            "question": question,
        })

    scenarios = []
    for item in stress["scenarios"]:
        scenarios.append({
            "id": SCENARIO_IDS[item["id"]],
            "originalId": item["id"],
            "title": item["title"],
            "story": item["vignette"],
            "mechanism": item["mechanism"],
            "implication": item["distribution"],
            "signal": item["watch"],
            "assumptionIds": [ASSUMPTION_CONTEXT[key][0] for key in item["links"]],
        })

    assumptions = []
    for item in stress["assumptions"]:
        entry_id, holds = ASSUMPTION_CONTEXT[item["id"]]
        scenario_ids = [scene["id"] for scene in scenarios if entry_id in scene["assumptionIds"]]
        assumptions.append({
            "id": entry_id,
            "originalId": item["id"],
            "title": item["assumption"],
            "alternative": item["alternative"],
            "holds": holds,
            "loosens": item["mechanism"],
            "implication": item["implication"],
            "signal": item["watch"],
            "sources": sources(ASSUMPTION_SOURCES[item["id"]]),
            "scenario": scenario_ids[0] if scenario_ids else None,
            "scenarioIds": scenario_ids,
        })

    candidates = [
        {"id": entry_id, "title": title, "question": CANDIDATE_QUESTIONS[entry_id],
         "baseline": roots, "implication": implication, "signal": watch_for, "sources": sources(refs)}
        for entry_id, title, roots, implication, watch_for, refs in NEXT
    ]
    others = [
        {"id": entry_id, "title": title, "category": category, "premise": roots,
         "signal": watch_for, "sources": sources(refs)}
        for entry_id, title, category, roots, watch_for, refs in OTHERS
    ]
    climate = {
        **stress["climate"],
        "signal": stress["climate"]["watch"],
        "sources": sources([("IPCC · Impacts, Adaptation and Vulnerability", stress["climate"]["url"])]),
    }
    classifications = [
        {"title": "New phenomenon", "description": "A capability or practice becomes possible at materially different scale or cost. Establish the capability and specify what people can now do."},
        {"title": "New configuration", "description": "Familiar forces interact in a consequential new arrangement. The change may reverse the implications an earlier author expected."},
        {"title": "New framing", "description": "An established force moves into a new phase or is understood through a different question. The underlying process may be decades old."},
    ]
    return {
        "watch": watch, "assumptions": assumptions, "scenarios": scenarios, "candidates": candidates,
        "others": others, "climate": climate, "classifications": classifications,
    }


if __name__ == "__main__":
    print("window.OBS_FUTURES = " + json.dumps(get_futures(), ensure_ascii=False, indent=2) + ";")
