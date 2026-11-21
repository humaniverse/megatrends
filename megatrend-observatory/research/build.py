"""Render the research chapters as accessible, linkable static HTML."""
from html import escape
from pathlib import Path
from itertools import groupby
import json

from interpretation import PRIORITIES, OTHERS, THREADS, NEXT, ASSUMPTION_SOURCES
from books import get_books
from futures import get_futures
from threads import TRAILS, get_threads

ROOT = Path(__file__).resolve().parent
DIST = ROOT.parent / 'dist'
STUDIES = json.loads((ROOT / 'studies.json').read_text())
STRESS = json.loads((ROOT / 'scenarios.json').read_text())
SITE = 'https://megatrend-observatory.matthewgthomas.chatgpt.site'
PAGES = [
    ('history', 'Books & reports'), ('synthesis', 'What changed'), ('priorities', 'Six to watch'),
    ('next', 'Next generation'), ('scenarios', 'Assumptions & scenarios')
]
ERAS = {
    1980: ("America looks past the factory", "Naisbitt started with American newspapers and described changes people could already recognise in their jobs, communities and choices. His ten directions often had a destination: a society organised around information, networks and participation."),
    1990: ("The world opens up, unevenly", "The 1990 book took a global view of markets, culture, faith and biology. Later books examined women’s power and Asian economies in their own right. Global lifestyles and cultural nationalism sat side by side even in this optimistic period."),
    2000: ("Globalisation acquires a politics", "A business author asked whether values could reshape capitalism. Security analysts asked who gained from integration and who could disrupt it. Between its 2004 and 2008 outlooks, the US National Intelligence Council gave greater weight to a world with several centres of power."),
    2010: ("A policy vocabulary takes shape", "Ageing, urban growth, technological change, resources and shifting economic power recur. The institutional lens now matters enormously. A public-finance team sees debt, a science agency sees biodiversity, and a European policy lab sees migration, learning and governance."),
    2020: ("Living with the consequences", "Reports foreground adaptation, rivalry, the reliability of information and the authority delegated to machines. The remit still shapes the list. A humanitarian or development lens foregrounds distribution, while an investment outlook distinguishes technologies that attract capital.")
}
def e(value):
    return escape(str(value), quote=True)

def local_href(url):
    if url.startswith('/') and not url.startswith('//'):
        path, separator, fragment = url.partition('#')
        return '..' + path + ('index.html' if path.endswith('/') else '') + separator + fragment
    return url

def link(url, label):
    return f'<a href="{e(local_href(url))}">{e(label)}</a>'

def sources(items):
    return '<div class="references"><span>Sources</span>'+' '.join(link(url,label) for label,url in items)+'</div>'

def study_links(ids):
    records = {s['id']:s for s in STUDIES}
    return ' · '.join(link('/history/#'+i,f"{records[i]['author']} ({records[i]['year']})") for i in ids)

def plate(path):
    return f'<img src="../assets/{path}.webp" alt="" loading="lazy">'

def subnav(current):
    return '<nav class="chapter-nav" aria-label="Research chapters"><div class="container">'+''.join(
        f'<a href="../{slug}/index.html"'+(' aria-current="page"' if slug==current else '')+f'>{e(title)}</a>' for slug,title in PAGES)+'</div></nav>'

def para(s):
    return '<p>'+e(s)+'</p>'

def field(title, copy):
    return f'<div class="field"><h4>{e(title)}</h4>{para(copy)}</div>'

def hero(title, intro, caption):
    return f'<section class="reading-hero"><div class="container reading-hero-inner"><div><h1>{e(title)}</h1><p>{e(intro)}</p></div><figure><img src="../assets/jacquard.webp" alt=""><figcaption>{e(caption)}</figcaption></figure></div></section>'

def layout(slug, heading, intro, art, caption, body, next_label, next_url):
    nav = subnav(slug)
    brand = '<a href="../index.html" class="brand"><img src="../assets/mark.svg" alt="" width="34" height="34">Megatrend Observatory</a>'
    routes = [('loom', 'The loom'), ('book', 'Swatch book'), ('watch', 'Six to watch'), ('futures', 'Possible futures'), ('guide', 'Field guide')]
    home_nav = ''.join(f'<a class="nav-item" href="../index.html#{route}">{label}</a>' for route, label in routes)
    text = f'''<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#261b32"><title>{e(heading)} · Megatrend Observatory</title><meta name="description" content="{e(intro)}">
<link rel="canonical" href="{SITE}/{slug}/"><link rel="icon" href="../assets/mark.svg"><link rel="stylesheet" href="../style.css"><link rel="stylesheet" href="../research.css"><link rel="stylesheet" href="../archive.css"><script src="../research.js" defer></script>
</head><body class="research-page archive archive-{slug}"><a class="skip" href="#reading">Skip to chapter</a>
<header class="masthead"><div class="container nav-inner">{brand}<nav aria-label="Main navigation">{home_nav}</nav></div></header>
<main>{hero(heading,intro,caption)}{nav}<div id="reading" class="container reading" tabindex="-1">{body}
<div class="continue"><span>Continue exploring</span>{link(next_url,next_label)}</div></div></main>
<footer><div class="container footer-inner">{brand}<a href="../explorer/index.html">Explore by year</a><a href="../index.html#guide">Field guide</a></div></footer></body></html>'''
    folder=DIST/slug
    folder.mkdir(exist_ok=True)
    (folder/'index.html').write_text(text)

def study(record):
    s=record
    entries=''.join(f'<li><strong>{e(t["name"])}</strong>{para(t["detail"])}</li>' for t in s['trends'])
    return f'''<details class="study" id="{e(s['id'])}" data-year="{s['year']}" {'open' if s['id']=='naisbitt-1982' else ''}><summary><span class="year-stamp">{s['year']}</span><span><small>{e(s['author'])}</small><b>{e(s['title'])}</b></span><span class="disclose" aria-hidden="true"></span></summary><div class="study-body"><p class="lens">{e(s['lens'])}</p>{para(s['summary'])}{'<ul class="entries">'+entries+'</ul>' if entries else ''}{sources([(s['title'],s['url'])])}</div></details>'''

def history():
    options=''.join(f'<option value="{s["id"]}">{e(s["author"])} · {s["year"]} · {e(s["title"])}</option>' for s in STUDIES if s['trends'])
    compare=f'''<details class="compare js-only" id="compare"><summary>Compare two publications <span class="disclose" aria-hidden="true"></span></summary><div class="comparison-body"><p>Put two lists side by side. What survives under a new name? What disappears when the audience changes?</p><div class="compare-pair">'''+''.join(f'<div><label for="pick-{side}">{label}</label><select id="pick-{side}">{options}</select><div class="compare-column" id="compare-{side}"></div></div>' for side,label in [('a','First publication'),('b','Second publication')])+'''</div></div></details>'''
    tools='<div class="archive-tools js-only"><label for="term">Search the publications<input type="search" id="term" placeholder="Title, author or trend"></label><label for="decade">Decade<select id="decade"><option value="">All decades</option>'+''.join(f'<option value="{d}">{d}s</option>' for d in ERAS)+'</select></label><button class="reset" type="button" id="clear">Reset</button></div><p class="results-status js-only" id="results" role="status"></p>'
    groups=''
    for decade, rows in groupby(STUDIES,key=lambda s:int(s['year'])//10*10):
        title,desc=ERAS[decade]
        groups+=f'<section class="era" data-era="{decade}" id="era-{decade}"><div class="era-intro"><span class="era-year">{decade}s</span><h2>{e(title)}</h2>{para(desc)}</div><div class="era-books">'+''.join(study(s) for s in rows)+'</div></section>'
    intro='Read the ten shifts in the 1982 book, then follow four decades of authors asking what will shape the future. Each entry gives the publication’s perspective and explains the changes it identified.'
    layout('history','Books & reports',intro,'work','1982–2026 · Publication history',
        '<div class="chapter-intro"><h2>The lists, in their own time</h2><p>Publication years organise this archive. A title such as <i>Megatrends 2000</i> names a horizon. It appeared in 1990. The entries paraphrase each work and identify its scope. Forecasts, survey rankings, demographic projections and methods reviews each answer a different question.</p></div>'+compare+tools+'<div id="no-matches" hidden><p>No matching publications. Try a broader search or another decade.</p></div>'+groups,'What changed across the decades?','/synthesis/')

def synthesis():
    threads=''
    for i,(theme,old,opening,middle,question) in enumerate(THREADS):
        threads+=f'<details class="thread" id="thread-{theme.lower()}" {"open" if i==0 else ""}><summary><span>{e(theme)}</span><b>{e(old)}</b><span class="disclose" aria-hidden="true"></span></summary><div class="thread-body"><div class="thread-cols">{field("Earlier emphasis",opening)}{field("How it developed",middle)}{field("The question now",question)}</div><div class="references"><span>Trace the editions</span>{study_links(TRAILS[theme][3])}</div></div></details>'
    methods='<section class="method-block" id="method"><h2>How do authors identify a megatrend?</h2><p>Naisbitt looked for patterns in local reporting. Oxfam compared existing scans. CSIRO assembled evidence about narrower changes and grouped them into larger shifts. Sitra asked what global changes mean for one society. Each starting point changes what becomes visible.</p><div class="method-cols">'+field("Discover","Scan newspapers and emerging signals, review studies and other outlooks, interview people, or analyse publication and patent records. Text mining, topic models and AI can help sort material. The selection of languages and sources affects what enters the pool.")+field("Test","Check duration, geographical reach, changes in indicators and plausible mechanisms. Historical comparison, projections, surveys, expert interviews, Delphi rounds and participatory workshops can expose weak evidence or regional exceptions.")+field("Connect and challenge","Cluster related trends, map causal links and interactions, and test them against counterexamples and scenarios. Record the evidence and disagreements. A vote can indicate shared expectations while leaving a causal claim untested.")+'</div><div class="references"><span>Method and examples</span>'+study_links(['naughtin-2024','oxfam-2020','csiro-2022','sitra-2026'])+'</div></section>'
    body='<div class="chapter-intro"><h2>From optimistic modernisation to contested transformation</h2><p>In 1982, the move from hierarchies to networks could stand as a promise of personal agency. By 2026, the ownership of those networks had become a question of political power. Both propositions can hold at once. People acquire new freedoms while the institutions that connect them gain new powers.</p></div><div class="editor-note"><h3>What a change of list can tell us</h3><p>Three things can move independently: the world, the author’s vantage point and the language available to describe change. The 1990 book already paired global lifestyles with cultural nationalism. A US security outlook anticipated demographic divergence in 2008. Climate’s absence from the 1982 headlines says something about that book’s priorities. These selected publications establish a lineage. A claim of historical first discovery would require a much wider, multilingual search.</p></div><h2 class="section-title">Follow an idea through the decades</h2>'+threads+methods
    layout('synthesis','What changed?','Eight lines of thought connect the books and reports. Follow an idea to see the older proposition, the intervening change and the question it raises today.','cities','Eight historical comparisons',body,'The six megatrends to watch','/priorities/')

def priorities():
    definitions='<div class="classification">'+field("New phenomenon","A capability or practice becomes possible at materially different scale or cost. Establish the capability and specify what people can now do.")+field("New configuration","Familiar forces interact in a consequential new arrangement. The change may reverse the implications an earlier author expected.")+field("New framing","An established force moves into a new phase or is understood through a different question. The underlying process may be decades old.")+'</div>'
    listing='<div class="priority-index">'+''.join(f'<a href="#{x["id"]}"><span>{e(x["category"])}</span><strong>{e(x["name"])}</strong></a>' for x in PRIORITIES)+'</div>'
    cards=''
    for x in PRIORITIES:
        cards+=f'''<article class="priority" id="{x['id']}"><div class="priority-heading"><span class="r-label">{e(x['category'])}</span><h2>{e(x['name'])}</h2><p>{e(x['subtitle'])}</p></div><div class="priority-body">{field('Historical roots',x['old'])}{field('What has changed',x['now'])}{field('Why it matters',x['stakes'])}<div class="signal">{field('What to watch',x['watch'])}</div>{sources(x['sources'])}</div></article>'''
    others=''.join('<article class="candidate compact" id="'+i+'"><span class="r-label">'+e(cat)+'</span><h3>'+e(name)+'</h3>'+para(desc)+para(watch)+sources(refs)+'</article>' for i,name,cat,desc,watch,refs in OTHERS)
    intro='Six changes warrant closer attention because an older label hides something consequential. A machine can act, a recording can be manufactured, and a network that connects people can also limit their choices.'
    layout('priorities','Six to watch',intro,'intelligence','Three ways a trend can be new',
           '<div class="chapter-intro"><h2>What counts as new?</h2><p>These are editorial judgements drawn across the publications. Each trend has a primary classification. Machine agency also brings some genuinely novel capabilities, and climate adaptation is an established field entering a new phase.</p></div>'+definitions+listing+cards+'<h2 class="section-title">Two further emerging themes</h2><div class="candidate-grid">'+others+'</div>','Four candidates for the next generation','/next/')

def next_gen():
    items=''
    for i,name,roots,imp,watch,refs in NEXT:
        items+=f'<article class="candidate" id="{i}"><h2>{e(name)}</h2>{field("Where the idea comes from",roots)}{field("What might follow",imp)}<div class="signal">{field("What would strengthen or weaken the case",watch)}</div>{sources(refs)}</article>'
    intro='Which developments might earn a headline of their own in a future edition? Four candidates connect today’s evidence to a change that could spread across places and sectors.'
    body='<div class="chapter-intro"><h2>Four hypotheses to keep open</h2><p>Each candidate starts with an older trend. The test is whether a different mechanism gains enough reach and persistence to change decisions in several fields. The signals below could also weaken the case.</p></div><div class="candidate-grid">'+items+'</div>'
    layout('next','The next generation',intro,'energy','Four candidates to investigate',body,'Test the assumptions behind the trends','/scenarios/')

def scenarios():
    alts={s['id']:s['alternative'] for s in STRESS['assumptions']}
    cards=''
    for i,s in enumerate(STRESS['scenarios']):
        linked=' · '.join(link('#'+k,alts[k]) for k in s['links'])
        cards+=f'''<article class="scenario" id="{s['id']}"><div class="scenario-art">{plate(['energy','work','population'][i])}</div><div class="scenario-copy"><span class="r-label">Illustrative 2040 scenario</span><h3>{e(s['title'])}</h3><p class="vignette">{e(s['vignette'])}</p>{field('How this could happen',s['mechanism'])}{field('Who gains and who could lose',s['distribution'])}{field('Early signs',s['watch'])}<div class="references"><span>Assumptions in play</span>{linked}</div></div></article>'''
    rows=''
    for a in STRESS['assumptions']:
        rows+=f'''<details class="assumption" id="{a['id']}"><summary><span><small>Assumption</small><b>{e(a['assumption'])}</b></span><span class="alternative">{e(a['alternative'])}</span><span class="disclose" aria-hidden="true"></span></summary><div class="thread-body"><div class="thread-cols">{field('How it could unravel',a['mechanism'])}{field('What follows',a['implication'])}{field('What to watch',a['watch'])}</div>{sources(ASSUMPTION_SOURCES[a['id']])}</div></details>'''
    c=STRESS['climate']
    climate='<aside class="editor-note climate-note"><h3>'+e(c['title'])+'</h3>'+para(c['mechanism'])+para(c['implication'])+para(c['watch'])+sources([('IPCC · Impacts, Adaptation and Vulnerability',c['url'])])+'</aside>'
    intro='A trend can continue while its expected consequence changes direction. Open an assumption to see what could undo it, or explore what happens when several assumptions change together.'
    quick='<div class="jump-links">'+link('#assumptions','Twelve assumptions')+link('#three-futures','Three compound scenarios')+'</div>'
    scenario_index='<nav aria-label="Jump to a scenario" class="jump-links">'+''.join(link('#'+s['id'],s['title']) for s in STRESS['scenarios'])+'</nav>'
    body=quick+'<section id="assumptions"><div class="chapter-intro"><h2>Twelve assumptions that could unravel</h2><p>For each one, distinguish the measurable change from the consequence people have come to expect. An older population is observable. A heavier burden on younger people depends on health, work, care and public policy.</p></div>'+rows+'</section>'+climate+'<section id="three-futures"><div class="chapter-intro"><h2>Three compound scenarios</h2><p>These imagined scenes combine several reversals. They have no assigned probabilities. Read each one as a test of the decisions an institution might make today.</p></div>'+scenario_index+cards+'</section><div class="method-block"><h2>Try the hindsight question</h2><p>Imagine a team in 2040 reading your strategy today. Which assumption did you get wrong? What early evidence did you overlook? Choose an indicator that would help you recognise the change in time.</p></div>'
    layout('scenarios','What if the assumptions unravel?',intro,'population','Twelve reversals · Three possible futures',body,'Return to the illustrated explorer','/#index')

def write_textile_data():
    books = get_books(STUDIES)
    threads = get_threads()
    futures = get_futures()
    themes = {thread["id"] for thread in threads}
    if len(themes) != len(threads):
        raise ValueError("Duplicate thread ID")
    for book in books:
        for entry in book["entries"]:
            if not set(entry["themes"]) <= themes | {"other"}:
                raise ValueError(f"Unknown theme on {book['id']}: {entry['text']}")
    for item in futures["watch"]:
        if item["theme"] not in themes:
            raise ValueError(f"Unknown theme on priority {item['id']}")

    assumptions = {item["id"]: set(item["scenarioIds"]) for item in futures["assumptions"]}
    scenarios = {item["id"]: set(item["assumptionIds"]) for item in futures["scenarios"]}
    for scenario, premise_ids in scenarios.items():
        for premise_id in premise_ids:
            if scenario not in assumptions.get(premise_id, set()):
                raise ValueError(f"Scenario {scenario!r} has an unresolved assumption {premise_id!r}")
    for premise_id, scenario_ids in assumptions.items():
        for scenario in scenario_ids:
            if premise_id not in scenarios.get(scenario, set()):
                raise ValueError(f"Assumption {premise_id!r} has an unresolved scenario {scenario!r}")

    files = {
        "books": {"OBS_BOOKS": books},
        "futures": {"OBS_FUTURES": futures},
        "threads": {"OBS_THREADS": threads, "OBS_ERAS": ERAS},
    }
    for filename, variables in files.items():
        script = "".join(
            f"window.{name} = {json.dumps(value, ensure_ascii=False, indent=2)};\n"
            for name, value in variables.items()
        )
        (DIST / f"{filename}.js").write_text(script, encoding="utf-8")


if __name__ == '__main__':
    write_textile_data()
    history()
    synthesis()
    priorities()
    next_gen()
    scenarios()
