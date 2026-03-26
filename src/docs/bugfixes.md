# Bug fixes log

## 2026-03-26 — Add question dropdown clipped by overflow:hidden

**Symptom:** Clicking "Add question" in Build phase showed nothing / dropdown invisible.

**Root cause:** Dropdown rendered `position:absolute` inside a parent `overflow:hidden` section card — clipped visually and non-interactive.

**Fix:** `QTypeMenu` now renders `position:fixed` using `getBoundingClientRect()` on the trigger button. Outside-click via `document.addEventListener('mousedown')`.

**Also fixed:** OSCE Rubric + Formula added as selectable types (11 total). Formula routes to `FormulaQuestionEditor`. MP artifact: `b9350b07` @ `mnirdwczw9xbbzyuveee4g`.
