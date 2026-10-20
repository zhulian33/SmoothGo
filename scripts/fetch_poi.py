"""Harvest Amap POI rows for the SmoothGo place library.

This drives the *browser* PlaceSearch plugin, so it needs a page where the Amap
JS API is already loaded (the local preview is enough) and the `agent-browser`
CLI on PATH:

    python3 server/app.py &
    agent-browser open "http://127.0.0.1:8080/#map"
    python3 scripts/fetch_poi.py
    python3 scripts/build_places.py
    agent-browser close

Output: scripts/poi_raw.json (raw Amap rows, one entry per keyword/page).

Why the browser instead of restapi.amap.com: the JS key already works locally,
whereas the Web-service key has to be applied for separately.

Two kinds of keyword matter here, and mixing them is the whole point:

* Generic category words ("火锅", "公园") return the top-ranked few hundred
  places for that category -- broad coverage, but chains collapse to one store.
* Brand / proper-noun words ("700cc", "老昌春饼") return *every* branch of that
  brand in the city. A city like Changchun has dozens of local chains that the
  generic words never surface, so without the brand list the library looks
  suspiciously thin -- and a chain shows up as a single pin.
"""

import json
import subprocess
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent / "poi_raw.json"

CITY = "长春"
PAGES = 3

GROUPS = [
    (
        "景点-品类",
        [
            "风景名胜", "公园", "博物馆", "纪念馆", "寺庙", "温泉", "滑雪场",
            "游乐园", "图书馆", "美术馆", "剧院", "历史遗迹", "动物园",
            "植物园", "广场", "故居", "冰雪乐园", "湿地公园",
        ],
    ),
    (
        "景点-长春特色",
        [
            "净月潭", "伪满皇宫", "长影", "长春世界雕塑园", "南湖公园",
            "莲花山", "天定山", "庙香山", "冰雪新天地", "吉林省博物院",
            "长春动植物园", "般若寺", "长春文庙", "农博园", "北湖湿地",
            "地质宫", "伪满八大部", "长春水文化生态园",
        ],
    ),
    (
        "美食-品类",
        [
            "东北菜", "火锅", "烧烤", "烤肉", "朝鲜族料理", "小吃", "面馆",
            "咖啡厅", "甜品", "海鲜", "川菜", "日本料理", "快餐", "自助餐",
            "酒吧", "烘焙", "茶饮", "奶茶",
        ],
    ),
    (
        "美食-长春连锁与老字号",
        [
            "700cc", "老昌春饼", "王记酱骨", "福义德", "杨麻子", "东方肉馆",
            "元盛居", "老白肉馆", "韩庄", "金达莱", "天宝鹿园", "向阳屯",
            "老韩头", "回宝珍", "鼎丰真", "鼎盛园", "老李头", "朝鲜族饭店",
            "熏肉大饼", "杀猪菜", "锅包肉", "血肠", "麻辣烫", "烤冷面",
            "桂林路小吃", "红旗街美食", "重庆路小吃", "长春老字号",
        ],
    ),
]

JS_TEMPLATE = """(async()=>{const s=new AMap.PlaceSearch({pageSize:20,pageIndex:1,city:%s,citylimit:true,extensions:"all"});const kws=%s;const out={};for(const kw of kws){for(let p=1;p<=%d;p++){out[kw+"#"+p]=await new Promise(r=>{s.setPageIndex(p);s.search(kw,(st,res)=>{r(st==="complete"?(res.poiList&&res.poiList.pois||[]).map(x=>({id:x.id,name:x.name,type:x.type,address:x.address,tel:x.tel,loc:String(x.location),ad:x.adname,photos:(x.photos||[]).map(ph=>ph.url).slice(0,3),rating:x.rating||null,openTime:x.opentime2||null,website:x.website||null})):[])})})}}return JSON.stringify(out)})()"""


def run_eval(js, timeout=600):
    proc = subprocess.run(
        ["agent-browser", "eval", js], capture_output=True, text=True, timeout=timeout
    )
    raw = (proc.stdout or "") + (proc.stderr or "")
    best = ""
    for line in raw.splitlines():
        line = line.strip()
        if line.startswith('"') and len(line) > len(best):
            best = line
    if not best:
        raise RuntimeError("no JSON in agent-browser output:\n" + raw[:500])
    return json.loads(json.loads(best))


def main():
    merged = {}
    for name, keywords in GROUPS:
        # Run keyword batches so a single browser call cannot time out.
        bucket = {}
        for start in range(0, len(keywords), 6):
            batch = keywords[start:start + 6]
            js = JS_TEMPLATE % (
                json.dumps(CITY, ensure_ascii=False),
                json.dumps(batch, ensure_ascii=False),
                PAGES,
            )
            try:
                data = run_eval(js)
            except Exception as exc:
                print(f"{name} batch {start} failed: {exc}", file=sys.stderr)
                continue
            bucket.update(data)
            rows = sum(len(v) for v in data.values())
            print(f"{name} [{start}:{start + len(batch)}] -> {rows} rows", file=sys.stderr)
        merged[name] = bucket
        total = sum(len(v) for v in bucket.values())
        print(f"{name}: {total} rows", file=sys.stderr)
    OUT.write_text(json.dumps(merged, ensure_ascii=False), encoding="utf-8")
    print(f"written {OUT}")


if __name__ == "__main__":
    main()
