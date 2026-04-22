import { useState, useMemo } from "react";

const data = [
  // PHILIPPINES
  {
    country: "Philippines", region: "Palawan", place: "El Nido",
    worstTimes: "Aug–Oct (peak typhoon season; most tours cancelled, flooding common)",
    months: {
      may: { rating: 6, desc: "Transitioning to wet season. Some rain but still diveable and beautiful. Crowds thin out. Occasional storms." },
      jun: { rating: 4, desc: "Rainy season begins in earnest. Many boat tours get cancelled. Lush scenery but unpredictable weather." },
      jul: { rating: 3, desc: "Heavy rains and rough seas. Island-hopping often suspended. Not recommended for beach holidays." }
    }
  },
  {
    country: "Philippines", region: "Palawan", place: "Coron",
    worstTimes: "Aug–Oct (typhoon season; diving trips cancelled, visibility poor)",
    months: {
      may: { rating: 6, desc: "Shoulder season — fewer crowds, some rain. Wreck diving still good, lagoons accessible most days." },
      jun: { rating: 4, desc: "Wet season starts. Rain increases, some dive trips cut short. Budget travelers find good deals." },
      jul: { rating: 3, desc: "Frequent rain and rougher conditions. Visibility underwater drops. Some operators close." }
    }
  },
  {
    country: "Philippines", region: "Cities/Islands", place: "Manila",
    worstTimes: "Jul–Oct (typhoon season; flooding, transport disruptions)",
    months: {
      may: { rating: 5, desc: "Hot and very humid, reaching 35°C+. Occasional afternoon storms. Best explored via air-conditioned venues." },
      jun: { rating: 4, desc: "Rainy season begins. Traffic worsens with flooding. Indoor attractions (museums, food scene) still great." },
      jul: { rating: 3, desc: "Peak typhoon risk. Heavy downpours, some days impassable. City life continues but travel is harder." }
    }
  },
  {
    country: "Philippines", region: "Cities/Islands", place: "Boracay",
    worstTimes: "Jul–Oct (habagat/monsoon season; rough waves, White Beach gets windy and rough)",
    months: {
      may: { rating: 6, desc: "Early habagat begins. Still warm, some sun. Crowds dropping after peak season. Occasional squalls." },
      jun: { rating: 4, desc: "Southwest monsoon in full swing. Waves on White Beach get rough. Kitesurfers love it, swimmers less so." },
      jul: { rating: 4, desc: "Windy and wavy — actually excellent for kitesurfing and surfing. Beach is less crowded. Rain comes and goes." }
    }
  },
  {
    country: "Philippines", region: "Cities/Islands", place: "Siargao",
    worstTimes: "Nov–Jan (typhoon risk and strong swells can overwhelm beginners)",
    months: {
      may: { rating: 7, desc: "Pre-peak surf season. Waves building at Cloud 9. Green, lush island. Great for intermediate surfers." },
      jun: { rating: 8, desc: "Surf season heats up. Consistent swells. Island is vibrant, less packed than Dec. Rain is manageable." },
      jul: { rating: 8, desc: "Prime surf conditions. Cloud 9 firing. Social scene buzzing. Some rain but surfers don't mind." }
    }
  },
  {
    country: "Philippines", region: "Cities/Islands", place: "Bohol",
    worstTimes: "Jul–Oct (typhoon season; some tours cancelled)",
    months: {
      may: { rating: 6, desc: "Getting wetter but Chocolate Hills and tarsier tours still run. Fewer tourists, pleasant temps." },
      jun: { rating: 5, desc: "Rain increases. River cruises and countryside tours may be affected. Diving at Balicasag still possible." },
      jul: { rating: 4, desc: "Wet and sometimes stormy. Outdoor adventures less reliable. Budget accommodations available." }
    }
  },

  // CAMBODIA
  {
    country: "Cambodia", region: "Cities/Regions", place: "Phnom Penh",
    worstTimes: "Jun–Sep (heavy monsoon rains, flooding in low-lying areas)",
    months: {
      may: { rating: 6, desc: "Hot (35°C+) and humid. Rainy season approaching. Temples and museums still very doable. Fewer tourists." },
      jun: { rating: 5, desc: "Rains arrive. Streets can flood briefly. River views remain scenic. Good deals on hotels." },
      jul: { rating: 5, desc: "Frequent afternoon rain. City life continues normally. Mekong and Tonle Sap begin to swell beautifully." }
    }
  },
  {
    country: "Cambodia", region: "Cities/Regions", place: "Siem Reap",
    worstTimes: "Aug–Sep (heaviest rain; paths around Angkor Wat flood, very muddy)",
    months: {
      may: { rating: 6, desc: "Heat eases slightly as rains begin. Angkor in early monsoon is lush and dramatic. Crowds thin." },
      jun: { rating: 6, desc: "Green season begins. Moats fill, reflections stunning. Rain mostly in afternoons. Fewer visitors." },
      jul: { rating: 6, desc: "Angkor Wat surrounded by water lilies — genuinely beautiful. Mud on some paths, but worth it." }
    }
  },
  {
    country: "Cambodia", region: "Cities/Regions", place: "Coastal Areas",
    worstTimes: "Jun–Oct (monsoon; Sihanoukville and Kep beaches often rough and rainy)",
    months: {
      may: { rating: 5, desc: "Sea getting rougher. Some beach days still fine but rain increasingly frequent." },
      jun: { rating: 3, desc: "Monsoon hits the coast hard. Many beach restaurants close. Not a beach holiday." },
      jul: { rating: 3, desc: "Heavy rain and rough seas. Most visitors skip the coast. Islands like Koh Rong are difficult to reach." }
    }
  },

  // NEPAL
  {
    country: "Nepal", region: "Kathmandu Valley", place: "Kathmandu",
    worstTimes: "Jun–Aug (monsoon; trails muddy, mountain views obscured by clouds and rain)",
    months: {
      may: { rating: 7, desc: "Pre-monsoon — warm, some haze but clear mornings. Last good window before rains. Trekking still possible." },
      jun: { rating: 5, desc: "Monsoon begins. Rain daily, leeches on trails, Himalayas often hidden. City sightseeing still fine." },
      jul: { rating: 4, desc: "Full monsoon. Green and atmospheric but mountain views nearly impossible. Mostly for culture seekers." }
    }
  },
  {
    country: "Nepal", region: "Pokhara Region", place: "Pokhara",
    worstTimes: "Jun–Aug (monsoon; Annapurna views hidden, paragliding cancelled on rainy days)",
    months: {
      may: { rating: 7, desc: "Last chance before monsoon. Rhododendrons blooming on trails. Paragliding and lake views still gorgeous." },
      jun: { rating: 4, desc: "Rain sets in. Fewa Lake swells, views of Machhapuchhre shrouded. Paragliding hit-or-miss." },
      jul: { rating: 4, desc: "Heavy rain, landslide risk on roads. Peaceful and lush but views are rare. Not for trekkers." }
    }
  },

  // INDONESIA
  {
    country: "Indonesia", region: "Bali", place: "Canggu",
    worstTimes: "Jan–Feb (wettest months; daily downpours, flooding on Batu Bolong road)",
    months: {
      may: { rating: 8, desc: "Dry season arriving. Surf improving at Echo Beach. Cafes, coworking and nightlife in full swing." },
      jun: { rating: 9, desc: "Peak dry season. Sunny, low humidity, perfect surf. Vibrant digital nomad scene. Ideal month." },
      jul: { rating: 9, desc: "Arguably the best month. Dry, warm, offshore winds perfect for surfing. Busy but for good reason." }
    }
  },

  // MALAYSIA
  {
    country: "Malaysia", region: "General", place: "Malaysia (General)",
    worstTimes: "Oct–Jan on the East Coast (monsoon); May–Sep can bring haze from Indonesian fires",
    months: {
      may: { rating: 6, desc: "KL is rainy but manageable. Perhentian Islands and East Coast open up (post-monsoon). Haze risk in some years." },
      jun: { rating: 7, desc: "East Coast islands (Perhentian, Tioman) at their best — clear turquoise water. KL humid but fine." },
      jul: { rating: 7, desc: "East Coast peak season. Excellent diving and beaches. West Coast (Langkawi, Penang) can be rainy." }
    }
  },

  // VIETNAM — NORTH
  {
    country: "Vietnam", region: "North", place: "Hanoi",
    worstTimes: "Jul–Aug (hottest and rainiest; temperatures hit 38°C with high humidity)",
    months: {
      may: { rating: 6, desc: "Getting hot and humid, approaching 35°C. Some rain. Still very functional for city exploration." },
      jun: { rating: 5, desc: "Hot and rainy. Afternoon downpours common. Old Quarter atmosphere still charming despite heat." },
      jul: { rating: 5, desc: "Peak heat and rain. Uncomfortable but manageable. Night markets, museums and street food still excellent." }
    }
  },
  {
    country: "Vietnam", region: "North", place: "Sapa",
    worstTimes: "Jan–Feb (coldest; can drop below 0°C, fog makes trekking difficult)",
    months: {
      may: { rating: 7, desc: "Rice terraces being planted — vivid green fields. Trekking comfortable. Some misty mornings add drama." },
      jun: { rating: 6, desc: "Lush terraces, waterfalls flowing. More rain and clouds but scenery is breathtaking. Leeches on trails." },
      jul: { rating: 6, desc: "Terraces bright green and dramatic. Rain and fog frequent but the landscape is at its most photogenic." }
    }
  },
  {
    country: "Vietnam", region: "North", place: "Cat Ba",
    worstTimes: "Nov–Mar (cold, grey and drizzly; Halong Bay boat trips uncomfortable)",
    months: {
      may: { rating: 8, desc: "Perfect — warm, clear waters, Halong Bay at its best before peak crowds. Kayaking and climbing ideal." },
      jun: { rating: 7, desc: "Warm and mostly fine. Some rain but Halong Bay limestone scenery still stunning." },
      jul: { rating: 6, desc: "Hot and humid. Occasional tropical storms. Peak summer for Vietnamese tourists — gets crowded." }
    }
  },
  {
    country: "Vietnam", region: "North", place: "Tam Coc",
    worstTimes: "Jun–Aug (hottest and most crowded with domestic tourists; flooding possible)",
    months: {
      may: { rating: 7, desc: "Golden rice fields being harvested in some areas. River boat rides through karsts are magical." },
      jun: { rating: 6, desc: "Lush and green. Some flooding of lower caves. Still very scenic but busier with local visitors." },
      jul: { rating: 5, desc: "Peak domestic tourist season. Hot, sometimes flooded channels. More noise and boat traffic." }
    }
  },
  {
    country: "Vietnam", region: "North", place: "Mai Chau",
    worstTimes: "Jun–Aug (heavy rain; hiking trails slippery, valley roads can flood)",
    months: {
      may: { rating: 7, desc: "Valley gorgeous and green. Cycling and trekking pleasant. Homestays cozy. Light rain occasionally." },
      jun: { rating: 6, desc: "Very lush, rice growing strongly. Rain most afternoons. Stilt house stays still lovely." },
      jul: { rating: 5, desc: "Wet and muddy in parts. Trekking limited. But the valley scenery in monsoon is remarkably beautiful." }
    }
  },

  // VIETNAM — CENTRAL
  {
    country: "Vietnam", region: "Central", place: "Da Nang",
    worstTimes: "Oct–Nov (typhoon season; heavy rain and dangerous beach conditions)",
    months: {
      may: { rating: 8, desc: "Hot and sunny — perfect beach weather. My Khe beach buzzing. Low crowds compared to summer." },
      jun: { rating: 8, desc: "Peak beach season. Sea warm and calm. Festivals in the city. Hot (32°C) but sea breezes help." },
      jul: { rating: 7, desc: "Hottest month. Excellent beach conditions. Dragon Bridge fire shows popular. Crowded but festive." }
    }
  },
  {
    country: "Vietnam", region: "Central", place: "Hoi An",
    worstTimes: "Oct–Nov (flood season; Ancient Town can be knee-deep in water)",
    months: {
      may: { rating: 8, desc: "Warm, dry, beautiful. Lanterns glowing, An Bang beach nearby. Excellent for cycling and tailoring visits." },
      jun: { rating: 8, desc: "Sunny and lively. Beach perfect. The Ancient Town shimmering in summer light. Highly recommended." },
      jul: { rating: 7, desc: "Very hot and occasionally heavy rain, but mostly fine. Vibrant atmosphere and great food scene." }
    }
  },
  {
    country: "Vietnam", region: "Central", place: "Phong Nha",
    worstTimes: "Sep–Nov (floods; caves access restricted, Phong Nha river rises dangerously)",
    months: {
      may: { rating: 8, desc: "Ideal cave-exploring conditions. Son Doong and Hang En treks available. Lush jungle, manageable heat." },
      jun: { rating: 7, desc: "Still accessible and green. Some cave tours may restrict deeper sections. Hot but spectacular." },
      jul: { rating: 7, desc: "Cave temperatures constant cool. Outdoor jungle areas hot. Good visiting window before Oct rains." }
    }
  },

  // VIETNAM — SOUTH
  {
    country: "Vietnam", region: "South", place: "Ho Chi Minh City",
    worstTimes: "Sep–Oct (heaviest rain; flash flooding common in District 1)",
    months: {
      may: { rating: 6, desc: "Rainy season starts. Hot (34°C). Showers mostly in afternoon — mornings still fine for sightseeing." },
      jun: { rating: 6, desc: "Regular rain but city never truly shuts down. Street food, museums and nightlife flourish rain or shine." },
      jul: { rating: 6, desc: "Wet but vibrant. Less humid than coast. Great food and café culture makes any weather bearable." }
    }
  },
  {
    country: "Vietnam", region: "South", place: "Da Lat",
    worstTimes: "Aug–Oct (heaviest rain; cool mist and mud; waterfalls flood trails)",
    months: {
      may: { rating: 7, desc: "Cool (18–22°C), refreshing escape from southern heat. Flower gardens blooming. Some afternoon rain." },
      jun: { rating: 6, desc: "Rainy season in effect. Misty and cool. Coffee shops and cozy stays make it atmospheric." },
      jul: { rating: 6, desc: "Frequent rain. Waterfalls spectacular. The pine forests feel moody and romantic in the mist." }
    }
  },
  {
    country: "Vietnam", region: "South", place: "Phu Quoc",
    worstTimes: "Jun–Oct (southwest monsoon; beaches on west side rough, visibility poor for snorkeling)",
    months: {
      may: { rating: 5, desc: "Monsoon approaching. Last weeks of reasonable weather. Some beach days still OK. Prices drop." },
      jun: { rating: 3, desc: "Monsoon in full effect. West beaches rough. Sea murky. Most snorkel/dive tours cancelled." },
      jul: { rating: 3, desc: "Worst month. Rough seas, heavy rain. Island largely deserted by tourists. Not recommended." }
    }
  },

  // THAILAND — NORTH
  {
    country: "Thailand", region: "North", place: "Chiang Mai",
    worstTimes: "Mar–Apr (smoke season; burning fields create severe air pollution — AQI dangerous)",
    months: {
      may: { rating: 7, desc: "Smoke season over, first rains wash air clean. Lush greenery. Temples beautiful. Cooler than Bangkok." },
      jun: { rating: 7, desc: "Rainy season, but rain is mostly afternoon/evening. Moat fills up. Doi Inthanon lush and cool." },
      jul: { rating: 7, desc: "Green and atmospheric. Trekking great, waterfalls full. Fewer tourists. Very pleasant despite rain." }
    }
  },
  {
    country: "Thailand", region: "North", place: "Chiang Rai",
    worstTimes: "Mar–Apr (haze and smoke from agricultural burning)",
    months: {
      may: { rating: 7, desc: "Air cleared. White Temple and Blue Temple vivid in green season light. Refreshing temperatures." },
      jun: { rating: 7, desc: "Lush hills, rice paddies bright green. Golden Triangle boat trips pleasant. Easy-going pace." },
      jul: { rating: 7, desc: "Beautiful countryside. Some roads in highlands get muddy. Cultural sites excellent year-round." }
    }
  },
  {
    country: "Thailand", region: "North", place: "Pai",
    worstTimes: "Mar–Apr (smoke; burning season makes valley hazy and unhealthy)",
    months: {
      may: { rating: 7, desc: "Air finally clean. Valley blooms. Canyon and waterfall hikes superb. Bohemian crowd returns." },
      jun: { rating: 7, desc: "Green season charm at its peak. Waterfalls roaring. Quiet roads. Hippie town vibe without crowds." },
      jul: { rating: 7, desc: "Lush valley. Mae Yen waterfall impressive. Some road flooding near canyon. Great value stays." }
    }
  },

  // THAILAND — CENTRAL
  {
    country: "Thailand", region: "Central", place: "Bangkok",
    worstTimes: "Sep–Oct (heaviest rain and flooding; streets inundated in some districts)",
    months: {
      may: { rating: 6, desc: "Hot (35°C+) and humid, rain starting. Temples, markets and rooftop bars still ideal. A/C essential." },
      jun: { rating: 6, desc: "Rainy season. Afternoon showers common but rarely all-day. City life fully active. Good hotel deals." },
      jul: { rating: 6, desc: "Wet but manageable. Street food, malls and nightlife unaffected. Khao San Road buzzing." }
    }
  },
  {
    country: "Thailand", region: "Central", place: "Kanchanaburi",
    worstTimes: "Aug–Sep (river floods; Erawan waterfall closed, Bridge over River Kwai surrounded by water)",
    months: {
      may: { rating: 7, desc: "Waterfalls beginning to fill. Death Railway atmospheric. Cooler than Bangkok. River not yet flooded." },
      jun: { rating: 6, desc: "Erawan's pools green and beautiful. River rising. Some trail closures. Worth visiting before July." },
      jul: { rating: 5, desc: "Erawan often closed due to flooding. River tours restricted. Historical sites and museums still great." }
    }
  },

  // THAILAND — SOUTH GULF
  {
    country: "Thailand", region: "South (Gulf)", place: "Koh Samui",
    worstTimes: "Oct–Dec (Gulf coast monsoon; Samui gets rain when Andaman is dry)",
    months: {
      may: { rating: 8, desc: "Beautiful weather — dry and sunny while Andaman gets wet. Beaches calm, water crystal clear." },
      jun: { rating: 8, desc: "Excellent conditions. Angthong Marine Park day trips ideal. Chaweng Beach at its best." },
      jul: { rating: 8, desc: "One of the best months. Sunny, calm seas, lively beach scene. Great snorkeling and diving." }
    }
  },
  {
    country: "Thailand", region: "South (Gulf)", place: "Koh Phangan",
    worstTimes: "Oct–Dec (Gulf monsoon; Full Moon Party still runs but accommodation floods sometimes)",
    months: {
      may: { rating: 8, desc: "Dry and sunny. Full Moon Party month. Haad Rin Beach lively. Quieter northern beaches pristine." },
      jun: { rating: 8, desc: "Great beach weather. Thong Nai Pan beautiful. Snorkeling off Bottle Beach excellent." },
      jul: { rating: 8, desc: "Peak Gulf season. Sunshine, warm water. Party scene and wellness retreats both thriving." }
    }
  },
  {
    country: "Thailand", region: "South (Gulf)", place: "Koh Tao",
    worstTimes: "Oct–Dec (Gulf monsoon; dive visibility drops, seas rough)",
    months: {
      may: { rating: 8, desc: "Dry season on Gulf side. Visibility underwater excellent. Best diving of the year begins." },
      jun: { rating: 9, desc: "Prime dive conditions. Whale sharks occasionally spotted. Water warm and clear. Dive schools busy." },
      jul: { rating: 9, desc: "Exceptional diving. Shark Bay, Sail Rock and Chumphon Pinnacle at their best. Highly recommended." }
    }
  },

  // THAILAND — SOUTH ANDAMAN
  {
    country: "Thailand", region: "South (Andaman)", place: "Phuket",
    worstTimes: "May–Oct (Andaman monsoon; beaches rough, red flags up, rip currents dangerous)",
    months: {
      may: { rating: 4, desc: "Monsoon begins. Patong and Kata beaches get rough swells. Red flags frequent. Interior is lush though." },
      jun: { rating: 3, desc: "Full monsoon. Dangerous swimming conditions. Many beach clubs close or half-operate." },
      jul: { rating: 3, desc: "Roughest seas. Waves impressive but swimming banned at most beaches. Bargain rates though." }
    }
  },
  {
    country: "Thailand", region: "South (Andaman)", place: "Krabi",
    worstTimes: "May–Oct (Andaman monsoon; island-hopping cancelled, rock climbing walls wet and dangerous)",
    months: {
      may: { rating: 4, desc: "Rains starting. Four Islands and Railay accessible some days. Rock climbing restricted on wet walls." },
      jun: { rating: 3, desc: "Frequent heavy rain. Boat trips often cancelled. Staying in Ao Nang or Krabi Town for food/culture." },
      jul: { rating: 3, desc: "Full monsoon. Island trips unreliable. Stunning landscapes in rain but not for beach lovers." }
    }
  },
  {
    country: "Thailand", region: "South (Andaman)", place: "Koh Phi Phi",
    worstTimes: "May–Oct (monsoon; ferries cancelled, Maya Bay inaccessible, diving poor visibility)",
    months: {
      may: { rating: 4, desc: "Ferries still running but reduced. Maya Bay sometimes reachable. Party scene quieter." },
      jun: { rating: 3, desc: "Very limited boat access. Maya Bay often closed due to waves. Island empties out." },
      jul: { rating: 2, desc: "Roughest conditions. Most visitors gone. A few hardy backpackers only. Not recommended." }
    }
  },
  {
    country: "Thailand", region: "South (Andaman)", place: "Koh Lanta",
    worstTimes: "May–Oct (monsoon; island essentially closes down, most resorts shut)",
    months: {
      may: { rating: 3, desc: "Island transitioning to off-season. Many resorts closing. Beaches rough. Only backpacker spots open." },
      jun: { rating: 2, desc: "Most of the island closed. A handful of places remain. Not a good time to visit." },
      jul: { rating: 2, desc: "Nearly empty island. A few long-stay expats. Lush jungle but no beach life." }
    }
  },
  {
    country: "Thailand", region: "South (Andaman)", place: "Koh Lipe",
    worstTimes: "May–Oct (island essentially shuts down; ferries from Pak Bara stop, most resorts close)",
    months: {
      may: { rating: 3, desc: "Last ferry connections winding down. Most resorts closing. Catch the last boats before monsoon." },
      jun: { rating: 1, desc: "Island completely closed to tourists. No ferry service. Avoid." },
      jul: { rating: 1, desc: "Closed season. Zero tourist infrastructure. Do not visit." }
    }
  },

  // THAILAND — EAST
  {
    country: "Thailand", region: "East", place: "Pattaya",
    worstTimes: "Sep–Oct (heaviest rain, some coastal flooding, seas rough)",
    months: {
      may: { rating: 6, desc: "Rain beginning but beach still usable some days. City entertainment and nightlife fully active." },
      jun: { rating: 6, desc: "Rainy season. Sea a bit murky. But Pattaya's appeal is mostly city-based anyway — it continues." },
      jul: { rating: 6, desc: "Wet, but Pattaya's entertainment and food scene runs 365 days. Nearby Koh Larn accessible." }
    }
  },

  // THAILAND — ANDAMAN NORTH
  {
    country: "Thailand", region: "Andaman North", place: "Khao Lak",
    worstTimes: "May–Oct (Andaman monsoon; Similan Islands closed by government order)",
    months: {
      may: { rating: 3, desc: "Similan Islands liveaboards just finished season. Beach rough. Jungle hikes and waterfalls are great." },
      jun: { rating: 2, desc: "Full monsoon. Similans closed. Heavy rain. Only nature lovers in off-season waterfall mode." },
      jul: { rating: 2, desc: "Monsoon peak. Not a beach destination this time of year. Waterfalls impressive, little else." }
    }
  },

  // SRI LANKA
  {
    country: "Sri Lanka", region: "South Coast", place: "Weligama",
    worstTimes: "May–Aug (southwest monsoon; surf can be powerful but beach conditions rough for learners)",
    months: {
      may: { rating: 6, desc: "Swell arriving — good for experienced surfers, rough for beginners. Less crowded and cheaper." },
      jun: { rating: 5, desc: "Southwest monsoon. Waves big and choppy. Surfing for experienced only. Hinterland lush." },
      jul: { rating: 5, desc: "Consistent swell. Surf crowd thins. Hiri and Weligama bays varied conditions daily." }
    }
  },
  {
    country: "Sri Lanka", region: "South Coast", place: "Mirissa",
    worstTimes: "May–Sep (southwest monsoon; beach rough, whale watching boats stopped)",
    months: {
      may: { rating: 4, desc: "Monsoon starts. Whale watching season just ended. Beach rough. Village quiets down significantly." },
      jun: { rating: 3, desc: "Heavy monsoon rain. Beaches unsafe. Most restaurants and guesthouses still open but quiet." },
      jul: { rating: 3, desc: "Rough seas, persistent rain. Not recommended for a beach holiday. Head to east coast instead." }
    }
  },
  {
    country: "Sri Lanka", region: "South Coast", place: "Hiriketiya",
    worstTimes: "May–Sep (southwest monsoon hits this horseshoe bay; waves often blown out)",
    months: {
      may: { rating: 5, desc: "Monsoon swell building. Bay offers some shelter. Surf community remains. Trendy cafes still open." },
      jun: { rating: 4, desc: "Choppy and rainy. Some decent surf days. Quieter, budget-friendly, but not the best." },
      jul: { rating: 4, desc: "Inconsistent surf. Rain and clouds frequent. The bay is sheltered but still affected by southwest swell." }
    }
  },
  {
    country: "Sri Lanka", region: "East Coast", place: "Arugam Bay",
    worstTimes: "Nov–Mar (northeast monsoon; waves close out, bay becomes inaccessible)",
    months: {
      may: { rating: 8, desc: "Dry season on east coast begins! Surf season opening up. Long sandy beach, laid-back vibe returning." },
      jun: { rating: 9, desc: "Prime Arugam Bay season. Consistent surf at Main Point, Pottuvil, Whisky Point. Sunny and warm." },
      jul: { rating: 9, desc: "Peak surf and beach season. Pumping waves, vibrant beach town, elephants nearby at Kumana NP." }
    }
  },
  {
    country: "Sri Lanka", region: "East Coast", place: "Trincomalee",
    worstTimes: "Nov–Jan (northeast monsoon; diving impossible, town winds down)",
    months: {
      may: { rating: 8, desc: "East coast dry season. Nilaveli beach stunning. Snorkeling at Pigeon Island excellent. Fewer tourists." },
      jun: { rating: 8, desc: "Warm, sunny, calm sea. Pigeon Island coral reefs beautiful. Whale watching nearby." },
      jul: { rating: 8, desc: "Peak season. Blue water, white sand, great snorkeling. One of Sri Lanka's best months here." }
    }
  },
  {
    country: "Sri Lanka", region: "Hill Country", place: "Ella",
    worstTimes: "Oct–Nov (northeast monsoon affects hills too; heavy rain, mist obscures views)",
    months: {
      may: { rating: 7, desc: "Hills relatively sheltered from southwest monsoon. Nine Arch Bridge and Little Adam's Peak accessible." },
      jun: { rating: 6, desc: "Some rain, often misty. Lush tea plantations. Trains still running. Cooler temperatures (18-22°C)." },
      jul: { rating: 7, desc: "Beautiful green landscape. Train rides through tea country atmospheric. Rain manageable in hills." }
    }
  },
  {
    country: "Sri Lanka", region: "West Coast", place: "Colombo",
    worstTimes: "May–Jun (southwest monsoon peaks; heavy rain and flooding in low areas)",
    months: {
      may: { rating: 5, desc: "Monsoon arrives. Daily rain, sometimes heavy. City's food scene, Fort district and museums still great." },
      jun: { rating: 5, desc: "Heaviest rain month. Galle Face Green gets flooded. But food, culture and shopping unaffected." },
      jul: { rating: 6, desc: "Rain easing slightly. Colombo is a city destination; weather less critical. Good restaurant scene." }
    }
  },
  {
    country: "Sri Lanka", region: "West Coast", place: "Kalpitiya",
    worstTimes: "Jun–Sep (strong southwest winds; kitesurfing is great but not ideal for casual visitors)",
    months: {
      may: { rating: 5, desc: "Wind picking up — kitesurfers beginning to arrive. Dolphins still spotted. Not for beach lounging." },
      jun: { rating: 7, desc: "Prime kitesurfing season. Consistent wind, flat lagoon. Spinner dolphin tours excellent. Niche appeal." },
      jul: { rating: 7, desc: "Strong, reliable kite winds. Lagoon flat and perfect. If you kitesurf, this is the spot." }
    }
  },

  // JAPAN
  {
    country: "Japan", region: "Kanto", place: "Tokyo",
    worstTimes: "Jun–Jul (tsuyu/rainy season; humid and overcast with near-daily rain)",
    months: {
      may: { rating: 9, desc: "One of the best months. Post-cherry blossom greenery, cool temperatures, festivals. Highly recommended." },
      jun: { rating: 6, desc: "Tsuyu rainy season. Humid, grey skies, daily drizzle. But hydrangeas bloom beautifully. Museums ideal." },
      jul: { rating: 7, desc: "Tsuyu ends mid-July. Heat and humidity rise sharply. Firework festivals begin. Energetic summer vibes." }
    }
  },
  {
    country: "Japan", region: "Kansai", place: "Osaka",
    worstTimes: "Jun–Jul (rainy season) and Aug (extreme heat and humidity 35°C+)",
    months: {
      may: { rating: 9, desc: "Perfect weather. Dotonbori and street food scene magical. Comfortable temperatures. Pre-crowds window." },
      jun: { rating: 6, desc: "Rainy season. Humid. Kuromon Market and food halls great in any weather. Takoyaki indoors." },
      jul: { rating: 7, desc: "Hot and steamy. Summer food festivals start. Tenjin Matsuri festival mid-month. Energetic city." }
    }
  },
  {
    country: "Japan", region: "Kansai", place: "Kyoto",
    worstTimes: "Jun–Aug (rainy then extremely hot; temple gardens beautiful but conditions uncomfortable)",
    months: {
      may: { rating: 9, desc: "Stunning — temples, bamboo groves and gardens in full spring green. Comfortable and beautiful." },
      jun: { rating: 6, desc: "Rainy season. Philosopher's Path lined with hydrangeas. Arashiyama misty and atmospheric." },
      jul: { rating: 7, desc: "Gion Matsuri festival — Kyoto's greatest celebration. Very hot. Evenings at Gion lantern-lit and magical." }
    }
  },
  {
    country: "Japan", region: "Okinawa", place: "Okinawa",
    worstTimes: "May–Jun (rainy season) and Aug–Sep (typhoon risk; direct hits possible)",
    months: {
      may: { rating: 6, desc: "Rainy season (tsuyu). Warm water (25°C) great for diving. Rain showers between sunshine." },
      jun: { rating: 7, desc: "Rainy season ends late June. Ocean warming up beautifully. Excellent snorkeling at Kerama Islands." },
      jul: { rating: 8, desc: "Peak summer. Clear water, great diving and beaches. Busy with Japanese tourists. Very hot (32°C)." }
    }
  },
  {
    country: "Japan", region: "Hokkaido", place: "Hokkaido",
    worstTimes: "Jan–Feb (extreme cold and snowstorms outside ski resorts; access difficult)",
    months: {
      may: { rating: 8, desc: "Spring flowers blooming (tulips in Shikisai-no-oka). Cool and comfortable. Far fewer crowds than Honshu." },
      jun: { rating: 8, desc: "Lavender season begins in late June in Furano. Cool, green, beautiful. Best time before crowds peak." },
      jul: { rating: 9, desc: "Peak lavender season in Furano. Flower fields spectacular. Perfect temperatures (22-25°C). Highly recommended." }
    }
  },
  {
    country: "Japan", region: "Shikoku", place: "Shikoku",
    worstTimes: "Jun–Jul (rainy season; the 88-temple pilgrimage trail is very muddy and wet)",
    months: {
      may: { rating: 8, desc: "Great for the pilgrimage. Cool, clear days. Temples and rural landscapes beautiful. Pre-rain window." },
      jun: { rating: 5, desc: "Rainy season. Pilgrimage trails slippery. Iya Valley gorge dramatic in mist. Atmospheric but wet." },
      jul: { rating: 6, desc: "Heat and humidity rising. Pilgrimage becomes arduous. Coastal areas of Kochi nice for beaches." }
    }
  },
  {
    country: "Japan", region: "Kyushu", place: "Kyushu",
    worstTimes: "Jun–Jul (rainy season; Aso caldera and mountain roads get foggy and muddy)",
    months: {
      may: { rating: 8, desc: "Excellent. Mt Aso accessible, Nagasaki and Fukuoka beautiful. Comfortable temperatures across the island." },
      jun: { rating: 6, desc: "Rainy season. Takachiho Gorge especially dramatic with misty waterfalls. City sightseeing still great." },
      jul: { rating: 7, desc: "Rain fading. Hot and humid. Hakata Gion Yamakasa festival in Fukuoka is spectacular." }
    }
  },

  // LAOS
  {
    country: "Laos", region: "Cities", place: "Luang Prabang",
    worstTimes: "Aug–Sep (Mekong flooding; streets near river flood, some temple areas underwater)",
    months: {
      may: { rating: 6, desc: "Rains beginning. Kuang Si waterfall filling up beautifully. Alms giving ceremony atmospheric." },
      jun: { rating: 6, desc: "Green season. Mekong rising. Lush forests around town. Fewer tourists, relaxed pace, bargain prices." },
      jul: { rating: 6, desc: "Rain most days. Kuang Si at peak beauty. Mekong high — impressive but some paths closed." }
    }
  },
  {
    country: "Laos", region: "Cities", place: "Vang Vieng",
    worstTimes: "Aug–Sep (tubing and kayaking dangerous; Nam Song river flooded and fast)",
    months: {
      may: { rating: 6, desc: "River activities still running. Karst scenery getting lush. Some rain. Good time before peak rains." },
      jun: { rating: 5, desc: "River rising. Tubing possible but check conditions. Caves and lagoons still accessible." },
      jul: { rating: 5, desc: "Nam Song river fast and high. Tubing restricted on some days. Lagoons beautiful but access tricky." }
    }
  },
  {
    country: "Laos", region: "Cities", place: "Vientiane",
    worstTimes: "Jul–Aug (heaviest rain; streets flood, outdoor dining limited)",
    months: {
      may: { rating: 6, desc: "Hot and getting wetter. Patuxai and temples still great. Mekong waterfront pleasant in evenings." },
      jun: { rating: 6, desc: "Rainy season. City quiet. Good cafe culture, French bakeries and temples all accessible in light rain." },
      jul: { rating: 5, desc: "Heavy rain. Street flooding common. Relaxed capital easy to explore but weather limits outdoor plans." }
    }
  },

  // INDIA — NORTH
  {
    country: "India", region: "North", place: "Delhi",
    worstTimes: "May–Jun (extreme heat 45°C+) and Jul–Aug (monsoon flooding)",
    months: {
      may: { rating: 2, desc: "Brutal heat — regularly 44°C. Dangerous to be outdoors midday. Only for heat-tolerant, well-prepared visitors." },
      jun: { rating: 3, desc: "Scorching heat gives way to pre-monsoon humidity. Occasional dust storms. Uncomfortable but historic sites open." },
      jul: { rating: 4, desc: "Monsoon brings relief from heat (30°C) but flooding is common. Mughal monuments in green surroundings." }
    }
  },
  {
    country: "India", region: "North", place: "Rishikesh",
    worstTimes: "Jul–Aug (Ganges flooding; rafting banned, many ghats submerged, landslide risk on Char Dham route)",
    months: {
      may: { rating: 7, desc: "Good weather before monsoon. River rafting in full swing. Yoga and ashram scene thriving. Pre-rain clean air." },
      jun: { rating: 5, desc: "Monsoon beginning. Rafting increasingly restricted. Ghats getting lively with rain energy. Spiritual vibe." },
      jul: { rating: 3, desc: "Ganges floods, rafting banned. Lakshmanjhula bridge area flooded. Landslide risk on roads. Not recommended." }
    }
  },
  {
    country: "India", region: "North", place: "Dharamshala",
    worstTimes: "Jul–Aug (monsoon hits McLeod Ganj hard; landslides cut roads, trekking dangerous)",
    months: {
      may: { rating: 8, desc: "Excellent. Cool mountain air (20°C), Tibetan culture thriving, Triund trek gorgeous. Pre-monsoon clarity." },
      jun: { rating: 6, desc: "Monsoon approaching. Still trekking possible early June. McLeod Ganj cafes cozy in first rains." },
      jul: { rating: 4, desc: "Heavy rain. Landslides common. Roads to Triund often closed. Dharamshala town still atmospheric though." }
    }
  },
  {
    country: "India", region: "North", place: "Manali",
    worstTimes: "Jul–Aug (monsoon landslides; Rohtang Pass and Leh road often closed for days)",
    months: {
      may: { rating: 8, desc: "Rohtang Pass opens. Apple orchards blooming. Solang Valley green. Adventure sports in full swing." },
      jun: { rating: 7, desc: "Warm and accessible. Pre-monsoon clarity for mountain views. Hampta Pass trek viable." },
      jul: { rating: 5, desc: "Monsoon. Landslides block roads to Rohtang and Leh regularly. Town itself fine but access risky." }
    }
  },
  {
    country: "India", region: "North", place: "Kasol",
    worstTimes: "Jul–Aug (Parvati River floods; riverside camping wiped out, trails to Kheerganga dangerous)",
    months: {
      may: { rating: 8, desc: "Beautiful season. Parvati Valley lush, trails open, Kheerganga trek accessible. Backpacker scene buzzing." },
      jun: { rating: 6, desc: "Pre-monsoon. Some rain. River high but still manageable. Camps operating. Check trek conditions." },
      jul: { rating: 4, desc: "River flooding. Kheerganga trail often closed by landslides. Camping suspended. Risky month." }
    }
  },
  {
    country: "India", region: "North", place: "Parvati Valley",
    worstTimes: "Jul–Sep (dangerous flooding and landslides; multiple trekkers have died; valley becomes very risky)",
    months: {
      may: { rating: 8, desc: "Prime window. Pin Parvati Pass trek begins. Valley blooming. Manikaran and Kasol buzzing with hikers." },
      jun: { rating: 6, desc: "Rains start. Upper treks closing one by one. Lower valley still beautiful and accessible." },
      jul: { rating: 3, desc: "Monsoon in full force. Valley flood risk high. Trails closed. Do not attempt remote treks." }
    }
  },
  {
    country: "India", region: "North", place: "Leh",
    worstTimes: "Jan–Feb (extreme cold -20°C, roads completely closed) and Jul–Aug (landslides on access roads)",
    months: {
      may: { rating: 7, desc: "Roads opening. Altitude acclimatization needed (3500m). Cool and clear. Monasteries peaceful and accessible." },
      jun: { rating: 9, desc: "Ideal month. Clear skies, all passes open, Pangong Lake accessible. Best weather for Ladakh." },
      jul: { rating: 8, desc: "Peak season. Warm days (25°C), stunning landscapes. Roads can be cut by rain but usually clear fast." }
    }
  },
  {
    country: "India", region: "North", place: "Kashmir",
    worstTimes: "Dec–Feb (heavy snowfall; Srinagar sometimes cut off, Dal Lake frozen)",
    months: {
      may: { rating: 9, desc: "One of the best months. Dal Lake houseboats idyllic, tulip gardens blooming, Gulmarg greenery returning." },
      jun: { rating: 9, desc: "Peak season. Perfect temperatures (22-25°C). Pahalgam lush, meadows blooming. Paradise-like conditions." },
      jul: { rating: 8, desc: "Very warm but gorgeous. Sonamarg and Thajiwas glacier accessible. Amarnath Yatra pilgrimage." }
    }
  },
  {
    country: "India", region: "North", place: "Shimla",
    worstTimes: "Jul–Aug (heavy monsoon; landslides on Kalka-Shimla road, toy train disrupted)",
    months: {
      may: { rating: 8, desc: "Very popular but for good reason — cool (18°C) when plains are burning. Mall Road and Jakhu fun." },
      jun: { rating: 7, desc: "Pre-monsoon. Still pleasant and cooler than Delhi. Great escape. Light rain adds atmosphere." },
      jul: { rating: 5, desc: "Monsoon. Landslides on mountain roads. Toy train disrupted. Hill atmosphere beautiful but risky travel." }
    }
  },

  // INDIA — WEST
  {
    country: "India", region: "West", place: "Goa (Arambol)",
    worstTimes: "Jun–Aug (southwest monsoon; beaches closed, rip currents, most shacks closed)",
    months: {
      may: { rating: 4, desc: "Season winding down. Beach shacks closing. Heat and humidity intense. Last-minute deals available." },
      jun: { rating: 2, desc: "Full monsoon. Beaches closed. Rip currents dangerous. Most tourists gone. Locals only, basically." },
      jul: { rating: 2, desc: "Heavy rain and rough seas. Arambol ghost town. Lush green Goa for adventurous off-season travelers only." }
    }
  },
  {
    country: "India", region: "West", place: "Pushkar",
    worstTimes: "May–Jun (extreme heat 42°C+; camels and tourists both suffer)",
    months: {
      may: { rating: 3, desc: "Brutal heat. Brahma temple and lake visits only in very early morning. Not pleasant for extended stays." },
      jun: { rating: 4, desc: "Pre-monsoon humidity. Still hot. Occasional dust storms. Desert town has some atmospheric quality." },
      jul: { rating: 5, desc: "Monsoon arrives and brings some relief (30–32°C). Town takes on a different, quieter character." }
    }
  },

  // INDIA — SOUTH
  {
    country: "India", region: "South", place: "Kerala",
    worstTimes: "Jun–Aug (southwest monsoon; backwaters flooded, some houseboat routes disrupted)",
    months: {
      may: { rating: 6, desc: "Just before monsoon. Warm and green. Backwaters and Munnar last good window before heavy rains." },
      jun: { rating: 6, desc: "Monsoon Ayurvedic season — many resorts offer monsoon packages specifically. Backwaters lush. Great for wellness." },
      jul: { rating: 6, desc: "Full monsoon. Houseboat cruises still run. Tea estates misty and beautiful. Therapeutic if embraced." }
    }
  },
  {
    country: "India", region: "South", place: "Varkala",
    worstTimes: "Jun–Aug (monsoon; cliff beach closes, waves enormous, no beach access)",
    months: {
      may: { rating: 5, desc: "Last gasps of beach season. Waves picking up. Cliff path cafes closing one by one." },
      jun: { rating: 2, desc: "Monsoon. Cliff beach inaccessible. Backpacker town very quiet. Not a beach trip." },
      jul: { rating: 2, desc: "Rough seas, cliff erosion risk. The clifftop itself is green and lovely but beach is gone." }
    }
  },
  {
    country: "India", region: "South", place: "Munnar",
    worstTimes: "Oct (heaviest northeast monsoon; landslides, roads washed out regularly)",
    months: {
      may: { rating: 7, desc: "Pre-monsoon tea country in full harvest. Cool (15–20°C), refreshing escape. Eravikulam NP open." },
      jun: { rating: 6, desc: "Monsoon starts. Tea estates dramatically misty. Some roads muddy. Beautiful if you embrace the rain." },
      jul: { rating: 6, desc: "Heavy rain but tea estates ethereally beautiful in mist. Viewpoints often cloud-covered. Atmospheric." }
    }
  },
  {
    country: "India", region: "South", place: "Hampi",
    worstTimes: "Apr–Jun (extreme heat 40°C+; boulder landscapes become an oven)",
    months: {
      may: { rating: 3, desc: "Dangerously hot. Ruins exploration possible only at dawn and dusk. Not recommended for most travelers." },
      jun: { rating: 5, desc: "Monsoon arrives — huge relief. Tungabhadra River fills up. Ruins look dramatic against grey skies." },
      jul: { rating: 6, desc: "Green monsoon Hampi. Boulders draped in vegetation. River high. Great for photography enthusiasts." }
    }
  },
  {
    country: "India", region: "South", place: "Bangalore",
    worstTimes: "Oct–Nov (northeast monsoon; traffic floods, commuting nightmarish)",
    months: {
      may: { rating: 7, desc: "Pleasant by Indian standards (28°C). Tech city's cafe, brewery and food scene thriving year-round." },
      jun: { rating: 7, desc: "Monsoon brings cool relief. Garden City earns its name. Parks beautiful. Mild and manageable." },
      jul: { rating: 7, desc: "Cool and green. Nandi Hills and Coorg day trips lush. One of India's best cities in monsoon." }
    }
  },
  {
    country: "India", region: "South", place: "Cochin (Kochi)",
    worstTimes: "Jun–Jul (southwest monsoon at its peak; ferry services sometimes disrupted)",
    months: {
      may: { rating: 6, desc: "Getting humid and wet. Fort Kochi heritage walks still lovely. Chinese fishing nets in misty mornings." },
      jun: { rating: 5, desc: "Heavy monsoon. Fort Kochi streets flood. But spice markets, synagogue and heritage charm persist." },
      jul: { rating: 6, desc: "Rain easing slightly. Backwaters and houseboats still running. Cultural city manages monsoon gracefully." }
    }
  },

  // INDIA — EAST/NORTHEAST
  {
    country: "India", region: "East/Northeast", place: "Sikkim",
    worstTimes: "Jun–Aug (heavy monsoon; Nathu La pass and Goecha La trek closed, roads regularly blocked by landslides)",
    months: {
      may: { rating: 8, desc: "Rhododendrons and orchids blooming. Gangtok views of Kangchenjunga. Trekking windows still open." },
      jun: { rating: 5, desc: "Monsoon arrives. Trekkng routes close. Monastery visits and Gangtok town still very worthwhile." },
      jul: { rating: 4, desc: "Heavy rain. Landslides common. High passes closed. Monasteries and cultural Sikkim accessible but travel rough." }
    }
  },

  // INDIA — COASTAL KARNATAKA
  {
    country: "India", region: "Coastal Karnataka", place: "Om Beach",
    worstTimes: "Jun–Sep (violent monsoon; beach completely inaccessible, Gokarna locals only)",
    months: {
      may: { rating: 5, desc: "Pre-monsoon. Heat and humidity. Beach still accessible but tourist infrastructure winding down." },
      jun: { rating: 2, desc: "Full monsoon. Om Beach closed. Waves enormous. Gokarna temple town has its own monsoon charm though." },
      jul: { rating: 2, desc: "Rough seas, heavy rain. Beach inaccessible. Not a beach destination in July." }
    }
  },

  // TAIWAN
  {
    country: "Taiwan", region: "Cities", place: "Taipei",
    worstTimes: "Jul–Sep (typhoon season; multiple direct hits possible; extreme rainfall)",
    months: {
      may: { rating: 7, desc: "Warm and lush. Dragon Boat Festival approaching. Street food and night markets in full swing. Some rain." },
      jun: { rating: 6, desc: "Hot and rainy. Plum rains (meiyu) season. Jiufen and Shifen atmospheric in mist. Food scene superb." },
      jul: { rating: 6, desc: "Hot, humid and typhoon risk begins. Indoor culture (temples, markets, food) excellent. Plan around weather." }
    }
  },
];

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

const ratingEmoji = (r) => ["", "💀", "🌧", "😬", "😕", "😐", "🙂", "😊", "😄", "🌟", "✨"][r] || "";

const months = ["may", "jun", "jul"];
const monthLabels = { may: "May", jun: "June", jul: "July" };

const countries = [...new Set(data.map(d => d.country))];
const regions = (country) => [...new Set(data.filter(d => d.country === country).map(d => d.region))];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  const filtered = useMemo(() => {
    return data.filter(d => {
      const countryMatch = selectedCountry === "All" || d.country === selectedCountry;
      const searchMatch = !search || d.place.toLowerCase().includes(search.toLowerCase()) ||
        d.country.toLowerCase().includes(search.toLowerCase()) ||
        d.region.toLowerCase().includes(search.toLowerCase());
      return countryMatch && searchMatch;
    });
  }, [selectedCountry, search]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(d => {
      if (!g[d.country]) g[d.country] = {};
      if (!g[d.country][d.region]) g[d.country][d.region] = [];
      g[d.country][d.region].push(d);
    });
    return g;
  }, [filtered]);

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e0e6ef"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a2332 0%, #0d1117 60%)",
        borderBottom: "1px solid #1f2d3d",
        padding: "36px 24px 28px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#4a8fa8", fontWeight: 600, marginBottom: 10, textTransform: "uppercase" }}>
          Southeast & South Asia
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 900,
          margin: 0,
          background: "linear-gradient(90deg, #7ec8e3, #b8d4e8, #7ec8e3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.1
        }}>
          Best & Worst Times to Visit
        </h1>
        <p style={{ color: "#5a7a8a", fontSize: 14, marginTop: 10, fontWeight: 300 }}>
          May · June · July ratings for every destination
        </p>
      </div>

      {/* Controls */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#0d1117cc",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1f2d3d",
        padding: "14px 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center"
      }}>
        <input
          placeholder="🔍 Search destination..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: "#131c27",
            border: "1px solid #2a3a4d",
            borderRadius: 8,
            padding: "8px 14px",
            color: "#e0e6ef",
            fontSize: 13,
            width: 200,
            outline: "none"
          }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", ...countries].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              style={{
                padding: "6px 13px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: selectedCountry === c ? "#4a8fa8" : "#1f2d3d",
                background: selectedCountry === c ? "#4a8fa815" : "transparent",
                color: selectedCountry === c ? "#7ec8e3" : "#5a7a8a",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: selectedCountry === c ? 600 : 400,
                transition: "all 0.15s"
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {months.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMonth(selectedMonth === m ? null : m)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: selectedMonth === m ? "#7ec8e3" : "#1f2d3d",
                background: selectedMonth === m ? "#7ec8e318" : "transparent",
                color: selectedMonth === m ? "#7ec8e3" : "#5a7a8a",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600
              }}
            >
              {monthLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px 60px" }}>
        {Object.entries(grouped).map(([country, regs]) => (
          <div key={country} style={{ marginBottom: 40 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              paddingBottom: 12,
              borderBottom: "1px solid #1f2d3d"
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                margin: 0,
                color: "#b8d4e8",
                fontWeight: 700
              }}>{country}</h2>
              <span style={{ color: "#2a3a4d", fontSize: 12 }}>
                {Object.values(regs).flat().length} destination{Object.values(regs).flat().length !== 1 ? "s" : ""}
              </span>
            </div>

            {Object.entries(regs).map(([region, places]) => (
              <div key={region} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#2e4a5e", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
                  {region}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {places.map(place => {
                    const key = `${country}-${region}-${place.place}`;
                    const isOpen = expanded[key];
                    return (
                      <div key={place.place} style={{
                        background: "#131c27",
                        border: "1px solid #1f2d3d",
                        borderRadius: 12,
                        overflow: "hidden",
                        transition: "border-color 0.2s"
                      }}>
                        {/* Place header */}
                        <div
                          onClick={() => toggle(key)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 18px",
                            cursor: "pointer",
                            userSelect: "none"
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 15, color: "#d4e8f0" }}>{place.place}</div>
                          </div>
                          {/* Month rating pills */}
                          <div style={{ display: "flex", gap: 6 }}>
                            {months.map(m => {
                              const r = place.months[m].rating;
                              const show = !selectedMonth || selectedMonth === m;
                              if (!show) return null;
                              return (
                                <div key={m} style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 2,
                                  minWidth: 44
                                }}>
                                  <div style={{ fontSize: 10, color: "#3a5a6e" }}>{monthLabels[m]}</div>
                                  <div style={{
                                    background: RATING_COLORS[r] + "22",
                                    border: `1px solid ${RATING_COLORS[r]}55`,
                                    borderRadius: 20,
                                    padding: "3px 10px",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: RATING_COLORS[r],
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4
                                  }}>
                                    {r}/10
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ color: "#2e4a5e", fontSize: 16, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>›</div>
                        </div>

                        {/* Expanded details */}
                        {isOpen && (
                          <div style={{
                            padding: "0 18px 18px",
                            borderTop: "1px solid #1a2a36",
                            paddingTop: 16
                          }}>
                            {/* Worst times */}
                            <div style={{
                              background: "#1f0f0f",
                              border: "1px solid #3d1a1a",
                              borderRadius: 8,
                              padding: "10px 14px",
                              marginBottom: 14,
                              fontSize: 13,
                              color: "#c0726d"
                            }}>
                              <span style={{ fontWeight: 600, color: "#e05050" }}>⚠ Worst Times: </span>
                              {place.worstTimes}
                            </div>

                            {/* Month breakdown */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                              {months.map(m => {
                                const info = place.months[m];
                                return (
                                  <div key={m} style={{
                                    background: "#0d1117",
                                    border: `1px solid ${RATING_COLORS[info.rating]}33`,
                                    borderRadius: 10,
                                    padding: "12px 14px"
                                  }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                      <span style={{ fontWeight: 700, fontSize: 14, color: "#b8d4e8" }}>{monthLabels[m]}</span>
                                      <div style={{
                                        background: RATING_COLORS[info.rating] + "25",
                                        border: `1px solid ${RATING_COLORS[info.rating]}60`,
                                        borderRadius: 20,
                                        padding: "2px 10px",
                                        fontSize: 14,
                                        fontWeight: 800,
                                        color: RATING_COLORS[info.rating]
                                      }}>
                                        {ratingEmoji(info.rating)} {info.rating}/10
                                      </div>
                                    </div>
                                    <p style={{ fontSize: 12.5, color: "#6a8a9a", margin: 0, lineHeight: 1.6 }}>
                                      {info.desc}
                                    </p>
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
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#131c27dd",
        border: "1px solid #1f2d3d",
        borderRadius: 12,
        padding: "12px 16px",
        backdropFilter: "blur(8px)",
        fontSize: 11,
        color: "#3a5a6e"
      }}>
        <div style={{ marginBottom: 6, fontWeight: 600, color: "#4a7a8e" }}>RATING SCALE</div>
        {[1,3,5,7,9,10].map(r => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <div style={{ width: 22, height: 6, borderRadius: 3, background: RATING_COLORS[r] }} />
            <span style={{ color: RATING_COLORS[r] }}>{r} — {["","Avoid","Very Poor","Poor","Below Avg","Average","Good","Very Good","Excellent","Outstanding","Perfect"][r]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
