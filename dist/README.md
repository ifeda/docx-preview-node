# docx-preview-node

The docx document rendering library for nodeJs

[![npm version](https://badge.fury.io/js/docx-preview-node.svg)](https://www.npmjs.com/package/docx-preview-node)
Introduction
----

This library is inspired by the [docx-preview](https://github.com/VolodymyrBaydalka/docxjs) library. Thanks to the author [VolodymyrBaydalka](https://github.com/VolodymyrBaydalka) for his hard work.
I forked the project and modified it to support nodeJs environment.
To achieve this goal, I just changed several file that changed window|document|DOMParser|Node|HTMLElement to jsdom. And I have to changed the compiler and enabled the condition compilation. so that `docx-preview.js` is the edition for nodeJs require(main) and `docx-preview.browser.js` is the edition for browser(manually).
