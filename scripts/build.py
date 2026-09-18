#!/usr/bin/env python3
"""Build deployable HTML with Python's standard library. Run from any directory."""
import argparse
import html
import json
from pathlib import Path
from string import Template

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://www.nickwohlfeil.com'
YEAR = '2026'
PROJECTS = json.loads((ROOT / 'content/projects.json').read_text())
EXPERIENCE = json.loads((ROOT / 'content/experience.json').read_text())
ESC = html.escape


def read(path):
    return (ROOT / path).read_text()


def social_links(prefix=''):
    profiles = [('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/nicholas-wohlfeil'), ('github', 'GitHub', 'https://github.com/njwohlf')]
    return ''.join(f'<a href="{url}"><svg class="social-icon" width="20" height="20" aria-hidden="true" focusable="false"><use href="{prefix}assets/icons.svg#{icon}" /></svg><span>{label}</span></a>' for icon, label, url in profiles)


def tags(project):
    return '<ul class="project-tags" aria-label="Technologies and topics">' + ''.join(
        f'<li>{ESC(tag)}</li>' for tag in project['tags']) + '</ul>'


def project_card(project):
    title, slug = ESC(project['title']), project['slug']
    return f'''<article class="project-card" data-category="{project['category']}">
      <div class="project-card-content"><div class="project-meta"><span>{project['category']}</span></div>
      <h3><a href="projects/{slug}.html">{title}<span class="card-arrow" aria-hidden="true">↗</span></a></h3>
      <p>{ESC(project['summary'])}</p>{tags(project)}</div>
    </article>'''


def project_page(project):
    paragraphs = ''.join(f'<p>{ESC(paragraph)}</p>' for paragraph in project['overview'])
    return f'''<div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../projects.html">Projects</a><span aria-hidden="true">/</span><span aria-current="page">{ESC(project['title'])}</span></nav></div>
    <section class="page-intro container project-intro"><p class="eyebrow">{project['category']}</p><h1>{ESC(project['title'])}</h1>{tags(project)}</section>
    <div class="container project-overview prose">{paragraphs}</div>'''


def experience_page():
    rows = ''.join(f'''<li class="experience-item"><div class="experience-date"><span>{ESC(role['dates'].replace(' - ', ' – ').replace('Current', 'Present'))}</span></div><div><p class="experience-org">{ESC(role['organization'])}</p><h2>{ESC(role['title'])}</h2><p>{ESC(role['description'])}</p></div></li>''' for role in EXPERIENCE)
    return f'''<section class="page-intro container"><h1>Experience</h1><a class="text-link" href="resume.html">View resume <span aria-hidden="true">↗</span></a></section><section class="container section experience-section" aria-label="Professional experience"><ol class="experience-list">{rows}</ol></section>'''


PAGES = {
    'index.html': ('Software Engineer', 'Nick Wohlfeil is a software engineer in Ann Arbor, Michigan. Explore work in software, robotics, and systems, and the thinking behind it.'),
    'about.html': ('About', 'Meet Nick Wohlfeil, a Michigan Engineering graduate with a background in software, robotics research, teaching, and university operations.'),
    'projects.html': ('Projects', 'Explore Nicholas Wohlfeil’s software, robotics, and systems projects, including cache simulation, machine learning, and autonomous robots.'),
    'experiences.html': ('Experience', 'Nicholas Wohlfeil’s experience in software, robotics research, teaching, and administration at the University of Michigan.'),
    'resume.html': ('Resume', 'Read or download Nicholas Wohlfeil’s resume, with experience in software engineering, research, and teaching.'),
    'contact.html': ('Contact', 'Contact Nicholas Wohlfeil about software engineering, projects, or professional opportunities.'),
    'accessibility.html': ('Accessibility', 'Accessibility features, design targets, and known limitations of Nicholas Wohlfeil’s portfolio.'),
    'privacy.html': ('Privacy', 'How contact messages and browser preferences are handled on Nicholas Wohlfeil’s portfolio.'),
    '404.html': ('Page not found', 'Find your way back to Nicholas Wohlfeil’s portfolio and engineering projects.'),
}


def render(path, title, description, content):
    prefix = '../' if '/' in path else ''
    if path == '404.html':
        prefix = '/'  # The host can serve this document at arbitrary missing paths.
    active = 'projects.html' if path.startswith('projects/') else path
    links = []
    for href, label in [('projects.html', 'Projects'), ('about.html', 'About'), ('experiences.html', 'Experience'), ('resume.html', 'Resume'), ('contact.html', 'Contact')]:
        current = ' aria-current="page"' if active == href else ''
        links.append(f'<li><a href="{prefix}{href}"{current}>{label}</a></li>')
    navbar = Template(read('partials/navbar.html')).substitute(prefix=prefix, nav_links=''.join(links))
    footer = Template(read('partials/footer.html')).substitute(year=YEAR, social_links=social_links(prefix))
    canonical = SITE + ('/' if path == 'index.html' else '/' + path)
    extra = '<script src="js/projects-page.js" defer></script>' if path == 'projects.html' else ''
    if path in ['404.html', 'projects/coming-soon.html']:
        extra += '<meta name="robots" content="noindex">'
    rendered = Template(read('templates/page.html')).substitute(prefix=prefix, title=ESC(f'{title} | Nicholas Wohlfeil'), description=ESC(description), canonical=canonical, extra_head=extra, navbar=navbar, footer=footer, content=content)
    return '\n'.join(line.rstrip() for line in rendered.splitlines()) + '\n'


def outputs():
    result = {}
    for path, (title, description) in PAGES.items():
        if path == 'experiences.html':
            content = experience_page()
        else:
            content = read('content/pages/' + path)
            if path == 'index.html':
                content = Template(content).substitute(featured_projects=''.join(project_card(p) for p in PROJECTS if p.get('featured')))
            if path == 'contact.html':
                content = Template(content).substitute(social_links=social_links())
            if path == 'projects.html':
                content = Template(content).substitute(all_projects=''.join(project_card(p) for p in PROJECTS))
        result[path] = render(path, title, description, content)
    for project in PROJECTS:
        path = f'projects/{project["slug"]}.html'
        result[path] = render(path, project['title'], project['summary'], project_page(project))
    result['projects/coming-soon.html'] = render('projects/coming-soon.html', 'More work to come', 'Explore the projects currently available in Nicholas Wohlfeil’s portfolio.', '<section class="page-intro container"><h1>Project not available</h1><p class="lead">This project page isn’t available yet.</p><a class="button" href="../projects.html">Explore projects ↗</a></section>')
    result['email.html'] = render('email.html', 'Contact', 'Send Nicholas Wohlfeil a message.', '<section class="page-intro container"><h1>Contact</h1><p class="lead">You can reach me through the <a href="contact.html">contact form</a>.</p></section>')
    paths = [path for path in result if path not in ('404.html', 'projects/coming-soon.html')]
    result['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{SITE}{"/" if path == "index.html" else "/" + path}</loc></url>\n' for path in paths) + '</urlset>\n'
    result['robots.txt'] = f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n'
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if generated files are stale, without changing them.')
    args = parser.parse_args()
    stale = []
    for path, content in outputs().items():
        target = ROOT / path
        if args.check:
            if not target.exists() or target.read_text() != content:
                stale.append(path)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content)
    if stale:
        raise SystemExit('Generated files need rebuilding: ' + ', '.join(stale))
    print('Generated files are current.' if args.check else 'Built static pages, sitemap, and robots.txt.')


if __name__ == '__main__':
    main()
