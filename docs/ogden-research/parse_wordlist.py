"""Parse Wiktionary Basic English markdown into structured JSON and verify counts."""

import json
import re
from pathlib import Path

BASE = Path(__file__).parent
RAW = BASE / "wiktionary-raw.md"
OUT = BASE / "basic-english-850.json"

SECTIONS = [
    ("operations", "## Operations - 100 words", "## 400 general words", 100),
    ("general_things", "## 400 general words", "## Things - 200 picturable words", 400),
    ("picturable_things", "## Things - 200 picturable words", "[Pictures of these 200 words]", 200),
    ("qualities_general", "## Qualities - 100 descriptive words", "## Qualities - 50 opposites", 100),
    ("qualities_opposites", "## Qualities - 50 opposites", "\n*   [", 50),
]

LINK = re.compile(r"\[([^\]]+)\]\([^)]+\)")


def extract(text: str, header: str, end_marker: str | None) -> list[str]:
    start = text.index(header) + len(header)
    end = text.index(end_marker, start) if end_marker else len(text)
    block = text[start:end]
    words = LINK.findall(block)
    seen, ordered = set(), []
    for w in words:
        if w not in seen:
            seen.add(w)
            ordered.append(w)
    return ordered


def main() -> None:
    text = RAW.read_text(encoding="utf-8")
    data: dict[str, list[str]] = {}
    total = 0
    errors = []

    for key, header, end_marker, expected in SECTIONS:
        words = extract(text, header, end_marker)
        data[key] = words
        total += len(words)
        if len(words) != expected:
            errors.append(f"{key}: got {len(words)}, expected {expected}")
        print(f"{key:24s} {len(words):4d} (expected {expected})")

    print(f"{'TOTAL':24s} {total:4d}")

    payload = {
        "source": "https://en.wiktionary.org/wiki/Appendix:Basic_English_word_list",
        "license": "CC BY-SA 4.0",
        "original_work": "C.K. Ogden, Basic English: A General Introduction with Rules and Grammar (1930)",
        "total": total,
        "categories": data,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWritten: {OUT}")

    if errors:
        print("\nMISMATCHES:")
        for e in errors:
            print(" -", e)
    else:
        print("\nAll category counts match expected.")


if __name__ == "__main__":
    main()
