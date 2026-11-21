"""Adapt the source catalogue to the Observatory's swatch-book view.

The source file owns every title, paragraph and URL. The mapping below is an
editorial choice of one primary thread per entry. Keys use the catalogue's own
trend names so reordering a publication does not change any assignments.
"other" covers cross-cutting entries and subjects outside the eight threads.
"""

import json
from pathlib import Path

from threads import evidence_memberships


PRIMARY_THEMES = {
    "naisbitt-1982": {
        "From factories to information work": "information",
        "High tech, high touch": "technology",
        "National economies become interdependent": "trade",
        "Planning beyond the next quarter": "other",
        "Decisions move closer to communities": "networks",
        "From institutional provision to self-help": "networks",
        "Citizens seek a direct say": "power",
        "Networks challenge hierarchies": "networks",
        "The American Sun Belt gains weight": "population",
        "More ways to live": "other",
    },
    "naisbitt-aburdene-1990": {
        "A decade of worldwide economic expansion": "trade",
        "An arts revival": "other",
        "Socialism adopts market mechanisms": "trade",
        "Global lifestyles and cultural belonging": "other",
        "Welfare provision shifts to private hands": "power",
        "The Pacific becomes an economic centre": "trade",
        "Women gain leadership roles": "power",
        "Biology becomes a defining science": "technology",
        "Religion gains influence": "other",
        "Individuals gain agency": "power",
    },
    "aburdene-naisbitt-1992": {
        "Electoral representation": "power",
        "Enterprise and management": "power",
        "Civic leadership": "networks",
        "Sport and fitness": "power",
        "Health and medical research": "health",
        "Religious authority": "power",
        "Fashion and cultural production": "power",
        "Politics after the Cold War": "power",
    },
    "naisbitt-asia-1996": {
        "Business networks cross national borders": "networks",
        "Domestic consumers drive demand": "trade",
        "Modernisation on Asian terms": "other",
        "Markets gain influence over investment": "trade",
        "Growth concentrates in large cities": "population",
        "Industry moves into advanced technology": "technology",
        "Women gain economic influence": "power",
        "The world’s economic centre shifts east": "trade",
    },
    "nic-2004": {
        "The uneven gains of globalisation": "trade",
        "New powers, especially China and India": "trade",
        "Governance struggles to keep pace": "power",
        "Persistent insecurity": "power",
    },
    "aburdene-2005": {
        "Personal spirituality influences organisations": "other",
        "Business takes wider responsibilities": "power",
        "Middle managers lead change": "power",
        "Faith and reflection enter working life": "other",
        "Purchases express values": "trade",
        "Conscious practices become management tools": "other",
        "Investment incorporates social criteria": "trade",
    },
    "nic-2008": {
        "The world economy gains new centres": "trade",
        "Age structures pull countries apart": "population",
        "More states gain international influence": "power",
        "Resources grow more contested": "climate",
        "New pressures for conflict": "power",
        "Global institutions face harder problems": "networks",
        "US leadership requires power sharing": "power",
    },
    "csiro-2012": {
        "More from less": "climate",
        "Going, going … gone?": "climate",
        "The silk highway": "trade",
        "Forever young": "population",
        "Virtually here": "information",
        "Great expectations": "other",
    },
    "kpmg-2013": {
        "Population structure": "population",
        "Individual empowerment": "power",
        "Technology as an enabler": "technology",
        "Economic interdependence": "trade",
        "Public debt": "power",
        "Shifting economic power": "trade",
        "Climate change": "climate",
        "Strains on resources": "climate",
        "Urban growth": "population",
    },
    "pwc-2014": {
        "Population shifts": "population",
        "Economic power moves": "trade",
        "Faster urbanisation": "population",
        "Climate and resource pressures": "climate",
        "Technological breakthroughs": "technology",
    },
    "oecd-2016": {
        "Population change": "population",
        "Energy and natural resources": "climate",
        "Climate and ecosystems": "climate",
        "Global integration": "trade",
        "Government’s evolving role": "power",
        "Employment and productivity": "technology",
        "Social change": "population",
        "Health and unequal well-being": "health",
    },
    "jrc-2018": {
        "More connected technologies": "networks",
        "Pressure on resources": "climate",
        "Changing work": "technology",
        "New security threats": "power",
        "Climate and ecosystem damage": "climate",
        "Continuing urbanisation": "population",
        "More ways to learn": "information",
        "Changing inequalities": "power",
        "Influence moves east and south": "trade",
        "Growing consumer culture": "trade",
        "Diverging populations": "population",
        "New forms of governance": "networks",
        "Migration’s growing significance": "population",
        "Changing health burdens": "health",
    },
    "oxfam-2020": {
        "Technological innovation": "technology",
        "Hyperconnectivity": "networks",
        "Changing work": "technology",
        "Age structures": "population",
        "Urbanisation": "population",
        "Migration": "population",
        "Health challenges": "health",
        "Climate change": "climate",
        "Resource scarcity": "climate",
        "Multipolarity": "power",
        "Economic inequality": "power",
        "Conflict": "power",
        "Weakening social cohesion": "power",
    },
    "un-2020": {
        "Climate change": "climate",
        "Demographic change": "population",
        "Urbanisation": "population",
        "Digital technologies": "information",
        "Inequalities": "power",
    },
    "ey-2020": {
        "Decarbonising the economy": "climate",
        "Technology rivalry": "trade",
        "Markets shaped by behaviour": "power",
        "Machine-made media": "information",
        "Changes in how people think": "technology",
        "Work crossing into home life": "information",
        "Microbial communities": "health",
        "Biology as a design medium": "technology",
    },
    "csiro-2022": {
        "Living with climate change": "climate",
        "Using resources more efficiently": "climate",
        "Rising health pressures": "health",
        "Shifting geopolitical power": "trade",
        "Wider digital adoption": "information",
        "Greater machine autonomy": "technology",
        "Human needs and trust": "power",
    },
    "defra-2024": {
        "More volatile geopolitics": "power",
        "Growing risks to humanity": "technology",
        "Accelerating human-caused warming": "climate",
        "Accelerating environmental damage": "climate",
        "Scarcity and shifting competition": "climate",
        "Changing demography": "population",
        "Fraying social ties": "power",
        "Urban concentration": "population",
        "Science as a worldview": "information",
        "Pursuit of economic growth": "trade",
    },
    "naughtin-2024": {
    },
    "un-wpp-2024": {
        "Already past peak population": "population",
        "Projected to peak within three decades": "population",
        "Projected to grow through 2054": "population",
    },
    "cifs-2026": {
        "A multipolar world": "power",
        "Age structures turn upside down": "population",
        "The green transition": "climate",
        "More individual life paths": "other",
        "Health beyond treatment": "health",
        "AI built into infrastructure": "technology",
        "Biotechnology across sectors": "technology",
        "More constrained economies": "trade",
        "New patterns of urban growth": "population",
        "Authority through networks": "networks",
        "Concentrated wealth": "power",
    },
    "sitra-2026": {
        "Building a society for longer lives": "population",
        "Democracy under geopolitical pressure": "power",
        "Adapting to ecological crisis": "climate",
        "AI enters society’s core institutions": "technology",
    },
    "ey-2026": {
        "Companies reorganised around automation": "technology",
        "Human–machine collaboration": "technology",
        "Measuring productivity again": "other",
        "Developing people and AI together": "technology",
        "Migration as economic infrastructure": "population",
        "Competition for resources": "climate",
        "The economic value of trust": "power",
        "Rebalancing capitalism": "trade",
    },
    "wef-2026": {
        "Faster technological change": "technology",
        "Changing geopolitical power": "power",
        "A changing climate": "climate",
        "Diverging populations": "population",
        "Two-year risk ranking": "other",
        "Ten-year risk ranking": "other",
    },
    "mckinsey-2026": {
        "AI infrastructure and models": "networks",
        "Agents for multi-step work": "technology",
        "Software development with agents": "technology",
        "AI in science and engineering": "technology",
        "Advanced connectivity": "networks",
        "Specialised semiconductors": "technology",
        "Cybersecurity and trusted systems": "information",
        "Quantum technologies": "technology",
        "Immersive interfaces": "information",
        "Robotics": "technology",
        "New mobility technologies": "technology",
        "Life sciences and bioengineering": "health",
        "Space technologies": "technology",
        "Energy and sustainability technologies": "climate",
    },
}


def get_books(studies):
    """Keep each source and its entries in their original order."""
    memberships = evidence_memberships(studies)
    books = []
    for study in studies:
        study_id = study["id"]
        book = {key: study[key] for key in ("id", "year", "title", "author", "lens", "url", "summary")}
        primary = PRIMARY_THEMES.get(study_id, {})
        entries = []
        for trend in study["trends"]:
            name = trend["name"]
            theme = primary.get(name, "other")
            secondary = [key for key in memberships.get((study_id, name), []) if key != theme]
            entries.append({
                "theme": theme, "themes": [theme, *secondary],
                "text": name, "detail": trend["detail"],
            })
        book["entries"] = entries
        books.append(book)
    return books


if __name__ == "__main__":
    source = Path(__file__).with_name("studies.json")
    catalogue = json.loads(source.read_text(encoding="utf-8"))
    print("window.OBS_BOOKS = " + json.dumps(get_books(catalogue), ensure_ascii=False, indent=2) + ";")
