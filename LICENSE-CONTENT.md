# Content License — CC BY-SA 4.0

The **content** of this project — distinct from the code, which is licensed
under MIT (see `LICENSE`) — is dedicated to the public under
**Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.

Full legal text: https://creativecommons.org/licenses/by-sa/4.0/legalcode
Human-readable summary: https://creativecommons.org/licenses/by-sa/4.0/

Copyright © 2026 yelban (https://github.com/yelban)

## What counts as "content"

- The 850-word vocabulary list and its five-category structure
- All Traditional Chinese (Taiwan) glosses (`gloss_zh_tw`)
- All English definitions (`definition_en`)
- All English example sentences (`example_en`)
- All Traditional Chinese example translations (`example_zh_tw`)
- All synonym selections (`synonyms[]`)
- All Markdown research notes under `docs/ogden-research/`
- The merged dataset shipped in `src/data/words.ts` and the per-batch JSON files in `data/generated/`

## What CC BY-SA 4.0 requires

You are free to **share** (copy and redistribute in any medium or format) and
**adapt** (remix, transform, and build upon) the content for any purpose,
including commercially, under these terms:

1. **Attribution** — You must give appropriate credit, link to the license,
   and indicate if changes were made. A reasonable form:

   > Vocabulary data adapted from *Ogden's Basic English 850 字繁中學習手冊*
   > by yelban (https://github.com/yelban/Ogden), licensed under CC BY-SA 4.0.

2. **ShareAlike** — If you remix, transform, or build upon the content, you
   must distribute your contributions under the same license (CC BY-SA 4.0)
   or one that is compatible.

3. **No additional restrictions** — You may not apply legal terms or
   technological measures that legally restrict others from doing anything
   the license permits.

## Upstream attribution

The 850-word vocabulary structure originates from C.K. Ogden's *Basic English:
A General Introduction with Rules and Grammar* (1930). The specific word list
and five-category grouping used as the seed for this project was sourced from
the English Wiktionary appendix, itself CC BY-SA 4.0:

- https://en.wiktionary.org/wiki/Appendix:Basic_English_word_list

The example-sentence vocabulary ceiling references the Basic English
Combined Wordlist (≈2000 words) maintained on Simple English Wikipedia,
also CC BY-SA 4.0:

- https://simple.wikipedia.org/wiki/Wikipedia:Basic_English_combined_wordlist

Cross-validation alphabetic list (public-domain mirror) downloaded from
the Internet Archive:

- https://archive.org/details/ogdens-basic-english-words-list-alphabetic

C.K. Ogden died in 1957; his original 1930 work is in the public domain in
most jurisdictions where the copyright term is life + 70 years (Taiwan term:
life + 50 years, so expired since 2008).

## Why dual licensing

The code of this site (Astro components, TypeScript scripts, CSS, CI
workflow) is loose — anyone can reuse the engine for any project, even
commercial, with only the MIT notice required.

The content of this site (the curated glosses, definitions, examples, and
research notes) took deliberate editorial effort and was modelled after
upstream CC BY-SA sources. Keeping it under the same CC BY-SA 4.0 license:

- Honours the upstream attribution chain (Wiktionary, Simple Wikipedia)
- Protects the editorial work from being closed-sourced into proprietary
  products
- Makes it clear to redistributors what they must keep open

If you only want the engine to build *your own* vocabulary site with
*your own* content, you only need to comply with MIT (`LICENSE`) and
can pick any license you wish for your content.
