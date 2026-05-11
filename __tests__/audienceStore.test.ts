import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEMES } from '@/data/pages';
import { AUDIENCE_THEMES, useAudienceStore } from '@/state/audienceStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const asMock = (fn: unknown) => fn as jest.Mock;

const resetStore = () => {
  useAudienceStore.setState({ audience: null, hydrated: false });
};

describe('audienceStore', () => {
  beforeEach(() => {
    resetStore();
    asMock(AsyncStorage.getItem).mockReset();
    asMock(AsyncStorage.setItem).mockReset();
    asMock(AsyncStorage.removeItem).mockReset();
  });

  it('hydrates audience=null when no value is persisted', async () => {
    asMock(AsyncStorage.getItem).mockResolvedValue(null);
    await useAudienceStore.getState().hydrate();
    expect(useAudienceStore.getState().audience).toBeNull();
    expect(useAudienceStore.getState().hydrated).toBe(true);
  });

  it('hydrates audience="kids" when "kids" is persisted', async () => {
    asMock(AsyncStorage.getItem).mockResolvedValue('kids');
    await useAudienceStore.getState().hydrate();
    expect(useAudienceStore.getState().audience).toBe('kids');
    expect(useAudienceStore.getState().hydrated).toBe(true);
  });

  it('hydrates audience="adults" when "adults" is persisted', async () => {
    asMock(AsyncStorage.getItem).mockResolvedValue('adults');
    await useAudienceStore.getState().hydrate();
    expect(useAudienceStore.getState().audience).toBe('adults');
  });

  it('ignores unknown persisted values and stays null', async () => {
    asMock(AsyncStorage.getItem).mockResolvedValue('robots');
    await useAudienceStore.getState().hydrate();
    expect(useAudienceStore.getState().audience).toBeNull();
    expect(useAudienceStore.getState().hydrated).toBe(true);
  });

  it('skips hydration once already hydrated', async () => {
    useAudienceStore.setState({ audience: 'kids', hydrated: true });
    asMock(AsyncStorage.getItem).mockResolvedValue('adults');
    await useAudienceStore.getState().hydrate();
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    expect(useAudienceStore.getState().audience).toBe('kids');
  });

  it('persists the new audience when setAudience is called', () => {
    useAudienceStore.getState().setAudience('adults');
    expect(useAudienceStore.getState().audience).toBe('adults');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@pop-color/audience/v1',
      'adults',
    );
  });

  it('removes the persisted value when clearAudience is called', () => {
    useAudienceStore.setState({ audience: 'kids', hydrated: true });
    useAudienceStore.getState().clearAudience();
    expect(useAudienceStore.getState().audience).toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      '@pop-color/audience/v1',
    );
  });

  it('survives a failed AsyncStorage read by still marking hydrated', async () => {
    asMock(AsyncStorage.getItem).mockRejectedValue(new Error('boom'));
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await useAudienceStore.getState().hydrate();
    expect(useAudienceStore.getState().hydrated).toBe(true);
    expect(useAudienceStore.getState().audience).toBeNull();
    warn.mockRestore();
  });
});

describe('AUDIENCE_THEMES', () => {
  it('every theme is reachable from exactly one audience', () => {
    const allThemeIds = THEMES.map((t) => t.id);
    const kidsSet = new Set(AUDIENCE_THEMES.kids);
    const adultsSet = new Set(AUDIENCE_THEMES.adults);

    for (const id of allThemeIds) {
      const inKids = kidsSet.has(id);
      const inAdults = adultsSet.has(id);
      expect(inKids || inAdults).toBe(true);
      expect(inKids && inAdults).toBe(false);
    }
  });

  it('kids = animals + fruits + vehicles + shapes', () => {
    expect(AUDIENCE_THEMES.kids.sort()).toEqual(
      ['animals', 'fruits', 'shapes', 'vehicles'].sort(),
    );
  });

  it('adults = women-flowers only', () => {
    expect(AUDIENCE_THEMES.adults).toEqual(['women-flowers']);
  });
});
