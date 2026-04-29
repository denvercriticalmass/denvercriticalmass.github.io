import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load and execute the main.js file from public directory
const mainJsPath = path.join(__dirname, '../public/main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf-8');

// Create a module context and execute
const module = { exports: {} };
const func = new Function('module', 'exports', 'window', mainJsCode);

// Execute in a fake window context
const fakeWindow = { addEventListener: () => {} };
func(module, module.exports, fakeWindow);

const DenverCriticalMass = module.exports;

describe('DenverCriticalMass', () => {
  describe('formatDate', () => {
    it('formats a date correctly', () => {
      const date = new Date(2025, 9, 31); // October 31, 2025
      const result = DenverCriticalMass.formatDate(date);

      expect(result.month).toBe('October');
      expect(result.day).toBe(31);
      expect(result.year).toBe(2025);
    });

    it('formats a winter date correctly', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      const result = DenverCriticalMass.formatDate(date);

      expect(result.month).toBe('January');
      expect(result.day).toBe(15);
      expect(result.year).toBe(2025);
    });
  });

  describe('getOrdinalSuffix', () => {
    it('returns "st" for 1, 21, 31', () => {
      expect(DenverCriticalMass.getOrdinalSuffix(1)).toBe('st');
      expect(DenverCriticalMass.getOrdinalSuffix(21)).toBe('st');
      expect(DenverCriticalMass.getOrdinalSuffix(31)).toBe('st');
    });

    it('returns "nd" for 2, 22', () => {
      expect(DenverCriticalMass.getOrdinalSuffix(2)).toBe('nd');
      expect(DenverCriticalMass.getOrdinalSuffix(22)).toBe('nd');
    });

    it('returns "rd" for 3, 23', () => {
      expect(DenverCriticalMass.getOrdinalSuffix(3)).toBe('rd');
      expect(DenverCriticalMass.getOrdinalSuffix(23)).toBe('rd');
    });

    it('returns "th" for 4-20 and others', () => {
      expect(DenverCriticalMass.getOrdinalSuffix(4)).toBe('th');
      expect(DenverCriticalMass.getOrdinalSuffix(11)).toBe('th');
      expect(DenverCriticalMass.getOrdinalSuffix(12)).toBe('th');
      expect(DenverCriticalMass.getOrdinalSuffix(13)).toBe('th');
      expect(DenverCriticalMass.getOrdinalSuffix(20)).toBe('th');
    });
  });

  describe('formatDayWithOrdinal', () => {
    it('formats day with correct ordinal suffix', () => {
      expect(DenverCriticalMass.formatDayWithOrdinal(1)).toBe('1<sup>st</sup>');
      expect(DenverCriticalMass.formatDayWithOrdinal(2)).toBe('2<sup>nd</sup>');
      expect(DenverCriticalMass.formatDayWithOrdinal(3)).toBe('3<sup>rd</sup>');
      expect(DenverCriticalMass.formatDayWithOrdinal(4)).toBe('4<sup>th</sup>');
      expect(DenverCriticalMass.formatDayWithOrdinal(31)).toBe('31<sup>st</sup>');
    });

    it('throws error for invalid input', () => {
      expect(() => DenverCriticalMass.formatDayWithOrdinal(0)).toThrow('Day must be a positive number');
      expect(() => DenverCriticalMass.formatDayWithOrdinal(-1)).toThrow('Day must be a positive number');
      expect(() => DenverCriticalMass.formatDayWithOrdinal('1')).toThrow('Day must be a positive number');
    });
  });

  describe('getTargetDayOfWeek', () => {
    it('returns 5 (Friday) for May-October', () => {
      expect(DenverCriticalMass.getTargetDayOfWeek(4)).toBe(5); // May
      expect(DenverCriticalMass.getTargetDayOfWeek(9)).toBe(5); // October
    });

    it('returns 0 (Sunday) for November-April', () => {
      expect(DenverCriticalMass.getTargetDayOfWeek(10)).toBe(0); // November
      expect(DenverCriticalMass.getTargetDayOfWeek(11)).toBe(0); // December
      expect(DenverCriticalMass.getTargetDayOfWeek(0)).toBe(0); // January
      expect(DenverCriticalMass.getTargetDayOfWeek(1)).toBe(0); // February
      expect(DenverCriticalMass.getTargetDayOfWeek(2)).toBe(0); // March
      expect(DenverCriticalMass.getTargetDayOfWeek(3)).toBe(0); // April
    });
  });

  describe('getLastTargetDayOfMonth', () => {
    it('returns last Friday of October 2025', () => {
      const date = new Date(2025, 9, 1); // October 1, 2025
      const result = DenverCriticalMass.getLastTargetDayOfMonth(date);

      expect(result.getMonth()).toBe(9); // October
      expect(result.getDate()).toBe(31); // Last Friday is Oct 31
      expect(result.getDay()).toBe(5); // Friday
    });

    it('returns last Sunday of November 2025', () => {
      const date = new Date(2025, 10, 1); // November 1, 2025
      const result = DenverCriticalMass.getLastTargetDayOfMonth(date);

      expect(result.getMonth()).toBe(10); // November
      expect(result.getDate()).toBe(30); // Last Sunday is Nov 30
      expect(result.getDay()).toBe(0); // Sunday
    });

    it('returns last Sunday of December 2025', () => {
      const date = new Date(2025, 11, 1); // December 1, 2025
      const result = DenverCriticalMass.getLastTargetDayOfMonth(date);

      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(28); // Last Sunday is Dec 28
      expect(result.getDay()).toBe(0); // Sunday
    });

    it('returns last Sunday of March 2026', () => {
      const date = new Date(2026, 2, 1); // March 1, 2026
      const result = DenverCriticalMass.getLastTargetDayOfMonth(date);

      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(29); // Last Sunday is March 29
      expect(result.getDay()).toBe(0); // Sunday
    });

    it('returns last Sunday of April 2026', () => {
      const date = new Date(2026, 3, 1); // April 1, 2026
      const result = DenverCriticalMass.getLastTargetDayOfMonth(date);

      expect(result.getMonth()).toBe(3); // April
      expect(result.getDate()).toBe(26); // Last Sunday is April 26
      expect(result.getDay()).toBe(0); // Sunday
    });

    it('rolls over to next month if date is past the event', () => {
      // October 31, 2025 is the last Friday of October
      // If we check on Nov 1, it should return the next event (last Sunday of November)
      const date = new Date(2025, 10, 1, 0, 0, 0, 0); // November 1, 2025 at midnight
      const result = DenverCriticalMass.getLastTargetDayOfMonth(date);

      expect(result.getMonth()).toBe(10); // November
      expect(result.getDate()).toBe(30); // Last Sunday of November
    });
  });

  describe('isWinterSeason', () => {
    it('returns true for November-April', () => {
      expect(DenverCriticalMass.isWinterSeason(10)).toBe(true); // November
      expect(DenverCriticalMass.isWinterSeason(11)).toBe(true); // December
      expect(DenverCriticalMass.isWinterSeason(0)).toBe(true); // January
      expect(DenverCriticalMass.isWinterSeason(1)).toBe(true); // February
      expect(DenverCriticalMass.isWinterSeason(2)).toBe(true); // March
      expect(DenverCriticalMass.isWinterSeason(3)).toBe(true); // April
    });

    it('returns false for May-October', () => {
      expect(DenverCriticalMass.isWinterSeason(4)).toBe(false); // May
      expect(DenverCriticalMass.isWinterSeason(5)).toBe(false); // June
      expect(DenverCriticalMass.isWinterSeason(6)).toBe(false); // July
      expect(DenverCriticalMass.isWinterSeason(7)).toBe(false); // August
      expect(DenverCriticalMass.isWinterSeason(8)).toBe(false); // September
      expect(DenverCriticalMass.isWinterSeason(9)).toBe(false); // October
    });
  });

  describe('getEventTimes', () => {
    it('returns winter times for November-April', () => {
      const novemberTimes = DenverCriticalMass.getEventTimes(10); // November
      expect(novemberTimes.dayName).toBe('Sunday');
      expect(novemberTimes.meetTime).toBe('12:30pm');
      expect(novemberTimes.rideTime).toBe('1:00pm');

      const aprilTimes = DenverCriticalMass.getEventTimes(3); // April
      expect(aprilTimes.dayName).toBe('Sunday');
      expect(aprilTimes.meetTime).toBe('12:30pm');
      expect(aprilTimes.rideTime).toBe('1:00pm');
    });

    it('returns summer times for May-October', () => {
      const times = DenverCriticalMass.getEventTimes(4); // May
      expect(times.dayName).toBe('Friday');
      expect(times.meetTime).toBe('6:30pm');
      expect(times.rideTime).toBe('7:00pm');
    });
  });

  describe('updateDOM', () => {
    beforeEach(() => {
      // Set up the DOM with happy-dom (provided by vitest environment)
      document.body.innerHTML = `
        <span data-month></span>
        <span data-day></span>
        <span data-year></span>
        <span data-day-name></span>
        <span data-meet-time></span>
        <span data-ride-time></span>
      `;
    });

    it('updates DOM elements with correct values', () => {
      DenverCriticalMass.updateDOM();

      const monthEl = document.querySelector('[data-month]');
      const dayEl = document.querySelector('[data-day]');
      const yearEl = document.querySelector('[data-year]');
      const dayNameEl = document.querySelector('[data-day-name]');
      const meetTimeEl = document.querySelector('[data-meet-time]');
      const rideTimeEl = document.querySelector('[data-ride-time]');

      expect(monthEl.innerHTML).toBeTruthy();
      expect(dayEl.innerHTML).toContain('sup');
      expect(yearEl.innerHTML).toBeTruthy();
      expect(dayNameEl.innerHTML).toMatch(/Friday|Sunday/);
      expect(meetTimeEl.innerHTML).toMatch(/12:30pm|6:30pm/);
      expect(rideTimeEl.innerHTML).toMatch(/1:00pm|7:00pm/);
    });

    it('handles missing DOM elements gracefully', () => {
      document.body.innerHTML = ''; // Empty DOM

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      DenverCriticalMass.updateDOM();

      expect(consoleSpy).toHaveBeenCalledWith('Required DOM elements not found');
      consoleSpy.mockRestore();
    });
  });

  describe('Integration: Season Transition', () => {
    it('transitions from October (Friday) to November (Sunday)', () => {
      const octoberEvent = DenverCriticalMass.getLastTargetDayOfMonth(new Date(2025, 9, 1));
      expect(octoberEvent.getMonth()).toBe(9);
      expect(octoberEvent.getDate()).toBe(31);
      expect(octoberEvent.getDay()).toBe(5); // Friday

      const octoberTimes = DenverCriticalMass.getEventTimes(octoberEvent.getMonth());
      expect(octoberTimes.dayName).toBe('Friday');
      expect(octoberTimes.meetTime).toBe('6:30pm');

      const novemberEvent = DenverCriticalMass.getLastTargetDayOfMonth(new Date(2025, 10, 1));
      expect(novemberEvent.getMonth()).toBe(10);
      expect(novemberEvent.getDate()).toBe(30);
      expect(novemberEvent.getDay()).toBe(0); // Sunday

      const novemberTimes = DenverCriticalMass.getEventTimes(novemberEvent.getMonth());
      expect(novemberTimes.dayName).toBe('Sunday');
      expect(novemberTimes.meetTime).toBe('12:30pm');
    });

    it('transitions from April (Sunday) to May (Friday)', () => {
      const aprilEvent = DenverCriticalMass.getLastTargetDayOfMonth(new Date(2026, 3, 1));
      expect(aprilEvent.getMonth()).toBe(3);
      expect(aprilEvent.getDate()).toBe(26);
      expect(aprilEvent.getDay()).toBe(0); // Sunday

      const aprilTimes = DenverCriticalMass.getEventTimes(aprilEvent.getMonth());
      expect(aprilTimes.dayName).toBe('Sunday');
      expect(aprilTimes.meetTime).toBe('12:30pm');

      const mayEvent = DenverCriticalMass.getLastTargetDayOfMonth(new Date(2026, 4, 1));
      expect(mayEvent.getMonth()).toBe(4);
      expect(mayEvent.getDate()).toBe(29);
      expect(mayEvent.getDay()).toBe(5); // Friday

      const mayTimes = DenverCriticalMass.getEventTimes(mayEvent.getMonth());
      expect(mayTimes.dayName).toBe('Friday');
      expect(mayTimes.meetTime).toBe('6:30pm');
    });

    it('transitions from December (Sunday) to January (Sunday) with year rollover', () => {
      const decemberEvent = DenverCriticalMass.getLastTargetDayOfMonth(new Date(2025, 11, 1));
      expect(decemberEvent.getMonth()).toBe(11);
      expect(decemberEvent.getDate()).toBe(28);
      expect(decemberEvent.getDay()).toBe(0); // Sunday
      expect(decemberEvent.getFullYear()).toBe(2025);

      const decemberTimes = DenverCriticalMass.getEventTimes(decemberEvent.getMonth());
      expect(decemberTimes.dayName).toBe('Sunday');
      expect(decemberTimes.meetTime).toBe('12:30pm');

      const januaryEvent = DenverCriticalMass.getLastTargetDayOfMonth(new Date(2026, 0, 1));
      expect(januaryEvent.getMonth()).toBe(0);
      expect(januaryEvent.getDate()).toBe(25);
      expect(januaryEvent.getDay()).toBe(0); // Sunday
      expect(januaryEvent.getFullYear()).toBe(2026);

      const januaryTimes = DenverCriticalMass.getEventTimes(januaryEvent.getMonth());
      expect(januaryTimes.dayName).toBe('Sunday');
      expect(januaryTimes.meetTime).toBe('12:30pm');
    });
  });
});

