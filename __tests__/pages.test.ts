import { PAGES, THEMES, getPage, getPagesForTheme, getTheme } from '@/data/pages';

describe('pages manifest', () => {
  it('has at least 40 pages (20 vector + 23 raster)', () => {
    expect(PAGES.length).toBeGreaterThanOrEqual(40);
  });

  it('has 5 themes', () => {
    expect(THEMES).toHaveLength(5);
  });

  it('every page has a kind discriminator', () => {
    PAGES.forEach((page) => {
      expect(['vector', 'raster']).toContain(page.kind);
    });
  });

  it('every page has unique id', () => {
    const ids = PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every vector page has at least 3 regions', () => {
    PAGES.filter((p) => p.kind === 'vector').forEach((page) => {
      if (page.kind === 'vector') {
        expect(page.regions.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  it('every raster page has a source and no regions', () => {
    const rasters = PAGES.filter((p) => p.kind === 'raster');
    expect(rasters.length).toBeGreaterThanOrEqual(23);
    rasters.forEach((page) => {
      if (page.kind === 'raster') {
        expect(page.source).toBeDefined();
      }
      // @ts-expect-error -- raster pages should not carry regions
      expect(page.regions).toBeUndefined();
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

  it('Women & Flowers theme has 20 raster pages', () => {
    const pages = getPagesForTheme('women-flowers');
    expect(pages).toHaveLength(20);
    pages.forEach((p) => expect(p.kind).toBe('raster'));
  });

  it('Animals theme includes vector + raster pages', () => {
    const pages = getPagesForTheme('animals');
    expect(pages.some((p) => p.kind === 'vector')).toBe(true);
    expect(pages.some((p) => p.kind === 'raster')).toBe(true);
  });

  it('getPagesForTheme returns empty for unknown theme', () => {
    expect(getPagesForTheme('does-not-exist')).toEqual([]);
  });
});
