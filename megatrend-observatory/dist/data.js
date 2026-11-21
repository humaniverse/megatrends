const HORIZONS = [1980, 1995, 2010, 2025, 2040, 2050];
const TRENDS = [
 {
  id:'intelligence', name:'Artificial intelligence', domain:'Technology', icon:'chip',
  intro:'People have spent decades teaching machines to recognise patterns and perform tasks that once needed human judgement. What counts as “intelligent” keeps moving.',
  stages:[
   ['Expertise becomes a rulebook','Expert systems capture the rules a specialist uses to solve a narrow problem.','At Digital Equipment Corporation, a system called XCON helps configure computers. Its knowledge has to be written down by people, one rule at a time.'],
   ['Learning from examples','Researchers train machines to recognise patterns in examples, including handwritten digits.','A bank cheque is a revealing test. People write the same digit in many different ways. A machine that can learn from samples needs fewer instructions about every possible shape.'],
   ['More data, more computation','Larger collections of labelled images give researchers a new way to train and compare systems.','Image recognition becomes a testing ground. Faster chips, shared datasets and common benchmarks make it easier to see which techniques work across many examples.'],
   ['AI enters everyday work','Systems that generate text, images and code are changing what people can create and delegate.','A designer can sketch several alternatives in minutes. A researcher can draft code from a description. Checking the result becomes part of the work, especially when a fluent answer hides an error.'],
   ['A second pair of hands','AI assistants could carry out routine sequences of work under human supervision.','Imagine a housing adviser who asks a system to assemble a case file. Whether this frees time for residents depends on the reliability of the system and who takes responsibility for checking it.'],
   ['Who controls machine expertise?','Communities might run their own AI systems, or rely on a handful of global providers.','In one future, local language models reflect community priorities. In another, the cost of computing concentrates influence. Access to energy, expertise and public investment could pull the same technology in different directions.']
  ],
  ask:'What would make checking an AI-generated answer take longer than doing the task yourself?',
  links:[['work','When software takes on a task, the skills people need for the rest of their job can change.'],['energy','Running large computing systems creates new demand for electricity.']],
  sources:[['Our World in Data · A brief history of AI','https://ourworldindata.org/brief-history-of-ai'],['Computer History Museum · Digital Equipment Corporation records','https://archive.computerhistory.org/resources/access/text/2019/11/102752934-05-01-acc.pdf']]
 },
 {
  id:'climate',name:'Climate change',domain:'Environment',icon:'leaf',
  intro:'Greenhouse gases trap heat in the atmosphere. As the planet warms, changing rainfall, rising seas and extreme heat reshape where and how people live.',
  stages:[
   ['A global research question','Scientists are bringing observations of a warming planet into international debate.','The first World Climate Conference met in 1979. A shared question was beginning to take shape across national borders. How could people detect and respond to changes in the climate?'],
   ['Governments come to the table','The first UN climate conference of the parties meets in Berlin.','Countries have agreed to cooperate through a climate convention. Negotiators now face the harder question of who will cut emissions, by how much and on what timetable.'],
   ['Learning to live with change','Adaptation gains a clearer place alongside emissions cuts in international negotiations.','The Cancún agreements put adapting to climate impacts on a more formal footing. For a coastal community, the debate reaches from global commitments to local choices about flood protection.'],
   ['Heat changes daily life','A warming planet is reshaping ecosystems, livelihoods and the places people call home.','The same hot afternoon can mean a minor inconvenience in a shaded house and a serious risk in a poorly ventilated flat. Housing, income and public services shape who bears the consequences.'],
   ['Redesigning for heat','Hotter summers could change school hours, building design and the shape of city streets.','Picture a neighbourhood choosing between more air conditioning and a programme of shade trees, cool roofs and home retrofits. Each choice distributes costs and protection differently.'],
   ['Coasts face hard choices','Rising seas could force some coastal communities to choose between protection and relocation.','Two neighbouring towns might take different paths. One funds defences. The other buys time for a gradual move inland. Who owns land and who gets a voice could matter as much as the engineering.']
  ],
  ask:'If two neighbourhoods experience the same heatwave, what could make the outcome very different?',
  links:[['cities','Shade, housing quality and urban design change how much heat residents experience.'],['energy','The sources of electricity and heat influence the pace of future warming.']],
  sources:[['IPCC · Sixth Assessment synthesis','https://www.ipcc.ch/report/ar6/syr/summary-for-policymakers/'],['United Nations · Climate negotiations timeline','https://www.un.org/sustainabledevelopment/climate-negotiations-timeline/']]
 },
 {
  id:'population',name:'Demographic shifts',domain:'Society',icon:'people',
  intro:'Births, deaths and migration slowly change the size and age of a population. Places can move in very different directions even as the global picture shifts.',
  stages:[
   ['A generation reaches adulthood','Past high birth rates leave many countries with large generations of young people.','A birth boom echoes through time. A large school-age generation becomes a large group of young adults looking for work, housing and opportunities to start families.'],
   ['Family sizes diverge','Average family size is falling at different speeds across countries.','Where fewer children are born, class sizes can start to fall well before the total population stops growing. A large generation of prospective parents keeps the population changing.'],
   ['Longer lives change households','Rising longevity and smaller families alter the balance between generations.','More years of life can mean more time with grandchildren, another career or a longer period of needing support. The consequences depend on health, pensions and family circumstances.'],
   ['Different ages, different futures','Some societies are ageing rapidly while others have large generations entering adulthood.','A town with fewer children may have spare classrooms and a shortage of home carers. Elsewhere the pressure runs the other way. A global average can hide both experiences.'],
   ['Care becomes a design question','Some places could adapt housing, transport and work around much longer lives.','Consider a street where shops are close, buses are frequent and neighbours can share care. The same age structure could feel very different in a place built around driving and distant services.'],
   ['A different life course','Longer lives could blur the boundaries between education, paid work, retirement and care.','One possibility is a life with several periods of learning and caring. Unequal health and wealth would affect who actually gets that flexibility.']
  ],
  ask:'What would an older population need less of, as well as more of, in your neighbourhood?',
  links:[['work','Age structures influence the supply of workers and the demand for care.'],['cities','The mix of ages affects demand for schools, accessible homes and public transport.']],
  sources:[['UN DESA · World Population Prospects 2024','https://www.un.org/development/desa/pd/world-population-prospects-2024/']]
 },
 {
  id:'cities',name:'Urbanisation',domain:'Society',icon:'city',
  intro:'As people and jobs concentrate in towns and cities, the places we build shape who can reach shelter, services and opportunity.',
  stages:[
   ['Cities grow outwards','Industrial employment and expanding settlements draw more people into urban life.','New arrivals need homes and ways to reach work. When formal housing supply falls behind, people often build and extend neighbourhoods themselves.'],
   ['The growing megacity','Very large cities bring the opportunities and difficulties of growth into sharper view.','A bigger labour market can support specialised jobs. Long commutes and rising rents can also place those opportunities out of reach for residents on the edges.'],
   ['Growth beyond the skyline','Urban growth stretches past old administrative boundaries into connected regions.','A person may sleep in one municipality, work in another and use water from a third. Planning for a functioning city increasingly means looking beyond the line on a map.'],
   ['The urban century','Cities keep growing, with many of the fastest changes taking place in smaller urban centres.','The UN counts 45% of people living in cities in 2025 under its harmonised definition. Towns form a separate group. Distinguishing the two reveals places that the usual images of megacities overlook.'],
   ['The next urban centres','Smaller cities could become proving grounds for affordable housing and low-carbon transport.','A growing city might reserve routes for buses before development spreads. If land becomes unaffordable first, people could instead face longer journeys from the outskirts.'],
   ['Growing and shrinking side by side','Some cities may expand quickly while others rethink infrastructure for fewer residents.','A city losing population might convert empty buildings into homes for older people. A fast-growing city faces a different challenge in delivering water and housing fast enough.']
  ],
  ask:'Which problems change if you draw a city boundary around everyday journeys?',
  links:[['climate','Buildings and street layouts influence exposure to heat and floods.'],['population','Migration and age patterns can make neighbouring towns grow or shrink.']],
  sources:[['UN DESA · World Urbanization Prospects 2025','https://www.un.org/development/desa/pd/world-urbanization-prospects-2025']]
 },
 {
  id:'work',name:'The changing world of work',domain:'Economy',icon:'work',
  intro:'Technologies, institutions and people’s bargaining power shape how jobs are organised, where work happens and who shares its rewards.',
  stages:[
   ['The electronic office','Office computers and early experiments in telework open up new ways to organise tasks.','Some employers begin testing whether information can travel instead of a worker. For most jobs, the technology, workplace rules and daily routines still favour being on site.'],
   ['Work crosses networks','Networked computers make it easier for colleagues to exchange documents across distance.','A shared file can travel faster than a paper folder. The bigger organisational change is deciding who can edit it, who approves it and how colleagues coordinate their time.'],
   ['Platforms match people to tasks','Online marketplaces and mobile apps connect customers with workers in new ways.','A person can find a short assignment without a traditional employer. Ratings, fees and the rules of a platform can influence both income and the freedom to turn a job down.'],
   ['Tasks are being redrawn','Generative AI is changing parts of jobs, raising questions about skills, autonomy and pay.','A job usually combines many activities. Automating a first draft can leave judgement, interpersonal work and accountability with the worker. Workplace decisions determine how that change feels.'],
   ['Who gains the time?','Productivity gains could translate into shorter hours, more output or closer monitoring.','Imagine two teams adopting the same tool. One protects time for learning. The other raises its production targets. Workplace agreements could make their experiences diverge.'],
   ['New bargains over work','Societies could rethink how paid work, unpaid care and lifelong learning fit together.','If people move between caring, learning and earning more often, benefits tied to a single employer may fit poorly. New forms of security would depend on political choices.']
  ],
  ask:'If a task takes half as long tomorrow, who gets to decide how the saved time is used?',
  links:[['intelligence','AI can change the balance of drafting, checking and decision-making in a job.'],['population','An ageing workforce can change working hours and demand for caring roles.']],
  sources:[['ILO · Generative AI and jobs, 2025','https://www.ilo.org/sites/default/files/2025-05/Research%20brief_FINAL_15May2025_21.05.25_1.pdf'],['ILO · Teleworking arrangements','https://www.ilo.org/publications/teleworking-arrangements-during-covid-19-crisis-and-beyond']]
 },
 {
  id:'energy',name:'The energy transition',domain:'Environment',icon:'sun',
  intro:'The fuels and technologies we use for heat, transport and electricity change over time. Every energy system comes with its own dependencies.',
  stages:[
   ['The shock of oil dependence','Oil price shocks prompt governments to reconsider energy security and efficiency.','For a household, an oil shock shows up in bills and travel costs. For a government, it raises a longer-term question about how much of the economy depends on imported fuel.'],
   ['Renewables find early markets','Wind farms and solar installations begin building experience in new electricity markets.','A turbine needs more than wind. Grid access, a buyer for the electricity and maintenance skills all help determine whether an early project can become a repeatable investment.'],
   ['Deployment gathers pace','Wind and solar begin a period of much larger deployment.','As more equipment is made and installed, manufacturers and installers learn where they can cut costs. Support policies, finance and grid access influence which places benefit first.'],
   ['Electricity gets a new mix','Solar and wind are expanding, bringing storage and electricity networks into sharper focus.','New generating capacity helps only when its output can reach people. The timing of demand, the availability of storage and the capacity of the grid become practical limits on the transition.'],
   ['Local grids take on more','Electric vehicles, batteries and heat pumps could turn neighbourhoods into active parts of the grid.','A fleet of parked vehicles could help smooth demand. Whether households share in the benefit would depend on tariffs, compatible equipment and access to charging.'],
   ['Security takes new forms','An electrified economy could trade some fuel dependencies for dependencies on minerals and grids.','Imagine a country with abundant clean electricity but ageing transmission lines. Repair skills, spare transformers and agreements with neighbours might become central to its energy security.']
  ],
  ask:'Which new dependency might appear as a country becomes less dependent on imported fuel?',
  links:[['climate','Energy choices affect emissions, while hotter weather changes electricity demand.'],['intelligence','The location of data centres can reshape demand on local electricity networks.']],
  sources:[['IEA · Solar PV and wind in 2025','https://www.iea.org/reports/global-energy-review-2026/technology-solar-pv-and-wind'],['IEA · Energy price shocks and affordability','https://www.iea.org/reports/strategies-for-affordable-and-fair-clean-energy-transitions/price-shocks-and-affordability']]
 }
];
