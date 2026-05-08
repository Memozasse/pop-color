import { DEFAULT_COLOR } from '@/data/palettes';
import type { Stroke } from '@/data/types';
import { BRUSH_SIZES, createStroke, useBrushStore } from '@/state/brushStore';

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
