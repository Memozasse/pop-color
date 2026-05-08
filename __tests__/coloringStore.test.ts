import { useColoringStore } from '@/state/coloringStore';
import { DEFAULT_COLOR } from '@/data/palettes';

const RED = '#FF0000';
const BLUE = '#0000FF';
const GREEN = '#00FF00';

describe('coloringStore', () => {
  beforeEach(() => {
    useColoringStore.getState().clearPage();
    useColoringStore.setState({ activeColor: DEFAULT_COLOR });
  });

  it('starts a page with empty regionColors when no initial provided', () => {
    useColoringStore.getState().startPage('cat');
    const { pageId, regionColors, history, future } = useColoringStore.getState();
    expect(pageId).toBe('cat');
    expect(regionColors).toEqual({});
    expect(history).toEqual([]);
    expect(future).toEqual([]);
  });

  it('starts a page with initial colors', () => {
    useColoringStore.getState().startPage('cat', { face: RED });
    const { regionColors } = useColoringStore.getState();
    expect(regionColors).toEqual({ face: RED });
  });

  it('paints a region with the active color', () => {
    useColoringStore.getState().startPage('cat');
    useColoringStore.getState().setActiveColor(RED);
    useColoringStore.getState().paintRegion('face');
    const { regionColors, history } = useColoringStore.getState();
    expect(regionColors).toEqual({ face: RED });
    expect(history.length).toBe(1);
    expect(history[0]).toEqual({});
  });

  it('does nothing when painting a region with the same active color', () => {
    useColoringStore.getState().startPage('cat');
    useColoringStore.getState().setActiveColor(RED);
    useColoringStore.getState().paintRegion('face');
    const beforeHistoryLength = useColoringStore.getState().history.length;
    useColoringStore.getState().paintRegion('face');
    const afterHistoryLength = useColoringStore.getState().history.length;
    expect(afterHistoryLength).toBe(beforeHistoryLength);
  });

  it('repaints a region with a new active color', () => {
    useColoringStore.getState().startPage('cat');
    useColoringStore.getState().setActiveColor(RED);
    useColoringStore.getState().paintRegion('face');
    useColoringStore.getState().setActiveColor(BLUE);
    useColoringStore.getState().paintRegion('face');
    const { regionColors, history } = useColoringStore.getState();
    expect(regionColors).toEqual({ face: BLUE });
    expect(history.length).toBe(2);
  });

  it('undo restores the previous state', () => {
    const { startPage, setActiveColor, paintRegion, undo } = useColoringStore.getState();
    startPage('cat');
    setActiveColor(RED);
    paintRegion('face');
    paintRegion('leftEar');
    undo();
    const { regionColors, history, future } = useColoringStore.getState();
    expect(regionColors).toEqual({ face: RED });
    expect(history.length).toBe(1);
    expect(future.length).toBe(1);
  });

  it('redo replays an undone action', () => {
    const { startPage, setActiveColor, paintRegion, undo, redo } = useColoringStore.getState();
    startPage('cat');
    setActiveColor(RED);
    paintRegion('face');
    paintRegion('leftEar');
    undo();
    redo();
    const { regionColors, future } = useColoringStore.getState();
    expect(regionColors).toEqual({ face: RED, leftEar: RED });
    expect(future.length).toBe(0);
  });

  it('paint after undo discards future stack', () => {
    const { startPage, setActiveColor, paintRegion, undo } = useColoringStore.getState();
    startPage('cat');
    setActiveColor(RED);
    paintRegion('face');
    paintRegion('leftEar');
    undo();
    setActiveColor(GREEN);
    paintRegion('rightEar');
    const { regionColors, future } = useColoringStore.getState();
    expect(regionColors).toEqual({ face: RED, rightEar: GREEN });
    expect(future).toEqual([]);
  });

  it('reset clears all colors and pushes history', () => {
    const { startPage, setActiveColor, paintRegion, reset, undo } = useColoringStore.getState();
    startPage('cat');
    setActiveColor(RED);
    paintRegion('face');
    paintRegion('leftEar');
    reset();
    expect(useColoringStore.getState().regionColors).toEqual({});
    undo();
    expect(useColoringStore.getState().regionColors).toEqual({ face: RED, leftEar: RED });
  });

  it('reset on an empty page is a no-op', () => {
    useColoringStore.getState().startPage('cat');
    const before = useColoringStore.getState();
    useColoringStore.getState().reset();
    const after = useColoringStore.getState();
    expect(after.history).toBe(before.history);
    expect(after.regionColors).toEqual({});
  });

  it('undo on empty history is a no-op', () => {
    useColoringStore.getState().startPage('cat');
    useColoringStore.getState().undo();
    expect(useColoringStore.getState().regionColors).toEqual({});
  });

  it('redo on empty future is a no-op', () => {
    useColoringStore.getState().startPage('cat');
    useColoringStore.getState().redo();
    expect(useColoringStore.getState().regionColors).toEqual({});
  });

  it('history is capped at 50 entries', () => {
    const { startPage, setActiveColor, paintRegion } = useColoringStore.getState();
    startPage('cat');
    setActiveColor(RED);
    for (let i = 0; i < 60; i += 1) {
      setActiveColor(i % 2 === 0 ? RED : BLUE);
      paintRegion(`region-${i}`);
    }
    expect(useColoringStore.getState().history.length).toBeLessThanOrEqual(50);
  });

  it('clearPage resets pageId and history', () => {
    const { startPage, setActiveColor, paintRegion, clearPage } = useColoringStore.getState();
    startPage('cat');
    setActiveColor(RED);
    paintRegion('face');
    clearPage();
    const state = useColoringStore.getState();
    expect(state.pageId).toBeNull();
    expect(state.regionColors).toEqual({});
    expect(state.history).toEqual([]);
    expect(state.future).toEqual([]);
  });
});
