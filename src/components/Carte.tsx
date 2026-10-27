import { useDeferredValue, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { menu, type MenuGroup } from '../data/menu';
import { getLenis } from '../hooks/useSmoothScroll';
import { MenuSectionBlock } from './MenuSectionBlock';
import { Picture } from './Picture';
import { SectionHeading } from './SectionHeading';
import styles from './Carte.module.css';

type GroupId = MenuGroup['id'];

const families: { id: GroupId; image: string; alt: string }[] = [
  { id: 'brunch', image: 'brunch-table', alt: 'Table de brunch chez Helena' },
  { id: 'cuisine', image: 'brunch-crepes', alt: 'Crêpe salée gratinée et crudités servies chez Helena' },
  { id: 'boissons', image: 'jus-pomme', alt: 'Jus de fruits frais garni de fraise et de pomme chez Helena' },
  { id: 'douceurs', image: 'pancakes-banane', alt: 'Pancakes à la banane caramélisée chez Helena' },
];

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const countItems = (group: MenuGroup) => group.sections.reduce((total, section) => total + section.items.length, 0);

/** Fait défiler jusqu'à un élément en tenant compte de la navigation fixe. */
const scrollToElement = (element: HTMLElement | null, offset = -150) => {
  if (!element) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(element, { offset });
  else window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY + offset });
};

export function Carte() {
  const [activeId, setActiveId] = useState<GroupId>('brunch');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<GroupId, HTMLButtonElement | null>>({ brunch: null, cuisine: null, boissons: null, douceurs: null });
  const baseId = useId();

  const activeGroup = menu.find((group) => group.id === activeId) ?? menu[0];
  const searching = normalize(deferredQuery).length >= 2;

  const results = useMemo(() => {
    if (!searching) return [];
    const needle = normalize(deferredQuery);
    return menu.flatMap((group) =>
      group.sections
        .map((section) => ({
          group,
          section,
          items: section.items.filter((item) =>
            normalize([item.name, item.description, ...(item.includes ?? [])].join(' ')).includes(needle),
          ),
        }))
        .filter((match) => match.items.length > 0),
    );
  }, [deferredQuery, searching]);

  const resultCount = results.reduce((total, match) => total + match.items.length, 0);

  const selectGroup = (id: GroupId, { scroll = false, focus = false } = {}) => {
    setActiveId(id);
    setQuery('');
    if (focus) tabRefs.current[id]?.focus();
    if (scroll) scrollToElement(panelRef.current, -170);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (event.key in keys) {
      event.preventDefault();
      const next = menu[(index + keys[event.key] + menu.length) % menu.length];
      selectGroup(next.id, { focus: true });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      selectGroup(menu[event.key === 'Home' ? 0 : menu.length - 1].id, { focus: true });
    }
  };

  return (
    <section id="carte" className={`section paper ${styles.carte}`} aria-labelledby="carte-title">
      <div className="container">
        <SectionHeading
          id="carte-title"
          eyebrow="La carte"
          script="Menu"
          title={
            <>
              Toute la carte <em>Helena</em>
            </>
          }
        />

        {/* Découverte : les grandes familles */}
        <ul className={styles.families}>
          {families.map((family) => {
            const group = menu.find((g) => g.id === family.id)!;
            return (
              <li key={family.id} data-animate="fade-up">
                <button
                  type="button"
                  className={styles.family}
                  onClick={() => selectGroup(family.id, { scroll: true })}
                >
                  <span className={styles.familyImage}>
                    <Picture name={family.image} alt="" sizes="(min-width: 64rem) 22vw, 45vw" />
                  </span>
                  <span className={styles.familyBody}>
                    <span className={`script ${styles.familyScript}`}>{group.script}</span>
                    <span className={styles.familyMeta}>
                      {group.sections.length > 1 ? `${group.sections.length} rubriques · ` : ''}
                      {countItems(group)} {group.id === 'brunch' ? 'formules' : 'références'}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Barre d'outils collante : familles + recherche */}
        <div className={styles.toolbar}>
          <div role="tablist" aria-label="Familles de la carte" className={styles.tabs}>
            {menu.map((group, index) => {
              const selected = !searching && group.id === activeId;
              return (
                <button
                  key={group.id}
                  ref={(el) => {
                    tabRefs.current[group.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${group.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={group.id === activeId ? 0 : -1}
                  className={styles.tab}
                  onClick={() => selectGroup(group.id, { scroll: true })}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  {group.label}
                </button>
              );
            })}
          </div>

          <label className={styles.search}>
            <span className="sr-only">Rechercher dans la carte</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              type="search"
              value={query}
              placeholder="Rechercher un plat, une boisson…"
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
        </div>

        {!searching && activeGroup.sections.length > 1 && (
          <nav className={styles.chips} aria-label={`Rubriques : ${activeGroup.label}`}>
            {activeGroup.sections.map((section) => (
              <a
                key={section.id}
                href={`#carte-${section.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToElement(document.getElementById(`carte-${section.id}`), -190);
                }}
              >
                {section.title}
              </a>
            ))}
          </nav>
        )}

        <p className="sr-only" aria-live="polite">
          {searching ? `${resultCount} résultat${resultCount > 1 ? 's' : ''} pour « ${deferredQuery} »` : ''}
        </p>

        <div
          ref={panelRef}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={searching ? undefined : `${baseId}-tab-${activeId}`}
          aria-label={searching ? 'Résultats de recherche' : undefined}
          className={styles.panel}
          key={searching ? 'recherche' : activeId}
        >
          {searching ? (
            resultCount > 0 ? (
              <>
                <p className={styles.resultsInfo}>
                  {resultCount} résultat{resultCount > 1 ? 's' : ''} pour « {deferredQuery} »
                </p>
                <div className={styles.columns}>
                  {results.map(({ group, section, items }) => (
                    <div key={section.id}>
                      <p className={styles.resultGroup}>{group.label}</p>
                      <MenuSectionBlock section={section} items={items} showExtras={false} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Aucun résultat pour « {deferredQuery} »</p>
                <p>Essayez par exemple « latte », « burger », « crêpe » ou « saumon ».</p>
              </div>
            )
          ) : (
            <>
              <p className={styles.intro}>{activeGroup.intro}</p>
              <div className={activeGroup.sections.length > 1 ? styles.columns : styles.single}>
                {activeGroup.sections.map((section) => (
                  <MenuSectionBlock key={section.id} section={section} />
                ))}
              </div>
            </>
          )}
        </div>

        <p className={styles.legal}>
          Prix en dinars algériens (DA). Carte susceptible d’évoluer selon les saisons et les arrivages.
        </p>
      </div>
    </section>
  );
}
