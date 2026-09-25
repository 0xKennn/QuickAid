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
      ceb: {
        overview: 'Nakaapekto lang sa gawas nga panit. Ang panit pula, sakit, ug uga apan walay paltos.',
        steps: [
          'Bugnawi dayon ang paso ubos sa bugnaw (dili yelo) nga tubig sulod sa dili moubos sa 10 minutos.',
          'Ayaw paggamit og yelo, mantekilya, o toothpaste — kini makapagrabe sa paso.',
          'Kuhaa ang bisan unsang alahas o hugot nga butang duol sa nasunog nga bahin sa dili pa mohubag.',
          'Taboni og hinay-hinay gamit ang limpyo nga non-stick nga bendahe o panapton.',
          'Pag-inom og over-the-counter nga tambal sa kasakit (pananglitan, paracetamol) kung gikinahanglan.',
          'Ayaw butoha ang bisan unsang paltos nga motungha.',
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
      ceb: {
        overview: 'Lalom nga paso nga adunay paltos, itom o puti nga panit, o paso nga lapad. Kinahanglan og dali nga tabang medikal.',
        steps: [
          'Tawag dayon sa emergency services (911).',
          'AYAW kuhaa ang nasunog nga sinina — tingali kini nadikit na sa panit.',
          'AYAW pagbutang og tubig sa grabe nga paso — mahimo ni hinungdan sa shock.',
          'Taboni ang bahin og hinay-hinay gamit ang limpyo ug uga nga panapton o sterile nga bendahe.',
          'Painiton ang tawo ug pahigdaa.',
          'Bantayi ang pagginhawa ug palinawa ang tawo hangtod moabot ang tabang.',
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
      ceb: {
        overview: 'Gagmay nga hiwa ug gasgas nga gamay ra ang dugo ug dili na kinahanglan tahion.',
        steps: [
          'Hugasi ang imong kamot sa dili pa tambalan ang samad.',
          'Banlasi ang samad ubos sa limpyo nga nagdagayday nga tubig sulod sa dili moubos sa 5 minutos.',
          'Hinay-hinay nga limpyohi ang palibot sa samad gamit ang mahumok nga sabon — ayaw pasudla ang sabon sa sulod sa samad.',
          'Pagbutang og hinay nga pressure gamit ang limpyo nga panapton aron mohunong ang dugo.',
          'Pagbutang og antiseptic cream o solusyon (pananglitan, povidone-iodine).',
          'Taboni og adhesive bandage. Ilisi ang bendahe kada adlaw.',
          'Bantayi ang mga timailhan sa impeksyon: kapula, paghubag, nana, o hilanat.',
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
      ceb: {
        overview: 'Lalom nga samad nga grabe ang pagdugo nga tingali magkinahanglan og tahi o propesyonal nga pagtambal.',
        steps: [
          'Tawag sa emergency services kung grabe ug dili mahunong ang pagdugo.',
          'Pagbutang og lig-on, direkta nga pressure sa samad gamit ang limpyo nga panapton.',
          'Ayaw kuhaa ang panapton kung mabasa na kini — pagdugang na lang og laing panapton sa ibabaw.',
          'Kung mahimo, ituboy ang nasamdan nga bukton o tiil labaw sa lebel sa kasingkasing.',
          'Ayaw pagsulay og kuha sa mga butang nga natusok sa samad.',
          'Padayon sa pagpresyur hangtod moabot ang emergency nga tabang.',
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
      ceb: {
        overview: 'Usa ka naguba o naliki nga bukog. Ayaw ilihok ang nasamdan nga bahin. I-immobilize ug pangayo og tabang medikal.',
        steps: [
          'Ayaw ilihok ang nasamdan nga bahin — ayaw sulayi nga ituwid ang bukog.',
          'I-immobilize ang bahin gamit ang splint (pananglitan, kahoy nga may tabon nga panapton) sa taas ug ubos sa fracture.',
          'Pagbutang og yelo nga giputos sa panapton aron makunhuran ang paghubag. Ayaw ibutang ang yelo direkta sa panit.',
          'Ituboy ang nasamdan nga bukton o tiil kung mahimo.',
          'Kung ang bukog motusok sa panit, taboni og limpyo nga panapton — ayaw kini itulod pabalik.',
          'Pangita og tabang medikal sa labing dali nga panahon.',
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
      ceb: {
        overview: 'Sarado o parte nga sarado ang agianan sa hangin. Lihok dayon — ang pagkabuno mahimong makamatay sulod sa pipila ka minuto.',
        steps: [
          'Pangutan-a "Nabuno ka ba?" — kung dili sila makasulti o makaubo, lihok dayon.',
          'Tawag sa emergency services (911) o pahangyoa ang usa ka tawo nga tawagan kini.',
          'Buhata ang 5 ka kusog nga pagbunal sa likod tunga sa abaga gamit ang puno sa imong kamot.',
          'Buhata ang 5 ka abdominal thrusts (Heimlich maneuver): tindog sa likod sa tawo, pagbuhat og kinumo sa ibabaw sa pusod, ug itulod paingon sa sulod ug pataas.',
          'Alternatehon ang 5 ka pagbunal sa likod ug 5 ka abdominal thrusts hangtod mogawas ang butang o mawad-an og panimuot ang tawo.',
          'Kung mawad-an og panimuot ang tawo, sugdi dayon ang CPR.',
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
      ceb: {
        overview: 'Makita nga pagdugo nga makontrolar pinaagi sa pressure. Dili dayon makuyaw sa kinabuhi.',
        steps: [
          'Panalipdi ang imong kaugalingon — pagsul-ob og guwantes kung naa.',
          'Pagbutang og lig-on, direkta nga pressure sa samad gamit ang limpyo nga panapton o bendahe.',
          'Padayon ang pressure sulod sa dili moubos sa 10 minutos nga dili pagkuhaon ang panapton.',
          'Kung mabasa ang panapton, pagdugang og laing panapton sa ibabaw — ayaw kuhaa ang una nga layer.',
          'Sa dihang mohinay na ang pagdugo, i-secure gamit ang bendahe.',
          'Pangita og tabang medikal kung dili mohunong ang pagdugo sulod sa 15 minutos.',
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
      ceb: {
        overview: 'Naunat o nagisi nga ligament o kaunuran. Gamita ang RICE method: Rest, Ice, Compression, Elevation.',
        steps: [
          'Rest: Ihunong dayon ang kalihokan. Ayaw ibutang ang gibug-aton sa nasamdan nga bahin.',
          'Ice: Pagbutang og yelo nga giputos sa panapton sulod sa 15–20 minutos kada 2–3 ka oras.',
          'Compression: Balutan ang bahin og elastic nga bendahe aron makunhuran ang paghubag. Ayaw hugti pag-ayo.',
          'Elevation: Ituboy ang nasamdan nga bukton o tiil labaw sa lebel sa kasingkasing aron makunhuran ang paghubag.',
          'Pag-inom og over-the-counter nga tambal sa kasakit kung gikinahanglan (pananglitan, ibuprofen o paracetamol).',
          'Pangita og tabang medikal kung grabe ang kasakit, dako nga paghubag, o dili makalihok.',
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
      ceb: {
        overview: 'Dili makontrolar nga electrical activity sa utok nga hinungdan sa pagkirig. Ayaw pugngi ang tawo.',
        steps: [
          'Pabilin nga kalmado ug tawag sa emergency services kung ang seizure molungtad og sobra sa 5 minutos.',
          'Panalipdi ang tawo gikan sa kadaot — kuhaa ang gahi o hait nga mga butang duol kaniya.',
          'Hinay-hinay nga giyahi sila paubos sa salog ug pagbutang og humok nga butang ubos sa ilang ulo.',
          'I-turn sila sa ilang kilid aron malikayan nga mabuno sa laway o suka.',
          'AYAW pagbutang og bisan unsa sa ilang baba — kini usa ka delikado nga sayop nga tuohanan.',
          'AYAW pugngi ang ilang paglihok.',
          'I-time ang seizure. Pabilin uban kanila hangtod sila hingpit nga mahimatngon.',
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
      ceb: {
        overview: 'Nakasulod ang tubig sa baga. Usa ka makuyaw sa kinabuhi nga emergency — lihok dayon.',
        steps: [
          'Tawag dayon sa emergency services (911).',
          'Kuhaa ang tawo gikan sa tubig nga luwas — ayaw ibutang ang imong kaugalingon sa kakuyaw.',
          'Susiha kung nagginhawa ang tawo. Kung wala, sugdi dayon ang CPR.',
          'CPR: 30 ka chest compressions sundan og 2 ka rescue breaths. Balika.',
          'Kung nagginhawa ang tawo, ibutang sila sa recovery position (sa ilang kilid).',
          'Painiton sila — taboni og habol o sinina.',
          'Ayaw sila biyai nga nag-inusara hangtod moabot ang emergency nga tabang.',
        ],
      },
    },
  },
];