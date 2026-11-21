# Megatrend Observatory

Open `dist/index.html` in a browser to explore the textile edition. The site includes its fonts, photographs, swatches, publications and research chapters. External sources open online. Saved threads and trends are stored in the browser on the current device when storage is available.

## Explore the collection

Choose **Follow a thread** to trace an idea through the decades. **Turn the cloth over** shows the publications behind that interpretation. In the **Swatch book**, compare any two of the 24 publications and trace a shared theme. **Possible futures** opens twelve assumptions and three scenarios. The six-horizon explorer is available from the homepage.

## Edit and serve

The website in `dist/` has no runtime dependencies. Its entry point is `index.html`. The original research chapters keep their individual directory paths. The collection and editorial source records are in `research/`. Regenerate the derived catalogue, thread mappings, scenario data and research chapters with `python3 -B research/build.py`.

To serve the project locally, run the following command from the extracted folder and open http://127.0.0.1:8000/ in a browser.

```sh
python3 -m http.server --bind 127.0.0.1 --directory dist 8000
```

For static hosting, use `dist/` as the web root.
