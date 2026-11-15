# Google Search Console: get the site on Google

Do this once the site is live at https://mtaha2588.github.io. It takes about 10 minutes.

1. Go to https://search.google.com/search-console and sign in with your Google account.
2. Click **Add property** → choose **URL prefix** → enter `https://mtaha2588.github.io/` → Continue.
3. Choose the **HTML tag** verification method. Google shows a tag like:
   `<meta name="google-site-verification" content="ABC123..." />`
4. Open `frontend/index.html`, find the comment that mentions Google Search Console, and paste the tag on the line below it. Commit and push; wait for the Actions deploy to finish (about 2 minutes).
   (Or send me the tag and I'll add it.)
5. Back in Search Console, click **Verify**.
6. In the left menu, open **Sitemaps**, enter `sitemap.xml` and click **Submit**.
7. Optional: open **URL inspection**, paste `https://mtaha2588.github.io/`, and click **Request indexing**. Repeat for your two or three most important case studies.

What to expect: Google usually starts showing the site within a few days to two weeks. Check **Performance** in Search Console after a couple of weeks to see what people search for when they find you.

Also worth doing:
- **Bing Webmaster Tools** (https://www.bing.com/webmasters): sign in and choose "Import from Google Search Console". It's one click once Google is verified.
- Put your site link on LinkedIn, GitHub (profile + repo "Website" field), Fiverr and Upwork. Links from those profiles help Google find and trust the site.
