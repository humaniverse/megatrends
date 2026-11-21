"""Methods and examples for the Observatory's methods chapter."""

NAISBITT = ('The Naisbitt Group’s forecasting process', 'https://onlinepubs.trb.org/Onlinepubs/trcircular/348/348-008.pdf')
OXFAM = ('Oxfam’s scan of scans (2020)', 'https://frompoverty.oxfam.org.uk/will-the-real-megatrend-please-stand-up-insights-from-a-scan-of-scans/')
CSIRO = ('CSIRO, Our Future World (2022)', 'https://www.csiro.au/-/media/D61/Our-Future-World-Megatrends-report/Our-Future-World-report-2022-2.pdf')
DEFRA = ('Defra and Andthen’s methodology (2024)', 'https://gmts.netlify.app/how-it-was-made')
DEFRA_REPORT = ('Defra, Global Megatrends 2024', 'https://research-portal.uea.ac.uk/files/226663178/21731_GLOBAL_MEGATRENDS_REPORT_2024_EXTERNAL.PDF')
REVIEW = ('Naughtin et al., Forty Years in the Making (2024)', 'https://doi.org/10.1016/j.futures.2024.103329')
SITRA = ('Sitra, Megatrends 2026, methodology appendix', 'https://www.sitra.fi/wp-content/uploads/2026/02/Sitra_Megatrendit_2026_Selvitys_EN_NET_korjattu.pdf#page=93')
CIFS = ('Copenhagen Institute for Futures Studies, Megatrends 2026', 'https://www.cifs.dk/read-listen/reports-knowledge/megatrends')

METHOD_GROUPS = (
    ('evidence', 'Evidence and existing knowledge', (
        ('Media content analysis',
         'Code newspaper or other media coverage for recurring developments. In 1982 John Naisbitt used stories from local US newspapers to look for changes taking shape at the grassroots. The findings reflect what editors consider newsworthy and which outlets are sampled.',
         (NAISBITT,)),
        ('Horizon scanning',
         'Search widely for signals and drivers across domains. CSIRO combined academic papers, government and industry reports, databases and media, then screened and prioritised the trends it found. A broad scan can surface surprises. Its languages, search terms and source mix still shape what it picks up.',
         (CSIRO,)),
        ('Synthesis of existing megatrend reports',
         'Compare published outlooks, reconcile different labels and note where authors converge or disagree. Oxfam compared 22 scans. Defra and Andthen used 24 reports to inform a shortlist. Check whether reports draw on the same underlying evidence before treating agreement as corroboration.',
         (OXFAM, DEFRA)),
        ('Systematic literature reviews',
         'Use a documented search and selection process to compare research, then code the included material. Naughtin and colleagues used a systematic review to examine definitions and methods. Sitra’s 2026 report used a broader literature review to build its evidence base.',
         (REVIEW, SITRA)),
        ('Bibliometric and patent analysis',
         'Track publications, citations, keywords or patents to see where research and invention are gathering momentum. A 2022 study mapped research on societal technological megatrends using Scopus and Web of Science. Publication and patent activity can indicate attention or inventive effort, while widespread adoption requires separate evidence.',
         (('Societal Technological Megatrends (2022)', 'https://doi.org/10.3390/su14031543'),)),
    )),
    ('judgement', 'Judgement and participation', (
        ('Expert interviews and panels',
         'Ask specialists and stakeholders to surface drivers, assess evidence or challenge a draft. CSIRO supplemented its scan with consultations. The US National Intelligence Council drew on interviews and workshops for Global Trends 2030. Who participates shapes the range of plausible interpretations.',
         (CSIRO, ('Methods of NIC’s Global Trends 2030', 'https://doi.org/10.1177/1946756713510277'))),
        ('Delphi studies',
         'Collect expert judgements over successive rounds, sharing the group’s feedback between rounds so people can revise their answers. Research on European sustainable mobility used Delphi to prioritise candidate megatrends. Agreement describes the panel’s judgement and still needs an empirical check.',
         (('Anoyrkati, Megatrends: A Roadmap to Sustainable Mobility', 'https://pureportal.coventry.ac.uk/en/studentTheses/megatrends-a-roadmap-to-sustainable-mobility-policy-directions-fo/'),)),
        ('Participatory workshops and crowdsourcing',
         'Invite staff, communities or other participants to nominate changes and question interpretations. Sitra drew on Finnish workshops and internal contributions for its 2026 report. The approach can widen the evidence base, especially when people outside established expert networks can take part.',
         (SITRA,)),
        ('Large-scale population surveys',
         'Measure attitudes or reported behaviours across groups, places or survey waves. Ipsos’s 2026 Global Trends study surveyed 29,542 adults in 38 markets. Sampling, question wording and comparable time series matter when using survey findings to make claims about long-term change.',
         (('Ipsos Global Trends 2026, survey methodology', 'https://www.ipsos.com/en/ipsos-global-trends-10th-edition/methodology-2026'),)),
        ('Hypothesis-led expert judgement',
         'Start with a provisional proposition. Specify the shift, look for evidence and counterexamples, then revise or drop it. The Copenhagen Institute for Futures Studies tested candidates against criteria for structural depth, direction, reach and persistence.',
         (CIFS,)),
    )),
    ('quantitative', 'Quantitative and computational methods', (
        ('Longitudinal statistical analysis',
         'Compare indicators over time and across places to establish direction, duration, pace and variation. Defra’s 2024 report uses measures such as temperature, economic output, military spending and conflict. Inspect the time window and measurement changes before interpreting a turning point.',
         (DEFRA_REPORT,)),
        ('Historical and regime-shift analysis',
         'Look back to ask when a durable change became visible and what conditions made it possible. Defra assigned proposed origin points and confidence levels to its megatrends. Competing dates can reflect different choices about when a change first became detectable or started reshaping several systems.',
         (DEFRA,)),
        ('Statistical modelling and forecasting',
         'Use models to estimate how a measured trend could develop under stated assumptions. Euromonitor combines industry data and predictive indicators to estimate the future growth of selected consumer megatrends. Forecasts can help quantify a trajectory whose existence is already supported by evidence.',
         (('Euromonitor’s Megatrends Quantification Model', 'https://www.euromonitor.com/contentassets/6e75a0fe0fc24f9c86c93d1bdf947998/flyerinnovation_megatrendsquantificationmodel.pdf'),)),
        ('Automated text mining and topic modelling',
         'Use keyword searches, co-occurrence analysis or topic models to find patterns across large bodies of text. A South Korean study tracked references to predefined megatrends across millions of news articles. Topic modelling can also surface candidate themes without a predefined list. Both approaches need independent evidence of change outside the text.',
         (('Korea Research Institute for Human Settlements, megatrend analysis', 'https://www.krihs.re.kr/data/en_news/SPECIAL_REPORT_45.pdf'),)),
        ('AI-assisted analysis',
         'Use AI to collect contributions, search sources, monitor news or summarise large amounts of material. Sitra used a chatbot to collect staff input and tools to check and organise evidence, while its authors retained responsibility for interpretation and the final selection.',
         (SITRA,)),
    )),
    ('patterns', 'Higher-order patterns and interactions', (
        ('Thematic, semantic and network clustering',
         'Group narrower trends that share drivers, effects, meanings or connections. CSIRO clustered trends by common drivers or impacts. Defly Compass used text co-occurrence and semantic analysis to help identify groups for experts to interpret. A cluster provides a candidate pattern whose mechanism still needs testing.',
         (CSIRO, ('Defly Compass trend analysis methodology', 'https://www.mdpi.com/2078-2489/16/7/605'))),
        ('Systems and cross-impact analysis',
         'Map how trends reinforce, constrain or depend on one another and ask what larger patterns result. Önnered and colleagues mapped interactions among 14 European Commission megatrends and used them to explore emerging challenges. The relationships are hypotheses that can be challenged with evidence.',
         (('Emerging Grand Challenges and Megatrends for the Future of Europe (2026)', 'https://jfsdigital.org/2026-2/vol-30-no-3-march-2026/emerging-grand-challenges-and-megatrends-for-the-future-of-europe/'),)),
    )),
)

CASE_STUDIES = (
    ('naisbitt-1982', 'John Naisbitt, 1982', 'Megatrends',
     'Naisbitt’s team read, clipped and categorised reports from local US newspapers. Recurring stories became clues to broad shifts, such as the rise of the information society.',
     NAISBITT),
    ('oxfam-2020', 'Oxfam, 2020', 'Global Megatrends',
     'Oxfam coded trends across 22 existing scans, compared the strength of agreement and grouped the findings into four clusters. The analysis also asked whose perspectives the original reports represented.',
     OXFAM),
    ('csiro-2022', 'CSIRO, 2022', 'Our Future World',
     'CSIRO set a scope, scanned widely, screened and validated individual trends, then grouped those with common drivers or impacts into seven megatrends.',
     CSIRO),
    ('defra-2024', 'Defra and Andthen, 2024', 'Global Megatrends 2024',
     'A review of 24 reports helped generate 19 candidates. The team drafted 12, then held structured challenge sessions with 44 experts. Two candidates fell below the evidence threshold, leaving ten.',
     DEFRA),
    ('sitra-2026', 'Sitra, 2026', 'Megatrends 2026',
     'Sitra combined earlier foresight studies, literature, consultations and workshops to interpret global shifts for Finland. AI helped collect contributions, monitor news and structure material.',
     SITRA),
    ('cifs-2026', 'Copenhagen Institute for Futures Studies, 2026', 'Megatrends 2026',
     'The team started with provisional hypotheses, assessed each against a structural diagnostic and evidence, then refined the 11 megatrends individually and as a set.',
     CIFS),
)

WORKFLOW = (
    ('Discover', 'Cast a wide net across research, indicators, media, patents and communities. Look for patterns across narrower changes and write down provisional hypotheses about forces the scan may have missed.'),
    ('Qualify', 'Check scale, duration, geographic reach, direction and effects across domains. Use historical and quantitative evidence to test the mechanism and its alternatives. Invite independent challenge and record what would weaken the case.'),
    ('Synthesise', 'Map shared drivers, dependencies, overlaps and counterforces. Publish the evidence, confidence, gaps, indicators to monitor and conditions under which the judgement would change.'),
)
