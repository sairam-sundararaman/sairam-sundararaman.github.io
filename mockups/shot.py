from playwright.sync_api import sync_playwright
import os
pages = ["concept-a","concept-a-blog","concept-b","concept-b-blog","concept-c","concept-c-blog"]
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1280,"height":900}, device_scale_factor=1.5)
    for name in pages:
        pg.goto("file:///workspace/mockups/%s.html" % name)
        pg.wait_for_timeout(3500)
        pg.screenshot(path="/workspace/mockups/%s.png" % name, full_page=True)
        print("shot", name)
    b.close()
