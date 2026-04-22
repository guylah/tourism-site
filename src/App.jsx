import { useState, useMemo } from "react";

// ─── 12-MONTH DATA ───────────────────────────────────────────────────────────
// Climate logic applied consistently per destination:
// Philippines (Palawan/Manila/Boracay): dry Nov–May, wet Jun–Oct, typhoons Jul–Oct
// Philippines Siargao: inverse — dry May–Oct, typhoons Nov–Jan
// Cambodia: dry Nov–Apr, wet May–Oct
// Nepal: spring Mar–May ✓, monsoon Jun–Sep ✗, autumn Oct–Nov ✓, winter Dec–Feb cold
// Bali Canggu: dry Apr–Oct ✓, wet Nov–Mar ✗
// Vietnam North (Hanoi): wet May–Oct, cool+dry Nov–Apr
// Vietnam Central (Da Nang/Hoi An): dry Feb–Aug ✓, wet Sep–Jan (opposite to north)
// Vietnam South (HCMC): dry Nov–Apr ✓, wet May–Oct
// Vietnam Phu Quoc: dry Nov–May ✓, wet Jun–Oct ✗
// Thailand North: smoky Mar–Apr ✗, green May–Oct, dry Nov–Feb ✓
// Thailand Central/Bangkok: wet May–Oct, cool dry Nov–Feb ✓
// Thailand Gulf (Samui/Phangan/Tao): dry May–Sep ✓ (opposite to Andaman), wet Oct–Jan
// Thailand Andaman (Phuket/Krabi/Phi Phi/Lanta/Lipe/Khao Lak): dry Nov–Apr ✓, wet May–Oct ✗
// Sri Lanka South/West (Mirissa/Weligama/Colombo): dry Dec–Mar ✓, wet May–Sep ✗
// Sri Lanka East (Arugam Bay/Trincomalee): dry Apr–Sep ✓, wet Oct–Jan ✗
// Sri Lanka Hill Country (Ella): relatively sheltered, best Dec–Mar & Jun–Sep
// Sri Lanka Kalpitiya: kitesurfing Jun–Oct ✓
// Japan (Tokyo/Kyoto/Osaka): best Mar–May & Oct–Nov, tsuyu Jun–Jul, hot Aug, cold Jan–Feb
// Japan Hokkaido: best Jun–Sep (cool summer), winter for skiing Dec–Feb
// Japan Okinawa: best Nov–May, typhoons Sep–Oct
// Laos: dry Nov–Apr ✓, wet May–Oct
// India North (Delhi/Agra): best Oct–Mar, extreme heat Apr–Jun, monsoon Jul–Sep
// India Ladakh/Leh: open May–Oct ✓, closed Nov–Apr ✗
// India Kashmir: best Apr–Oct ✓, snow Nov–Mar
// India Hill Stations (Manali/Dharamshala/Shimla): best Apr–Jun & Sep–Oct, monsoon Jul–Aug
// India Parvati Valley/Kasol: best Apr–Jun & Sep–Oct, monsoon Jul–Aug dangerous
// India Goa: dry Nov–Mar ✓, monsoon Jun–Sep ✗
// India South (Kerala/Varkala): wet Jun–Sep SW monsoon, dry Dec–Apr
// India Bangalore/Hampi: moderate monsoon Jun–Sep
// Taiwan Taipei: best Oct–Dec & Mar–Apr, typhoons Jul–Sep, cool/rainy Jan–Feb

const ALL_MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
const MONTH_LABELS = {jan:"Jan",feb:"Feb",mar:"Mar",apr:"Apr",may:"May",jun:"Jun",jul:"Jul",aug:"Aug",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dec"};

const data = [
  // ─── PHILIPPINES — PALAWAN ─────────────────────────────────────────────────
  {
    country:"Philippines", region:"Palawan", place:"El Nido",
    worstTimes:"Aug–Oct (peak typhoon season; island-hopping tours cancelled, flooding common)",
    months:{
      jan:{r:9,d:"Peak dry season. Clear blue skies, calm seas. Island-hopping at its finest. Busy but stunning."},
      feb:{r:10,d:"Best month. Driest, clearest skies, calmest seas. Big Lagoon and Secret Lagoon pristine."},
      mar:{r:9,d:"Still excellent. Very dry and sunny. Slightly warmer. Ideal for all boat tours."},
      apr:{r:8,d:"Hot (34°C+) and dry. Strong sun. Excellent beach and diving conditions before rains."},
      may:{r:6,d:"Transitioning to wet season. Some rain but still diveable. Crowds thin, some deals available."},
      jun:{r:4,d:"Rainy season begins. Boat tours get cancelled on bad days. Lush scenery but unpredictable."},
      jul:{r:3,d:"Heavy rains and rough seas. Island-hopping often suspended. Not ideal for beach goals."},
      aug:{r:2,d:"Wettest month. Typhoon risk high. Most boat tours suspended. Waterfalls roaring but little else."},
      sep:{r:2,d:"Typhoon season continuing. Risky travel conditions. Only for very budget-conscious travelers."},
      oct:{r:5,d:"Rains easing. Island-hopping resuming. Shoulder season bargains. Some typhoon risk remains."},
      nov:{r:7,d:"Dry season begins. Seas calming. Kiteboarding at Sibaltan north of El Nido. Good value."},
      dec:{r:8,d:"Well into dry season. Seas calm. Busy with holiday travelers but conditions excellent."},
    }
  },
  {
    country:"Philippines", region:"Palawan", place:"Coron",
    worstTimes:"Aug–Oct (typhoon season; wreck diving cancelled, visibility poor)",
    months:{
      jan:{r:9,d:"Prime dry season. Crystal-clear wreck diving. Kayangan Lake and Twin Lagoon at their best."},
      feb:{r:10,d:"Best month. Near-zero rain, superb visibility, calm sea. Wreck diving excellent."},
      mar:{r:9,d:"Dry and sunny. Excellent conditions. Slightly warming up but still great for diving."},
      apr:{r:8,d:"Hot and dry. Dive visibility superb. Pre-wet season final peak month."},
      may:{r:6,d:"Shoulder season. Occasional showers. Wreck diving still good, lagoons accessible most days."},
      jun:{r:4,d:"Wet season starts. Rain increases, some dive trips cut short. Budget deals appear."},
      jul:{r:3,d:"Frequent rain. Visibility underwater drops. Rougher conditions. Some operators reduce hours."},
      aug:{r:2,d:"Wettest month. Many trips cancelled. Typhoon risk. Coron very quiet — locals only mostly."},
      sep:{r:2,d:"Still typhoon season. Limited operations. Not recommended unless on a tight budget."},
      oct:{r:5,d:"Season transitioning. Rains decreasing. Wreck diving reopening. Shoulder season values."},
      nov:{r:7,d:"Dry season arriving. Visibility improving week by week. Quiet and good value."},
      dec:{r:8,d:"Full dry season. Excellent diving. Holiday crowds arriving. Book ahead."},
    }
  },
  // ─── PHILIPPINES — CITIES/ISLANDS ──────────────────────────────────────────
  {
    country:"Philippines", region:"Cities/Islands", place:"Manila",
    worstTimes:"Jul–Oct (typhoon season; flooding, transport disruptions frequent)",
    months:{
      jan:{r:8,d:"Dry and cooler (28°C). Comfortable sightseeing. Intramuros and BGC at their most pleasant."},
      feb:{r:9,d:"Best month. Lowest humidity, dry, warm. Chinese New Year festivities add colour."},
      mar:{r:8,d:"Still dry. Warming up. Great for city exploration before peak heat."},
      apr:{r:6,d:"Very hot (36°C+). Humid. Holy Week closures. Best indoors — malls and museums."},
      may:{r:5,d:"Extremely hot and very humid. Pre-monsoon. Afternoon storms start. Best in A/C."},
      jun:{r:4,d:"Rainy season begins. Traffic flooding. Indoor attractions (museums, food scene) still great."},
      jul:{r:3,d:"Peak typhoon risk. Heavy downpours, some days city partially flooded. Travel harder."},
      aug:{r:3,d:"Typhoons most frequent. Major flooding possible. City life continues but disrupted."},
      sep:{r:3,d:"Typhoon season continues. Flooding, cancellations. Not recommended for leisure visits."},
      oct:{r:5,d:"Typhoon risk lowering. Rains easing. City returning to normal. Good hotel deals."},
      nov:{r:7,d:"Dry season returning. Much more comfortable. Festive atmosphere building toward Christmas."},
      dec:{r:8,d:"Christmas season — Manila goes all out. Dry, festive, busy. Book ahead for Christmas events."},
    }
  },
  {
    country:"Philippines", region:"Cities/Islands", place:"Boracay",
    worstTimes:"Jul–Oct (habagat monsoon; White Beach rough waves, red flags frequent)",
    months:{
      jan:{r:9,d:"Dry amihan season. Calm White Beach. Excellent water sports. Peak season crowds and prices."},
      feb:{r:10,d:"Best month. Calmest seas, clearest skies, White Beach pristine. Perfect island holiday."},
      mar:{r:9,d:"Still excellent dry season. Very busy. Paraw sailing beautiful. Sunsets spectacular."},
      apr:{r:8,d:"Hot and dry. Great diving and snorkeling. Windsurfing season starting on northeast side."},
      may:{r:6,d:"Habagat approaching. Some wind and swell. Crowds thinning. West beach getting rougher."},
      jun:{r:4,d:"Southwest monsoon. White Beach waves rough. Kitesurfers arrive. Swimmers less happy."},
      jul:{r:4,d:"Windy and wavy. Great for kitesurfing and surfing (Bulabog Beach). Not for lounging."},
      aug:{r:3,d:"Roughest seas. Typhoon risk. Most beach activities restricted. Very few tourists."},
      sep:{r:3,d:"Typhoon risk continues. Rough conditions. Not recommended for a standard beach holiday."},
      oct:{r:5,d:"Seas calming. Amihan returning. Shoulder season — decent conditions, lower prices."},
      nov:{r:7,d:"Dry season returning. Calmer seas. Kite festival month. Crowds building but still manageable."},
      dec:{r:8,d:"Peak season returning. White Beach at its best. Festive atmosphere. Book early."},
    }
  },
  {
    country:"Philippines", region:"Cities/Islands", place:"Siargao",
    worstTimes:"Nov–Feb (typhoon risk; strong swells overwhelm beginners, some accommodation closes)",
    months:{
      jan:{r:5,d:"Typhoon season winding down. Strong swells at Cloud 9 — experienced surfers only. Quieter."},
      feb:{r:6,d:"Swells moderating. Good for intermediate surfers. Island quiet and relatively uncrowded."},
      mar:{r:7,d:"Surf improving. Island life returning. Lagoon tours and island hopping resuming nicely."},
      apr:{r:8,d:"Excellent conditions. Good surf, calm enough for all levels. Lush and green. Great vibe."},
      may:{r:7,d:"Pre-peak surf season. Waves building at Cloud 9. Green island, great for intermediate surfers."},
      jun:{r:8,d:"Surf season heats up. Consistent swells. Island vibrant, less packed than peak months."},
      jul:{r:8,d:"Prime surf. Cloud 9 firing. Social scene buzzing. Some rain but surfers don't mind."},
      aug:{r:8,d:"Excellent surf continues. Less crowded than other Philippine destinations. Vibrant scene."},
      sep:{r:7,d:"Surf still good. Some rain. Island quieter. Typhoon risk increasing but usually manageable."},
      oct:{r:6,d:"Typhoon risk rising. Swells getting very powerful. Experienced surfers only. Island empties out."},
      nov:{r:5,d:"Typhoon season. Strong unpredictable swells. Many businesses close. Not beginner-friendly."},
      dec:{r:6,d:"Typhoon risk easing late in month. Christmas crowd arrives. Conditions variable."},
    }
  },
  {
    country:"Philippines", region:"Cities/Islands", place:"Bohol",
    worstTimes:"Aug–Oct (typhoon season; outdoor tours cancelled, roads can flood)",
    months:{
      jan:{r:9,d:"Dry season. Chocolate Hills vivid under blue skies. Tarsiers active. Balicasag diving excellent."},
      feb:{r:9,d:"Best weather. Dry and comfortable. Whale shark watching possible. All tours running."},
      mar:{r:9,d:"Excellent conditions. All attractions accessible. Less crowded than peak months."},
      apr:{r:8,d:"Hot and dry. Good diving visibility. Countryside tours comfortable in early morning."},
      may:{r:6,d:"Getting wetter. Chocolate Hills and tarsier tours still run. Fewer tourists, pleasant deals."},
      jun:{r:5,d:"Rain increases. River cruises and countryside tours may be affected. Diving still possible."},
      jul:{r:4,d:"Wet and sometimes stormy. Outdoor adventures less reliable. Budget accommodations available."},
      aug:{r:3,d:"Typhoon risk high. Many tours cancelled. Not recommended for outdoor-focused visits."},
      sep:{r:3,d:"Typhoon season continues. Heavy rain. Best to visit Bohol in another month."},
      oct:{r:5,d:"Rains easing. Typhoon risk dropping. Tours resuming. Shoulder season bargains."},
      nov:{r:7,d:"Dry season returns. All tours running. Quieter and good value before Christmas."},
      dec:{r:8,d:"Good dry season conditions. Festive atmosphere. Holiday crowds but conditions excellent."},
    }
  },
  // ─── CAMBODIA ──────────────────────────────────────────────────────────────
  {
    country:"Cambodia", region:"Cities/Regions", place:"Phnom Penh",
    worstTimes:"Aug–Sep (heaviest monsoon rains; streets flood, heat and humidity peak)",
    months:{
      jan:{r:9,d:"Best month. Cool (25°C), dry, sunny. Riverside promenade lovely. All sights accessible."},
      feb:{r:9,d:"Excellent. Low humidity, comfortable temperatures. Perfect for temples and tuk-tuk rides."},
      mar:{r:8,d:"Warming up (30°C+). Still dry. Good before the heat intensifies in April."},
      apr:{r:6,d:"Very hot (36°C). Khmer New Year — lively but chaotic. Best visited with indoor breaks."},
      may:{r:6,d:"Hot and humid. Rains approaching. Temples still very doable. Fewer tourists, good deals."},
      jun:{r:5,d:"Rains arrive. Streets can flood briefly. River views scenic. Hotels at low prices."},
      jul:{r:5,d:"Frequent afternoon rain. City life continues. Mekong and Tonle Sap begin to swell beautifully."},
      aug:{r:4,d:"Heaviest rains. Flooding possible. Still manageable for city sightseeing but uncomfortable."},
      sep:{r:4,d:"Still very wet. Some flooding. The Water Festival preparations begin. Low tourist numbers."},
      oct:{r:6,d:"Rains easing. Water Festival (Bon Om Touk) — spectacular boat races on the river."},
      nov:{r:8,d:"Dry season returns. Very comfortable. Great for exploring all of the city's attractions."},
      dec:{r:9,d:"Perfect conditions. Cool, dry, sunny. City buzzing with year-end travelers."},
    }
  },
  {
    country:"Cambodia", region:"Cities/Regions", place:"Siem Reap",
    worstTimes:"Aug–Sep (heaviest rain; Angkor Wat paths muddy, some areas flooded)",
    months:{
      jan:{r:9,d:"Ideal. Cool (25°C), dry, blue skies. Angkor Wat moat clear and reflective. Peak season."},
      feb:{r:9,d:"Best month. Comfortable temperatures, near-zero rain. Sunrise over Angkor spectacular."},
      mar:{r:8,d:"Still excellent. Getting hotter. Beat the heat with pre-dawn Angkor visits."},
      apr:{r:6,d:"Very hot (38°C). Khmer New Year closures. Early morning temple visits only recommended."},
      may:{r:6,d:"Heat eases as rains begin. Angkor in early monsoon is lush and atmospheric. Crowds thin."},
      jun:{r:6,d:"Green season. Moats fill, reflections stunning. Rain mostly afternoons. Fewer visitors."},
      jul:{r:6,d:"Angkor surrounded by water lilies — genuinely beautiful. Mud on some paths but worth it."},
      aug:{r:4,d:"Heaviest rains. Paths muddy. Some low-lying temple areas flooded. Dedicated visitors only."},
      sep:{r:4,d:"Still very wet. Tonle Sap Lake at maximum — spectacular scale. Angkor access limited in spots."},
      oct:{r:6,d:"Rains easing. Tonle Sap beautiful. Angkor turning golden. Good shoulder season values."},
      nov:{r:8,d:"Excellent. Dry season starts. Angkor at its most accessible. Photography conditions great."},
      dec:{r:9,d:"Peak season. Perfect weather. Angkor Wat magical at sunrise. Book accommodation early."},
    }
  },
  {
    country:"Cambodia", region:"Cities/Regions", place:"Coastal Areas",
    worstTimes:"Jun–Oct (monsoon; Sihanoukville and Kep beaches rough, many resorts close)",
    months:{
      jan:{r:9,d:"Excellent. Sihanoukville beaches calm, clear sea. Koh Rong and Koh Ta Kiev paradisiac."},
      feb:{r:9,d:"Best month. Dry, calm sea. Koh Rong island at its absolute finest. Snorkeling superb."},
      mar:{r:8,d:"Still dry. Good beach conditions. Slightly warmer. Last great month before heat builds."},
      apr:{r:7,d:"Hot but still mostly dry. Kep crab market lively. Sea still accessible on calmer days."},
      may:{r:5,d:"Monsoon approaching. Sea getting rougher some days. Beach days still possible but variable."},
      jun:{r:3,d:"Monsoon. Rough seas. Many beach restaurants close. Koh Rong ferries often cancelled."},
      jul:{r:3,d:"Heavy rain. Rough seas. Most resorts closed or half-operating. Not a beach trip."},
      aug:{r:3,d:"Wettest month on coast. Islands difficult to access. Only for budget travelers who accept rain."},
      sep:{r:3,d:"Seas still rough and wet. Not recommended for beach-focused travel."},
      oct:{r:5,d:"Rains easing. Islands starting to reopen. Shoulder season with good deals."},
      nov:{r:7,d:"Dry season returns. Islands accessible again. Koh Rong beautiful and less crowded."},
      dec:{r:8,d:"Peak season. Calm seas, great beaches. Busy but excellent conditions all around."},
    }
  },
  // ─── NEPAL ─────────────────────────────────────────────────────────────────
  {
    country:"Nepal", region:"Kathmandu Valley", place:"Kathmandu",
    worstTimes:"Jul–Aug (monsoon; trails muddy, Himalayan views obscured by cloud almost daily)",
    months:{
      jan:{r:6,d:"Cold (3–15°C). Dry and clear. Himalayan views superb. Valley exploration comfortable but chilly."},
      feb:{r:7,d:"Still cold but rhododendrons starting to bloom. Good trekking weather begins. Clear days."},
      mar:{r:8,d:"Excellent spring. Rhododendrons peak bloom. Clear mornings, Himalayas visible. Perfect."},
      apr:{r:9,d:"Best month. Warm, clear, flowers everywhere. Pre-monsoon clarity for mountain views."},
      may:{r:7,d:"Good window before monsoon. Warm (25°C). Some haze but clear mornings. Trekking possible."},
      jun:{r:5,d:"Monsoon begins. Rain daily, leeches on trails, Himalayas often hidden. Culture still fine."},
      jul:{r:4,d:"Full monsoon. Green and atmospheric but mountain views nearly impossible. Culture seekers only."},
      aug:{r:4,d:"Heaviest rains. Trails very muddy. Flights sometimes delayed. Not for trekking."},
      sep:{r:6,d:"Monsoon easing. Views clearing. Good shoulder season — trails drying, mountains appearing."},
      oct:{r:10,d:"Best month (with Apr). Crystal-clear skies, perfect temperature. Everest Base Camp season peak."},
      nov:{r:9,d:"Excellent. Clear and cool. Annapurna Circuit beautiful. Less crowded than October."},
      dec:{r:6,d:"Cold in mountains. Kathmandu Valley comfortable. Himalayan views clear but trails icy higher up."},
    }
  },
  {
    country:"Nepal", region:"Pokhara Region", place:"Pokhara",
    worstTimes:"Jun–Aug (monsoon; Annapurna views hidden, paragliding cancelled on rainy days)",
    months:{
      jan:{r:6,d:"Cold. Clear winter skies give spectacular Machhapuchhre views. Quiet, peaceful Phewa Lake."},
      feb:{r:7,d:"Rhododendrons beginning. Paragliding possible on clear days. Crisp mountain views."},
      mar:{r:8,d:"Spring beauty. Trails blooming, Annapurna views excellent. Paragliding season opens fully."},
      apr:{r:9,d:"Best month. Warm, clear, Annapurna circuit excellent. Paragliding at its finest."},
      may:{r:7,d:"Last good window. Trails accessible. Some cloud building. Paragliding good in mornings."},
      jun:{r:4,d:"Monsoon sets in. Views of Machhapuchhre shrouded. Paragliding hit-or-miss."},
      jul:{r:4,d:"Heavy rain, landslide risk on mountain roads. Peaceful, lush, but views are rare."},
      aug:{r:4,d:"Very wet. High landslide risk. Phewa Lake beautiful and full. Trekking not recommended."},
      sep:{r:6,d:"Monsoon easing late September. Views returning. Lake serene and lush. Good value."},
      oct:{r:10,d:"Peak season. Annapurna panoramas crystal clear. Paragliding excellent. Perfect temperatures."},
      nov:{r:9,d:"Outstanding. Clear skies, cool temperatures, beautiful trails. Less crowded than October."},
      dec:{r:6,d:"Cold but clear. Mountain views excellent. Upper trails icy. City sightseeing comfortable."},
    }
  },
  // ─── INDONESIA ─────────────────────────────────────────────────────────────
  {
    country:"Indonesia", region:"Bali", place:"Canggu",
    worstTimes:"Jan–Feb (wettest months; daily heavy downpours, Batu Bolong Rd floods regularly)",
    months:{
      jan:{r:4,d:"Wettest month. Daily downpours. Surf is good but rain can be relentless. Indoor cafes busy."},
      feb:{r:4,d:"Still very wet. Heavy rain most afternoons. Surf decent. Coworking spaces packed."},
      mar:{r:6,d:"Rain easing. Some clear days emerging. Echo Beach surf improving. Digital nomad scene alive."},
      apr:{r:7,d:"Transitioning to dry season. More sunshine. Surf building. Good shoulder season value."},
      may:{r:8,d:"Dry season arriving. Surf improving at Echo Beach. Cafes and nightlife in full swing."},
      jun:{r:9,d:"Peak dry season. Sunny, low humidity, perfect surf. Vibrant digital nomad scene. Ideal month."},
      jul:{r:9,d:"Best month. Dry, warm, offshore winds perfect for surfing. Lively but for very good reason."},
      aug:{r:9,d:"Continues to be excellent. Sunny days, great surf, social scene at full intensity."},
      sep:{r:8,d:"Still great. Dry season holds. Echo Beach surf consistent. Crowds starting to ease."},
      oct:{r:7,d:"Shoulder season. Some rain returning. Good value, less crowded. Surf still decent."},
      nov:{r:5,d:"Rainy season approaching. Rain increasing. Cafes and indoor scene still vibrant."},
      dec:{r:5,d:"Wet season. Daily rain. Surf okay but muddy roads. Holiday crowd adds some energy."},
    }
  },
  // ─── MALAYSIA ──────────────────────────────────────────────────────────────
  {
    country:"Malaysia", region:"General", place:"Malaysia (General)",
    worstTimes:"Oct–Jan on East Coast (northeast monsoon); May–Sep haze risk from Indonesian fires",
    months:{
      jan:{r:6,d:"KL fine (dry). East Coast (Perhentian) monsoon — avoid those. Langkawi good. Cameron Highlands lovely."},
      feb:{r:7,d:"Generally good across west coast. Penang food scene vibrant. Langkawi dry and accessible."},
      mar:{r:8,d:"Excellent for most of Malaysia. Langkawi festival season. Penang and KL very pleasant."},
      apr:{r:8,d:"Good weather broadly. Perhentian and Tioman islands begin to open after northeast monsoon."},
      may:{r:7,d:"East Coast opening up. Perhentian Islands post-monsoon — clearest turquoise water. KL rainy but fine."},
      jun:{r:7,d:"East Coast peak. Perhentian and Tioman superb. West Coast (Langkawi) can be wetter."},
      jul:{r:7,d:"East Coast excellent — diving, snorkeling at Tioman and Perhentian. Haze risk some years."},
      aug:{r:7,d:"East Coast still good. Haze can affect visibility some years. Kuala Lumpur indoor culture great."},
      sep:{r:6,d:"Haze risk increases from Indonesian fires. East Coast winding down. KL festivals often in Sep."},
      oct:{r:5,d:"East Coast monsoon begins. Perhentian and Tioman close. West Coast (Langkawi) improving."},
      nov:{r:6,d:"East Coast closed. West coast and KL improving. Good time for Penang and Langkawi."},
      dec:{r:7,d:"West coast and KL excellent. East Coast monsoon (avoid). Christmas and New Year festive."},
    }
  },
  // ─── VIETNAM — NORTH ───────────────────────────────────────────────────────
  {
    country:"Vietnam", region:"North", place:"Hanoi",
    worstTimes:"Jul–Aug (hottest and rainiest; 38°C with very high humidity, heavy daily storms)",
    months:{
      jan:{r:6,d:"Cool (15–18°C) and sometimes misty. Dry. Atmospheric Old Quarter. Wrap up warm for mornings."},
      feb:{r:7,d:"Cooler but usually drier than Jan. Tet (Lunar New Year) — magical if you catch it, chaotic otherwise."},
      mar:{r:8,d:"Warming up (20-25°C). Clear days. Excellent for sightseeing. Comfortable and lively."},
      apr:{r:9,d:"Best month. Warm (28°C), mostly dry, clear skies. Perfect for exploring all of the city."},
      may:{r:7,d:"Getting hot and humid, rains beginning. Still very functional. Street food scene excellent."},
      jun:{r:5,d:"Hot and rainy. Afternoon downpours. Old Quarter charming despite heat. Indoor museums good."},
      jul:{r:5,d:"Peak heat and rain. 38°C and humid. Uncomfortable but Old Quarter and food scene still excellent."},
      aug:{r:4,d:"Heaviest rains. Flooding in some areas. Very hot. Best for indoor Hanoi experiences."},
      sep:{r:7,d:"Rains easing. Temperatures dropping. Excellent clear days return. One of the better months."},
      oct:{r:9,d:"Outstanding. Cool (22–25°C), dry, clear skies. Hoan Kiem Lake stunning. Best autumn month."},
      nov:{r:8,d:"Excellent. Cool and crisp. Very comfortable for sightseeing. Pre-peak season prices."},
      dec:{r:6,d:"Cool to cold (12–18°C). Misty some days. Dry mostly. Cozy street food and hot pho season."},
    }
  },
  {
    country:"Vietnam", region:"North", place:"Sapa",
    worstTimes:"Jan–Feb (coldest; can drop below 0°C, heavy mist obscures rice terraces for days)",
    months:{
      jan:{r:4,d:"Very cold (0–5°C). Frequent dense fog. Rice terraces invisible some days. Rare snow on high peaks."},
      feb:{r:5,d:"Still cold. Tet holiday brings local color. Fog persistent. Layering essential."},
      mar:{r:6,d:"Warming slightly. Fog reducing. Spring flowers beginning on terraces. More pleasant trekking."},
      apr:{r:8,d:"Beautiful. Rhododendrons blooming, terraces being ploughed. Clear mornings. Excellent trekking."},
      may:{r:7,d:"Rice being planted — vivid green fields. Some rain. Misty mornings add drama. Great scenery."},
      jun:{r:6,d:"Lush terraces, waterfalls flowing. More rain and clouds but scenery breathtaking. Leeches on trails."},
      jul:{r:6,d:"Terraces bright green and dramatic. Rain and fog frequent but landscape at its most photogenic."},
      aug:{r:6,d:"Still lush and green. Heavy rain possible. Terraces brilliant but trail footing can be tricky."},
      sep:{r:8,d:"Terraces turn gold as harvest approaches. One of the most photographed sights. Rain easing."},
      oct:{r:9,d:"Best month. Golden rice harvest. Crystal-clear views of Fansipan. Trekking outstanding."},
      nov:{r:7,d:"Post-harvest. Cooler. Misty days increasing. Still good trekking window before winter cold."},
      dec:{r:4,d:"Cold and foggy. Views restricted. H'mong markets add colour. Not for trekking."},
    }
  },
  {
    country:"Vietnam", region:"North", place:"Cat Ba",
    worstTimes:"Nov–Mar (cold and grey; Halong Bay boat trips cold and misty, limited visibility)",
    months:{
      jan:{r:4,d:"Cold (15°C) and misty. Halong Bay boat trips possible but grey skies and rough seas common."},
      feb:{r:4,d:"Still cold, often drizzly. Halong Bay atmospheric in mist but not the trip of your dreams."},
      mar:{r:6,d:"Warming up. Haze reducing. Halong Bay clearing. Cat Ba climbing wall accessible."},
      apr:{r:8,d:"Excellent. Clear water, blue skies, warm enough to kayak. Climbing and island hopping superb."},
      may:{r:8,d:"Perfect — warm, clear waters, Halong Bay at its best before peak crowds. Kayaking ideal."},
      jun:{r:7,d:"Warm and mostly fine. Occasional rain but Halong Bay limestone scenery stunning."},
      jul:{r:6,d:"Hot and humid. Occasional tropical storms. Peak summer for Vietnamese tourists — gets crowded."},
      aug:{r:6,d:"Still warm but typhoon risk in Gulf of Tonkin. Some boat trips cancelled on bad weather days."},
      sep:{r:7,d:"Crowds easing. Weather generally fine with typhoon risk. Autumn light beautiful on the bay."},
      oct:{r:8,d:"Excellent. Clear skies, cooler temperatures, beautiful autumn light over the limestone karsts."},
      nov:{r:5,d:"Getting colder and greyer. Boat trips still run but conditions less comfortable."},
      dec:{r:4,d:"Cold and misty. Not ideal for Halong Bay. Can be atmospheric for photography."},
    }
  },
  {
    country:"Vietnam", region:"North", place:"Tam Coc",
    worstTimes:"Oct–Nov (seasonal flooding; caves inaccessible, rice fields underwater)",
    months:{
      jan:{r:6,d:"Cool and dry. Rice fields golden from recent harvest. Boat rides through karsts peaceful."},
      feb:{r:7,d:"Scenic and comfortable. Tet decorations in villages add colour. Terraces being prepared."},
      mar:{r:8,d:"Excellent. Warm, clear, terraces green and being planted. Fewer crowds than peak."},
      apr:{r:8,d:"Beautiful. Green rice fields growing. Karst scenery vivid under blue skies. Great photography."},
      may:{r:7,d:"Golden rice fields being harvested in some areas. River boat rides through karsts magical."},
      jun:{r:6,d:"Lush and green. Some flooding of lower caves. Still very scenic but busier with locals."},
      jul:{r:5,d:"Peak domestic season. Hot, sometimes flooded channels. More noise and boat traffic."},
      aug:{r:5,d:"Very hot and wet. River channels high. Some areas flooded. Early morning visits recommended."},
      sep:{r:5,d:"Still very wet. Cave entrances may be flooded. Golden rice beginning to appear late month."},
      oct:{r:6,d:"Rice golden but flooding risk high. Dramatic scenery but some access limitations."},
      nov:{r:7,d:"Flood waters receding. Fields post-harvest. Good clear weather returning. Pleasant visits."},
      dec:{r:7,d:"Cool and mostly dry. Peaceful. Karst scenery vivid in winter light. Great photography."},
    }
  },
  {
    country:"Vietnam", region:"North", place:"Mai Chau",
    worstTimes:"Jul–Aug (heavy monsoon; hiking trails very slippery, valley roads can flood)",
    months:{
      jan:{r:6,d:"Cool (10–15°C). Dry. Stilt house stays cozy. Valley scenic with quiet, misty mornings."},
      feb:{r:7,d:"Warming slightly. Tet celebrations in village add cultural colour. Good cycling weather."},
      mar:{r:8,d:"Excellent. Valley gorgeous, cycling and trekking pleasant. Homestays cozy. Good trekking."},
      apr:{r:9,d:"Best month. Valley lush, rice paddies brilliant green. Perfect temperature for cycling."},
      may:{r:7,d:"Valley gorgeous and green. Cycling and trekking pleasant. Light rain occasionally."},
      jun:{r:6,d:"Very lush. Rice growing strongly. Rain most afternoons. Stilt house stays lovely."},
      jul:{r:5,d:"Wet and muddy in parts. Trekking limited. Valley scenery in monsoon remarkably beautiful."},
      aug:{r:5,d:"Heavy rain. Roads muddy. Valley a vivid green but trails difficult. Quiet and peaceful."},
      sep:{r:7,d:"Rains easing. Rice harvest approaching. Valley turns gold. One of the prettiest months."},
      oct:{r:8,d:"Golden rice harvest. Valley spectacular. Cool and clear. Outstanding cycling and trekking."},
      nov:{r:7,d:"Post-harvest valley. Cool and dry. Terraces being prepared. Very peaceful and photogenic."},
      dec:{r:6,d:"Cold. Dry. Valley misty in mornings. Homestays warm and welcoming. Cultural visits good."},
    }
  },
  // ─── VIETNAM — CENTRAL ─────────────────────────────────────────────────────
  {
    country:"Vietnam", region:"Central", place:"Da Nang",
    worstTimes:"Oct–Nov (typhoon season; heavy rain, flooding, dangerous beach conditions)",
    months:{
      jan:{r:6,d:"Cooler (22°C) and can be cloudy. Some rain. Ba Na Hills and city exploration still fine."},
      feb:{r:7,d:"Improving. Warming up. My Khe Beach starting to be enjoyable. Less rain than Jan."},
      mar:{r:9,d:"Excellent. Warm and dry. Beach perfect. Dragon Bridge shows at weekend. Very pleasant."},
      apr:{r:9,d:"Outstanding. Sunny, warm (30°C). Beach season in full swing. Clear water. Great diving."},
      may:{r:8,d:"Hot and sunny — perfect beach weather. My Khe beach buzzing. Low crowds vs summer."},
      jun:{r:8,d:"Peak beach season. Sea warm and calm. Festivals in city. Hot (32°C) but sea breezes help."},
      jul:{r:7,d:"Hottest month. Excellent beach conditions. Dragon Bridge fire shows popular. Crowded but festive."},
      aug:{r:7,d:"Still hot and dry. Beach great. Typhoon risk beginning but usually fine. Vibrant summer vibe."},
      sep:{r:5,d:"Typhoon risk increasing. Some rain. Beach conditions deteriorating. Watch weather forecasts."},
      oct:{r:3,d:"Typhoon season peak. Heavy flooding risk. Not recommended. Many businesses close."},
      nov:{r:4,d:"Still rainy and stormy. Flooding possible. City coming back to life late month."},
      dec:{r:6,d:"Rain easing. Cooler. Improving steadily. Good shoulder season — restaurants and cafes open."},
    }
  },
  {
    country:"Vietnam", region:"Central", place:"Hoi An",
    worstTimes:"Oct–Nov (flood season; Ancient Town regularly knee-deep in water during typhoons)",
    months:{
      jan:{r:6,d:"Cooler, sometimes grey. Some rain. Ancient Town atmospheric and less crowded than peak."},
      feb:{r:7,d:"Improving. Warming. Lantern Festival (Full Moon) magical. Good overall conditions."},
      mar:{r:9,d:"Excellent. Warm, dry. Ancient Town beautiful with spring flowers. An Bang Beach opening."},
      apr:{r:9,d:"Outstanding. Sunny, warm. An Bang Beach superb. Tailoring shops busy. Perfect conditions."},
      may:{r:8,d:"Warm, dry, beautiful. Lanterns glowing, beach excellent. Great for cycling and tailoring."},
      jun:{r:8,d:"Sunny and lively. Beach perfect. Ancient Town shimmering in summer light. Highly recommended."},
      jul:{r:7,d:"Very hot and occasionally heavy rain, but mostly fine. Vibrant atmosphere and great food."},
      aug:{r:7,d:"Hot with some storms. Beach mostly fine. Typhoon risk building but usually still good."},
      sep:{r:5,d:"Typhoon risk high. Rain increasing. Ancient Town can flood. Keep flexible plans."},
      oct:{r:3,d:"Flood season. Ancient Town regularly under water. Not recommended at all."},
      nov:{r:4,d:"Still wet and stormy. Flooding possible. Town starting to recover late in month."},
      dec:{r:7,d:"Rain mostly over. Cooler. Town very atmospheric for Christmas. Good value."},
    }
  },
  {
    country:"Vietnam", region:"Central", place:"Phong Nha",
    worstTimes:"Oct–Nov (cave flooding; Son Doong and other caves access restricted, rivers dangerous)",
    months:{
      jan:{r:6,d:"Cool and sometimes rainy. Caves accessible. Jungle treks limited. Quiet and peaceful."},
      feb:{r:7,d:"Improving. Caves fully open. Paradise Cave and Dark Cave excellent year-round options."},
      mar:{r:8,d:"Good conditions. Caves at their best. Jungle trekking comfortable. Fewer tourists."},
      apr:{r:8,d:"Excellent. Son Doong trekking season in full swing. Hang En accessible. Hot but manageable."},
      may:{r:8,d:"Ideal cave conditions. Son Doong and Hang En treks available. Lush jungle, manageable heat."},
      jun:{r:7,d:"Still accessible and green. Some cave tours restrict deeper sections. Hot but spectacular."},
      jul:{r:7,d:"Cave temperatures constant cool. Outdoor jungle areas hot. Good visiting window."},
      aug:{r:6,d:"Hot and humid. Some rain. Caves still excellent as temperature-regulated escapes."},
      sep:{r:5,d:"Rain increasing. River levels rising. Some cave sections restricted. Check ahead."},
      oct:{r:3,d:"Flood season. Many cave areas closed. Rivers dangerous. Do not attempt Hang En or Son Doong."},
      nov:{r:3,d:"Still very wet. Major flood risk. Caves largely closed. Not recommended."},
      dec:{r:6,d:"Rain easing. Caves reopening. Jungle drying out. Good shoulder season window."},
    }
  },
  // ─── VIETNAM — SOUTH ───────────────────────────────────────────────────────
  {
    country:"Vietnam", region:"South", place:"Ho Chi Minh City",
    worstTimes:"Sep–Oct (heaviest rain; flash flooding common, streets inundated in parts of city)",
    months:{
      jan:{r:9,d:"Best time. Dry (28°C), low humidity. War Remnants Museum, Ben Thanh Market perfect. Very pleasant."},
      feb:{r:9,d:"Excellent. Tet (Lunar New Year) — extraordinary cultural moment but some closures."},
      mar:{r:8,d:"Still dry and comfortable. Hottest months approaching but great sightseeing weather."},
      apr:{r:7,d:"Getting very hot (35°C). Dry. Pre-rain. Mekong Delta day trips in lush condition."},
      may:{r:6,d:"Rainy season starts. Hot (34°C). Showers mostly afternoon — mornings fine for sightseeing."},
      jun:{r:6,d:"Regular rain. Street food, museums and nightlife flourish. City vibrant rain or shine."},
      jul:{r:6,d:"Wet but vibrant. Great food and café culture makes any weather bearable. Good deals."},
      aug:{r:5,d:"Heavy rains. Some flooding. But HCMC's covered markets, rooftop bars and food halls thrive."},
      sep:{r:4,d:"Heaviest rains and flooding. Some street areas impassable. Indoor HCMC still excellent."},
      oct:{r:5,d:"Rain easing. Flooding reducing. City bouncing back. Good shoulder season deals."},
      nov:{r:8,d:"Dry season returning. Very comfortable. City lively and photogenic in clear conditions."},
      dec:{r:9,d:"Excellent. Cool and dry. Festive season very lively. Best month alongside January."},
    }
  },
  {
    country:"Vietnam", region:"South", place:"Da Lat",
    worstTimes:"Aug–Oct (heaviest rain; waterfalls flood trails, roads slippery, mist constant)",
    months:{
      jan:{r:8,d:"Cool (15°C) and mostly dry. Flower gardens blooming. A refreshing highland retreat."},
      feb:{r:8,d:"Excellent. Cool and clear. Cherry blossoms and hydrangeas in season. Very scenic."},
      mar:{r:8,d:"Very good. Warming slightly. Comfortable hiking. Valley in bloom. Cafes bustling."},
      apr:{r:8,d:"Good. Warm days (22°C), cool nights. Lang Biang hike rewarding. Strawberry farms open."},
      may:{r:7,d:"Cool (18–22°C), refreshing escape from southern heat. Flower gardens blooming. Some afternoon rain."},
      jun:{r:6,d:"Rainy season in effect. Misty and cool. Coffee shops and cozy stays make it atmospheric."},
      jul:{r:6,d:"Frequent rain. Waterfalls spectacular. Pine forests feel moody and romantic in mist."},
      aug:{r:5,d:"Heavy rain. Waterfalls full and powerful. Trails slippery. More of an indoor/cultural visit."},
      sep:{r:5,d:"Still wet. Mist thick most mornings. Waterfalls impressive but outdoor treks difficult."},
      oct:{r:6,d:"Rain easing. Flowers returning. Crisp air and clearer skies. Good shoulder month."},
      nov:{r:8,d:"Excellent. Dry and cool. Flower festival often in November. One of the best months."},
      dec:{r:8,d:"Cool and dry. Hydrangeas in bloom. Christmas atmosphere in the hill town is charming."},
    }
  },
  {
    country:"Vietnam", region:"South", place:"Phu Quoc",
    worstTimes:"Jun–Oct (southwest monsoon; beaches rough, sea murky, snorkeling/diving cancelled)",
    months:{
      jan:{r:9,d:"Best month. Dry, calm sea, stunning beaches. Snorkeling at Coral Garden excellent."},
      feb:{r:9,d:"Excellent. Clear water, low humidity, beautiful beaches. Long Beach and Sao Beach superb."},
      mar:{r:9,d:"Outstanding. Last peak months. Sea still calm and clear. Best diving conditions."},
      apr:{r:7,d:"Still good but getting hotter. Snorkeling still fine. Rain beginning to pick up late month."},
      may:{r:5,d:"Monsoon approaching. Last weeks of reasonable weather. Some beach days still OK. Prices drop."},
      jun:{r:3,d:"Monsoon in full effect. West beaches rough. Sea murky. Most snorkel/dive tours cancelled."},
      jul:{r:3,d:"Worst month. Rough seas, heavy rain. Island largely deserted by tourists. Not recommended."},
      aug:{r:3,d:"Full monsoon continues. Very rough seas. Island quiet. Not a beach destination this month."},
      sep:{r:4,d:"Monsoon easing slightly but still very wet and rough. Only for budget-seeking adventurers."},
      oct:{r:5,d:"Rain reducing. Sea calming. Shoulder season — some beach days and good deals."},
      nov:{r:7,d:"Dry season returning. Sea clearing up. Beach life resuming. Good pre-peak value."},
      dec:{r:8,d:"Excellent. Calm seas, clear water. Festive season brings energy. Great month to visit."},
    }
  },
  // ─── THAILAND — NORTH ──────────────────────────────────────────────────────
  {
    country:"Thailand", region:"North", place:"Chiang Mai",
    worstTimes:"Mar–Apr (smoke/haze season; burning fields create dangerous AQI — health risk)",
    months:{
      jan:{r:8,d:"Cool (15–25°C) and dry. Clear skies. Temples, night markets and trekking excellent."},
      feb:{r:8,d:"Still lovely and cool. Flower festival in February. Great visibility and comfortable hiking."},
      mar:{r:4,d:"Smoke season begins. Air quality often dangerously poor (AQI 200+). Not recommended."},
      apr:{r:4,d:"Worst smoke month early April. Songkran water festival mid-April — fun but chaotic."},
      may:{r:7,d:"Smoke season over, first rains wash air clean. Lush greenery. Temples beautiful."},
      jun:{r:7,d:"Rainy season, but mostly afternoon/evening rain. Moat fills up. Doi Inthanon lush and cool."},
      jul:{r:7,d:"Green and atmospheric. Trekking great, waterfalls full. Very pleasant despite rain."},
      aug:{r:7,d:"Lush countryside. Waterfalls roaring. Fewer tourists. Good food and elephant sanctuary season."},
      sep:{r:7,d:"Still green. Rain easing. Countryside beautiful. Good value. Wats beautiful in mist."},
      oct:{r:8,d:"Excellent. Rains mostly over. Lantern festival (Yi Peng) often in October/November — magical."},
      nov:{r:9,d:"Outstanding. Yi Peng lantern festival. Cool, clear, vivid. Best month of the year arguably."},
      dec:{r:8,d:"Cool (10–20°C nights). Dry and clear. Christmas atmosphere in Night Bazaar. Excellent."},
    }
  },
  {
    country:"Thailand", region:"North", place:"Chiang Rai",
    worstTimes:"Mar–Apr (smoke/haze season; burning practices create poor air quality)",
    months:{
      jan:{r:8,d:"Cool and dry. White Temple in clear winter light stunning. Peaceful and uncrowded."},
      feb:{r:8,d:"Still cool and lovely. Blue Temple vivid. Flower field at Singha Park in bloom."},
      mar:{r:4,d:"Smoke season. Air quality deteriorating. Not recommended for outdoor activities."},
      apr:{r:4,d:"Air still poor early month. Improves after rains begin. Golden Triangle best early morning."},
      may:{r:7,d:"Air cleared. White and Blue Temples vivid in green season light. Refreshing temperatures."},
      jun:{r:7,d:"Lush hills, rice paddies bright green. Golden Triangle boat trips pleasant."},
      jul:{r:7,d:"Beautiful countryside. Some roads muddy. Cultural sites excellent year-round."},
      aug:{r:7,d:"Green and atmospheric. Rice growing strongly. Fewer crowds. Pleasant temperatures."},
      sep:{r:7,d:"Still lush. Rain easing. Very photogenic. Tea plantations in hills beautiful."},
      oct:{r:8,d:"Excellent. Cool and clear. Doi Mae Salong tea country beautiful. Very pleasant."},
      nov:{r:9,d:"Best month. Cool, clear, vivid. White Temple in superb condition. Countryside golden."},
      dec:{r:8,d:"Cool and dry. Hill tribe markets festive. Beautiful clear days at Doi Tung."},
    }
  },
  {
    country:"Thailand", region:"North", place:"Pai",
    worstTimes:"Mar–Apr (smoke season from burning practices; valley hazy and unhealthy)",
    months:{
      jan:{r:8,d:"Very cool at night (10°C). Dry and clear. Pai canyon and waterfalls beautiful. Bohemian vibe."},
      feb:{r:8,d:"Still cool. Clear days. Strawberry season. Waterfall hikes pleasant. Quiet and charming."},
      mar:{r:4,d:"Smoke starting in valley. Air quality worsening. Canyon views obscured by haze."},
      apr:{r:4,d:"Smoke peaks early month. Improves as rains start. Not recommended for outdoor lovers."},
      may:{r:7,d:"Air clean. Valley blooms. Canyon and waterfall hikes superb. Bohemian crowd returns."},
      jun:{r:7,d:"Green season charm. Waterfalls roaring. Quiet roads. Hippie town vibe without crowds."},
      jul:{r:7,d:"Lush valley. Mae Yen waterfall impressive. Some road flooding near canyon. Great value."},
      aug:{r:7,d:"Very green. Waterfalls at peak power. Atmospheric. Quiet and peaceful."},
      sep:{r:7,d:"Rain easing. Valley still lush. Winding mountain road beautiful in clear conditions."},
      oct:{r:8,d:"Excellent. Post-rain. Valley green and clear. Canyon views outstanding. Good value."},
      nov:{r:9,d:"Best month. Cool nights, sunny days. Canyon spectacular. Least crowded comfortable period."},
      dec:{r:8,d:"Cool (10–15°C nights), clear days. Misty mornings in valley. Wonderful atmosphere."},
    }
  },
  // ─── THAILAND — CENTRAL ────────────────────────────────────────────────────
  {
    country:"Thailand", region:"Central", place:"Bangkok",
    worstTimes:"Sep–Oct (heaviest rain and flooding; some districts severely inundated)",
    months:{
      jan:{r:9,d:"Best month. Cool (26°C), dry, low humidity. Temples, markets and rooftops superb."},
      feb:{r:9,d:"Excellent. Still cool and dry. Chinese New Year festivities in Chinatown. Great all round."},
      mar:{r:8,d:"Warming up. Still dry. Good for all sightseeing before heat arrives."},
      apr:{r:7,d:"Very hot (38°C). Songkran water festival — extremely fun or chaotic depending on preference."},
      may:{r:6,d:"Hot and humid, rain starting. Temples and markets still ideal. A/C essential."},
      jun:{r:6,d:"Rainy season. Afternoon showers common. City life active. Good hotel deals."},
      jul:{r:6,d:"Wet but manageable. Street food, malls and nightlife unaffected. Khao San buzzing."},
      aug:{r:5,d:"Heavy rain. Some flooding in low-lying areas. Indoor Bangkok (museums, malls) still great."},
      sep:{r:4,d:"Heaviest rain. Flooding in some districts. Not ideal but city mostly functional."},
      oct:{r:5,d:"Rain easing. Flooding reducing. Loy Krathong festival often in October — beautiful."},
      nov:{r:8,d:"Dry season returns. Excellent weather. Temples vivid. Loy Krathong if not in October."},
      dec:{r:9,d:"Perfect. Cool and dry. Festive Christmas and New Year energy. Best alongside January."},
    }
  },
  {
    country:"Thailand", region:"Central", place:"Kanchanaburi",
    worstTimes:"Aug–Sep (river flooding; Erawan waterfall closed, Bridge over River Kwai surrounded by water)",
    months:{
      jan:{r:9,d:"Cool and dry. Bridge over River Kwai peaceful. Erawan Falls at low but beautiful levels."},
      feb:{r:9,d:"Excellent. Clear skies, comfortable walking. WWII historical sites atmospheric."},
      mar:{r:8,d:"Warming up. Still dry. River calm. Erawan emerald pools very clear."},
      apr:{r:7,d:"Very hot. Erawan Falls good for cooling off. Best in early morning. Quieter than Bangkok."},
      may:{r:7,d:"Waterfalls beginning to fill. Death Railway atmospheric. Cooler than Bangkok. River rising."},
      jun:{r:6,d:"Erawan's pools green and beautiful. River rising. Some trail closures. Worth visiting early."},
      jul:{r:5,d:"Erawan often closes trails due to flooding. River tours restricted. Historical sites still great."},
      aug:{r:3,d:"Heaviest rain. Erawan fully flooded and closed. River very high. Not recommended."},
      sep:{r:3,d:"Still very wet and flooded. Erawan closed. Bridge area surrounded by water. Avoid."},
      oct:{r:6,d:"Rains easing. Erawan reopening. River calming. Good late-season visit."},
      nov:{r:8,d:"Dry season returns. Erawan waterfalls beautiful and accessible. Excellent conditions."},
      dec:{r:9,d:"Perfect. Cool and clear. All sites accessible. A lovely escape from Bangkok."},
    }
  },
  // ─── THAILAND — SOUTH GULF ─────────────────────────────────────────────────
  {
    country:"Thailand", region:"South (Gulf)", place:"Koh Samui",
    worstTimes:"Oct–Dec (Gulf coast monsoon; Samui gets its rain when Andaman is dry — heavy rain)",
    months:{
      jan:{r:7,d:"Gulf monsoon easing. Some rain still. Improving steadily through the month. Good value."},
      feb:{r:8,d:"Excellent conditions returning. Dry and sunny. Angthong Marine Park trips recommencing."},
      mar:{r:9,d:"Superb. Dry, sunny, warm. Chaweng Beach at its best. All water sports running."},
      apr:{r:9,d:"Outstanding. Hottest and driest month. Sea clear, beaches perfect. Lively scene."},
      may:{r:8,d:"Beautiful weather — dry and sunny while Andaman gets wet. Beaches calm, water crystal clear."},
      jun:{r:8,d:"Excellent conditions. Angthong Marine Park day trips ideal. Chaweng Beach vibrant."},
      jul:{r:8,d:"One of the best months. Sunny, calm seas, lively beach scene. Great snorkeling."},
      aug:{r:8,d:"Continues excellent. Dry side of Gulf. Beaches and diving superb. Less crowded than Apr."},
      sep:{r:7,d:"Still good. Some rain beginning late September. Sea remains calm and clear mostly."},
      oct:{r:4,d:"Gulf monsoon arrives. Heavy rain. Rough seas. Not a beach holiday. Waterfalls beautiful."},
      nov:{r:3,d:"Wettest month on Samui. Major flooding possible. Most beach activities suspended."},
      dec:{r:5,d:"Rain easing but still significant. Improving late December. Check forecasts carefully."},
    }
  },
  {
    country:"Thailand", region:"South (Gulf)", place:"Koh Phangan",
    worstTimes:"Oct–Dec (Gulf monsoon; flooding, rough seas, Full Moon Party still runs but accommodation can flood)",
    months:{
      jan:{r:7,d:"Gulf monsoon easing. Improving through month. Haad Rin quieter and good value."},
      feb:{r:8,d:"Good conditions. Full Moon Party month (timing varies). Northern beaches clearing."},
      mar:{r:9,d:"Excellent. Dry and sunny. Thong Nai Pan beaches superb. Snorkeling outstanding."},
      apr:{r:9,d:"Outstanding. Bottle Beach pristine. Full Moon Party very lively. Best beach conditions."},
      may:{r:8,d:"Dry and sunny. Full Moon Party month. Haad Rin Beach lively. Northern beaches pristine."},
      jun:{r:8,d:"Great beach weather. Thong Nai Pan beautiful. Snorkeling off Bottle Beach excellent."},
      jul:{r:8,d:"Peak Gulf season. Sunshine, warm water. Party scene and wellness retreats thriving."},
      aug:{r:8,d:"Continues excellent. Clear water, great beaches. Yoga retreats and Full Moon Party both great."},
      sep:{r:7,d:"Still good. Rain building late month. Good shoulder season deals. Less crowded."},
      oct:{r:3,d:"Gulf monsoon. Heavy rain, rough seas. Not for beach holidays. Island beautiful but wet."},
      nov:{r:3,d:"Wettest month. Very heavy rain. Major flooding possible. Avoid for beach trips."},
      dec:{r:5,d:"Rain easing. Improving late month. Christmas period picks up but early December risky."},
    }
  },
  {
    country:"Thailand", region:"South (Gulf)", place:"Koh Tao",
    worstTimes:"Oct–Dec (Gulf monsoon; dive visibility drops, seas rough, some dive schools close)",
    months:{
      jan:{r:7,d:"Gulf monsoon easing. Visibility improving. Dive courses resuming. Good shoulder value."},
      feb:{r:8,d:"Good diving returning. Shark Bay clearing. Warmer water and improving conditions."},
      mar:{r:9,d:"Excellent. Visibility great. Whale sharks occasionally spotted. All dive sites open."},
      apr:{r:9,d:"Outstanding diving. Chumphon Pinnacle spectacular. Crystal clear water. Best conditions."},
      may:{r:8,d:"Dry season on Gulf. Visibility underwater excellent. Best diving of the year begins."},
      jun:{r:9,d:"Prime dive conditions. Whale sharks occasionally spotted. Water warm and clear."},
      jul:{r:9,d:"Exceptional diving. Shark Bay, Sail Rock and Chumphon Pinnacle at their best."},
      aug:{r:9,d:"World-class diving continues. Whale sharks possible. Clear water, great visibility."},
      sep:{r:7,d:"Still good diving. Some rain beginning. Visibility slightly reduced but still excellent."},
      oct:{r:3,d:"Gulf monsoon. Rough seas. Dive boats often cancelled. Many dive schools close."},
      nov:{r:3,d:"Worst month. Very rough seas, very limited diving. Island very quiet."},
      dec:{r:5,d:"Slowly improving. Dive sites reopening. Christmas period picks up. Worth checking conditions."},
    }
  },
  // ─── THAILAND — SOUTH ANDAMAN ──────────────────────────────────────────────
  {
    country:"Thailand", region:"South (Andaman)", place:"Phuket",
    worstTimes:"May–Oct (Andaman southwest monsoon; beaches rough with red flags, rip currents dangerous)",
    months:{
      jan:{r:10,d:"Best month. Zero rain, calm seas. Patong, Karon and Kata beaches perfect. Peak season."},
      feb:{r:10,d:"Outstanding. Driest month. Crystal clear water. Similan Islands day trips superb."},
      mar:{r:9,d:"Excellent. Still very dry. Warm (33°C). Phi Phi and Similan Islands both accessible."},
      apr:{r:8,d:"Hot (34°C). Still mostly dry. Songkran water festival. Some pre-monsoon clouds building."},
      may:{r:4,d:"Monsoon begins. Patong and Kata get rough swells. Red flags frequent. Similan Islands close."},
      jun:{r:3,d:"Full monsoon. Dangerous swimming. Many beach clubs close or reduce operations."},
      jul:{r:3,d:"Roughest seas. Waves impressive but swimming banned at most beaches. Bargain rates."},
      aug:{r:3,d:"Monsoon continues. Rough seas, heavy rain most days. Inland activities only recommended."},
      sep:{r:3,d:"Wettest month. Intense rain. Beaches dangerous. Not a beach holiday."},
      oct:{r:5,d:"Rain easing from mid-month. Similan Islands reopen. Seas calming. Shoulder season deals."},
      nov:{r:8,d:"High season returns. Seas calm, beaches accessible. Crowds building. Great conditions."},
      dec:{r:9,d:"Excellent. Peak season begins fully. Dry, sunny, calm seas. Book well ahead."},
    }
  },
  {
    country:"Thailand", region:"South (Andaman)", place:"Krabi",
    worstTimes:"May–Oct (Andaman monsoon; island-hopping cancelled, rock climbing walls wet and slippery)",
    months:{
      jan:{r:10,d:"Peak season. Railay Beach and Ao Nang pristine. Rock climbing in perfect conditions."},
      feb:{r:10,d:"Outstanding. Driest month. Four Islands and Railay beautiful. Phi Phi easily accessible."},
      mar:{r:9,d:"Excellent. Still very dry and sunny. Sea clear. All boat trips and climbing available."},
      apr:{r:8,d:"Hot and mostly dry. Good before monsoon. Pre-rain lull offers good conditions."},
      may:{r:4,d:"Rains starting. Four Islands accessible some days. Rock climbing restricted on wet walls."},
      jun:{r:3,d:"Frequent heavy rain. Boat trips often cancelled. Ao Nang town for food and culture."},
      jul:{r:3,d:"Full monsoon. Island trips unreliable. Stunning landscapes in rain but not for beach lovers."},
      aug:{r:3,d:"Heavy rain and rough seas. Not recommended for beach or island activities."},
      sep:{r:3,d:"Wettest month in Krabi. Very rough seas. Only for budget travelers who accept conditions."},
      oct:{r:5,d:"Rain easing. Seas calming. Shoulder season deals. Some island trips resuming."},
      nov:{r:8,d:"High season returns. Sea calm. Rock climbing open. Four Islands and Railay superb."},
      dec:{r:9,d:"Excellent. Very dry, calm sea. Peak season fully underway. Book ahead."},
    }
  },
  {
    country:"Thailand", region:"South (Andaman)", place:"Koh Phi Phi",
    worstTimes:"May–Oct (Andaman monsoon; ferries cancelled, Maya Bay inaccessible, rough seas)",
    months:{
      jan:{r:10,d:"Best month. Maya Bay and Viking Cave accessible. Stunning snorkeling. Lively but worth it."},
      feb:{r:10,d:"Outstanding. Driest, clearest. Maya Bay breathtaking. All snorkel and dive sites open."},
      mar:{r:9,d:"Excellent. Clear water, blue skies. Slightly less busy. Maya Bay in superb condition."},
      apr:{r:8,d:"Hot and mostly dry. Good conditions before monsoon. Maya Bay still accessible."},
      may:{r:4,d:"Ferries still running but reduced. Maya Bay accessible some days. Party scene quieter."},
      jun:{r:3,d:"Very limited boat access. Maya Bay often closed due to waves. Island empties out."},
      jul:{r:2,d:"Roughest conditions. Most visitors gone. Not recommended. Maya Bay inaccessible."},
      aug:{r:2,d:"Full monsoon. Phi Phi essentially a backpacker-only destination this month."},
      sep:{r:2,d:"Worst month. Rough seas, heavy rain. Ferries unreliable. Island very quiet."},
      oct:{r:4,d:"Rain easing. Ferries more reliable. Maya Bay starting to reopen. Shoulder season."},
      nov:{r:8,d:"High season returns. Maya Bay accessible. Stunning snorkeling. Less crowded than peak."},
      dec:{r:9,d:"Excellent. Clear water, calm seas. Holiday crowds. Maya Bay and snorkeling superb."},
    }
  },
  {
    country:"Thailand", region:"South (Andaman)", place:"Koh Lanta",
    worstTimes:"May–Oct (Andaman monsoon; island essentially closes, most resorts shut completely)",
    months:{
      jan:{r:9,d:"Peak season. Long Beach and Klong Dao Beach superb. Excellent diving at Hin Daeng."},
      feb:{r:10,d:"Outstanding. Driest month. All beaches calm and beautiful. Best diving conditions."},
      mar:{r:9,d:"Excellent. Still very dry. Sea calm. Peaceful island before peak crowds."},
      apr:{r:8,d:"Good. Warming up. Sea still calm. Last good month before closures."},
      may:{r:3,d:"Island transitioning to off-season. Many resorts closing. Beaches rough."},
      jun:{r:2,d:"Most of island closed. A handful of places remain. Not a good time to visit."},
      jul:{r:2,d:"Nearly empty. A few long-stay expats. Lush jungle but no beach life."},
      aug:{r:2,d:"Island closed for most purposes. No beach activities. Jungle lush but isolated."},
      sep:{r:2,d:"Still essentially closed. Rough seas. Not a tourist destination this month."},
      oct:{r:4,d:"Island beginning to reopen. Some resorts returning. Seas still rough but improving."},
      nov:{r:8,d:"High season returning. Long Beach coming alive. Excellent diving resuming."},
      dec:{r:9,d:"Peak season. Beaches beautiful. Diving excellent at Hin Daeng and Hin Muang."},
    }
  },
  {
    country:"Thailand", region:"South (Andaman)", place:"Koh Lipe",
    worstTimes:"May–Oct (island fully closes; no ferry service, all resorts shut — uninhabited effectively)",
    months:{
      jan:{r:9,d:"Peak season. Pristine beaches and snorkeling. Pattaya Beach and Sunrise Beach superb."},
      feb:{r:10,d:"Best month. Crystal-clear water, calm sea. Snorkeling outstanding. Less crowded than peak."},
      mar:{r:9,d:"Excellent. Still very clear water. Beautiful beaches. Accessible from Pak Bara."},
      apr:{r:8,d:"Last good month. Island at its best before monsoon closes everything."},
      may:{r:3,d:"Last ferry connections winding down. Most resorts closing. Catch boats before monsoon."},
      jun:{r:1,d:"Island completely closed to tourists. No ferry service. Do not plan to visit."},
      jul:{r:1,d:"Closed season. Zero tourist infrastructure. Not accessible by boat."},
      aug:{r:1,d:"Closed. Rough monsoon seas. Island inaccessible."},
      sep:{r:1,d:"Closed. Worst conditions. Island inaccessible by sea."},
      oct:{r:3,d:"Island beginning to reopen late October. Ferry service resuming. Limited infrastructure."},
      nov:{r:8,d:"High season returning. Snorkeling excellent. Beautiful and less crowded than peak."},
      dec:{r:9,d:"Excellent. Pristine beaches, crystal water. Popular but stunning. Book ahead."},
    }
  },
  // ─── THAILAND — EAST ───────────────────────────────────────────────────────
  {
    country:"Thailand", region:"East", place:"Pattaya",
    worstTimes:"Oct (heaviest Gulf-side rain and coastal flooding in some areas)",
    months:{
      jan:{r:8,d:"Cool and dry. Jomtien and Pattaya beaches calm. Water parks, golf and nightlife at their best."},
      feb:{r:8,d:"Excellent. Clear skies. Koh Larn accessible by ferry. City at its most comfortable."},
      mar:{r:8,d:"Good and dry. Warming up. All activities running. Good value before Songkran."},
      apr:{r:7,d:"Very hot. Songkran water festival — extremely lively. Sea still OK. Mostly for entertainment."},
      may:{r:6,d:"Rain beginning. Beach still usable some days. Entertainment and nightlife fully active."},
      jun:{r:6,d:"Rainy season. Sea a bit murky. Pattaya's appeal is mostly city-based — it continues."},
      jul:{r:6,d:"Wet but Pattaya's entertainment and food scene runs 365 days. Koh Larn accessible."},
      aug:{r:6,d:"Rain continues. Indoor Pattaya (shows, shopping, dining) still excellent year-round."},
      sep:{r:5,d:"Wetter month. Some beach flooding. Entertainment focused. Check sea conditions for Koh Larn."},
      oct:{r:5,d:"Heaviest rain month. Some coastal flooding. But city nightlife and entertainment unaffected."},
      nov:{r:7,d:"Improving. Beaches clearing. Good value. All outdoor activities resuming nicely."},
      dec:{r:8,d:"Excellent. Cool and dry. Festive season. Koh Larn beautiful. Good all-round month."},
    }
  },
  // ─── THAILAND — ANDAMAN NORTH ──────────────────────────────────────────────
  {
    country:"Thailand", region:"Andaman North", place:"Khao Lak",
    worstTimes:"May–Oct (Andaman monsoon; Similan Islands closed by government order, beaches rough)",
    months:{
      jan:{r:10,d:"Best month. Similan Islands liveaboard season in full swing. Manta rays and whale sharks possible."},
      feb:{r:10,d:"Outstanding. Similan Islands peak diving season. Crystal clear water. Top-rated dive destination."},
      mar:{r:9,d:"Excellent. Similans still open. Long sandy Khao Lak beach calm and beautiful."},
      apr:{r:8,d:"Good. Similans open until mid-April/mid-May. Good conditions before monsoon arrives."},
      may:{r:3,d:"Similan Islands liveaboards just finished. Beach rough. Jungle hikes good."},
      jun:{r:2,d:"Full monsoon. Similans closed. Heavy rain. Waterfalls impressive, little else."},
      jul:{r:2,d:"Monsoon peak. Not a beach destination. Waterfalls full and powerful inland."},
      aug:{r:2,d:"Heavy monsoon rain. Similans closed. Beach rough. Jungle treks possible."},
      sep:{r:2,d:"Wettest period. Similans closed. Rough seas. Only for waterfalls and jungle."},
      oct:{r:4,d:"Rain easing. Similan Islands beginning to reopen mid-October. Shoulder season."},
      nov:{r:8,d:"High season returning. Similans fully open. Excellent diving and beach conditions."},
      dec:{r:9,d:"Excellent. Similans at their best. Whale sharks and manta rays possible."},
    }
  },
  // ─── SRI LANKA — SOUTH COAST ───────────────────────────────────────────────
  {
    country:"Sri Lanka", region:"South Coast", place:"Weligama",
    worstTimes:"Jun–Aug (southwest monsoon; west-facing beaches rough with powerful surf for learners)",
    months:{
      jan:{r:9,d:"Best month. Calm sea, warm (28°C). Whale watching season peak. Surf for beginners perfect."},
      feb:{r:9,d:"Excellent. Flat and warm. Turtle watching on the beach. Surfing lessons ideal conditions."},
      mar:{r:8,d:"Good. Some pre-monsoon swell building. Intermediate surfers enjoying. Still beautiful."},
      apr:{r:7,d:"Swell picking up. Intermediate surf improving. Last good month before monsoon."},
      may:{r:6,d:"Pre-monsoon swell arriving. Good for experienced surfers, rougher for beginners. Less crowded."},
      jun:{r:5,d:"Southwest monsoon. Waves big and choppy. Surfing for experienced only. Deals available."},
      jul:{r:5,d:"Consistent swell. Surf crowd thins. Hiri and Weligama bays varied conditions daily."},
      aug:{r:6,d:"Monsoon easing. Some great surf days. Experienced surfers find good waves."},
      sep:{r:7,d:"Improving. Waves more manageable. Good shoulder season. Town returning to life."},
      oct:{r:7,d:"Good transition month. Sea calming. Surf accessible to more levels. Good deals."},
      nov:{r:8,d:"Dry season returning. Whale watching resuming. Beginner surf conditions improving."},
      dec:{r:9,d:"Excellent. Calm, warm, clear. Whale watching season. Beginners paradise for surfing."},
    }
  },
  {
    country:"Sri Lanka", region:"South Coast", place:"Mirissa",
    worstTimes:"Jun–Sep (southwest monsoon; beaches close, whale watching stops, rough seas)",
    months:{
      jan:{r:10,d:"Best month. Whale watching peak season (blue and sperm whales). Beach calm. Perfect conditions."},
      feb:{r:9,d:"Excellent. Whale watching still great. Calm sea, warm. Paradise Beach beautiful."},
      mar:{r:8,d:"Good. Whale watching still possible. Last good beach month before seas change."},
      apr:{r:7,d:"Pre-monsoon. Whale watching ending. Sea getting rougher. Last weeks of beach season."},
      may:{r:4,d:"Monsoon starts. Whale watching over. Beach rough. Village quiets significantly."},
      jun:{r:3,d:"Heavy monsoon. Beaches unsafe. Most restaurants quiet. Village peaceful if you embrace rain."},
      jul:{r:3,d:"Rough seas, persistent rain. Not recommended for beach holiday. Head to east coast instead."},
      aug:{r:3,d:"Still monsoon. Rough and wet. Not a beach destination."},
      sep:{r:4,d:"Monsoon easing. Some improvement. Restaurants reopening. Not yet beach season."},
      oct:{r:6,d:"Significant improvement. Beach returning to life. Inter-monsoon showers. Affordable."},
      nov:{r:8,d:"Dry season resuming. Beach conditions returning. Whale watching possibly starting late month."},
      dec:{r:9,d:"Excellent. Whale watching season opens. Calm sea. Christmas period lively and beautiful."},
    }
  },
  {
    country:"Sri Lanka", region:"South Coast", place:"Hiriketiya",
    worstTimes:"Jun–Sep (southwest monsoon; horseshoe bay gets rough, waves blown out regularly)",
    months:{
      jan:{r:9,d:"Best. Calm, warm, beautiful horseshoe bay. Beginner and intermediate surf ideal."},
      feb:{r:9,d:"Excellent. Blue water, uncrowded. Trendy cafes and beach vibe at their best."},
      mar:{r:8,d:"Good. Surf building pleasantly. Bay relatively sheltered. Great social scene."},
      apr:{r:7,d:"Swell arriving. Intermediate surf improving. Pre-monsoon. Bay still accessible."},
      may:{r:5,d:"Monsoon swell building. Bay offers some shelter. Surf community remains. Good deals."},
      jun:{r:4,d:"Choppy and rainy. Some decent surf days. Quieter, budget-friendly."},
      jul:{r:4,d:"Inconsistent surf. Rain and clouds frequent. Bay sheltered but affected by swell."},
      aug:{r:5,d:"Improving slightly. Some good surf. Cafes open. Bay calmer than exposed coasts."},
      sep:{r:6,d:"Improving noticeably. Waves more organised. Surf community active again."},
      oct:{r:7,d:"Good transition. Surf accessible to more levels. Cafes buzzing. Good shoulder value."},
      nov:{r:8,d:"Dry season. Calm bay, beautiful water. Best surf conditions of the year building."},
      dec:{r:9,d:"Excellent. Bay calm and beautiful. Surf for all levels. Social scene vibrant."},
    }
  },
  // ─── SRI LANKA — EAST COAST ────────────────────────────────────────────────
  {
    country:"Sri Lanka", region:"East Coast", place:"Arugam Bay",
    worstTimes:"Nov–Mar (northeast monsoon; bay rough, big swells, town largely closed)",
    months:{
      jan:{r:3,d:"Northeast monsoon. Bay rough. Main Point often unsurfable. Most accommodation closed."},
      feb:{r:3,d:"Still monsoon. Conditions harsh. Skeleton crew of businesses open. Not recommended."},
      mar:{r:4,d:"Monsoon easing late March. Whisky Point beginning to work. Town slowly reopening."},
      apr:{r:6,d:"East coast dry season begins. Surf season opening up. Long sandy beach returning to life."},
      may:{r:8,d:"Dry season on east coast! Surf season opening up. Long sandy beach, laid-back vibe."},
      jun:{r:9,d:"Prime season. Consistent surf at Main Point, Pottuvil, Whisky Point. Sunny and warm."},
      jul:{r:9,d:"Peak surf and beach season. Cloud 9 firing. Vibrant beach town. Elephants at Kumana NP."},
      aug:{r:9,d:"Excellent surf continues. Town at peak vibrancy. Kumana NP elephant herds spectacular."},
      sep:{r:7,d:"Surf season winding down. Some good days still. Town quieting. Good budget time."},
      oct:{r:5,d:"Northeast monsoon approaching. Swells building. Surf getting powerful. Town closing up."},
      nov:{r:3,d:"Monsoon arriving. Bay rough. Most accommodation closing. Not recommended."},
      dec:{r:3,d:"Full northeast monsoon. Bay inaccessible for surfing and swimming. Town closed."},
    }
  },
  {
    country:"Sri Lanka", region:"East Coast", place:"Trincomalee",
    worstTimes:"Nov–Jan (northeast monsoon; rough seas, diving impossible, town winds down)",
    months:{
      jan:{r:3,d:"Northeast monsoon. Rough seas. Nilaveli and Uppuveli beaches inaccessible. Diving cancelled."},
      feb:{r:4,d:"Monsoon easing. Sea improving. Pigeon Island snorkeling beginning to resume late month."},
      mar:{r:6,d:"Good improvement. Nilaveli beach opening up. Whale watching possible off coast."},
      apr:{r:8,d:"East coast dry season. Pigeon Island coral beautiful. Whale watching excellent."},
      may:{r:8,d:"Warm, sunny, calm sea. Pigeon Island reefs beautiful. Snorkeling excellent. Fewer tourists."},
      jun:{r:8,d:"Excellent. Blue water, warm sea. Pigeon Island at its finest. Whale watching nearby."},
      jul:{r:8,d:"Peak season. Pristine blue water, snorkeling superb. One of Sri Lanka's best months here."},
      aug:{r:8,d:"Continues excellent. Warm sea, good visibility at Pigeon Island. Very enjoyable."},
      sep:{r:6,d:"East coast season winding down. Some rain. Still good value and decent conditions."},
      oct:{r:4,d:"Northeast monsoon approaching. Seas getting rough. Diving becoming difficult."},
      nov:{r:3,d:"Monsoon. Beach closed, rough seas. Not for beach holidays."},
      dec:{r:3,d:"Full monsoon. Rough and wet. Not recommended for Trincomalee."},
    }
  },
  // ─── SRI LANKA — HILL COUNTRY ──────────────────────────────────────────────
  {
    country:"Sri Lanka", region:"Hill Country", place:"Ella",
    worstTimes:"Oct–Nov (both monsoons affect hills; heavy rain, misty views, slippery trails)",
    months:{
      jan:{r:8,d:"Cool (18–22°C) and mostly dry. Nine Arch Bridge vivid. Little Adam's Peak in clear conditions."},
      feb:{r:8,d:"Good. Clear mornings. Tea estates in full production. Train ride from Kandy beautiful."},
      mar:{r:8,d:"Excellent. Clear skies, comfortable trekking. Tea estates lush. Very pleasant conditions."},
      apr:{r:7,d:"Inter-monsoon showers begin. Still very manageable. Hills green and beautiful."},
      may:{r:7,d:"Hills relatively sheltered from southwest monsoon. Nine Arch Bridge and treks accessible."},
      jun:{r:6,d:"Some rain, often misty. Lush tea plantations. Trains still running. Cool temps (18-22°C)."},
      jul:{r:7,d:"Beautiful green landscape. Train rides through tea country atmospheric. Rain manageable."},
      aug:{r:7,d:"Lush and green. Ella Rock hike rewarding. Tea estates beautiful. Comfortable temperatures."},
      sep:{r:7,d:"Good. Hills relatively dry. Waterfalls impressive. Ella Gap views excellent on clear days."},
      oct:{r:5,d:"Both monsoons affecting hills. Heavy rain, dense mist. Trails slippery. Views obscured."},
      nov:{r:5,d:"Still wet. Northeast monsoon arriving. Misty but atmospheric. Fewer tourists, good prices."},
      dec:{r:8,d:"Improving. Drying out. Tea estates beautiful. One of the nicer months to visit Ella."},
    }
  },
  // ─── SRI LANKA — WEST COAST ────────────────────────────────────────────────
  {
    country:"Sri Lanka", region:"West Coast", place:"Colombo",
    worstTimes:"May–Jun (southwest monsoon peaks; heavy rain, streets flood, some days very difficult)",
    months:{
      jan:{r:9,d:"Best month. Dry, sunny, comfortable. Fort district, Galle Face Green and food scene superb."},
      feb:{r:9,d:"Excellent. Low humidity, very pleasant. Colombo's restaurant scene thriving year-round."},
      mar:{r:8,d:"Good. Warming up slightly. Pre-monsoon. City sightseeing comfortable and enjoyable."},
      apr:{r:7,d:"Inter-monsoon showers. Still manageable. City very active. New Year festivities."},
      may:{r:5,d:"Monsoon arrives. Daily rain, sometimes heavy. Fort and museums excellent in any weather."},
      jun:{r:5,d:"Heaviest rain month. Galle Face Green sometimes flooded. Food, culture, shopping unaffected."},
      jul:{r:6,d:"Rain easing slightly. Colombo is a city destination — weather less critical than coast."},
      aug:{r:7,d:"Improving. Monsoon weakening. City very liveable. National Museum and Pettah market great."},
      sep:{r:7,d:"Good. Mostly dry periods. City comfortable. Good value accommodation."},
      oct:{r:6,d:"Inter-monsoon showers. Some heavy rain. City continues normally."},
      nov:{r:8,d:"Dry season beginning. Comfortable and pleasant. Great time for city exploration."},
      dec:{r:9,d:"Excellent. Dry, festive, vibrant. Christmas decorations and events. Best alongside January."},
    }
  },
  {
    country:"Sri Lanka", region:"West Coast", place:"Kalpitiya",
    worstTimes:"Nov–Feb (northeast monsoon; wind too unpredictable for kitesurfing, lagoon rough)",
    months:{
      jan:{r:4,d:"Northeast monsoon. Wind gusty and unpredictable. Dolphin watching possible on calm days."},
      feb:{r:4,d:"Still rough. Not ideal for kitesurfing. Dolphins offshore occasionally."},
      mar:{r:5,d:"Improving. Wind becoming more reliable. Lagoon calming. Dolphin pods active."},
      apr:{r:6,d:"Good improvement. Some reliable kite wind days. Lagoon increasingly flat."},
      may:{r:5,d:"Wind picking up for kitesurfing. Dolphins still spotted. Not yet peak kite season."},
      jun:{r:7,d:"Prime kitesurfing season. Consistent wind, flat lagoon. Spinner dolphin tours excellent."},
      jul:{r:7,d:"Strong, reliable kite winds. Lagoon flat and perfect. If you kitesurf, this is the spot."},
      aug:{r:8,d:"Best kitesurfing conditions. Strong consistent wind. Flat lagoon. Expert and beginner kite spots."},
      sep:{r:7,d:"Kite season continues. Good wind. Dolphins still present. Less crowded than August."},
      oct:{r:6,d:"Wind easing. End of kite season. Lagoon still accessible. Good shoulder season."},
      nov:{r:4,d:"Northeast monsoon arriving. Wind gusty. Not reliable for kitesurfing."},
      dec:{r:4,d:"Monsoon. Rough and unpredictable. Not recommended for kitesurfing."},
    }
  },
  // ─── JAPAN ─────────────────────────────────────────────────────────────────
  {
    country:"Japan", region:"Kanto", place:"Tokyo",
    worstTimes:"Jun–Jul (tsuyu rainy season; grey skies, near-daily drizzle, very humid)",
    months:{
      jan:{r:7,d:"Cool (4–10°C), dry and sunny. Crowds thin post-New Year. Mt Fuji views superb. Good value."},
      feb:{r:7,d:"Still cold but dry and clear. Plum blossoms begin. Fewer crowds. Good sightseeing."},
      mar:{r:9,d:"Cherry blossoms begin late March. Warming up (10–15°C). Very lively and beautiful."},
      apr:{r:10,d:"Best month. Peak sakura. Ueno Park hanami parties. Perfect temperatures. Extremely popular."},
      may:{r:9,d:"Post-cherry blossom green. Cool temperatures, festivals. Highly recommended. Less crowded."},
      jun:{r:6,d:"Tsuyu rainy season. Humid, grey skies, daily drizzle. Hydrangeas bloom. Museums ideal."},
      jul:{r:7,d:"Tsuyu ends mid-July. Heat and humidity rise sharply (32°C). Firework festivals begin."},
      aug:{r:6,d:"Very hot and humid. Obon holiday crowds. Fireworks excellent. Tokyo at its most intense."},
      sep:{r:7,d:"Typhoon risk. Heat easing late month. Autumn colours beginning at high altitudes."},
      oct:{r:9,d:"Excellent. Autumn colours begin. Cool (18–22°C), dry. One of the best months."},
      nov:{r:9,d:"Outstanding. Peak autumn foliage in Shinjuku Gyoen. Comfortable temperatures. Beautiful."},
      dec:{r:7,d:"Winter illuminations spectacular. Cold (6–10°C). Dry. Festive but quieter crowds."},
    }
  },
  {
    country:"Japan", region:"Kansai", place:"Osaka",
    worstTimes:"Jun–Jul (tsuyu rainy season) and Aug (extreme heat and humidity 35°C+)",
    months:{
      jan:{r:7,d:"Cold (5°C) and dry. Dotonbori less crowded. Osaka Castle beautiful in winter. Good food."},
      feb:{r:7,d:"Still cold. Plum blossoms. Kuromon Market and street food excellent year-round."},
      mar:{r:9,d:"Cherry blossoms. Osaka Castle grounds spectacular. Warming up. Very popular month."},
      apr:{r:10,d:"Peak sakura at Osaka Castle. Sunny, warm. Perfect conditions. Dotonbori at its finest."},
      may:{r:9,d:"Perfect weather. Dotonbori and street food magical. Comfortable temperatures. Less crowded."},
      jun:{r:6,d:"Rainy season. Humid. Kuromon Market and food halls great in any weather."},
      jul:{r:7,d:"Hot and steamy. Summer food festivals start. Tenjin Matsuri festival mid-month."},
      aug:{r:6,d:"Very hot (35°C+) and humid. Obon period. Osaka vibrant but heat is challenging."},
      sep:{r:7,d:"Cooling down. Typhoon risk. Autumn starting. Good food scene continues."},
      oct:{r:9,d:"Excellent. Cool and comfortable. Autumn colours. One of the best months to visit."},
      nov:{r:9,d:"Outstanding. Autumn foliage at Minoo Park spectacular. Cool and clear. Great conditions."},
      dec:{r:8,d:"Cold but dry. Illuminations at Midosuji and Namba stunning. Festive atmosphere."},
    }
  },
  {
    country:"Japan", region:"Kansai", place:"Kyoto",
    worstTimes:"Aug (extreme heat 35°C+ and very humid; temples overcrowded, uncomfortable)",
    months:{
      jan:{r:7,d:"Cold (5°C), occasionally snowy. Kinkakuji in snow is unforgettable. Crowds thin. Atmospheric."},
      feb:{r:7,d:"Cold. Plum blossoms at Kitano Tenmangu. Less crowded. Good for photography."},
      mar:{r:9,d:"Cherry blossoms. Maruyama Park and Philosopher's Path lined with sakura. Very busy."},
      apr:{r:10,d:"Peak sakura. Arashiyama and Fushimi Inari beautiful. Perfect temperatures. Most popular month."},
      may:{r:9,d:"Temples and bamboo grove in full spring green. Comfortable and beautiful. Post-sakura quiet."},
      jun:{r:6,d:"Rainy season. Philosopher's Path hydrangeas. Arashiyama misty and atmospheric."},
      jul:{r:7,d:"Gion Matsuri — Kyoto's greatest festival. Very hot. Evening Gion lantern-lit and magical."},
      aug:{r:5,d:"Hottest month (35°C). Very crowded. Heat and crowds make temple visits challenging."},
      sep:{r:7,d:"Cooling down. Typhoon risk. Autumn hues starting. Less crowded. Pleasant conditions."},
      oct:{r:9,d:"Excellent. Autumn colours arriving. Tofukuji and Eikan-do extraordinary. Perfect."},
      nov:{r:10,d:"Best month. Peak autumn foliage. Entire city turns red and gold. Magical. Book early."},
      dec:{r:8,d:"Cold. First snow possible. Kinkakuji reflection in snow pool extraordinary. Atmospheric."},
    }
  },
  {
    country:"Japan", region:"Okinawa", place:"Okinawa",
    worstTimes:"Sep–Oct (typhoon season; direct hits possible, beaches closed, transport disrupted)",
    months:{
      jan:{r:7,d:"Mild (18°C) and mostly dry. Snorkeling still possible. Cherry blossoms begin in January!"},
      feb:{r:7,d:"Still mild. Cherry blossoms in full bloom (Japan's earliest). Comfortable and uncrowded."},
      mar:{r:8,d:"Warming up. Excellent for diving and snorkeling. Whale watching season peak."},
      apr:{r:8,d:"Very pleasant. Warm water (24°C). Diving season excellent. Before tsuyu starts."},
      may:{r:6,d:"Tsuyu (rainy season). Warm water. Good diving between showers. Lush landscape."},
      jun:{r:7,d:"Tsuyu ends late June. Ocean warming beautifully. Excellent snorkeling at Kerama Islands."},
      jul:{r:8,d:"Peak summer. Clear water, great diving and beaches. Busy with Japanese tourists. Very hot."},
      aug:{r:8,d:"Excellent diving and beaches. Hot (32°C). Very popular with domestic tourists."},
      sep:{r:5,d:"Typhoon risk high. Direct hits possible. Beaches and diving disrupted. Monitor forecasts."},
      oct:{r:5,d:"Typhoon risk continues. Weather improving late month. Diving improving."},
      nov:{r:8,d:"Excellent. Typhoon season over. Cooler (22°C). Diving very good. Manageable crowds."},
      dec:{r:7,d:"Pleasant and mild. Cherry blossom preparations begin. Quiet, good value, good diving."},
    }
  },
  {
    country:"Japan", region:"Hokkaido", place:"Hokkaido",
    worstTimes:"Jan–Feb (extreme cold -20°C; travel difficult outside ski resorts, icy roads everywhere)",
    months:{
      jan:{r:6,d:"Extreme cold. World-class skiing at Niseko, Furano. Snow festival in Sapporo (February). For skiers."},
      feb:{r:7,d:"Sapporo Snow Festival (February). Best skiing. Very cold but ski infrastructure excellent."},
      mar:{r:7,d:"Ski season winding down. Spring coming. Drift ice off eastern coast (Abashiri) spectacular."},
      apr:{r:7,d:"Spring arrives (later than Honshu). Cherry blossoms beginning in Hakodate late April."},
      may:{r:8,d:"Spring flowers (tulips in Shikisai-no-oka). Cool and comfortable. Far fewer crowds."},
      jun:{r:8,d:"Lavender season begins in late June in Furano. Cool (18–20°C), green, beautiful."},
      jul:{r:9,d:"Peak lavender season in Furano. Flower fields spectacular. Perfect temperatures (22–25°C)."},
      aug:{r:9,d:"Best summer weather in Japan. Hokkaido cooler than Honshu (25°C vs 35°C). Superb."},
      sep:{r:8,d:"Excellent. Autumn colours beginning. Comfortable temperatures. Showa Shinzan volcanic area great."},
      oct:{r:8,d:"Peak autumn foliage. Daisetsuzan National Park spectacular. Cool and clear."},
      nov:{r:6,d:"First snow. Ski resorts opening. Cold but exciting transition period."},
      dec:{r:6,d:"Full winter. Niseko skiing excellent. Cold but powder snow world-class. For skiers."},
    }
  },
  {
    country:"Japan", region:"Shikoku", place:"Shikoku",
    worstTimes:"Jun–Jul (tsuyu rainy season; 88-temple pilgrimage trail muddy and slippery)",
    months:{
      jan:{r:6,d:"Cool pilgrimage conditions. Iya Valley dramatic in winter mist. Fewer pilgrim crowds."},
      feb:{r:6,d:"Cold. Some snow in mountains. Pilgrimage possible but demanding. Ryokan stays cozy."},
      mar:{r:8,d:"Cherry blossoms. Pilgrimage in full spring beauty. Kochi castle grounds spectacular."},
      apr:{r:9,d:"Excellent. Cherry blossoms and comfortable temperatures. Best for the 88-temple pilgrimage."},
      may:{r:8,d:"Great for the pilgrimage. Cool clear days. Temples and rural landscapes beautiful."},
      jun:{r:5,d:"Rainy season. Pilgrimage trails slippery. Iya Valley gorge dramatic in mist. Wet but atmospheric."},
      jul:{r:6,d:"Heat and humidity rising. Pilgrimage arduous. Coastal areas of Kochi nice for beaches."},
      aug:{r:6,d:"Very hot. Pilgrimage demanding. Beaches and surfing at Kochi popular. Awa Odori dance festival."},
      sep:{r:7,d:"Cooling down. Typhoon risk. Autumn starting. Pilgrimage becoming pleasant again."},
      oct:{r:9,d:"Outstanding. Autumn colours in Iya Valley. Perfect temperatures for pilgrimage."},
      nov:{r:8,d:"Excellent. Clear and cool. Temples in autumn foliage stunning. Good for all activities."},
      dec:{r:6,d:"Cold. Mountain routes icy. Lower route of pilgrimage possible. Ryokan atmosphere excellent."},
    }
  },
  {
    country:"Japan", region:"Kyushu", place:"Kyushu",
    worstTimes:"Jun–Jul (tsuyu rainy season; Mt Aso area foggy, some roads closed)",
    months:{
      jan:{r:6,d:"Cold but mild by Japanese standards. Nagasaki history sites atmospheric. Onsens excellent."},
      feb:{r:7,d:"Cold. Plum blossoms beautiful. Fukuoka ramen culture at its best on cold days."},
      mar:{r:8,d:"Cherry blossoms. Fukuoka Ohori Park stunning. Nagasaki and Kagoshima blooming."},
      apr:{r:9,d:"Excellent. Warm and beautiful. Mt Aso accessible. Sakura across the island superb."},
      may:{r:8,d:"Mt Aso accessible, Nagasaki and Fukuoka beautiful. Comfortable temperatures."},
      jun:{r:6,d:"Rainy season. Takachiho Gorge misty and dramatic. City sightseeing still great."},
      jul:{r:7,d:"Rain fading. Hot and humid. Hakata Gion Yamakasa festival in Fukuoka is spectacular."},
      aug:{r:7,d:"Very hot but lively. Nagasaki Lantern Festival. Peace memorial events. Onsen areas popular."},
      sep:{r:7,d:"Cooling down. Typhoon risk. Autumn colours beginning in mountains."},
      oct:{r:9,d:"Excellent. Autumn colours at their peak. Mt Aso stunning. Perfect weather."},
      nov:{r:8,d:"Very good. Cool and clear. Autumn leaves in Nagasaki and Fukuoka parks beautiful."},
      dec:{r:7,d:"Cold. Onsens excellent in winter. Nagasaki Lantern Festival begins. Festive atmosphere."},
    }
  },
  // ─── LAOS ──────────────────────────────────────────────────────────────────
  {
    country:"Laos", region:"Cities", place:"Luang Prabang",
    worstTimes:"Aug–Sep (Mekong flooding; streets near river flooded, some temple areas waterlogged)",
    months:{
      jan:{r:8,d:"Cool (18°C) and dry. Mekong low and calm. Alms giving ceremony atmospheric. Perfect for sightseeing."},
      feb:{r:8,d:"Still cool and dry. Fewer tourists than peak. Waterfalls beginning to build. Very pleasant."},
      mar:{r:7,d:"Warming up (30°C). Still dry. Some haze from burning. All temples and sights accessible."},
      apr:{r:7,d:"Hot. Pi Mai (Lao New Year) water festival — extremely fun and lively. Kuang Si filling."},
      may:{r:6,d:"Rains beginning. Kuang Si waterfall filling beautifully. Alms ceremony atmospheric."},
      jun:{r:6,d:"Green season. Mekong rising. Lush forests. Fewer tourists, relaxed pace, bargain prices."},
      jul:{r:6,d:"Rain most days. Kuang Si at peak beauty. Mekong high. Some paths closed near river."},
      aug:{r:4,d:"Heaviest rain. Mekong floods some lower streets. Very wet. Not recommended."},
      sep:{r:4,d:"Still very wet. Flooding of riverside areas continues. Limited access to some temples."},
      oct:{r:7,d:"Rains easing. Mekong receding. Boat Festival (Awk Phansa) spectacular. Good shoulder season."},
      nov:{r:9,d:"Excellent. Dry season returns. All sights accessible. Perfect temperatures. Best month."},
      dec:{r:8,d:"Cool and dry. Mekong low and beautiful. Very pleasant. Good value."},
    }
  },
  {
    country:"Laos", region:"Cities", place:"Vang Vieng",
    worstTimes:"Aug–Sep (Nam Song river flooding; tubing dangerous, kayaking cancelled, roads flooded)",
    months:{
      jan:{r:8,d:"Cool and dry. River activities running. Blue lagoon stunning. Karst scenery beautiful."},
      feb:{r:8,d:"Good conditions. Climbing and kayaking excellent. Lagoons accessible and clear."},
      mar:{r:7,d:"Warming up. River still manageable. Tubing fun. Hot air balloon rides available."},
      apr:{r:7,d:"Hot. Pi Mai water festival. River tubing very popular. Lagoons warm."},
      may:{r:6,d:"River activities still running. Karst scenery getting lush. Some rain. Good conditions."},
      jun:{r:5,d:"River rising. Tubing possible but check conditions. Caves and lagoons still accessible."},
      jul:{r:5,d:"Nam Song rising. Tubing restricted on some days. Lagoons beautiful but access tricky."},
      aug:{r:3,d:"River high and fast. Tubing banned. Many activities cancelled. Not recommended."},
      sep:{r:3,d:"River still very high. Flooding. Very limited activities. Budget travelers only."},
      oct:{r:6,d:"River calming. Tubing resuming. Lagoons clearing. Good shoulder season value."},
      nov:{r:8,d:"Excellent. Dry and clear. All activities running. Hot air balloons. Blue lagoons superb."},
      dec:{r:8,d:"Cool and dry. River perfectly calm. All activities available. Good value."},
    }
  },
  {
    country:"Laos", region:"Cities", place:"Vientiane",
    worstTimes:"Jul–Sep (heaviest monsoon; streets flood, outdoor activities very limited)",
    months:{
      jan:{r:8,d:"Cool (20°C) and dry. Patuxai and That Luang beautiful. Mekong waterfront pleasant evenings."},
      feb:{r:8,d:"Good conditions. French-influenced cafes and bakeries thriving. All sights accessible."},
      mar:{r:7,d:"Warming up. Dry. All temples open. Mekong getting lower. Good city exploration."},
      apr:{r:7,d:"Hot. Pi Mai water festival — city comes alive. Wat Simuang festival activities."},
      may:{r:6,d:"Hot and getting wetter. Patuxai and temples still great. Mekong waterfront pleasant evenings."},
      jun:{r:6,d:"Rainy season. Good café culture, French bakeries and temples accessible in light rain."},
      jul:{r:5,d:"Heavy rain. Street flooding common. Relaxed capital easy to explore but weather limits plans."},
      aug:{r:4,d:"Heaviest rains. Some flooding. City functional but outdoor time limited. Good deals."},
      sep:{r:4,d:"Still very wet. Mekong high. Limited outdoor activities. Indoor attractions still good."},
      oct:{r:6,d:"Rains easing. That Luang Festival (Boun That Luang) — major event. City coming alive."},
      nov:{r:8,d:"Dry season returns. Very pleasant. City sightseeing excellent. Good value."},
      dec:{r:8,d:"Excellent. Cool and dry. Mekong beautiful at dusk. All sights accessible."},
    }
  },
  // ─── INDIA — NORTH ─────────────────────────────────────────────────────────
  {
    country:"India", region:"North", place:"Delhi",
    worstTimes:"May–Jun (extreme heat 45°C+, dangerous for extended outdoor activity)",
    months:{
      jan:{r:8,d:"Cool (8–20°C) and dry. Mughal monuments in comfortable conditions. Fog possible."},
      feb:{r:8,d:"Excellent. Mild and clear. Red Fort and Qutub Minar very comfortable. Pre-crowd window."},
      mar:{r:9,d:"Best month. Warm (25°C), dry, clear. All monuments accessible. Perfect conditions."},
      apr:{r:7,d:"Getting hot (35°C). Still dry. Early morning and evening sightseeing manageable."},
      may:{r:2,d:"Dangerous heat (44–48°C). Only for heat-tolerant, well-prepared visitors. Air conditioning essential."},
      jun:{r:3,d:"Scorching heat gives way to pre-monsoon dust storms. Very uncomfortable."},
      jul:{r:4,d:"Monsoon brings relief (30°C) but flooding common. Monuments in green surroundings."},
      aug:{r:4,d:"Heavy rains. Flooding in low areas. Sticky humidity. City manageable but not comfortable."},
      sep:{r:5,d:"Monsoon easing. Humidity high. Green and lush. Conditions improving late month."},
      oct:{r:8,d:"Excellent. Cool and dry. Delhi's best season returning. Monuments very accessible."},
      nov:{r:8,d:"Very good. Cool and comfortable. Best period alongside March. All sights at their best."},
      dec:{r:7,d:"Cool (10°C nights) and dry. Fog possible in last week. Pleasant daytime sightseeing."},
    }
  },
  {
    country:"India", region:"North", place:"Rishikesh",
    worstTimes:"Jul–Aug (Ganges flooding; rafting banned, ghats submerged, landslide risk on roads)",
    months:{
      jan:{r:6,d:"Cold (5–15°C). Dry. Yoga and ashrams very active. Ghats quiet and spiritual. River low."},
      feb:{r:7,d:"Still cold. Yoga retreats full. Rhododendrons beginning in foothills. River calm."},
      mar:{r:9,d:"Excellent. Warm (20–25°C), dry. Rafting season in full swing. Ghats beautiful."},
      apr:{r:9,d:"Best month. Warm, dry, clear. River rafting excellent. Yoga and retreat scene thriving."},
      may:{r:7,d:"Good before monsoon. River rafting in full swing. Yoga scene active. Pre-rain clean air."},
      jun:{r:5,d:"Monsoon beginning. Rafting increasingly restricted. Ghats getting lively with rain energy."},
      jul:{r:3,d:"Ganges floods, rafting banned. Lakshmanjhula area flooded. Landslide risk on roads."},
      aug:{r:3,d:"Heaviest floods. Very high Ganges. Dangerous conditions. Not recommended."},
      sep:{r:5,d:"Monsoon easing. River lowering. Rafting slowly resuming. Town recovering."},
      oct:{r:8,d:"Excellent. Dry and clear. Rafting in excellent conditions. Ashrams and yoga perfect."},
      nov:{r:8,d:"Very good. Cool and dry. Ganges at low level, clear. Quiet and spiritual atmosphere."},
      dec:{r:6,d:"Cold (5°C nights). Dry. Yoga retreats active. Ghats atmospheric in mist. Peaceful."},
    }
  },
  {
    country:"India", region:"North", place:"Dharamshala",
    worstTimes:"Jul–Aug (heavy monsoon; landslides cut roads regularly, trekking very dangerous)",
    months:{
      jan:{r:5,d:"Very cold (0–5°C). Snow on McLeod Ganj. Roads can ice. Beautiful but demanding."},
      feb:{r:5,d:"Still cold. Snow possible. Dalai Lama's birthday if scheduled. Tibetan culture active."},
      mar:{r:7,d:"Warming. Snow melting. Rhododendrons starting. Dharamkot trek becoming possible."},
      apr:{r:8,d:"Excellent. Triund trek opening. Cool mountain air. Tibetan market bustling. Beautiful."},
      may:{r:8,d:"Excellent. Cool (20°C), Triund trek gorgeous. Tibetan culture thriving. Pre-monsoon clarity."},
      jun:{r:6,d:"Monsoon approaching. Still trekking possible early June. McLeod Ganj cafes cozy in first rains."},
      jul:{r:4,d:"Heavy rain. Landslides common. Roads to Triund often closed. Town still atmospheric though."},
      aug:{r:4,d:"Monsoon peak. Landslides frequent. Major road closures. Not recommended for trekking."},
      sep:{r:7,d:"Monsoon ending. Triund reopening. Lush green hills. Beautiful late-season conditions."},
      oct:{r:9,d:"Best month. Crystal clear mountain views, Dhauladhar range spectacular. Perfect trekking."},
      nov:{r:7,d:"Good. Clear and cool. Mountain views excellent. First snows on higher peaks."},
      dec:{r:5,d:"Cold. McLeod Ganj quiet. Snow possible. Tibetan culture and meditation retreats."},
    }
  },
  {
    country:"India", region:"North", place:"Manali",
    worstTimes:"Jan–Feb (extreme snowfall; Rohtang Pass closed, town sometimes cut off, temperatures -15°C)",
    months:{
      jan:{r:3,d:"Extreme cold (-10 to -15°C). Rohtang Pass closed. Town can be cut off. Snow activities only."},
      feb:{r:3,d:"Still extreme cold. Rohtang closed. Best for those wanting Himalayan winter experience."},
      mar:{r:5,d:"Snowing less. Town accessible. Solang Valley snow activities winding down."},
      apr:{r:7,d:"Warming up. Rohtang Pass starting to open. Apple orchards beginning. Beautiful valley."},
      may:{r:8,d:"Rohtang Pass opens. Apple orchards blooming. Solang Valley green. Adventure sports in swing."},
      jun:{r:7,d:"Warm and accessible. Pre-monsoon clarity for mountain views. Hampta Pass trek viable."},
      jul:{r:5,d:"Monsoon. Landslides block roads to Rohtang and Leh regularly. Town itself fine but access risky."},
      aug:{r:5,d:"Heavy rain continues. Landslides frequent. Outdoor plans disrupted. Town manageable."},
      sep:{r:8,d:"Monsoon ending. Roads clearing. Apple harvest season — beautiful orchards. Good conditions."},
      oct:{r:9,d:"Best month. Clear skies, snow-capped peaks, Beas River beautiful. All roads open."},
      nov:{r:6,d:"First heavy snowfall. Rohtang closing. Season ending. Quiet but atmospheric."},
      dec:{r:3,d:"Full winter. Extreme cold. Rohtang closed. Only for serious snow sports enthusiasts."},
    }
  },
  {
    country:"India", region:"North", place:"Kasol",
    worstTimes:"Jul–Aug (Parvati River floods; camping destroyed, trails to Kheerganga dangerous)",
    months:{
      jan:{r:4,d:"Heavy snow. Kasol accessible but Kheerganga trail closed. Cold and quiet."},
      feb:{r:4,d:"Still snowy. Road access can be difficult. Small backpacker community. Very cold."},
      mar:{r:6,d:"Snow melting. Trail to Kheerganga beginning to clear. Valley beautiful. Quieter."},
      apr:{r:8,d:"Excellent. Valley green, Kheerganga trail open. Backpacker scene returning. Pleasant."},
      may:{r:8,d:"Beautiful. Parvati Valley lush. Kheerganga trek accessible. Backpacker scene buzzing."},
      jun:{r:6,d:"Pre-monsoon. Some rain. River high but manageable. Camps operating. Check trek conditions."},
      jul:{r:4,d:"River flooding. Kheerganga trail often closed by landslides. Camping suspended. Risky month."},
      aug:{r:4,d:"Heavy rain. Floods. Trails dangerous. Parvati River very high. Avoid high altitude."},
      sep:{r:7,d:"Monsoon ending. Valley clearing. Kheerganga reopening. Beautiful post-rain greenery."},
      oct:{r:8,d:"Best window. Clear, warm days. Kheerganga trail excellent. Valley vivid autumn colours."},
      nov:{r:5,d:"Getting cold. First snows possible. Kheerganga trail closing. Season ending."},
      dec:{r:3,d:"Heavy snow. Very cold. Road access difficult. For hardy winter visitors only."},
    }
  },
  {
    country:"India", region:"North", place:"Parvati Valley",
    worstTimes:"Jul–Sep (dangerous flooding and landslides; multiple fatalities annually — serious risk)",
    months:{
      jan:{r:3,d:"Heavy snow. Upper valley completely inaccessible. Very cold. Only Kasol town accessible."},
      feb:{r:3,d:"Still deep snow. Upper valley closed. Very cold. Not for trekking."},
      mar:{r:5,d:"Snow melting. Lower valley accessible. Upper routes still closed. Beautiful but limited."},
      apr:{r:7,d:"Valley opening. Pin Parvati lower sections accessible. Beautiful and relatively quiet."},
      may:{r:8,d:"Prime window. Pin Parvati Pass trek begins. Valley blooming. Manikaran active."},
      jun:{r:6,d:"Rains start. Upper treks closing one by one. Lower valley still beautiful and accessible."},
      jul:{r:3,d:"Monsoon in full force. Valley flood risk high. Trails closed. Very dangerous."},
      aug:{r:3,d:"Most dangerous month. Flash floods and landslides frequent. Do not trek high routes."},
      sep:{r:6,d:"Monsoon ending. Lower routes reopening. Upper passes closing due to early snow."},
      oct:{r:8,d:"Best autumn window. Crystal clear. Valley vivid. Lower treks beautiful. Upper passes closing."},
      nov:{r:4,d:"First heavy snow. Valley quickly becoming inaccessible. Season ending rapidly."},
      dec:{r:3,d:"Deep winter. Valley closed. Extreme cold. Only lowest sections accessible."},
    }
  },
  {
    country:"India", region:"North", place:"Leh",
    worstTimes:"Jan–Feb (extreme cold -20°C, roads completely closed, altitude of 3500m intensifies everything)",
    months:{
      jan:{r:3,d:"Extreme cold (-20°C nights). Chadar Trek on frozen Zanskar — for serious adventurers only."},
      feb:{r:3,d:"Still extreme cold. Chadar Trek possible. Roads to Pangong and Nubra closed. Very demanding."},
      mar:{r:4,d:"Cold but improving. Road from Srinagar opening. Early spring light on monasteries."},
      apr:{r:6,d:"Srinagar-Leh road opens. Apricot blossoms in villages. Cold nights but beautiful days."},
      may:{r:7,d:"Roads opening. Altitude acclimatization needed. Cool and clear. Monasteries peaceful."},
      jun:{r:9,d:"Ideal month. Clear skies, all passes open, Pangong Lake accessible. Best weather."},
      jul:{r:8,d:"Peak season. Warm days (25°C), stunning landscapes. Hemis Festival. Some road disruption."},
      aug:{r:7,d:"Very good. All passes accessible. Festivals. Roads can be cut by rain but usually clear fast."},
      sep:{r:9,d:"Outstanding. Post-monsoon clarity. Fewer tourists than July. Perfect photography conditions."},
      oct:{r:7,d:"Excellent early October. Manali-Leh road closing mid-month. Cold nights. Beautiful colours."},
      nov:{r:3,d:"Roads mostly closed. Very cold. Accessible only by flight. Monasteries quiet."},
      dec:{r:3,d:"Extreme winter. Pangong frozen. Roads closed. Chadar Trek preparation. Not for general visits."},
    }
  },
  {
    country:"India", region:"North", place:"Kashmir",
    worstTimes:"Dec–Feb (heavy snowfall; Srinagar sometimes cut off, roads dangerous, extreme cold)",
    months:{
      jan:{r:4,d:"Heavy snow (-5°C). Dal Lake sometimes frozen. Skiing at Gulmarg excellent. For snow lovers."},
      feb:{r:5,d:"Snow. Gulmarg skiing excellent. Srinagar beautiful in snow. Cold but manageable."},
      mar:{r:7,d:"Snow melting. Almond orchards blooming. Dal Lake thawing. Beautiful transition."},
      apr:{r:8,d:"Cherry blossoms. Tulip gardens peak. Dal Lake houseboats returning. Beautiful conditions."},
      may:{r:9,d:"One of the best months. Dal Lake houseboats idyllic, tulip gardens blooming, Gulmarg green."},
      jun:{r:9,d:"Peak season. Perfect temperatures (22–25°C). Pahalgam lush, meadows blooming."},
      jul:{r:8,d:"Very warm but gorgeous. Sonamarg and Thajiwas glacier accessible. Amarnath Yatra pilgrimage."},
      aug:{r:7,d:"Warm. Some rain. High passes accessible. Amarnath Yatra concludes. Still beautiful."},
      sep:{r:8,d:"Excellent. Chinar trees beginning to turn gold. Cooler and crystal clear. Photography superb."},
      oct:{r:9,d:"Outstanding. Chinar trees in full autumn gold. Dal Lake reflections extraordinary. Best foliage."},
      nov:{r:6,d:"First snowfall. Dal Lake getting cold. Some houseboats closing. Beautiful but cold."},
      dec:{r:4,d:"Heavy snow. Dal Lake potentially frozen. Srinagar very cold. Gulmarg ski season starting."},
    }
  },
  {
    country:"India", region:"North", place:"Shimla",
    worstTimes:"Jul–Aug (heavy monsoon; landslides on Kalka-Shimla road, toy train frequently disrupted)",
    months:{
      jan:{r:6,d:"Heavy snow on Mall Road. Winter wonderland. Toy train running. Cold but atmospheric."},
      feb:{r:6,d:"Still snowy. Cold. Toy train beautiful in snow. Less crowded than peak."},
      mar:{r:7,d:"Snow melting. Rhododendrons blooming. Toy train running well. Very pleasant."},
      apr:{r:8,d:"Excellent. Warming up. Apple orchards blooming. Jakhu temple accessible. Crowds building."},
      may:{r:8,d:"Very popular — cool (18°C) escape when plains burn. Mall Road and Jakhu fun."},
      jun:{r:7,d:"Pre-monsoon. Still pleasant and cooler than Delhi. Great escape. Light rain adds atmosphere."},
      jul:{r:5,d:"Monsoon. Landslides on mountain roads. Toy train disrupted. Hill atmosphere beautiful but risky."},
      aug:{r:5,d:"Heavy rain. Landslides possible. Roads sometimes closed. Very green but limited access."},
      sep:{r:7,d:"Monsoon easing. Roads clearing. Rhododendrons gone but Shimla pleasant again."},
      oct:{r:9,d:"Best month. Clear blue skies, crisp air, apple harvest. Mall Road vivid. Outstanding."},
      nov:{r:7,d:"Very good. Clear and cool. First hints of snow possible on higher areas. Beautiful."},
      dec:{r:6,d:"Cold. Snow possible late month. Christmas atmosphere. Toy train in snow very photogenic."},
    }
  },
  // ─── INDIA — WEST ──────────────────────────────────────────────────────────
  {
    country:"India", region:"West", place:"Goa (Arambol)",
    worstTimes:"Jun–Sep (southwest monsoon; beaches closed by lifeguards, rip currents dangerous, most shacks close)",
    months:{
      jan:{r:9,d:"Peak season. Arambol Beach buzzing. Warm (28°C), sunny, calm sea. Full hippie/bohemian scene."},
      feb:{r:9,d:"Excellent. Beach at its best. Market stalls and cafes full. Water sports all running."},
      mar:{r:8,d:"Still good. Getting warmer. Slightly fewer tourists. Beach parties and sunset scene great."},
      apr:{r:7,d:"Hot (34°C). Beach still accessible. Scene beginning to wind down. Pre-monsoon specials."},
      may:{r:4,d:"Season winding down. Beach shacks closing. Heat and humidity intense. Last deals available."},
      jun:{r:2,d:"Full monsoon. Beaches closed. Rip currents dangerous. Almost all tourists gone."},
      jul:{r:2,d:"Heavy rain and rough seas. Arambol very quiet. Lush Goa for adventurous off-season only."},
      aug:{r:2,d:"Monsoon continuing. Very heavy rain. Beach inaccessible. Not recommended."},
      sep:{r:4,d:"Monsoon easing. Some brave beach access late month. Town slowly reopening."},
      oct:{r:6,d:"Monsoon ending. Beaches returning. Early season deals. Pre-peak atmosphere."},
      nov:{r:8,d:"Excellent. Dry season returns. Beach scene rebuilding. Good value before peak crowds."},
      dec:{r:9,d:"Peak season. Christmas and New Year very lively. Beach at its finest. Book well ahead."},
    }
  },
  {
    country:"India", region:"West", place:"Pushkar",
    worstTimes:"May–Jun (extreme heat 42°C+; desert town becomes uncomfortably hot for most visitors)",
    months:{
      jan:{r:8,d:"Cool (15°C nights) and dry. Brahma temple and sacred lake beautiful. Comfortable sightseeing."},
      feb:{r:8,d:"Very pleasant. Cool and sunny. Desert town in peak condition. Good camel rides."},
      mar:{r:8,d:"Excellent. Warm (28°C), dry, clear. Rose festival possible. Best time before heat builds."},
      apr:{r:6,d:"Hot (38°C). Still manageable with early morning visits. Desert landscape vivid."},
      may:{r:3,d:"Brutal heat. Dangerous outdoor conditions at midday. Not recommended for most travelers."},
      jun:{r:4,d:"Pre-monsoon humidity. Still hot. Occasional dust storms. Some atmospheric quality."},
      jul:{r:5,d:"Monsoon arrives and brings some relief (30–32°C). Town takes on a different character."},
      aug:{r:5,d:"Monsoon rain. Green desert around town is a rare sight. Humidity high. Temples accessible."},
      sep:{r:6,d:"Cooling. Rains ending. Preparing for camel fair season. Good shoulder month."},
      oct:{r:8,d:"Excellent. Cool and clear. Camel fair preparation. Local life very engaging."},
      nov:{r:10,d:"Best month. World-famous Pushkar Camel Fair — extraordinary spectacle. Magical atmosphere."},
      dec:{r:8,d:"Good. Cool and comfortable. Brahma temple peaceful. Desert walks enjoyable."},
    }
  },
  // ─── INDIA — SOUTH ─────────────────────────────────────────────────────────
  {
    country:"India", region:"South", place:"Kerala",
    worstTimes:"Jun–Jul (southwest monsoon strongest; backwaters can flood, houseboat routes disrupted)",
    months:{
      jan:{r:9,d:"Best month. Dry, warm (28°C). Backwaters calm, Munnar tea estates clear. Whale watching off coast."},
      feb:{r:9,d:"Excellent. Low humidity, clear skies. All Kerala accessible and beautiful."},
      mar:{r:8,d:"Good. Getting warmer. Pre-monsoon. Theyyam festival in north Kerala."},
      apr:{r:7,d:"Hot and humid. Last good window before monsoon. Backwaters still beautiful."},
      may:{r:6,d:"Just before monsoon. Warm and green. Backwaters and Munnar last good window."},
      jun:{r:6,d:"Monsoon Ayurvedic season — many resorts offer monsoon packages. Backwaters lush. Wellness focus."},
      jul:{r:6,d:"Full monsoon. Houseboat cruises still run. Tea estates misty and beautiful. Therapeutic."},
      aug:{r:7,d:"Monsoon easing. Onam festival (harvest). Kerala at its most culturally vibrant."},
      sep:{r:7,d:"Good. Monsoon receding. Backwaters green and beautiful. Fewer tourists, good deals."},
      oct:{r:7,d:"Good transition. Some rain. Both coasts beginning to become accessible."},
      nov:{r:8,d:"Dry season returning. Backwaters and beaches both accessible. Very comfortable."},
      dec:{r:9,d:"Excellent. Cool and dry. Christmas celebrations on the coast. Best alongside January."},
    }
  },
  {
    country:"India", region:"South", place:"Varkala",
    worstTimes:"Jun–Aug (monsoon; cliff beach closed by lifeguards, enormous waves, rip currents)",
    months:{
      jan:{r:9,d:"Best month. Cliff path restaurants open. Calm sea. Yoga retreats in full swing."},
      feb:{r:9,d:"Excellent. Warm, sunny, calm sea. Beach at its most beautiful. Uncrowded relative to Dec/Jan."},
      mar:{r:8,d:"Good. Warm and sunny. Last comfortable month before heat builds."},
      apr:{r:7,d:"Hot. Beach still accessible. Some pre-monsoon swell. Cliff cafes still open."},
      may:{r:5,d:"Last gasps of beach season. Waves picking up. Cliff path cafes closing one by one."},
      jun:{r:2,d:"Monsoon. Cliff beach inaccessible. Town very quiet. Yoga retreats still running."},
      jul:{r:2,d:"Rough seas, cliff erosion risk. Green clifftop but beach is gone. Not a beach trip."},
      aug:{r:3,d:"Monsoon easing. Still very rough. Beach inaccessible. Yoga-focused visitors only."},
      sep:{r:5,d:"Improving. Cliff path reopening. Some beach access on calmer days."},
      oct:{r:7,d:"Good recovery. Beach mostly accessible. Deals available. Pre-season atmosphere."},
      nov:{r:8,d:"Dry season. Cliff beach returning to life. Yoga retreats filling up. Beautiful."},
      dec:{r:9,d:"Peak season. Cliff path restaurants all open. Calm sea. Excellent conditions."},
    }
  },
  {
    country:"India", region:"South", place:"Munnar",
    worstTimes:"Oct (northeast monsoon peak; severe landslides, waterfalls flood trails)",
    months:{
      jan:{r:8,d:"Cool (8–15°C), mostly dry. Tea estates in full production. Eravikulam NP peak season."},
      feb:{r:8,d:"Excellent. Clear mornings. Nilgiri Tahr sightings at Eravikulam. Very photogenic."},
      mar:{r:8,d:"Very good. Pre-monsoon tea country in full harvest. Cool, refreshing escape."},
      apr:{r:7,d:"Good. Warming slightly. Rhododendrons and wild flowers. Comfortable hiking."},
      may:{r:7,d:"Pre-monsoon. Tea estates in full harvest. Cool and refreshing escape from heat."},
      jun:{r:6,d:"Monsoon starts. Tea estates dramatically misty. Some roads muddy. Very beautiful."},
      jul:{r:6,d:"Heavy rain but tea estates ethereally beautiful in mist. Waterfalls spectacular."},
      aug:{r:7,d:"Good. Some clearer windows. Tea estates lush. Mattupetty Dam full and beautiful."},
      sep:{r:7,d:"Still some rain but improving. Hill station pleasant and green. Good value."},
      oct:{r:4,d:"Heaviest northeast monsoon rain. Major landslide risk. Roads sometimes closed. Avoid."},
      nov:{r:7,d:"Improving rapidly. Tea estates post-harvest. Clear skies returning. Good shoulder season."},
      dec:{r:8,d:"Excellent. Cool and clear. Tea country beautiful. Eravikulam NP open. Great conditions."},
    }
  },
  {
    country:"India", region:"South", place:"Hampi",
    worstTimes:"Apr–Jun (extreme heat 40°C+; the boulder landscape becomes an oven, dangerous to explore midday)",
    months:{
      jan:{r:9,d:"Best month. Cool (20°C), dry. Ruins exploration comfortable all day. Photography excellent."},
      feb:{r:9,d:"Excellent. Comfortable temperatures. Virupaksha Temple and Vittala Temple stunning."},
      mar:{r:8,d:"Good. Warming up (30°C). Still very manageable with early/late visits."},
      apr:{r:3,d:"Dangerously hot (40°C+). Only dawn and dusk exploration possible. Not recommended."},
      may:{r:3,d:"Extreme heat. Ruins exploration hazardous at midday. Not recommended for most visitors."},
      jun:{r:5,d:"Monsoon arrives — huge relief. Tungabhadra River fills up. Ruins dramatic against grey skies."},
      jul:{r:6,d:"Green monsoon Hampi. Boulders draped in vegetation. River high. Great for photography."},
      aug:{r:6,d:"Lush and green. River full. Virupapur Gadde island in full monsoon beauty. Atmospheric."},
      sep:{r:7,d:"Monsoon easing. River still full. Ruins and rice fields beautiful. Comfortable temperatures."},
      oct:{r:8,d:"Excellent. Dry returning. Tungabhadra calming. Ruins vivid in post-rain air. Very photogenic."},
      nov:{r:9,d:"Outstanding. Cool and clear. All ruins accessible all day. Photography light superb."},
      dec:{r:9,d:"Best alongside January. Cool, dry, ruins perfect. Backpacker community at its most lively."},
    }
  },
  {
    country:"India", region:"South", place:"Bangalore",
    worstTimes:"Oct–Nov (northeast monsoon; severe traffic flooding, commuting disrupted)",
    months:{
      jan:{r:8,d:"Pleasant (22–28°C). City's café, brewery and restaurant scene thriving. Nandi Hills accessible."},
      feb:{r:8,d:"Excellent. Cool and comfortable. Good time for day trips to Coorg and Mysore."},
      mar:{r:8,d:"Very good. Warm and mostly dry. Garden City earning its name with blooming parks."},
      apr:{r:7,d:"Pre-monsoon. Thunder showers start. Hot but manageable. Lalbagh Botanical Garden beautiful."},
      may:{r:7,d:"Pleasant by Indian standards (28°C). Tech city's café, brewery and food scene thriving."},
      jun:{r:7,d:"Monsoon brings cool relief. Garden City earns its name. Parks beautiful. Mild and manageable."},
      jul:{r:7,d:"Cool and green. Nandi Hills and Coorg day trips lush. Good conditions overall."},
      aug:{r:7,d:"Good. Monsoon continuing but manageable. Gardens beautiful. Good food and culture scene."},
      sep:{r:7,d:"Good. Rain easing. City very liveable. Coorg and Chikmagalur coffee estates beautiful."},
      oct:{r:5,d:"Northeast monsoon. Heavy flooding possible. Traffic disrupted. Indoor Bangalore still excellent."},
      nov:{r:6,d:"Some rain continues. Improving through month. Tech city culture and food always accessible."},
      dec:{r:8,d:"Excellent. Cool and dry. Christmas events. Garden city at its most pleasant."},
    }
  },
  {
    country:"India", region:"South", place:"Cochin (Kochi)",
    worstTimes:"Jun–Jul (southwest monsoon at its peak; Fort Kochi streets flood, ferry services disrupted)",
    months:{
      jan:{r:9,d:"Best month. Dry, comfortable (28°C). Chinese fishing nets at sunrise magical. Fort Kochi beautiful."},
      feb:{r:9,d:"Excellent. Clear skies. Fort Kochi heritage walk superb. Backwaters calm and accessible."},
      mar:{r:8,d:"Good. Warming up. Thrissur Pooram festival (April/May approaching). All sights accessible."},
      apr:{r:7,d:"Hot and humid. Thrissur Pooram elephant festival — extraordinary cultural spectacle."},
      may:{r:6,d:"Getting humid and wet. Fort Kochi heritage walks still lovely. Chinese fishing nets in mist."},
      jun:{r:5,d:"Heavy monsoon. Fort Kochi streets flood. Spice markets, synagogue and heritage charm persist."},
      jul:{r:6,d:"Rain easing slightly. Backwaters and houseboats still running. City manages monsoon gracefully."},
      aug:{r:7,d:"Good. Monsoon weakening. Onam festival preparations. Kerala culture very vibrant."},
      sep:{r:7,d:"Good. Rain mostly over. Fort Kochi and backwaters both beautiful. Good value month."},
      oct:{r:7,d:"Transitional. Some rain. Improving conditions. Kochi-Muziris Biennale preparation."},
      nov:{r:8,d:"Dry season returning. Fort Kochi very pleasant. Art scene thriving (Biennale often Nov-Feb)."},
      dec:{r:9,d:"Excellent. Cool and dry. Christmas in Fort Kochi very atmospheric. Top conditions."},
    }
  },
  // ─── INDIA — EAST/NORTHEAST ────────────────────────────────────────────────
  {
    country:"India", region:"East/Northeast", place:"Sikkim",
    worstTimes:"Jun–Aug (heavy monsoon; major landslides block roads frequently, trekking dangerous)",
    months:{
      jan:{r:5,d:"Cold (-5°C at higher altitude). Some roads closed. Pelling views of Kangchenjunga superb on clear days."},
      feb:{r:5,d:"Cold. Rhododendrons beginning at lower altitudes. Roads partly accessible."},
      mar:{r:7,d:"Rhododendrons beginning to bloom. Warmer. Roads opening. Monasteries peaceful."},
      apr:{r:8,d:"Excellent. Rhododendrons and orchids peak bloom. Goecha La trek opening. Beautiful."},
      may:{r:8,d:"Outstanding. Rhododendrons and orchids blooming. Gangtok views of Kangchenjunga. Trekking available."},
      jun:{r:5,d:"Monsoon arrives. Trekking routes close. Monastery visits and Gangtok town still worthwhile."},
      jul:{r:4,d:"Heavy rain. Landslides common. High passes closed. Monasteries and cultural Sikkim accessible."},
      aug:{r:4,d:"Very wet. Landslide risk high. Limited trekking. Monasteries and Gangtok still accessible."},
      sep:{r:6,d:"Monsoon ending. Rhododendrons gone but valleys lush. Roads reopening. Improving quickly."},
      oct:{r:9,d:"Best month. Crystal clear, Kangchenjunga views stunning. All treks accessible. Superb."},
      nov:{r:8,d:"Excellent. Clear and cold. High passes accessible. Fewer tourists. Outstanding photography."},
      dec:{r:5,d:"Very cold. High altitudes snowed in. Monasteries and Gangtok town accessible."},
    }
  },
  // ─── INDIA — COASTAL KARNATAKA ─────────────────────────────────────────────
  {
    country:"India", region:"Coastal Karnataka", place:"Om Beach",
    worstTimes:"Jun–Sep (violent southwest monsoon; Om Beach completely inaccessible, dangerous waves)",
    months:{
      jan:{r:9,d:"Best month. Gokarna beaches calm. Om Beach, Half Moon Beach pristine. Backpacker scene buzzing."},
      feb:{r:9,d:"Excellent. Clear sea, warm. Beaches beautiful and less crowded than Goa. Paradise."},
      mar:{r:8,d:"Good. Warm and sunny. Beach season in full swing. Water sports available."},
      apr:{r:7,d:"Hot. Beach still accessible. Pre-monsoon. Some wind and swell building."},
      may:{r:5,d:"Pre-monsoon. Heat and humidity. Beach still accessible but infrastructure winding down."},
      jun:{r:2,d:"Full monsoon. Om Beach closed. Waves enormous. Gokarna temple town has own monsoon charm."},
      jul:{r:2,d:"Rough seas, heavy rain. Beach inaccessible. Not a beach destination."},
      aug:{r:2,d:"Monsoon continuing. Beach closed. Mahabaleshwar temple area and cultural Gokarna accessible."},
      sep:{r:4,d:"Monsoon easing. Beach slowly becoming accessible late month. Infrastructure reopening."},
      oct:{r:6,d:"Good recovery. Beaches reopening. Some swell remaining. Excellent deals available."},
      nov:{r:8,d:"Dry season returning. Beaches beautiful. Backpacker community returning. Good vibe."},
      dec:{r:9,d:"Peak season. All Gokarna beaches beautiful and calm. Christmas backpacker crowd arrives."},
    }
  },
  // ─── TAIWAN ────────────────────────────────────────────────────────────────
  {
    country:"Taiwan", region:"Cities", place:"Taipei",
    worstTimes:"Jul–Sep (typhoon season; direct hits possible, extreme rainfall, some days dangerous)",
    months:{
      jan:{r:6,d:"Cool (12–18°C) and drizzly. Night markets and hot spring season. Indoor culture excellent."},
      feb:{r:6,d:"Still cool and rainy. Lantern Festival (after Chinese New Year) beautiful. Crowds building."},
      mar:{r:7,d:"Improving. Warming up. Yangmingshan flowers blooming. Cherry blossoms possible late March."},
      apr:{r:8,d:"Excellent. Warm (22–26°C). Alishan cherry blossoms. Jiufen beautiful. Manageable crowds."},
      may:{r:7,d:"Warm and lush. Dragon Boat Festival approaching. Street food and night markets in full swing."},
      jun:{r:6,d:"Hot and rainy. Plum rains (meiyu) season. Jiufen and Shifen atmospheric in mist."},
      jul:{r:6,d:"Hot, humid and typhoon risk begins. Indoor culture (temples, markets, food) excellent."},
      aug:{r:5,d:"Peak typhoon season. Very hot. Direct hits possible. Plan flexibly. Night markets still great."},
      sep:{r:5,d:"Typhoon risk continues through September. Very hot. Some disruptions possible."},
      oct:{r:8,d:"Excellent. Typhoon risk dropping. Comfortable temperatures (22–26°C). Best autumn month."},
      nov:{r:9,d:"Outstanding. Cool, dry, clear. Jiufen atmospheric. Night markets excellent. Best month."},
      dec:{r:7,d:"Cool and somewhat rainy. Festive atmosphere. Night markets excellent. Good cultural time."},
    }
  },
];

// ─── UI COMPONENTS ───────────────────────────────────────────────────────────
const RATING_COLORS = [
  "", // 0 unused
  "#c0392b", // 1
  "#e74c3c", // 2
  "#e67e22", // 3
  "#f39c12", // 4
  "#f1c40f", // 5
  "#d4ac0d", // 6
  "#27ae60", // 7
  "#1e8449", // 8
  "#148f77", // 9
  "#117864", // 10
];

const RATING_LABELS = [
  "","Avoid","Avoid","Poor","Below Avg","Average",
  "Decent","Good","Great","Excellent","Perfect"
];

const countries = [...new Set(data.map(d => d.country))];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [sortBy, setSortBy] = useState(null); // null = natural, or a month key

  const filtered = useMemo(() => {
    return data.filter(d => {
      const countryMatch = selectedCountry === "All" || d.country === selectedCountry;
      const searchMatch = !search ||
        d.place.toLowerCase().includes(search.toLowerCase()) ||
        d.country.toLowerCase().includes(search.toLowerCase()) ||
        d.region.toLowerCase().includes(search.toLowerCase());
      return countryMatch && searchMatch;
    });
  }, [selectedCountry, search]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    return [...filtered].sort((a, b) => (b.months[sortBy]?.r || 0) - (a.months[sortBy]?.r || 0));
  }, [filtered, sortBy]);

  const grouped = useMemo(() => {
    if (sortBy) return { "Sorted by rating": sorted };
    const g = {};
    sorted.forEach(d => {
      if (!g[d.country]) g[d.country] = {};
      if (!g[d.country][d.region]) g[d.country][d.region] = [];
      g[d.country][d.region].push(d);
    });
    return g;
  }, [sorted, sortBy]);

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

  const monthsToShow = selectedMonth ? [selectedMonth] : ALL_MONTHS;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e16", fontFamily: "'DM Sans', sans-serif", color: "#d8e4f0", paddingBottom: 80 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "linear-gradient(160deg, #0f1927 0%, #0a0e16 70%)", borderBottom: "1px solid #182435", padding: "40px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: "#3d7a9e", fontWeight: 600, marginBottom: 12, textTransform: "uppercase" }}>Asia Travel Weather Guide</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 5vw, 50px)", fontWeight: 900, margin: 0, background: "linear-gradient(90deg, #6ab4d4, #a8d4e8, #6ab4d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>
          Best Times to Visit
        </h1>
        <p style={{ color: "#3d6a80", fontSize: 13, marginTop: 10, fontWeight: 300 }}>
          55 destinations · 12 months each · Accurate seasonal ratings
        </p>
      </div>

      {/* STICKY CONTROLS */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0a0e16ee", backdropFilter: "blur(14px)", borderBottom: "1px solid #182435", padding: "12px 16px" }}>

        {/* Search + country filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <input
            placeholder="🔍 Search destination…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "#111b27", border: "1px solid #1e3045", borderRadius: 8, padding: "7px 13px", color: "#d8e4f0", fontSize: 13, width: 190, outline: "none" }}
          />
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {["All", ...countries].map(c => (
              <button key={c} onClick={() => setSelectedCountry(c)} style={{
                padding: "5px 11px", borderRadius: 18, border: "1px solid",
                borderColor: selectedCountry === c ? "#5aa0c0" : "#182435",
                background: selectedCountry === c ? "#5aa0c015" : "transparent",
                color: selectedCountry === c ? "#7ec8e3" : "#3d6a80",
                cursor: "pointer", fontSize: 11, fontWeight: selectedCountry === c ? 700 : 400,
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Month filter + sort */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#2a4a60", letterSpacing: 2, textTransform: "uppercase", marginRight: 4 }}>Filter/Sort:</span>
          {ALL_MONTHS.map(m => (
            <button key={m} onClick={() => {
              if (selectedMonth === m) { setSelectedMonth(null); setSortBy(null); }
              else { setSelectedMonth(m); setSortBy(m); }
            }} style={{
              padding: "4px 10px", borderRadius: 16, border: "1px solid",
              borderColor: selectedMonth === m ? "#7ec8e3" : "#182435",
              background: selectedMonth === m ? "#7ec8e322" : "transparent",
              color: selectedMonth === m ? "#7ec8e3" : "#3d6a80",
              cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
            }}>{MONTH_LABELS[m]}</button>
          ))}
          {selectedMonth && <button onClick={() => { setSelectedMonth(null); setSortBy(null); }} style={{ padding: "4px 10px", borderRadius: 16, border: "1px solid #3d6a80", background: "transparent", color: "#3d6a80", cursor: "pointer", fontSize: 11 }}>✕ All months</button>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 14px" }}>
        {Object.entries(grouped).map(([country, regsOrArr]) => {
          const isSorted = sortBy && country === "Sorted by rating";
          return (
            <div key={country} style={{ marginBottom: 44 }}>
              {!isSorted && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #182435" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: 0, color: "#a8d0e0", fontWeight: 700 }}>{country}</h2>
                </div>
              )}

              {isSorted ? (
                <PlaceList places={sorted} monthsToShow={monthsToShow} expanded={expanded} toggle={toggle} selectedMonth={selectedMonth} />
              ) : (
                Object.entries(regsOrArr).map(([region, places]) => (
                  <div key={region} style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 13, letterSpacing: 3, color: "#3b6d92", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>{region}</div>
                    <PlaceList places={places} monthsToShow={monthsToShow} expanded={expanded} toggle={toggle} selectedMonth={selectedMonth} />
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

function PlaceList({ places, monthsToShow, expanded, toggle, selectedMonth }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {places.map(place => {
        const key = `${place.country}-${place.region}-${place.place}`;
        const isOpen = expanded[key];

        // build month strip
        const visibleMonths = monthsToShow;

        return (
          <div key={key} style={{ background: "#0f1927", border: `1px solid ${isOpen ? "#2a4a65" : "#182435"}`, borderRadius: 12, overflow: "hidden" }}>

            {/* ROW */}
            <div onClick={() => toggle(key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer", userSelect: "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#c8e0ec" }}>{place.place}</div>
                {selectedMonth && (
                  <div style={{ fontSize: 11, color: "#2e5570", marginTop: 2 }}>{place.country} · {place.region}</div>
                )}
              </div>

              {/* Month pills */}
              <div style={{ display: "flex", gap: 3, flexWrap: "nowrap", overflowX: "auto" }}>
                {visibleMonths.map(m => {
                  const info = place.months[m];
                  if (!info) return null;
                  const r = info.r;
                  const color = RATING_COLORS[r];
                  return (
                    <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 36 }}>
                      <div style={{ fontSize: 9, color: "#2a4a65", marginBottom: 2 }}>{MONTH_LABELS[m]}</div>
                      <div style={{
                        background: color + "20", border: `1px solid ${color}50`,
                        borderRadius: 6, padding: "3px 0", width: 36, textAlign: "center",
                        fontSize: 12, fontWeight: 800, color,
                      }}>{r}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ color: "#1e3a50", fontSize: 18, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none", marginLeft: 4 }}>›</div>
            </div>

            {/* EXPANDED */}
            {isOpen && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid #182435", paddingTop: 14 }}>
                {/* Worst times */}
                <div style={{ background: "#1a0c0c", border: "1px solid #3d1a1a", borderRadius: 8, padding: "9px 13px", marginBottom: 14, fontSize: 12.5, color: "#b06060" }}>
                  <span style={{ fontWeight: 700, color: "#d05050" }}>⚠ Worst times to visit: </span>
                  {place.worstTimes}
                </div>

                {/* Monthly grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 8 }}>
                  {visibleMonths.map(m => {
                    const info = place.months[m];
                    if (!info) return null;
                    const r = info.r;
                    const color = RATING_COLORS[r];
                    return (
                      <div key={m} style={{ background: "#0a0e16", border: `1px solid ${color}28`, borderRadius: 10, padding: "11px 13px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "#a8ccd8" }}>{MONTH_LABELS[m]}</span>
                          <div style={{ background: color + "22", border: `1px solid ${color}55`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 800, color }}>
                            {r}/10
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: "#3d7a9e", fontStyle: "italic", fontSize: 10, marginBottom: 4 }}>{RATING_LABELS[r]}</div>
                        <p style={{ fontSize: 12, color: "#527a8a", margin: 0, lineHeight: 1.55 }}>{info.d}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}