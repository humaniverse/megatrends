# Megatrend Observatory

Open `dist/index.html` in a browser to explore the textile edition. The site includes its fonts, photographs, swatches, publications and research chapters. External sources open online. Saved threads and trends are stored in the browser on the current device when storage is available.

## Explore the collection

Choose **Explore → By theme** to trace an idea through the decades. **See the sources** turns the cloth over to show the publications behind that interpretation. **Books & reports** brings together the 24 publications and lets you compare any two by theme. **What’s changing** includes six trends to watch and four candidates for the next generation. **Possible futures** connects twelve assumptions to three scenarios. **Explore → By year** follows all eight research threads through six time horizons, with dated findings and links to possible futures.

## Edit and serve

The website in `dist/` has no runtime dependencies. Its entry point is `index.html`. The original research chapters keep their individual directory paths. The collection and editorial source records are in `research/`. Regenerate the derived catalogue, thread mappings, scenario data and research chapters with `python3 -B research/build.py`.

To serve the project locally, run the following command from the extracted folder and open http://127.0.0.1:8000/ in a browser.

```sh
python3 -m http.server --bind 127.0.0.1 --directory dist 8000
```

For static hosting, use `dist/` as the web root.

## Publish on GitHub Pages

The repository includes a GitHub Actions workflow that publishes the checked-in `dist/` directory. Push the repository to GitHub, then open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source. A push to `main` or a manual run of **Deploy to GitHub Pages** from the Actions tab will publish the site. For this repository, the expected address is <https://matthewgthomas.github.io/megatrends/>; the deployment job also reports the actual URL.

After editing the site, commit the updated files in `dist/` along with your source changes. If you change the research records, first run `python3 -B research/build.py` to regenerate the derived pages and data. The workflow deploys `dist/` as it is committed; it does not run the research generator. It removes the existing host's canonical links from the deployment copy so they do not misidentify the GitHub Pages site.
