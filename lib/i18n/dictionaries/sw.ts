/**
 * Kiswahili messages (default language). This file defines the message shape;
 * en.ts must provide every key. Texts are working drafts and must be reviewed
 * by TDSP before public launch. Organization wording taken verbatim from the
 * source documents is marked in comments.
 */
export const sw = {
  meta: {
    siteName: "TDSP Farmers Value Chain",
    orgName: "Today's Development and Skills Promotion Organization (TDSP)",
    description:
      "Mfumo wa kidijitali wa kuunganisha wakulima, vikundi, watoa huduma, masoko na washirika wa maendeleo.",
  },
  nav: {
    home: "Nyumbani",
    about: "Kuhusu TDSP",
    services: "Huduma",
    contact: "Mawasiliano",
    join: "Jiunge na TDSP",
    login: "Ingia",
    mainNav: "Menyu kuu",
    language: "Lugha",
    skipToContent: "Ruka hadi maudhui",
    documentCentre: "Kituo cha Nyaraka cha TDSP",
    welcome: "Karibu TDSP",
    projects: "Miradi & Andiko",
    membership: "Uanachama",
    newsOpportunities: "Habari & Fursa",
    documents: "Document Centre",
    bottomNav: "Menyu ya chini",
    contactStrip: "Taarifa za mawasiliano",
    location: "Dar es Salaam, Tanzania",
    orgDisplay: "Today's Development and Skills Promotion Organization",
    tagline: "Kilimo ni biashara, mkulima ni mwekezaji.",
    tabs: {
      home: "Karibu",
      services: "Huduma",
      opportunities: "Fursa",
      news: "Habari",
      account: "Akaunti",
    },
  },
  home: {
    hero: {
      eyebrow: "Karibu TDSP",
      title: "Kuimarisha Wakulima, Masoko na Fursa za Maendeleo",
      text: "Tunawawezesha wakulima, vikundi na wadau wa kilimo kupitia teknolojia, mafunzo, ushirikiano na upatikanaji wa masoko.",
      ctaJoin: "Jiunge na TDSP",
      ctaVideo: "Tazama Video",
    },
    stats: {
      label: "Wanaohudumiwa na TDSP",
      farmers: { short: "Wakulima", long: "Wakulima Tunaowawezesha" },
      groups: { short: "Vikundi", long: "Vikundi na Ushirika" },
      partners: { short: "Wadau", long: "Wadau na Washirika" },
      regions: { short: "Mikoa", long: "Mikoa ya Utekelezaji" },
    },
    services: {
      eyebrow: "Huduma Zetu Kuu",
      documentsLink: "Nyaraka za umma: TDSP Document Centre",
      title: "Fursa na Msaada kwa Wakulima",
      text: "Tunaunganisha wakulima na rasilimali, maarifa, masoko na fedha ili kuongeza tija, thamani na kipato.",
      cards: {
        valueChain: { title: "Farmers Value Chain", text: "Kuongeza thamani ya mazao" },
        projects: { title: "Miradi & Andiko", text: "Uandaaji na usimamizi wa miradi" },
        financial: { title: "Financial Linkage", text: "Kuunganisha na huduma za kifedha" },
        markets: { title: "Masoko", text: "Ufikiaji wa masoko ya ndani na nje" },
        training: { title: "Elimu & Ujuzi", text: "Mafunzo na ujuzi wa kilimo na biashara" },
        providers: { title: "Watoa Huduma", text: "Wataalamu, wasambazaji na washirika" },
      },
    },
    banner: {
      title: "Jiunge na Mtandao wa TDSP",
      text: "Unganishwa na mafunzo, masoko, ushauri na fursa za maendeleo.",
    },
    stepsTitle: "Jinsi ya kujiunga",
    steps: {
      register: {
        title: "Fungua akaunti",
        text: "Jaza taarifa zako na weka barua pepe na nenosiri.",
      },
      pay: {
        title: "Lipa ada ya uanachama",
        text: "Utapewa maelekezo ya malipo ndani ya akaunti yako.",
      },
      receipt: {
        title: "Pakia risiti",
        text: "Tuma risiti ya malipo yako kwa uhakiki.",
      },
      approval: {
        title: "Subiri idhini",
        text: "TDSP ikihakiki na kukuidhinisha, unapata huduma zote za wanachama.",
      },
    },
  },
  about: {
    title: "Kuhusu TDSP",
    breadcrumb: {
      label: "Njia ya ukurasa",
      home: "Karibu TDSP",
      current: "Kuhusu TDSP",
    },
    hero: {
      title: "Kuhusu TDSP",
      // Corrected from the mockup's "Mashirika linalowezesha" (plural noun with
      // a singular verb) to "Shirika linalowezesha". TDSP to confirm.
      text: "Shirika linalowezesha wakulima, vikundi na wadau wa kilimo kupitia mafunzo, teknolojia, ushirikiano na fursa za masoko.",
    },
    who: {
      eyebrow: "Muhtasari",
      title: "TDSP ni Nani?",
      // Built from TDSP's own documents (App Phase 2 guide homepage text and
      // Waraka No. 2 on TDSP's role), not from the mockup's marketing copy.
      text: "TDSP (Today's Development and Skills Promotion Organization) ni shirika la maendeleo lililosajiliwa. Kupitia TDSP Farmers Value Chain, TDSP huratibu uunganishaji wa wakulima, vikundi, wajasiriamali, watoa huduma, masoko, taasisi za fedha na washirika wa maendeleo, kama mratibu, mwezeshaji na mfuatiliaji.",
      registration: "Namba ya usajili wa shirika: 00NGO/0009096",
      photoAlt: "Mkulima akishikilia mazao ya kijani shambani",
      focusLabel: "Maeneo yetu ya kuzingatia",
      focus: {
        farming: "Kilimo Endelevu",
        empowerment: "Uwezeshaji",
        markets: "Fursa za Soko",
        partnership: "Ushirikiano",
      },
    },
    purpose: {
      label: "Dira, dhamira na maadili",
      officialNote: "Maneno rasmi ya Katiba ya TDSP (Kiingereza)",
      vision: "Dira Yetu",
      mission: "Dhamira Yetu",
      values: "Maadili Yetu",
    },
    objectives: {
      title: "Malengo Yetu",
      subtitle:
        "Malengo mahususi ya mfumo wa TDSP Farmers Value Chain (Waraka Na. 2 wa TDSP)",
      items: {
        grants:
          "Kuwaunganisha wanachama na mifuko ya ruzuku na fursa za ufadhili kutoka serikalini na mashirika ya maendeleo.",
        youth:
          "Kuunganisha vijana na fursa za ajira, mafunzo ya ufundi, ujasiriamali na ubunifu.",
        women:
          "Kuwawezesha wanawake na vikundi vyao kupata fursa za mitaji, vifaa, mafunzo na masoko.",
        disability:
          "Kuwezesha watu wenye ulemavu kupata fursa zinazozingatia mahitaji yao na usawa wa kijamii.",
        farmers:
          "Kuunganisha wakulima na wanunuzi, wasindikaji, wasambazaji wa pembejeo na huduma za kilimo.",
        board:
          "Kuanzisha ubao maalumu wa kutangaza programu zinazohitaji michango kutoka kwa wadau.",
        partners:
          "Kuwezesha mashirika, kampuni na taasisi kushiriki katika programu za maendeleo.",
        tracking:
          "Kuweka mfumo wa kufuatilia maombi, michango, utekelezaji na matokeo ya programu.",
        reports:
          "Kutoa taarifa na ripoti zinazosaidia kufanya maamuzi ya maendeleo.",
      },
    },
  },
  membership: {
    title: "Uanachama",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      title: "Uanachama",
      text: "Jiunge na TDSP na uwe sehemu ya mtandao wa wakulima, vikundi na wadau wa kilimo.",
      photoLabel: "Wakulima wawili wakitabasamu shambani",
    },
    benefits: {
      title: "Manufaa ya Uanachama",
      items: {
        markets: "Fursa za Masoko na Wanunuzi",
        training: "Mafunzo na Ujuzi",
        finance: "Uunganishaji na Fedha",
        network: "Mtandao wa Wakulima na Vikundi",
        partners: "Ushirikiano na Wadau",
        documents: "Taarifa, Waraka na Nyaraka",
      },
    },
    join: {
      title: "Jiunge na TDSP Leo",
      // The mockup said membership "opens opportunities for ... fedha"; TDSP
      // connects members to financial institutions and does not lend.
      text: "Uanachama unakuunganisha na fursa za mafunzo, masoko, huduma za kifedha, ushirikiano na huduma mbalimbali za maendeleo ya kilimo.",
      register: "Sajili Uanachama Sasa",
      login: "Nimesajiliwa Tayari? Ingia",
      note: "Uanachama unaidhinishwa na TDSP baada ya uhakiki.",
    },
    categories: {
      title: "Aina za Uanachama",
      items: {
        individual: {
          title: "Mwanachama Binafsi",
          text: "Kwa wakulima, wajasiriamali na wadau binafsi wa kilimo.",
        },
        groups: {
          title: "Uanachama wa Vikundi",
          text: "Kwa vikundi vya wakulima, ushirika au jumuiya za kilimo.",
        },
        institutions: {
          title: "Uanachama wa Taasisi",
          text: "Kwa mashirika, taasisi na wadau wa maendeleo ya kilimo.",
        },
      },
    },
    requirements: {
      title: "Masharti ya Uanachama",
      items: {
        rules: "Kukubali malengo na kanuni za TDSP.",
        form: "Kujaza fomu ya uanachama.",
        contact: "Kutoa taarifa sahihi za mawasiliano.",
        fee: "Kukamilisha ada ya uanachama (kama inahusika).",
        participate: "Kushiriki katika shughuli na programu za TDSP.",
      },
    },
    draftNote: "Aina na masharti haya yanasubiri idhini rasmi ya TDSP.",
    banner: {
      title: "Wakulima Wenye Nguvu, Mifumo ya Kilimo Endelevu",
      button: "Jiunge na TDSP Sasa",
      imageAlt: "Mche mdogo wa kijani ukiota kwenye udongo",
    },
  },
  valueChain: {
    title: "Farmers Value Chain",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Kuunganisha mkulima na masoko, kuongeza thamani ya mazao na kuongeza kipato cha wakulima.",
      photoLabel: "Mkulima mwanamke akishikilia kikapu cha nyanya mbichi shambani",
    },
    diagram: {
      label: "Hatua nne za mnyororo wa thamani",
      center: "TDSP Value Chain",
      stages: {
        production: "Uzalishaji",
        processing: "Uchakataji na Ongezeko la Thamani",
        markets: "Masoko na Wanunuzi",
        transport: "Usafirishaji na Usambazaji",
      },
      alts: {
        production: "Mikono ikipanda mche mdogo kwenye udongo",
        processing: "Kreti za mbao zilizojaa nyanya",
        markets: "Soko la mazao lenye wauzaji na wanunuzi",
        transport: "Lori la kijani la kusafirisha mazao",
      },
    },
    about: {
      eyebrow: "Kuhusu Value Chain",
      title: "TDSP Farmers Value Chain",
      text: "Jukwaa la kuimarisha mnyororo wa thamani wa mazao ya kilimo kuanzia uzalishaji, uchakataji, usafirishaji hadi masoko, ili kuongeza thamani ya mazao, kupunguza upotevu na kuboresha kipato cha wakulima.",
      cta: "Jifunze Zaidi",
    },
    benefits: {
      title: "Manufaa Muhimu ya Value Chain",
      items: {
        value: { title: "Thamani Zaidi", text: "Kuongeza thamani ya mazao kupitia uchakataji na ubora." },
        markets: { title: "Masoko ya Uhakika", text: "Kuunganisha wakulima na wanunuzi wa uhakika." },
        losses: { title: "Kupunguza Upotevu", text: "Kuboresha uvunaji, uhifadhi na usafirishaji." },
        partners: { title: "Ushirikiano Endelevu", text: "Kujenga ushirikiano kati ya wakulima, vikundi na wadau." },
      },
    },
    banner: {
      title: "Tuimarishe Mnyororo wa Thamani wa Mazao ya Kilimo",
      button: "Jiunge na TDSP Sasa",
      imageAlt: "Shamba la kijani wakati wa jua kuchomoza",
    },
  },
  projectsPage: {
    title: "Miradi & Andiko",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Miradi ya maendeleo ya kilimo na andiko (maombi) ya ufadhili kwa ushirikiano na wadau mbalimbali.",
      photoLabel: "Mkulima mwenye kofia ya majani akitabasamu shambani la mahindi",
    },
    servicesTitle: "Huduma Zetu Muhimu",
    services: {
      implementation: { title: "Utekelezaji wa Miradi", text: "Kusimamia na kutekeleza miradi ya kilimo kwa jamii." },
      proposals: { title: "Andiko la Ufadhili", text: "Kuandaa na kuwasilisha andiko la miradi kwa wafadhili." },
      partnerships: { title: "Ushirikiano wa Kimkakati", text: "Kushirikiana na wadau wa maendeleo ya kilimo." },
      monitoring: { title: "Ufuatiliaji na Tathmini", text: "Kupima matokeo na athari za miradi kwa wakulima." },
    },
    list: {
      title: "Miradi Yetu",
      mockNote: "Mifano ya muundo wa ukurasa tu. Miradi hii si taarifa halisi zilizothibitishwa za TDSP; itabadilishwa na miradi halisi.",
      period: "Kipindi",
      location: "Mahali",
      status: { ongoing: "Inaendelea", completed: "Imekamilika" },
      items: {
        irrigation: { title: "Mradi wa Kilimo cha Umwagiliaji", text: "Kuimarisha uzalishaji wa mazao kwa teknolojia ya umwagiliaji.", alt: "Mashamba ya mboga yakimwagiliwa" },
        poultry: { title: "Mradi wa Ufugaji wa Kuku", text: "Kuongeza kipato cha wakulima kupitia ufugaji wa kuku wa kisasa.", alt: "Vifaranga vya kuku" },
        training: { title: "Mradi wa Mafunzo kwa Wakulima", text: "Kujenga uwezo wa wakulima katika uzalishaji, thamani na masoko.", alt: "Mkufunzi akiwafundisha kikundi cha wakulima wanawake" },
      },
    },
    detail: {
      back: "Rudi kwenye Miradi",
      view: "Tazama maelezo",
      sampleNote: "Mfano wa muundo wa ukurasa tu. Maelezo haya si taarifa halisi zilizothibitishwa za TDSP; yatabadilishwa na taarifa halisi zilizoidhinishwa.",
      facts: { status: "Hali", period: "Kipindi", location: "Mahali" },
      aboutTitle: "Kuhusu Mradi",
      objectivesTitle: "Malengo ya Mradi",
      targetTitle: "Walengwa",
      items: {
        irrigation: {
          p1: "Mradi huu unalenga kuwasaidia wakulima kuzalisha mazao kwa uhakika zaidi kwa kutumia teknolojia rahisi za umwagiliaji.",
          p2: "Unahusisha kuonyesha mbinu za umwagiliaji shambani na kuwafundisha wakulima jinsi ya kuzitumia na kuzitunza.",
          o1: "Kuimarisha uzalishaji wa mazao katika kipindi cha ukame.",
          o2: "Kuwajengea wakulima uwezo wa kutumia teknolojia ya umwagiliaji.",
          o3: "Kuhimiza matumizi bora ya maji shambani.",
          target: "Wakulima wadogo na vikundi vya wakulima.",
        },
        poultry: {
          p1: "Mradi huu unalenga kuongeza kipato cha wakulima kupitia ufugaji wa kuku wa kisasa na wenye mpangilio.",
          p2: "Unahusisha mafunzo ya utunzaji wa vifaranga, lishe na kinga ya magonjwa, pamoja na kuunganisha wafugaji na masoko.",
          o1: "Kuwafundisha wafugaji mbinu za kisasa za ufugaji wa kuku.",
          o2: "Kuboresha utunzaji na afya ya kuku.",
          o3: "Kuwaunganisha wafugaji na wadau wa masoko.",
          target: "Wafugaji wadogo, vikundi vya wanawake na vijana.",
        },
        training: {
          p1: "Mradi huu ulilenga kujenga ujuzi wa wakulima katika uzalishaji, uongezaji thamani na masoko.",
          p2: "Ulitoa mafunzo kwa vitendo kwa vikundi vya wakulima na kuhamasisha mazoea bora ya kilimo-biashara.",
          o1: "Kuongeza ujuzi wa wakulima katika uzalishaji wenye tija.",
          o2: "Kuwafundisha wakulima kuongeza thamani ya mazao yao.",
          o3: "Kuwapa wakulima uelewa wa masoko.",
          target: "Wakulima na vikundi vya wakulima, wakiwemo wanawake.",
        },
      },
    },
    proposal: {
      title: "Andiko (Maombi) ya Miradi",
      text: "Tunatayarisha andiko la miradi (proposal) kwa ajili ya kupata ufadhili kutoka kwa wadau wa maendeleo, taasisi za ndani na kimataifa.",
      cta: "Wasiliana Kuhusu Andiko",
    },
    banner: {
      title: "Shirikiana Nasi katika Miradi ya Maendeleo ya Kilimo",
      button: "Tujadili Ushirikiano",
      imageAlt: "Mche mdogo wa kijani ukiota kwenye udongo wakati wa jua kuchomoza",
    },
  },
  financialPage: {
    title: "Uunganishaji wa Fedha",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      // Mockup said "kupata ... mikopo"; TDSP does not lend, so "kuunganishwa na".
      text: "Kuwasaidia wakulima, vikundi na vyama vya ushirika kuunganishwa na huduma za kifedha, mikopo, uwekezaji na bima ya kilimo.",
      photoLabel: "Mkulima mwanamke na afisa wa kilimo wakitazama simu shambani",
    },
    servicesTitle: "Huduma za Kifedha",
    services: {
      loans: { title: "Upatikanaji wa Mikopo", text: "Kuwaunganisha wakulima na taasisi za fedha zinazotoa mikopo ya kilimo." },
      insurance: { title: "Bima ya Kilimo", text: "Kuunganisha wakulima na huduma za bima za mazao na mifugo." },
      investment: { title: "Uwekezaji wa Kilimo", text: "Kuvutia na kuunganisha uwekezaji katika mnyororo wa thamani wa kilimo." },
      services: { title: "Huduma za Kifedha", text: "Kuunganishwa na huduma za benki, malipo ya kidijitali na usimamizi wa fedha." },
    },
    list: {
      title: "Fursa za Ufadhili na Fedha",
      note: "Haya ni maelezo ya jumla ya aina za huduma za kifedha. TDSP haihusiki na utoaji wa mikopo moja kwa moja. TDSP huwawezesha wanachama kupata elimu ya fedha, kuandaa taarifa na nyaraka muhimu na kuwaunganisha na taasisi za fedha na washirika wanaofaa. Uamuzi wa kutoa au kutokutoa fedha unabaki kwa taasisi husika ya fedha kwa mujibu wa taratibu zake.",
      general: "Taarifa ya jumla",
      items: {
        loans: { badge: "Mikopo", title: "Mikopo ya Kilimo", text: "Taarifa kuhusu mikopo ya kilimo inayotolewa na taasisi za fedha kwa wakulima, vikundi na vyama vya ushirika.", alt: "Miche midogo ikiota juu ya mirundo ya sarafu" },
        investment: { badge: "Uwekezaji", title: "Uwekezaji katika Kilimo", text: "Fursa za uwekezaji katika uzalishaji, uchakataji na masoko ya mazao.", alt: "Mashamba ya kijani yakimwagiliwa" },
        insurance: { badge: "Bima", title: "Bima ya Mazao na Mifugo", text: "Ulinzi wa mazao na mifugo dhidi ya majanga na hatari za uzalishaji.", alt: "Trekta ya kijani shambani wakati wa jua kuchwa" },
      },
    },
    partner: {
      title: "Unganisha Biashara Yako na Taasisi za Kifedha",
      text: "Tunakusaidia kuandaa mahitaji, kukutambulisha kwa taasisi za kifedha na kutafuta suluhisho linalofaa la ufadhili kwa shughuli zako za kilimo.",
      cta: "Wasiliana na Timu Yetu",
    },
    banner: {
      title: "Jenga Uwezo wa Kifedha kwa Maendeleo Endelevu ya Kilimo",
      button: "Pata Ushauri wa Kifedha",
      imageAlt: "Miche midogo ikiota juu ya mirundo ya sarafu",
    },
  },
  masokoPage: {
    title: "Masoko",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Kuunganisha wakulima, vikundi na wanunuzi ili kuongeza fursa za soko, thamani na mapato ya mazao.",
      photoLabel: "Mkulima mwanamke akitabasamu kwenye soko la mboga na matunda",
      findMarket: "Tafuta Soko la Mazao",
      registerNeeds: "Sajili Mahitaji Yako",
    },
    benefits: {
      markets: { title: "Fursa za Masoko", text: "Taarifa za wanunuzi na mahitaji ya mazao." },
      partnership: { title: "Ushirikiano wa Biashara", text: "Kuunganisha wakulima na wanunuzi, wasindikaji na wasambazaji." },
      value: { title: "Thamani ya Mazao", text: "Ushauri wa kuongeza ubora, ufungashaji na viwango." },
      income: { title: "Fursa za Mapato", text: "Kuunganisha wakulima na wanunuzi ili kuongeza fursa za mapato." },
    },
    produce: {
      title: "Fursa za Masoko kwa Mazao Muhimu",
      note: "Haya ni makundi ya mazao, si orodha ya wanunuzi wala ofa za soko zilizothibitishwa. TDSP huunganisha; haihakikishii wanunuzi, mauzo wala bei.",
      items: {
        maize: { label: "Mahindi", alt: "Mahindi mabichi" },
        coffee: { label: "Kahawa", alt: "Matunda mekundu ya kahawa kwenye tawi" },
        avocado: { label: "Parachichi", alt: "Parachichi lililokatwa" },
        tomato: { label: "Nyanya", alt: "Nyanya mbichi" },
        chicken: { label: "Kuku", alt: "Kuku" },
        veg: { label: "Mbogamboga", alt: "Mboga za majani, kabichi na karoti" },
      },
    },
    steps: {
      title: "Jinsi Inavyofanya Kazi",
      items: {
        join: { title: "Sajili / Jiunge", text: "Wakulima, vikundi au wanunuzi wanajisajili kwenye jukwaa." },
        needs: { title: "Tangaza Mahitaji", text: "Weka mazao unayouza au unayonunua." },
        connect: { title: "Unganika", text: "Pata mawasiliano na washirika wanaofaa." },
        trade: { title: "Fanya Biashara", text: "Kubaliana masharti, ubora na uwasilishaji." },
      },
    },
    banner: {
      title: "Tafuta Fursa za Soko kwa Mazao Yako",
      text: "Jiunge na mtandao wa TDSP ili upate taarifa za wanunuzi, mahitaji ya soko na fursa za biashara ndani na nje ya nchi.",
      button: "Jiunge na TDSP Sasa",
      imageAlt: "Shamba la kijani wakati wa jua kuchomoza",
    },
  },
  elimuPage: {
    title: "Elimu & Ujuzi",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Kujenga ujuzi, maarifa na uwezo wa wakulima, vikundi na wanachama ili kuongeza tija, ubora na thamani ya mazao katika mnyororo wa thamani.",
      photoLabel: "Mkufunzi akiwafundisha kikundi cha wakulima shambani",
      viewTraining: "Tazama Mafunzo",
      requestTraining: "Omba Mafunzo",
    },
    benefits: {
      practical: { title: "Maarifa ya Vitendo", text: "Mafunzo yanayotegemea mahitaji halisi ya wakulima." },
      groups: { title: "Uimarishaji wa Vikundi", text: "Kuongeza uwezo wa vikundi na usimamizi bora." },
      quality: { title: "Tija na Ubora", text: "Kuboresha uzalishaji, ubora na kupunguza hasara." },
      value: { title: "Thamani na Mapato", text: "Kuongeza thamani ya mazao na fursa za masoko." },
    },
    fields: {
      title: "Mada za Mafunzo na Ujuzi",
      note: "Hizi ni mada za mafunzo zinazopendekezwa, si ratiba ya mafunzo. Tarehe, mahali na wakufunzi bado havijatangazwa.",
      items: {
        production: { title: "Uzalishaji Bora", text: "Mbinu bora za uzalishaji endelevu na wenye tija.", alt: "Mche mdogo wa kijani ukiota kwenye udongo" },
        protection: { title: "Usimamizi wa Mazao", text: "Utunzaji, udhibiti wa magonjwa na kudumisha ubora.", alt: "Mashamba ya mboga za majani" },
        storage: { title: "Uvunaji na Uhifadhi", text: "Mbinu sahihi za kuvuna, kuhifadhi na kupunguza hasara.", alt: "Magunia ya mahindi yaliyohifadhiwa" },
        value: { title: "Uongezaji Thamani", text: "Usindikaji wa mazao na utengenezaji wa bidhaa zenye thamani zaidi.", alt: "Bidhaa za mazao zilizosindikwa kwenye mitungi na vifungashio" },
        markets: { title: "Masoko na Biashara", text: "Uelewa wa soko, ubora wa bidhaa na mawasiliano na wanunuzi.", alt: "Machungwa na nyanya kwenye kreti" },
        leadership: { title: "Uongozi na Usimamizi", text: "Uongozi wa vikundi, utawala bora na usimamizi wa rasilimali.", alt: "Wakulima watatu wakijadiliana" },
      },
    },
    banner: {
      title: "Jiunge na Mafunzo yetu",
      text: "Wasiliana nasi kupata taarifa kuhusu mafunzo, nyenzo za kujifunza na fursa za kuimarisha ujuzi wako katika kilimo na biashara ya mazao.",
      button: "Pata Taarifa za Mafunzo",
      imageAlt: "Shamba la kijani wakati wa jua kuchomoza",
    },
  },
  providersPage: {
    title: "Watoa Huduma",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Kuunganisha wakulima na vikundi vya kilimo na watoa huduma mbalimbali wanaosaidia shughuli za kilimo katika mnyororo wa thamani.",
      photoLabel: "Wakulima na maafisa wa kilimo wakitazama kompyuta kibao shambani",
      categories: "Aina za Huduma",
      info: "Pata Taarifa",
    },
    benefits: {
      essential: { title: "Huduma Muhimu", text: "Aina mbalimbali za huduma zinazosaidia uzalishaji na uendelevu." },
      expertise: { title: "Utaalamu", text: "Kuunganishwa na wataalamu na watoa huduma katika sekta ya kilimo." },
      partnership: { title: "Ushirikiano", text: "Kukuza ushirikiano kati ya wakulima, vikundi na watoa huduma." },
      chain: { title: "Mnyororo wa Thamani", text: "Kusaidia kuongeza tija, ubora na thamani ya mazao." },
    },
    categories: {
      title: "Aina za Huduma",
      items: {
        inputs: { title: "Pembejeo na Vifaa", text: "Mbegu bora, mbolea na vifaa vya kilimo.", alt: "Magunia ya mbolea na mbegu" },
        machinery: { title: "Zana na Mitambo", text: "Zana na mitambo ya kisasa inayosaidia uzalishaji.", alt: "Trekta nyekundu shambani" },
        advice: { title: "Ushauri wa Kilimo", text: "Ushauri wa kitaalamu katika uzalishaji, tija na ubora.", alt: "Mkulima akishauriwa na afisa wa kilimo" },
        transport: { title: "Usafirishaji", text: "Huduma za usafirishaji wa pembejeo na mazao.", alt: "Lori la kijani lililobeba mazao" },
        storage: { title: "Uhifadhi", text: "Suluhisho za uhifadhi salama wa mazao ili kudumisha ubora.", alt: "Maghala ya kuhifadhia nafaka" },
        processing: { title: "Uchakataji wa Mazao", text: "Huduma za kuongeza thamani ya mazao.", alt: "Wafanyakazi wakichakata mazao kiwandani" },
      },
    },
    noticeLabel: "Kumbuka:",
    notice: "Hizi ni aina za huduma zinazoweza kupatikana katika mnyororo wa thamani wa kilimo. Taarifa za watoa huduma maalum zitatangazwa baada ya uthibitisho na TDSP.",
    steps: {
      title: "Jinsi Ushirikiano Unavyofanya Kazi",
      items: {
        need: { title: "Tambua Hitaji", text: "Bainisha huduma unayohitaji katika shughuli zako za kilimo." },
        type: { title: "Tafuta Aina ya Huduma", text: "Chagua aina ya huduma inayolingana na hitaji lako." },
        contact: { title: "Wasiliana kupitia TDSP", text: "Unganika na TDSP kwa taarifa na mwongozo kuhusu watoa huduma (baada ya uthibitisho)." },
        follow: { title: "Fuatilia Makubaliano", text: "Endelea kufuatilia na kusimamia makubaliano ya huduma kwa ushirikiano." },
      },
    },
    banner: {
      title: "Pata Taarifa za Ushirikiano na Watoa Huduma",
      text: "Jua zaidi kuhusu fursa za kuunganishwa na watoa huduma mbalimbali katika mnyororo wa thamani wa kilimo.",
      button: "Pata Taarifa za Watoa Huduma",
      imageAlt: "Shamba la kijani wakati wa jua kuchomoza",
    },
  },
  documentsPage: {
    title: "TDSP Document Centre",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Nyaraka rasmi za umma, miongozo, ripoti na machapisho ya TDSP Farmers Value Chain.",
      imageLabel: "Nyaraka na vitabu vya TDSP Farmers Value Chain vilivyopangwa mezani",
      searchLabel: "Tafuta nyaraka",
      placeholder: "Tafuta nyaraka (mf. sera, mwongozo, ripoti...)",
      searchButton: "Tafuta",
    },
    benefits: {
      official: { title: "Nyaraka Rasmi", text: "Sera, miongozo na nyaraka za kitaaluma." },
      publications: { title: "Machapisho", text: "Ripoti, taarifa na machapisho ya TDSP." },
      learning: { title: "Rasilimali za Mafunzo", text: "Vifaa vya kujifunza na kuongeza ujuzi." },
      download: { title: "Pakua kwa Urahisi", text: "Pata na pakua nyaraka za umma unazohitaji kwa urahisi." },
    },
    categories: {
      title: "Makundi ya Nyaraka",
      all: "Zote",
      viewAll: "Angalia Zote",
      items: { policy: "Sera na Miongozo", training: "Mafunzo na Mielekezo", reports: "Ripoti na Tathmini", publications: "Machapisho", other: "Nyingine" },
    },
    recent: {
      title: "Nyaraka za Hivi Karibuni",
      download: "Pakua",
      published: "Imepakiwa",
      none: "Hakuna nyaraka zilizochapishwa bado. Nyaraka za umma zilizoidhinishwa na TDSP zitaonekana hapa.",
      noResults: "Hakuna nyaraka zilizopatikana kwa utafutaji huu.",
      clear: "Futa utafutaji",
      resultsFor: "Matokeo ya utafutaji",
    },
    featured: {
      badge: "Nyaraka Teule",
      download: "Pakua Sasa",
      none: "Nyaraka teule itaonekana hapa baada ya TDSP kuchapisha nyaraka za umma.",
    },
    accessNote: "Ni nyaraka za umma zilizoidhinishwa na TDSP pekee zinazoonyeshwa hapa. Nyaraka za ndani, za siri au zenye taarifa binafsi hazipatikani kupitia ukurasa huu.",
    banner: {
      title: "Unatafuta Nyaraka Maalum?",
      text: "Tafadhali wasiliana nasi kama hujapata unachohitaji katika Document Centre.",
      button: "Wasiliana Nasi",
      imageAlt: "Shamba la kijani wakati wa jua kuchomoza",
    },
  },
  newsPage: {
    title: "Habari & Fursa",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Soma taarifa mpya za TDSP na upate fursa muhimu zinazochangia kukuza thamani kwa wakulima.",
      imageLabel: "Shamba la kijani wakati wa jua kuchomoza",
      news: "Pata Taarifa Mpya",
      opportunities: "Tazama Fursa",
    },
    benefits: {
      trusted: { title: "Habari Zinazoaminika", text: "Taarifa rasmi na matukio ya TDSP." },
      growth: { title: "Fursa za Maendeleo", text: "Ushirikiano, mafunzo na miradi." },
      farmers: { title: "Taarifa kwa Wakulima", text: "Maarifa na rasilimali za kilimo." },
      stayInformed: { title: "Kaa Ulihabarika", text: "Pata masasisho muhimu mara kwa mara." },
    },
    tabs: { label: "Sehemu za ukurasa", news: "Habari", opportunities: "Fursa" },
    news: {
      title: "Habari Mpya",
      viewAll: "Tazama Habari Zote",
      readMore: "Soma Zaidi",
      none: "Hakuna habari zilizochapishwa bado. Habari rasmi zilizoidhinishwa na TDSP zitaonekana hapa.",
      categories: { news: "Habari", projects: "Mradi", events: "Matukio" },
    },
    opportunities: {
      title: "Fursa Mpya",
      viewAll: "Tazama Fursa Zote",
      details: "Angalia Maelezo",
      deadline: "Mwisho",
      none: "Hakuna fursa zilizochapishwa bado. Fursa zilizothibitishwa na TDSP zitaonekana hapa. TDSP haidhamini ufadhili, ajira au nafasi kwa mtu yeyote.",
    },
    banner: {
      title: "Usikose Taarifa na Fursa Muhimu",
      text: "Jiunge na orodha yetu ya taarifa upate habari, fursa na masasisho ya TDSP moja kwa moja.",
      imageAlt: "Shamba la kijani wakati wa jua kuchomoza",
      emailLabel: "Barua pepe yako",
      emailPlaceholder: "Weka barua pepe yako",
      button: "Jiunge Sasa",
      emailRequired: "Tafadhali andika barua pepe.",
      emailInvalid: "Barua pepe si sahihi.",
      notSubscribedTitle: "Hujajiunga bado",
      notSubscribed: "Orodha ya taarifa bado haijaunganishwa na mfumo wa kuhifadhi barua pepe, kwa hiyo barua pepe yako haijahifadhiwa.",
    },
  },
  accountPage: {
    title: "Akaunti Yako ya",
    titleAccent: "TDSP",
    pageTitle: "Akaunti Yako ya TDSP",
    crumb: "Akaunti",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Ingia kwenye akaunti yako au jiunge na TDSP ili upate huduma, taarifa, fursa na ushirikiano wa karibu katika mnyororo wa thamani wa kilimo.",
      imageLabel: "Mkulima mwanamume na mwanamke wakitumia tablet shambani",
      login: "Ingia kwenye Akaunti",
      join: "Jiunge na TDSP",
    },
    benefits: {
      services: { title: "Huduma za TDSP", text: "Pata huduma na rasilimali za wakulima." },
      opportunities: { title: "Fursa na Miradi", text: "Pata taarifa za miradi, mafunzo na fursa za maendeleo." },
      information: { title: "Taarifa Muhimu", text: "Fuatilia habari, matangazo na nyaraka za TDSP." },
      collaboration: { title: "Ushirikiano", text: "Jiunge na mtandao wa wakulima, washirika na wadau wa sekta ya kilimo." },
    },
    choose: "Chagua Uendelee",
    cards: {
      login: { title: "Ingia (Login)", text: "Tayari una akaunti? Ingia upate huduma na taarifa zako.", button: "Ingia kwenye Akaunti" },
      join: { title: "Jiunge na TDSP (Join)", text: "Bado huna akaunti? Jiunge na TDSP na uwe sehemu ya mtandao wetu.", button: "Jiunge na TDSP" },
      forgot: { title: "Umesahau Nenosiri?", text: "Tunakusaidia kurejesha ufikiaji kwenye akaunti yako.", button: "Rejesha Nenosiri" },
    },
  },
  services: {
    open: "Fungua ukurasa",
    title: "Huduma",
    intro: "Huduma kuu ambazo wanachama wanaweza kuomba kupitia TDSP.",
    items: {
      membership: {
        title: "Uanachama",
        text: "Maombi ya uanachama wa TDSP kwa wakulima, vikundi na wajasiriamali.",
      },
      project: {
        title: "Mradi na Andiko",
        text: "Msaada wa kuandaa wazo la mradi na andiko.",
      },
      financial: {
        title: "Financial Linkage & Credit Facilitation",
        // Verbatim from the App Phase 2 guide, section "Financial Linkage".
        text: "TDSP haihusiki na utoaji wa mikopo moja kwa moja. TDSP huwawezesha wanachama kupata elimu ya fedha, kuandaa taarifa na nyaraka muhimu, kutathmini utayari wao wa kifedha na kuwaunganisha na taasisi za fedha na washirika wanaofaa. Uamuzi wa kutoa au kutokutoa fedha unabaki kwa taasisi husika ya fedha kwa mujibu wa taratibu zake.",
      },
      markets: {
        title: "Masoko",
        text: "Wakulima kuweka mazao yao na wanunuzi kuweka mahitaji; TDSP huunganisha.",
      },
      training: {
        title: "Mafunzo",
        text: "Fursa za mafunzo na kuongeza ujuzi.",
      },
      valueChain: {
        title: "Farmers Value Chain",
        text: "Uzalishaji, nyongeza ya thamani na masoko ya mazao.",
      },
      providers: {
        title: "Watoa Huduma",
        text: "Tafuta na uunganishwe na wataalamu, wasambazaji na washirika.",
      },
      documents: {
        title: "TDSP Document Centre",
        text: "Nyaraka na machapisho ya umma ya TDSP.",
      },
      other: {
        title: "Huduma nyingine",
        text: "Maombi mengine ya huduma yanayoelekezwa kwa idara husika.",
      },
    },
  },
  contactPage: {
    title: "Mawasiliano",
    breadcrumbLabel: "Njia ya ukurasa",
    hero: {
      text: "Wasiliana nasi kwa maswali, maoni, ushirikiano au usaidizi kuhusu TDSP Farmers Value Chain.",
      sendMessage: "Tuma Ujumbe",
      call: "Piga Simu",
    },
    benefits: {
      questions: { title: "Uliza Maswali", text: "Pata majibu kuhusu TDSP na shughuli zetu." },
      partnership: { title: "Ushirikiano", text: "Jadili fursa za ushirikiano na utekelezaji wa miradi." },
      feedback: { title: "Maoni na Mapendekezo", text: "Tupatie maoni yako ili tuendelee kuboresha huduma zetu." },
      support: { title: "Usaidizi", text: "Pata mwongozo na taarifa unazohitaji." },
    },
    info: {
      title: "Taarifa za Mawasiliano",
      intro: "Tunaweza kufikiwa kupitia njia zifuatazo:",
      address: "Anwani",
      addressValue: "Mbagala Kilungule, Dar es Salaam, Tanzania",
      email: "Barua pepe",
      phone: "Simu",
      hours: "Masaa ya Kazi",
      hoursValue: "Bado hayajatangazwa. TDSP itathibitisha.",
    },
    map: {
      label: "Ramani ya eneo la Dar es Salaam",
      city: "Dar es Salaam",
      caption: "Mbagala Kilungule, Dar es Salaam",
      note: "Eneo kamili la ofisi litawekwa kwenye ramani baada ya TDSP kulithibitisha.",
      open: "Tafuta kwenye ramani",
    },
    form: {
      title: "Tuma Ujumbe",
      name: "Jina lako",
      namePlaceholder: "Ingiza jina lako",
      email: "Barua pepe",
      emailPlaceholder: "Ingiza barua pepe yako",
      subject: "Mada",
      subjectPlaceholder: "Chagua mada yako",
      message: "Ujumbe wako",
      messagePlaceholder: "Andika ujumbe wako hapa...",
      counter: "ya",
      submit: "Tuma Ujumbe",
      required: "inahitajika",
      subjects: { general: "Swali la jumla", partnership: "Ushirikiano", feedback: "Maoni na mapendekezo", support: "Usaidizi", other: "Nyingine" },
      errors: {
        nameRequired: "Tafadhali andika jina lako.",
        emailRequired: "Tafadhali andika barua pepe.",
        emailInvalid: "Barua pepe si sahihi.",
        subjectRequired: "Tafadhali chagua mada.",
        messageRequired: "Tafadhali andika ujumbe wako.",
        messageLong: "Ujumbe usizidi herufi 500.",
      },
      notSentTitle: "Ujumbe wako haujatumwa",
      notSent: "Fomu hii bado haijaunganishwa na mfumo wa kupokea ujumbe, kwa hiyo hakuna kilichotumwa. Unaweza kutuma ujumbe huu kwa barua pepe yako mwenyewe kwa kiungo kilicho hapa chini.",
      openEmail: "Fungua barua pepe",
    },
    banner: {
      title: "Tuungane katika Kuimarisha Kilimo",
      text: "Wasiliana nasi leo na tujadili jinsi tunavyoweza kushirikiana katika kuongeza thamani kwa wakulima.",
      button: "Jadili Ushirikiano",
      imageAlt: "Shamba la kijani wakati wa jua kuchomoza",
    },
  },
  form: {
    required: "Inahitajika",
    optional: "hiari",
    showPassword: "Onyesha nenosiri",
    hidePassword: "Ficha nenosiri",
    select: "Chagua",
    sending: "Inatuma...",
    notConfigured:
      "Mfumo wa akaunti bado haujaunganishwa. Tafadhali jaribu tena baadaye au wasiliana na ofisi ya TDSP.",
    genericError: "Imeshindikana. Tafadhali jaribu tena.",
  },
  join: {
    title: "Jiunge na TDSP",
    pageTitle: "Jiunge na TDSP",
    breadcrumbLabel: "Njia ya ukurasa",
    crumb: "Jiunge na TDSP",
    intro: "Jaza taarifa zako kujiunga na TDSP na upate huduma, taarifa na fursa mbalimbali.",
    stepNote:
      "Kufungua akaunti hakukufanyi mwanachama. Uanachama unaidhinishwa na TDSP baada ya uhakiki.",
    hero: {
      title: "Jiunge na",
      accent: "TDSP",
      text: "Kuwa sehemu ya mtandao wa wakulima, wadau na washirika wa sekta ya kilimo.",
      imageLabel: "Mkulima mwanamume na mwanamke wakitumia tablet shambani",
    },
    benefitsTitle: "Faida za Uanachama",
    benefits: {
      network: { title: "Mtandao Mpana", text: "Unganika na wakulima na wadau wa kilimo." },
      projects: { title: "Fursa za Miradi", text: "Pata taarifa za fursa za miradi." },
      services: { title: "Huduma za Kitaalamu", text: "Pata taarifa, mafunzo na rasilimali muhimu." },
      information: { title: "Taarifa za Kitaaluma", text: "Pokea habari, matangazo na maendeleo ya sekta." },
    },
    stepsLabel: "Hatua za usajili",
    steps: { basic: "Taarifa za Msingi", extra: "Taarifa za Ziada", confirm: "Thibitisha" },
    stepHeadings: {
      basic: { title: "Taarifa za Msingi", text: "Weka taarifa zako za msingi ili kuanza usajili wako." },
      extra: { title: "Taarifa za Ziada", text: "Taarifa hizi zinatusaidia kukufikia na kuelewa maeneo unayovutiwa nayo." },
      confirm: { title: "Thibitisha", text: "Hakiki taarifa zako kabla ya kufungua akaunti." },
    },
    sections: { location: "Mahali ulipo", interests: "Maeneo ya ushiriki" },
    fields: {
      firstName: "Jina la Kwanza",
      lastName: "Jina la Mwisho",
      email: "Barua pepe",
      phone: "Namba ya Simu",
      password: "Nenosiri",
      confirmPassword: "Thibitisha Nenosiri",
      gender: "Jinsia",
      region: "Mkoa",
      district: "Wilaya",
      ward: "Kata",
      village: "Mtaa / Kijiji",
      occupation: "Kazi au shughuli ya sasa",
      areas: "Chagua maeneo unayovutiwa nayo",
      consent:
        "Nathibitisha kuwa taarifa nilizotoa ni za kweli. Naelewa kuwa taarifa hizi zitatumika kwa madhumuni ya uanachama na tathmini ya ombi, na TDSP itazihifadhi kwa usalama na kuzifikia kwa watu walioidhinishwa tu.",
    },
    placeholders: {
      firstName: "Ingiza jina la kwanza",
      lastName: "Ingiza jina la mwisho",
      email: "Ingiza barua pepe yako",
      phone: "Ingiza namba yako",
      password: "Angalau herufi 8",
      confirmPassword: "Rudia nenosiri lako",
    },
    hints: { phone: "Mfano: 689 671 666", countryCode: "Tanzania, +255" },
    gender: { male: "Mwanamume", female: "Mwanamke", none: "Sipendi kutaja" },
    areas: {
      agriculture: "Kilimo na mifugo",
      technology: "Ufundi na teknolojia",
      business: "Ujasiriamali na biashara",
      education: "Elimu na mafunzo",
      health: "Afya na ustawi",
      environment: "Mazingira na nishati safi",
      digital: "Ajira na ujuzi wa kidijitali",
      other: "Nyingine",
    },
    review: { name: "Jina", email: "Barua pepe", phone: "Simu", location: "Mahali" },
    next: "Endelea",
    back: "Rudi",
    submit: "Jiunge na TDSP",
    haveAccount: "Tayari una akaunti?",
    signIn: "Ingia hapa",
    errors: {
      firstNameRequired: "Tafadhali andika jina la kwanza.",
      lastNameRequired: "Tafadhali andika jina la mwisho.",
      phoneRequired: "Tafadhali andika namba ya simu.",
      phoneInvalid: "Namba ya simu si sahihi.",
      emailRequired: "Tafadhali andika barua pepe.",
      emailInvalid: "Barua pepe si sahihi.",
      regionRequired: "Tafadhali andika mkoa.",
      districtRequired: "Tafadhali andika wilaya.",
      wardRequired: "Tafadhali andika kata.",
      passwordShort: "Nenosiri liwe na angalau herufi 8.",
      passwordMismatch: "Manenosiri hayafanani.",
      consentRequired: "Lazima ukubali tamko hili ili kuendelea.",
    },
    success:
      "Akaunti yako imefunguliwa. Kama ujumbe wa uthibitisho umetumwa kwenye barua pepe yako, ufuate kwanza, kisha uingie kwenye akaunti yako.",
    alreadyRegistered:
      "Barua pepe hii tayari imetumika. Tafadhali ingia au tumia 'Umesahau nenosiri?'.",
    loginLink: "Ingia",
  },
  login: {
    title: "Ingia (Login)",
    pageTitle: "Ingia kwenye Akaunti",
    breadcrumbLabel: "Njia ya ukurasa",
    crumb: "Ingia",
    subtitle: "Tayari una akaunti? Ingia upate huduma na taarifa zako.",
    hero: {
      title: "Ingia kwenye Akaunti Yako",
      accent: "TDSP",
      text: "Fikia huduma, taarifa, miradi na fursa za TDSP katika mnyororo wa thamani wa kilimo.",
      imageLabel: "Mkulima mwanamume na mwanamke wakitumia tablet shambani",
    },
    benefits: {
      services: { title: "Huduma za Wakulima", text: "Pata huduma na rasilimali muhimu." },
      information: { title: "Taarifa na Matangazo", text: "Pata taarifa rasmi na matangazo ya TDSP." },
      network: { title: "Mtandao wa Wakulima", text: "Ushirikiano na wadau wa sekta ya kilimo." },
    },
    fields: {
      email: "Barua pepe",
      emailPlaceholder: "Ingiza barua pepe yako",
      password: "Nenosiri",
      passwordPlaceholder: "Ingiza nenosiri lako",
    },
    remember: "Nikumbuke kwenye kifaa hiki",
    forgot: "Umesahau Nenosiri?",
    submit: "Ingia kwenye Akaunti",
    noAccount: "Bado huna akaunti?",
    join: "Jiunge na TDSP",
    errors: {
      emailRequired: "Tafadhali andika barua pepe.",
      emailInvalid: "Barua pepe si sahihi.",
      passwordRequired: "Tafadhali andika nenosiri.",
    },
    invalidCredentials: "Barua pepe au nenosiri si sahihi.",
    emailNotConfirmed: "Barua pepe haijathibitishwa. Tafadhali fungua kiungo ulichotumiwa kwenye barua pepe yako ili kuthibitisha akaunti.",
    signedIn: "Umeingia kwa mafanikio.",
  },
  forgot: {
    title: "Umesahau Nenosiri?",
    pageTitle: "Umesahau Nenosiri?",
    breadcrumbLabel: "Njia ya ukurasa",
    crumb: "Umesahau Nenosiri",
    hero: {
      title: "Umesahau",
      accent: "Nenosiri?",
      text: "Usijali. Weka barua pepe yako ya usajili, tutakutumia kiungo cha kuweka nenosiri jipya.",
      imageLabel: "Mkulima mwanamume na mwanamke wakitumia tablet shambani",
    },
    text: "Weka barua pepe yako ya usajili na tutakutumia kiungo cha kuweka nenosiri jipya.",
    emailLabel: "Barua pepe",
    emailPlaceholder: "Ingiza barua pepe yako ya usajili",
    submit: "Tuma Kiungo cha Kuweka Nenosiri",
    back: "Rudi kwenye Ingia",
    sent: "Kama barua pepe hii imesajiliwa, utapokea maelekezo ya kuweka nenosiri jipya.",
    stepsLabel: "Hatua za kurejesha nenosiri",
    steps: {
      one: { title: "1. Weka Barua Pepe", text: "Ingiza barua pepe uliyoitumia kujisajili na TDSP." },
      two: { title: "2. Pokea Kiungo", text: "Angalia barua pepe yako kwa kiungo cha kuweka nenosiri jipya." },
      three: { title: "3. Weka Nenosiri Jipya", text: "Tumia kiungo hicho kuunda nenosiri jipya salama." },
    },
    errors: {
      emailRequired: "Tafadhali andika barua pepe.",
      emailInvalid: "Barua pepe si sahihi.",
    },
  },
  status: {
    comingSoon: {
      breadcrumbLabel: "Njia ya ukurasa",
      crumb: "Inakuja Hivi Karibuni",
      pill: "Coming Soon",
      title: "Inakuja Hivi Karibuni",
      text: "Tunaifanyia kazi sehemu hii ili kukuletea huduma bora zaidi. Tafadhali rudi tena hivi karibuni.",
      button: "Rudi Mwanzo",
      illustrationLabel: "Kompyuta, kofia ya ujenzi na koni: kazi inaendelea",
      cards: {
        services: {
          title: "Huduma Mpya",
          text: "Tunaongeza huduma muhimu zaidi kwa wakulima.",
        },
        improvements: {
          title: "Uboreshaji",
          text: "Tunaendelea kuboresha huduma na uzoefu wako.",
        },
        // The mockup promised notifications; no notification feature exists,
        // so the claim is limited to what is true: it will be announced here.
        announce: {
          title: "Taarifa",
          text: "Tutatangaza hapa mara tu itakapozinduliwa.",
        },
      },
    },
    notFound: {
      title: "Ukurasa haujapatikana",
      text: "Samahani, ukurasa unaoutafuta haupo, umehamishwa au umeondolewa.",
      button: "Rudi Mwanzo",
      illustrationLabel: "404: mashamba ya kijani na jua linachomoza",
      tryLabel: "Unaweza pia kujaribu:",
      links: {
        services: "Angalia Huduma zetu",
        opportunities: "Tazama Fursa za Kilimo",
        news: "Soma Habari na Matukio",
        contact: "Wasiliana nasi kwa msaada",
      },
      tips: {
        check: "Angalia kiungo ulichobofya",
        browse: "Tumia menyu kuvinjari tovuti",
        help: "Wasiliana nasi ukihitaji msaada",
      },
    },
  },
  footer: {
    linksLabel: "Viungo vya chini",
    rights: "Haki zote zimehifadhiwa.",
    slogan: "Kilimo ni biashara, mkulima ni mwekezaji.",
  },
} as const satisfies Record<string, unknown>;

type Widen<T> = T extends string
  ? string
  : { -readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof sw>;
