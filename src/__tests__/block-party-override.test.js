import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const overrideJsPath = path.join(__dirname, '../public/block-party-override.js');
const overrideJsCode = fs.readFileSync(overrideJsPath, 'utf-8');

const loadOverride = () => {
  const module = { exports: {} };
  const fakeWindow = { addEventListener: () => {} };
  const func = new Function('module', 'exports', 'window', overrideJsCode);
  func(module, module.exports, fakeWindow);
  return module.exports;
};

describe('BlockPartyOverride', () => {
  describe('isActive', () => {
    it('returns true before March 29, 2026', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 2, 15));
      const override = loadOverride();
      expect(override.isActive()).toBe(true);
      vi.useRealTimers();
    });

    it('returns true on March 29, 2026', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 2, 29, 12, 0, 0));
      const override = loadOverride();
      expect(override.isActive()).toBe(true);
      vi.useRealTimers();
    });

    it('returns false after March 29, 2026', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 2, 30));
      const override = loadOverride();
      expect(override.isActive()).toBe(false);
      vi.useRealTimers();
    });
  });

  describe('apply', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <span data-day-name>Sunday</span>
        <span data-meet-time>1:30pm</span>
        <span data-ride-time>2:00pm</span>
        <div data-winter-hours></div>
      `;
    });

    it('overrides DOM elements during block party period', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 2, 15));
      const override = loadOverride();
      override.apply();

      expect(document.querySelector('[data-meet-time]').innerHTML).toBe('11:00am');
      expect(document.querySelector('[data-ride-time]').innerHTML).toBe('11:30am');
      expect(document.querySelector('[data-day-name]').innerHTML).toBe('Sunday');
      const bannerHtml = document.querySelector('[data-winter-hours]').innerHTML;
      expect(bannerHtml).toContain('Larimer St Block Party');
      expect(bannerHtml).toContain('events.bike');
      expect(bannerHtml).toContain('✨');
      vi.useRealTimers();
    });

    it('does not override DOM elements after block party period', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 2, 30));
      const override = loadOverride();
      override.apply();

      expect(document.querySelector('[data-meet-time]').innerHTML).toBe('1:30pm');
      expect(document.querySelector('[data-ride-time]').innerHTML).toBe('2:00pm');
      expect(document.querySelector('[data-winter-hours]').innerHTML).toBe('');
      vi.useRealTimers();
    });
  });
});
