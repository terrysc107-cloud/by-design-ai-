from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math, json, shutil, zipfile

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'source-svg'; SOCIAL=ROOT/'exports'/'social'; VIDEO=ROOT/'exports'/'video'; LOGOS=ROOT/'exports'/'logos'; PREV=ROOT/'previews'
for p in (SRC,SOCIAL,VIDEO,LOGOS,PREV): p.mkdir(parents=True,exist_ok=True)
INK='#09111F'; BLUE='#2878FF'; CYAN='#73D7F3'; PAPER='#F7F9FC'; WHITE='#FFFFFF'; SILVER='#E3EAF3'; SLATE='#526071'
FONT_REG='/System/Library/Fonts/Supplemental/Arial.ttf'; FONT_BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'

def font(size,bold=False): return ImageFont.truetype(FONT_BOLD if bold else FONT_REG,size)
def hexrgb(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def rounded_gradient(size, c1=WHITE, c2=PAPER):
    w,h=size; im=Image.new('RGB',size); px=im.load(); a=hexrgb(c1); b=hexrgb(c2)
    for y in range(h):
        t=y/max(1,h-1)
        col=tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3))
        for x in range(w): px[x,y]=col
    return im

def draw_mark(im, box, dark=True, radius=None):
    d=ImageDraw.Draw(im); x,y,s=box; r=radius or int(s*.28); bg=INK if dark else WHITE
    d.rounded_rectangle((x,y,x+s,y+s),radius=r,fill=bg,outline=SILVER if not dark else None,width=max(1,s//100))
    pts=[(x+s*.19,y+s*.53),(x+s*.30,y+s*.53),(x+s*.36,y+s*.34),(x+s*.47,y+s*.73),(x+s*.56,y+s*.25),(x+s*.65,y+s*.63),(x+s*.72,y+s*.43),(x+s*.79,y+s*.53),(x+s*.84,y+s*.53)]
    d.line(pts,fill=CYAN if dark else BLUE,width=max(3,int(s*.062)),joint='curve')

def signal(d,w,h,y,alpha=255,width=None):
    width=width or max(3,w//350); pts=[]
    for x in range(-20,w+21,4):
        t=x/w; yy=y + math.sin(t*math.pi*4.4)*h*.028 + math.sin(t*math.pi*10.2)*h*.012
        pts.append((x,yy))
    d.line(pts,fill=hexrgb(BLUE)+(alpha,) if d._image.mode=='RGBA' else BLUE,width=width)
    for x in [int(w*.2),int(w*.5),int(w*.78)]: d.ellipse((x-width*2,y-width*2,x+width*2,y+width*2),fill=CYAN)

def fit_text(d,text,max_width,start,bold=True):
    s=start
    while s>12 and d.textbbox((0,0),text,font=font(s,bold))[2]>max_width: s-=1
    return font(s,bold)

def banner(name,size,headline,sub='',safe=None,dark=False):
    w,h=size; im=Image.new('RGB',size,INK) if dark else rounded_gradient(size)
    d=ImageDraw.Draw(im); pad=max(32,int(w*.055)); mark_s=max(52,int(h*.16)); draw_mark(im,(pad,pad,mark_s),True)
    d.text((pad+mark_s+int(mark_s*.28),pad+mark_s*.12),'aixdesign',font=font(int(mark_s*.43),True),fill=WHITE if dark else INK)
    signal(d,w,h,int(h*.68),150,max(2,w//600))
    maxw=int(w*.62); f=fit_text(d,headline,maxw,int(h*.18),True); y=int(h*.38)
    d.text((pad,y),headline,font=f,fill=WHITE if dark else INK)
    if sub: d.text((pad,y+f.size*1.25),sub,font=font(max(14,int(h*.045))),fill=CYAN if dark else SLATE)
    if h >= 350:
        process='INPUT  →  CONTEXT  →  ACTION  →  RESULT'; pf=font(max(12,int(h*.028)),True)
        pw=d.textbbox((0,0),process,font=pf)[2]
        d.text((w-pad-pw,h-pad-int(h*.06)),process,font=pf,fill=CYAN if dark else BLUE)
    im.save(SOCIAL/name)
    if safe:
        guide=im.copy(); gd=ImageDraw.Draw(guide); sx,sy,sw,sh=safe; gd.rectangle((sx,sy,sx+sw,sy+sh),outline='#FF3B30',width=max(2,w//500)); gd.text((sx+8,sy+8),'SAFE AREA',font=font(max(12,h//35),True),fill='#FF3B30'); guide.save(PREV/(Path(name).stem+'-safe-area.png'))

def social_card(name,size,headline,kicker='AI BY DESIGN',dark=False):
    w,h=size; im=Image.new('RGB',size,INK) if dark else rounded_gradient(size); d=ImageDraw.Draw(im); p=int(w*.075)
    draw_mark(im,(p,p,int(w*.09)),True); d.text((p+int(w*.115),p+int(w*.018)),'aixdesign',font=font(int(w*.038),True),fill=WHITE if dark else INK)
    d.text((p,int(h*.40)),kicker,font=font(int(w*.022),True),fill=CYAN if dark else BLUE)
    f=fit_text(d,headline,int(w*.82),int(w*.085),True); d.multiline_text((p,int(h*.47)),headline,font=f,fill=WHITE if dark else INK,spacing=int(f.size*.14))
    signal(d,w,h,int(h*.84),150,max(3,w//350)); d.text((p,int(h*.91)),'aixdesign.dev',font=font(int(w*.022),True),fill=CYAN if dark else SLATE)
    im.save(SOCIAL/name)

def video_overlay(name,size,vertical=False):
    w,h=size; im=Image.new('RGBA',size,(0,0,0,0)); d=ImageDraw.Draw(im); p=int(min(w,h)*.055)
    # subtle frame corners
    col=hexrgb(CYAN)+(180,); L=int(min(w,h)*.08); wd=max(3,min(w,h)//360)
    for x1,y1,sx,sy in [(p,p,1,1),(w-p,p,-1,1),(p,h-p,1,-1),(w-p,h-p,-1,-1)]:
        d.line((x1,y1,x1+sx*L,y1),fill=col,width=wd); d.line((x1,y1,x1,y1+sy*L),fill=col,width=wd)
    draw_mark(im,(p,p,int(min(w,h)*.07)),True)
    d.text((p+int(min(w,h)*.09),p+int(min(w,h)*.013)),'aixdesign',font=font(int(min(w,h)*.032),True),fill=WHITE)
    d.text((p,h-p-int(min(w,h)*.055)),'SIGNAL INTO ACTION',font=font(int(min(w,h)*.02),True),fill=WHITE)
    # gradient lower-third
    y=int(h*.72); d.rounded_rectangle((p,y,w-p,y+int(h*.12)),radius=int(min(w,h)*.018),fill=(9,17,31,205),outline=(115,215,243,120),width=wd)
    d.text((p+int(w*.025),y+int(h*.018)),'TITLE / SPEAKER NAME',font=font(int(min(w,h)*.034),True),fill=WHITE)
    d.text((p+int(w*.025),y+int(h*.066)),'Role, topic, or supporting context',font=font(int(min(w,h)*.021)),fill=CYAN)
    im.save(VIDEO/name)

def end_card(name,size):
    w,h=size; im=Image.new('RGB',size,INK); d=ImageDraw.Draw(im); s=int(min(w,h)*.18); draw_mark(im,(w//2-s//2,int(h*.22),s),True)
    title='Stop learning about AI.\nStart running on it.'; f=font(int(min(w,h)*(.082 if h>w else .065)),True); box=d.multiline_textbbox((0,0),title,font=f,align='center',spacing=int(f.size*.22)); tw=box[2]
    d.multiline_text(((w-tw)//2,int(h*.48)),title,font=f,fill=WHITE,align='center',spacing=int(f.size*.22)); signal(d,w,h,int(h*.80),210,max(3,w//500)); d.text((w//2,int(h*.88)),'AIXDESIGN.DEV',font=font(int(min(w,h)*.024),True),fill=CYAN,anchor='mm'); im.save(VIDEO/name)

# Master SVG assets
mark_svg='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#09111F"/><path d="M12 34h7l4-12 7 25 6-32 6 25 4-12 4 6h4" fill="none" stroke="#73D7F3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'''
word_svg='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 96"><rect x="4" y="4" width="88" height="88" rx="25" fill="#09111F"/><path d="M21 51h10l6-17 10 36 9-46 9 36 6-17 6 8h8" fill="none" stroke="#73D7F3" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="116" y="63" fill="#09111F" font-family="Arial, Helvetica, sans-serif" font-size="49" font-weight="700" letter-spacing="-2">aixdesign</text></svg>'''
(SRC/'aixdesign-mark.svg').write_text(mark_svg); (SRC/'aixdesign-wordmark.svg').write_text(word_svg)

# Logo exports
for s in (1024,512,400,256):
    im=Image.new('RGB',(s,s),PAPER); draw_mark(im,(int(s*.12),int(s*.12),int(s*.76)),True); im.save(LOGOS/f'aixdesign-profile-{s}.png')
    tr=Image.new('RGBA',(s,s),(0,0,0,0)); draw_mark(tr,(int(s*.12),int(s*.12),int(s*.76)),True); tr.save(LOGOS/f'aixdesign-mark-transparent-{s}.png')
# wordmark raster
im=Image.new('RGBA',(1680,384),(0,0,0,0)); draw_mark(im,(16,16,352),True); ImageDraw.Draw(im).text((460,104),'aixdesign',font=font(190,True),fill=INK); im.save(LOGOS/'aixdesign-wordmark-transparent.png')

# Platform banners
# LinkedIn company banner uses a dedicated shallow-format composition.
im=rounded_gradient((1128,191)); d=ImageDraw.Draw(im); draw_mark(im,(42,40,54),True)
d.text((112,48),'aixdesign',font=font(26,True),fill=INK)
d.text((355,43),'Turn AI into operating leverage.',font=font(34,True),fill=INK)
d.text((356,91),'Coaching · Consulting · Custom Systems',font=font(16),fill=SLATE)
signal(d,1128,191,151,170,3); im.save(SOCIAL/'linkedin-company-1128x191.png')
banner('linkedin-personal-1584x396.png',(1584,396),'Stop learning about AI. Start running on it.','Practical systems for operators, founders, and small teams.')
banner('x-header-1500x500.png',(1500,500),'From AI ideas to operating systems.','aixdesign.dev',dark=True)
# YouTube: essential content lives inside the 1546×423 cross-device safe area.
im=Image.new('RGB',(2560,1440),INK); d=ImageDraw.Draw(im); sx,sy,sw,sh=(507,508,1546,423)
draw_mark(im,(sx+34,sy+48,118),True); d.text((sx+180,sy+71),'aixdesign',font=font(58,True),fill=WHITE)
d.text((sx+34,sy+206),'Design the system. Ship the result.',font=fit_text(d,'Design the system. Ship the result.',sw-68,94,True),fill=WHITE)
d.text((sx+34,sy+330),'AI coaching · consulting · custom systems',font=font(31),fill=CYAN); signal(d,2560,1440,1040,150,6)
im.save(SOCIAL/'youtube-banner-2560x1440.png'); guide=im.copy(); gd=ImageDraw.Draw(guide); gd.rectangle((sx,sy,sx+sw,sy+sh),outline='#FF3B30',width=6); gd.text((sx+12,sy+10),'SAFE AREA',font=font(28,True),fill='#FF3B30'); guide.save(PREV/'youtube-banner-2560x1440-safe-area.png')
banner('facebook-cover-1640x624.png',(1640,624),'Turn friction into a system.','AI by Design')
# social templates
social_card('instagram-square-light-1080x1080.png',(1080,1080),'Your headline\ngoes here.')
social_card('instagram-square-dark-1080x1080.png',(1080,1080),'Your headline\ngoes here.',dark=True)
social_card('instagram-portrait-1080x1350.png',(1080,1350),'One strong idea.\nDesigned to move.',dark=True)
social_card('story-reel-cover-1080x1920.png',(1080,1920),'From signal\nto action.')
social_card('youtube-thumbnail-1280x720.png',(1280,720),'BUILD THE\nSYSTEM',dark=True)
# Video overlays and cards
for size,label in [((1920,1080),'horizontal-1920x1080'),((1080,1920),'vertical-1080x1920'),((1080,1080),'square-1080x1080')]:
    video_overlay(f'frame-lower-third-{label}.png',size)
    end_card(f'end-card-{label}.png',size)
# watermark bugs
for size in (256,512):
    im=Image.new('RGBA',(size,size),(0,0,0,0)); draw_mark(im,(int(size*.12),int(size*.12),int(size*.76)),True); im.save(VIDEO/f'watermark-bug-{size}.png')

# Contact sheet
files=list(SOCIAL.glob('*.png'))+list(VIDEO.glob('*.png'))
thumbs=[]
for f in files:
    raw=Image.open(f)
    if raw.mode=='RGBA':
        bg=Image.new('RGB',raw.size,WHITE); bd=ImageDraw.Draw(bg); tile=max(16,min(raw.size)//24)
        for yy in range(0,raw.height,tile):
            for xx in range(0,raw.width,tile):
                if (xx//tile+yy//tile)%2: bd.rectangle((xx,yy,xx+tile,yy+tile),fill='#DDE3EA')
        bg.paste(raw,mask=raw.getchannel('A')); im=bg
    else: im=raw.convert('RGB')
    im.thumbnail((360,220)); card=Image.new('RGB',(390,270),'white'); card.paste(im,((390-im.width)//2,10)); ImageDraw.Draw(card).text((15,238),f.name,font=font(14,True),fill=INK); thumbs.append(card)
cols=3; rows=math.ceil(len(thumbs)/cols); sheet=Image.new('RGB',(cols*390,rows*270),PAPER)
for i,t in enumerate(thumbs): sheet.paste(t,((i%cols)*390,(i//cols)*270))
sheet.save(PREV/'brand-kit-contact-sheet.jpg',quality=92)

manifest={'palette':{'ink':INK,'electric_blue':BLUE,'signal_cyan':CYAN,'paper':PAPER,'silver':SILVER,'slate':SLATE,'white':WHITE},'social_exports':[f.name for f in SOCIAL.glob('*')],'video_exports':[f.name for f in VIDEO.glob('*')],'logo_exports':[f.name for f in LOGOS.glob('*')]}
(ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps({'social':len(manifest['social_exports']),'video':len(manifest['video_exports']),'logos':len(manifest['logo_exports']),'contact_sheet':str(PREV/'brand-kit-contact-sheet.jpg')},indent=2))
