export const GUIDES = [
  // ── BURNS ──
  {
    id: 'guide_burns_mild',
    categoryId: 'cat_burns',
    title: 'Minor Burns (1st Degree)',
    severity: 'mild',
    callEmergency: false,
    overview: 'Affects only the outer skin layer. Skin is red, painful, and dry but has no blisters.',
    content: {
      en: {
        overview: 'Affects only the outer skin layer. Skin is red, painful, and dry but has no blisters.',
        steps: [
          'Cool the burn immediately under cool (not cold) running water for at least 10 minutes.',
          'Do not use ice, butter, or toothpaste — these can worsen the burn.',
          'Remove any jewelry or tight items near the burned area before swelling begins.',
          'Cover loosely with a clean non-stick bandage or cloth.',
          'Take over-the-counter pain reliever (e.g. paracetamol) if needed.',
          'Do not break any blisters that may form.',
        ],
      },
      fil: {
        overview: 'Nakakaapekto lamang sa panlabas na layer ng balat. Ang balat ay namumula, masakit, at tuyo ngunit walang paltos.',
        steps: [
          'Agad na palamig ang paso sa ilalim ng malamig (hindi yelo) na tubig nang hindi bababa sa 10 minuto.',
          'Huwag gumamit ng yelo, mantikilya, o toothpaste — maaari nitong palalaim ang paso.',
          'Alisin ang anumang alahas o mahigpit na bagay malapit sa nasunog na bahagi bago lumaki ang pamamaga.',
          'Takpan nang maluwag gamit ang malinis na non-stick na bendahe o tela.',
          'Uminom ng over-the-counter na pampanatag ng sakit (hal. paracetamol) kung kinakailangan.',
          'Huwag pagsabukin ang anumang paltos na maaaring mabuo.',
        ],
      },
    },
  },
  {
    id: 'guide_burns_severe',
    categoryId: 'cat_burns',
    title: 'Severe Burns (2nd–3rd Degree)',
    severity: 'severe',
    callEmergency: true,
    overview: 'Deep burns with blisters, charred or white skin, or burns covering large areas. Requires immediate emergency care.',
    content: {
      en: {
        overview: 'Deep burns with blisters, charred or white skin, or burns covering large areas. Requires immediate emergency care.',
        steps: [
          'Call emergency services (911) immediately.',
          'Do NOT remove burned clothing — it may be stuck to the skin.',
          'Do NOT apply water to severe burns — it can cause shock.',
          'Cover the area loosely with a clean dry cloth or sterile bandage.',
          'Keep the person warm and lying down.',
          'Monitor breathing and keep the person calm until help arrives.',
        ],
      },
      fil: {
        overview: 'Malalim na paso na may paltos, itim o puting balat, o mga paso na sumasaklaw sa malalaking lugar. Nangangailangan ng agarang tulong medikal.',
        steps: [
          'Tumawag agad sa emergency services (911).',
          'HUWAG alisin ang nasunog na damit — maaaring nakadikit ito sa balat.',
          'HUWAG maglagay ng tubig sa malubhang paso — maaaring magdulot ito ng shock.',
          'Takpan ang lugar nang maluwag gamit ang malinis na tuyong tela o sterile na bendahe.',
          'Panatilihing mainit ang tao at huwag hayaang tumayo.',
          'Bantayan ang paghinga at panatilihing kalmado ang tao hanggang dumating ang tulong.',
        ],
      },
    },
  },

  // ── CUTS & WOUNDS ──
  {
    id: 'guide_cuts_mild',
    categoryId: 'cat_cuts',
    title: 'Minor Cut or Scrape',
    severity: 'mild',
    callEmergency: false,
    overview: 'Small cuts and scrapes that bleed minimally and do not require stitches.',
    content: {
      en: {
        overview: 'Small cuts and scrapes that bleed minimally and do not require stitches.',
        steps: [
          'Wash your hands before treating the wound.',
          'Rinse the wound under clean running water for at least 5 minutes.',
          'Gently clean around the wound with mild soap — do not get soap inside the wound.',
          'Apply gentle pressure with a clean cloth to stop bleeding.',
          'Apply an antiseptic cream or solution (e.g. povidone-iodine).',
          'Cover with an adhesive bandage. Change the bandage daily.',
          'Watch for signs of infection: redness, swelling, pus, or fever.',
        ],
      },
      fil: {
        overview: 'Maliliit na hiwa at gasgas na kakaunti ang dugo at hindi nangangailangan ng tahi.',
        steps: [
          'Hugasan ang iyong mga kamay bago gamutin ang sugat.',
          'Banlawan ang sugat sa ilalim ng malinis na tubig nang hindi bababa sa 5 minuto.',
          'Maingat na linisin ang paligid ng sugat gamit ang mahinang sabon — huwag hayaang makapasok ang sabon sa loob ng sugat.',
          'Mag-apply ng mahinang presyon gamit ang malinis na tela para mapigilan ang pagdurugo.',
          'Mag-apply ng antiseptic cream o solusyon (hal. povidone-iodine).',
          'Takpan ng adhesive bandage. Palitan ang bendahe araw-araw.',
          'Bantayan ang mga palatandaan ng impeksyon: pamumula, pamamaga, nana, o lagnat.',
        ],
      },
    },
  },
  {
    id: 'guide_cuts_severe',
    categoryId: 'cat_cuts',
    title: 'Deep Cut or Laceration',
    severity: 'severe',
    callEmergency: true,
    overview: 'Deep wounds with heavy bleeding that may require stitches or professional treatment.',
    content: {
      en: {
        overview: 'Deep wounds with heavy bleeding that may require stitches or professional treatment.',
        steps: [
          'Call emergency services if bleeding is severe and uncontrolled.',
          'Apply firm, direct pressure to the wound using a clean cloth.',
          'Do not remove the cloth if it becomes soaked — add more on top.',
          'If possible, raise the injured limb above heart level.',
          'Do not attempt to remove embedded objects from the wound.',
          'Keep applying pressure until emergency help arrives.',
        ],
      },
      fil: {
        overview: 'Malalim na sugat na may matinding pagdurugo na maaaring mangailangan ng tahi o propesyonal na paggamot.',
        steps: [
          'Tumawag sa emergency services kung ang pagdurugo ay matindi at hindi mapigilan.',
          'Mag-apply ng matibay at direktang presyon sa sugat gamit ang malinis na tela.',
          'Huwag alisin ang tela kung ito ay mabasa — magdagdag pa ng tela sa ibabaw.',
          'Kung maaari, itaas ang nasaktan na braso o binti nang higit sa antas ng puso.',
          'Huwag subukang alisin ang mga bagay na nakabaon sa sugat.',
          'Patuloy na mag-apply ng presyon hanggang dumating ang emergency na tulong.',
        ],
      },
    },
  },

  // ── FRACTURES ──
  {
    id: 'guide_fractures_moderate',
    categoryId: 'cat_fractures',
    title: 'Suspected Fracture',
    severity: 'moderate',
    callEmergency: false,
    overview: 'A broken or cracked bone. Do not move the injured area. Immobilize and seek medical attention.',
    content: {
      en: {
        overview: 'A broken or cracked bone. Do not move the injured area. Immobilize and seek medical attention.',
        steps: [
          'Keep the injured area still — do not try to straighten the bone.',
          'Immobilize the area using a splint (e.g. a stick padded with cloth) above and below the fracture.',
          'Apply ice wrapped in a cloth to reduce swelling. Never apply ice directly to skin.',
          'Elevate the injured limb if possible.',
          'If the bone is piercing the skin, cover with a clean cloth — do not push it back.',
          'Seek medical attention as soon as possible.',
        ],
      },
      fil: {
        overview: 'Isang sirang o napunit na buto. Huwag galaw ang nasaktan na bahagi. I-immobilize at humingi ng medikal na tulong.',
        steps: [
          'Panatilihing hindi gumagalaw ang nasaktan na bahagi — huwag subukang ituwid ang buto.',
          'I-immobilize ang lugar gamit ang splint (hal. isang patpat na may tela) sa itaas at ibaba ng fracture.',
          'Mag-apply ng yelo na nakabalot sa tela para mabawasan ang pamamaga. Huwag mag-apply ng yelo nang direkta sa balat.',
          'Itaas ang nasaktan na braso o binti kung maaari.',
          'Kung ang buto ay tumatusok sa balat, takpan ng malinis na tela — huwag itulak pabalik.',
          'Humingi ng medikal na tulong sa lalong madaling panahon.',
        ],
      },
    },
  },

  // ── CHOKING ──
  {
    id: 'guide_choking_severe',
    categoryId: 'cat_choking',
    title: 'Choking (Adult)',
    severity: 'severe',
    callEmergency: true,
    overview: 'Airway is fully or partially blocked. Act immediately — choking can be fatal within minutes.',
    content: {
      en: {
        overview: 'Airway is fully or partially blocked. Act immediately — choking can be fatal within minutes.',
        steps: [
          'Ask "Are you choking?" — if they cannot speak or cough, act immediately.',
          'Call emergency services (911) or have someone nearby call.',
          'Perform 5 firm back blows between the shoulder blades with the heel of your hand.',
          'Perform 5 abdominal thrusts (Heimlich maneuver): stand behind the person, make a fist above the navel, and thrust inward and upward.',
          'Alternate 5 back blows and 5 abdominal thrusts until the object is expelled or the person becomes unconscious.',
          'If the person becomes unconscious, begin CPR immediately.',
        ],
      },
      fil: {
        overview: 'Ang daanan ng hangin ay ganap o bahagyang naharang. Kumilos agad — ang pag-ipit ay maaaring maging sanhi ng kamatayan sa loob ng ilang minuto.',
        steps: [
          'Itanong "Naipit ka ba?" — kung hindi sila makapagsalita o makaubo, kumilos agad.',
          'Tumawag sa emergency services (911) o magpatulong sa isang tao.',
          'Magsagawa ng 5 malakas na palumbagin sa pagitan ng mga balikat gamit ang takong ng iyong kamay.',
          'Magsagawa ng 5 abdominal thrusts (Heimlich maneuver): tumayo sa likod ng tao, gumawa ng kamao sa itaas ng pusod, at magtulak paloob at pataas.',
          'Salitan ang 5 palumbagin at 5 abdominal thrusts hanggang mailabas ang bagay o mawalan ng malay ang tao.',
          'Kung mawalan ng malay ang tao, magsimula agad ng CPR.',
        ],
      },
    },
  },

  // ── BLEEDING ──
  {
    id: 'guide_bleeding_moderate',
    categoryId: 'cat_bleeding',
    title: 'Moderate External Bleeding',
    severity: 'moderate',
    callEmergency: false,
    overview: 'Visible bleeding that can be controlled with pressure. Not immediately life-threatening.',
    content: {
      en: {
        overview: 'Visible bleeding that can be controlled with pressure. Not immediately life-threatening.',
        steps: [
          'Protect yourself — wear gloves if available.',
          'Apply firm, direct pressure to the wound with a clean cloth or bandage.',
          'Maintain pressure for at least 10 minutes without lifting the cloth.',
          'If the cloth soaks through, add more on top — do not remove the first layer.',
          'Once bleeding slows, secure with a bandage.',
          'Seek medical attention if bleeding does not stop within 15 minutes.',
        ],
      },
      fil: {
        overview: 'Nakikitang pagdurugo na maaaring kontrolin sa pamamagitan ng presyon. Hindi agad nagbabanta sa buhay.',
        steps: [
          'Protektahan ang iyong sarili — magsuot ng guwantes kung mayroon.',
          'Mag-apply ng matibay at direktang presyon sa sugat gamit ang malinis na tela o bendahe.',
          'Panatilihing may presyon nang hindi bababa sa 10 minuto nang hindi tinatanggal ang tela.',
          'Kung mabasa ang tela, magdagdag pa sa ibabaw — huwag alisin ang unang layer.',
          'Kapag humina na ang pagdurugo, i-secure gamit ang bendahe.',
          'Humingi ng medikal na tulong kung hindi tumigil ang pagdurugo sa loob ng 15 minuto.',
        ],
      },
    },
  },

  // ── SPRAINS ──
  {
    id: 'guide_sprains_mild',
    categoryId: 'cat_sprains',
    title: 'Sprain or Strain',
    severity: 'mild',
    callEmergency: false,
    overview: 'Stretched or torn ligament or muscle. Use RICE method: Rest, Ice, Compression, Elevation.',
    content: {
      en: {
        overview: 'Stretched or torn ligament or muscle. Use RICE method: Rest, Ice, Compression, Elevation.',
        steps: [
          'Rest: Stop the activity immediately. Do not put weight on the injured area.',
          'Ice: Apply ice wrapped in a cloth for 15–20 minutes every 2–3 hours.',
          'Compression: Wrap the area with an elastic bandage to reduce swelling. Not too tight.',
          'Elevation: Raise the injured limb above heart level to reduce swelling.',
          'Take over-the-counter pain reliever if needed (e.g. ibuprofen or paracetamol).',
          'Seek medical attention if severe pain, significant swelling, or inability to bear weight persists.',
        ],
      },
      fil: {
        overview: 'Nauntog o napunit na ligament o kalamnan. Gamitin ang RICE na pamamaraan: Rest, Ice, Compression, Elevation.',
        steps: [
          'Rest: Itigil agad ang aktibidad. Huwag ilagay ang timbang sa nasaktan na bahagi.',
          'Ice: Mag-apply ng yelo na nakabalot sa tela nang 15–20 minuto bawat 2–3 oras.',
          'Compression: Balutin ang lugar ng elastic na bendahe para mabawasan ang pamamaga. Huwag masyadong mahigpit.',
          'Elevation: Itaas ang nasaktan na braso o binti nang higit sa antas ng puso para mabawasan ang pamamaga.',
          'Uminom ng over-the-counter na pampanatag ng sakit kung kinakailangan (hal. ibuprofen o paracetamol).',
          'Humingi ng medikal na tulong kung may matinding sakit, malaking pamamaga, o hindi makakilos.',
        ],
      },
    },
  },

  // ── SEIZURES ──
  {
    id: 'guide_seizures_severe',
    categoryId: 'cat_seizures',
    title: 'Seizure',
    severity: 'severe',
    callEmergency: true,
    overview: 'Uncontrolled electrical activity in the brain causing convulsions. Do not restrain the person.',
    content: {
      en: {
        overview: 'Uncontrolled electrical activity in the brain causing convulsions. Do not restrain the person.',
        steps: [
          'Stay calm and call emergency services if the seizure lasts more than 5 minutes.',
          'Protect the person from injury — clear hard or sharp objects nearby.',
          'Gently guide them to the floor and place something soft under their head.',
          'Turn them on their side to prevent choking on saliva or vomit.',
          'Do NOT put anything in their mouth — this is a dangerous myth.',
          'Do NOT restrain their movements.',
          'Time the seizure. Stay with them until they are fully conscious and alert.',
        ],
      },
      fil: {
        overview: 'Hindi kontroladong electrical activity sa utak na nagdudulot ng pagkakikig. Huwag pigilan ang tao.',
        steps: [
          'Manatiling kalmado at tumawag sa emergency services kung ang seizure ay tumatagal nang higit sa 5 minuto.',
          'Protektahan ang tao mula sa pinsala — alisin ang mga matigas o matulis na bagay malapit sa kanya.',
          'Maingat na gabayan sila pababa sa sahig at maglagay ng malambot na bagay sa ilalim ng kanilang ulo.',
          'I-turn sila sa kanilang gilid para maiwasang mabulok sa laway o suka.',
          'HUWAG maglagay ng anumang bagay sa kanilang bibig — ito ay isang mapanganib na mito.',
          'HUWAG pigilan ang kanilang mga galaw.',
          'I-time ang seizure. Manatili sa kanila hanggang sila ay ganap na malay at alerto.',
        ],
      },
    },
  },

  // ── DROWNING ──
  {
    id: 'guide_drowning_severe',
    categoryId: 'cat_drowning',
    title: 'Drowning',
    severity: 'severe',
    callEmergency: true,
    overview: 'Water has entered the lungs. A life-threatening emergency — act immediately.',
    content: {
      en: {
        overview: 'Water has entered the lungs. A life-threatening emergency — act immediately.',
        steps: [
          'Call emergency services (911) immediately.',
          'Remove the person from the water safely — do not put yourself at risk.',
          'Check if the person is breathing. If not, begin CPR immediately.',
          'CPR: 30 chest compressions followed by 2 rescue breaths. Repeat.',
          'If the person is breathing, place them in the recovery position (on their side).',
          'Keep them warm — cover with a blanket or clothing.',
          'Do not leave them alone until emergency help arrives.',
        ],
      },
      fil: {
        overview: 'Ang tubig ay pumasok sa baga. Isang banta sa buhay na emergency — kumilos agad.',
        steps: [
          'Tumawag agad sa emergency services (911).',
          'Alisin ang tao mula sa tubig nang ligtas — huwag ilagay ang iyong sarili sa panganib.',
          'Suriin kung ang tao ay humihinga. Kung hindi, magsimula agad ng CPR.',
          'CPR: 30 chest compressions na sinusundan ng 2 rescue breaths. Ulitin.',
          'Kung humihinga ang tao, ilagay sila sa recovery position (sa kanilang gilid).',
          'Panatilihing mainit — takpan ng kumot o damit.',
          'Huwag iwan sila nang mag-isa hanggang dumating ang emergency na tulong.',
        ],
      },
    },
  },
];