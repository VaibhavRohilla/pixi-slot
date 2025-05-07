import { DisplayObject, Point } from 'pixi.js';
import { global } from '../Global';

export type AnchorPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
export type ScaleMode = 'fit' | 'fill' | 'none';

// Constants
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const BREAKPOINTS = {
  small: 768,
  medium: 1024,
  large: 1440,
};

// State
let currentScale = 1;
let currentAspectRatio = 1;
let lastWidth = 0;
let lastHeight = 0;
let lastOrientation: 'portrait' | 'landscape' = 'landscape';
const pixelRatio = window.devicePixelRatio || 1;

// Initialize
const initialize = (): void => {
  updateDimensions();
  setupResizeListener();
  setupOrientationListener();
  preventScrollbars();
};

const preventScrollbars = (): void => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
  }
};

const updateDimensions = (): void => {
  lastWidth = window.innerWidth;
  lastHeight = window.innerHeight;
  lastOrientation = isPortrait() ? 'portrait' : 'landscape';
  updateScale();
};

const setupResizeListener = (): void => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      const newOrientation = isPortrait() ? 'portrait' : 'landscape';
      if (
        lastWidth !== window.innerWidth ||
        lastHeight !== window.innerHeight ||
        lastOrientation !== newOrientation
      ) {
        updateDimensions();
      }
    });
  }
};

const setupOrientationListener = (): void => {
  if (typeof window !== 'undefined') {
    window.addEventListener('orientationchange', () => {
      // Add a small delay to ensure dimensions are updated
      setTimeout(() => {
        updateDimensions();
        preventScrollbars();
      }, 100);
    });
  }
};

const updateScale = (): void => {
  // Calculate base scale
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  // Calculate aspect ratio
  currentAspectRatio = window.innerWidth / window.innerHeight;

  // Determine scale based on orientation and screen size
  let baseScale = Math.min(scaleX, scaleY);

  // Adjust scale based on screen size and orientation
  const screenSize = getScreenSize();
  const isPortraitMode = isPortrait();

  // Apply orientation-specific scaling
  if (isPortraitMode) {
    // Portrait mode adjustments
    switch (screenSize) {
      case 'small':
        baseScale *= 0.85; // Reduced to prevent overflow
        break;
      case 'medium':
        baseScale *= 0.9;
        break;
      case 'large':
        baseScale *= 0.95;
        break;
    }
  } else {
    // Landscape mode adjustments
    switch (screenSize) {
      case 'small':
        baseScale *= 0.8;
        break;
      case 'medium':
        baseScale *= 0.85;
        break;
      case 'large':
        baseScale *= 0.9;
        break;
    }
  }

  // Apply pixel ratio and clamp
  currentScale = Math.min(Math.max(baseScale * pixelRatio, MIN_SCALE), MAX_SCALE);
};

// Public functions
export const getScale = (): number => currentScale;

export const getObjectScale = (object: DisplayObject, mode: ScaleMode = 'fit'): number => {
  const bounds = object.getBounds();
  const scaleX = window.innerWidth / bounds.width;
  const scaleY = window.innerHeight / bounds.height;
  let scale: number;

  switch (mode) {
    case 'fit':
      scale = Math.min(scaleX, scaleY);
      break;
    case 'fill':
      scale = Math.max(scaleX, scaleY);
      break;
    default:
      scale = 1;
  }

  // Apply responsive adjustments based on orientation
  const screenSize = getScreenSize();
  const isPortraitMode = isPortrait();

  if (isPortraitMode) {
    switch (screenSize) {
      case 'small':
        scale *= 0.85;
        break;
      case 'medium':
        scale *= 0.9;
        break;
      case 'large':
        scale *= 0.95;
        break;
    }
  } else {
    switch (screenSize) {
      case 'small':
        scale *= 0.8;
        break;
      case 'medium':
        scale *= 0.85;
        break;
      case 'large':
        scale *= 0.9;
        break;
    }
  }

  scale *= pixelRatio;
  return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
};

export const getPercentagePosition = (xPercent: number, yPercent: number): Point => {
  const safeArea = getSafeAreaInsets();
  const availableWidth = window.innerWidth - safeArea.left - safeArea.right;
  const availableHeight = window.innerHeight - safeArea.top - safeArea.bottom;

  return new Point(
    safeArea.left + (availableWidth * xPercent) / 100,
    safeArea.top + (availableHeight * yPercent) / 100
  );
};

export const getRelativePosition = (x: number, y: number): Point => {
  const safeArea = getSafeAreaInsets();
  const availableWidth = window.innerWidth - safeArea.left - safeArea.right;
  const availableHeight = window.innerHeight - safeArea.top - safeArea.bottom;

  return new Point(safeArea.left + availableWidth * x, safeArea.top + availableHeight * y);
};

export const getPosition = (
  position: AnchorPosition,
  padding: { x?: number; y?: number } = {}
): Point => {
  const { x: paddingX = 0, y: paddingY = 0 } = padding;
  const safeArea = getSafeAreaInsets();
  const scale = getScale();

  const scaledPaddingX = paddingX * scale;
  const scaledPaddingY = paddingY * scale;

  switch (position) {
    case 'topLeft':
      return new Point(safeArea.left + scaledPaddingX, safeArea.top + scaledPaddingY);
    case 'topRight':
      return new Point(
        window.innerWidth - safeArea.right - scaledPaddingX,
        safeArea.top + scaledPaddingY
      );
    case 'bottomLeft':
      return new Point(
        safeArea.left + scaledPaddingX,
        window.innerHeight - safeArea.bottom - scaledPaddingY
      );
    case 'bottomRight':
      return new Point(
        window.innerWidth - safeArea.right - scaledPaddingX,
        window.innerHeight - safeArea.bottom - scaledPaddingY
      );
    case 'center':
    default:
      return new Point(
        window.innerWidth / 2 + scaledPaddingX,
        window.innerHeight / 2 + scaledPaddingY
      );
  }
};

export const getCenter = (): Point => {
  const safeArea = getSafeAreaInsets();
  const availableWidth = window.innerWidth - safeArea.left - safeArea.right;
  const availableHeight = window.innerHeight - safeArea.top - safeArea.bottom;

  // Calculate center position considering the scale
  const centerX = availableWidth / 2 + safeArea.left;
  const centerY = availableHeight / 2 + safeArea.top;

  return new Point(centerX, centerY);
};

export const getDimensions = (): { width: number; height: number } => {
  const safeArea = getSafeAreaInsets();
  return {
    width: window.innerWidth - safeArea.left - safeArea.right,
    height: window.innerHeight - safeArea.top - safeArea.bottom,
  };
};

export const getBaseDimensions = (): { width: number; height: number } => ({
  width: BASE_WIDTH,
  height: BASE_HEIGHT,
});

export const getAspectRatio = (): number => currentAspectRatio;

export const isPortrait = (): boolean => window.innerHeight > window.innerWidth;

export const getSafeAreaInsets = (): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };

  if (global.isMobile && typeof window !== 'undefined') {
    const style = getComputedStyle(document.documentElement);
    insets.top = parseInt(style.getPropertyValue('--sat') || '0');
    insets.right = parseInt(style.getPropertyValue('--sar') || '0');
    insets.bottom = parseInt(style.getPropertyValue('--sab') || '0');
    insets.left = parseInt(style.getPropertyValue('--sal') || '0');
  }

  return insets;
};

export const getOrientation = (): 'portrait' | 'landscape' =>
  isPortrait() ? 'portrait' : 'landscape';

export const getScreenSize = (): 'small' | 'medium' | 'large' => {
  const width = window.innerWidth;
  if (width < BREAKPOINTS.small) return 'small';
  if (width < BREAKPOINTS.medium) return 'medium';
  if (width < BREAKPOINTS.large) return 'large';
  return 'large';
};

// Initialize the config
initialize();

// Export all functions as a single object
export const appConfig = {
  getScale,
  getObjectScale,
  getPercentagePosition,
  getRelativePosition,
  getPosition,
  getCenter,
  getDimensions,
  getBaseDimensions,
  getAspectRatio,
  isPortrait,
  getSafeAreaInsets,
  getOrientation,
  getScreenSize,
};
