import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out'
PUBLIC = ROOT / 'public'

def build_edl():
    transcript = json.load(open(OUT / 'transcript.json', encoding='utf-8'))
    words = transcript['words']
    
    # Unroll any multi-word entries so tokens match text.split() 1:1
    unrolled_words = []
    for w in words:
        parts = w['text'].split()
        if len(parts) > 1:
            dur = (w['endMs'] - w['startMs']) / len(parts)
            for j, p in enumerate(parts):
                unrolled_words.append({
                    'text': p,
                    'startMs': int(w['startMs'] + j * dur),
                    'endMs': int(w['startMs'] + (j + 1) * dur),
                })
        else:
            unrolled_words.append(w)
            
    words = unrolled_words
    total_sec = transcript.get('durationSec', round(words[-1]['endMs'] / 1000.0, 2))

    captions = []
    i = 0
    while i < len(words):
        chunk_words = []
        cur_chars = 0
        while i < len(words) and len(chunk_words) < 5:
            w_len = len(words[i]['text'])
            if chunk_words and (cur_chars + 1 + w_len) > 28:
                break
            chunk_words.append(words[i])
            cur_chars += (1 if chunk_words else 0) + w_len
            i += 1

        if not chunk_words:
            chunk_words.append(words[i])
            i += 1

        text = ' '.join(w['text'] for w in chunk_words)
        tokens = [
            {'text': w['text'], 'fromMs': w['startMs'], 'toMs': w['endMs']}
            for w in chunk_words
        ]
        captions.append({
            'text': text,
            'startMs': chunk_words[0]['startMs'],
            'endMs': chunk_words[-1]['endMs'],
            'tokens': tokens,
            'keywordIdx': 0 if len(tokens) > 0 else -1,
            'headlineStyle': 'normal'
        })

    graphics = [
        {
            'type': 'stat-punch',
            'startMs': 200,
            'endMs': 3600,
            'header': 'LƯU Ý QUAN TRỌNG',
            'keyword': '4 ĐIỀU CẦN KIỂM TRA',
            'sub': 'Trước khi quyết định mua đất',
            'value': 4,
            'keywordStartMs': 620,
            'anchor': 'top'
        },
        {
            'type': '3-tier',
            'startMs': 15800,
            'endMs': 25500,
            'header': 'YẾU TỐ 1',
            'keyword': 'ĐƯỜNG VÀO LÔ ĐẤT',
            'sub': 'Ô tô tận nơi & không ngập lầy',
            'keywordStartMs': 17180,
            'anchor': 'top'
        },
        {
            'type': '3-tier',
            'startMs': 27000,
            'endMs': 36500,
            'header': 'YẾU TỐ 2',
            'keyword': 'MÔI TRƯỜNG XUNG QUANH',
            'sub': 'Dân cư & điện đường trường trạm',
            'keywordStartMs': 28360,
            'anchor': 'top'
        },
        {
            'type': '3-tier',
            'startMs': 37600,
            'endMs': 46800,
            'header': 'YẾU TỐ 3',
            'keyword': 'PHÁP LÝ THỰC TẾ',
            'sub': 'Khớp giấy tờ vị trí & ranh giới',
            'keywordStartMs': 38200,
            'anchor': 'top'
        },
        {
            'type': 'stat-punch',
            'startMs': 47500,
            'endMs': 58500,
            'header': 'YẾU TỐ 4',
            'keyword': 'GIAO DỊCH 6 THÁNG QUA',
            'sub': 'Thanh khoản & giá chốt thực tế',
            'value': 6,
            'suffix': 'tháng',
            'keywordStartMs': 52740,
            'anchor': 'top'
        },
        {
            'type': 'asymmetric-trio',
            'startMs': 61000,
            'endMs': 71000,
            'header': 'GIÁ TRỊ CỐT LÕI',
            'keyword': 'NHU CẦU THỰC TẾ',
            'sub': 'Dễ sử dụng & dễ thanh khoản',
            'keywordStartMs': 64500,
            'anchor': 'top'
        },
        {
            'type': 'cta',
            'startMs': 72000,
            'endMs': int(total_sec * 1000),
            'text': 'FOLLOW QUYỀN SANG',
            'sub': 'Kinh nghiệm BĐS thực tế',
            'keywordStartMs': 72300,
            'anchor': 'top'
        }
    ]

    # Brand new CapCut transitions (phone-reveal, paper-ball, comic-cut) aligned to scene cuts
    transitions = [
        {
            'type': 'phone-reveal',
            'startMs': 18150,
            'endMs': 18883,
            'direction': 'right',
            'intensity': 1,
            'colorRole': 'accent'
        },
        {
            'type': 'paper-ball',
            'startMs': 29200,
            'endMs': 29867,
            'direction': 'right',
            'intensity': 1,
            'colorRole': 'highlight'
        },
        {
            'type': 'comic-cut',
            'startMs': 39700,
            'endMs': 40367,
            'direction': 'right',
            'intensity': 1,
            'colorRole': 'accent2'
        },
        {
            'type': 'phone-reveal',
            'startMs': 61700,
            'endMs': 62433,
            'direction': 'right',
            'intensity': 1,
            'colorRole': 'accent'
        },
        {
            'type': 'paper-ball',
            'startMs': 71700,
            'endMs': 72367,
            'direction': 'right',
            'intensity': 1,
            'colorRole': 'highlight'
        }
    ]

    # Fresh SFX with strict volume ratios & anti-bleed matching transitions
    sfx = [
        {'startMs': 200, 'sound': 'kobe-woosh', 'volume': 0.55, 'preRollMs': 65},
        {'startMs': 620, 'sound': 'chime-ding', 'volume': 0.65, 'preRollMs': 65},
        {'startMs': 17180, 'sound': 'pop-soft', 'volume': 0.55, 'preRollMs': 65},
        {'startMs': 18150, 'sound': 'phone-shutter-1', 'volume': 0.65, 'preRollMs': 65},
        {'startMs': 28360, 'sound': 'tech-notification', 'volume': 0.55, 'preRollMs': 65},
        {'startMs': 29200, 'sound': 'paper-ball-yt', 'volume': 0.65, 'preRollMs': 65},
        {'startMs': 38200, 'sound': 'game-correct', 'volume': 0.65, 'preRollMs': 65},
        {'startMs': 39700, 'sound': 'comic-paper-tear', 'volume': 0.65, 'preRollMs': 65},
        {'startMs': 52740, 'sound': 'sparkle', 'volume': 0.60, 'preRollMs': 65},
        {'startMs': 61700, 'sound': 'phone-shutter-1', 'volume': 0.65, 'preRollMs': 65},
        {'startMs': 64500, 'sound': 'pop-soft', 'volume': 0.55, 'preRollMs': 65},
        {'startMs': 71700, 'sound': 'paper-ball-yt', 'volume': 0.65, 'preRollMs': 65},
        {'startMs': 72300, 'sound': 'bell-bright', 'volume': 0.65, 'preRollMs': 65}
    ]

    brolls = []
    broll_specs = [
        ('gemini_videos/broll_01.mp4', 18500, 25500, 'SUV driving smoothly on clean suburban road in Vietnam'),
        ('gemini_videos/broll_02.mp4', 29500, 36500, 'Aerial view of bustling Vietnamese suburban residential neighborhood'),
        ('gemini_videos/broll_03.mp4', 40000, 46500, 'Inspecting land title certificate against boundary stone in Vietnam countryside'),
        ('gemini_videos/broll_04.mp4', 62000, 70000, 'Vietnamese young family happily touring a residential land plot with consultant')
    ]
    for rel_path, s_ms, e_ms, prompt in broll_specs:
        b_item = {'startMs': s_ms, 'endMs': e_ms, 'prompt': prompt}
        if (PUBLIC / rel_path).exists():
            b_item['src'] = rel_path
        brolls.append(b_item)

    zooms = [
        {'type': 'punch-in', 'startMs': 0, 'endMs': 2800, 'scale': 1.08},
        {'type': 'punch-in', 'startMs': 11500, 'endMs': 15000, 'scale': 1.10},
        {'type': 'punch-in', 'startMs': 27000, 'endMs': 29500, 'scale': 1.08},
        {'type': 'punch-in', 'startMs': 47500, 'endMs': 52000, 'scale': 1.10},
        {'type': 'punch-in', 'startMs': 72000, 'endMs': 76000, 'scale': 1.08}
    ]

    edl = {
        'source': {
            'clip': 'raw/clip_goc-tight.mp4',
            'durationSec': total_sec,
            'volume': 1.35
        },
        'format': {
            'w': 1080,
            'h': 1920,
            'fps': 30
        },
        'style': {
            'captionColor': '#FFFFFF',
            'highlightColor': '#FFE600',
            'accent': '#F59E0B',
            'accent2': '#FBBF24',
            'baseScale': 1,
            'baseShiftYPct': 0,
            'maskBandTopPct': 0,
            'maskBandHeightPct': 0,
            'ambient': 'none',
            'recipe': {
                'surface': 'solid-tint',
                'blurPx': 0,
                'shadowMode': 'hard',
                'borderIntensity': 0.0,
                'cardRadius': 20,
                'captionStrokePx': 0,
                'captionBottomPct': 20,
                'motionVoice': 'energetic',
                'glassOpacity': 0.0,
                'textScale': 1.0,
                'entryAnimFamily': 'spring',
                'textFx': 'solid',
                'captionCase': 'sentence',
                'accent': '#F59E0B',
                'accent2': '#FBBF24',
                'highlightColor': '#FFE600',
                'captionColor': '#FFFFFF',
                'scrimAlpha': 0.0,
                'captionStyle': 'summary',
                'preset': 'thuy-style-nhieu-canh'
            }
        },
        'music': {
            'src': 'bgm/02_giao_duc_kien_thuc/Bakar - Hell N Back (Instrumental).mp3',
            'volume': 0.081,
            'clipVolume': 1.35,
            'loop': True,
            'startSec': 0.0,
            'fadeOutSec': 2.0
        },
        'tracks': {
            'captions': captions,
            'graphics': graphics,
            'transitions': transitions,
            'sfx': sfx,
            'broll': brolls,
            'effects': zooms
        }
    }

    out_file = OUT / 'edl.json'
    out_file.write_text(json.dumps(edl, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Generated fresh Thuy-style EDL -> {out_file}')
    print(f'  total_sec={total_sec:.2f}s, captions={len(captions)}, graphics={len(graphics)}, transitions={len(transitions)}, sfx={len(sfx)}, broll={len(brolls)}')

if __name__ == '__main__':
    build_edl()
