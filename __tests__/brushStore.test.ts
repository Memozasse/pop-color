import { DEFAULT_BRUSH_ID } from '@/data/brushes';
import { DEFAULT_COLOR, DEFAULT_PALETTE_ID } from '@/data/palettes';
import type { Stroke } from '@/data/types';
import {
  BRUSH_SIZES,
  applyTint,
  createStroke,
  useBrushStore,
} from '@/state/brushStore';

const RED = '#FF0000';
const BLUE = '#0000FF';

const stroke = (overrides: Partial<Stroke> = {}): Stroke =>
  createStroke({
    color: RED,
    size: BRUSH_SIZES.medium,
    mode: 'draw',
    regionId: null,
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
    ],
    ...overrides,
  });

describe('brushStore', () => {
  beforeEach(() => {
    useBrushStore.getState().clearPage();
    useBrushStore.setState({
      activeColor: DEFAULT_COLOR,
      brushSize: BRUSH_SIZES.medium,
      isErasing: false,
      stayInside: true,
      activeBrushId: DEFAULT_BRUSH_ID,
      paletteId: DEFAULT_PALETTE_ID,
      tint: 0.5,
      sizeMultiplier: 1,
      eyedropperActive: false,
      recentColors: [DEFAULT_COLOR],
    });
  });

  it('starts a page with empty strokes by default', () => {
    useBrushStore.getState().startPage('cat');
    const { pageId, strokes, redoStack } = useBrushStore.getState();
    expect(pageId).toBe('cat');
    expect(strokes).toEqual([]);
    expect(redoStack).toEqual([]);
  });

  it('starts a page with initial strokes (resume saved artwork)', () => {
    const seed = [stroke()];
    useBrushStore.getState().startPage('cat', seed);
    const { strokes } = useBrushStore.getState();
    expect(strokes).toHaveLength(1);
    expect(strokes[0].id).toBe(seed[0].id);
  });

  it('pushStroke appends to history and clears redo', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().pushStroke(stroke());
    useBrushStore.getState().pushStroke(stroke({ color: BLUE }));
    expect(useBrushStore.getState().strokes).toHaveLength(2);
    expect(useBrushStore.getState().redoStack).toEqual([]);
  });

  it('undo moves the last stroke onto the redo stack', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().pushStroke(stroke());
    useBrushStore.getState().pushStroke(stroke({ color: BLUE }));
    useBrushStore.getState().undo();
    expect(useBrushStore.getState().strokes).toHaveLength(1);
    expect(useBrushStore.getState().redoStack).toHaveLength(1);
    expect(useBrushStore.getState().redoStack[0].color).toBe(BLUE);
  });

  it('redo replays the last undone stroke', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().pushStroke(stroke());
    useBrushStore.getState().pushStroke(stroke({ color: BLUE }));
    useBrushStore.getState().undo();
    useBrushStore.getState().redo();
    expect(useBrushStore.getState().strokes).toHaveLength(2);
    expect(useBrushStore.getState().redoStack).toEqual([]);
    expect(useBrushStore.getState().strokes[1].color).toBe(BLUE);
  });

  it('a new stroke after undo discards the redo stack', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().pushStroke(stroke());
    useBrushStore.getState().undo();
    expect(useBrushStore.getState().redoStack).toHaveLength(1);
    useBrushStore.getState().pushStroke(stroke({ color: BLUE }));
    expect(useBrushStore.getState().redoStack).toEqual([]);
  });

  it('reset clears strokes and pushes them onto redo (so reset is undoable)', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().pushStroke(stroke());
    useBrushStore.getState().pushStroke(stroke({ color: BLUE }));
    useBrushStore.getState().reset();
    expect(useBrushStore.getState().strokes).toEqual([]);
    expect(useBrushStore.getState().redoStack).toHaveLength(2);
  });

  it('reset on an empty page is a no-op', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().reset();
    expect(useBrushStore.getState().strokes).toEqual([]);
    expect(useBrushStore.getState().redoStack).toEqual([]);
  });

  it('undo on empty history is a no-op', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().undo();
    expect(useBrushStore.getState().strokes).toEqual([]);
    expect(useBrushStore.getState().redoStack).toEqual([]);
  });

  it('redo on empty future is a no-op', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().redo();
    expect(useBrushStore.getState().strokes).toEqual([]);
  });

  it('canUndo / canRedo report current state', () => {
    useBrushStore.getState().startPage('cat');
    expect(useBrushStore.getState().canUndo()).toBe(false);
    expect(useBrushStore.getState().canRedo()).toBe(false);
    useBrushStore.getState().pushStroke(stroke());
    expect(useBrushStore.getState().canUndo()).toBe(true);
    useBrushStore.getState().undo();
    expect(useBrushStore.getState().canUndo()).toBe(false);
    expect(useBrushStore.getState().canRedo()).toBe(true);
  });

  it('setActiveColor disables eraser mode', () => {
    useBrushStore.getState().setIsErasing(true);
    useBrushStore.getState().setActiveColor(BLUE);
    expect(useBrushStore.getState().activeColor).toBe(BLUE);
    expect(useBrushStore.getState().isErasing).toBe(false);
  });

  it('toggleEraser flips erasing flag', () => {
    expect(useBrushStore.getState().isErasing).toBe(false);
    useBrushStore.getState().toggleEraser();
    expect(useBrushStore.getState().isErasing).toBe(true);
    useBrushStore.getState().toggleEraser();
    expect(useBrushStore.getState().isErasing).toBe(false);
  });

  it('setBrushSize updates the active brush diameter', () => {
    useBrushStore.getState().setBrushSize(BRUSH_SIZES.large);
    expect(useBrushStore.getState().brushSize).toBe(BRUSH_SIZES.large);
    useBrushStore.getState().setBrushSize(BRUSH_SIZES.small);
    expect(useBrushStore.getState().brushSize).toBe(BRUSH_SIZES.small);
  });

  it('toggleStayInside flips the stay-inside-lines flag', () => {
    const before = useBrushStore.getState().stayInside;
    useBrushStore.getState().toggleStayInside();
    expect(useBrushStore.getState().stayInside).toBe(!before);
  });

  it('history is capped (push 100 strokes; only the tail is retained)', () => {
    useBrushStore.getState().startPage('cat');
    for (let i = 0; i < 100; i += 1) {
      useBrushStore.getState().pushStroke(stroke());
    }
    expect(useBrushStore.getState().strokes.length).toBeLessThanOrEqual(80);
  });

  it('clearPage resets pageId and history', () => {
    useBrushStore.getState().startPage('cat');
    useBrushStore.getState().pushStroke(stroke());
    useBrushStore.getState().clearPage();
    const state = useBrushStore.getState();
    expect(state.pageId).toBeNull();
    expect(state.strokes).toEqual([]);
    expect(state.redoStack).toEqual([]);
  });

  it('setActiveBrushId switches the active brush', () => {
    useBrushStore.getState().setActiveBrushId('pencil');
    expect(useBrushStore.getState().activeBrushId).toBe('pencil');
    useBrushStore.getState().setActiveBrushId('spray');
    expect(useBrushStore.getState().activeBrushId).toBe('spray');
  });

  it('setPaletteId switches the active palette', () => {
    useBrushStore.getState().setPaletteId('forest');
    expect(useBrushStore.getState().paletteId).toBe('forest');
  });

  it('setTint clamps tint into [0, 1]', () => {
    useBrushStore.getState().setTint(2);
    expect(useBrushStore.getState().tint).toBe(1);
    useBrushStore.getState().setTint(-1);
    expect(useBrushStore.getState().tint).toBe(0);
    useBrushStore.getState().setTint(0.25);
    expect(useBrushStore.getState().tint).toBeCloseTo(0.25);
  });

  it('setSizeMultiplier clamps to a sensible range', () => {
    useBrushStore.getState().setSizeMultiplier(0);
    expect(useBrushStore.getState().sizeMultiplier).toBeGreaterThan(0);
    useBrushStore.getState().setSizeMultiplier(99);
    expect(useBrushStore.getState().sizeMultiplier).toBeLessThanOrEqual(4);
  });

  it('setEyedropperActive toggles the flag', () => {
    useBrushStore.getState().setEyedropperActive(true);
    expect(useBrushStore.getState().eyedropperActive).toBe(true);
    useBrushStore.getState().setEyedropperActive(false);
    expect(useBrushStore.getState().eyedropperActive).toBe(false);
  });

  it('setActiveColor pushes the color onto the recent-colors clock (deduped)', () => {
    useBrushStore.getState().setActiveColor(BLUE);
    useBrushStore.getState().setActiveColor(RED);
    useBrushStore.getState().setActiveColor(BLUE);
    const recents = useBrushStore.getState().recentColors;
    expect(recents[0]).toBe(BLUE);
    expect(recents.filter((c) => c === BLUE)).toHaveLength(1);
  });

  it('recent-colors clock caps at 5 entries', () => {
    const colors = ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666'];
    for (const c of colors) {
      useBrushStore.getState().setActiveColor(c);
    }
    expect(useBrushStore.getState().recentColors.length).toBeLessThanOrEqual(5);
  });

  it('applyTint blends toward white at 0 and black at 1', () => {
    expect(applyTint('#FF0000', 0.5).toUpperCase()).toBe('#FF0000');
    const lighter = applyTint('#FF0000', 0).toUpperCase();
    const darker = applyTint('#FF0000', 1).toUpperCase();
    expect(lighter).toBe('#FFFFFF');
    expect(darker).toBe('#000000');
  });

  it('createStroke produces unique ids', () => {
    const a = createStroke({
      color: RED,
      size: 8,
      mode: 'draw',
      regionId: null,
      points: [{ x: 0, y: 0 }],
    });
    const b = createStroke({
      color: RED,
      size: 8,
      mode: 'draw',
      regionId: null,
      points: [{ x: 0, y: 0 }],
    });
    expect(a.id).not.toBe(b.id);
  });
});
