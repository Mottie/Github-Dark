# GitHub Dark [![tags](https://img.shields.io/github/tag/StylishThemes/GitHub-Dark.svg?style=flat)](https://github.com/StylishThemes/GitHub-Dark/tags) [![star this repo](http://github-svg-buttons.herokuapp.com/star.svg?user=StylishThemes&repo=GitHub-Dark&style=flat&background=1081C1)](http://github.com/StylishThemes/GitHub-Dark) [![fork this repo](http://github-svg-buttons.herokuapp.com/fork.svg?user=StylishThemes&repo=GitHub-Dark&style=flat&background=1081C1)](http://github.com/StylishThemes/GitHub-Dark/fork)

- Install from [userstyles.org](http://userstyles.org/styles/37035) (with customization options) or [manually](https://raw.githubusercontent.com/StylishThemes/GitHub-Dark/master/github-dark.css).
- Stylish is available for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/2108/), [Chrome](https://chrome.google.com/extensions/detail/fjnbnpbmkenffdnngjfgmeleoegfcffe), [Opera](https://addons.opera.com/en/extensions/details/stylish/), [Safari](http://sobolev.us/stylish/) and [Firefox Mobile](https://addons.mozilla.org/en-US/firefox/addon/2108/).
- Use the [grunt build process](https://github.com/StylishThemes/GitHub-Dark/wiki/Build) to customize your GitHub Dark theme.
- Please refer to the [installation documentation](https://github.com/StylishThemes/GitHub-Dark/wiki/Install) for more details.

## Preview
![GitHub Dark preview](http://i.imgur.com/9ChgiR6.png)

## [Available Syntax Highlighting Themes](http://stylishthemes.github.io/GitHub-Dark/)

|   |   |   |   |   |
| --- | --- | --- | --- | --- |
| Ambiance | Chaos | Clouds Midnight | Cobalt | Idle Fingers* |
| Kr Theme | Merbivore | Merbivore Soft | Mono Industrial | Monokai* |
| Pastel on Dark* | Solarized Dark* | Terminal | Tomorrow Night* | Tomorrow Night Blue* |
| Tomorrow Night Bright* | Tomorrow Night Eigthies* | Twilight* | Vibrant Ink | |

\* Supports [Jupyter notebook syntax highlighting](https://github.com/sujitpal/statlearning-notebooks/blob/master/src/chapter2.ipynb)

## Notes

* If you're using a custom domain for GitHub Enterprise, be sure to include it though a `@-moz-document` rule (Firefox) or add it to the `Applies to` section in (Chrome).

## Contributions

If you would like to contribute to this repository, please...

1. Fork
2. Make changes (please read the [contribution guidelines](https://github.com/StylishThemes/GitHub-Dark/blob/master/CONTRIBUTING.md) and abide by them)
3. Create a pull request!

Thanks to all that have [contributed](https://github.com/StylishThemes/GitHub-Dark/graphs/contributors) so far!

## Recent Changes

See the [full change log](https://github.com/StylishThemes/GitHub-Dark/wiki).

#### Version 1.13.2 (5/31/2015)

* Fix pull request icon color.
* Issues: fix a white border.

#### Version 1.13.1 (5/21/2015)

* Themes:
  * Fix css error.
  * Update min files.
* Options:
  * Remove gradient from dashboard notice.
  * Tweak a few text colors.
  * Fix payment tab.
  * Tweak coupon form.
* Global: Fix clone input test color.

#### Version 1.13.0 (5/15/2015)

* Add Jupyter notebook support
  * Style fixes
  * Use same shade colors for I/O labels
  * Fix inline code blocks
  * Fix background color of graphs (using a filter invert style, so the original colors will not be seen).
  * Add syntax highlighting (pygments) - see ["Available Syntax Highlight Themes"](https://github.com/StylishThemes/GitHub-Dark#available-syntax-highlighting-themes) to see which themes are supported.
* File View: Fix delete button hover.
* Global:
  * Update filter rules.
  * Fix "Search GitHub" focus box shadow.
  * Various tweaks.
* Organizations: Fix team names.
* Gist: Fix comment box action hover.
* ZenHub: Add burndown page styling.
* Status page: use high-res spinner.
* Markdown: Fix links in code tags.
