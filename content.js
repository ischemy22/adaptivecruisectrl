/*
  ADAPTIVECRUISECTRL: SITE CONTENT
  ======================================
  This is the only file you edit. index.html reads it and draws the site.

  Rules that keep it working:
  - Text goes inside "double quotes". If your text contains a double quote, write \" instead.
  - Every item in a list ends with a comma, except it's fine to leave one after the last item too.
  - Dates are written "YYYY-MM-DD", for example "2026-10-19".
  - If something is wrong, the site shows a yellow box at the top telling you what and where.

  Bold and italics work anywhere in your text:
    **two stars** makes bold, *one star* makes italics.

  Story "body" and "take" blocks, in any order:
    "A plain string is a paragraph."
    { h: "A section heading" }
    { list: ["First point", "Second point"] }
    { quote: "Words someone said.", by: "Name, Role" }

  Story fields:
    status:   "draft" keeps it hidden from visitors (add ?preview to the address to see drafts).
              Change it to "published" when it's ready.
    stickers: the bumper stickers on the story, by id from the stickers list below. Readers tap
              a sticker to see every story that has it. Use 1 to 3.
    bluf:     (news) 2 to 4 short bullets, the whole story at a glance. Start each with a bold label
              like **What happened:**. Readers can open "Read the full summary" for the body below.
    summary:  the short blurb on the feed. Also shown in bigger text at the top of the story.
    body:     for news, the neutral summary: what happened, who said it, what isn't known.
              For a personal post (Daily Driver, Gadget Garage), just write it.
    take:     your commentary. Shows in its own "My take" box. Leave it out on personal posts.
    reported: (news only) the outlet you're commenting on. Shows "The report" box with a link:
              reported: { outlet: "Travel Weekly", title: "Their headline", url: "https://...", date: "2026-03-06" },
    photo:    the photo at the top. Save the file in the photos folder and use src: "photos/name.jpg".
              Credit lines are built from these fields:
                credit (who), creditUrl (link to them), via (where it came from, like "Wikimedia Commons"
                or "press kit"), viaUrl, license (like "CC BY-SA 4.0"), licenseUrl, title (the photo's title).
              For a Wikimedia Commons photo fill in ALL of: title, credit (the photographer), creditUrl,
              via: "Wikimedia Commons", viaUrl (the file's page), license, licenseUrl. That meets the
              attribution rules those licenses require. Leave via and license out and the site says "on Unsplash".
    updated:  (optional) the date of your latest update, like "2026-10-20". The story shows "Updated" in its byline.
    updates:  (optional) a dated log shown in a box near the top, newest first, under a line saying the
              original post below is unchanged. Add one per check-in:
              updates: [ { date: "2026-10-20", text: "What changed. Footnotes like [^cg] work here too." } ],
    sources:  the notes behind a story. Give each an id, like id: "mj". Then write [^mj] in the text where
              it applies. The site numbers the notes in the order they appear, makes each number a link
              down to the note, and adds a back-arrow from the note to the sentence. Sources you never
              cite with [^id] are listed under "Also read". Don't use [^id] in "summary" (the feed blurb).
    gallery:  (optional) more photos shown below the story text, same fields as photo plus caption.
    Example (Unsplash photos are free to use; credit is polite):
              photo: { src: "https://images.unsplash.com/photo-...?auto=format&fit=crop&w=1200&q=70",
                       alt: "What's in the picture", credit: "Photographer", creditUrl: "https://unsplash.com/photos/..." },
    video:    (optional) the id of a video below, to link the story to that review.
  Video photo (optional): photo: { src: "photos/your-car.jpg", alt: "What's in it", credit: "Who took it", via: "press photo" }
  Video fields: "brand" and "year" (the model year). The Videos page lists newest model year first.
  Video "status": "planned", "filming", "editing" or "published".
*/

window.ACC_CONTENT = {
  site: {
    name: "adaptivecruisectrl",
    url: "https://adaptivecruisectrl.com",   // your web address, no slash at the end. Used for story links, sharing and search.
    shortName: "ACC",
    tagline: "EV and driving-tech news from a disabled driver's seat.",
    intro:
      "News, deep dives and video reviews on electric vehicles, driver assistance and autonomous rides, from a disabled driver's seat.",
    // Your business email. Leave it "" until you're ready to publish it.
    contactEmail: "Ischemy22@gmail.com",
    social: [
      { icon: "youtube", label: "YouTube: @adaptivecruisectrl-official", url: "https://www.youtube.com/@adaptivecruisectrl-official" },
      { icon: "instagram", label: "Instagram: @adaptivecruisectrl", url: "https://www.instagram.com/adaptivecruisectrl" },
    ],
    // Visit counts, powered by GoatCounter (free, no cookies). Paste your GoatCounter code here,
    // for example "adaptivecruisectrl" if your address is adaptivecruisectrl.goatcounter.com. The README has the steps.
    analytics: { goatcounter: "adaptivecruisectrl" },
    // Reader discussion under each story, powered by giscus (free, runs on GitHub Discussions).
    // Fill these in after the site is on GitHub. The README shows where to get each value.
    // While they're blank, stories show "The horn works once the site launches."
    discussion: {
      repo: "ischemy22/adaptivecruisectrl",
      repoId: "R_kgDOVSgTRA",
      category: "Story Discussion",
      categoryId: "DIC_kwDOVSgTRM4DJRWI",
    },
  },

  // Bumper stickers: the playful labels on each story. The sidebar shows them all, bigger the more
  // they're used. Colors: orange, green, blue, purple, red, teal, yellow, gray, indigo.
  stickers: [
    { id: "one-pedal-club", label: "One-Pedal Club", color: "orange", about: "One-pedal driving, regen and the tech that does the braking for you." },
    { id: "plug-life", label: "Plug Life", color: "green", about: "Charging: the good, the bad and the out of reach." },
    { id: "robot-chauffeurs", label: "Robot Chauffeurs", color: "blue", about: "Robotaxis and rides with nobody in the driver's seat." },
    { id: "road-trip-gremlins", label: "Road Trip Gremlins", color: "purple", about: "Rentals, airports and everything that goes sideways on the way." },
    { id: "red-tape", label: "Red Tape", color: "red", about: "Laws, rules and the folks writing them." },
    { id: "fresh-off-the-lot", label: "Fresh Off the Lot", color: "teal", about: "New cars and big updates to old ones." },
    { id: "gadget-garage", label: "Gadget Garage", color: "yellow", about: "Products and gadgets that make the day a little easier." },
    { id: "daily-driver", label: "Daily Driver", color: "gray", about: "Day-to-day stuff from my life behind the wheel." },
    { id: "nerd-corner", label: "Nerd Corner", color: "indigo", about: "Tech deep dives, for the curious." },
  ],

  // The "Who's Driving?" page.
  about: {
    title: "Who's driving?",
    body: [
      { h: "My story" },
      "In January 2022, I was 35 years old, married to my lovely wife of 8 years, a father to a 2-year-old, newly promoted at my job, and coming off wins in two fantasy football leagues. I was having an amazingly fruitful start to my year. I started dreaming up plans to buy fast cars I was nowhere near affording. As a more realistic way to scratch the itch, I bought myself a simracing rig and spent hours practicing, trying to get faster and faster.",
      "Later that month, *cue dramatic sound effect*, an ischemic stroke forced me to go slower and slower.",
      { img: "photos/about-walking-hallway.jpg", alt: "A man seen from behind walking down a hospital hallway with a quad cane and a leg brace, a woman in scrubs beside him with a hand on his back", caption: "...slower and slower, balder and balder" },
      "As I worked to adjust to my new limitations, I realized that getting back behind the wheel wasn't going to be something I could just practice my way into. I was fortunate enough to find my way into an EV, and found that the combination of one-pedal driving, an emphasis on tech-led safety features, and continued software improvement was the way to go. After putting myself into 3 cars in 4 years and spending countless hours on research and test drives, the search for the right car continues. For me that still comes down to one-pedal driving, safety features that do some of the work, and a company that keeps improving the software. This site and my videos are where I share what I find.",
      { h: "Why adaptivecruisectrl" },
      "I'm a driver who has had to work around a car instead of with it. This site is where I follow the news on electric vehicles and driving technology, and talk about what it means for drivers and riders like me.",
      "My videos focus on drivers living with the effects of a stroke, because that's the experience I know best. The site is for the whole disabled and adaptive community.",
      "Part of why I started this: on a trip to CA, my wife and I arrived late one night and had to jump through far more hoops than anyone should to get a car I could safely drive (including potentially lying to get onto a hotel shuttle located near the lot where Turo parking was allowed). I promised her I would try to help change that. This site is how I'm keeping that promise.",
      "One-pedal driving gets a lot of us a teeny bit closer to a normal we know we'll never get back. Driving, and the freedom that comes with it, is empowering. I don\u2019t think the people who build these cars always know how much it means.",
      "So here\u2019s my ask for anyone who builds them. Bring one-pedal driving to every EV and plug-in hybrid. Let it bring the car to a full stop, work in reverse, and hold it on a hill. Make it easy to find and easy to keep on.",
      { h: "How this site works" },
      "I'm not a first-on-the-ground reporter. I read the news other outlets break, link to the original report at the top of every story, and then say what I THINK it might mean for drivers like me.",
    ],
  },

  // The "Team Up" page.
  collaborate: {
    title: "Let's team up",
    intro: "Got a car story, a gadget that made life easier, or a question you want answered? **I want to hear it.** No pitch deck needed. A few lines in an email is plenty.",
    cards: [
      { h: "Share your ride", text: "Tell me what works in your car and what drives you nuts. Every body is different, so the more of us chime in on the same car, the more useful this gets." },
      { h: "Point me at a product", text: "A grab bar, an app, a key fob trick, a seat cushion. If it made your day easier, it might make someone else's easier too." },
      { h: "Work with me", text: "Driving instructors, OTs, advocates, other creators and carmakers: if you want real-world feedback or want to make something together, let's talk." },
    ],
    note: "I read everything. I'll always ask before I share your name or your story.",
  },

  stories: [
    {
      slug: "id-buzz-one-pedal-driving",
      title: "ID. Buzz returns in 2027 as a 2028 model, and one-pedal driving is reportedly coming",
      date: "2026-10-21",
      status: "published",
      stickers: ["one-pedal-club", "fresh-off-the-lot"],
      photo: {
        src: "photos/id-buzz-rear.jpg",
        alt: "Close-up of the back of the ID. Buzz showing the VW logo and ID. Buzz lettering",
        credit: "Volkswagen of America", creditUrl: "https://media.vw.com/press-kits/2025-id-buzz-press-kit", via: "press kit",
      },
      gallery: [
        {
          src: "photos/id-buzz-main.jpg",
          alt: "An orange and white Volkswagen ID. Buzz parked on a coastal overlook with the ocean behind it",
          caption: "Front three-quarter view.",
          credit: "Volkswagen of America", creditUrl: "https://media.vw.com/press-kits/2025-id-buzz-press-kit", via: "press kit",
        },
        {
          src: "photos/id-buzz-interior.jpg",
          alt: "The ID. Buzz cabin seen from the back seat, with a white steering wheel, a center touchscreen and a wide windshield facing the ocean",
          caption: "Front cabin.",
          credit: "Volkswagen of America", creditUrl: "https://media.vw.com/press-kits/2025-id-buzz-press-kit", via: "press kit",
        },
        {
          src: "photos/id-buzz-side.jpg",
          alt: "A lime green and white ID. Buzz with its sliding side door open, showing brown leather seats",
          caption: "Sliding side door open.",
          credit: "Volkswagen of America", creditUrl: "https://media.vw.com/press-kits/2025-id-buzz-press-kit", via: "press kit",
        },
      ],



      reported: {
        outlet: "electrive",
        title: "VW postpones US return of the ID. Buzz to 2028",
        url: "https://www.electrive.com/2026/09/25/vw-postpones-us-return-of-the-id-buzz-to-2028/",
        date: "2026-09-25",
      },
      bluf: [
        "**When:** Volkswagen told U.S. dealers on September 24 that the ID. Buzz will skip the 2027 model year. It now returns in the first half of 2027 as a 2028 model.[^cs]",
        "**One-pedal driving:** VW's May announcement says regenerative braking can bring the van to a full stop without the friction brake.[^kbb] The September delay stories mostly don't repeat it, so it's reported, not confirmed.",
        "**Europe already has it:** the updated European van no longer creeps, and lifting off the accelerator can bring it to a stop.[^au][^ep]",
        "**Not known:** whether it works in reverse, whether the van holds itself on a hill, whether the strength can be changed, and whether the U.S. version matches Europe's.",
      ],
      summary:
        "Volkswagen told dealers the ID. Buzz returns in the first half of 2027 as a 2028 model. Reports say it will add one-pedal driving that stops the van without the brake pedal. Whether it works in reverse or holds on a hill isn't known.",
      body: [
        "On September 24, Volkswagen told U.S. dealers that the ID. Buzz will skip the 2027 model year. CarScoops and electrive report it now arrives in the first half of 2027 as a 2028 model. Autoevolution reports the first quarter.[^cs][^el][^ae] Electrek didn't give a quarter.[^ek] In May, VW had pointed to an August on-sale date for a 2027 model.[^kbb]",
        "VW's statement, as CarScoops quotes it: \"The 2028 ID Buzz brings together meaningful customer-focused enhancements in a single launch.\"[^cs] Volkswagen sold 6,140 ID. Buzz vans in the U.S. in 2025.[^ek] Electrek reports 432 in the third quarter of 2026, down 82.5% from a year earlier.[^e13]",
        { h: "What's planned" },
        "CarScoops lists a camping-focused Tourer trim, two-tone paint, physical buttons on the steering wheel and NACS charging. VW also promises updated software, vehicle-to-load power and a digital key.[^cs] The physical buttons replace touch controls on the steering wheel.[^au]",
        "VW has not published a price for the 2028 van. The 2025 model started at $60,000 before destination charges, and Electrek lists a range of up to 234 miles.[^kbb][^e13]",
        { h: "One-pedal driving: what's reported" },
        "KBB quotes VW's May announcement this way: regen braking \"can bring it to a full stop without the driver touching the friction brake.\"[^kbb] InsideEVs says the same and calls the missing feature on the 2025 van \"a big miss.\"[^ie]",
        "Electrek's and CarScoops' September delay stories don't mention one-pedal driving at all, and The Autopian's list of planned changes leaves it out too.[^ek][^cs][^ap]",
        "On the updated European van, Autoevolution says the one-pedal setup \"doesn't creep at low speeds.\"[^au] EV Powered says it lets the van \"be brought to a complete stop by releasing the accelerator,\" replacing a creep of about 3 mph.[^ep] EV Powered adds that with the upgraded Connected Travel Assist, the van can stop at a red light. That's a European report, and nothing I read confirms it for the U.S.[^ep]",
        { h: "What the current van does" },
        "The 2025 ID. Buzz has a B setting that increases regenerative braking. Autoweb says it slows the van as soon as you lift off the accelerator. It also says B *\"doesn't give true one-pedal driving, isn't adjustable, and won't bring the van to a complete stop.\"*[^aw] CarExpert says you \"still have to hit the brake pedal to come to a complete stop,\" and also that B mode was the reviewer's preferred way to drive.[^ce]",
        { h: "Why the delay" },
        "Volkswagen hasn't given a specific reason. Automotive News, as quoted by The Autopian, reports that VW's statement says the van \"has faced multiple hurdles.\" The Autopian lists high U.S. import tariffs since spring 2025, two recalls and the end of the $7,500 federal EV tax credit.[^ap] Autoevolution suggests software, noting that the planned features \"require a great deal of new software.\"[^ae]",
        { h: "What isn't known yet" },
        "None of the sources I read answer these:",
        {
          list: [
            "Price for the 2028 van, and whether the range changes.",
            "Whether one-pedal driving works in reverse.",
            "Whether the van holds itself still on a hill once it stops.",
            "Whether the strength of one-pedal driving can be adjusted, or whether it's a separate mode.",
            "Whether the U.S. van matches the European one.",
          ],
        },
      ],
      take: [
        "BIG, if true. One-pedal driving down to a stop and hold matters a lot to me. The Buzz was on the short list of contenders when I was looking for a car. I'm not a minivan guy, but the undeniable charm, low floor deck and general quality of life functions made it something that I thought would work great for my small family. Price and range were big factors, but the lack of one pedal eliminated it as an option completely. I know that many companies cite increased efficiency and range from coasting as the reason for the omission, but having the option matters. Moving your foot between two pedals sounds easy until it isn't. Lift off the gas, have the van slow down and stop on its own, and you've taken a step out of every drive.",
        "So goodonya' to Volkswagen for putting it in. I'd have liked it sooner, but I'd rather they get it right than rush it. There's also no indication as to why they're bringing it to the new models, but I'm going to pretend that it's because they heard feedback from the disabled community and wanted to do right by us... YAY!",
        "When it shows up I want to know three things. Does it hold on a hill, does it work in reverse, and can you change how strong it is? Europe getting it first at least means somebody will be able to say how it behaves. Though I realize that the version in Europe doesn't translate directly to the version we get here in the states.",
        "Say it with me, one pedal ornah! One pedal opens up the usability of a car for a large portion of the population. About 24.6 million U.S. adults have a disability that makes it hard to travel outside the home, and 60.4% of people with such disabilities drive.[^bts] Even if it's buried deep in the settings so it doesn't accidentally get toggled, it's a huge win for drivers like me.",
      ],
      sources: [
        {
          id: "cs",
          title: "Volkswagen's ID. Buzz Comeback Slips To 2028",
          publisher: "CarScoops, Stephen Rivers",
          date: "2026-09-24",
          url: "https://www.carscoops.com/2026/09/volkswagens-id-buzz-comeback-slips-to-2028/",
        },
        {
          id: "el",
          title: "VW postpones US return of the ID. Buzz to 2028",
          publisher: "electrive",
          date: "2026-09-25",
          url: "https://www.electrive.com/2026/09/25/vw-postpones-us-return-of-the-id-buzz-to-2028/",
        },
        {
          id: "ek",
          title: "Volkswagen delays its electric minibus for the US, again",
          publisher: "Electrek, Peter Johnson",
          date: "2026-09-24",
          url: "https://electrek.co/2026/09/24/volkswagen-delays-electric-minibus-us-again/",
        },
        {
          id: "ae",
          title: "The Volkswagen ID. Buzz's 2027 Return Has Been Pushed Back to the 2028 Model Year",
          publisher: "autoevolution",
          date: "2026-09-25",
          url: "https://www.autoevolution.com/news/the-volkswagen-id-buzz-s-2027-return-has-been-pushed-back-to-the-2028-model-year-276123.html",
        },
        {
          id: "e13",
          title: "VW's new ID. Buzz will be more affordable with lots of secret sauce",
          publisher: "Electrek, Peter Johnson",
          date: "2026-10-13",
          url: "https://electrek.co/2026/10/13/vws-new-id-buzz-more-affordable-lots-of-secret-sauce/",
          note: "Source for the Q3 2026 U.S. sales figure and 234-mile range. About the current van; the redesigned next-generation Buzz has no U.S. date.",
        },
        {
          id: "kbb",
          title: "2027 Volkswagen ID. Buzz Returns with New Tourer Camp Trim",
          publisher: "Kelley Blue Book",
          date: "2026-05-14",
          url: "https://www.kbb.com/car-news/2027-volkswagen-id-buzz-returns-with-new-tourer-camp-trim/",
          note: "Reports VW's May announcement, made before the delay.",
        },
        {
          id: "ie",
          title: "The Volkswagen ID. Buzz Returns For 2027 With New Trims And One Big Fix Owners Wanted",
          publisher: "InsideEVs, Suvrat Kothari",
          date: "2026-05-14",
          url: "https://insideevs.com/news/795883/2027-volkswagen-id-buzz-returns-to-the-us/",
        },
        {
          id: "au",
          title: "Volkswagen ID. Buzz Welcomes Summer 2026 Updates, Physical Buttons on the Steering Wheel Included",
          publisher: "autoevolution",
          date: "2026-04-23",
          url: "https://www.autoevolution.com/news/volkswagen-id-buzz-welcomes-summer-2026-updates-physical-buttons-on-the-steering-wheel-included-268998.html",
          note: "About the updated European van.",
        },
        {
          id: "ep",
          title: "ID Buzz gets new charging tech, one-pedal driving and proper buttons",
          publisher: "EV Powered",
          date: "2026-04-27",
          url: "https://evpowered.co.uk/news/2026-id-buzz-updates-v2l-one-pedal-buttons/",
          note: "UK site. Doesn't say whether the changes apply to the U.S.",
        },
        {
          id: "ap",
          title: "VW Is Delaying The ID.Buzz Return To The US Until 2028 But I'm Not Sure It Can Change Enough",
          publisher: "The Autopian, Jason Torchinsky",
          date: "2026-09-25",
          url: "https://www.theautopian.com/vw-is-delaying-the-id-buzz-return-to-the-us-until-2028-but-im-not-sure-it-can-change-enough/",
        },
        {
          id: "aw",
          title: "2025 Volkswagen ID.Buzz Road Test and Review",
          publisher: "Autoweb",
          url: "https://www.autoweb.com/2025-volkswagen-id-buzz-road-test-and-review",
        },
        {
          id: "ce",
          title: "2025 Volkswagen ID. Buzz review",
          publisher: "CarExpert",
          url: "https://www.carexpert.com.au/car-reviews/2025-volkswagen-id-buzz-review-2",
        },
        {
          id: "bts",
          title: "Travel Patterns of American Adults with Disabilities",
          publisher: "U.S. Bureau of Transportation Statistics",
          date: "2018-09-06",
          url: "https://www.bts.gov/sites/bts.dot.gov/files/docs/explore-topics-and-geography/topics/passenger-travel/222466/travel-patterns-american-adults-disabilities-11-26-19.pdf",
          note: "2017 National Household Travel Survey data: 13.4 million adults ages 18 to 64 and 11.2 million ages 65 and older have a disability that makes travel outside the home difficult. 60.4% of people with disabilities drive, versus 91.7% of people without.",
        },
      ],
    },
          {
      slug: "ev-chargers-out-of-reach",
      title: "Bill would set a deadline for EV charger accessibility guidance",
      date: "2026-10-21",
      status: "published",
      stickers: ["plug-life", "red-tape"],
      photo: {
        src: "photos/ev-chargers-electrify-america.jpg",
        alt: "A row of Electrify America fast chargers in a parking lot with palm trees and mountains behind",
        credit: "Electrify America", creditUrl: "https://www.electrifyamerica.com", via: "Electrify America website",
      },
      gallery: [
        {
          src: "photos/ev-chargers-ionna.jpg",
          alt: "An IONNA charging station with an orange canopy, two charger units and a mural on the building",
          caption: "An IONNA charging station.",
          credit: "IONNA", creditUrl: "https://www.ionna.com", via: "IONNA website",
        },
      ],
      reported: {
        outlet: "Office of Rep. Lauren Underwood",
        title: "Underwood Introduces Legislation to Expand Electric Vehicle Charging Access for Seniors and People with Disabilities",
        url: "https://underwood.house.gov/media/press-releases/underwood-introduces-legislation-expand-electric-vehicle-charging-access",
        date: "2026-05-18",
      },
      bluf: [
        "**What happened:** a bill introduced in May would give the U.S. Access Board 18 months to finalize accessibility guidance for EV chargers.",
        "**Context:** the U.S. now has more than 14,000 fast-charging stations.[^fl]",
        "**Status:** referred to two House committees on May 13. Congress.gov lists no further action as of October 20.[^cg]",
        "**Data gap:** I couldn't find a U.S. count of accessible chargers.[^mj] The UK did measure its motorway bays: 28.6% met the width standard.[^te]",
      ],
      summary:
        "A bill introduced in May would give the U.S. Access Board 18 months to finalize accessibility guidance for EV chargers. The U.S. now has more than 14,000 fast-charging stations.",
      body: [
        "Foley & Lardner's October 14 industry update estimates the U.S. had more than 14,000 fast-charging stations and 80,000 ports across all providers as of the third quarter of 2026. The update links that estimate to a Paren report. It doesn't mention the bill.[^fl]",
        "Rep. Lauren Underwood introduced the EV Charging Accessibility Act (H.R. 8778) on May 13, according to Congress.gov. Her office announced it on May 18. Reps. Mark Takano and Chuy García are co-leading it. It would require the U.S. Access Board, the federal agency that writes accessibility guidelines, to finalize guidance for EV chargers **within 18 months**. According to the announcement, that guidance has been delayed for nearly two years.[^uw]",
        "The Access Board published a proposed rule on September 3, 2024, and took comments until November 4. It received 142. The proposal would limit how high controls can sit to 48 inches and limit the force needed to operate them to 5 pounds. It would also require a cable-management system for cables over 5 pounds.[^fr] I haven't found a final rule.",
        "As of October 20, Congress.gov shows the bill was referred on May 13 to the House Transportation and Infrastructure Committee and, in addition, the Judiciary Committee. No hearing, markup or vote is listed, and the bill has 2 cosponsors.[^cg]",
        "The announcement says the goal is to make charging usable by seniors and people with disabilities, who can be left out when equipment is too tall or too heavy to operate. The American Association of People with Disabilities and the National Disability Institute endorsed the bill.",
      ],
      take: [
        "Charging sounds simple, and for the most part, it is mechanically. Lift the cable, line it up, push until it clicks, then work a screen and pay. How high the screen is, how difficult it is to clip and unclip an adapter, how heavy the cable is and how much room you have next to the car all change how hard that gets, disability or not.",
        "I don't believe this legislation seeks to force building any infrastructure. It would just tell the companies building chargers what \"accessible\" means while the network is still growing. That's the time to be asking.",
        "I went looking for a U.S. number. How many chargers can someone in a wheelchair actually use? I couldn't find one. A 2024 Mother Jones piece said the count \"isn't easy to pin down.\"[^mj] That stuck with me because if nobody is counting, nobody can say whether it's getting better.",
        "The UK did count. Motability Operations assessed 1,166 charging bays at motorway service stations and found 28.6% met the width standard of 360 cm (about 142 inches). Eleven service stations had no accessible bay at all.[^te] That's the UK, and the bays were measured in November 2024, so it's an older snapshot, but it's something and still shows what it looks like when someone measures.",
        "A few things worth keeping in mind as more get built:",
        {
          list: [
            "Screens and payment you can reach from a seated position.",
            "Cables that are easy to handle. Many are hard to twist or articulate and are generally pretty heavy.",
            "Room beside the car with no curb in the way.",
            "Payment that doesn't need fine finger control.",
          ],
        },
      ],
      sources: [
        {
          id: "uw",
          title: "Underwood Introduces Legislation to Expand Electric Vehicle Charging Access for Seniors and People with Disabilities",
          publisher: "Office of Rep. Lauren Underwood",
          date: "2026-05-18",
          url: "https://underwood.house.gov/media/press-releases/underwood-introduces-legislation-expand-electric-vehicle-charging-access",
        },
        {
          id: "cg",
          title: "H.R.8778 - EV Charging Accessibility Act, 119th Congress",
          publisher: "Congress.gov",
          date: "2026-10-20",
          url: "https://www.congress.gov/bill/119th-congress/house-bill/8778",
          note: "Bill status as checked October 20, 2026.",
        },
        {
          id: "fl",
          title: "Automotive Industry Update for October 14, 2026 (source for the charger count only; it doesn't mention the bill)",
          publisher: "Foley & Lardner, via The National Law Review",
          date: "2026-10-14",
          url: "https://natlawreview.com/article/foley-automotive-update-october-14-2026",
        },
        {
          id: "fr",
          title: "Americans With Disabilities Act and Architectural Barriers Act Accessibility Guidelines; EV Charging Stations (proposed rule, 89 FR 71215)",
          publisher: "Federal Register, U.S. Access Board",
          date: "2024-09-03",
          url: "https://www.federalregister.gov/documents/2024/09/03/2024-18820/americans-with-disabilities-act-and-architectural-barriers-act-accessibility-guidelines-ev-charging",
        },
        {
          id: "mj",
          title: "Disabled Drivers Can't Use Many Electric Car Chargers. It Doesn't Have to Be This Way.",
          publisher: "Mother Jones, Julia M\u00e9traux",
          date: "2024-04-01",
          url: "https://www.motherjones.com/environment/2024/04/disabled-drivers-ev-chargers-accessible-electric-cars/",
          note: "Says the number of accessible U.S. chargers \"isn't easy to pin down.\" The article is from 2024.",
        },
        {
          id: "te",
          title: "Majority of public feels like it is being excluded from EV transition",
          publisher: "Transport + Energy, James Evison",
          date: "2026-10-01",
          url: "https://transportandenergy.com/2026/10/01/majority-of-public-feels-like-it-is-being-excluded-from-ev-transition/",
          note: "Reports Motability Operations' bay analysis, done in November 2024, and its EV Transition Tracker survey. UK data.",
        },
      ],
    },
    {
      slug: "tesla-wheelchair-accessible-robotaxi",
      title: "Tesla says a wheelchair-accessible robotaxi is in development, but gives no timeline",
      date: "2026-10-21",
      status: "published",
      stickers: ["robot-chauffeurs", "red-tape"],
      photo: {
        src: "photos/tesla-cybercab-street.jpg",
        alt: "A gold two-seat Tesla Cybercab parked at a curb in front of a brick building, with both upward-opening doors raised",
        caption: "Tesla Cybercab. This is not the wheelchair-accessible vehicle Tesla described at the hearing.",
        credit: "Courtesy of Tesla, Inc.", via: "Tesla media gallery", viaUrl: "https://www.tesla.com/",
      },
      gallery: [
        {
          src: "photos/tesla-cybercab-interior.jpg",
          alt: "The two-seat bench cabin of the Tesla Cybercab seen through the open door",
          caption: "Tesla Cybercab. This is not the wheelchair-accessible vehicle Tesla described at the hearing.",
          credit: "Courtesy of Tesla, Inc.", via: "Tesla media gallery", viaUrl: "https://www.tesla.com/",
        },
      ],
      reported: {
        outlet: "WIRED",
        title: "Tesla says it's building a wheelchair-accessible robotaxi",
        url: "https://www.wired.com/story/tesla-says-its-building-a-wheelchair-accessible-robotaxi/",
        date: "2026-07-13",
      },
      bluf: [
        "**What happened:** At a July 13 hearing, a Tesla policy advisor told the DC Council the company is \"in development for a purpose-built, wheelchair-accessible autonomous vehicle.\"[^wi][^el]",
        "**What's missing:** Tesla gave no timeline, design or platform, and didn't respond to WIRED's request for comment.[^el]",
        "**Why it came up:** A DC bill proposed in late April would allow robotaxi service no earlier than 2028. Its one disability provision is an app for requesting rides.[^wk]",
        "**Today:** Tesla's Cybercab seats two and can't carry a seated wheelchair user. Waymo says it hasn't found a fully wheelchair-accessible platform.[^wk][^el]",
      ],
      summary:
        "Tesla told the DC Council it is developing a wheelchair-accessible autonomous vehicle. It didn't say when, or what the vehicle is.",
      body: [
        { h: "What Tesla said" },
        "Tesla senior policy advisor India Herdman spoke at a hearing on a DC bill that could allow robotaxi service in the District. She said: \"We are in development for a purpose-built, wheelchair-accessible autonomous vehicle.\" She added: \"We know that paratransit can be very difficult, and people who are confined to wheelchairs permanently should still be able to move around freely.\" Electrek says she described it as an active product being built in Texas.[^el]",
        "WIRED first reported the comments. Per WIRED, Tesla gave no timeline or platform, and Tesla didn't respond to a request for comment.[^wk]",
        { h: "What isn't known" },
        {
          list: [
            "Whether the vehicle is new or the Robovan under a new name.",
            "Any date, price or city for it.",
            "How a rider in a wheelchair would be secured with no human aboard.",
            "Whether the DC bill will add wheelchair or ADA language.",
          ],
        },
        "Electrek suspects the Robovan, a bus-sized vehicle Tesla showed in October 2024, is the likeliest platform. Tesla hasn't said so.[^el]",
        { h: "The DC bill" },
        "The Autonomous Vehicle Deployment Authorization Amendment Act of 2026 was proposed by Councilmember Charles Allen in late April.[^gg][^wk] As introduced, it would not allow commercial robotaxi service before January 1, 2028.[^gg] The Weekly Driver reports that its only disability provision is an app-based way for people with disabilities to request rides, and that the bill never uses the words \"wheelchair,\" \"ADA\" or \"paratransit.\"[^wk]",
        "The July 13 hearing ran more than seven hours with more than 80 witnesses. Heidi Case, a wheelchair user, told the council lawsuits were needed to win the District's current paratransit service.[^wk]",
        { h: "Where others stand" },
        {
          list: [
            "Tesla: its Robotaxi app added an accessibility tab in fall 2025 saying accessible rides are in the works. It points riders to third-party providers for now.[^dt][^el] Tesla's Cybercab seats two and can't carry a seated wheelchair user.[^wk]",
            "Waymo: Matt Walsh told the council Waymo has \"not been able to identify a platform that is fully wheelchair-accessible.\" Its help page says its wheelchair-accessible vans are \"driven manually.\"[^wk]",
            "Other: in February, Sen. Tammy Duckworth's office said Tesla \"offers no wheelchair accessible model\" and Waymo's accessible models lack an automated securement system. May Mobility has run an ADA-compliant Toyota Sienna since 2022, but keeps a human operator aboard to deploy the ramp and secure the chair.[^wk]",
          ],
        },
      ],
      take: [
        "A wheelchair-accessible robotaxi from Tesla would be incredible, incredible news. Saying it and building it are two different things, though, and right now there's only the saying.[^el] The engineering that goes into all of the Tesla products is nothing short of amazing, but I do wonder how high on the priority list this would be with everything else that they have flying on.",
        "The part I keep coming back to is how the chair gets secured. A driverless van has nobody to strap it down. Waymo's accessible vans are driven manually, and May Mobility keeps an operator aboard to run the ramp and secure the chair.[^wk] Whoever solves that with no person on board is solving the hard part.",
        "Then there's DC. The bill's one disability provision is an app for requesting rides.[^wk] An app is fine, but a ride request only matters if a vehicle that fits you shows up. It's worth asking what that vehicle has to be before 2028 gets here.",
        "Tesla put its answer on the record. I'll be watching for the next one, a date or a vehicle, and I'll update this story when it comes.",
      ],
      sources: [
        {
          id: "wi",
          title: "Tesla says it's building a wheelchair-accessible robotaxi",
          publisher: "WIRED",
          url: "https://www.wired.com/story/tesla-says-its-building-a-wheelchair-accessible-robotaxi/",
        },
        {
          id: "el",
          title: "Tesla is building a wheelchair-accessible robotaxi",
          publisher: "Electrek, Fred Lambert",
          date: "2026-07-13",
          url: "https://electrek.co/2026/07/13/tesla-wheelchair-accessible-robotaxi/",
        },
        {
          id: "wk",
          title: "Robotaxi wheelchair accessibility and the DC bill",
          publisher: "The Weekly Driver, Michael Kahn",
          date: "2026-07-17",
          url: "https://theweeklydriver.com/2026/07/robotaxi-wheelchair-accessibility-dc-bill/",
        },
        {
          id: "gg",
          title: "Plans for autonomous vehicles stall in the Washington region",
          publisher: "Greater Greater Washington",
          date: "2026-06-15",
          url: "https://ggwash.org/view/103757/plans-for-autonomous-vehicles-stalled-in-the-washington-region",
        },
        {
          id: "dt",
          title: "Tesla working on accessibility rides as part of Robotaxi expansion",
          publisher: "Drive Tesla Canada, Matt Wilson",
          date: "2025-09-19",
          url: "https://driveteslacanada.ca/news/tesla-accessibility-rides-robotaxi-expansion/",
        },
      ],
    },
  ],

  videos: [
    {
      id: "rivian-r1s-2027",
      title: "2027 Rivian R1S",
      brand: "Rivian",
      year: 2027,
      status: "filming",
      youtubeId: "",
      disclosure: "",
    },
    {
      id: "bmw-ix-2024",
      title: "2024 BMW iX",
      brand: "BMW",
      year: 2024,
      status: "filming",
      // When it's live, paste the YouTube video id (the part after watch?v=) here:
      youtubeId: "",
      // Optional. Required by the FTC if a carmaker lent you the car or you use affiliate links.
      disclosure: "",
    },
    {
      id: "volvo-ex90-2025",
      title: "2025 Volvo EX90",
      brand: "Volvo",
      year: 2025,
      status: "filming",
      youtubeId: "",
      disclosure: "",
    },
  ],

  // Groups and people you work with. Add a url when you have one.
  // Paused for now. Remove the // marks to bring this section back on the Collaborate page.
  // community: [
  //   { name: "Adaptive Fitness Legion", url: "" },
  //   { name: "United Adaptive Boxing Council", url: "" },
  // ],
};
