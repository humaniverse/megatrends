"""Render the research chapters as accessible, linkable static HTML."""
from html import escape
from pathlib import Path
from itertools import groupby
import json
import re

from interpretation import PRIORITIES, OTHERS, THREADS, NEXT, ASSUMPTION_SOURCES
from books import get_books
from explorer import ALIASES, get_explorer
from futures import get_futures
from methods import CASE_STUDIES, METHOD_GROUPS, REVIEW, WORKFLOW
from threads import TRAILS, get_threads

ROOT = Path(__file__).resolve().parent
DIST = ROOT.parent / 'dist'
STUDIES = json.loads((ROOT / 'studies.json').read_text())
STRESS = json.loads((ROOT / 'scenarios.json').read_text())
SITE = 'https://megatrend-observatory.matthewgthomas.chatgpt.site'
SECTIONS = {
    'explore': ('Explore', '/#loom', [
        ('loom', 'By theme', '/#loom'), ('synthesis', 'What changed', '/synthesis/'),
        ('explorer', 'By year', '/explorer/')]),
    'books': ('Books & reports', '/history/', [
        ('history', 'Publication archive', '/history/'), ('methods', 'Methods', '/methods/')]),
    'change': ('What’s changing', '/priorities/', [
        ('priorities', 'Six to watch', '/priorities/'), ('next', 'Next generation', '/next/')]),
    'futures': ('Possible futures', '/#futures', [
        ('futures', 'Test an assumption', '/#futures'), ('scenarios', 'Read scenarios', '/scenarios/')]),
}
UTILITIES = [('guide', 'Help', '/#guide'), ('saved', 'Saved', '/#saved')]
PAGE_SECTION = {'synthesis': 'explore', 'explorer': 'explore', 'history': 'books', 'methods': 'books',
                'priorities': 'change', 'next': 'change', 'scenarios': 'futures'}
THREAD_RECORDS = {t['id']: t for t in get_threads()}
FUTURES = get_futures()
BOOKS = get_books(STUDIES)
BOOK_INDEX = {book['id']: book for book in BOOKS}
POPULATION_BOOK = BOOK_INDEX['un-wpp-2024']
POPULATION_FINDING = THREAD_RECORDS['population']['evidence'][POPULATION_BOOK['id']]
POPULATION_FINDING_NUMBER = next(i for i, entry in enumerate(POPULATION_BOOK['entries'], 1)
                                 if entry['text'] == POPULATION_FINDING)
POPULATION_LINKS = [
    ('/#thread/population', 'Follow the Population & ageing thread'),
    (f'/history/#un-wpp-2024--trend-{POPULATION_FINDING_NUMBER}', 'Read the 2024 population finding'),
    ('/priorities/#demographic-bifurcation', 'Read about demographic bifurcation'),
    ('/scenarios/#demographic-inversion', 'Explore the 2040 demographic scenario'),
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

def local_href(url, prefix='../'):
    if url.startswith('/') and not url.startswith('//'):
        path, separator, fragment = url.partition('#')
        if path == '/' and not prefix and fragment:
            return separator + fragment
        return prefix + path.lstrip('/') + ('index.html' if path.endswith('/') else '') + separator + fragment
    return url

def link(url, label):
    return f'<a href="{e(local_href(url))}">{e(label)}</a>'

def sources(items):
    return '<div class="references"><span>Sources</span>'+' '.join(link(url,label) for label,url in items)+'</div>'

def study_links(ids):
    records = {s['id']:s for s in STUDIES}
    return ' · '.join(link('/history/#'+i,f"{records[i]['author']} ({records[i]['year']})") for i in ids)

def related(items, label='Keep exploring'):
    if not items:
        return ''
    return '<nav class="related-reading" aria-label="'+e(label)+'"><strong>'+e(label)+'</strong><ul>'+''.join(
        '<li>'+link(url, title)+'</li>' for url, title in items)+'</ul></nav>'

def plate(path, *, size=None):
    dimensions = f' width="{size[0]}" height="{size[1]}"' if size else ''
    return f'<img src="../assets/{path}.webp" alt=""{dimensions} loading="lazy">'

def nav_link(key, label, url, prefix, current=None, attribute='data-nav', status='page'):
    active = f' aria-current="{status}"' if key == current else ''
    return f'<a {attribute}="{key}" href="{e(local_href(url, prefix))}"{active}>{e(label)}</a>'

def brand(prefix):
    return f'<a class="site-brand" href="{prefix}index.html"><img src="{prefix}assets/mark.svg" alt="" width="34" height="34">Megatrend Observatory</a>'

def shell(page=None, prefix='../'):
    section = PAGE_SECTION.get(page)
    main = ''.join(nav_link(key, label, url, prefix, section, status='location')
                   for key, (label, url, _) in SECTIONS.items())
    utilities = ''.join(nav_link(*item, prefix) for item in UTILITIES)
    header = f'''<header class="site-mast"><div class="site-width site-mast-inner">{brand(prefix)}
<button class="site-menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu">Menu</button>
<nav id="site-menu" class="site-menu" aria-label="Main navigation"><div class="site-main-links">{main}</div><div class="site-utility">{utilities}</div></nav></div></header>'''
    subnav = ''
    for key, (label, _, items) in SECTIONS.items():
        if items and (page is None or key == section):
            links = ''.join(nav_link(*item, prefix, page, 'data-subnav') for item in items)
            hidden = ' hidden' if page is None else ''
            subnav += f'\n<nav class="site-subnav" data-section="{key}" aria-label="{e(label)}"{hidden}><div class="site-width">{links}</div></nav>'
    footer = f'<footer class="site-foot"><div class="site-width site-foot-inner">{brand(prefix)}<div class="site-utility">{utilities}</div></div></footer>'
    return header + subnav, footer

def breadcrumbs(slug, heading):
    section, url, _ = SECTIONS[PAGE_SECTION[slug]]
    path = link('/', 'Home')
    if slug != 'history':
        path += '<span aria-hidden="true">/</span>' + link(url, section)
    return f'<nav class="site-crumbs" aria-label="Breadcrumb" id="page-crumbs">{path}<span aria-hidden="true">/</span><span aria-current="page">{e(heading)}</span></nav>'

def update_shell(path, page=None, prefix='../'):
    header, footer = shell(page, prefix)
    html = path.read_text(encoding='utf-8')
    for name, markup in [('header', header), ('footer', footer)]:
        marker = f'<!-- site-{name} -->'
        end = f'<!-- /site-{name} -->'
        html, count = re.subn(f'{marker}.*?{end}', lambda _: f'{marker}\n{markup}\n{end}', html, flags=re.S)
        if count != 1:
            raise ValueError(f'Expected one {name} marker in {path}')
    path.write_text(html, encoding='utf-8')

def para(s):
    return '<p>'+e(s)+'</p>'

def field(title, copy):
    return f'<div class="field"><h4>{e(title)}</h4>{para(copy)}</div>'

def hero(slug, title, intro, caption, image):
    return f'<section class="reading-hero"><div class="container reading-hero-inner"><div>{breadcrumbs(slug, title)}<h1>{e(title)}</h1><p>{e(intro)}</p></div><figure><img src="../assets/{image}.webp" alt=""><figcaption>{e(caption)}</figcaption></figure></div></section>'

def layout(slug, heading, intro, caption, body, next_label, next_url, *, hero_image='jacquard'):
    header, footer = shell(slug)
    skip_label = 'Skip to catalogue' if slug == 'history' else 'Skip to chapter'
    scripts = ('books', 'threads', 'weaves', 'catalogue') if slug == 'history' else ('research',)
    scripts = ''.join(f'<script src="../{name}.js" defer></script>' for name in scripts)
    text = f'''<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#261b32"><title>{e(heading)} · Megatrend Observatory</title><meta name="description" content="{e(intro)}">
<link rel="canonical" href="{SITE}/{slug}/"><link rel="icon" href="../assets/mark.svg"><link rel="stylesheet" href="../style.css"><link rel="stylesheet" href="../research.css"><link rel="stylesheet" href="../archive.css"><link rel="stylesheet" href="../navigation.css"><script src="../navigation.js" defer></script>{scripts}
</head><body class="research-page archive archive-{slug}"><a class="skip" href="#reading">{skip_label}</a>
{header}
<main>{hero(slug,heading,intro,caption,hero_image)}<div id="reading" class="container reading" tabindex="-1">{body}
<div class="continue"><span>Continue exploring</span>{link(next_url,next_label)}</div></div></main>
{footer}</body></html>'''
    folder=DIST/slug
    folder.mkdir(exist_ok=True)
    (folder/'index.html').write_text(text)

def study(record):
    s=record
    sid = s['id']
    yarns = ','.join(dict.fromkeys(theme for entry in BOOK_INDEX[sid]['entries'] for theme in entry['themes']))
    date = f'<span class="edition-date"><span class="year-stamp">{s["year"]}</span><img class="catalogue-swatch" data-weave="{sid}" data-yarns="{yarns}" alt="" width="354" height="156"></span>'
    entries=''.join(f'<li id="{sid}--trend-{i}" tabindex="-1"><strong>{e(t["name"])}</strong>{para(t["detail"])}</li>' for i,t in enumerate(s['trends'], 1))
    editions = [(f'/#thread/{t["id"]}', t['label']) for t in THREAD_RECORDS.values() if sid in t['books']]
    if sid == 'un-wpp-2024':
        editions = [(url, label) for url, label in POPULATION_LINKS if not url.startswith('/history/')]
    actions = '<div class="catalogue-actions js-only"><a data-compare-edition>Compare this edition</a><a data-return-comparison hidden>Back to this comparison</a></div>'
    return f'''<details class="study" id="{e(sid)}" {'open' if sid=='naisbitt-1982' else ''}><summary>{date}<span><small>{e(s['author'])}</small><b>{e(s['title'])}</b></span><span class="disclose" aria-hidden="true"></span></summary><div class="study-body"><p class="lens">{e(s['lens'])}</p>{para(s['summary'])}{actions}{'<ul class="entries">'+entries+'</ul>' if entries else '<p>This review describes how researchers identify megatrends.</p>'}{sources([(s['title'],s['url'])])}{related(editions,'Related reading')}</div></details>'''

def history():
    options=''.join(f'<option value="{s["id"]}">{s["year"]} · {e(s["author"])} · {e(s["title"])}</option>' for s in STUDIES)
    theme_options=''.join(f'<option value="{t["id"]}">{e(t["label"])}</option>' for t in THREAD_RECORDS.values())
    modes = '<nav id="catalogue-views" class="catalogue-modes js-only" aria-label="Catalogue views"><a id="browse-mode" href="index.html" aria-current="page">By decade</a><a id="compare-mode" href="index.html?view=compare#catalogue-views">Compare</a></nav>'
    compare=f'''<section class="catalogue-compare js-only" id="compare" tabindex="-1" hidden><h2>Compare two publications</h2><p>Choose a theme to see how the two editions treated it.</p><label class="compare-theme" for="pick-theme">Trace a theme<select id="pick-theme"><option value="">All themes</option>{theme_options}<option value="other">Other themes</option></select></label><div class="compare-pair">'''+''.join(f'<section class="compare-edition" id="edition-{side}" tabindex="-1"><label for="pick-{side}">{label}</label><select id="pick-{side}">{options}</select><a class="other-edition" href="#edition-{"b" if side=="a" else "a"}">Jump to {"second" if side=="a" else "first"} publication</a><div class="compare-column" id="compare-{side}" aria-live="polite"></div></section>' for side,label in [('a','First publication'),('b','Second publication')])+'''</div></section>'''
    tools='<div class="archive-tools js-only"><label for="term">Search the publications<input type="search" id="term" placeholder="Title, author or trend"></label><label for="decade">Decade<select id="decade"><option value="">All decades</option>'+''.join(f'<option value="{d}">{d}s</option>' for d in ERAS)+'</select></label><button class="reset" type="button" id="clear">Reset</button></div><p class="results-status js-only" id="results" role="status"></p>'
    groups=''
    for decade, rows in groupby(STUDIES,key=lambda s:int(s['year'])//10*10):
        title,desc=ERAS[decade]
        groups+=f'<section class="era" data-era="{decade}" id="era-{decade}"><div class="era-intro"><span class="era-year">{decade}s</span><h2>{e(title)}</h2>{para(desc)}</div><div class="era-books">'+''.join(study(s) for s in rows)+'</div></section>'
    intro='Browse 24 publications from Naisbitt’s 1982 book to recent outlooks. Open an edition to read its findings or compare two editions by theme.'
    browse='<section id="by-decade" aria-label="Browse publications by decade"><div class="chapter-intro"><h2>The lists, in their own time</h2><p>Publication years organise this archive. A title such as <i>Megatrends 2000</i> names a horizon. It appeared in 1990. The entries paraphrase each work and identify its scope. Forecasts, survey rankings, demographic projections and methods reviews each answer a different question.</p></div>'+tools+'<div id="no-matches" hidden><p>No matching publications. Try a broader search or another decade.</p></div>'+groups+'</section>'
    layout('history','Books & reports',intro,'1982–2026 · Publication history',modes+browse+compare,
           'What changed across the decades?','/synthesis/')

def methods():
    statistics = (
        ('Identify and synthesise narrower trends', '31', '41.9%'),
        ('Consult experts or stakeholders', '22', '29.7%'),
        ('Use surveys', '11', '14.9%'),
        ('Use a formal Delphi method', '12', '16.2%'),
    )
    rows = ''.join(f'<tr><th scope="row">{e(label)}</th><td>{count}</td><td>{share}</td></tr>'
                   for label, count, share in statistics)
    evidence = f'''<section class="method-block" id="review">
<h2>What researchers reported doing</h2>
<p>Naughtin and colleagues reviewed 267 publications from 1982 to 2022. Of the 254 studies that identified or applied megatrends, 180 (71%) did not explicitly describe their method. Desk research was the most common approach among those that did.</p>
<table class="methods-statistics">
<caption>Selected methods among the 74 studies that described their approach</caption>
<thead><tr><th scope="col">Approach</th><th scope="col">Studies</th><th scope="col">Share</th></tr></thead>
<tbody>{rows}</tbody></table>
<p>Studies could use more than one method.</p>
{sources([REVIEW])}</section>'''

    groups = []
    for key, title, entries in METHOD_GROUPS:
        descriptions = ''.join(
            f'<article class="method-entry"><h4>{e(name)}</h4>{para(copy)}{sources(refs)}</article>'
            for name, copy, refs in entries
        )
        groups.append(f'<section id="{key}" class="methods-group"><h3>{e(title)}</h3>{descriptions}</section>')

    examples = ''.join(
        f'<article class="candidate"><p class="method-byline">{e(author)}</p><h3>{e(title)}</h3>'
        f'{para(copy)}{sources([reference])}<p class="chapter-action">'
        f'{link("/history/#" + key, author + " in the archive")}</p></article>'
        for key, author, title, copy, reference in CASE_STUDIES
    )
    jumps = ''.join(link(url, label) for url, label in (
        ('#review', 'What studies reported'), ('#methods', '17 methods'),
        ('#examples', 'Six examples'), ('#workflow', 'A practical workflow'),
    ))
    group_jumps = ''.join(link('#' + key, title) for key, title, _ in METHOD_GROUPS)
    workflow = ''.join(f'<div class="field"><h3>{e(title)}</h3>{para(copy)}</div>'
                       for title, copy in WORKFLOW)
    body = f'''<nav class="jump-links" aria-label="On this page">{jumps}</nav>
<div class="chapter-intro"><p>Identifying a megatrend involves three kinds of work. <strong>Discovery</strong> surfaces candidate changes. <strong>Qualification</strong> tests whether they are durable, directional and far-reaching. <strong>Synthesis</strong> connects narrower trends and explains how wider changes interact. Studies often combine methods, and a single method can serve several purposes.</p></div>
{evidence}
<section id="methods" class="methods-section"><div class="chapter-intro"><h2>17 ways to identify megatrends</h2></div>
<nav class="jump-links" aria-label="Method families">{group_jumps}</nav>
{''.join(groups)}</section>
<section id="examples" class="methods-section"><div class="chapter-intro"><h2>Six approaches in practice</h2></div>
<div class="candidate-grid">{examples}</div></section>
<section id="workflow" class="method-block"><h2>A practical workflow</h2>
<div class="method-cols">{workflow}</div>
<p>Use computational tools to surface overlooked patterns, then test the proposed mechanisms with historical evidence, independent sources and counterexamples. Keep emerging candidates alongside established megatrends so changes with thinner evidence stay visible while they are tested.</p>
{related([('/next/', 'Explore four candidates for the next generation'), ('/scenarios/', 'Test the assumptions behind today’s megatrends')])}</section>'''
    intro = 'How do researchers spot a change that could reshape society over decades? Explore approaches from newspaper clippings to AI-assisted analysis, and see how six studies put them together.'
    layout('methods', 'How megatrends are identified', intro, 'Methods behind the megatrend lists',
           body, 'Browse the books and reports', '/history/', hero_image='ledger')

def synthesis():
    threads=''
    for i,(theme,old,opening,middle,question) in enumerate(THREADS):
        tid, label, _, evidence = TRAILS[theme]
        follow = link('/#thread/'+tid, 'Explore '+label+' interactively')
        threads+=f'<details class="thread" id="thread-{theme.lower()}" {"open" if i==0 else ""}><summary><span>{e(theme)}</span><b>{e(old)}</b><span class="disclose" aria-hidden="true"></span></summary><div class="thread-body"><div class="thread-cols">{field("Earlier emphasis",opening)}{field("How it developed",middle)}{field("The question now",question)}</div><div class="references"><span>Trace the editions</span>{study_links(evidence)}</div><p class="chapter-action">{follow}</p></div></details>'
    methods='<section class="method-block" id="method"><h2>How do authors identify a megatrend?</h2><p>Naisbitt looked for patterns in local reporting. Oxfam compared existing scans. CSIRO assembled evidence about narrower changes and grouped them into larger shifts. Sitra asked what global changes mean for one society. Each starting point changes what becomes visible.</p><div class="method-cols">'+field("Discover","Scan newspapers and emerging signals, review studies and other outlooks, interview people, or analyse publication and patent records. Text mining, topic models and AI can help sort material. The selection of languages and sources affects what enters the pool.")+field("Test","Check duration, geographical reach, changes in indicators and plausible mechanisms. Historical comparison, projections, surveys, expert interviews, Delphi rounds and participatory workshops can expose weak evidence or regional exceptions.")+field("Connect and challenge","Cluster related trends, map causal links and interactions, and test them against counterexamples and scenarios. Record the evidence and disagreements. A vote can indicate shared expectations while leaving a causal claim untested.")+'</div><div class="references"><span>Method and examples</span>'+study_links(['naughtin-2024','oxfam-2020','csiro-2022','sitra-2026'])+'</div></section>'
    methods = methods.removesuffix('</section>') + '<p class="chapter-action">' + link(
        '/methods/', 'Explore the 17 methods and six case studies') + '</p></section>'
    body='<div class="chapter-intro"><h2>From optimistic modernisation to contested transformation</h2><p>In 1982, the move from hierarchies to networks could stand as a promise of personal agency. By 2026, the ownership of those networks had become a question of political power. Both propositions can hold at once. People acquire new freedoms while the institutions that connect them gain new powers.</p></div><div class="editor-note"><h3>What a change of list can tell us</h3><p>Three things can move independently: the world, the author’s vantage point and the language available to describe change. The 1990 book already paired global lifestyles with cultural nationalism. A US security outlook anticipated demographic divergence in 2008. Climate’s absence from the 1982 headlines says something about that book’s priorities. These selected publications establish a lineage. A claim of historical first discovery would require a much wider, multilingual search.</p></div><h2 class="section-title">Follow an idea through the decades</h2>'+threads+methods
    layout('synthesis','What changed?','Eight lines of thought connect the books and reports. Follow an idea to see the older proposition, the intervening change and the question it raises today.','Eight historical comparisons',body,'The six megatrends to watch','/priorities/')

def priorities():
    definitions='<div class="classification">'+field("New phenomenon","A capability or practice becomes possible at materially different scale or cost. Establish the capability and specify what people can now do.")+field("New configuration","Familiar forces interact in a consequential new arrangement. The change may reverse the implications an earlier author expected.")+field("New framing","An established force moves into a new phase or is understood through a different question. The underlying process may be decades old.")+'</div>'
    listing='<div class="priority-index">'+''.join(f'<a href="#{x["id"]}"><span>{e(x["category"])}</span><strong>{e(x["name"])}</strong></a>' for x in PRIORITIES)+'</div>'
    cards=''
    for x, watch in zip(PRIORITIES, FUTURES['watch'], strict=True):
        thread = THREAD_RECORDS[watch['theme']]
        paths = [('/#thread/'+thread['id'], 'Follow the '+thread['label']+' thread'),
                 ('/explorer/#trend/'+thread['id'], 'See the '+thread['label']+' timeline')]
        if thread['id'] == 'population':
            paths += [POPULATION_LINKS[1], POPULATION_LINKS[3]]
        paths += [('/#watch/'+watch['id'], 'Compare the earlier and current patterns')]
        cards+=f'''<article class="priority" id="{x['id']}"><div class="priority-heading"><span class="r-label">{e(x['category'])}</span><h2>{e(x['name'])}</h2><p>{e(x['subtitle'])}</p></div><div class="priority-body">{field('Historical roots',x['old'])}{field('What has changed',x['now'])}{field('Why it matters',x['stakes'])}<div class="signal">{field('What to watch',x['watch'])}</div>{sources(x['sources'])}{related(paths)}</div></article>'''
    others=''.join('<article class="candidate compact" id="'+i+'"><span class="r-label">'+e(cat)+'</span><h3>'+e(name)+'</h3>'+para(desc)+para(watch)+sources(refs)+'</article>' for i,name,cat,desc,watch,refs in OTHERS)
    intro='Six changes warrant closer attention because an older label hides something consequential. A machine can act, a recording can be manufactured, and a network that connects people can also limit their choices.'
    layout('priorities','Six to watch',intro,'Three ways a trend can be new',
           '<div class="chapter-intro"><h2>What counts as new?</h2><p>These are editorial judgements drawn across the publications. Each trend has a primary classification. Machine agency also brings some genuinely novel capabilities, and climate adaptation is an established field entering a new phase.</p></div>'+definitions+listing+cards+'<h2 class="section-title">Two further emerging themes</h2><div class="candidate-grid">'+others+'</div>','Four candidates for the next generation','/next/')

def next_gen():
    items=''
    paths = {
        'discovery': [('/priorities/#machine-agency','AI becoming autonomous infrastructure')],
        'physical': [('/#thread/climate','Follow the Climate & place thread'), ('/scenarios/#abundance','Test the resource scarcity assumption'),
                     ('/explorer/index.html?year=2040#trend/climate', 'Explore competition for grid capacity in 2040')],
        'orbit': [('/priorities/#network-power','Read about network power'),
                  ('/explorer/index.html?year=2050#trend/networks','Explore a clinic’s reliance on a satellite operator in 2050')],
        'contract': [('/#thread/health','Follow the Health & care thread'), ('/scenarios/#longevity','Test the longevity assumption'),
                     ('/explorer/index.html?year=2050#trend/health','Explore how work and care could change in 2050')],
    }
    for (i,name,roots,imp,watch,refs), candidate in zip(NEXT, FUTURES['candidates'], strict=True):
        items+=f'<article class="candidate" id="{i}"><h2>{e(name)}</h2>{field("Where the idea comes from",roots)}{field("What might follow",imp)}<div class="signal">{field("What would strengthen or weaken the case",watch)}</div>{para(candidate["question"])}{sources(refs)}{related(paths[i])}</article>'
    intro='Which developments might earn a headline of their own in a future edition? Four candidates connect today’s evidence to a change that could spread across places and sectors.'
    body='<div class="chapter-intro"><h2>Four hypotheses to keep open</h2><p>Each candidate starts with an older trend. The test is whether a different mechanism gains enough reach and persistence to change decisions in several fields. The signals below could also weaken the case.</p></div><div class="candidate-grid">'+items+'</div>'
    layout('next','The next generation',intro,'Four candidates to investigate',body,'Test the assumptions behind the trends','/#futures')

def scenarios():
    alts={s['id']:s['alternative'] for s in STRESS['assumptions']}
    cards=''
    for s in STRESS['scenarios']:
        linked=' · '.join(link('#'+k,alts[k]) for k in s['links'])
        paths = POPULATION_LINKS[:3] + [('/explorer/index.html?year=2040#trend/population', 'Follow demographic divergence through time')] if s['id'] == 'demographic-inversion' else []
        art = plate(f"scenario-{s['id']}", size=(800, 1000))
        cards+=f'''<article class="scenario" id="{s['id']}"><div class="scenario-art">{art}</div><div class="scenario-copy"><span class="r-label">Illustrative 2040 scenario</span><h3>{e(s['title'])}</h3><p class="vignette">{e(s['vignette'])}</p>{field('How this could happen',s['mechanism'])}{field('Who gains and who could lose',s['distribution'])}{field('Early signs',s['watch'])}<div class="references"><span>Assumptions in play</span>{linked}</div>{related(paths)}</div></article>'''
    rows=''
    for a, interactive in zip(STRESS['assumptions'], FUTURES['assumptions'], strict=True):
        paths = [('/#futures/'+interactive['id']+'/loose','Explore this assumption interactively')]
        paths += [('#'+s['id'], 'Scenario: '+s['title']) for s in STRESS['scenarios'] if a['id'] in s['links']]
        rows+=f'''<details class="assumption" id="{a['id']}"><summary><span><small>Assumption</small><b>{e(a['assumption'])}</b></span><span class="alternative">{e(a['alternative'])}</span><span class="disclose" aria-hidden="true"></span></summary><div class="thread-body"><div class="thread-cols">{field('How it could unravel',a['mechanism'])}{field('What follows',a['implication'])}{field('What to watch',a['watch'])}</div>{sources(ASSUMPTION_SOURCES[a['id']])}{related(paths)}</div></details>'''
    c=STRESS['climate']
    climate='<aside class="editor-note climate-note"><h3>'+e(c['title'])+'</h3>'+para(c['mechanism'])+para(c['implication'])+para(c['watch'])+sources([('IPCC · Impacts, Adaptation and Vulnerability',c['url'])])+'</aside>'
    intro='A trend can continue while its expected consequence changes direction. Open an assumption to see what could undo it, or explore what happens when several assumptions change together.'
    quick='<div class="jump-links">'+link('#assumptions','Twelve assumptions')+link('#three-futures','Three compound scenarios')+'</div>'
    scenario_index='<nav aria-label="Jump to a scenario" class="jump-links">'+''.join(link('#'+s['id'],s['title']) for s in STRESS['scenarios'])+'</nav>'
    body=quick+'<section id="assumptions"><div class="chapter-intro"><h2>Twelve assumptions that could unravel</h2><p>For each one, distinguish the measurable change from the consequence people have come to expect. An older population is observable. A heavier burden on younger people depends on health, work, care and public policy.</p></div>'+rows+'</section>'+climate+'<section id="three-futures"><div class="chapter-intro"><h2>Three compound scenarios</h2><p>These imagined scenes combine several reversals. They have no assigned probabilities. Read each one as a test of the decisions an institution might make today.</p></div>'+scenario_index+cards+'</section><div class="method-block"><h2>Try the hindsight question</h2><p>Imagine a team in 2040 reading your strategy today. Which assumption did you get wrong? What early evidence did you overlook? Choose an indicator that would help you recognise the change in time.</p></div>'
    layout('scenarios','Assumptions & scenarios',intro,'Twelve reversals · Three possible futures',body,'See the illustrated trends by year','/explorer/',hero_image='scenarios-hero')

def write_textile_data():
    books = BOOKS
    threads = list(THREAD_RECORDS.values())
    futures = FUTURES
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
        "threads": {"OBS_THREADS": threads, "OBS_ERAS": ERAS, "OBS_EXPLORER_ALIASES": ALIASES},
        "data": {"OBS_EXPLORER": get_explorer(books, threads, futures)},
    }
    for filename, variables in files.items():
        script = "".join(
            f"window.{name} = {json.dumps(value, ensure_ascii=False, indent=2)};\n"
            for name, value in variables.items()
        )
        (DIST / f"{filename}.js").write_text(script, encoding="utf-8")


if __name__ == '__main__':
    write_textile_data()
    update_shell(DIST / 'index.html', prefix='')
    update_shell(DIST / 'explorer' / 'index.html', page='explorer')
    history()
    methods()
    synthesis()
    priorities()
    next_gen()
    scenarios()
