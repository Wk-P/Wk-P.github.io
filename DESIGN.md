# Portfolio design system

All portfolio and blog pages use `assets/blog.css`, the shared header/footer, and the
same semantic color tokens. `/thesis/` is a separately maintained website.

## Palette

| Role | Color | Use |
| --- | --- | --- |
| Paper | `#f8f9f5` | Page background |
| Surface | `#ffffff` | Articles and information cards |
| Ink | `#24332d` | Headings and body text |
| Muted | `#5e6c64` | Secondary text and metadata |
| Accent | `#24634d` | Actions, links, selected controls |
| Soft | `#edf3ec` | Selected navigation and supporting surfaces |
| Line | `#dde4dc` | Borders and section separators |

Use color with labels and borders, rather than color alone, for selected
controls and draft status. Focus indicators remain visible for keyboard users.

## Typography and layout

System sans-serif for navigation, metadata, and controls; Georgia for blog
titles and long-form reading; monospace for code. No remote font dependency.
Body text has a generous line height. Reading content is limited to 760px.
Shared content width is 1160px, with 32px desktop and 20px mobile gutters.
Use 8px-based spacing, restrained borders, and rounded surfaces.

## Interaction

- Shared navigation visibly identifies the current page.
- Search and tags combine; URLs preserve the current query and tag.
- Search has a clear control; no results provides a reset control.
- Result counts are announced with `aria-live`.
- Article code blocks can be copied when the clipboard API is available.
- The table of contents highlights the current heading while reading.
- About retains English, Chinese, and Korean content in the shared shell.
- Mobile layouts stack content and retain all navigation destinations.
- Motion respects the system reduced-motion preference.

Local previews may show draft articles. Production builds exclude them.

## Portfolio hierarchy

Lead with name, Backend / Cloud positioning, PNU graduate status, and Projects / Research / GitHub actions. Order engineering cards as CloudPlatform, Femoup MVP, Kubernetes security infrastructure, Docker load balancing, and Emotion Talk Assistant. Label client MVPs and research prototypes explicitly. Follow with thesis, three paper PDFs, skills, and email / GitHub contact. Education and collapsed secondary prototypes remain on About. Writing appears at the bottom of the homepage only when posts exist; `/blog/` retains search and filters.
