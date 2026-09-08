import os
import sys
import json
import time
import yt_dlp

BASE_DIR = r"d:\AI AGENT THUY\AI-video-main\AI-video-main\public\bgm"

TRACKS = [
    # 01. Kể chuyện cảm xúc
    {
        "category_dir": "01_ke_chuyen_cam_xuc",
        "category_name": "Kể chuyện cảm xúc",
        "id": "hotline_bling",
        "title": "Hotline Bling",
        "artist": "Drake",
        "search_query": "Drake Hotline Bling instrumental",
        "filename": "Drake - Hotline Bling (Instrumental).mp3"
    },
    {
        "category_dir": "01_ke_chuyen_cam_xuc",
        "category_name": "Kể chuyện cảm xúc",
        "id": "idea_15",
        "title": "Idea 15",
        "artist": "Gibran Alcocer",
        "search_query": "Gibran Alcocer Idea 15 official audio",
        "filename": "Gibran Alcocer - Idea 15.mp3"
    },
    {
        "category_dir": "01_ke_chuyen_cam_xuc",
        "category_name": "Kể chuyện cảm xúc",
        "id": "dark_red",
        "title": "Dark Red",
        "artist": "Steve Lacy",
        "search_query": "Steve Lacy Dark Red instrumental",
        "filename": "Steve Lacy - Dark Red (Instrumental).mp3"
    },
    {
        "category_dir": "01_ke_chuyen_cam_xuc",
        "category_name": "Kể chuyện cảm xúc",
        "id": "walking_on_a_dream",
        "title": "Walking on a Dream",
        "artist": "Empire of the Sun",
        "search_query": "Empire of the Sun Walking on a Dream instrumental",
        "filename": "Empire of the Sun - Walking on a Dream (Instrumental).mp3"
    },
    {
        "category_dir": "01_ke_chuyen_cam_xuc",
        "category_name": "Kể chuyện cảm xúc",
        "id": "low_key_gliding",
        "title": "Low Key Gliding",
        "artist": "Hal Walker",
        "search_query": "Hal Walker Low Key Gliding original",
        "filename": "Hal Walker - Low Key Gliding.mp3"
    },
    {
        "category_dir": "01_ke_chuyen_cam_xuc",
        "category_name": "Kể chuyện cảm xúc",
        "id": "runaway_kanye",
        "title": "Runaway",
        "artist": "Kanye West",
        "search_query": "Kanye West Runaway piano instrumental intro",
        "filename": "Kanye West - Runaway (Piano Instrumental).mp3"
    },

    # 02. Giáo dục / Chia sẻ kiến thức
    {
        "category_dir": "02_giao_duc_kien_thuc",
        "category_name": "Giáo dục / Chia sẻ kiến thức",
        "id": "not_like_us",
        "title": "Not Like Us",
        "artist": "Kendrick Lamar",
        "search_query": "Kendrick Lamar Not Like Us instrumental official beat",
        "filename": "Kendrick Lamar - Not Like Us (Instrumental).mp3"
    },
    {
        "category_dir": "02_giao_duc_kien_thuc",
        "category_name": "Giáo dục / Chia sẻ kiến thức",
        "id": "money_so_big",
        "title": "Money So Big",
        "artist": "Yeat",
        "search_query": "Yeat Money So Big instrumental official",
        "filename": "Yeat - Money So Big (Instrumental).mp3"
    },
    {
        "category_dir": "02_giao_duc_kien_thuc",
        "category_name": "Giáo dục / Chia sẻ kiến thức",
        "id": "vampire_heart",
        "title": "Vampire Heart",
        "artist": "Yeat feat. Homixide Gang (prod. SANIKWAVE, KEY KELLY)",
        "search_query": "YEAT VAMPIRE HEART feat Homixide Gang instrumental",
        "filename": "Yeat - Vampire Heart (Instrumental).mp3"
    },
    {
        "category_dir": "02_giao_duc_kien_thuc",
        "category_name": "Giáo dục / Chia sẻ kiến thức",
        "id": "like_that",
        "title": "Like That",
        "artist": "Future, Metro Boomin, Kendrick Lamar",
        "search_query": "Future Metro Boomin Like That instrumental official",
        "filename": "Future & Metro Boomin - Like That (Instrumental).mp3"
    },
    {
        "category_dir": "02_giao_duc_kien_thuc",
        "category_name": "Giáo dục / Chia sẻ kiến thức",
        "id": "twenty_min",
        "title": "20 Min",
        "artist": "Lil Uzi Vert",
        "search_query": "Lil Uzi Vert 20 Min instrumental official",
        "filename": "Lil Uzi Vert - 20 Min (Instrumental).mp3"
    },
    {
        "category_dir": "02_giao_duc_kien_thuc",
        "category_name": "Giáo dục / Chia sẻ kiến thức",
        "id": "hell_n_back",
        "title": "Hell N Back",
        "artist": "Bakar",
        "search_query": "Bakar Hell N Back instrumental",
        "filename": "Bakar - Hell N Back (Instrumental).mp3"
    },

    # 03. Vlog / Day In Life
    {
        "category_dir": "03_vlog_day_in_life",
        "category_name": "Vlog / Day in life",
        "id": "i_wanna_be_yours",
        "title": "I Wanna Be Yours",
        "artist": "Arctic Monkeys",
        "search_query": "Arctic Monkeys I Wanna Be Yours instrumental",
        "filename": "Arctic Monkeys - I Wanna Be Yours (Instrumental).mp3"
    },
    {
        "category_dir": "03_vlog_day_in_life",
        "category_name": "Vlog / Day in life",
        "id": "surround_sound",
        "title": "Surround Sound",
        "artist": "JID ft. 21 Savage & Baby Tate",
        "search_query": "JID Surround Sound instrumental",
        "filename": "JID - Surround Sound (Instrumental).mp3"
    },
    {
        "category_dir": "03_vlog_day_in_life",
        "category_name": "Vlog / Day in life",
        "id": "lost",
        "title": "Lost",
        "artist": "Frank Ocean",
        "search_query": "Frank Ocean Lost instrumental official",
        "filename": "Frank Ocean - Lost (Instrumental).mp3"
    },
    {
        "category_dir": "03_vlog_day_in_life",
        "category_name": "Vlog / Day in life",
        "id": "paper_planes",
        "title": "Paper Planes",
        "artist": "M.I.A.",
        "search_query": "MIA Paper Planes instrumental official",
        "filename": "M.I.A. - Paper Planes (Instrumental).mp3"
    },
    {
        "category_dir": "03_vlog_day_in_life",
        "category_name": "Vlog / Day in life",
        "id": "tell_em",
        "title": "Tell Em",
        "artist": "Cochise & $NOT",
        "search_query": "Cochise SNOT Tell Em instrumental",
        "filename": "Cochise & $NOT - Tell Em (Instrumental).mp3"
    },
    {
        "category_dir": "03_vlog_day_in_life",
        "category_name": "Vlog / Day in life",
        "id": "space_cadet",
        "title": "Space Cadet",
        "artist": "Metro Boomin ft. Gunna",
        "search_query": "Metro Boomin Space Cadet instrumental",
        "filename": "Metro Boomin - Space Cadet (Instrumental).mp3"
    },

    # 04. Động Lực, Cảm Xúc
    {
        "category_dir": "04_dong_luc_cam_xuc",
        "category_name": "Động lực, Cảm xúc",
        "id": "thank_you",
        "title": "Thank You",
        "artist": "Dido",
        "search_query": "Dido Thank You instrumental",
        "filename": "Dido - Thank You (Instrumental).mp3"
    },
    {
        "category_dir": "04_dong_luc_cam_xuc",
        "category_name": "Động lực, Cảm xúc",
        "id": "young_folks",
        "title": "Young Folks",
        "artist": "Peter Bjorn and John",
        "search_query": "Peter Bjorn and John Young Folks instrumental",
        "filename": "Peter Bjorn and John - Young Folks (Instrumental).mp3"
    },
    {
        "category_dir": "04_dong_luc_cam_xuc",
        "category_name": "Động lực, Cảm xúc",
        "id": "million_dollar_baby",
        "title": "Million Dollar Baby",
        "artist": "Tommy Richman",
        "search_query": "Tommy Richman Million Dollar Baby instrumental official",
        "filename": "Tommy Richman - Million Dollar Baby (Instrumental).mp3"
    },
    {
        "category_dir": "04_dong_luc_cam_xuc",
        "category_name": "Động lực, Cảm xúc",
        "id": "heart_on_my_sleeve",
        "title": "Heart On My Sleeve",
        "artist": "Ghostwriter977",
        "search_query": "Ghostwriter Heart On My Sleeve Drake Weeknd AI audio",
        "filename": "Ghostwriter - Heart On My Sleeve.mp3"
    },
    {
        "category_dir": "04_dong_luc_cam_xuc",
        "category_name": "Động lực, Cảm xúc",
        "id": "nineteen_o_one",
        "title": "1901",
        "artist": "Phoenix",
        "search_query": "Phoenix 1901 instrumental",
        "filename": "Phoenix - 1901 (Instrumental).mp3"
    },
    {
        "category_dir": "04_dong_luc_cam_xuc",
        "category_name": "Động lực, Cảm xúc",
        "id": "memory_reboot",
        "title": "Memory Reboot",
        "artist": "VOJ & Narvent",
        "search_query": "VOJ Narvent Memory Reboot official audio",
        "filename": "VOJ & Narvent - Memory Reboot.mp3"
    }
]

def download_track(track):
    cat_folder = os.path.join(BASE_DIR, track["category_dir"])
    os.makedirs(cat_folder, exist_ok=True)
    out_path = os.path.join(cat_folder, track["filename"])
    
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100000:
        print(f"[ALREADY EXISTS] {track['title']} -> {out_path} ({os.path.getsize(out_path):,} bytes)")
        track["status"] = "success"
        track["filepath"] = out_path
        track["relative_path"] = f"bgm/{track['category_dir']}/{track['filename']}"
        track["filesize"] = os.path.getsize(out_path)
        return True

    temp_base = os.path.join(cat_folder, f"temp_{track['id']}")
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': temp_base + '.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'default_search': 'ytsearch1',
    }

    query = f"ytsearch1:{track['search_query']}"
    print(f"[DOWNLOADING] {track['title']} ({track['artist']})... Query: {track['search_query']}")
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(query, download=True)
            if 'entries' in info and len(info['entries']) > 0:
                first_entry = info['entries'][0]
                track["source_title"] = first_entry.get("title")
                track["source_url"] = first_entry.get("webpage_url")
                track["duration"] = first_entry.get("duration")

        expected_mp3 = temp_base + ".mp3"
        if os.path.exists(expected_mp3):
            if os.path.exists(out_path):
                os.remove(out_path)
            os.rename(expected_mp3, out_path)
            print(f"  [OK] Saved to: {out_path} ({os.path.getsize(out_path):,} bytes)")
            track["status"] = "success"
            track["filepath"] = out_path
            track["relative_path"] = f"bgm/{track['category_dir']}/{track['filename']}"
            track["filesize"] = os.path.getsize(out_path)
            return True
        else:
            print(f"  [FAIL] Expected file not found: {expected_mp3}")
            track["status"] = "failed"
            return False
    except Exception as e:
        print(f"  [ERROR] {track['title']}: {e}")
        track["status"] = "error"
        track["error_msg"] = str(e)
        return False

def main():
    print(f"Starting BGM download for {len(TRACKS)} tracks...")
    results = []
    for i, track in enumerate(TRACKS, 1):
        print(f"\n--- [{i}/{len(TRACKS)}] Category: {track['category_name']} ---")
        ok = download_track(track)
        results.append(track)
        time.sleep(1)

    # Save metadata.json in base dir
    meta_path = os.path.join(BASE_DIR, "metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n[DONE] Metadata saved to {meta_path}")

if __name__ == "__main__":
    main()
