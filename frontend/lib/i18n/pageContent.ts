import type { SupportedLanguage } from "@/lib/types";

type Principle = { title: string; body: string };

type AboutContent = {
  label: string;
  headingPrefix: string;
  introFallback: string;
  body1: string;
  body2: string;
  ethicsLinkLabel: string;
  body3: string;
  contactLinkLabel: string;
};

type EthicsContent = {
  label: string;
  heading: string;
  intro: string;
  principles: Principle[];
  contactPrefix: string;
};

type CareersContent = {
  label: string;
  heading: string;
  body1: string;
  body2: string;
  body3prefix: string;
  body3suffix: string;
};

type ContactContent = {
  label: string;
  heading: string;
  intro: string;
  followUs: string;
};

export const aboutContent: Record<SupportedLanguage, AboutContent> = {
  en: {
    label: "About",
    headingPrefix: "About",
    introFallback:
      "Burundi Today is an independent newsroom covering the Great Lakes region, reported in English, French, and Kirundi.",
    body1:
      "We cover politics, business, culture, and sport with a focus on stories that matter to readers across the region — not just the headlines that travel best internationally. Our newsroom is small, deliberately so: every story that runs has been read, checked, and signed off by a real editor before it's published.",
    body2:
      "We're funded by advertising and, where relevant, reader support — never by political parties, governments, or corporate sponsors with a stake in how a story is told.",
    ethicsLinkLabel: "Read our editorial standards →",
    body3:
      "Have a story tip, a correction to flag, or feedback on our coverage? We'd rather hear it than not.",
    contactLinkLabel: "Get in touch →",
  },
  fr: {
    label: "À propos",
    headingPrefix: "À propos de",
    introFallback:
      "Burundi Today est une rédaction indépendante couvrant la région des Grands Lacs, avec des reportages en anglais, en français et en kirundi.",
    body1:
      "Nous couvrons la politique, l'économie, la culture et le sport en nous concentrant sur les sujets qui comptent pour les lecteurs de la région — pas seulement les titres qui voyagent le mieux à l'international. Notre rédaction est petite, volontairement : chaque article publié a été lu, vérifié et validé par un vrai rédacteur avant sa mise en ligne.",
    body2:
      "Nous sommes financés par la publicité et, le cas échéant, par le soutien des lecteurs — jamais par des partis politiques, des gouvernements ou des sponsors ayant un intérêt dans la manière dont une histoire est racontée.",
    ethicsLinkLabel: "Lire nos normes éditoriales →",
    body3:
      "Une information à nous transmettre, une erreur à signaler, ou un avis sur notre couverture ? Nous préférons l'entendre.",
    contactLinkLabel: "Nous contacter →",
  },
  rn: {
    label: "Ibitwerekeye",
    headingPrefix: "Ibijanye na",
    introFallback:
      "Burundi Today ni ikinyamakuru kidasanzwe gishinzwe kuronsa amakuru y'akarere k'ibiyaga bigari, mu ndimi Icongereza, Igifaransa, n'Ikirundi.",
    body1:
      "Turavuga ivyerekeye politike, ubukungu, umuco, n'imikino, dushira imbere inkuru zifise akamaro ku basomyi bo mu karere — atari gusa inkuru zizwi ku rwego mpuzamakungu. Ikinyamakuru cacu ni gito, ku bushake: buri nkuru isohorwa isanzwe yasomwe, igasuzumwa, kandi igashigikirwa n'umunyamakuru w'ukuri imbere yo gusohoka.",
    body2:
      "Dushigikirwa n'amatangazo n'ubufasha bw'abasomyi igihe bishoboka — sinyene dushigikirwa n'amashirahamwe ya politike, guverinoma, canke abashigikira bafise inyungu mu kuntu inkuru ivugwa.",
    ethicsLinkLabel: "Soma imyitwarire yacu y'ubunyamakuru →",
    body3:
      "Ufise inkuru wodutumako, ikosa wosanze, canke ivyiyumviro ku vyo twanditse? Turashaka kubyumva.",
    contactLinkLabel: "Twandikire →",
  },
};

export const ethicsContent: Record<SupportedLanguage, EthicsContent> = {
  en: {
    label: "Newsroom ethics",
    heading: "Editorial Standards",
    intro:
      "These are the standards our newsroom holds itself to. If you believe a story of ours falls short of them, we want to hear about it.",
    principles: [
      {
        title: "Accuracy first",
        body: "We verify facts with at least two independent sources before publishing wherever possible, and we correct errors quickly and visibly rather than quietly editing them away.",
      },
      {
        title: "Independence",
        body: "Our newsroom operates separately from advertisers, sponsors, and any political affiliation. No advertiser sees or approves a story before it runs.",
      },
      {
        title: "Sourcing",
        body: "We name sources whenever we can. Anonymous sources are used only when a story can't otherwise be told safely or truthfully, and editors always know who they are.",
      },
      {
        title: "Corrections",
        body: "When we get something wrong, we say so. Corrected articles carry a visible note explaining what changed and when.",
      },
      {
        title: "Advertising vs. editorial",
        body: "Sponsored or promotional content is always clearly labeled as such and never written or edited by the newsroom team.",
      },
    ],
    contactPrefix: "Questions about a specific story, or want to flag something for correction? Reach us at",
  },
  fr: {
    label: "Déontologie de la rédaction",
    heading: "Normes éditoriales",
    intro:
      "Voici les normes que notre rédaction s'impose. Si vous pensez qu'un de nos articles n'y est pas conforme, nous voulons le savoir.",
    principles: [
      {
        title: "Exactitude avant tout",
        body: "Nous vérifions les faits auprès d'au moins deux sources indépendantes avant publication dans la mesure du possible, et nous corrigeons rapidement et visiblement les erreurs plutôt que de les modifier discrètement.",
      },
      {
        title: "Indépendance",
        body: "Notre rédaction fonctionne séparément des annonceurs, des sponsors et de toute affiliation politique. Aucun annonceur ne voit ni n'approuve un article avant sa publication.",
      },
      {
        title: "Sourcing",
        body: "Nous citons nos sources chaque fois que possible. Les sources anonymes ne sont utilisées que lorsqu'une histoire ne peut être racontée en toute sécurité ou en toute vérité autrement, et les rédacteurs savent toujours qui elles sont.",
      },
      {
        title: "Corrections",
        body: "Quand nous nous trompons, nous le disons. Les articles corrigés portent une note visible expliquant ce qui a changé et quand.",
      },
      {
        title: "Publicité et rédaction",
        body: "Le contenu sponsorisé ou promotionnel est toujours clairement identifié comme tel et n'est jamais écrit ni édité par l'équipe de la rédaction.",
      },
    ],
    contactPrefix: "Des questions sur un article en particulier, ou vous souhaitez signaler une correction ? Contactez-nous à",
  },
  rn: {
    label: "Imyitwarire y'abanyamakuru",
    heading: "Imyitwarire y'Ubunyamakuru",
    intro:
      "Iyi ni imyitwarire ikinyamakuru cacu cishinga. Niwumva ko inkuru dusohoye itubahirije iyi myitwarire, turashaka kubimenya.",
    principles: [
      {
        title: "Ukuri imbere ya vyose",
        body: "Turaraba ukuri hifashishijwe nibura amasoko abiri atari umwe imbere yo gusohora igihe bishoboka, kandi dukosora amakosa vuba kandi mu buryo bugaragara aho kuyahindura mu bwihisi.",
      },
      {
        title: "Ubwigenge",
        body: "Ikinyamakuru cacu gikora ku bwigenge butavanze n'abashigikira, abatangaje amatangazo, canke ihuriro na politike iyo ariyo yose. Nta n'umwe mu bashigikira abona canke yemeza inkuru imbere yo gusohoka.",
      },
      {
        title: "Amasoko",
        body: "Turavuga amazina y'amasoko igihe cose bishoboka. Amasoko adasobanuwe akoreshwa gusa igihe inkuru itoshobora kuvugwa mu mutekano canke mu kuri ku bundi buryo, kandi abanyamakuru baca bamenya uwo ariwe.",
      },
      {
        title: "Ivyo dukosora",
        body: "Igihe dukoze ikosa, turabivuga. Inyandiko zikosowe zifise akamenyeshamakuru kagaragara gasobanura ico cahindutse n'igihe.",
      },
      {
        title: "Amatangazo n'inyandiko",
        body: "Ivyanditswe biterwa n'amatangazo canke ivyo gutera intabgo bimenyekana ata gukekwa, kandi ntibyandikwa canke bikosorwa n'abanyamakuru.",
      },
    ],
    contactPrefix: "Ufise ibibazo ku nkuru runaka, canke ushaka gutanga ikosa? Twandikire kuri",
  },
};

export const careersContent: Record<SupportedLanguage, CareersContent> = {
  en: {
    label: "Careers",
    heading: "Work with us",
    body1:
      "We're a small, independent newsroom, and we grow the team when a story or a season calls for it rather than on a fixed schedule. There are no open roles listed right now.",
    body2:
      "That said, we're always glad to hear from reporters, editors, and contributors who care about accurate, independent coverage of the Great Lakes region — especially if you write in Kirundi, French, or English and know a beat we don't currently cover well.",
    body3prefix:
      "Send a short note about yourself, links to a few pieces you're proud of, and what you'd want to cover for us to",
    body3suffix: ". We read everything, even when we can't reply right away.",
  },
  fr: {
    label: "Carrières",
    heading: "Travailler avec nous",
    body1:
      "Nous sommes une petite rédaction indépendante, et nous agrandissons l'équipe quand une histoire ou une saison l'exige plutôt que selon un calendrier fixe. Aucun poste n'est ouvert pour le moment.",
    body2:
      "Cela dit, nous sommes toujours heureux d'échanger avec des journalistes, rédacteurs et contributeurs qui tiennent à une couverture précise et indépendante de la région des Grands Lacs — surtout si vous écrivez en kirundi, en français ou en anglais et connaissez un sujet que nous ne couvrons pas encore bien.",
    body3prefix:
      "Envoyez-nous un mot sur vous, des liens vers quelques articles dont vous êtes fier, et ce que vous aimeriez couvrir pour nous à",
    body3suffix: ". Nous lisons tout, même si nous ne pouvons pas toujours répondre rapidement.",
  },
  rn: {
    label: "Akazi",
    heading: "Kora natwe",
    body1:
      "Turi ikinyamakuru gito, kidasanzwe, kandi dukura umurwi w'abakozi igihe inkuru canke igihe kibisaba, atari ku ngingo yagenwe. Nta kazi gafunguye ubu.",
    body2:
      "Yamara, turahimbarwa no kwumva ivyo abanyamakuru, abasuzumyi, n'abandi bafasha bafitiye akamaro amakuru y'ukuri kandi adasanzwe y'akarere k'ibiyaga bigari — cane cane niwandika mu Kirundi, Igifaransa, canke Icongereza kandi uzi ikintu tutaravuga neza.",
    body3prefix:
      "Tuma ubutumwa bugufi ku byerekeye wewe, imirongo y'ivyanditswe bike wishimira, n'ico wipfuza kuvuga kuri",
    body3suffix: ". Turasoma vyose, naho tutoshobora kwishura ako kanya.",
  },
};

export const contactContent: Record<SupportedLanguage, ContactContent> = {
  en: {
    label: "Contact",
    heading: "Get in touch",
    intro:
      "Story tips, corrections, feedback, or partnership questions — the newsroom reads everything that comes in.",
    followUs: "Follow us",
  },
  fr: {
    label: "Contact",
    heading: "Nous contacter",
    intro:
      "Informations, corrections, retours ou questions de partenariat — la rédaction lit tout ce qui nous parvient.",
    followUs: "Suivez-nous",
  },
  rn: {
    label: "Twandikire",
    heading: "Twandikire",
    intro:
      "Inkuru, amakosa, ivyiyumviro, canke ibibazo vy'ubufatanye — ikinyamakuru gisoma vyose bishika.",
    followUs: "Dukurikire",
  },
};
