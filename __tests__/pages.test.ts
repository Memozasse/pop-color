import { PAGES, THEMES, getPage, getPagesForTheme, getTheme } from '@/data/pages';

describe('pages manifest', () => {
  it('has at least 20 pages', () => {
    expect(PAGES.length).toBeGreaterThanOrEqual(20);
  });

  it('has 4 themes', () => {
    expect(THEMES).toHaveLength(4);
  });

  it('every page has unique id', () => {
    const ids = PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every page has at least 3 regions', () => {
    PAGES.forEach((page) => {
      expect(page.regions.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('every page references a theme that exists', () => {
    const themeIds = new Set(THEMES.map((t) => t.id));
    PAGES.forEach((page) => {
      expect(themeIds.has(page.themeId)).toBe(true);
    });
  });

  it('every theme references only existing pages', () => {
    const pageIds = new Set(PAGES.map((p) => p.id));
    THEMES.forEach((theme) => {
      theme.pageIds.forEach((id) => {
        expect(pageIds.has(id)).toBe(true);
      });
    });
  });

  it('getPage returns a page by id', () => {
    expect(getPage('cat')?.title).toBe('Cat');
    expect(getPage('does-not-exist')).toBeUndefined();
  });

  it('getTheme returns a theme by id', () => {
    expect(getTheme('animals')?.title).toBe('Animals');
    expect(getTheme('does-not-exist')).toBeUndefined();
  });

  it('getPagesForTheme returns the matching pages', () => {
    const pages = getPagesForTheme('animals');
    expect(pages.length).toBeGreaterThanOrEqual(5);
    pages.forEach((p) => expect(p.themeId).toBe('animals'));
  });

  it('getPagesForTheme returns empty for unknown theme', () => {
    expect(getPagesForTheme('does-not-exist')).toEqual([]);
  });
});
