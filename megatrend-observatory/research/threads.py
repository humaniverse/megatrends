"""Navigation and evidence for the textile edition's eight editorial threads."""

from interpretation import THREADS


# Keys follow the original synthesis chapter. The order of the studies in each
# mapping is the reading order for both the chapter and the interactive thread.
# Values are exact trend names from studies.json. They identify the particular
# passage supporting this reading, even when its primary theme is a different one.
TRAILS = {
    "Technology": ("technology", "Technology & machines", "#e9aa3c", {
        "naisbitt-1982": "From factories to information work",
        "csiro-2012": "Virtually here",
        "csiro-2022": "Greater machine autonomy",
    }),
    "Economy": ("trade", "Trade & economies", "#697bca", {
        "naisbitt-aburdene-1990": "A decade of worldwide economic expansion",
        "nic-2008": "The world economy gains new centres",
        "kpmg-2013": "Public debt",
        "cifs-2026": "More constrained economies",
    }),
    "Environment": ("climate", "Climate & place", "#487b6b", {
        "csiro-2012": "Going, going … gone?",
        "csiro-2022": "Living with climate change",
        "defra-2024": "Accelerating human-caused warming",
    }),
    "Demography": ("population", "Population & ageing", "#b75a74", {
        "nic-2008": "Age structures pull countries apart",
        "jrc-2018": "Diverging populations",
        "un-wpp-2024": "Already past peak population",
    }),
    "Politics": ("power", "Participation & politics", "#805899", {
        "naisbitt-1982": "Citizens seek a direct say",
        "kpmg-2013": "Individual empowerment",
        "sitra-2026": "Democracy under geopolitical pressure",
    }),
    "Knowledge": ("information", "Information & trust", "#3564af", {
        "naisbitt-1982": "From factories to information work",
        "ey-2020": "Machine-made media",
        "ey-2026": "The economic value of trust",
    }),
    "Power": ("networks", "Networks & power", "#c2643e", {
        "naisbitt-1982": "Networks challenge hierarchies",
        "cifs-2026": "Authority through networks",
    }),
    "Health": ("health", "Health & care", "#628b9b", {
        "naisbitt-aburdene-1990": "Biology becomes a defining science",
        "csiro-2012": "Forever young",
        "sitra-2026": "Building a society for longer lives",
    }),
}


def get_threads():
    if {record[0] for record in THREADS} != TRAILS.keys():
        raise ValueError("The synthesis and the textile edition must use the same threads.")
    records = []
    for original, title, opening, middle, question in THREADS:
        theme_id, label, colour, evidence = TRAILS[original]
        records.append({
            "id": theme_id, "label": label, "color": colour, "original": original,
            "title": title, "opening": opening, "middle": middle, "question": question,
            "books": list(evidence), "evidence": evidence,
        })
    return records


def evidence_memberships(studies):
    """Index threads by the exact (study ID, trend name) they cite."""
    known = {study["id"]: [trend["name"] for trend in study["trends"]] for study in studies}
    memberships = {}
    for theme_id, _, _, evidence in TRAILS.values():
        for study_id, trend_name in evidence.items():
            if known.get(study_id, []).count(trend_name) != 1:
                raise ValueError(f"{theme_id}: expected exactly one {trend_name!r} in {study_id!r}")
            memberships.setdefault((study_id, trend_name), []).append(theme_id)
    return memberships
