"""Year-by-year stories, linked to findings in the publication catalogue."""

HORIZONS = [
    (1980, "1980", "Historical snapshot"),
    (1995, "1995", "Historical snapshot"),
    (2010, "2010", "Historical snapshot"),
    (2025, "2025–26", "Recent evidence"),
    (2040, "2040", "Possible future"),
    (2050, "2050", "Possible future"),
]

# Old bookmarks and links point to the thread that now carries that story.
ALIASES = {"intelligence": "technology", "cities": "population", "work": "technology", "energy": "climate"}

# Each stage pairs an editorial headline and decision with dated evidence.
# The optional last value points to an interpretation, assumption or scenario.
STORIES = {
    "technology": ("intelligence", [
        ("From the factory floor to the computer terminal",
         "An employer moving records onto computers has to decide who gets trained for the new jobs and what happens to the workers whose old roles disappear.",
         [("naisbitt-1982", "From factories to information work")]),
        ("An office can share documents across borders",
         "As production moves into more advanced technology, a firm coordinating suppliers across several cities has to decide which teams can correct a specification and approve a change.",
         [("naisbitt-asia-1996", "Industry moves into advanced technology")]),
        ("The office can follow workers home",
         "If colleagues can share a file from anywhere, managers still have to agree when staff should be reachable and which decisions need people in the same room.",
         [("csiro-2012", "Virtually here")]),
        ("When software can change a benefits decision",
         "A benefits office can give software permission to draft a letter or to update a claim. When a payment stops, who can inspect the change, correct it and hear an appeal?",
         [("csiro-2022", "Greater machine autonomy"), ("mckinsey-2026", "Agents for multi-step work")]),
        ("The same AI tool saves two teams an hour",
         "Imagine one manager giving staff the hour for training while another raises the output target. Which agreement gives workers a say over how the time is used?",
         [("ey-2026", "Measuring productivity again")], ("assumption", "hybrid"), ("scenario", "return-of-the-human")),
        ("A caseworker can overrule the system",
         "If software handles routine claims, a council could give named caseworkers the time and power to fix exceptions. A right to appeal depends on whether residents can reach someone who can act.",
         [("sitra-2026", "AI enters society’s core institutions")], ("assumption", "offline")),
    ]),
    "trade": ("work", [
        ("A local factory depends on overseas orders",
         "A town deciding whether to train more apprentices has to consider demand and investment decisions made far beyond its borders.",
         [("naisbitt-1982", "National economies become interdependent")]),
        ("Suppliers follow the Pacific’s growth",
         "A manufacturer moving closer to Asian customers has to decide whether to develop local suppliers or keep buying parts from the firms it already knows.",
         [("naisbitt-aburdene-1990", "The Pacific becomes an economic centre")]),
        ("Open markets spread gains unevenly",
         "A port can gain from more trade while an inland factory town loses jobs. Where should a government invest in transport or retraining when those effects fall in different places?",
         [("nic-2004", "The uneven gains of globalisation"), ("nic-2008", "The world economy gains new centres")]),
        ("The supplier is willing. The payment route is closed.",
         "An aid agency with money and a willing supplier can still struggle to pay a local partner. Which bank, licence or payment route gives another government leverage over the purchase?",
         [("csiro-2022", "Shifting geopolitical power"), ("wef-2026", "Changing geopolitical power")]),
        ("A second supplier can still face the same restriction",
         "If rival blocs split trade in critical goods, a hospital buying spare parts could select suppliers in different jurisdictions. How much more would it pay to keep a genuinely independent route open?",
         [("cifs-2026", "A multipolar world")], ("assumption", "reintegration")),
        ("Cheap production still leaves some homes unconnected",
         "If clean power and local workshops make water treatment cheaper, a utility could use the savings to cut bills or extend the pipes. Households outside the network have more to gain from the second choice.",
         [("ey-2026", "Rebalancing capitalism")], ("assumption", "abundance")),
    ]),
    "climate": ("climate", [
        ("Climate research crosses borders",
         "A weather service can contribute its observations to a shared record. What would scientists need to compare before telling a coastal authority to plan for a different climate?",
         [("conference-1979",)]),
        ("Countries meet in Berlin to negotiate obligations",
         "As governments begin talks on stronger commitments, they have to decide who should cut emissions first and how they will compare progress.",
         [("berlin-1995",)]),
        ("A council has to budget for heavier losses",
         "A council replacing a road can rebuild along the same route or move it away from places likely to flood. The cheaper choice today could leave an expensive maintenance bill.",
         [("kpmg-2013", "Climate change"), ("csiro-2012", "Going, going … gone?")]),
        ("Similar flood risk, different insurance offers",
         "One town can finance flood defences and keep cover affordable. Another faces rising premiums and some households consider moving. Who gets a viable choice when renters have less say in repairs or relocation?",
         [("csiro-2022", "Living with climate change"), ("sitra-2026", "Adapting to ecological crisis")]),
        ("Cheap solar, long waits for a grid connection",
         "A utility with a full connection queue could give scarce grid capacity to a battery, a data centre or new homes. Who benefits depends on which projects can connect and what they pay.",
         [("cifs-2026", "The green transition")], ("assumption", "transition"), ("candidate", "physical")),
        ("Two towns choose different ways to live with floods",
         "One town could repair its defences while another pays households to move. Counting flood deaths alone would miss displaced renters, uninsured losses and long breaks in care.",
         [("defra-2024", "Accelerating human-caused warming")], ("priority", "climate-reorganisation")),
    ]),
    "population": ("population", [
        ("Families and jobs move towards the Sun Belt",
         "A growing school district in the southern United States needs classrooms. A district losing families has to decide how long it can keep several schools open.",
         [("naisbitt-1982", "The American Sun Belt gains weight")]),
        ("Jobs move into Asian cities faster than housing can follow",
         "A growing city could reserve land for affordable homes close to employment or leave new arrivals to build farther out and commute.",
         [("naisbitt-asia-1996", "Growth concentrates in large cities")]),
        ("An outlook anticipates diverging age structures",
         "If one country has fewer workers and another has a large group entering working age, a government deciding where to invest in schools, jobs or care needs a local age profile.",
         [("nic-2008", "Age structures pull countries apart")]),
        ("One district needs carers. Another needs first jobs.",
         "Hiring carers from a younger region may ease one district’s shortage. How will it change the supply of care and the kinds of jobs available where those workers leave?",
         [("un-wpp-2024", "Already past peak population"), ("un-wpp-2024", "Projected to peak within three decades"),
          ("un-wpp-2024", "Projected to grow through 2054")]),
        ("An older region copes better than a younger one",
         "If people stay healthy for longer, a retired electrician might choose to help neighbours adapt their homes. In a younger region, firms could automate tasks faster than they create first jobs. Which signs would tell a planner that the usual risks have reversed?",
         [("un-wpp-2024", "Already past peak population")], ("scenario", "demographic-inversion")),
        ("A country urbanises while one of its cities shrinks",
         "A city with fewer households still has water mains to maintain. Should its utility raise bills, consolidate the network or ask the national government to share the cost?",
         [("cifs-2026", "New patterns of urban growth")], ("assumption", "cities")),
    ]),
    "power": ("ledger", [
        ("Residents ask for a direct say",
         "A town debating a road or school closure can leave the decision to elected representatives or give affected residents a role in setting the options. Who can take part in either route?",
         [("naisbitt-1982", "Citizens seek a direct say")]),
        ("More women seek elected office",
         "A political party can invite more women to stand while continuing to select candidates through the same local gatekeepers. Where would a rule change give applicants a real chance of selection?",
         [("aburdene-naisbitt-1992", "Electoral representation")]),
        ("More people can organise around a local decision",
         "When residents can mobilise quickly, a council deciding where to open a new clinic can ask for proposals early enough to change the plan. How does it hear people who cannot join the campaign?",
         [("kpmg-2013", "Individual empowerment")]),
        ("A council has to make a decision the public can scrutinise",
         "When officials assess an emergency response under political pressure, which evidence can they release, who can challenge it and who has the authority to revise the decision?",
         [("sitra-2026", "Democracy under geopolitical pressure")], ("assumption", "democracy")),
        ("Residents can see what changed after they spoke",
         "If a council uses a citizens’ panel to choose flood investments, it could publish which proposals it adopted and who can appeal. Participation may depend on whether people can see that it changed a budget.",
         [("sitra-2026", "Democracy under geopolitical pressure")], ("assumption", "democracy")),
        ("Neighbours pool costs when cover becomes unaffordable",
         "If households fund a local flood mutual, they will have to decide who can join, how losses are shared and when they need public backing.",
         [("ey-2026", "Rebalancing capitalism")], ("assumption", "collectivism")),
    ]),
    "information": ("jacquard", [
        ("Finding the right information becomes part of the job",
         "As customer records move between teams, a company has to decide who can correct an error and how colleagues will know which copy to trust.",
         [("naisbitt-1982", "From factories to information work")]),
        ("Global entertainment reaches local audiences",
         "A broadcaster buying programmes from abroad has to decide how much airtime to put aside for local stories and whose accounts to carry.",
         [("naisbitt-aburdene-1990", "Global lifestyles and cultural belonging")]),
        ("A witness can publish before the newsroom arrives",
         "A local newsroom receiving photos from the public can distribute them quickly. How will editors check when and where an image was taken before naming the people in it?",
         [("csiro-2012", "Virtually here")]),
        ("Anyone can submit a convincing image after a flood",
         "A relief office can require proof of where a photo came from. How will it accept a genuine claim from someone who borrowed a phone or has no surviving records?",
         [("ey-2020", "Machine-made media"), ("ey-2026", "The economic value of trust")]),
        ("A genuine claim needs a way past the automated checks",
         "If fabricated documents become cheap to make, a benefits office could accept a conversation and a call to the landlord as another route to verify a claim. Who will staff that route?",
         [("ey-2026", "The economic value of trust")], ("scenario", "return-of-the-human")),
        ("A clinic keeps an in-person route for sensitive records",
         "If secure digital verification becomes standard, a clinic could still accept a patient in person when records are lost or disputed. How much staff time would it take to keep both routes usable?",
         [("csiro-2022", "Human needs and trust")], ("assumption", "offline")),
    ]),
    "networks": ("cities", [
        ("Workers can coordinate across the organisation chart",
         "A team relying on an informal network can solve a problem without asking several managers. Who can see the decision later and take responsibility for it?",
         [("naisbitt-1982", "Networks challenge hierarchies")]),
        ("A trading network crosses national borders",
         "A small firm gaining orders through business contacts abroad needs to decide whether to rely on one intermediary or pay to develop a second route to customers.",
         [("naisbitt-asia-1996", "Business networks cross national borders")]),
        ("A shared platform becomes the route to customers",
         "A shop selling through an online marketplace can reach new customers. Could it keep trading if it lost its account, ratings or access to customer records?",
         [("csiro-2012", "Virtually here"), ("kpmg-2013", "Economic interdependence")]),
        ("Several internet retailers share one point of failure",
         "A clinic buying a backup connection could ask who owns the last stretch of cable and who can restore it. Different retail contracts may still depend on the same operator.",
         [("cifs-2026", "Authority through networks")]),
        ("A town tests whether it can switch providers",
         "If a town depends on one cloud provider, it could require a trial transfer of records, permissions and appointments before renewing the contract. How long can public services run during the switch?",
         [("cifs-2026", "Authority through networks")], ("assumption", "sovereignty")),
        ("A rural clinic depends on an operator in orbit",
         "If a satellite service becomes the clinic’s main connection, it could negotiate emergency access and pay to maintain a second route. Who decides whether the service stays available during a dispute?",
         [("mckinsey-2026", "Space technologies")], ("candidate", "orbit")),
    ]),
    "health": ("earth", [
        ("More responsibility for care moves to families and neighbours",
         "A community replacing some institutional support with local care has to decide who does the work, how they are trained and who helps when they need a break.",
         [("naisbitt-1982", "From institutional provision to self-help")]),
        ("A new treatment has to reach patients",
         "If advances in biology give a hospital more treatment options, it still has to decide who qualifies and whether patients can afford to travel for repeat visits.",
         [("naisbitt-aburdene-1990", "Biology becomes a defining science")]),
        ("Longer lives can mean more demand for home care",
         "A district planning care can add residential places or adapt homes and fund visiting support. The right balance depends on what residents can do safely and what help they want.",
         [("csiro-2012", "Forever young")]),
        ("People live longer. Who will provide the care?",
         "A town with long waits for home support could improve paid care jobs or rely more on relatives reducing their hours. What would that do to each household’s income and time?",
         [("sitra-2026", "Building a society for longer lives")], ("candidate", "contract")),
        ("A clinic can put more effort into prevention",
         "If effective prevention lowers new cases, a clinic could move capacity from repeat appointments to outreach. The decision depends on whether people who face the highest risk can access the programme.",
         [("cifs-2026", "Health beyond treatment")], ("assumption", "prevention")),
        ("Care, work and retirement no longer happen in a fixed order",
         "If people spend more of a longer life moving between work and care, benefits tied to one employer could leave gaps. Which entitlements should follow a person across those changes?",
         [("sitra-2026", "Building a society for longer lives")], ("candidate", "contract")),
    ]),
}

CLIMATE_TIMELINE = "https://www.un.org/sustainabledevelopment/climate-negotiations-timeline/"
EXTERNAL = {
    "conference-1979": ("United Nations", 2018, "First World Climate Conference, 1979",
                        "The first World Climate Conference brought climate research into an international forum.", CLIMATE_TIMELINE),
    "berlin-1995": ("United Nations", 2018, "First UN climate conference of the parties, 1995",
                    "Parties met in Berlin for the first conference under the UN climate convention.", CLIMATE_TIMELINE),
}

SHORT_CREDITS = {
    "naisbitt-1982": "Naisbitt",
    "naisbitt-aburdene-1990": "Naisbitt & Aburdene",
    "aburdene-naisbitt-1992": "Aburdene & Naisbitt",
    "naisbitt-asia-1996": "Naisbitt",
    "nic-2004": "US National Intelligence Council",
    "nic-2008": "US National Intelligence Council",
    "kpmg-2013": "KPMG & Mowat Centre",
    "defra-2024": "Andthen for Defra",
    "un-wpp-2024": "UN DESA",
    "cifs-2026": "CIFS",
    "wef-2026": "World Economic Forum",
}


def get_explorer(books, threads, futures):
    if STORIES.keys() != {thread["id"] for thread in threads}:
        raise ValueError("The explorer must cover the same threads as By theme.")
    by_id = {book["id"]: book for book in books}

    def evidence(study_id, finding=None):
        if finding is None:
            author, year, finding, detail, href = EXTERNAL[study_id]
        else:
            book = by_id[study_id]
            matches = [(i, entry["detail"]) for i, entry in enumerate(book["entries"], 1) if entry["text"] == finding]
            if len(matches) != 1:
                raise ValueError(f"{study_id}: expected exactly one {finding!r}")
            index, detail = matches[0]
            author, year = SHORT_CREDITS.get(study_id, book["author"]), book["year"]
            href = f"../history/index.html#{study_id}--trend-{index}"
        return {"author": author, "year": year, "finding": finding, "detail": detail, "href": href}

    watch = {item["theme"]: ("priority", item["originalId"]) for item in futures["watch"]}
    references = {}
    for kind, path, key, label in [
        ("priority", "priorities", "watch", "title"),
        ("candidate", "next", "candidates", "title"),
        ("assumption", "scenarios", "assumptions", "alternative"),
        ("scenario", "scenarios", "scenarios", "title"),
    ]:
        for item in futures[key]:
            anchor = item["originalId"] if kind != "candidate" else item["id"]
            references[kind, anchor] = {"label": item[label], "href": f"../{path}/index.html#{anchor}"}

    stories = {}
    for thread_id, (image, stages) in STORIES.items():
        snapshots = {}
        for (year, _, _), (headline, decision, sources, *related) in zip(HORIZONS, stages, strict=True):
            if year == 2025 and thread_id in watch:
                related.insert(0, watch[thread_id])
            if year >= 2040 and not related:
                raise ValueError(f"{year} {thread_id}: a future snapshot needs related reading.")
            snapshots[year] = {"headline": headline, "decision": decision,
                               "evidence": [evidence(*source) for source in sources],
                               "related": [references[reference] for reference in related]}
        stories[thread_id] = {"image": image, "snapshots": snapshots}
    return {"horizons": HORIZONS, "stories": stories}
