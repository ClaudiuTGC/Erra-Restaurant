export type Lang = 'ro' | 'en';
export type Page = 'home' | 'menu' | 'about' | 'contact';
export const routes = {
  ro: { home: '/', menu: '/meniu/', about: '/despre/', contact: '/contact/' },
  en: { home: '/en/', menu: '/en/menu/', about: '/en/about/', contact: '/en/contact/' },
} as const;
export const address = 'Strada Constantin C. Nottara 13, București';
export const phone = '0734 983 984';
export const phoneHref = 'tel:+40734983984';
export const maps = 'https://www.google.com/maps/search/?api=1&query=Erra+Restaurant+Strada+Constantin+C.+Nottara+13+Bucuresti';
export const categories = [
  { id: 'pizza', ro: 'Pizza din cuptor pe lemne', en: 'Wood-fired pizza', short_ro: 'Pizza', short_en: 'Pizza', note_ro: 'Aluat, foc și ingrediente care se înțeleg.', note_en: 'Dough, fire, and ingredients that belong together.' },
  { id: 'pasta', ro: 'Paste', en: 'Pasta', short_ro: 'Paste', short_en: 'Pasta', note_ro: 'Un clasic bun are mereu loc la masă.', note_en: 'There is always room for a good classic.' },
  { id: 'main', ro: 'Fel principal', en: 'Main courses', short_ro: 'Fel principal', short_en: 'Mains', note_ro: 'Din bucătăria noastră, în ritmul tău.', note_en: 'From our kitchen, at your own pace.' },
  { id: 'focaccia', ro: 'Focaccia', en: 'Focaccia', short_ro: 'Focaccia', short_en: 'Focaccia', note_ro: 'Ceva bun de pus în mijlocul mesei.', note_en: 'Something good for the middle of the table.' },
  { id: 'dessert', ro: 'Desert', en: 'Dessert', short_ro: 'Desert', short_en: 'Dessert', note_ro: 'Mai stăm puțin?', note_en: 'Shall we stay a little longer?' },
] as const;
export const copy = {
  ro: {
    home: 'Acasă', menu: 'Meniu', about: 'Povestea noastră', contact: 'Contact', reserve: 'Rezervă o masă',
    skip: 'Sari la conținut', navigation: 'Navigație principală', close: 'Închide', open: 'Deschide meniul',
    titles: { home: 'Erra Restaurant · Un loc bun, o masă și mai bună', menu: 'Meniu · Erra Restaurant', about: 'Povestea noastră · Erra Restaurant', contact: 'Contact și rezervări · Erra Restaurant' },
    description: 'Erra Restaurant în București. Pizza din cuptor pe lemne, paste și gusturi de bistro. Descoperă meniul și solicită o rezervare.',
    footerLine: 'Mese tihnite. Povești de ținut minte.', visit: 'Ne găsești aici', explore: 'Descoperă', hours: 'Pentru programul actual, sună-ne.',
    menuCaveat: 'Meniu de arhivă · fotografie din februarie 2020. Preparatele, ingredientele și prețurile necesită confirmare telefonică.',
    dietary: 'Ai o alergie sau o cerință alimentară? Întreabă echipa înainte de comandă. Ingredientele listate nu constituie o declarație completă de alergeni.',
    ask: 'Întreabă-ne', fullMenu: 'Vezi tot meniul', phoneLabel: 'Sună-ne', directions: 'Cum ajungi',
  },
  en: {
    home: 'Home', menu: 'Menu', about: 'Our story', contact: 'Contact', reserve: 'Book a table',
    skip: 'Skip to content', navigation: 'Main navigation', close: 'Close', open: 'Open navigation',
    titles: { home: 'Erra Restaurant · Good food, good company', menu: 'Menu · Erra Restaurant', about: 'Our story · Erra Restaurant', contact: 'Contact & reservations · Erra Restaurant' },
    description: 'Erra Restaurant in Bucharest. Wood-fired pizza, pasta and bistro favourites. Explore the menu and request a table.',
    footerLine: 'Unhurried meals. Stories to remember.', visit: 'Find us here', explore: 'Explore', hours: 'Please call for current opening hours.',
    menuCaveat: 'Archive menu · February 2020 photograph. Dishes, ingredients and prices need confirmation by phone.',
    dietary: 'Have an allergy or a dietary requirement? Ask our team before ordering. Listed ingredients are not a complete allergen declaration.',
    ask: 'Ask us', fullMenu: 'Explore the menu', phoneLabel: 'Call us', directions: 'Get directions',
  },
};
