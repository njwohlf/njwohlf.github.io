#!/usr/bin/env python3
"""Validate generated HTML, local references, metadata, and project content."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = list(ROOT.glob('*.html')) + [p for folder in ['about', 'projects', 'experiences', 'resume', 'contact'] for p in (ROOT / folder).rglob('*.html')]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = set()
        self.links = []
        self.h1 = 0
        self.main = 0
        self.description = 0
        self.canonical = 0
        self.lang = False
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'{self.path}: duplicate id {attrs["id"]}'
            self.ids.add(attrs['id'])
        self.h1 += tag == 'h1'
        self.main += tag == 'main'
        if tag == 'html':
            self.lang = bool(attrs.get('lang'))
        if tag == 'meta' and attrs.get('name') == 'description':
            assert attrs.get('content'), f'{self.path}: empty description'
            self.description += 1
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical += 1
        if tag == 'img':
            assert 'alt' in attrs and attrs.get('width') and attrs.get('height'), f'{self.path}: image alternatives/dimensions missing'
        if tag == 'iframe':
            assert attrs.get('title'), f'{self.path}: iframe title missing'
        for key in ('href', 'src'):
            if attrs.get(key):
                self.links.append(attrs[key])
        for key in ('aria-controls', 'aria-labelledby', 'aria-describedby', 'for'):
            for value in attrs.get(key, '').split():
                self.links.append('#' + value)


pages = {page.resolve(): Page(page) for page in PAGES}
for path, page in pages.items():
    assert page.h1 == 1 and page.main == 1, f'{path}: expected one h1 and main'
    assert page.description == 1 and page.canonical == 1 and page.lang, f'{path}: missing metadata or language'
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        target = ((ROOT / unquote(url.path).lstrip('/')) if url.path.startswith('/') else (path.parent / unquote(url.path))).resolve() if url.path else path
        if target.is_dir():
            target = target / 'index.html'
        assert target.exists(), f'{path.relative_to(ROOT)}: missing link {link}'
        if url.fragment and target in pages:
            assert unquote(url.fragment) in pages[target].ids, f'{path}: missing anchor {link}'

projects = json.loads((ROOT / 'content/projects.json').read_text())
assert len({p['slug'] for p in projects}) == len(projects), 'Project slugs must be unique'
for project in projects:
    assert re.fullmatch('[a-z0-9-]+', project['slug']), 'Invalid project slug'
    assert project['category'] in ['Academic', 'Research', 'Personal'], 'Invalid project category'
    assert project['tags'] and project['overview'] and all(project['overview']), 'Project content incomplete'
    if project.get('photo'):
        photo = project['photo']
        assert photo['alt'].strip() and photo['width'] > 0 and photo['height'] > 0, 'Photo needs alt text and dimensions'
        assert photo['src'].startswith('assets/') and (ROOT / photo['src']).is_file(), 'Photo must be a local asset'
    assert (ROOT / 'projects'  / project['slug'] / 'index.html').exists()
print(f'PASS: {len(pages)} pages, local links, anchors, semantics, metadata, and {len(projects)} project records.')
