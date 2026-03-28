import requests
import os
import json
import zipfile

def get_firefox_latest(addon_slug):
    api_url = f"https://addons.mozilla.org/api/v5/addons/addon/{addon_slug}/versions/"
    data = requests.get(api_url).json()
    latest = data.get('results', [])[0]
    return {"version": latest['version'], "url": latest['file']['url']}

def get_chrome_latest(extension_id):
    url = f"https://clients2.google.com/service/update2/crx?response=redirect&prodversion=98.0&acceptformat=crx2,crx3&x=id%3D{extension_id}%26uc"
    r = requests.get(url)
    with open("temp_chrome.crx", "wb") as f:
        f.write(r.content)
    
    version = "unknown"
    try:
        with zipfile.ZipFile("temp_chrome.crx", 'r') as z:
            with z.open('manifest.json') as f:
                manifest = json.load(f)
                version = manifest.get('version', 'unknown')
    except:
        pass
    return {"version": version, "url": url}

if __name__ == "__main__":
    fx = get_firefox_latest("better-roblox-extension")
    ch = get_chrome_latest("lplhnhhlblehjmmkcpjbojiaanbpgnpd")
    
    with open("meta.json", "w") as f:
        json.dump({"firefox": fx, "chrome": ch}, f)
