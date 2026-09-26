#!/usr/bin/env python3
"""Generate 9 region pages for renofy.ca — unique local content per region."""
import json, re, html as htmllib

PHONE = "+1-647-673-3696"
PHONE_HREF = "tel:+16476733696"

REGIONS = [
 dict(
  slug="durham-region", region="Durham Region", cities=["Whitby","Pickering","Ajax","Bowmanville","Clarington"],
  title="Kitchen & Bath Renovations in Durham Region | Renofy",
  meta="Renofy renovates kitchens, bathrooms & basements across Durham Region — Whitby, Pickering, Ajax, Bowmanville & Clarington. Fixed quotes, 1-year warranty.",
  h1='Kitchen &amp; bathroom renovations in <span class="grad-copper">Durham Region.</span>',
  kicker="Now serving Durham",
  lead="From Whitby's family subdivisions to Pickering's waterfront, Renofy brings luxury kitchens, spa-like bathrooms, and finished basements to Durham Region — on a fixed quote, backed by a 1-year craftsmanship warranty.",
  intro=[
   "Durham is one of the GTA's fastest-growing regions, and its homes are growing with it. Young families upsizing into Whitby and Brooklin semis and detached, Pickering's mix of waterfront condos and established neighbourhoods, and Bowmanville and Clarington where first-time buyers finally find room to breathe.",
   "The pattern we see across Durham: kitchens opened up for family life, tired builder bathrooms reborn as spa retreats, and basements finished as the kids get bigger. One crew, every trade, zero horror stories.",
  ],
  projects=[
   ("Kitchen expansions in Whitby & Brooklin", "Removing the wall between kitchen and family room is Durham's most-requested move — waterfall islands, full-height quartzite backsplashes, and pantries that swallow the Costco run whole."),
   ("Spa bathrooms in Pickering & Ajax", "Curbless showers, heated floors, and double vanities turn 90s builder bathrooms into morning sanctuaries. Most ensuite transformations finish in three to four weeks."),
   ("Basement finishing in Bowmanville & Clarington", "Legal second suites, home gyms, and media lounges — finished to the same standard as the main floor, never an afterthought."),
  ],
  areas=[
   ("Whitby", "Brooklin to downtown — subdivision semis and detached homes ready for open-concept kitchens."),
   ("Pickering", "Waterfront condos to Amberlea family homes — kitchens, baths, and full main floors."),
   ("Ajax", "South Ajax bungalows and new north-end builds — bathrooms and basements done right."),
   ("Bowmanville & Clarington", "Room to grow — basement finishing, additions, and whole-home updates."),
  ],
  faqs=[
   ("Who is the best renovation company in Durham Region?",
    "We'll let our clients answer that — but here's our definition of 'best': a fixed quote in writing before day one, a dust-free job site, one licensed crew for every trade, and a 1-year craftsmanship warranty. If a contractor won't put the price in writing, keep looking."),
   ("How much does a kitchen renovation cost in Whitby?",
    "Most Whitby kitchen renovations land between $45,000–$90,000 depending on layout changes, cabinetry, and stone selection. Our kitchen renovation cost guide breaks down exactly where the money goes."),
   ("Do you renovate condos in Pickering?",
    "Yes — we handle condo board approvals, elevator bookings, and restricted-hour work for kitchen and bathroom renovations in Pickering's waterfront buildings."),
  ],
  image="service-kitchen", image_alt="Kitchen renovation in Whitby, Durham Region by Renofy",
 ),
 dict(
  slug="york-region", region="York Region", cities=["Vaughan","Markham","Richmond Hill"],
  title="Kitchen & Bath Renovations in York Region | Renofy",
  meta="Luxury kitchen & bathroom renovations across York Region — Vaughan, Markham & Richmond Hill. Builder-basic upgrades, fixed quotes, 1-year warranty.",
  h1='Kitchen &amp; bathroom renovations in <span class="grad-copper">York Region.</span>',
  kicker="Now serving York Region",
  lead="Vaughan, Markham, Richmond Hill — York Region's homes are big, beautiful, and often builder-basic. Renofy turns them into the custom homes they should have been.",
  intro=[
   "Woodbridge and Maple's 2000s detached, Kleinburg's estate streets, Unionville's heritage pockets, Richmond Hill's 90s suburbs hitting renovation age — York Region has some of the GTA's finest housing stock, and much of it is wearing the same generic finishes it was built with.",
   "Our signature York Region project: undoing the builder-basic kitchen. Generic oak cabinets out; custom millwork, quartzite, layered lighting, and a layout that actually fits how your family lives — in.",
  ],
  projects=[
   ("Builder-basic kitchen upgrades in Vaughan", "Woodbridge and Maple kitchens reborn with custom cabinetry, full-height stone, and islands built for homework, hosting, and everything between."),
   ("Ensuite retreats in Markham", "Soaker tubs, curbless showers, and heated floors turn Markham's primary bathrooms into five-star mornings."),
   ("Main-floor makeovers in Richmond Hill", "Flooring, paint, and millwork across the whole main floor — one crew, one timeline, one fixed price."),
  ],
  areas=[
   ("Vaughan", "Woodbridge, Maple, Kleinburg — from builder-basic to fully custom."),
   ("Markham", "Unionville heritage to new detached — ensuites, kitchens, and full-home updates."),
   ("Richmond Hill", "90s suburbs hitting their renovation prime — main floors and bathrooms."),
  ],
  faqs=[
   ("Who is the best renovation company in York Region?",
    "The best contractor is the one who puts it in writing: fixed quote, licensed crew, dust-free site, and a real warranty. That's how we work on every Vaughan, Markham, and Richmond Hill project — and our reviews say it shows."),
   ("How long does a bathroom renovation take in Vaughan?",
    "A full bathroom renovation typically takes three to four weeks. We give you the schedule in writing before we start — and we stick to it."),
   ("Do you work in Markham's heritage areas like Unionville?",
    "Yes — we take extra care with older and character homes, matching millwork profiles and finishes so the renovation feels original to the house."),
  ],
  image="service-bathroom", image_alt="Spa bathroom renovation in Vaughan, York Region by Renofy",
 ),
 dict(
  slug="peel-region", region="Peel Region", cities=["Mississauga","Brampton"],
  title="Renovation Contractor in Mississauga & Peel | Renofy",
  meta="Home renovations in Mississauga & Brampton — kitchens, bathrooms, basements & legal second suites. Fixed quotes, 1-year warranty. Renofy.",
  h1='Home renovations in <span class="grad-copper">Mississauga &amp; Peel Region.</span>',
  kicker="Now serving Peel",
  lead="From Port Credit village homes to City Centre condos, Erin Mills family streets to Brampton's multigenerational households — Renofy renovates Peel Region to stay.",
  intro=[
   "Peel families renovate for the long haul — which is exactly how we build. Mississauga brings us everything from Port Credit and Streetsville character homes to City Centre condos needing board-approved kitchen and bath updates, to Erin Mills and Lisgar family homes ready for their second chapter.",
   "In Brampton, the story is often multigenerational: legal second suites, basement apartments, and main-floor overhauls that give everyone their own space — permitted, inspected, and built to code.",
  ],
  projects=[
   ("Condo kitchens & baths in Mississauga City Centre", "Board approvals, elevator bookings, restricted hours — we handle the red tape while you get a kitchen worth showing off."),
   ("Legal second suites in Brampton", "Egress windows, separate entrances, full kitchens — code-compliant basement apartments that add income and value."),
   ("Main-floor renovations in Erin Mills & Lisgar", "Kitchens opened to family rooms, new flooring throughout, and lighting that finally does the space justice."),
  ],
  areas=[
   ("Mississauga", "Port Credit, Streetsville, City Centre, Erin Mills — condos to detached, we do it all."),
   ("Brampton", "Multigenerational renovations, legal second suites, and full main floors."),
  ],
  faqs=[
   ("Who is the best renovation company in Mississauga?",
    "Ask for three things: a fixed written quote, proof of insurance, and a warranty that outlasts the invoice. We bring all three to every Mississauga project — plus a dust-free job site your family can actually live around."),
   ("How much does a legal basement apartment cost in Brampton?",
    "A code-compliant second suite in Brampton typically runs $80,000–$150,000 depending on separate entrance, egress, and kitchen requirements. We handle permits and inspections end to end."),
   ("Can you renovate my condo kitchen in Mississauga?",
    "Absolutely — condo renovations are a specialty. We manage board approvals, noise bylaws, and elevator scheduling so your project runs smooth."),
  ],
  image="service-basement", image_alt="Basement renovation in Mississauga, Peel Region by Renofy",
 ),
 dict(
  slug="halton-region", region="Halton Region", cities=["Oakville","Burlington","Milton"],
  title="Luxury Home Renovations in Oakville & Halton | Renofy",
  meta="Luxury kitchens, bathrooms & full-home renovations in Oakville, Burlington & Milton. Fixed quotes, 1-year warranty. Renofy.",
  h1='Luxury home renovations in <span class="grad-copper">Oakville &amp; Halton.</span>',
  kicker="Now serving Halton",
  lead="Oakville's estate streets, Burlington's lakeside character homes, Milton's growing family neighbourhoods — Halton expects a higher standard. So do we.",
  intro=[
   "From Glen Abbey and Clearview in Oakville to Aldershot and Roseland in Burlington, Halton's established neighbourhoods hold some of Ontario's finest homes — and they deserve renovations to match. Think chef's kitchens with full-height stone, primary suites that feel like boutique hotels, and millwork with furniture-grade finishes.",
   "Milton's story is younger: growing families in newer builds, ready to turn builder finishes into forever-home details. Either way, the Renofy promise holds — fixed quote, dust-free site, 1-year warranty.",
  ],
  projects=[
   ("Chef's kitchens in Oakville", "48-inch ranges, walk-in pantries, waterfall islands in quartzite — kitchens built for people who actually cook."),
   ("Character-home bathrooms in Burlington", "Victorian and mid-century bathrooms reimagined with heated floors, curbless showers, and period-sensitive details."),
   ("Whole-home updates in Milton", "Flooring, paint, lighting, and millwork across the full house — one crew, one schedule, zero juggling."),
  ],
  areas=[
   ("Oakville", "Glen Abbey, Clearview, Old Oakville — luxury kitchens and full-home renovations."),
   ("Burlington", "Aldershot, Roseland, downtown — character homes treated with respect."),
   ("Milton", "New-build upgrades and family-home transformations."),
  ],
  faqs=[
   ("Who is the best luxury renovation company in Oakville?",
    "Luxury isn't a price tag — it's precision: laser-level tile, book-matched stone, millwork with hairline joints. Tour our past work, read our reviews, and compare our fixed-quote process against anyone in Oakville."),
   ("How much does a luxury kitchen renovation cost in Oakville?",
    "High-end Oakville kitchens typically run $90,000–$150,000+ with custom millwork, professional appliances, and natural stone. We scope obsessively so the quote you sign is the price you pay."),
   ("Do you handle heritage or character homes in Burlington?",
    "Yes — we match existing millwork profiles, preserve original details worth keeping, and blend new work so seamlessly it looks original."),
  ],
  image="service-kitchen", image_alt="Luxury kitchen renovation in Oakville, Halton Region by Renofy",
 ),
 dict(
  slug="hamilton", region="Hamilton", cities=["Hamilton","Stoney Creek","Ancaster","Dundas","Grimsby"],
  title="Renovation Company in Hamilton, ON | Renofy",
  meta="Century-home & modern renovations in Hamilton, Ancaster, Dundas, Stoney Creek & Grimsby. Fixed quotes, 1-year warranty. Renofy.",
  h1='Home renovations in <span class="grad-copper">Hamilton &amp; area.</span>',
  kicker="Now serving Hamilton",
  lead="Century Victorians on the Mountain, character homes in Dundas and Ancaster, growing subdivisions in Grimsby — Hamilton's housing stock has soul, and we know how to handle it.",
  intro=[
   "Hamilton rewards contractors who respect old bones. Downtown and Kirkendall Victorians hide plaster walls, century-old wiring, and the occasional structural surprise — we've seen it all, and our fixed quotes account for it honestly instead of surprising you mid-project.",
   "Ancaster and Dundas bring estate character; Stoney Creek and Grimsby bring newer subdivisions and young families. Different houses, same Renofy standard: one crew, every trade, dust-free sites, and a warranty in writing.",
  ],
  projects=[
   ("Century-home kitchens in Hamilton", "Plaster-safe demo, structural know-how, and modern layouts that honour the home's character — from the North End to the Mountain."),
   ("Bathroom retreats in Ancaster & Dundas", "Heated floors and curbless showers in homes where the bathroom hasn't been touched since the 80s."),
   ("Basement finishing in Stoney Creek & Grimsby", "Media lounges, guest suites, and home offices — finished to main-floor standards."),
  ],
  areas=[
   ("Hamilton", "Downtown, Kirkendall, the Mountain — century homes are our specialty."),
   ("Ancaster & Dundas", "Character homes and estate properties, renovated with respect."),
   ("Stoney Creek & Grimsby", "Subdivision family homes — kitchens, baths, and basements."),
  ],
  faqs=[
   ("Who is the best renovation company in Hamilton?",
    "For Hamilton's older homes, 'best' means a crew that's seen what's behind plaster walls and prices honestly for it. We scope century homes obsessively, put the number in writing, and back it with a 1-year warranty."),
   ("Do old Hamilton homes always have expensive surprises?",
    "Not always — but knob-and-tube remnants, undersized joists, and crumbling plaster are common. Our estimates include realistic contingencies for century-home quirks, discussed upfront, never sprung on you."),
   ("Do you do plaster repair in heritage homes?",
    "Yes — our plaster and drywall crew blends repairs invisibly, matching existing textures so the old and new read as one."),
  ],
  image="service-bathroom", image_alt="Bathroom renovation in Hamilton, Ontario by Renofy",
 ),
 dict(
  slug="niagara-region", region="Niagara Region", cities=["Niagara Falls","St. Catharines","Welland"],
  title="Home Renovations in Niagara Region | Renofy",
  meta="Kitchens, bathrooms & basement renovations in Niagara Falls, St. Catharines & Welland. Fixed quotes, 1-year warranty. Renofy.",
  h1='Home renovations across <span class="grad-copper">Niagara Region.</span>',
  kicker="Now serving Niagara",
  lead="Niagara Falls, St. Catharines, Welland — bungalows, family homes, and in-law suites across the region, renovated on a fixed quote with a 1-year warranty.",
  intro=[
   "Niagara's housing stock is wonderfully practical: brick bungalows, 70s–90s two-storeys, and homes with the bones for perfect in-law suites. What they share is potential — kitchens that haven't been touched in thirty years, bathrooms begging for a curbless shower, and basements waiting to become something.",
   "Our crews travel to Niagara for the right projects, bringing the same fixed-price process and dust-free job sites we're known for in the GTA.",
  ],
  projects=[
   ("Bungalow kitchen renovations", "Single-storey living deserves a single-storey showpiece — open layouts, quartzite islands, and storage that actually works."),
   ("In-law suites across Niagara", "Separate living space for family, done to code with full kitchens and accessible bathrooms."),
   ("Bathroom updates in St. Catharines & Welland", "Tub-to-shower conversions, heated floors, and vanities with real storage."),
  ],
  areas=[
   ("Niagara Falls", "Bungalows to family two-storeys — kitchens, baths, and basements."),
   ("St. Catharines", "North-end suburbs to downtown character homes."),
   ("Welland", "In-law suites and full-home updates."),
  ],
  faqs=[
   ("Who is the best renovation company in Niagara Region?",
    "Whoever puts the price in writing before starting, shows up when promised, and warranties the work. That's our operating system on every Niagara project — fixed quote, dust-free site, 1-year warranty."),
   ("How much does an in-law suite cost in Niagara?",
    "A code-compliant in-law or second suite typically runs $80,000–$150,000 depending on entrance, egress, and kitchen requirements. We handle permits and inspections."),
   ("Do you really travel to Niagara Falls for renovations?",
    "Yes — for kitchens, bathrooms, basements, and full-home projects, our crews travel across Niagara Region."),
  ],
  image="service-kitchen", image_alt="Kitchen renovation in Niagara Falls by Renofy",
 ),
 dict(
  slug="waterloo-region", region="Waterloo Region", cities=["Kitchener","Waterloo","Cambridge"],
  title="Renovations in Kitchener-Waterloo & Cambridge | Renofy",
  meta="Kitchen, bathroom & basement renovations in Kitchener, Waterloo & Cambridge. Fixed quotes, 1-year warranty. Renofy.",
  h1='Home renovations in <span class="grad-copper">Kitchener-Waterloo.</span>',
  kicker="Now serving Waterloo Region",
  lead="Kitchener, Waterloo, Cambridge — from wartime semis to tech-corridor family homes, Renofy brings fixed-quote, warranty-backed renovations to Waterloo Region.",
  intro=[
   "Waterloo Region's homes tell its history: Kitchener's hardworking semis and detached, Waterloo's mix of university-area investments and established family streets, and Cambridge — Galt, Preston, Hespeler — with some of Ontario's most charming older stone and brick stock.",
   "Whether it's a forever-home kitchen in Beechwood or a rental-ready bathroom near the universities, the process is the same: obsessive scoping, a fixed written quote, and craftsmanship backed for a year.",
  ],
  projects=[
   ("Kitchen renovations in Kitchener", "Semis and detached opened up for modern family life — islands, pantries, and stone that stands up to real cooking."),
   ("Bathrooms in Waterloo", "Spa-like ensuites for family homes and durable, beautiful updates for investment properties."),
   ("Basement finishing in Cambridge", "From Galt's older homes to Preston's family streets — guest suites, lounges, and home offices."),
  ],
  areas=[
   ("Kitchener", "Semis to detached — kitchens, baths, and full main floors."),
   ("Waterloo", "Family homes and university-area investment properties."),
   ("Cambridge", "Galt, Preston, Hespeler — older stock handled with care."),
  ],
  faqs=[
   ("Who is the best renovation company in Kitchener-Waterloo?",
    "The one that treats your budget like their own: fixed quote in writing, no surprise change orders, and a 1-year warranty. Compare our process and reviews against anyone in KW."),
   ("Do you renovate investment properties in Waterloo?",
    "Yes — durable, attractive kitchens and bathrooms that photograph well, rent fast, and survive tenants. Fixed timelines matter to investors, and we put ours in writing."),
   ("How long does a basement finishing take in Cambridge?",
    "Most basement projects run six to ten weeks depending on bathrooms, kitchens, and egress work. You'll have the full schedule before we start."),
  ],
  image="service-basement", image_alt="Basement renovation in Kitchener, Waterloo Region by Renofy",
 ),
 dict(
  slug="barrie", region="Barrie & Simcoe County", cities=["Barrie","Innisfil"],
  title="Renovation Contractor in Barrie, ON | Renofy",
  meta="Kitchen, bathroom & basement renovations in Barrie & Innisfil. Fixed quotes, 1-year warranty. Renofy.",
  h1='Home renovations in <span class="grad-copper">Barrie &amp; Simcoe County.</span>',
  kicker="Now serving Barrie",
  lead="Barrie and Innisfil — waterfront properties, growing subdivisions, and commuter-family homes, all renovated on a fixed quote with a 1-year warranty.",
  intro=[
   "Barrie's mix is pure Ontario: waterfront streets along Kempenfelt Bay, established bungalows in East Bayfield, and young subdivisions in Holly and Ardagh where builder finishes are already feeling tired. Commuter families want homes that work as hard as they do.",
   "Our crews head north for kitchens, bathrooms, basements, and full-home projects — same fixed-price process, same dust-free sites, same warranty in writing.",
  ],
  projects=[
   ("Kitchen renovations in Barrie's south end", "Holly and Ardagh family homes get the custom treatment — islands, full-height stone, and storage for real life."),
   ("Bathroom updates near the waterfront", "Ensuites and main baths with heated floors and curbless showers, minutes from the bay."),
   ("Basement finishing in Innisfil", "Guest suites and family lounges in Alcona and Stroud — finished to main-floor standards."),
  ],
  areas=[
   ("Barrie", "South-end subdivisions, East Bayfield, waterfront streets."),
   ("Innisfil", "Alcona, Stroud — basements, kitchens, and full-home updates."),
  ],
  faqs=[
   ("Who is the best renovation company in Barrie?",
    "Whoever earns it: fixed written quote, licensed crew, dust-free job site, and a warranty that outlasts the final invoice. That's the standard we bring north on every Barrie project."),
   ("Do you travel to Barrie for renovations?",
    "Yes — our crews regularly travel to Barrie and Innisfil for kitchens, bathrooms, basements, and full-home renovations."),
   ("How much does a basement finishing cost in Barrie?",
    "Most finished basements run $60,000–$120,000 depending on bathrooms, kitchens, and egress. Our estimator gives you a starting number in about 20 seconds."),
  ],
  image="service-bathroom", image_alt="Bathroom renovation in Barrie, Ontario by Renofy",
 ),
 dict(
  slug="london", region="London, Ontario", cities=["London"],
  title="Renovation Company in London, Ontario | Renofy",
  meta="Kitchens, bathrooms & full-home renovations in London, ON — Byron, Old North, Wortley Village. Fixed quotes, 1-year warranty. Renofy.",
  h1='Home renovations in <span class="grad-copper">London, Ontario.</span>',
  kicker="Now serving London",
  lead="Old North, Wortley Village, Byron — London's neighbourhoods have character worth preserving and homes worth upgrading. Renofy brings both.",
  intro=[
   "London rewards patience: Old North and Wortley Village heritage homes with plaster walls and original millwork, Byron's solid family two-storeys, and a growing downtown condo scene. Each needs a different hand — and we've got all of them.",
   "Our crews travel to London for kitchens, bathrooms, basements, and full-home renovations — scoped obsessively, priced in writing, and warranted for a year.",
  ],
  projects=[
   ("Heritage kitchens in Old North & Wortley", "Period-sensitive millwork, modern layouts, and stone that honours the home's century of stories."),
   ("Bathroom retreats in Byron", "Family bathrooms reborn — double vanities, curbless showers, heated floors."),
   ("Full-home updates across London", "Flooring, paint, lighting, and kitchens — one crew for the whole wishlist."),
  ],
  areas=[
   ("Old North & Wortley Village", "Heritage homes renovated with period respect."),
   ("Byron", "Family two-storeys — kitchens, baths, and basements."),
   ("Downtown & beyond", "Condos and infill — kitchens and bathrooms."),
  ],
  faqs=[
   ("Who is the best renovation company in London, Ontario?",
    "The best contractor for London's older homes is one that's worked in them before — plaster, old wiring, and all — and still puts the price in writing. That's us, on every project."),
   ("Do you handle heritage homes in Wortley Village?",
    "Yes — we match millwork profiles, preserve original details worth keeping, and blend new work so it reads as original to the house."),
   ("Do you travel to London for smaller projects?",
    "For kitchens, bathrooms, and basements, absolutely — talk to us about your project and we'll tell you straight if we're the right fit."),
  ],
  image="service-kitchen", image_alt="Kitchen renovation in London, Ontario by Renofy",
 ),
]

FAQ_STYLE = """<style>
.faq-list details.card{margin-bottom:1rem;transition:border-color .3s}
.faq-list details.card[open]{border-color:rgba(0,229,204,.35)}
.faq-list summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1.35rem 1.5rem;font-family:var(--font-display);font-size:1.15rem;font-weight:600}
.faq-list summary::-webkit-details-marker{display:none}
.faq-list summary .pm{flex:none;width:30px;height:30px;border-radius:50%;border:1px solid var(--glass-border);display:grid;place-items:center;color:var(--copper);font-size:1.2rem;transition:transform .3s}
.faq-list details[open] summary .pm{transform:rotate(45deg)}
.faq-list .answer{padding:0 1.5rem 1.5rem;color:var(--muted);line-height:1.7}
.faq-list .answer a{color:var(--teal)}
</style>"""

def build(r):
    url = f"https://renofy.ca/{r['slug']}.html"
    area_served = ",".join(f'{{"@type":"City","name":"{c}"}}' for c in r["cities"])
    faq_entities = []
    faq_html = []
    for i,(q,a) in enumerate(r["faqs"]):
        faq_entities.append({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}})
        open_attr = " open" if i==0 else ""
        faq_html.append(f'''    <details class="card reveal"{open_attr}>
      <summary>{htmllib.escape(q)} <span class="pm">+</span></summary>
      <div class="answer"><p>{a}</p></div>
    </details>''')
    graph = {
      "@context":"https://schema.org",
      "@graph":[
        {"@type":"HomeAndConstructionBusiness","@id":"https://renofy.ca/#business","name":"Renofy",
         "sameAs":["https://www.instagram.com/renofy.homes/"],"slogan":"Renovate | Redefine | Reimagine",
         "url":"https://renofy.ca/","telephone":PHONE,"email":"info@renofy.ca","priceRange":"$$",
         "image":"https://renofy.ca/assets/hero.jpg",
         "address":{"@type":"PostalAddress","addressLocality":r["cities"][0],"addressRegion":"ON","addressCountry":"CA"},
         "areaServed": json.loads(f"[{area_served}]"),
         "knowsAbout":["Kitchen renovation","Bathroom renovation","Basement finishing","Flooring installation","Interior painting","Quartz and quartzite countertops","Full-home renovation"]},
        {"@type":"WebPage","@id":f"{url}#webpage","url":url,"name":r["title"],
         "description":r["meta"],"about":{"@id":"https://renofy.ca/#business"}},
        {"@type":"FAQPage","@id":f"{url}#faq","mainEntity":faq_entities},
      ]
    }
    breadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":"https://renofy.ca/"},
      {"@type":"ListItem","position":2,"name":"Service Areas","item":"https://renofy.ca/areas.html"},
      {"@type":"ListItem","position":3,"name":r["region"],"item":url}]}
    projects_html = "\n".join(
      f'''      <div class="card reveal"><div class="body">
        <h3>{t}</h3>
        <p>{d}</p>
      </div></div>''' for t,d in r["projects"])
    areas_html = "\n".join(
      f'''      <div class="card reveal"><div class="body">
        <h3>{c}</h3>
        <p>{d}</p>
      </div></div>''' for c,d in r["areas"])
    intro_html = "\n".join(f"    <p class=\"lead\" style=\"max-width:720px\">{p}</p>" for p in r["intro"])
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{htmllib.escape(r['title'])}</title>
<meta name="description" content="{htmllib.escape(r['meta'])}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#0a1414">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Renofy">
<meta property="og:locale" content="en_CA">
<meta property="og:title" content="{htmllib.escape(r['title'])}">
<meta property="og:description" content="{htmllib.escape(r['meta'])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="https://renofy.ca/assets/hero.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{htmllib.escape(r['title'])}">
<meta name="twitter:description" content="{htmllib.escape(r['meta'])}">
<meta name="twitter:image" content="https://renofy.ca/assets/hero.jpg">
<script type="application/ld+json">
{json.dumps(graph, indent=2)}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,500&family=Didact+Gothic&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=21">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png?v=2">
<link rel="apple-touch-icon" href="assets/favicon-180.png?v=2">
{FAQ_STYLE}
<script type="application/ld+json">
{json.dumps(breadcrumb, indent=2)}
</script>
</head>
<body data-page="{r['slug']}">

<div id="site-header"></div>

<!-- ============ PAGE HERO ============ -->
<section class="page-hero">
  <div class="container">
    <span class="kicker">{r['kicker']}</span>
    <h1 class="display">{r['h1']}</h1>
    <p class="lead">{r['lead']}</p>
  </div>
</section>

<!-- ============ INTRO ============ -->
<section>
  <div class="container">
    <div class="grid grid-2" style="align-items:center">
      <div>
{intro_html}
        <p style="margin-top:1.5rem"><a class="more" href="estimate.html">Get an instant estimate &rarr;</a></p>
      </div>
      <picture><source srcset="assets/{r['image']}.webp" type="image/webp"><img src="assets/{r['image']}.jpg" alt="{r['image_alt']}" loading="lazy" style="border-radius:18px"></picture>
    </div>
  </div>
</section>

<!-- ============ POPULAR PROJECTS ============ -->
<section>
  <div class="container">
    <span class="kicker">What {r['region']} asks for</span>
    <h2 class="h2 display">Popular {r['region']} <span class="grad-copper">projects.</span></h2>
    <div class="grid grid-3" style="margin-top:2rem">
{projects_html}
    </div>
  </div>
</section>

<!-- ============ AREAS ============ -->
<section>
  <div class="container">
    <span class="kicker">Neighbourhoods</span>
    <h2 class="h2 display">Where we work in <span class="grad-teal">{r['region']}.</span></h2>
    <div class="grid grid-3" style="margin-top:2rem">
{areas_html}
    </div>
  </div>
</section>

<!-- ============ FAQS ============ -->
<section>
  <div class="container faq-list" style="max-width:860px">
    <span class="kicker">Good to know</span>
    <h2 class="h2 display" style="margin-bottom:2rem">{r['region']} <span class="grad-copper">FAQs.</span></h2>
{chr(10).join(faq_html)}
  </div>
</section>

<!-- ============ CTA BAND ============ -->
<section class="cta-band">
  <div class="container reveal">
    <span class="kicker" style="justify-content:center">Free consults &middot; Fixed quotes</span>
    <h2 class="display">Renovating in {r['region']}? Let&rsquo;s talk.</h2>
    <p class="lead" style="margin:1rem auto 2rem;color:#d6d6de">Tell us about the room you're tired of. We'll bring the ideas, the timeline, and the fixed price.</p>
    <div class="hero-ctas" style="justify-content:center">
      <a href="{PHONE_HREF}" class="btn magnetic">Call (647) 673 3696</a>
      <a href="estimate.html" class="btn btn-ghost magnetic">Instant estimate</a>
    </div>
  </div>
</section>

<div id="site-footer"></div>

<!-- floating widgets -->
<aside id="live-ticker" aria-live="polite">
  <span class="lt-dot"></span><p></p>
  <button class="lt-x" aria-label="Dismiss notification">×</button>
</aside>
<button id="to-top" aria-label="Back to top">&uarr;</button>
<a id="call-fab" href="{PHONE_HREF}" aria-label="Call Renofy now">&#9742;</a>

<script src="assets/js/layout.js?v=3"></script>
<script src="assets/js/main.js?v=3"></script>
</body>
</html>
"""

for r in REGIONS:
    fname = f"{r['slug']}.html"
    with open(fname, "w") as f:
        f.write(build(r))
    print("wrote", fname)

# ---- validate ----
import glob
for fname in [f"{r['slug']}.html" for r in REGIONS]:
    s = open(fname).read()
    assert s.count("<h1") == 1, fname
    for m in re.finditer(r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>', s, re.S):
        json.loads(m.group(1))
    assert len(s) > 8000, fname
print("all 9 pages valid")

# ---- areas.html: point cards at new region pages ----
s = open("areas.html").read()
link_map = [
    ("Durham Region", "durham-region.html", "Explore Durham &rarr;"),
    ("York Region", "york-region.html", "Explore York Region &rarr;"),
    ("Peel Region", "peel-region.html", "Explore Peel &rarr;"),
    ("Halton Region", "halton-region.html", "Explore Halton &rarr;"),
    ("Hamilton Area", "hamilton.html", "Explore Hamilton &rarr;"),
    ("Niagara Region", "niagara-region.html", "Explore Niagara &rarr;"),
    ("Waterloo Region", "waterloo-region.html", "Explore Waterloo Region &rarr;"),
    ("Simcoe County", "barrie.html", "Explore Barrie &rarr;"),
    ("Southwestern Ontario", "london.html", "Explore London &rarr;"),
]
for region_name, new_href, new_text in link_map:
    pat = re.compile(r"(<h3>" + re.escape(region_name) + r"</h3>.*?<a class=\"more\" href=\")[^\"]+(\">)[^<]+(</a>)", re.S)
    s2, n = pat.subn(lambda m: m.group(1) + new_href + m.group(2) + new_text + m.group(3), s, count=1)
    assert n == 1, region_name
    s = s2
open("areas.html", "w").write(s)
print("areas.html links updated")

# ---- sitemap ----
s = open("sitemap.xml").read()
new_urls = "\n".join(
    f'  <url><loc>https://renofy.ca/{r["slug"]}.html</loc><lastmod>2026-09-26</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>'
    for r in REGIONS)
s = s.replace("</urlset>", new_urls + "\n</urlset>")
open("sitemap.xml", "w").write(s)
import xml.dom.minidom
xml.dom.minidom.parse("sitemap.xml")
print("sitemap updated: 20 urls total")
