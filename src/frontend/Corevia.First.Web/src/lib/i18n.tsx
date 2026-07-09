import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

type Dict = typeof translations.fr;

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      how: "Comment ça marche",
      visas: "Visas",
      services: "Services",
      destinations: "Destinations",
      gallery: "Galerie",
      testimonials: "Témoignages",
      faq: "FAQ",
      contact: "Contact",
      login: "Connexion",
      signup: "Inscription",
      account: "Mon compte",
      admin: "Tableau de bord",
      logout: "Déconnexion",
      quote: "Devis gratuit",
      settings: "Paramètres",
      language: "Langue",
      theme: "Thème",
      lightTheme: "Clair",
      darkTheme: "Sombre",
    },
    common: {
      send: "Envoyer",
      sending: "Envoi...",
      save: "Enregistrer",
      saving: "Enregistrement...",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      search: "Rechercher",
      loading: "Chargement...",
      backHome: "Retour à l'accueil",
      required: "Ce champ est requis",
      fullName: "Nom complet",
      email: "Adresse e-mail",
      phone: "Téléphone",
      country: "Pays",
      password: "Mot de passe",
      message: "Message",
      readMore: "En savoir plus",
    },
    hero: {
      tagline: "La base qui guide",
      title: "Votre avenir académique commence à l'international",
      subtitle:
        "COREVIA FIRST, experts en visas d'étude et orientation universitaire.",
      ctaPrimary: "Demander un devis gratuit",
      ctaSecondary: "Découvrir nos services",
      scroll: "Découvrir",
      stages: ["Aéroport", "Étudiants", "Embarquement", "Envol", "Réussite"],
    },
    about: {
      eyebrow: "Qui sommes-nous",
      title: "Une agence d'excellence pour vos études à l'étranger",
      subtitle:
        "Nous accompagnons chaque étudiant avec rigueur, discrétion et un réseau international de premier plan.",
      cards: [
        {
          title: "Expertise reconnue",
          desc: "Plus de 10 ans d'expérience dans l'orientation universitaire internationale.",
        },
        {
          title: "Réseau international",
          desc: "Plus de 30 pays partenaires et des universités sélectionnées avec soin.",
        },
        {
          title: "Accompagnement personnalisé",
          desc: "Un conseiller dédié, présent à chaque étape de votre projet.",
        },
        {
          title: "Taux de réussite élevé",
          desc: "98 % de réussite sur les dossiers de visa et d'admission.",
        },
      ],
      stats: [
        { value: "500+", label: "Étudiants accompagnés" },
        { value: "30+", label: "Pays partenaires" },
        { value: "98%", label: "Taux de réussite" },
        { value: "10+", label: "Années d'expérience" },
      ],
    },
    how: {
      eyebrow: "Comment ça marche",
      title: "Votre parcours vers l'international en 4 étapes",
      steps: [
        {
          n: "01",
          title: "On vous écoute",
          desc: "Nous analysons votre projet d'études à l'étranger en tenant compte de votre profil, de votre budget, du pays souhaité et du type de formation désirée.",
        },
        {
          n: "02",
          title: "On vous oriente",
          desc: "COREVIA FIRST vous guide vers les universités et destinations les plus adaptées à votre profil, avec des conseils personnalisés et fiables.",
        },
        {
          n: "03",
          title: "Organisation & préparation",
          desc: "Nous constituons votre dossier et vous accompagnons pour le visa, le logement, l'assurance et toutes les démarches avant le départ.",
        },
        {
          n: "04",
          title: "Le départ !",
          desc: "Votre projet devient réalité. Nous restons à vos côtés jusqu'à votre arrivée et durant votre installation.",
        },
      ],
    },
    destinations: {
      eyebrow: "Destinations",
      title: "Nos destinations populaires",
      subtitle:
        "Des universités d'exception à travers le monde, sélectionnées pour leur excellence.",
      featured: "Destination phare",
      items: [
        "Biélorussie",
        "Russie",
        "Turquie",
        "Pologne",
        "Allemagne",
        "Canada",
      ],
    },
    testimonials: {
      eyebrow: "Témoignages",
      title: "Ils nous ont fait confiance",
      items: [
        {
          quote:
            "Un accompagnement professionnel du début à la fin. J'ai obtenu mon visa et ma place dans l'université de mes rêves.",
          name: "Yasmine B.",
          role: "Étudiante en médecine",
        },
        {
          quote:
            "Service impeccable et conseiller toujours disponible. COREVIA FIRST a rendu mon départ serein et organisé.",
          name: "Mehdi A.",
          role: "Étudiant en ingénierie",
        },
        {
          quote:
            "Sérieux, rapides et réellement à l'écoute. Je recommande les yeux fermés pour partir étudier à l'étranger.",
          name: "Sara K.",
          role: "Étudiante en commerce",
        },
      ],
    },
    cta: {
      eyebrow: "Prêt à commencer",
      title: "Votre avenir n'attend que vous",
      subtitle:
        "Contactez-nous pour une consultation gratuite et personnalisée.",
      button: "Demander un devis gratuit",
      whatsapp: "Discuter sur WhatsApp",
    },
    footer: {
      tagline: "La base qui guide vos études à l'international.",
      explore: "Explorer",
      contact: "Contact",
      rights: "Tous droits réservés.",
    },
    whatsapp: "Contacter COREVIA FIRST sur WhatsApp",
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      how: "How it works",
      visas: "Visas",
      services: "Services",
      destinations: "Destinations",
      gallery: "Gallery",
      testimonials: "Testimonials",
      faq: "FAQ",
      contact: "Contact",
      login: "Sign in",
      signup: "Sign up",
      account: "My account",
      admin: "Dashboard",
      logout: "Sign out",
      quote: "Free quote",
      settings: "Settings",
      language: "Language",
      theme: "Theme",
      lightTheme: "Light",
      darkTheme: "Dark",
    },
    common: {
      send: "Send",
      sending: "Sending...",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      loading: "Loading...",
      backHome: "Back to home",
      required: "This field is required",
      fullName: "Full name",
      email: "Email address",
      phone: "Phone",
      country: "Country",
      password: "Password",
      message: "Message",
      readMore: "Learn more",
    },
    hero: {
      tagline: "The base that guides",
      title: "Your academic future starts internationally",
      subtitle:
        "COREVIA FIRST, experts in study visas and university guidance.",
      ctaPrimary: "Request a free quote",
      ctaSecondary: "Discover our services",
      scroll: "Discover",
      stages: ["Airport", "Students", "Boarding", "Takeoff", "Success"],
    },
    about: {
      eyebrow: "Who we are",
      title: "An agency of excellence for your studies abroad",
      subtitle:
        "We support every student with rigour, discretion and a world-class international network.",
      cards: [
        {
          title: "Recognised expertise",
          desc: "Over 10 years of experience in international university guidance.",
        },
        {
          title: "International network",
          desc: "More than 30 partner countries and carefully selected universities.",
        },
        {
          title: "Personalised support",
          desc: "A dedicated advisor by your side at every step of your project.",
        },
        {
          title: "High success rate",
          desc: "98% success rate on visa and admission applications.",
        },
      ],
      stats: [
        { value: "500+", label: "Students assisted" },
        { value: "30+", label: "Partner countries" },
        { value: "98%", label: "Success rate" },
        { value: "10+", label: "Years of experience" },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "Your journey abroad in 4 steps",
      steps: [
        {
          n: "01",
          title: "We listen to you",
          desc: "We analyse your study-abroad project, taking into account your profile, budget, desired country and the type of programme you want.",
        },
        {
          n: "02",
          title: "We guide you",
          desc: "COREVIA FIRST guides you to the universities and destinations best suited to your profile, with personalised and reliable advice.",
        },
        {
          n: "03",
          title: "Organisation & preparation",
          desc: "We prepare your application and assist you with the visa, accommodation, insurance and every step before departure.",
        },
        {
          n: "04",
          title: "Departure!",
          desc: "Your project becomes reality. We stay by your side until your arrival and throughout your settling in.",
        },
      ],
    },
    destinations: {
      eyebrow: "Destinations",
      title: "Our popular destinations",
      subtitle:
        "Exceptional universities around the world, selected for their excellence.",
      featured: "Featured destination",
      items: ["Belarus", "Russia", "Turkey", "Poland", "Germany", "Canada"],
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "They trusted us",
      items: [
        {
          quote:
            "Professional support from start to finish. I got my visa and a place at my dream university.",
          name: "Yasmine B.",
          role: "Medical student",
        },
        {
          quote:
            "Flawless service and an always-available advisor. COREVIA FIRST made my departure calm and organised.",
          name: "Mehdi A.",
          role: "Engineering student",
        },
        {
          quote:
            "Serious, fast and truly attentive. I recommend them wholeheartedly for studying abroad.",
          name: "Sara K.",
          role: "Business student",
        },
      ],
    },
    cta: {
      eyebrow: "Ready to start",
      title: "Your future is waiting for you",
      subtitle: "Contact us for a free, personalised consultation.",
      button: "Request a free quote",
      whatsapp: "Chat on WhatsApp",
    },
    footer: {
      tagline: "The base that guides your international studies.",
      explore: "Explore",
      contact: "Contact",
      rights: "All rights reserved.",
    },
    whatsapp: "Contact COREVIA FIRST on WhatsApp",
  },
};

type I18nContext = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const Ctx = createContext<I18nContext | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = localStorage.getItem("corevia-lang") as Lang | null;
    if (stored === "fr" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("corevia-lang", l);
    document.documentElement.lang = l;
  };

  return (
    <Ctx.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

export const WHATSAPP_NUMBER = "375256335217";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Bonjour COREVIA FIRST, je souhaite des informations sur les visas d'\u00e9tude.",
)}`;

/** Official social / communication channels. */
export const SOCIAL_LINKS = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  youtube: "https://www.youtube.com/@Sujetalacarte",
  tiktok: "https://www.tiktok.com/@joembomba",
  instagram: "https://www.instagram.com/first_class_agency/",
  facebook: "https://www.facebook.com/Firstclassagency243?locale=fr_FR",
} as const;

/** Legal company information (Corevia First SARL, Gomel). */
export const COMPANY = {
  legalName: "Société à responsabilité limitée « Corevia First »",
  address: "35-1, rue Ilitcha, 246021, ville de Gomel",
  phone: "+375256335217",
  hours: "Du lundi au vendredi : 9h00 - 17h30",
  hoursEn: "Monday to Friday: 9:00 - 17:30",
  email: "coreviafirst@gmail.com",
  unp: "491398153",
  registration:
    "Certificat d'enregistrement d'État n° 0247934, délivré par le Comité exécutif de la ville de Gomel le 4 juin 2026.",
  registrationEn:
    "State registration certificate No. 0247934, issued by the Gomel City Executive Committee on June 4, 2026.",
} as const;