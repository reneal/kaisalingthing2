# kaisalingthing.ee

You can visit the live page at [kaisalingthing.ee](https://kaisalingthing.ee).

## Dependencies

Make sure you have Hugo installed on your system.

## Local development

To run the Hugo server locally for development:

```bash
hugo server -D
```

This will start a local development server, usually at http://localhost:1313. The `-D` flag includes draft content that would otherwise not be shown.

## Building the Site

To build the static file for production:

```bash
hugo
```

This will generate the website files in the `public` directory.

## Deployment

Deployment to GitHub Pages using GitHub Actions.

The deployment script is `.github/workflows/hugo.yaml`.