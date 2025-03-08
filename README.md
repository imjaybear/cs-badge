# CS2 Service Medal Badge Calculator

[![CS2 Service Medal](https://img.shields.io/badge/CS2-Service%20Medal-blue?style=for-the-badge&logo=steam)](https://github.com/imjaybear/cs-badge)

Made this in about an hr just because I was bored which means it sucks. 

I'll come back later to it eventually. 

## Features
- Input: Current level only.
- Output: Weeks to Level 1 (40), 2 (80), 3 (120), 4 (160) Service Medal badges.
- Based on 10,000 XP/week (2 levels) normal rate, 50% reduction per reset.

## How It Works
- 195,000 XP per Level 40 cycle.
- Example (Level 10):
  - Level 40: 15 weeks
  - Level 80: 54 weeks
  - Level 120: 132 weeks
  - Level 160: 288 weeks

## Usage
1. Open `index.html` in a browser.
2. Enter your level (1-39).
3. Click "Calculate" for results.

## Files
- `index.html`: Main page
- `styles.css`: Styling
- `script.js`: Logic

## Setup
```bash
git clone https://github.com/imjaybear/cs-badge.git
cd cs-badge
# Open index.html or use `npx live-server`
