const allQuestions = [
    {
        question: "What is the capital of Japan?",
        answers: ["Seoul", "Tokyo", "Beijing", "Bangkok"],
        correct: 1,
        fact: "Tokyo is the world's most populous metropolitan area with over 37 million people. It became Japan's capital in 1868, replacing Kyoto."
    },
    {
        question: "What is the capital of Australia?",
        answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2,
        fact: "Canberra was purpose-built as a compromise between rivals Sydney and Melbourne. It was designed by American architect Walter Burley Griffin and became the capital in 1913."
    },
    {
        question: "What is the capital of Switzerland?",
        answers: ["Zurich", "Geneva", "Bern", "Basel"],
        correct: 2,
        fact: "Many people guess Zurich or Geneva, but Bern has been Switzerland's de facto capital since 1848. Switzerland officially has no capital, but Bern is the 'federal city'."
    },
    {
        question: "What is the capital of Brazil?",
        answers: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
        correct: 2,
        fact: "Brasília was built from scratch in just 41 months and inaugurated in 1960. Its futuristic architecture by Oscar Niemeyer makes it a UNESCO World Heritage Site."
    },
    {
        question: "What is the capital of Canada?",
        answers: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
        correct: 3,
        fact: "Queen Victoria chose Ottawa as Canada's capital in 1857 because it was far from the US border and located between English-speaking and French-speaking regions."
    },
    {
        question: "What is the capital of Turkey?",
        answers: ["Istanbul", "Ankara", "Izmir", "Bursa"],
        correct: 1,
        fact: "Ankara became Turkey's capital in 1923, replacing Istanbul. Many people still think Istanbul is the capital because it's Turkey's largest and most famous city."
    },
    {
        question: "What is the capital of the United Arab Emirates?",
        answers: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
        correct: 1,
        fact: "Abu Dhabi is the capital and holds about 95% of the UAE's oil reserves. Dubai is more famous for tourism, but Abu Dhabi is the political and industrial center."
    },
    {
        question: "What is the capital of South Africa?",
        answers: ["Johannesburg", "Cape Town", "Pretoria", "Durban"],
        correct: 2,
        fact: "South Africa actually has THREE capitals: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial). Pretoria is considered the administrative capital."
    },
    {
        question: "What is the capital of Morocco?",
        answers: ["Casablanca", "Marrakech", "Rabat", "Fez"],
        correct: 2,
        fact: "Rabat has been Morocco's capital since 1912. Casablanca is the largest city and economic hub, which is why many people mistakenly think it's the capital."
    },
    {
        question: "What is the capital of Myanmar (Burma)?",
        answers: ["Yangon", "Mandalay", "Naypyidaw", "Bagan"],
        correct: 2,
        fact: "Naypyidaw became the capital in 2006, replacing Yangon. It was built secretly in the jungle and is one of the world's least populated capital cities."
    },
    {
        question: "What is the capital of Tanzania?",
        answers: ["Dar es Salaam", "Dodoma", "Arusha", "Zanzibar City"],
        correct: 1,
        fact: "Dodoma was designated the capital in 1974, but Dar es Salaam remains the largest city and commercial center. The government transition is still ongoing."
    },
    {
        question: "What is the capital of New Zealand?",
        answers: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
        correct: 1,
        fact: "Wellington is the world's southernmost capital city. It became New Zealand's capital in 1865, replacing Auckland due to its more central location."
    },
    {
        question: "What is the capital of Kazakhstan?",
        answers: ["Almaty", "Astana", "Shymkent", "Karaganda"],
        correct: 1,
        fact: "The capital moved from Almaty to Astana (now called Nur-Sultan) in 1997. At -40°F in winter, it's the second-coldest capital city in the world."
    },
    {
        question: "What is the capital of Nigeria?",
        answers: ["Lagos", "Kano", "Abuja", "Ibadan"],
        correct: 2,
        fact: "Abuja replaced Lagos as Nigeria's capital in 1991. It was chosen for its central location and ethnic neutrality. Lagos remains the largest city with over 21 million people."
    },
    {
        question: "What is the capital of Vietnam?",
        answers: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hue"],
        correct: 1,
        fact: "Hanoi has been Vietnam's capital for over 1,000 years. Ho Chi Minh City (formerly Saigon) is larger and more economically important, but Hanoi is the political heart."
    },
    {
        question: "What is the capital of Egypt?",
        answers: ["Cairo", "Alexandria", "Giza", "Luxor"],
        correct: 0,
        fact: "Cairo is one of the world's oldest cities and the largest city in Africa and the Middle East, with a population of over 20 million in the metro area."
    },
    {
        question: "What is the capital of India?",
        answers: ["Mumbai", "New Delhi", "Bangalore", "Kolkata"],
        correct: 1,
        fact: "New Delhi became the capital in 1911, replacing Kolkata. The city was designed by British architects Edwin Lutyens and Herbert Baker."
    },
    {
        question: "What is the capital of Pakistan?",
        answers: ["Karachi", "Lahore", "Islamabad", "Rawalpindi"],
        correct: 2,
        fact: "Islamabad was purpose-built as Pakistan's capital in the 1960s, replacing Karachi. Its name means 'City of Islam' and it's known for its modern planned layout."
    },
    {
        question: "What is the capital of Spain?",
        answers: ["Barcelona", "Madrid", "Valencia", "Seville"],
        correct: 1,
        fact: "Madrid is the highest capital city in Europe at 667 meters above sea level. It became Spain's capital in 1561 under King Philip II."
    },
    {
        question: "What is the capital of Ecuador?",
        answers: ["Guayaquil", "Quito", "Cuenca", "Ambato"],
        correct: 1,
        fact: "Quito sits at 2,850 meters elevation, making it the second-highest official capital city in the world. Its historic center is a UNESCO World Heritage Site."
    },
    {
        question: "What is the capital of Sri Lanka?",
        answers: ["Colombo", "Sri Jayawardenepura Kotte", "Kandy", "Galle"],
        correct: 1,
        fact: "The official capital is Sri Jayawardenepura Kotte (often shortened to Kotte), though Colombo is the commercial capital. Many people don't know this distinction!"
    },
    {
        question: "What is the capital of Ivory Coast?",
        answers: ["Abidjan", "Yamoussoukro", "Bouaké", "Daloa"],
        correct: 1,
        fact: "Yamoussoukro became the capital in 1983, but Abidjan remains the economic center. Yamoussoukro has the world's largest church, the Basilica of Our Lady of Peace."
    },
    {
        question: "What is the capital of Bolivia?",
        answers: ["La Paz", "Sucre", "Santa Cruz", "Cochabamba"],
        correct: 1,
        fact: "Bolivia has two capitals: Sucre (constitutional/judicial) and La Paz (executive/legislative). La Paz is the world's highest administrative capital at 3,640 meters."
    },
    {
        question: "What is the capital of Benin?",
        answers: ["Cotonou", "Porto-Novo", "Parakou", "Abomey"],
        correct: 1,
        fact: "Porto-Novo is the official capital, but Cotonou is the seat of government and largest city. Most government activities actually occur in Cotonou."
    },
    {
        question: "What is the capital of Scotland?",
        answers: ["Glasgow", "Edinburgh", "Aberdeen", "Dundee"],
        correct: 1,
        fact: "Edinburgh has been Scotland's capital since 1437. The city is built on extinct volcanoes and hosts the world's largest arts festival, the Edinburgh Festival Fringe."
    },
    {
        question: "What is the capital of Malaysia?",
        answers: ["Kuala Lumpur", "Putrajaya", "George Town", "Johor Bahru"],
        correct: 0,
        fact: "Kuala Lumpur is the capital, though Putrajaya (built in 1995) is the federal administrative center. The famous Petronas Towers in KL were the world's tallest buildings from 1998-2004."
    },
    {
        question: "What is the capital of Norway?",
        answers: ["Bergen", "Oslo", "Trondheim", "Stavanger"],
        correct: 1,
        fact: "Oslo was called Christiania from 1624 to 1925. It's one of the world's most expensive cities and is surrounded by forests and fjords."
    },
    {
        question: "What is the capital of Finland?",
        answers: ["Tampere", "Turku", "Helsinki", "Espoo"],
        correct: 2,
        fact: "Helsinki became Finland's capital in 1812, replacing Turku. It's called the 'Daughter of the Baltic' and is known for its beautiful neoclassical architecture."
    },
    {
        question: "What is the capital of Kenya?",
        answers: ["Mombasa", "Nairobi", "Kisumu", "Nakuru"],
        correct: 1,
        fact: "Nairobi is one of only two capital cities with a national park within its boundaries. Founded in 1899 as a railway depot, its name means 'cool water' in Maasai."
    },
    {
        question: "What is the capital of Peru?",
        answers: ["Cusco", "Lima", "Arequipa", "Trujillo"],
        correct: 1,
        fact: "Lima was founded in 1535 by Spanish conquistador Francisco Pizarro. Despite being on the coast of Peru, Lima is the second-largest desert capital city in the world."
    },
    {
        question: "What is the capital of Austria?",
        answers: ["Vienna", "Salzburg", "Innsbruck", "Graz"],
        correct: 0,
        fact: "Vienna was the capital of the Austro-Hungarian Empire and is the only European capital with significant vineyards within city limits. It's been ranked the world's most livable city."
    },
    {
        question: "What is the capital of Iceland?",
        answers: ["Akureyri", "Reykjavik", "Keflavik", "Hafnarfjörður"],
        correct: 1,
        fact: "Reykjavik is the world's northernmost capital city. Its name means 'Smoky Bay' from the steam rising from geothermal springs that early settlers observed."
    },
    {
        question: "What is the capital of Mongolia?",
        answers: ["Erdenet", "Darkhan", "Ulaanbaatar", "Choibalsan"],
        correct: 2,
        fact: "Ulaanbaatar is the coldest capital city in the world, with winter temperatures dropping below -40°C. It's home to nearly half of Mongolia's entire population."
    },
    {
        question: "What is the capital of Saudi Arabia?",
        answers: ["Jeddah", "Riyadh", "Mecca", "Medina"],
        correct: 1,
        fact: "Riyadh means 'the gardens' in Arabic, named after the area's former fertility. It's one of the world's fastest-growing cities in population and area."
    },
    {
        question: "What is the capital of Afghanistan?",
        answers: ["Kandahar", "Kabul", "Herat", "Mazar-i-Sharif"],
        correct: 1,
        fact: "Kabul is over 3,500 years old, making it one of the world's oldest continuously inhabited cities. It sits at an elevation of 1,790 meters in a valley between mountains."
    },
    {
        question: "What is the capital of Ethiopia?",
        answers: ["Addis Ababa", "Dire Dawa", "Gondar", "Mekelle"],
        correct: 0,
        fact: "Addis Ababa means 'New Flower' in Amharic. It's the highest capital city in Africa at 2,355 meters and serves as the diplomatic capital of Africa, hosting the African Union."
    },
    {
        question: "What is the capital of Thailand?",
        answers: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"],
        correct: 0,
        fact: "Bangkok's ceremonial name is the longest city name in the world at 168 letters! The full name starts with 'Krung Thep Mahanakhon...' and locals just call it 'Krung Thep'."
    },
    {
        question: "What is the capital of Chile?",
        answers: ["Valparaíso", "Santiago", "Concepción", "Viña del Mar"],
        correct: 1,
        fact: "Santiago is surrounded by the Andes mountains and the Chilean Coastal Range. Founded in 1541, it experiences a Mediterranean climate despite being in South America."
    },
    {
        question: "What is the capital of Poland?",
        answers: ["Kraków", "Warsaw", "Gdańsk", "Wrocław"],
        correct: 1,
        fact: "Warsaw was completely rebuilt after World War II, during which 85% of the city was destroyed. Its reconstructed Old Town is now a UNESCO World Heritage Site."
    },
    {
        question: "What is the capital of Czech Republic?",
        answers: ["Brno", "Prague", "Ostrava", "Plzeň"],
        correct: 1,
        fact: "Prague is called the 'City of a Hundred Spires' and has survived major wars intact. Its historic center is a UNESCO site featuring Gothic, Renaissance, and Baroque architecture."
    },
    {
        question: "What is the capital of Hungary?",
        answers: ["Debrecen", "Szeged", "Budapest", "Pécs"],
        correct: 2,
        fact: "Budapest was formed in 1873 by merging three cities: Buda, Óbuda, and Pest. It has more thermal springs than any other capital city, with over 100 hot springs."
    },
    {
        question: "What is the capital of Romania?",
        answers: ["Cluj-Napoca", "Bucharest", "Timișoara", "Iași"],
        correct: 1,
        fact: "Bucharest is known as 'Little Paris' due to its elegant architecture. The Palace of Parliament in Bucharest is the world's heaviest building and second-largest administrative building."
    },
    {
        question: "What is the capital of Argentina?",
        answers: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
        correct: 0,
        fact: "Buenos Aires means 'Fair Winds' in Spanish. It has the highest number of bookstores per capita in the world and is the birthplace of the tango."
    },
    {
        question: "What is the capital of Colombia?",
        answers: ["Medellín", "Bogotá", "Cali", "Cartagena"],
        correct: 1,
        fact: "Bogotá sits at 2,640 meters elevation, making it the third-highest capital in South America. It has an extensive bike lane network and a famous Sunday 'Ciclovía' event."
    },
    {
        question: "What is the capital of Indonesia?",
        answers: ["Jakarta", "Surabaya", "Bandung", "Medan"],
        correct: 0,
        fact: "Jakarta is sinking at one of the fastest rates in the world due to groundwater extraction. Indonesia is planning to move its capital to a new city called Nusantara in Borneo."
    },
    {
        question: "What is the capital of Philippines?",
        answers: ["Cebu City", "Manila", "Davao City", "Quezon City"],
        correct: 1,
        fact: "Manila is one of the world's most densely populated cities. Founded in 1571, it was named after the white-flowered mangrove plant 'nilad' that grew along the Pasig River."
    },
    {
        question: "What is the capital of Denmark?",
        answers: ["Aarhus", "Copenhagen", "Odense", "Aalborg"],
        correct: 1,
        fact: "Copenhagen is consistently ranked among the world's happiest and most livable cities. It's known for being bike-friendly, with more bicycles than cars in the city center."
    },
    {
        question: "What is the capital of Ireland?",
        answers: ["Cork", "Dublin", "Galway", "Limerick"],
        correct: 1,
        fact: "Dublin was founded by Vikings in 841 AD. The name comes from the Irish 'Dubh Linn' meaning 'Black Pool', referring to a dark tidal pool where the River Poddle entered the Liffey."
    },
    {
        question: "What is the capital of Belgium?",
        answers: ["Antwerp", "Brussels", "Bruges", "Ghent"],
        correct: 1,
        fact: "Brussels is the de facto capital of the European Union and hosts more international organizations than Washington DC. It's officially bilingual in French and Dutch."
    },
    {
        question: "What is the capital of Portugal?",
        answers: ["Porto", "Lisbon", "Braga", "Coimbra"],
        correct: 1,
        fact: "Lisbon is one of Europe's oldest cities, predating London, Paris, and Rome by centuries. It's built on seven hills and is known for its historic trams and beautiful azulejo tiles."
    }
];
