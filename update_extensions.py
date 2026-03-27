import requests
import os
import json

def get_firefox_versions(addon_slug):
    api_url = f"https://addons.mozilla.org/api/v5/addons/addon/{addon_slug}/versions/"
    data = requests.get(api_url).json()
    versions = []
    for v in data.get('results', []):
        versions.append({
            'id': v['version'],
            'url': v['file']['url'],
            'type': 'firefox'
        })
    return versions

def download_file(url, dest):
    r = requests.get(url)
    with open(dest, 'wb') as f:
        f.write(r.content)

if __name__ == "__main__":
    fx_versions = get_firefox_versions("better-roblox-extension")
    
    chrome_id = "lplhnhhlblehjmmkcpjbojiaanbpgnpd"
    crx_url = f"https://clients2.google.com/service/update2/crx?response=redirect&prodversion=98.0&acceptformat=crx2,crx3&x=id%3D{chrome_id}%26uc"
    
    all_data = {
        "firefox": fx_versions,
        "chrome": [{"id": "latest", "url": crx_url, "type": "chrome"}]
    }
    
    with open("versions.json", "w") as f:
        json.dump(all_data, f)
